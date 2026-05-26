import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Shield, Calculator, CheckSquare, Target } from 'lucide-react';
import { cn } from '../../lib/cn';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Inicio', end: true },
  { to: '/negociacion', icon: Target, label: 'Negociación', end: false },
  { to: '/pitch', icon: MessageSquare, label: 'Pitch', end: false },
  { to: '/objeciones', icon: Shield, label: 'Objeciones', end: false },
  { to: '/calculadora', icon: Calculator, label: 'Calculadora', end: false },
  { to: '/requisitos', icon: CheckSquare, label: 'Requisitos', end: false },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
      <div className="flex items-stretch">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => cn(
              'flex-1 flex flex-col items-center justify-center py-2 px-1 gap-0.5 transition-colors',
              isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span className="text-[10px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
