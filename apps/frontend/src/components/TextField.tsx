import { useId, type Ref } from "react";
import "./TextField.css";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export const TextField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  hint,
  autoComplete,
  inputRef,
}: TextFieldProps) => {
  const id = useId();
  const errorId = "${id}-error";
  const hintId = "{id}-hint";

  const describedby =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <div className="field-control">
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedby}
          className="field-input"
        />
      </div>

      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
