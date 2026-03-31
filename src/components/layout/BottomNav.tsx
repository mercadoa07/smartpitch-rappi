import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Shield, BarChart2, Calculator, CheckSquare } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/pitch', icon: MessageSquare, label: 'Pitch' },
  { to: '/objeciones', icon: Shield, label: 'Objeciones' },
  { to: '/comisiones', icon: BarChart2, label: 'Comisiones' },
  { to: '/calculadora', icon: Calculator, label: 'Calculadora' },
  { to: '/requisitos', icon: CheckSquare, label: 'Requisitos' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-bottom">
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 px-1 gap-0.5 transition-colors ${
                isActive ? 'text-[#FF5A00]' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
