import { Link } from "react-router";
import "./BrandLogo.css";

type BrandLogoProps = { to?: string };

export const BrandLogo = ({ to = "/" }: BrandLogoProps) => (
  <Link to={to} className="brand-logo" aria-label="MEUX LAB, inicio">
    <svg
      className="brand-logo-mark"
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
    <span className="brand-logo-text">MEUX LAB</span>
  </Link>
);
