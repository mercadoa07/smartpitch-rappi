import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  loading?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, loading, options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          className={`w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A00] focus:border-transparent transition-all appearance-none disabled:bg-gray-50 disabled:text-gray-400 ${error ? 'border-red-400' : ''} ${className}`}
          disabled={loading || props.disabled}
          {...props}
        >
          {placeholder && (
            <option value="">{loading ? 'Cargando...' : placeholder}</option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          {loading ? (
            <span className="w-4 h-4 border-2 border-gray-300 border-t-[#FF5A00] rounded-full animate-spin block" />
          ) : (
            <ChevronDown size={18} />
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
