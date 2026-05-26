import { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white shadow-sm',
        onClick && 'cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
