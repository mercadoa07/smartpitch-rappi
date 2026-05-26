import { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  loading?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, loading, options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full h-9 pl-3 pr-9 rounded-xl border border-gray-medium text-sm bg-white text-dark',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'appearance-none transition-colors',
            'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
            error && 'border-danger',
            className
          )}
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
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-primary rounded-full animate-spin block" />
          ) : (
            <ChevronDown size={15} />
          )}
        </div>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
