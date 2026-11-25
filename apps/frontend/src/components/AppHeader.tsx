import { useState, type Ref } from "react";
import { BellIcon, MenuIcon, SearchIcon } from "./Icons";
import { BrandLogo } from "./BrandLogo";
import { UserMenu } from "./UserMenu";
import "./AppHeader.css";

interface AppHeaderProps {
  user: { name: string; email?: string };
  plan: string;
  sidebarOpen: boolean;
  sidebarId: string;
  onToggleSidebar: () => void;
  menuButtonRef?: Ref<HTMLButtonElement>;
  onSearch?: (query: string) => void;
  onLogout: () => void | Promise<void>;
  inert?: boolean;
}

export const AppHeader = ({
  user,
  sidebarOpen,
  sidebarId,
  onToggleSidebar,
  menuButtonRef,
  onSearch,
  onLogout,
  inert,
}: AppHeaderProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <header className="app-header" inert={inert}>
      <div className="app-header-start">
        <button
          ref={menuButtonRef}
          type="button"
          className="icon-btn"
          aria-label="Menú de navegación"
          aria-expanded={sidebarOpen}
          aria-controls={sidebarId}
          onClick={onToggleSidebar}
        >
          <MenuIcon />
        </button>

        <BrandLogo to="/dashboard" />
      </div>

      <form role="search" className="app-search" onSubmit={handleSearch}>
        <label htmlFor="project-search" className="visually-hidden">
          Buscar proyecto
        </label>
        <span className="app-search-icon">
          <SearchIcon />
        </span>
        <input
          id="project-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar proyecto"
          autoComplete="off"
          className="app-search-input"
        />
      </form>

      <div className="app-header-end">
        <button type="button" className="icon-btn" aria-label="Notificaciones">
          <BellIcon />
        </button>

        <UserMenu name={user.name} email={user.email} onLogout={onLogout} />
      </div>
    </header>
  );
};
