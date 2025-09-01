import React, { useState } from 'react';

/**
 * Select Component
 * 
 * A reusable select dropdown component
 * 
 * @param {string} label - Select label
 * @param {Array} options - Array of options [{value: string, label: string}]
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler function
 * @param {string} placeholder - Select placeholder
 * @param {string} error - Error message
 * @param {boolean} required - Whether the select is required
 * @param {string} className - Additional CSS classes
 */
const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select container */}
      <div className={`relative`}>
        <select
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full py-2.5 px-3 appearance-none bg-transparent
            border rounded-lg text-gray-700 
            ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-borderColor'}
          `}
          {...props}
        >
          {/* Placeholder option */}
          {!value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {/* Render options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Select;