import React from 'react';

interface ToggleProps {
  label?: string;
  options: [{ value: string; label: string }, { value: string; label: string }];
  value: string;
  onChange: (value: string) => void;
}

export function Toggle({ label, options, value, onChange }: ToggleProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-1 gap-1">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
              value === opt.value
                ? 'bg-[#FF5A00] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
