import React, { ReactNode } from 'react';

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export function MetricCard({ icon, label, value, unit, highlight }: MetricCardProps) {
  return (
    <div className={`rounded-xl p-4 flex flex-col gap-1 border ${highlight ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>
          {value === 'Dato no disponible' ? (
            <span className="text-sm font-normal text-gray-400 italic">Dato no disponible</span>
          ) : value}
        </span>
        {unit && value !== 'Dato no disponible' && (
          <span className="text-sm text-gray-500">{unit}</span>
        )}
      </div>
    </div>
  );
}
