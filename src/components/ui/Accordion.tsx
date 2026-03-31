import React, { useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
}

export function AccordionItem({ title, children, defaultOpen = false, badge }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-semibold text-gray-900">{title}</span>
          {badge}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[2000px]' : 'max-h-0'}`}
      >
        <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
