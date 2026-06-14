import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, MessageSquare, Shield, Calculator,
  CheckSquare, Target, ChevronLeft, ChevronRight, X, LogOut,
  BookOpen, Lightbulb
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/',              icon: Home,          label: 'Inicio',        end: true  },
  { to: '/instrucciones', icon: BookOpen,       label: 'Instrucciones', end: false },
  { to: '/negociacion',   icon: Target,         label: 'Negociación',   end: false },
  { to: '/pitch',         icon: MessageSquare,  label: 'Pitch',         end: false },
  { to: '/objeciones',    icon: Shield,         label: 'Objeciones',    end: false },
  { to: '/calculadora',   icon: Calculator,     label: 'Calculadora',   end: false },
  { to: '/requisitos',    icon: CheckSquare,    label: 'Requisitos',    end: false },
  { to: '/tips-ventas',   icon: Lightbulb,      label: 'Tips Ventas',   end: false },
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .sidebar-root { font-family: 'Poppins', sans-serif !important; }
        .sidebar-root * { font-family: 'Poppins', sans-serif !important; }
      `}</style>

      <div
        className="sidebar-root flex flex-col h-full"
        style={{ background: '#0a0a14' }}
      >

        {/* ── Logo ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 68,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: wide ? '0 20px' : '0',
            justifyContent: wide ? 'flex-start' : 'center',
            flexShrink: 0,
          }}
        >
          {wide ? (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  lineHeight: 1,
                }}>
                  rappi
                </span>
                <span style={{
                  background: 'rgba(255,68,31,0.18)',
                  color: '#FF441F',
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 5,
                  padding: '3px 7px',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                }}>
                  ASESOR
                </span>
              </div>
              <p style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginTop: 3,
              }}>
                Inside Sales
              </p>
            </div>
          ) : (
            <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px' }}>
              R
            </span>
          )}

          {isMobile ? (
            <button
              onClick={onMobileClose}
              style={{ color: 'rgba(255,255,255,0.35)', marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={onToggle}
              style={{
                width: 30, height: 30, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none',
                cursor: 'pointer', flexShrink: 0, marginLeft: 'auto',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; }}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          )}
        </div>

        {/* ── Nav ── */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: wide ? '14px 10px' : '14px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={isMobile ? onMobileClose : undefined}
              style={{ textDecoration: 'none' }}
            >
              {({ isActive }) => (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: wide ? 12 : 0,
                    justifyContent: wide ? 'flex-start' : 'center',
                    padding: wide ? '13px 16px' : '0',
                    width: wide ? 'auto' : 44,
                    height: wide ? 'auto' : 44,
                    margin: wide ? '0' : '0 auto',
                    borderRadius: 12,
                    background: isActive ? '#FF441F' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.18s, transform 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }}
                  className="group"
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{
                      flexShrink: 0,
                      color: isActive ? '#ffffff' : '#fb923c',
                      transition: 'color 0.15s',
                    }}
                  />
                  {wide && (
                    <span style={{
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#94a3b8',
                      letterSpacing: '0.01em',
                      transition: 'color 0.15s',
                      lineHeight: 1,
                    }}>
                      {label}
                    </span>
                  )}

                  {/* Tooltip modo colapsado */}
                  {!wide && (
                    <span style={{
                      position: 'absolute',
                      left: 'calc(100% + 12px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: '#1e1e2e',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: 8,
                      padding: '5px 10px',
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 50,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      opacity: 0,
                    }}
                      className="group-hover:opacity-100"
                    >
                      {label}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer usuario ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: wide ? '16px 14px' : '16px 8px', flexShrink: 0 }}>
          {wide ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,68,31,0.15)',
                color: '#FF441F',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                userSelect: 'none',
                border: '1.5px solid rgba(255,68,31,0.3)',
              }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.full_name}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.28)', flexShrink: 0, display: 'flex',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)'; }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              style={{
                width: 36, height: 36, margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.28)',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>

      </div>
    </>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[220px]'
        )}
        style={{ background: '#0a0a14' }}
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[260px] z-50 flex flex-col transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: '#0a0a14' }}
      >
        <SidebarContent isMobile onMobileClose={onMobileClose} />
      </aside>
    </>
  );
}
