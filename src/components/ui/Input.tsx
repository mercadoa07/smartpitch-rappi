import { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      )}
      <input
        className={cn(
          'w-full h-9 px-3 rounded-xl border border-gray-medium text-sm bg-white text-dark',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          'placeholder:text-gray-400 transition-colors',
          'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
          error && 'border-danger focus:ring-danger/30 focus:border-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
