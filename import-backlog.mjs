#!/usr/bin/env node
// ============================================================
// MEUX LAB - Creates GitHub Issues from backlog.json (one per RF)
//
// Requires: Node 18+, GitHub CLI (`gh`) authenticated (`gh auth login`).
// To also add each Issue to a GitHub Project (v2), your token needs the
// "project" scope (not just "read:project"):
//   gh auth refresh -h github.com -s project
// The script checks this BEFORE creating anything.
//
// It is safe to run again: Issues whose title already starts with
// "[RFxxxx]" are skipped.
//
// Examples:
//   node import-backlog.mjs --repo USER/meux-lab --dry-run --limit 3
//   node import-backlog.mjs --repo USER/meux-lab --ids RF0008
//   node import-backlog.mjs --repo USER/meux-lab --epic 1 --moscow must-have
//   node import-backlog.mjs --repo USER/meux-lab --project "MEUX LAB Backlog"
// ============================================================

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ---------- Arguments ----------
const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const flag = (name) => args.includes(`--${name}`);

const repo = opt('repo');
const dataFile = opt('data') ?? './backlog.json';
const epic = opt('epic');
const moscow = opt('moscow');
const ids = opt('ids')?.split(',').map((s) => s.trim().toUpperCase());
const limit = opt('limit') ? Number(opt('limit')) : Infinity;
const project = opt('project');
const delayMs = opt('delay') ? Number(opt('delay')) : 2000;
const dryRun = flag('dry-run');

if (!repo) {
  console.error('Missing --repo USER/REPO');
  process.exit(1);
}

// ---------- Helpers ----------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const gh = (ghArgs) =>
  execFileSync('gh', ghArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const titleOf = (item) => `[${item.id}] ${item.name}`;

const bodyOf = (item) =>
  [
    '## Requirement',
    `**${item.id} — ${item.name}**`,
    '',
    item.statement,
    '',
    '## Description',
    ...item.description,
    '',
    '## Classification',
    `- **Epic:** ${item.epic}`,
    `- **Actors:** ${item.actors}`,
    `- **MoSCoW:** ${item.moscow}`,
    `- **Priority:** ${item.priority || 'N/A'} · **Difficulty:** ${item.difficulty || 'N/A'}`,
    `- **Phase / Version:** ${item.phase} / ${item.version}`,
    `- **Related NFRs:** ${item.rnf || 'None'}`,
    `- **Source:** ${item.source}`,
    '',
    '## User story',
    '_Pending: write the "As a … I want … So that …" sentence when this card moves to Sprint Backlog._',
    '',
    '## Acceptance criteria',
    '_Pending refinement when this card moves to Sprint Backlog. Minimum for every card:_',
    '',
    '- [ ] The behavior described in the requirement works as specified',
    '- [ ] All related NFRs are met',
    '- [ ] The Definition of Done in CONTRIBUTING.md is satisfied',
    '',
  ].join('\n');

// ---------- Pre-flight: project and token scope (fail fast) ----------
const owner = repo.split('/')[0];
let projectNumber;
if (project && !dryRun) {
  const projects = JSON.parse(
    gh(['project', 'list', '--owner', owner, '--limit', '100', '--format', 'json']),
  ).projects;
  const found = projects.find((p) => p.title === project);
  if (!found) {
    console.error(`Project "${project}" not found for owner ${owner}.`);
    console.error(`Available: ${projects.map((p) => `"${p.title}"`).join(', ') || '(none)'}`);
    process.exit(1);
  }
  projectNumber = String(found.number);

  const header = gh(['api', '-i', '/user']).match(/^x-oauth-scopes:\s*(.*)$/im);
  if (header) {
    const scopes = header[1].split(',').map((x) => x.trim());
    if (!scopes.includes('project')) {
      console.error(`Your token has these scopes: ${scopes.join(', ')}`);
      console.error('It is missing "project" (write access to Projects).');
      console.error('Run: gh auth refresh -h github.com -s project');
      process.exit(1);
    }
  }
}

// ---------- Select items ----------
let items = JSON.parse(readFileSync(dataFile, 'utf8'));
if (epic) items = items.filter((i) => String(i.epicNum) === String(epic));
if (moscow) items = items.filter((i) => i.labels.includes(`moscow:${moscow}`));
if (ids) items = items.filter((i) => ids.includes(i.id));

// ---------- Skip what already exists ----------
let existing = new Set();
if (!dryRun) {
  const listed = JSON.parse(
    gh(['issue', 'list', '--repo', repo, '--state', 'all', '--limit', '1000', '--json', 'title']),
  );
  existing = new Set(
    listed.map((i) => i.title.match(/^\[(RF\d+)\]/)?.[1]).filter(Boolean),
  );
}
const pending = items.filter((i) => !existing.has(i.id)).slice(0, limit);

console.log(
  `${items.length} matching, ${items.length - items.filter((i) => !existing.has(i.id)).length} already exist, ${pending.length} to create${dryRun ? ' (dry run)' : ''}.`,
);

// ---------- Create ----------
const tmp = mkdtempSync(join(tmpdir(), 'meux-'));
let created = 0;
try {
  for (const item of pending) {
    const title = titleOf(item);
    if (dryRun) {
      console.log(`\n--- ${title}\nlabels: ${item.labels.join(', ')}\n${bodyOf(item)}`);
      continue;
    }
    const bodyFile = join(tmp, `${item.id}.md`);
    writeFileSync(bodyFile, bodyOf(item), 'utf8');
    const createArgs = ['issue', 'create', '--repo', repo, '--title', title, '--body-file', bodyFile];
    for (const label of item.labels) createArgs.push('--label', label);
    try {
      const url = gh(createArgs).trim();
      created += 1;
      console.log(`created ${title} -> ${url}`);
      if (projectNumber) {
        try {
          gh(['project', 'item-add', projectNumber, '--owner', owner, '--url', url]);
        } catch (error) {
          const message = `${error.stderr || ''}${error.message || ''}`;
          if (/already exists in this project/i.test(message)) {
            // The board's auto-add workflow got there first: the goal is met.
            console.log('  (already on the board)');
          } else {
            console.error(`\nIssue created but NOT added to the project:\n${error.stderr || error.message}`);
            console.error(`Add it by hand or with: gh project item-add ${projectNumber} --owner ${owner} --url ${url}`);
            process.exit(1);
          }
        }
      }
    } catch (error) {
      console.error(`\nFailed on ${title}:\n${error.stderr || error.message}`);
      console.error(`Created ${created} before the failure. Fix the problem and run the same command again: existing Issues are skipped.`);
      process.exit(1);
    }
    await sleep(delayMs);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

console.log(`\nDone. Created ${created} Issue(s).`);
