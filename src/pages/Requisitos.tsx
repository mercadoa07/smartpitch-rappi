import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { REQUISITOS } from '../data/requisitos';
import { Info, X } from 'lucide-react';
import { cn } from '../lib/cn';

const STORAGE_KEY = 'smartpitch_requisitos';
const CATEGORIES = ['Documentos', 'Menú', 'Imágenes de marca', 'Operación'];
const TIMELINE = [
  { day: 'Día 1',      label: 'Firma',                icon: '✍️' },
  { day: 'Días 1-3',   label: 'Carga de contenido',   icon: '📋' },
  { day: 'Días 3-5',   label: 'Revisión Rappi',        icon: '🔍' },
  { day: 'Días 7-10',  label: '¡Restaurante activo!',  icon: '🚀' },
];

export function Requisitos() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const totalDone = REQUISITOS.filter(r => checked[r.id]).length;
  const tooltipReq = REQUISITOS.find(r => r.id === tooltip);
  const pct = REQUISITOS.length > 0 ? Math.round((totalDone / REQUISITOS.length) * 100) : 0;

  return (
    <AppLayout title="Requisitos">
      <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Título */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 6 }}>
            Requisitos para vinculación
          </h1>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Completa todos los requisitos para activar el restaurante</p>
        </div>

        {/* Progreso */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 18, padding: '32px 36px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>Progreso de activación</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>{totalDone} de {REQUISITOS.length} completados</p>
          <div style={{ height: 10, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#FF441F', borderRadius: 999, transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#FF441F' }}>{pct}%</p>
          {totalDone === REQUISITOS.length && (
            <p style={{ fontSize: 14, color: '#10b981', fontWeight: 700, marginTop: 12 }}>✅ ¡Todo listo para activar!</p>
          )}
        </div>

        {/* Categorías */}
        {CATEGORIES.map(cat => {
          const items = REQUISITOS.filter(r => r.categoria === cat);
          const catDone = items.filter(r => checked[r.id]).length;
          return (
            <Card key={cat}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E' }}>{cat}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: catDone === items.length ? '#10b981' : '#9ca3af' }}>{catDone}/{items.length}</span>
              </div>
              <div>
                {items.map((req, i) => (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderBottom: i < items.length - 1 ? '1px solid #f9fafb' : 'none' }}>
                    <button
                      type="button"
                      onClick={() => toggle(req.id)}
                      className={cn(
                        'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                        checked[req.id] ? 'bg-primary border-primary' : 'border-gray-medium hover:border-primary/50'
                      )}
                    >
                      {checked[req.id] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <p style={{ fontSize: 14, flex: 1, lineHeight: 1.4, color: checked[req.id] ? '#9ca3af' : '#1A1A2E', fontWeight: checked[req.id] ? 400 : 500, textDecoration: checked[req.id] ? 'line-through' : 'none' }}>
                      {req.texto}
                    </p>
                    <button
                      type="button"
                      onClick={() => setTooltip(tooltip === req.id ? null : req.id)}
                      style={{ color: '#d1d5db', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#3B82F6')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                    >
                      <Info size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Tooltip detalle */}
        {tooltipReq && (
          <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{tooltipReq.texto}</p>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{tooltipReq.detalle}</p>
            </div>
            <button onClick={() => setTooltip(null)} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Timeline horizontal */}
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 18, padding: '32px 36px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 32, textAlign: 'center' }}>Timeline de activación</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
            {/* Línea de fondo */}
            <div style={{ position: 'absolute', top: 18, left: '12.5%', right: '12.5%', height: 2, background: 'rgba(255,68,31,0.15)', zIndex: 0 }} />

            {TIMELINE.map((step, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                {/* Círculo */}
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FF441F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 12, boxShadow: '0 0 0 4px rgba(255,68,31,0.12)' }}>
                  {step.icon}
                </div>
                {/* Texto */}
                <p style={{ fontSize: 11, color: '#FF441F', fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{step.day}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', textAlign: 'center', lineHeight: 1.3 }}>{step.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" onClick={() => setChecked({})} className="w-full">
          Resetear checklist
        </Button>

      </div>
    </AppLayout>
  );
}
