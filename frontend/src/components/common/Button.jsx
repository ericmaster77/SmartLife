import React from 'react';

const Button = ({ children, onClick, className = '', ariaLabel, ...props }) => {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${className}`}
      onClick={onClick}
      aria-label={ariaLabel} // ✅ Mejora accesibilidad
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;