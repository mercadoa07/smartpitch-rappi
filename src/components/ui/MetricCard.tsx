import { cn } from '../../lib/cn';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
  valueColor?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
  currencyLabel?: string;
}

export function MetricCard({ icon, label, value, unit, highlight, valueColor = 'default', currencyLabel }: MetricCardProps) {
  const isUnavailable = value === 'Dato no disponible';

  const numColors = {
    default: 'text-dark',
    primary: 'text-primary',
    success: 'text-success',
    info: 'text-info',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  const color = highlight ? numColors.primary : numColors[valueColor];

  return (
    <div
      className={cn(
        'rounded-2xl border shadow-sm transition-all',
        highlight
          ? 'bg-primary/5 border-primary/20 hover:border-primary/40 hover:shadow-md'
          : 'bg-white border-gray-medium hover:border-primary/40 hover:shadow-md'
      )}
      style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 110 }}
    >
      <p className="text-gray-400 uppercase" style={{ fontSize: 11, letterSpacing: '1.2px', marginBottom: 8 }}>
        {icon} {label}
      </p>

      {isUnavailable ? (
        <p className="text-gray-400 italic" style={{ fontSize: 12 }}>N/D</p>
      ) : (
        <>
          <span className={cn('font-extrabold leading-tight', color)} style={{ fontSize: 28 }}>
            {value}
          </span>
          {unit && <span className="text-gray-400" style={{ fontSize: 11, marginTop: 2 }}>{unit}</span>}
          {currencyLabel && <span className="text-gray-400" style={{ fontSize: 11, marginTop: 2 }}>{currencyLabel}</span>}
        </>
      )}
    </div>
  );
}
