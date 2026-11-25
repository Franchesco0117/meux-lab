import { useEffect, useId, useRef, useState } from "react";
import { LogOutIcon } from "./Icons";

interface UserMenuProps {
  name: string;
  email?: string;
  onLogout: () => void | Promise<void>;
}

const getInitials = (name: string): string => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
  return initials || "U";
};

export const UserMenu = ({ name, email, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };

    // Con teclado: si el foco sale del menú (Tab), se cierra
    const handleFocusIn = (e: FocusEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="user-menu-trigger"
        aria-label={`Menú de cuenta de ${name}`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">{getInitials(name)}</span>
      </button>

      {isOpen && (
        <div id={panelId} className="user-menu-panel">
          <div className="user-menu-info">
            <p className="user-menu-name">{name}</p>
            {email && <p className="user-menu-email">{email}</p>}
          </div>

          <button
            type="button"
            className="user-menu-item"
            onClick={() => {
              setIsOpen(false);
              void onLogout();
            }}
          >
            <LogOutIcon />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
