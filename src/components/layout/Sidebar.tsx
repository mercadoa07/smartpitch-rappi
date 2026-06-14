import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Shield, Calculator,
  CheckSquare, Target, ChevronLeft, ChevronRight, X, LogOut,
  BookOpen, Lightbulb
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/',             icon: Home,        label: 'Inicio',        end: true,  color: '#60a5fa' },
  { to: '/instrucciones',icon: BookOpen,    label: 'Instrucciones', end: false, color: '#a78bfa' },
  { to: '/negociacion',  icon: Target,      label: 'Negociación',   end: false, color: '#f97316' },
  { to: '/pitch',        icon: MessageSquare,label: 'Pitch',        end: false, color: '#34d399' },
  { to: '/objeciones',   icon: Shield,      label: 'Objeciones',    end: false, color: '#fb7185' },
  { to: '/calculadora',  icon: Calculator,  label: 'Calculadora',   end: false, color: '#facc15' },
  { to: '/requisitos',   icon: CheckSquare, label: 'Requisitos',    end: false, color: '#38bdf8' },
  { to: '/tips-ventas',  icon: Lightbulb,   label: 'Tips Ventas',   end: false, color: '#4ade80' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({
  collapsed = false,
  isMobile = false,
  onToggle,
  onMobileClose,
}: {
  collapsed?: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const wide = !collapsed || isMobile;

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Logo ── */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-white/10 shrink-0 px-5',
          !wide && 'justify-center px-0'
        )}
      >
        {wide ? (
          <div className="flex-1 min-w-0" style={{ textAlign: 'center' }}>
            <div className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
              <span
                className="font-black leading-none"
                style={{ fontSize: 24, letterSpacing: '-0.6px', color: '#ffffff' }}
              >
                rappi
              </span>
              <span
                className="bg-primary/20 text-primary font-bold rounded px-1.5 py-0.5 uppercase"
                style={{ fontSize: 9, letterSpacing: '0.5px' }}
              >
                ASESOR
              </span>
            </div>
            <p
              className="text-white/30 uppercase mt-0.5"
              style={{ fontSize: 10, letterSpacing: '1px' }}
            >
              Inside Sales
            </p>
          </div>
        ) : (
          <span
            className="font-black"
            style={{ fontSize: 20, letterSpacing: '-0.6px', color: '#ffffff' }}
          >
            R
          </span>
        )}

        {/* Toggle / Close */}
        {isMobile ? (
          <button onClick={onMobileClose} className="text-white/40 hover:text-white transition-colors ml-auto">
            <X size={18} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0 ml-auto"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, color }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              cn(
                'relative flex items-center rounded-xl transition-all duration-150 group',
                wide ? 'gap-3 px-4 py-3 justify-start' : 'justify-center h-11 w-11 mx-auto',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-[#A0A0B0] hover:bg-white/5 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 inset-y-1 w-[3px] rounded-r-full bg-primary" />
                )}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.75}
                  className="shrink-0"
                  style={{ color: isActive ? color : undefined }}
                />
                {wide && (
                  <span
                    style={{ fontSize: 14, fontFamily: "'Poppins', sans-serif", fontWeight: isActive ? 600 : 400 }}
                    className="leading-none"
                  >
                    {label}
                  </span>
                )}
                {/* Tooltip en modo colapsado */}
                {!wide && (
                  <span className="absolute left-full ml-3 px-2 py-1 bg-[#0f0f1e] text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-white/10 transition-opacity"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer usuario ── */}
      <div className="border-t border-white/10 py-4 px-4 shrink-0">
        {wide ? (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 select-none"
              style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate" style={{ fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>
                {user?.full_name}
              </p>
              <p className="text-white/30 truncate" style={{ fontSize: 12, fontFamily: "'Poppins', sans-serif" }}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/30 hover:text-danger transition-colors shrink-0"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-white/30 hover:text-danger hover:bg-white/5 transition-colors"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-dark h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-56'
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[260px] bg-dark z-50 flex flex-col transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent isMobile onMobileClose={onMobileClose} />
      </aside>
    </>
  );
}
