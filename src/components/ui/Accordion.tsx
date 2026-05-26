import { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
}

export function AccordionItem({ title, children, defaultOpen = false, badge }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-7 hover:bg-gray-50 transition-colors text-left" style={{ paddingTop: 10, paddingBottom: 10 }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-semibold text-dark">{title}</span>
          {badge}
        </div>
        <ChevronDown
          size={16}
          className={cn('text-gray-400 shrink-0 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-[3000px]' : 'max-h-0')}>
        <div className="px-7 border-t border-gray-100" style={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 28, paddingBottom: 28 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
