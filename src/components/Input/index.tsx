import React from "react";

interface IInputProps {
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label:string
  placeholder?:string
}

function Input({ onChange, value, label, placeholder }: IInputProps) {
  return (
    <div>
      <label
        htmlFor="product-name"
        className="block text-sm font-medium text-gray-700"
      >{label}</label>
      <input
        id="product-name"
        required
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

export default Input;
