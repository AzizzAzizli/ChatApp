import React from "react";

const Input = ({
  label = "",
  name = "",
  type = "text",
  className = "",
  isRequired = true,
    placeholder = "",
    value = "",
  onChange=()=>{},
}) => {
  return (
    <div className="w-1/2">
      <label
        htmlFor={name}
        className="mb-1  block text-sm  font-medium text-gray-800 "
      >
        {label}
      </label>
          <input
              value={value}
              onChange={onChange}
        id={name}
        type={type}
        placeholder={placeholder}
        required={isRequired}
        className={`bg-gray-50 border block border-gray-300 text-sm rounded-lg focus:ring-blue-500
                 focus:border-blue-500 w-full p-2.5 
             ${className}`}
      />
    </div>
  );
};

export default Input;
