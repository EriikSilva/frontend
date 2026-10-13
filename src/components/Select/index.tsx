import type { ChangeEventHandler } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  label: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  placeholder?: string;
}

function Select({ value, options, label, onChange, placeholder }: SelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="cursor-pointer text-gray-700 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        {placeholder && (
          <option value="" className="text-gray-700" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            className="cursor-pointer"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
