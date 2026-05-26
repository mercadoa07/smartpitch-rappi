import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency } from '../lib/currency';
import { OBJECIONES } from '../data/objeciones';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/cn';

function injectObjecion(text: string, mzTicketAvg: string): string {
  return text.replace(/\{MZ_TICKET_AVG\}/g, mzTicketAvg);
}

export function Objeciones() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const { negociacion } = useNegociacion();
  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const ticketAvg = m?.mz_ticket_avg != null ? formatCurrency(m.mz_ticket_avg, cc) : '[Ticket promedio]';

  const filtered = OBJECIONES.filter(o =>
    query === '' || o.titulo.toLowerCase().includes(query.toLowerCase())
  );

  const selectedObj = OBJECIONES.find(o => o.id === selected);

  return (
    <AppLayout title="Objeciones">
      <div className="space-y-6">

        {/* Buscador */}
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Buscar objeción..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', height: 40, paddingLeft: 40, paddingRight: 16, borderRadius: 12, border: '1px solid #E0E0E0', fontSize: 14, background: 'white', color: '#1A1A2E', outline: 'none' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#FF441F'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,68,31,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Grid de cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {filtered.map(obj => (
            <button
              key={obj.id}
              onClick={() => setSelected(selected === obj.id ? null : obj.id)}
              className={cn(
                'rounded-xl border text-left transition-all',
                selected === obj.id
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white border-gray-200 hover:border-primary/40 hover:shadow-sm'
              )}
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                minWidth: 22,
                height: 22,
                borderRadius: '50%',
                background: selected === obj.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,68,31,0.1)',
                color: selected === obj.id ? 'white' : '#FF441F',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {obj.id}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: selected === obj.id ? 'white' : '#1A1A2E', lineHeight: 1.3 }}>
                {obj.titulo}
              </span>
              {obj.isRP && (
                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: selected === obj.id ? 'rgba(255,255,255,0.25)' : 'rgba(255,68,31,0.1)', color: selected === obj.id ? 'white' : '#FF441F', padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>
                  RP
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 14 }}>No se encontraron objeciones con "{query}"</p>
          </div>
        )}

        {/* Detalle de objeción seleccionada */}
        {selectedObj && (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '32px 36px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Objeción {selectedObj.id}</p>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E' }}>{selectedObj.titulo}</h3>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Pitch propuesto */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Pitch propuesto</p>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, fontWeight: 500 }}>
                  {injectObjecion(selectedObj.pitchPropuesto, ticketAvg)}
                </p>
              </div>

              {/* Versión corta */}
              <div style={{ background: '#F9FAFB', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 20px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Versión corta</p>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>
                  {injectObjecion(selectedObj.simplificado, ticketAvg)}
                </p>
              </div>

              {/* Flujo */}
              {selectedObj.flujo && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Flujo de manejo</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                    {selectedObj.flujo.split(' → ').map((step, i, arr) => (
                      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 600,
                          background: i === 0 ? 'rgba(239,68,68,0.1)' : i === arr.length - 1 ? 'rgba(16,185,129,0.1)' : '#f3f4f6',
                          color: i === 0 ? '#ef4444' : i === arr.length - 1 ? '#10b981' : '#6b7280'
                        }}>{step}</span>
                        {i < arr.length - 1 && <span style={{ color: '#d1d5db', fontSize: 12 }}>→</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Button className="w-full" onClick={() => navigate('/propuesta')}>
            Enviar propuesta WhatsApp →
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}
