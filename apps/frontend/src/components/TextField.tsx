import React, { useId } from "react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => {
  const id = useId();
  const errorId = "${id}-error";

  return (
    <div className="flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="border p-2 rounded"
      />
      {error && (
        <span id={errorId} className="text-red-500 text-sm">
          {error}
        </span>
      )}
    </div>
  );
};
