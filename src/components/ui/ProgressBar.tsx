import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ value, max, label, color = '#FF5A00' }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="font-semibold" style={{ color }}>{value}/{max}</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
