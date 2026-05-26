import { cn } from '../../lib/cn';

interface ToggleProps {
  label?: string;
  options: [{ value: string; label: string }, { value: string; label: string }];
  value: string;
  onChange: (value: string) => void;
}

export function Toggle({ label, options, value, onChange }: ToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      )}
      <div className="flex rounded-xl border border-gray-medium bg-gray-light p-1 gap-1">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 py-1.5 px-3 text-sm font-semibold rounded-lg transition-all duration-200',
              value === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-dark'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
