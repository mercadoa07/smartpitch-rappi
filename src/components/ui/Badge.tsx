import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'orange' | 'green' | 'blue' | 'gray' | 'red';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'orange', size = 'sm' }: BadgeProps) {
  const variants = {
    orange: 'bg-orange-100 text-orange-700 border border-orange-200',
    green: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    blue: 'bg-blue-100 text-blue-700 border border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border border-gray-200',
    red: 'bg-red-100 text-red-700 border border-red-200',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
