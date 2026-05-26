import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNegociacion } from '../../context/NegociacionContext';
import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const firstName = user?.full_name?.split(' ')[0] || 'asesor';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 gap-4 shrink-0 sticky top-0 z-30">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-light transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0" style={{ paddingLeft: 16 }}>
        <h1 className="text-dark font-semibold truncate" style={{ fontSize: 22 }}>
          {title}
        </h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search button */}
        <button
          className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl border border-gray-medium text-gray-400 hover:border-gray-400 hover:text-dark transition-all"
          style={{ fontSize: 14 }}
        >
          <Search size={16} />
          <span>Buscar</span>
          <kbd className="font-mono text-gray-300 ml-1" style={{ fontSize: 10 }}>Ctrl K</kbd>
        </button>

        {/* Bell */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-light hover:text-dark transition-colors">
          <Bell size={18} />
        </button>

        {/* Role badge */}
        <span
          className="hidden sm:inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase px-2 py-0.5"
          style={{ fontSize: 10, letterSpacing: '0.5px' }}
        >
          ASESOR
        </span>

        {/* Country badge (si hay negociación) */}
        {hasActiveNegociacion && negociacion.country_code && (
          <span
            className="hidden sm:inline-flex items-center rounded-full bg-gray-light text-gray-500 border border-gray-medium font-medium px-2 py-0.5"
            style={{ fontSize: 11 }}
          >
            {countryFlag(negociacion.country_code)} {negociacion.country_code}
          </span>
        )}

        {/* Name */}
        <span className="hidden md:block text-dark" style={{ fontSize: 14 }}>
          {firstName}
        </span>

        {/* Avatar */}
        <button
          onClick={() => navigate('/perfil')}
          className="w-[34px] h-[34px] rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center shrink-0 select-none hover:bg-primary/25 transition-colors"
          style={{ fontSize: 13 }}
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
