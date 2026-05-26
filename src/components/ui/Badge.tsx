import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const variants = {
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    neutral: 'bg-gray-100 text-gray-500',
    primary: 'bg-primary/10 text-primary',
  };
  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };
  return (
    <span className={cn('inline-flex items-center font-semibold rounded-full', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
