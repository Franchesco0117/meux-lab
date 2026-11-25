import { useId } from "react";
import { ChevronDownIcon } from "./Icons";
import "./SelectField.css";

export type SelectOption = { value: string; label: string };

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

export const SelectField = ({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) => {
  const id = useId();

  return (
    <div className="select-field">
      <label htmlFor={id} className="select-label">
        {label}
      </label>

      <div className="select-control">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-input"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="select-icon">
          <ChevronDownIcon size={18} />
        </span>
      </div>
    </div>
  );
};
