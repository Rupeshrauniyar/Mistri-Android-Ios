import React from "react";

/**
 * FormInput component for consistent form inputs
 * 
 * @param {Object} props
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, number, date, time, etc.)
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {Function} props.onChange - Function to call on input change
 * @param {string} props.placeholder - Input placeholder
 * @param {React.ReactNode} props.icon - Icon to display in the input
 */
const FormInput = ({
  name,
  value,
  label,
  type = "text",
  disabled = false,
  onChange,
  placeholder,
  icon,
}) => {
  return (
    <div className="w-full">
      {label && <h3 className="text-xl mt-2">{label}</h3>}
      <label className="p-2 rounded-md border-[2px] w-full border-[#CACFD6] hover:border-black outline-none flex items-center">
        <input
          name={name}
          type={type}
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full outline-none ${disabled ? 'bg-transparent' : ''}`}
        />
        {icon && (
          <span className="flex items-center justify-center">
            {icon}
          </span>
        )}
      </label>
    </div>
  );
};

export default FormInput; 