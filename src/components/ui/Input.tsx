import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A00] focus:border-transparent transition-all placeholder:text-gray-400 ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
