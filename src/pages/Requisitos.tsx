import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { REQUISITOS } from '../data/requisitos';
import { Info, X, FileText, Utensils, Image, Settings, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';

const STORAGE_KEY = 'smartpitch_requisitos';
const CATEGORIES = ['Documentos', 'Menú', 'Imágenes de marca', 'Operación'];
const TIMELINE = [
  { day: 'Día 1',      label: 'Firma',               icon: '✍️' },
  { day: 'Días 1-3',   label: 'Carga de contenido',   icon: '📋' },
  { day: 'Días 3-5',   label: 'Revisión Rappi',        icon: '🔍' },
  { day: 'Días 7-10',  label: '¡Restaurante activo!',  icon: '🚀' },
];

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .req-root, .req-root * {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }
  .req-header { margin-bottom: 28px; }
  .req-title { font-size: 26px; font-weight: 900; color: #0f172a; line-height: 1.15; margin-bottom: 6px; }
  .req-sub { font-size: 14px; color: #94a3b8; font-weight: 500; }

  /* Two-column dashboard grid */
  .req-grid {
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: 24px;
    align-items: start;
  }

  /* Left columns items style */
  .req-cat-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
    overflow: hidden;
    margin-bottom: 20px;
  }
  .req-cat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  /* Category colors customization */
  .header-documentos { background-color: rgba(59, 130, 246, 0.05); }
  .header-menu { background-color: rgba(255, 111, 72, 0.05); }
  .header-imagenes { background-color: rgba(168, 85, 247, 0.05); }
  .header-operacion { background-color: rgba(16, 185, 129, 0.05); }

  .req-cat-title { font-size: 15px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 10px; }
  .req-cat-badge { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; }

  /* Row items template */
  .req-item-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
    border-left: 3px solid transparent;
    transition: all 0.22s ease;
  }
  .req-item-row:last-child { border-bottom: none; }
  
  /* Revitalized dynamic checked state */
  .req-item-row.is-checked { 
    background-color: rgba(16, 185, 129, 0.06) !important; 
    border-left-color: #10b981;
  }
  .req-item-text { font-size: 14px; flex: 1; line-height: 1.45; color: #1e293b; font-weight: 600; transition: all 0.2s; }
  .req-item-text.line-checked { color: #64748b; font-weight: 500; }

  /* Right column wrapper */
  .req-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 20px; }

  /* Premium Progress Panel */
  .req-progress-card {
    background: linear-gradient(135deg, #FF6F48 0%, #FF5630 40%, #FF8A48 100%);
    border-radius: 20px; padding: 32px 24px;
    box-shadow: 0 10px 30px rgba(255, 94, 54, 0.15);
    text-align: center; color: #fff;
  }
  .req-progress-title { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 4px; letter-spacing: -0.01em; }
  .req-progress-sub { font-size: 13px; color: rgba(255,255,255,0.85); margin-bottom: 24px; font-weight: 500; }
  
  /* Mathematical vertical and horizontal layout alignment centering fixed */
  .req-pct-circle {
    width: 84px; height: 84px; background: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px auto; box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }
  .req-pct-text { font-size: 24px; font-weight: 900; color: #FF5630; line-height: 1; transform: translateY(1px); }

  /* Timeline */
  .req-timeline-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 28px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
  .req-timeline-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 28px; text-align: center; }

  @media (max-width: 850px) {
    .req-grid { grid-template-columns: 1fr; }
    .req-sidebar { position: static; }
  }
`;

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

  // Custom theme styles maps for headers
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Documentos': return { className: 'header-documentos', colorClass: 'text-blue-600', icon: <FileText size={16} className="text-blue-600" /> };
      case 'Menú': return { className: 'header-menu', colorClass: 'text-orange-600', icon: <Utensils size={16} className="text-orange-600" /> };
      case 'Imágenes de marca': return { className: 'header-imagenes', colorClass: 'text-purple-600', icon: <Image size={16} className="text-purple-600" /> };
      default: return { className: 'header-operacion', colorClass: 'text-emerald-600', icon: <Settings size={16} className="text-emerald-600" /> };
    }
  };

  return (
    <AppLayout title="Requisitos">
      <style>{css}</style>
      <div className="req-root space-y-6">
        
        {/* Header simple */}
        <div className="req-header">
          <h1 className="req-title">📋 Requisitos para Vinculación</h1>
          <p className="req-sub">Completa la validación documental y operativa del restaurante para activar la tienda</p>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="req-grid">
          
          {/* LEFT COLUMN: Categories Modulators */}
          <div className="req-left-workspace">
            {CATEGORIES.map(cat => {
              const items = REQUISITOS.filter(r => r.categoria === cat);
              const catDone = items.filter(r => checked[r.id]).length;
              const isAllDone = catDone === items.length;
              const catStyles = getCategoryStyles(cat);

              return (
                <div key={cat} className="req-cat-card">
                  <div className={cn("req-cat-header", catStyles.className)}>
                    <div className="req-cat-title">
                      {catStyles.icon}
                      <span className={catStyles.colorClass}>{cat}</span>
                    </div>
                    <span className={cn(
                      "req-cat-badge font-bold",
                      isAllDone ? "bg-emerald-500 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200"
                    )}>
                      {catDone} / {items.length}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {items.map((req) => (
                      <div 
                        key={req.id} 
                        className={cn("req-item-row", checked[req.id] && "is-checked")}
                      >
                        <button
                          type="button"
                          onClick={() => toggle(req.id)}
                          className={cn(
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all outline-none',
                            checked[req.id] 
                              ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-200' 
                              : 'border-slate-300 hover:border-orange-400 bg-white'
                          )}
                        >
                          {checked[req.id] && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        <span className={cn("req-item-text", checked[req.id] && "line-checked")}>
                          {req.texto}
                        </span>

                        <button
                          type="button"
                          onClick={() => setTooltip(tooltip === req.id ? null : req.id)}
                          className={cn(
                            "p-1 rounded-full transition-colors shrink-0",
                            tooltip === req.id ? "text-blue-500 bg-blue-50" : "text-slate-300 hover:text-blue-500 hover:bg-slate-50"
                          )}
                        >
                          <Info size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Real-time Interactive Control Panel */}
          <div className="req-sidebar">
            
            {/* Progress Wrapper Card */}
            <div className="req-progress-card">
              <p className="req-progress-title">Progreso de activación</p>
              <p className="req-progress-sub">{totalDone} de {REQUISITOS.length} completados</p>
              
              {/* Perfectly centered layout alignment matrix */}
              <div className="req-pct-circle">
                <div className="req-pct-text">{pct}%</div>
              </div>

              <div style={{ height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: '#fff', borderRadius: 999, transition: 'width 0.4s ease' }} />
              </div>

              {totalDone === REQUISITOS.length && (
                <div className="mt-4 flex items-center justify-center gap-2 bg-white/15 py-2 px-3 rounded-xl border border-white/20 animate-pulse">
                  <CheckCircle2 size={16} className="text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider">¡Todo listo para activar!</span>
                </div>
              )}
            </div>

            {/* Context Tooltip Description Alert */}
            {tooltipReq && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex gap-4 transition-all duration-300 shadow-sm">
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 mb-1">{tooltipReq.texto}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{tooltipReq.detalle}</p>
                </div>
                <button 
                  onClick={() => setTooltip(null)} 
                  className="text-slate-400 hover:text-slate-600 self-start p-0.5 rounded-lg hover:bg-slate-200/50 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Premium Energetic Activation Timeline */}
            <div className="req-timeline-card">
              <p className="req-timeline-title">Timeline de activación</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
                
                {/* Vertical aesthetic timeline connector axis */}
                <div style={{ position: 'absolute', top: 14, bottom: 14, left: 19, width: 3, background: '#f1f5f9', zIndex: 0 }} />

                {TIMELINE.map((step, i) => {
                  const isCurrentActive = (pct >= 100 && i === 3) || (pct >= 60 && i === 2) || (pct >= 20 && i === 1) || (pct >= 0 && i === 0);
                  
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
                      <div style={{ 
                        width: 42, height: 42, borderRadius: '50%', 
                        background: isCurrentActive ? '#fff' : '#f8fafc',
                        border: isCurrentActive ? '2.5px solid #FF5630' : '2px solid #cbd5e1',
                        display: 'flex', alignItems: 'center', justifycontent: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                        boxShadow: isCurrentActive ? '0 6px 16px rgba(255,86,48,0.22)' : 'none',
                        transition: 'all 0.3s'
                      }}>
                        {step.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: isCurrentActive ? '#FF5630' : '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>{step.day}</p>
                        <p style={{ fontSize: 13, fontWeight: 800, color: isCurrentActive ? '#0f172a' : '#475569', margin: 0, marginTop: 2 }}>{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Form Component */}
            <Button variant="outline" onClick={() => setChecked({})} className="w-full text-xs text-slate-500 font-bold bg-slate-50 hover:bg-slate-100 border-slate-200 py-2.5 rounded-xl transition-all">
              Resetear checklist de requisitos
            </Button>
          </div>

        </div>

        {/* Footnote */}
        <p className="calc-disclaimer">
          Proyección estimada · No incluye costos operativos del restaurante
        </p>

      </div>
    </AppLayout>
  );
}
