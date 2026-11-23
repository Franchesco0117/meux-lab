import { useId, type ReactNode } from "react";
import "../pages/RegisterScreen.css";

interface CheckboxProps {
  label: ReactNode;
  accessibleName?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export const Checkbox = ({
  label,
  accessibleName,
  checked,
  onChange,
  error,
}: CheckboxProps) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="register-checkbox-container">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
          aria-label={accessibleName}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="register-checkbox"
        />
        <label htmlFor={id} className="regiser-checkbox-label">
          {label}
        </label>
      </div>

      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
