import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency } from '../lib/currency';
import { OBJECIONES } from '../data/objeciones';
import {
  Search, X, MessageCircle, TrendingUp, ShieldCheck, ArrowRight,
  Percent, Clock, Lock, DollarSign, Star, BarChart2, Truck,
  HelpCircle, AlertTriangle, ThumbsDown, Users, Zap
} from 'lucide-react';

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .obj-root,
  .obj-root *,
  .obj-root input,
  .obj-root button,
  .obj-root p,
  .obj-root h2,
  .obj-root h3,
  .obj-root span,
  .obj-root div {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Layout: left list + right detail ── */
  .obj-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
    align-items: start;
  }

  /* ── Search ── */
  .obj-search-wrap {
    position: relative;
    margin-bottom: 14px;
  }
  .obj-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  .obj-search-input {
    width: 100%;
    height: 44px;
    padding-left: 42px !important;
    padding-right: 16px !important;
    border-radius: 12px !important;
    border: 1.5px solid #e5e7eb !important;
    font-size: 14px !important;
    background: #fafafa !important;
    color: #1A1A2E !important;
    outline: none !important;
    box-sizing: border-box !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
  }
  .obj-search-input:focus {
    border-color: #FF441F !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.10) !important;
    background: #fff !important;
  }

  /* ── Objection list ── */
  .obj-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
    max-height: 640px;
    overflow-y: auto;
    padding-right: 2px;
  }
  .obj-list::-webkit-scrollbar { width: 4px; }
  .obj-list::-webkit-scrollbar-track { background: transparent; }
  .obj-list::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

  /* ── Objection button — default ── */
  .obj-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  }
  .obj-btn:hover {
    border-color: rgba(255,68,31,0.35);
    background: #fffaf8;
    box-shadow: 0 2px 10px rgba(255,68,31,0.08);
  }

  /* ── Objection button — active ── */
  .obj-btn.active {
    border-color: #FF441F;
    background: #fff7f5;
    box-shadow: 0 4px 16px rgba(255,68,31,0.14);
    transform: translateX(3px);
  }

  .obj-btn-num {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .obj-btn-num.default {
    background: rgba(255,68,31,0.08);
    color: #FF441F;
  }
  .obj-btn-num.active {
    background: #FF441F;
    color: #fff;
  }

  .obj-btn-icon {
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .obj-btn-title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
    flex: 1;
    transition: color 0.2s ease;
  }
  .obj-btn-title.default { color: #1A1A2E; }
  .obj-btn-title.active  { color: #c2410c; font-weight: 700; }

  .obj-btn-rp {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 6px;
    flex-shrink: 0;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .obj-btn-rp.default { background: rgba(255,68,31,0.08); color: #FF441F; }
  .obj-btn-rp.active  { background: #FF441F; color: #fff; }

  /* ── Detail panel ── */
  .obj-detail {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }

  .obj-detail-header {
    background: linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%);
    padding: 24px 28px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }
  .obj-detail-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 4px;
  }
  .obj-detail-title {
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    line-height: 1.25;
  }
  .obj-detail-close {
    background: rgba(255,255,255,0.10);
    border: none;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: rgba(255,255,255,0.6);
    flex-shrink: 0;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .obj-detail-close:hover {
    background: rgba(255,255,255,0.18);
    color: #fff;
  }

  .obj-detail-body {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Inner content blocks ── */
  .obj-block {
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .obj-block-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .obj-block-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .obj-block-text {
    font-size: 13.5px;
    font-weight: 500;
    line-height: 1.70;
  }

  /* Blue block — Empatía */
  .obj-block.blue {
    background: rgba(219,234,254,0.55);
    border: 1px solid #bfdbfe;
  }
  .obj-block.blue .obj-block-icon { background: #dbeafe; }
  .obj-block.blue .obj-block-label { color: #1d4ed8; }
  .obj-block.blue .obj-block-text  { color: #1e3a5f; }

  /* Orange block — Argumento */
  .obj-block.orange {
    background: rgba(255,237,213,0.55);
    border: 1px solid #fed7aa;
  }
  .obj-block.orange .obj-block-icon { background: #ffedd5; }
  .obj-block.orange .obj-block-label { color: #c2410c; }
  .obj-block.orange .obj-block-text  { color: #7c2d12; }

  /* Dark block — Cierre */
  .obj-block.dark {
    background: #1A1A2E;
    border: 1px solid #2d2d4e;
  }
  .obj-block.dark .obj-block-icon { background: rgba(255,68,31,0.18); }
  .obj-block.dark .obj-block-label { color: rgba(255,255,255,0.45); }
  .obj-block.dark .obj-block-text  { color: rgba(255,255,255,0.88); font-weight: 600; }

  /* ── Flujo de manejo ── */
  .obj-flujo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 14px 18px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }
  .obj-flujo-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #9ca3af;
    width: 100%;
    margin-bottom: 6px;
  }
  .obj-flujo-step {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 600;
  }
  .obj-flujo-arrow { color: #d1d5db; font-size: 12px; }

  /* ── Versión corta ── */
  .obj-short {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 18px;
  }
  .obj-short-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #9ca3af;
    margin-bottom: 5px;
  }
  .obj-short-text {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.65;
  }

  /* ── Empty state (no objection selected) ── */
  .obj-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 380px;
    text-align: center;
    gap: 12px;
    padding: 40px;
  }
  .obj-placeholder-ring {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(255,68,31,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
  }

  /* ── Empty search ── */
  .obj-empty {
    text-align: center;
    padding: 40px 0;
    color: #9ca3af;
  }

  /* ── Action button ── */
  .btn-obj-primary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #E8360E 0%, #FF5A2C 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(232,54,14,0.30);
    transition: all 0.25s ease;
    margin-top: 8px;
  }
  .btn-obj-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232,54,14,0.40);
  }

  /* ── Responsive ── */
  @media (max-width: 740px) {
    .obj-layout {
      grid-template-columns: 1fr;
    }
    .obj-list {
      max-height: 280px;
    }
  }
`;

/* ─── Objection icon map ─────────────────────────────────────────────────── */
function getObjIcon(titulo: string, size = 14) {
  const t = titulo.toLowerCase();
  if (t.includes('comis') || t.includes('%'))          return <Percent size={size} />;
  if (t.includes('tiempo') || t.includes('entrega'))   return <Clock size={size} />;
  if (t.includes('exclusiv'))                           return <Lock size={size} />;
  if (t.includes('precio') || t.includes('costo'))     return <DollarSign size={size} />;
  if (t.includes('competencia') || t.includes('otro')) return <BarChart2 size={size} />;
  if (t.includes('reparto') || t.includes('logístic')) return <Truck size={size} />;
  if (t.includes('marca') || t.includes('imagen'))     return <Star size={size} />;
  if (t.includes('clientes') || t.includes('usuario')) return <Users size={size} />;
  if (t.includes('no me int') || t.includes('rechazo'))return <ThumbsDown size={size} />;
  if (t.includes('contrato') || t.includes('términos'))return <ShieldCheck size={size} />;
  if (t.includes('rappi'))                              return <Zap size={size} />;
  return <HelpCircle size={size} />;
}

/* ─── Split pitch into three narrative blocks ────────────────────────────── */
function splitPitch(pitch: string): { empatia: string; argumento: string; cierre: string } {
  const sentences = pitch
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length <= 2) {
    return { empatia: sentences[0] || pitch, argumento: sentences[1] || '', cierre: '' };
  }

  const third = Math.ceil(sentences.length / 3);
  return {
    empatia:   sentences.slice(0, third).join(' '),
    argumento: sentences.slice(third, third * 2).join(' '),
    cierre:    sentences.slice(third * 2).join(' '),
  };
}

/* ─── Helper ─────────────────────────────────────────────────────────────── */
function injectObjecion(text: string, mzTicketAvg: string): string {
  return text.replace(/\{MZ_TICKET_AVG\}/g, mzTicketAvg);
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function Objeciones() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const { negociacion } = useNegociacion();

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const ticketAvg = m?.mz_ticket_avg != null
    ? formatCurrency(m.mz_ticket_avg, cc)
    : '[Ticket promedio]';

  const filtered = OBJECIONES.filter(o =>
    query === '' || o.titulo.toLowerCase().includes(query.toLowerCase())
  );

  const selectedObj = OBJECIONES.find(o => o.id === selected);

  return (
    <AppLayout title="Objeciones">
      <style>{css}</style>
      <div className="obj-root space-y-5">

        {/* ── Two-column layout ── */}
        <div className="obj-layout">

          {/* ── LEFT: list ── */}
          <div>
            {/* Search */}
            <div className="obj-search-wrap">
              <Search size={15} className="obj-search-icon" />
              <input
                type="text"
                placeholder="Buscar objeción..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="obj-search-input"
              />
            </div>

            {/* Counter */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              {filtered.length} objecion{filtered.length !== 1 ? 'es' : ''}
            </p>

            {filtered.length === 0 ? (
              <div className="obj-empty">
                <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
                <p style={{ fontSize: 13 }}>Sin resultados para «{query}»</p>
              </div>
            ) : (
              <div className="obj-list">
                {filtered.map(obj => {
                  const isActive = selected === obj.id;
                  return (
                    <button
                      key={obj.id}
                      className={`obj-btn${isActive ? ' active' : ''}`}
                      onClick={() => setSelected(isActive ? null : obj.id)}
                    >
                      {/* Number bubble */}
                      <span className={`obj-btn-num ${isActive ? 'active' : 'default'}`}>
                        {obj.id}
                      </span>

                      {/* Thematic icon */}
                      <span className="obj-btn-icon" style={{ color: isActive ? '#FF441F' : '#9ca3af' }}>
                        {getObjIcon(obj.titulo)}
                      </span>

                      {/* Title */}
                      <span className={`obj-btn-title ${isActive ? 'active' : 'default'}`}>
                        {obj.titulo}
                      </span>

                      {/* RP badge */}
                      {obj.isRP && (
                        <span className={`obj-btn-rp ${isActive ? 'active' : 'default'}`}>
                          RP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: detail ── */}
          <div className="obj-detail">
            {!selectedObj ? (
              <div className="obj-placeholder">
                <div className="obj-placeholder-ring">
                  <MessageCircle size={30} color="#FF441F" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#1A1A2E', marginBottom: 4 }}>
                  Selecciona una objeción
                </p>
                <p style={{ fontSize: 13, color: '#9ca3af', maxWidth: 240, lineHeight: 1.55 }}>
                  Elige cualquier objeción de la lista para ver el contra-pitch y el flujo de manejo.
                </p>
              </div>
            ) : (() => {
              const injectedPitch = injectObjecion(selectedObj.pitchPropuesto, ticketAvg);
              const injectedSimple = injectObjecion(selectedObj.simplificado, ticketAvg);
              const { empatia, argumento, cierre } = splitPitch(injectedPitch);

              return (
                <>
                  {/* Header */}
                  <div className="obj-detail-header">
                    <div>
                      <p className="obj-detail-eyebrow">Objeción {selectedObj.id}</p>
                      <h3 className="obj-detail-title">{selectedObj.titulo}</h3>
                    </div>
                    <button className="obj-detail-close" onClick={() => setSelected(null)}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="obj-detail-body">

                    {/* Block 1 — Empatía */}
                    {empatia && (
                      <div className="obj-block blue">
                        <div className="obj-block-icon">
                          <MessageCircle size={18} color="#2563eb" />
                        </div>
                        <div>
                          <p className="obj-block-label">Empatía · Cómo iniciar</p>
                          <p className="obj-block-text">{empatia}</p>
                        </div>
                      </div>
                    )}

                    {/* Block 2 — Argumento */}
                    {argumento && (
                      <div className="obj-block orange">
                        <div className="obj-block-icon">
                          <TrendingUp size={18} color="#FF441F" />
                        </div>
                        <div>
                          <p className="obj-block-label">Argumento · El punto fuerte</p>
                          <p className="obj-block-text">{argumento}</p>
                        </div>
                      </div>
                    )}

                    {/* Block 3 — Cierre */}
                    {cierre && (
                      <div className="obj-block dark">
                        <div className="obj-block-icon">
                          <ArrowRight size={18} color="#FF441F" />
                        </div>
                        <div>
                          <p className="obj-block-label">Cierre · La pregunta clave</p>
                          <p className="obj-block-text">{cierre}</p>
                        </div>
                      </div>
                    )}

                    {/* Versión corta */}
                    <div className="obj-short">
                      <p className="obj-short-label">⚡ Versión corta</p>
                      <p className="obj-short-text">{injectedSimple}</p>
                    </div>

                    {/* Flujo */}
                    {selectedObj.flujo && (
                      <div className="obj-flujo">
                        <p className="obj-flujo-label">Flujo de manejo</p>
                        {selectedObj.flujo.split(' → ').map((step, i, arr) => (
                          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                              className="obj-flujo-step"
                              style={{
                                background: i === 0
                                  ? 'rgba(239,68,68,0.10)'
                                  : i === arr.length - 1
                                    ? 'rgba(16,185,129,0.10)'
                                    : '#f3f4f6',
                                color: i === 0
                                  ? '#ef4444'
                                  : i === arr.length - 1
                                    ? '#10b981'
                                    : '#6b7280',
                              }}
                            >
                              {step}
                            </span>
                            {i < arr.length - 1 && <span className="obj-flujo-arrow">→</span>}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* ── CTA ── */}
        <button className="btn-obj-primary" onClick={() => navigate('/propuesta')}>
          <MessageCircle size={15} /> Enviar propuesta WhatsApp →
        </button>

      </div>
    </AppLayout>
  );
}
