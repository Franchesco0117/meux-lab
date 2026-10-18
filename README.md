# MEUX LAB

Portal web de laboratorio de usabilidad y evaluación UX, con foco en accesibilidad
(WCAG 2.1 AA / AAA) para participantes con y sin discapacidad visual.

## Stack Tecnológico

- **Frontend:** React + TypeScript, con Vite
- **Backend:** NestJS + TypeScript, arquitectura en capas (Clean Architecture)
- **Base de datos:** PostgreSQL (incluye columnas `JSONB` para telemetría)
- **Tiempo real:** WebSockets (motor de telemetría)
- **Calidad:** oxlint, Prettier, Husky y lint-staged

## Estructura del Proyecto

Es un **monorepo** con npm workspaces: frontend y backend viven en el mismo
repositorio, cada uno como una aplicación independiente dentro de `apps/`.

```
meux-lab/
├── .github/          # Plantillas de Issues/PRs y workflows de CI
├── .husky/           # Hooks de Git (revisiones antes de cada commit)
├── docs/             # Documentación técnica y diagramas
│   ├── ARCHITECTURE.md
│   ├── TRACEABILITY.md
│   └── diagrams/
├── apps/
│   ├── backend/              # NestJS
│   │   └── src/
│   │       ├── domain/           # Entidades e interfaces de contrato (capa 1)
│   │       ├── application/      # Servicios y lógica de negocio (capa 2)
│   │       ├── infrastructure/   # Repositorios, WebSocket, módulos concretos (capa 3)
│   │       └── interfaces/       # Controllers y rutas REST (capa 4)
│   └── frontend/             # Vite + React
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── hooks/
│           ├── services/
│           └── styles/
├── .gitignore
├── .prettierrc
├── CONTRIBUTING.md
├── package.json              # Raíz del monorepo (workspaces)
└── README.md
```

Cada aplicación tiene su propio `src/`, su propio `package.json` y su propia
configuración; que haya dos carpetas `src` es intencional.

Ver `docs/ARCHITECTURE.md` para el detalle del Factory Pattern y el motor de
telemetría, y `docs/TRACEABILITY.md` para la matriz de trazabilidad (requisitos
funcionales, no funcionales, épicas y actores).

## Requisitos Previos

- Node.js, versión LTS (se recomienda la 22). En Windows, algunas versiones
  muy recientes (24/25) tienen un bug conocido de `npx`.
- Git
- PostgreSQL (se necesitará cuando comience la capa de persistencia)

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd meux-lab

# 2. Instalar dependencias (raíz + workspaces de backend y frontend)
npm install
# Si aparece el error "Cannot read properties of null (reading 'edgesOut')":
npm install --legacy-peer-deps
```

Las variables de entorno (conexión a PostgreSQL, secretos) se documentarán aquí
cuando se implemente la capa de persistencia.

## Comandos Útiles

Todos se ejecutan desde la raíz del repositorio:

| Comando                  | Qué hace                               |
| ------------------------ | -------------------------------------- |
| `npm run dev:backend`    | Levanta el backend en modo desarrollo  |
| `npm run dev:frontend`   | Levanta el frontend en modo desarrollo |
| `npm run build:backend`  | Compila el backend                     |
| `npm run build:frontend` | Compila el frontend                    |
| `npm run lint:backend`   | Revisa el código del backend           |
| `npm run lint:frontend`  | Revisa el código del frontend          |
| `npm run test:backend`   | Ejecuta las pruebas del backend        |

## Flujo de Trabajo

Antes de contribuir código, lee **[CONTRIBUTING.md](./CONTRIBUTING.md)**, que
define la estrategia de ramas, la convención de commits, la política de Pull
Requests, la Definición de Hecho y las reglas de arquitectura.

## Estado del Proyecto

Backlog gestionado mediante épicas y priorización MoSCoW. Épicas activas en
esta fase: Núcleo y Seguridad, Gestión de Proyectos, Orquestador de Módulos,
Entorno de Participante/Accesibilidad, Motor de Telemetría, y Soporte/Ayuda.
Módulos Específicos, Métricas/Reportes y Monetización quedan fuera de alcance
por ahora (ver la matriz de trazabilidad).
