import { useEffect, useRef, type ComponentType } from "react";
import { NavLink } from "react-router";
import { BrandLogo } from "./BrandLogo";
import {
  ArchiveIcon,
  CloseIcon,
  HistoryIcon,
  HomeIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  type IconProps,
} from "./Icons";
import "./Sidebar.css";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<IconProps>;
  end?: boolean;
};

// Ajusta las rutas a las de tu router
const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Inicio", icon: HomeIcon, end: true },
  { to: "/recientes", label: "Recientes", icon: HistoryIcon },
  { to: "/favoritos", label: "Favoritos", icon: StarIcon },
  { to: "/archivados", label: "Archivados", icon: ArchiveIcon },
  { to: "/papelera", label: "Papelera", icon: TrashIcon },
];

interface SidebarProps {
  id: string;
  isOpen: boolean;
  /** true en pantallas angostas: la barra se comporta como panel superpuesto */
  isDrawer: boolean;
  onClose: () => void;
  onNavigate: () => void;
  onCreateProject: () => void;
}

export const Sidebar = ({
  id,
  isOpen,
  isDrawer,
  onClose,
  onNavigate,
  onCreateProject,
}: SidebarProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Al abrir el panel en móvil, el foco entra en él
  useEffect(() => {
    if (isDrawer && isOpen) closeButtonRef.current?.focus();
  }, [isDrawer, isOpen]);

  return (
    <div
      id={id}
      className={`sidebar${isDrawer ? " sidebar--drawer" : ""}`}
      hidden={!isOpen}
    >
      {isDrawer && (
        <div className="sidebar-drawer-head">
          <BrandLogo to="/dashboard" />
          <button
            ref={closeButtonRef}
            type="button"
            className="sidebar-close"
            aria-label="Cerrar menú"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
      )}

      <button
        type="button"
        className="sidebar-create"
        onClick={() => {
          onCreateProject();
          onNavigate();
        }}
      >
        <PlusIcon />
        Crear Proyecto
      </button>

      <nav aria-label="Principal">
        <ul className="sidebar-list">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className="sidebar-link"
                onClick={onNavigate}
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
