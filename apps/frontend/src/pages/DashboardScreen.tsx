import { useEffect, useState } from "react";
import { EmptyProjects } from "../components/EmptyProjects";
import { GridIcon, ListIcon } from "../components/Icons";
import { SelectField, type SelectOption } from "../components/SelectField";
import "./DashboardScreen.css";

// Ajusta estas opciones a las de tu dominio
const SORT_OPTIONS: SelectOption[] = [
  { value: "modified", label: "Modificado" },
  { value: "created", label: "Creado" },
  { value: "name", label: "Nombre" },
];

const METHOD_OPTIONS: SelectOption[] = [
  { value: "", label: "Seleccionar" },
  { value: "usability-test", label: "Test de usabilidad" },
  { value: "card-sorting", label: "Card sorting" },
  { value: "survey", label: "Encuesta" },
  { value: "interview", label: "Entrevista" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Activos" },
  { value: "draft", label: "Borradores" },
  { value: "finished", label: "Finalizados" },
];

type ViewMode = "grid" | "list";

export const DashboardScreen = () => {
  const [sortBy, setSortBy] = useState("modified");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("all");
  const [view, setView] = useState<ViewMode>("grid");

  // TODO: cargar los proyectos desde la API
  const projects: unknown[] = [];

  useEffect(() => {
    document.title = "Mis proyectos - MEUX LAB";
  }, []);

  const isGrid = view === "grid";

  return (
    <>
      <h1 className="visually-hidden">Mis proyectos</h1>

      <div className="dashboard-toolbar">
        <div
          className="dashboard-filters"
          role="group"
          aria-label="Filtros de proyectos"
        >
          <SelectField
            label="Ordenado por:"
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
          />
          <SelectField
            label="Método:"
            value={method}
            onChange={setMethod}
            options={METHOD_OPTIONS}
          />
          <SelectField
            label="Estado:"
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
          />
        </div>

        <button
          type="button"
          className="dashboard-view-btn"
          onClick={() => setView(isGrid ? "list" : "grid")}
        >
          {isGrid ? <GridIcon /> : <ListIcon />}
          {isGrid ? "Vista Cuadrícula" : "Vista Lista"}
          <span className="visually-hidden">
            . Pulsa para cambiar a vista de {isGrid ? "lista" : "cuadrícula"}
          </span>
        </button>
      </div>

      {/* Cuando haya proyectos, renderízalos aquí según `view` (grid | list) */}
      {projects.length === 0 && <EmptyProjects />}
    </>
  );
};
