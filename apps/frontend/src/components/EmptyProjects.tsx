import { PlusIcon } from "./Icons";
import "./EmptyProjects.css";

export const EmptyProjects = () => (
  <section className="empty-projects" aria-labelledby="empty-projects-title">
    <svg
      className="empty-projects-art"
      viewBox="0 0 260 210"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Portapapeles trasero, inclinado */}
      <g transform="rotate(-14 95 120)">
        <rect
          className="art-board art-board--back"
          x="40"
          y="34"
          width="110"
          height="150"
          rx="8"
        />
        <rect
          className="art-panel"
          x="52"
          y="58"
          width="86"
          height="114"
          rx="4"
        />
        <rect
          className="art-clip"
          x="65"
          y="25"
          width="60"
          height="18"
          rx="4"
        />
        <circle className="art-ring" cx="95" cy="22" r="5" />
      </g>

      {/* Portapapeles frontal */}
      <rect
        className="art-board"
        x="118"
        y="48"
        width="110"
        height="150"
        rx="8"
      />
      <rect
        className="art-panel"
        x="130"
        y="72"
        width="86"
        height="114"
        rx="4"
      />
      <rect className="art-clip" x="143" y="39" width="60" height="18" rx="4" />
      <circle className="art-ring" cx="173" cy="36" r="5" />
    </svg>

    <h2 id="empty-projects-title" className="empty-projects-title">
      Aún no tienes proyectos.
    </h2>

    <p className="empty-projects-text">
      ¡Toca el botón{" "}
      <span className="empty-projects-plus" aria-hidden="true">
        <PlusIcon size={18} />
      </span>
      <span className="visually-hidden">Crear Proyecto</span> para comenzar tu
      primer proyecto!
    </p>
  </section>
);
