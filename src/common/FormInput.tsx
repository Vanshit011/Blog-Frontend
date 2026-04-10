import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
  ringClassName?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ 
  label, 
  error, 
  id, 
  ringClassName = 'focus:ring-indigo-500', 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={`w-full px-4 py-3 mt-1 text-gray-900 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${
          error ? 'border-red-500 focus:ring-red-500' : `border-gray-300 ${ringClassName}`
        }`}
        {...props}
      />
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
