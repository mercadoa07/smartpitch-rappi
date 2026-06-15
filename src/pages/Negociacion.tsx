import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { Input } from '../components/ui/Input';
import { MetricCard } from '../components/ui/MetricCard';
import { useNegociacion } from '../context/NegociacionContext';
import { getCountries, getCities, getMicrozones, getTags, getMetrics } from '../lib/queries';
import { formatCurrency, formatNumber, getCurrencyLabel } from '../lib/currency';
import { COMISIONES } from '../data/comisiones';

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  /* ── Force Poppins on every element in this screen ── */
  .neg-root,
  .neg-root *,
  .neg-root select,
  .neg-root input,
  .neg-root button,
  .neg-root label,
  .neg-root p,
  .neg-root h2,
  .neg-root span,
  .neg-root div {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Split container ── */
  .neg-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
    max-width: 900px;
    margin: 0 auto;
  }

  /* ── Left column ── */
  .neg-form-col {
    background: #ffffff;
    padding: 44px 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .neg-form-col .col-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #FF441F;
    margin-bottom: 6px;
  }

  .neg-form-col .col-title {
    font-size: 22px;
    font-weight: 800;
    color: #1A1A2E;
    margin-bottom: 28px;
    line-height: 1.2;
  }

  .neg-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  .neg-fields .span-2 {
    grid-column: 1 / -1;
  }

  /* ── Input / Select overrides — larger padding, full width, Poppins ── */
  .neg-form-col select,
  .neg-form-col input[type="text"],
  .neg-form-col input:not([type]) {
    font-family: 'Poppins', system-ui, sans-serif !important;
    border-radius: 12px !important;
    border: 1.5px solid #e5e7eb !important;
    transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
    font-size: 14px !important;
    padding: 12px 16px !important;
    background: #fafafa !important;
    color: #1A1A2E !important;
    outline: none !important;
    width: 100% !important;
    box-sizing: border-box !important;
    min-height: 46px !important;
  }
  .neg-form-col select:focus,
  .neg-form-col input[type="text"]:focus,
  .neg-form-col input:not([type]):focus {
    border-color: #FF441F !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.12) !important;
    background: #fff !important;
  }
  /* Label typography */
  .neg-form-col label {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #374151 !important;
    margin-bottom: 5px !important;
    display: block;
  }

  /* ── Action buttons ── */
  .neg-actions {
    margin-top: auto;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Primary — stronger orange, deeper shadow */
  .btn-primary-rappi {
    font-family: 'Poppins', system-ui, sans-serif !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.02em;
    color: #fff;
    background: linear-gradient(135deg, #E8360E 0%, #FF5A2C 100%);
    border: none;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 6px 20px rgba(232,54,14,0.38);
    position: relative;
    overflow: hidden;
  }
  .btn-primary-rappi:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(232,54,14,0.48);
    background: linear-gradient(135deg, #d12e0a 0%, #f04e22 100%);
  }
  .btn-primary-rappi:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 3px 10px rgba(232,54,14,0.30);
  }
  .btn-primary-rappi:disabled {
    opacity: 0.40;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Secondary — soft gray pill, clearly subordinate */
  .btn-secondary-rappi {
    font-family: 'Poppins', system-ui, sans-serif !important;
    width: 100%;
    padding: 11px 24px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    text-align: center;
  }
  .btn-secondary-rappi:hover {
    background: #e5e7eb;
    color: #374151;
  }

  /* ── Right column ── */
  .neg-context-col {
    background: linear-gradient(150deg, #E8360E 0%, #FF5A2C 55%, #ffb347 100%);
    padding: 44px 36px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 26px;
    position: relative;
    overflow: hidden;
  }

  /* Decorative circles */
  .neg-context-col::before,
  .neg-context-col::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    pointer-events: none;
  }
  .neg-context-col::before {
    width: 260px;
    height: 260px;
    top: -80px;
    right: -80px;
  }
  .neg-context-col::after {
    width: 180px;
    height: 180px;
    bottom: -60px;
    left: -40px;
  }

  .ctx-icon-ring {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Headline — single line, slightly smaller to never wrap */
  .ctx-headline {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 19px;
    font-weight: 900;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ctx-body {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 13.5px;
    color: rgba(255,255,255,0.88);
    line-height: 1.65;
    font-weight: 500;
  }

  .ctx-steps {
    display: flex;
    flex-direction: column;
    gap: 11px;
    position: relative;
    z-index: 1;
  }

  .ctx-step {
    display: flex;
    align-items: flex-start;
    gap: 11px;
  }

  /* Step number — pending state */
  .ctx-step-num {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: rgba(255,255,255,0.20);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 12px;
    font-weight: 800;
    color: rgba(255,255,255,0.75);
    flex-shrink: 0;
    margin-top: 1px;
    transition: background 0.25s ease;
  }

  /* Step number — done state (class toggled in JSX) */
  .ctx-step-num.done {
    background: rgba(255,255,255,0.55);
  }

  .ctx-step-text {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 13px;
    font-weight: 600;
    color: rgba(255,255,255,0.78);
    line-height: 1.5;
    transition: color 0.25s ease;
  }
  .ctx-step-text.done {
    color: #fff;
  }

  .ctx-divider {
    border: none;
    border-top: 1px solid rgba(255,255,255,0.20);
  }

  .ctx-badge {
    font-family: 'Poppins', system-ui, sans-serif !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(4px);
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    width: fit-content;
  }

  /* ── Section titles below split ── */
  .neg-section-title {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 18px;
    font-weight: 700;
    color: #1A1A2E;
    margin-bottom: 16px;
  }

  /* ── Comisiones cards ── */
  .com-card {
    font-family: 'Poppins', system-ui, sans-serif !important;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 22px 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .com-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
  .com-card-label {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 11px;
    /* Changed from #9ca3af to strong dark slate for legibility */
    color: #1e293b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 8px;
  }
  .com-card-value {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 32px;
    font-weight: 800;
    color: #FF441F;
    line-height: 1;
  }
  .com-card-tag {
    font-family: 'Poppins', system-ui, sans-serif !important;
    font-size: 11px;
    color: #10b981;
    font-weight: 700;
    margin-top: 6px;
  }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .neg-split {
      grid-template-columns: 1fr;
      border-radius: 16px;
    }
    .neg-context-col {
      padding: 32px 28px;
    }
    .neg-context-col::before { display: none; }
    .neg-fields {
      grid-template-columns: 1fr;
    }
    .neg-form-col {
      padding: 32px 24px 28px;
    }
    .ctx-headline {
      white-space: normal;
      font-size: 20px;
    }
  }
`;

/* ─── Checklist steps ────────────────────────────────────────────────────── */
const STEPS = [
  { label: 'Elige país y ciudad objetivo' },
  { label: 'Define la microzona de impacto' },
  { label: 'Selecciona la categoría del negocio' },
  { label: 'Diligencia el nombre del restaurante antes de lanzar el pitch ganador' },
];

/* ─── Check icon ─────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FF441F" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function Negociacion() {
  const navigate = useNavigate();
  const { negociacion, setNegociacion, clearNegociacion } = useNegociacion();

  const [countries, setCountries] = useState<{ country_code: string; country_name: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [microzones, setMicrozones] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingMicrozones, setLoadingMicrozones] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    getCountries().then(data => { setCountries(data); setLoadingCountries(false); });
  }, []);

  useEffect(() => {
    if (!negociacion.country_code) { setCities([]); return; }
    setLoadingCities(true);
    getCities(negociacion.country_code).then(data => { setCities(data); setLoadingCities(false); });
  }, [negociacion.country_code]);

  useEffect(() => {
    if (!negociacion.city) { setMicrozones([]); return; }
    setLoadingMicrozones(true);
    getMicrozones(negociacion.country_code, negociacion.city).then(data => { setMicrozones(data); setLoadingMicrozones(false); });
  }, [negociacion.city]);

  useEffect(() => {
    if (!negociacion.microzone_id) { setTags([]); return; }
    setLoadingTags(true);
    getTags(negociacion.country_code, negociacion.city, negociacion.microzone_id).then(data => { setTags(data); setLoadingTags(false); });
  }, [negociacion.microzone_id]);

  useEffect(() => {
    if (!negociacion.country_code || !negociacion.city || !negociacion.microzone_id || !negociacion.tag) return;
    setLoadingMetrics(true);
    getMetrics(negociacion.country_code, negociacion.city, negociacion.microzone_id, negociacion.tag).then(data => {
      setNegociacion({ ...negociacion, metrics: data });
      setLoadingMetrics(false);
    });
  }, [negociacion.tag]);

  const handleCountryChange = (v: string) => {
    const c = countries.find(x => x.country_code === v);
    setNegociacion({ ...negociacion, country_code: v, country_name: c?.country_name || '', city: '', microzone_id: '', tag: '', metrics: null });
  };
  const handleCityChange = (v: string) => setNegociacion({ ...negociacion, city: v, microzone_id: '', tag: '', metrics: null });
  const handleMicrozoneChange = (v: string) => setNegociacion({ ...negociacion, microzone_id: v, tag: '', metrics: null });
  const handleTagChange = (v: string) => setNegociacion({ ...negociacion, tag: v, metrics: null });

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const hasAllFilters = !!(negociacion.country_code && negociacion.city && negociacion.microzone_id && negociacion.tag);

  // Step 4 (restaurant name) is done when all 4 selects are filled AND a name has been typed
  const stepsDone = [
    !!negociacion.country_code && !!negociacion.city,
    !!negociacion.microzone_id,
    !!negociacion.tag,
    !!(negociacion.restaurant_name && negociacion.restaurant_name.trim().length > 0),
  ];

  const filledCount = stepsDone.filter(Boolean).length;

  return (
    <AppLayout title="Negociación">
      {/* Inject styles + Poppins font if not already loaded globally */}
      <style>{css}</style>

      <div className="neg-root space-y-8">

        {/* ── SPLIT SCREEN ─────────────────────────────────────────── */}
        <div className="neg-split">

          {/* ── LEFT: Form ─────────────────────────────────────────── */}
          <div className="neg-form-col">
            <p className="col-eyebrow">Nueva negociación</p>
            <h2 className="col-title">Datos del restaurante</h2>

            <div className="neg-fields">
              <div>
                <Select
                  label="País"
                  value={negociacion.country_code}
                  onChange={e => handleCountryChange(e.target.value)}
                  loading={loadingCountries}
                  placeholder="Selecciona un país"
                  options={countries.map(c => ({ value: c.country_code, label: c.country_name }))}
                />
              </div>
              <div>
                <Select
                  label="Ciudad"
                  value={negociacion.city}
                  onChange={e => handleCityChange(e.target.value)}
                  loading={loadingCities}
                  placeholder={negociacion.country_code ? 'Selecciona ciudad' : '— primero país —'}
                  disabled={!negociacion.country_code}
                  options={cities.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <Select
                  label="Microzona"
                  value={negociacion.microzone_id}
                  onChange={e => handleMicrozoneChange(e.target.value)}
                  loading={loadingMicrozones}
                  placeholder={negociacion.city ? 'Selecciona microzona' : '— primero ciudad —'}
                  disabled={!negociacion.city}
                  options={microzones.map(mz => ({ value: mz, label: mz }))}
                />
              </div>
              <div>
                <Select
                  label="Categoría"
                  value={negociacion.tag}
                  onChange={e => handleTagChange(e.target.value)}
                  loading={loadingTags}
                  placeholder={negociacion.microzone_id ? 'Selecciona categoría' : '— primero microzona —'}
                  disabled={!negociacion.microzone_id}
                  options={tags.map(t => ({ value: t, label: t }))}
                />
              </div>
              <div className="span-2">
                <Input
                  label="Nombre del restaurante (opcional)"
                  placeholder="Ej: Hamburguesas El Gordo"
                  value={negociacion.restaurant_name}
                  onChange={e => setNegociacion({ ...negociacion, restaurant_name: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="neg-actions">
              <button
                className="btn-primary-rappi"
                onClick={() => navigate('/pitch')}
                disabled={!hasAllFilters}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Continuar al Pitch
              </button>
              <button className="btn-secondary-rappi" onClick={clearNegociacion}>
                Limpiar negociación
              </button>
            </div>
          </div>

          {/* ── RIGHT: Context panel ────────────────────────────────── */}
          <div className="neg-context-col">

            {/* Icon + headline */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ctx-icon-ring" style={{ marginBottom: 16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <p className="ctx-headline">🚀 Configura tu Oportunidad</p>
              <p className="ctx-body">
                Selecciona los datos del restaurante para activar el motor de negociación. Personalizar estos campos nos permitirá diseñar el pitch perfecto y conquistar al aliado desde el primer minuto. 🙌
              </p>
            </div>

            <hr className="ctx-divider" />

            {/* Step checklist — ALL completed steps show check icon, no numbers for done items */}
            <div className="ctx-steps">
              {STEPS.map((step, i) => {
                const done = stepsDone[i];
                return (
                  <div className="ctx-step" key={i}>
                    <div className={`ctx-step-num${done ? ' done' : ''}`}>
                      {done ? <CheckIcon /> : i + 1}
                    </div>
                    <p className={`ctx-step-text${done ? ' done' : ''}`}>{step.label}</p>
                  </div>
                );
              })}
            </div>

            <hr className="ctx-divider" />

            {/* Progress badge */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="ctx-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {filledCount} de 4 pasos completados
              </div>
            </div>
          </div>
        </div>
        {/* ── END SPLIT SCREEN ─────────────────────────────────────── */}


        {/* ── Comisiones — mt-10 for breathing room ────────────────── */}
        {negociacion.country_code && COMISIONES[negociacion.country_code] && (() => {
          const c = COMISIONES[negociacion.country_code];
          return (
            <div style={{ marginTop: 40 }}>
              <p className="neg-section-title">Comisiones disponibles</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 540, margin: '0 auto' }}>
                {[
                  { label: 'Full Service · Exclusivo', value: c.fullExclusivo, tag: 'Recomendado' },
                  { label: 'Full Service · No exclusivo', value: c.fullNoExclusivo },
                  { label: 'Marketplace · Exclusivo', value: c.mktExclusivo },
                  { label: 'Marketplace · No exclusivo', value: c.mktNoExclusivo },
                ].map(({ label, value, tag }) => (
                  <div key={label} className="com-card">
                    <p className="com-card-label">{label}</p>
                    <p className="com-card-value">{value}%</p>
                    {tag && <p className="com-card-tag">✓ {tag}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}


        {/* ── Métricas ─────────────────────────────────────────────── */}
        {hasAllFilters && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              {loadingMetrics ? 'Cargando métricas...' : `Métricas · ${negociacion.microzone_id}`}
            </p>
            {loadingMetrics ? (
              <div className="flex justify-center py-12">
                <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin block" />
              </div>
            ) : m ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <MetricCard icon="👥" label="Usuarios activos" value={formatNumber(m.mz_active_users)} />
                <MetricCard icon="👑" label="Usuarios Prime" value={formatNumber(m.mz_active_users_prime)} />
                <MetricCard icon="🏪" label="Tiendas en zona" value={formatNumber(m.mz_stores_count)} />
                <MetricCard icon="🎫" label={`Ticket (${negociacion.tag})`} value={formatCurrency(m.mz_ticket_avg, cc)} highlight currencyLabel={getCurrencyLabel(cc)} />
                <MetricCard icon="📦" label="Órdenes / tienda" value={formatNumber(m.mz_store_orders_avg)} unit="/mes" />
                <MetricCard icon="⏱️" label="Tiempo entrega" value={m.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'Dato no disponible'} unit="min" />
                <MetricCard icon="🏙️" label={`Tiendas en ${negociacion.city}`} value={formatNumber(m.city_stores_count_tag)} />
                <MetricCard icon="📊" label="Órdenes prom. ciudad" value={formatNumber(m.city_orders_tag_avg)} />
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-400 text-sm">No se encontraron métricas para esta selección.</p>
              </Card>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
