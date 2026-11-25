import {
  useEffect,
  useId,
  useRef,
  useState,
  type Ref,
  useImperativeHandle,
} from "react";
import "./TextField.css";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
}

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const PasswordField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  hint,
  autoComplete,
  inputRef,
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const shouldRestoreFocusRef = useRef(false);
  const internalInputRef = useRef<HTMLInputElement>(null);

  const id = useId();
  const messageId = `${id}-message`;

  const message = error ?? hint;
  const toggleLabel = isVisible ? "Ocultar contraseña" : "Mostrar contraseña";

  useImperativeHandle(
    inputRef,
    () => internalInputRef.current as HTMLInputElement,
  );

  useEffect(() => {
    if (!shouldRestoreFocusRef.current) return;
    shouldRestoreFocusRef.current = false;
    internalInputRef.current?.focus();
  }, [isVisible]);

  const handleToggleVisibility = () => {
    shouldRestoreFocusRef.current = true;
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div className="field-control">
        <input
          ref={internalInputRef}
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={message ? messageId : undefined}
          className="field-input field-input--password"
        />

        <button
          type="button"
          onClick={handleToggleVisibility}
          aria-label={toggleLabel}
          className="field-toggle"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {message && (
        <p
          key={error ? "error" : "hint"}
          id={messageId}
          className={error ? "field-error" : "field-hint"}
          role={error ? "alert" : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
};
