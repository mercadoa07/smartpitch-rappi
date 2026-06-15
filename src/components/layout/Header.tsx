import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNegociacion } from '../../context/NegociacionContext';
import {
  Menu, Bell,
  Home, Target, MessageSquare, ShieldAlert,
  Calculator, ClipboardList, Lightbulb, BookOpen
} from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const PAGE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  'Inicio':          { icon: Home,          color: '#f97316' },
  'Negociación':     { icon: Target,        color: '#FF441F' },
  'Pitch':           { icon: MessageSquare, color: '#f97316' },
  'Objeciones':      { icon: ShieldAlert,   color: '#a855f7' },
  'Calculadora':     { icon: Calculator,    color: '#eab308' },
  'Requisitos':      { icon: ClipboardList, color: '#ec4899' },
  'Tips Ventas':     { icon: Lightbulb,     color: '#22c55e' },
  'Instrucciones':   { icon: BookOpen,      color: '#a78bfa' },
};

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const firstName = user?.full_name?.split(' ')[0] || 'asesor';

  const pageIcon = PAGE_ICONS[title];
  const PageIcon = pageIcon?.icon;

  return (
    <header
      className="h-16 border-b border-gray-100 flex items-center px-8 gap-4 shrink-0 sticky top-0 z-30"
      style={{ background: '#ffffff' }}
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title + ícono */}
      <div className="flex-1 min-w-0 flex items-center gap-2" style={{ paddingLeft: 16 }}>
        {PageIcon && (
          <PageIcon
            size={22}
            strokeWidth={2.2}
            style={{ color: pageIcon.color, flexShrink: 0 }}
          />
        )}
        <h1
          className="text-dark font-semibold truncate"
          style={{ fontSize: 22, margin: 0 }}
        >
          {title}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Bell */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Bell size={18} />
        </button>

        {/* Role badge */}
        <span
          className="hidden sm:inline-flex items-center rounded-full border font-bold uppercase px-3 py-1"
          style={{
            fontSize: 10,
            letterSpacing: '0.5px',
            background: 'rgba(255,68,31,0.08)',
            color: '#FF441F',
            borderColor: 'rgba(255,68,31,0.20)',
          }}
        >
          ASESOR
        </span>

        {/* Country badge (si hay negociación activa) */}
        {hasActiveNegociacion && negociacion.country_code && (
          <span
            className="hidden sm:inline-flex items-center rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium px-2 py-0.5"
            style={{ fontSize: 11 }}
          >
            {countryFlag(negociacion.country_code)} {negociacion.country_code}
          </span>
        )}

        {/* Name */}
        <span className="hidden md:block text-dark font-medium" style={{ fontSize: 14 }}>
          {firstName}
        </span>

        {/* Avatar */}
        <button
          onClick={() => navigate('/perfil')}
          className="w-[34px] h-[34px] rounded-full font-bold flex items-center justify-center shrink-0 select-none transition-colors"
          style={{
            fontSize: 13,
            background: 'rgba(255,68,31,0.12)',
            color: '#FF441F',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,68,31,0.22)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,68,31,0.12)'; }}
        >
          {initials}
        </button>

      </div>
    </header>
  );
}

function countryFlag(code: string): string {
  const flags: Record<string, string> = {
    AR: '🇦🇷', CL: '🇨🇱', CO: '🇨🇴', EC: '🇪🇨', MX: '🇲🇽', PE: '🇵🇪',
  };
  return flags[code] || '🌎';
}
