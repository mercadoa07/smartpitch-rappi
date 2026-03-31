import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNegociacion } from '../../context/NegociacionContext';
import { MapPin } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title, showBack }: HeaderProps) {
  const { user } = useAuth();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const negLabel = negociacion.restaurant_name
    ? negociacion.restaurant_name
    : hasActiveNegociacion
    ? `${negociacion.city} · ${negociacion.tag}`
    : null;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-900 flex-shrink-0"
            >
              ←
            </button>
          ) : null}
          {title ? (
            <h1 className="font-bold text-lg text-gray-900 truncate">{title}</h1>
          ) : (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-900 text-base leading-tight">
                Hola, {user?.full_name?.split(' ')[0] || 'asesor'} 👋
              </span>
              {negLabel && (
                <button
                  onClick={() => navigate('/negociacion')}
                  className="flex items-center gap-1 text-xs text-[#FF5A00] font-medium mt-0.5"
                >
                  <MapPin size={11} />
                  <span className="truncate max-w-[160px]">{negLabel}</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasActiveNegociacion && !negLabel && (
            <button
              onClick={() => navigate('/negociacion')}
              className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full"
            >
              Negociación activa
            </button>
          )}
          <button
            onClick={() => navigate('/perfil')}
            className="w-9 h-9 bg-[#FF5A00] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}
