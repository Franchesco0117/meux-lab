import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router";
import "../pages/RegisterScreen.css";

interface AuthLayoutProps {
  title: string;
  heading: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export const AuthLayout = ({
  title,
  heading,
  subtitle,
  headerAction,
  children,
}: AuthLayoutProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title;
    headingRef.current?.focus();
  }, [title]);

  return (
    <div className="register-screen">
      <header className="register-header">
        <div className="register-header-inner">
          <Link to="/" className="register-logo" aria-label="MEUX LAB, inicio">
            <svg
              className="register-logo-mark"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              aria-hidden="true"
            >
              <rect width="28" height="28" rx="8" />
              <path
                d="M8 20V8.5l6 7 6-7V20"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            MEUX LAB
          </Link>

          {headerAction}
        </div>
      </header>

      <main id="main-content" className="register-main">
        <div className="register-card">
          <h1 ref={headingRef} tabIndex={-1} className="register-title">
            {heading}
          </h1>
          {subtitle && <p className="register-subtitle">{subtitle}</p>}
          {children}
        </div>
      </main>

      <footer className="register-footer">
        © {new Date().getFullYear()} MEUX LAB. Laboratorio de Usabilidad.
      </footer>
    </div>
  );
};
