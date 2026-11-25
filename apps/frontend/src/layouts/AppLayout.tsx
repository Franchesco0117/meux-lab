import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { useMediaQuery } from "../hooks/useMediaQuery";
import {
  ApiError,
  type AuthUser,
  fetchCurrentUser,
  logoutUser,
} from "../services/auth.services";
import "../styles/utilities.css";
import "./AppLayout.css";

const SIDEBAR_ID = "app-sidebar";

type SessionStatus = "loading" | "ready" | "error";

export const AppLayout = () => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 900px)");

  // ---------- Sesión ----------
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        if (!active) return;
        setUser(currentUser);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          navigate("/login", { replace: true });
        } else {
          setStatus("error");
        }
      }
    };

    loadUser();
    return () => {
      active = false;
    };
  }, [navigate, attempt]);

  const handleRetry = () => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  };

  // ---------- Barra lateral ----------
  // Escritorio: abierta por defecto. Móvil: cerrada.
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [prevIsDesktop, setPrevIsDesktop] = useState(isDesktop);
  if (prevIsDesktop !== isDesktop) {
    setPrevIsDesktop(isDesktop);
    setSidebarOpen(isDesktop);
  }

  // En móvil la barra es un panel modal: el resto de la página queda inerte
  const isDrawerOpen = !isDesktop && sidebarOpen;

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasDrawerOpen = useRef(false);

  // Escape cierra el panel
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  // Al cerrar el panel, el foco vuelve al botón de menú
  useEffect(() => {
    if (wasDrawerOpen.current && !isDrawerOpen) {
      menuButtonRef.current?.focus();
    }
    wasDrawerOpen.current = isDrawerOpen;
  }, [isDrawerOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Aunque falle la petición, se abandona la pantalla protegida.
      // Limpia aquí también el token o estado de sesión local, si lo usas.
    }
    navigate("/login", { replace: true });
  };

  // ---------- Estados previos a mostrar la app ----------
  if (status === "loading") {
    return (
      <div className="app-status">
        <p role="status" className="app-status-text">
          Cargando...
        </p>
      </div>
    );
  }

  if (status === "error" || !user) {
    return (
      <div className="app-status">
        <div role="alert" className="app-status-box">
          <p className="app-status-title">No pudimos cargar tu sesión.</p>
          <p className="app-status-text">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
          <button
            type="button"
            className="app-status-btn"
            onClick={handleRetry}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ---------- Aplicación ----------
  return (
    <div className="app-shell">
      <a href="#contenido" className="skip-link" inert={isDrawerOpen}>
        Saltar al contenido
      </a>

      <AppHeader
        user={{ name: user.name, email: user.email }}
        plan="FREE"
        sidebarOpen={sidebarOpen}
        sidebarId={SIDEBAR_ID}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        menuButtonRef={menuButtonRef}
        onSearch={(query) =>
          navigate(`/dashboard?q=${encodeURIComponent(query)}`)
        }
        onLogout={handleLogout}
        inert={isDrawerOpen}
      />

      <div className="app-body">
        <Sidebar
          id={SIDEBAR_ID}
          isOpen={sidebarOpen}
          isDrawer={!isDesktop}
          onClose={() => setSidebarOpen(false)}
          onNavigate={() => {
            if (!isDesktop) setSidebarOpen(false);
          }}
          onCreateProject={() => navigate("/projects/new")}
        />

        {isDrawerOpen && (
          <div
            className="app-backdrop"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main
          id="contenido"
          tabIndex={-1}
          className="app-main"
          inert={isDrawerOpen}
        >
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};
