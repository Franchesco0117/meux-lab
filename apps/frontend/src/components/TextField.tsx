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
  const messageId = `${id}-message`;
  const message = error ?? hint;

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
          aria-describedby={message ? messageId : undefined}
          className="field-input"
        />
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
