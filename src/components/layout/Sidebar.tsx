import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Shield, BarChart2, Calculator, CheckSquare, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/pitch', icon: MessageSquare, label: 'Pitch' },
  { to: '/objeciones', icon: Shield, label: 'Objeciones' },
  { to: '/comisiones', icon: BarChart2, label: 'Comisiones' },
  { to: '/calculadora', icon: Calculator, label: 'Calculadora' },
  { to: '/requisitos', icon: CheckSquare, label: 'Requisitos' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 h-screen sticky top-0 flex-shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-[#FF5A00] rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">SmartPitch</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                isActive
                  ? 'bg-orange-50 text-[#FF5A00]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <NavLink
          to="/negociacion"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all w-full ${
              isActive ? 'bg-[#FF5A00] text-white' : 'bg-orange-50 text-[#FF5A00] hover:bg-orange-100'
            }`
          }
        >
          <span>🎯</span>
          Nueva negociación
        </NavLink>
      </div>
    </aside>
  );
}
