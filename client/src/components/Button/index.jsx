import React from "react";

const Button = ({
  label = "Button",
  className = "",
  type = "button",
  disable = false,
}) => {
  return (
    <button
      type={type}
      className={`text-white bg-primary hover:opacity-80 focus:ring-4 focus:outline-none
         focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center ${className}`}
      disabled={disable}
    >
      {label}
    </button>
  );
};

export default Button;
