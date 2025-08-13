import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
  name?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  className = "",
  disabled = false,
  error = false,
  hint = "",
  name = "",
  ...props
}) => {
  // Special handling for date inputs to show custom placeholder
  const isDateType = type === "date";

  // Base classes
  let inputClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

  // State classes
  if (disabled) {
    inputClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` bg-transparent border-red-500 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-red-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-900 dark:text-gray-300 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800`;
  }

  // Special styling for date inputs
  if (isDateType) {
    inputClasses += ` date-input`; // Add specific class for date inputs
  }

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
