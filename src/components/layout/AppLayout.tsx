import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { useNegociacion } from '../../context/NegociacionContext';
import { RotateCcw } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { negociacion, hasActiveNegociacion, clearNegociacion } = useNegociacion();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
        <Header title={title} onMenuClick={() => setMobileOpen(true)} />
        {hasActiveNegociacion && (
          <div style={{ background: '#1A1A2E', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF441F', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Restaurante activo</span>
              <span style={{ fontSize: 13, color: 'white', fontWeight: 700, marginLeft: 4 }}>
                {negociacion.restaurant_name || `${negociacion.city} · ${negociacion.tag}`}
              </span>
            </div>
            <button
              onClick={clearNegociacion}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#FF441F')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
            >
              <RotateCcw size={12} /> Reiniciar
            </button>
          </div>
        )}
        <main className="flex-1 pb-20 md:pb-0 flex items-center">
          <div style={{ padding: '32px 48px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
