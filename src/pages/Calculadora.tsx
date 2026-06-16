import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency } from '../lib/currency';
import { getComision } from '../data/comisiones';
import { Receipt, TrendingUp, Percent, Wallet, Info } from 'lucide-react';

/* ─── Constants ─────────────────────────────────────────────────────────── */
const IVA_RATES: Record<string, number> = {
  AR: 21, CL: 19, CO: 19, EC: 12, MX: 16, PE: 18,
};

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .calc-root,
  .calc-root *,
  .calc-root input,
  .calc-root label,
  .calc-root button,
  .calc-root p,
  .calc-root h1,
  .calc-root h2,
  .calc-root span,
  .calc-root div {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Page header ── */
  .calc-header {
    margin-bottom: 28px;
  }
  .calc-header-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #FF441F;
    margin-bottom: 4px;
  }
  .calc-header-title {
    font-size: 26px;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .calc-header-sub {
    font-size: 14px;
    color: #9ca3af;
    font-weight: 500;
  }

  /* ── Two-column grid ── */
  .calc-grid {
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: 20px;
    align-items: start;
  }

  /* ── Left panel ── */
  .calc-left {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 32px 36px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .calc-panel-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Pre-fill badge */
  .calc-prefill-badge {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #c2410c;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  /* Fields */
  .calc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .calc-field-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .calc-field-label {
    font-size: 12px;
    font-weight: 700;
    color: #374151;
    letter-spacing: 0.03em;
  }
  .calc-field-info {
    color: #c4c4c4;
    cursor: help;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }
  .calc-field-info:hover { color: #FF441F; }

  /* Tooltip */
  .calc-tooltip-wrap {
    position: relative;
    display: inline-flex;
  }
  .calc-tooltip {
    display: none;
    position: absolute;
    left: 50%;
    bottom: calc(100% + 8px);
    transform: translateX(-50%);
    background: #1A1A2E;
    color: rgba(255,255,255,0.88);
    font-size: 11.5px;
    line-height: 1.55;
    font-weight: 500;
    padding: 9px 13px;
    border-radius: 10px;
    width: 220px;
    z-index: 20;
    box-shadow: 0 6px 20px rgba(0,0,0,0.18);
    pointer-events: none;
  }
  .calc-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #1A1A2E;
  }
  .calc-tooltip-wrap:hover .calc-tooltip { display: block; }

  .calc-input {
    width: 100%;
    height: 46px;
    padding: 0 44px 0 16px !important;
    border-radius: 12px !important;
    border: 1.5px solid #e2e8f0 !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    background: #fafafa !important;
    color: #0f172a !important;
    outline: none !important;
    box-sizing: border-box !important;
    transition: border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease !important;
    -moz-appearance: textfield !important;
  }
  .calc-input:focus {
    border-color: #FF441F !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.10) !important;
    background: #fff !important;
  }
  .calc-input::-webkit-outer-spin-button,
  .calc-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

  .calc-input-wrap {
    position: relative;
  }
  .calc-input-suffix {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    font-weight: 700;
    color: #9ca3af;
    pointer-events: none;
  }

  .calc-fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .calc-fields-grid .span-2 { grid-column: 1 / -1; }

  /* ── Right panel — gradient ── */
  .calc-right {
    background: linear-gradient(160deg, #1A1A2E 0%, #2d1a3e 50%, #1a0a0a 100%);
    border-radius: 20px;
    padding: 28px 26px;
    box-shadow: 0 8px 32px rgba(26,26,46,0.22);
    display: flex;
    flex-direction: column;
    gap: 0;
    position: sticky;
    top: 20px;
  }

  .calc-right-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.40);
    margin-bottom: 20px;
  }

  /* Rows */
  .calc-result-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .calc-result-row:last-of-type { border-bottom: none; }
  .calc-result-label {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.60);
    line-height: 1.3;
  }
  .calc-result-value {
    font-size: 14px;
    font-weight: 700;
    color: rgba(255,255,255,0.88);
    text-align: right;
  }
  .calc-result-value.negative { color: #f87171; }
  .calc-result-value.muted    { color: rgba(255,255,255,0.40); font-size: 12px; font-weight: 600; }

  /* Neto badge */
  .calc-neto-badge {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 18px 20px;
    margin-top: 18px;
    text-align: center;
  }
  .calc-neto-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    margin-bottom: 8px;
  }
  .calc-neto-value {
    font-size: 32px;
    font-weight: 900;
    color: #34d399;
    line-height: 1;
    margin-bottom: 4px;
  }
  .calc-neto-sub {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    font-weight: 500;
  }

  /* Per-order row */
  .calc-per-order {
    margin-top: 14px;
    background: rgba(255,68,31,0.12);
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .calc-per-order-label {
    font-size: 11.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
  }
  .calc-per-order-value {
    font-size: 13px;
    font-weight: 800;
    color: #fca5a5;
  }

  /* ── Disclaimer ── */
  .calc-disclaimer {
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    font-style: italic;
  }

  /* ── Responsive ── */
  @media (max-width: 800px) {
    .calc-grid { grid-template-columns: 1fr; }
    .calc-right { position: static; }
    .calc-fields-grid { grid-template-columns: 1fr; }
  }
`;

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function TooltipInfo({ text }: { text: string }) {
  return (
    <span className="calc-tooltip-wrap calc-field-info">
      <Info size={13} />
      <span className="calc-tooltip">{text}</span>
    </span>
  );
}

function NumberField({
  label, value, onChange, min = 0, max, suffix, tooltip,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; suffix?: string; tooltip?: string;
}) {
  return (
    <div className="calc-field">
      <div className="calc-field-header">
        <label className="calc-field-label">{label}</label>
        {tooltip && <TooltipInfo text={tooltip} />}
      </div>
      <div className="calc-input-wrap">
        <input
          type="number"
          className="calc-input"
          value={value || ''}
          min={min}
          max={max}
          onChange={e => onChange(Number(e.target.value) || 0)}
        />
        {suffix && <span className="calc-input-suffix">{suffix}</span>}
      </div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export function Calculadora() {
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const m  = negociacion.metrics;
  const cc = negociacion.country_code || 'CO';

  const defaultComision = hasActiveNegociacion
    ? getComision(cc, negociacion.tipo_servicio, negociacion.tipo_acuerdo)
    : 25;

  const [ticket,   setTicket]   = useState<number>(m?.mz_ticket_avg || 0);
  const [pedidos,  setPedidos]  = useState<number>(m?.mz_store_orders_avg || 0);
  const [comision, setComision] = useState<number>(defaultComision);

  useEffect(() => {
    if (m?.mz_ticket_avg     != null) setTicket(m.mz_ticket_avg);
    if (m?.mz_store_orders_avg != null) setPedidos(m.mz_store_orders_avg);
    setComision(defaultComision);
  }, [negociacion.tag, negociacion.tipo_acuerdo, negociacion.tipo_servicio]);

  /* ── Formulas (untouched) ── */
  const ivaRate          = IVA_RATES[cc] ?? 19;
  const ingresoBruto     = ticket * pedidos;
  const comisionRappi    = ingresoBruto * (comision / 100);
  const ivaComision      = comisionRappi * (ivaRate / 100);
  const totalDescuentos  = comisionRappi + ivaComision;
  const ingresoNeto      = ingresoBruto - totalDescuentos;
  const comisionPorPedido = ticket * (comision / 100);
  const fmt = (v: number) => formatCurrency(v, cc);

  return (
    <AppLayout title="Calculadora">
      <style>{css}</style>
      <div className="calc-root space-y-6">

        {/* ── Page header ── */}
        <div className="calc-header">
          <p className="calc-header-eyebrow">Simulador financiero</p>
          <h1 className="calc-header-title">📊 Proyecta tus Ingresos</h1>
          <p className="calc-header-sub">Proyecta los ingresos estimados del restaurante con datos reales de zona</p>
        </div>

        {/* ── Two-column grid ── */}
        <div className="calc-grid">

          {/* ── LEFT: Parameters ── */}
          <div className="calc-left">
            <p className="calc-panel-title">Parámetros de simulación</p>

            {hasActiveNegociacion && (
              <div className="calc-prefill-badge">
                <span>✦</span>
                Pre-llenado con datos de {negociacion.city} · {negociacion.tag}
              </div>
            )}

            <div className="calc-fields-grid">
              <NumberField
                label="Ticket promedio"
                value={ticket}
                onChange={setTicket}
                tooltip="El valor medio que gasta cada cliente en un pedido. Subirlo —con combos o sugerencias en el menú— es la palanca más rápida para crecer sin aumentar el volumen de pedidos."
              />
              <NumberField
                label="Pedidos / mes"
                value={pedidos}
                onChange={setPedidos}
                tooltip="Volumen mensual de órdenes estimadas. Se pre-llena con el promedio histórico de la microzona seleccionada en Negociación."
              />
              <div className="span-2">
                <NumberField
                  label="Comisión Rappi (%)"
                  value={comision}
                  onChange={setComision}
                  max={100}
                  suffix="%"
                  tooltip={`Porcentaje que cobra Rappi sobre cada venta. El IVA (${ivaRate}%) aplica sobre esta comisión, no sobre el ticket total.`}
                />
              </div>
            </div>

            {/* Inline glossary — icon + tooltip pattern */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#c4c4c4', marginBottom: 12 }}>
                Glosario rápido
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Receipt size={13} color="#FF441F" />, term: 'Ticket promedio', text: 'Valor medio por pedido. Más ticket = más ingreso sin más operación.' },
                  { icon: <TrendingUp size={13} color="#FF441F" />, term: 'Ingreso bruto', text: 'Facturación total antes de comisiones e impuestos (ticket × pedidos).' },
                  { icon: <Percent size={13} color="#FF441F" />, term: `IVA sobre comisión (${ivaRate}%)`, text: 'Impuesto sobre el servicio de intermediación de Rappi, no sobre el ticket.' },
                  { icon: <Wallet size={13} color="#FF441F" />, term: 'Ingreso neto', text: 'Lo que recibe el restaurante después de comisión e IVA. Debe cubrir costos fijos.' },
                ].map(({ icon, term, text }) => (
                  <div key={term} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,68,31,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 1 }}>{term}</p>
                      <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Results console ── */}
          <div className="calc-right">
            <p className="calc-right-title">Proyección mensual</p>

            {/* Result rows */}
            <div className="calc-result-row">
              <span className="calc-result-label">Ingreso bruto mensual</span>
              <span className="calc-result-value">{fmt(ingresoBruto)}</span>
            </div>
            <div className="calc-result-row">
              <span className="calc-result-label">Comisión Rappi ({comision}%)</span>
              <span className="calc-result-value negative">− {fmt(comisionRappi)}</span>
            </div>
            <div className="calc-result-row">
              <span className="calc-result-label">IVA sobre comisión ({ivaRate}%)</span>
              <span className="calc-result-value negative">− {fmt(ivaComision)}</span>
            </div>

            {/* Neto hero */}
            <div className="calc-neto-badge">
              <p className="calc-neto-label">Ingreso neto estimado</p>
              <p className="calc-neto-value">{fmt(ingresoNeto)}</p>
              <p className="calc-neto-sub">después de comisión e IVA</p>
            </div>

            {/* Per-order */}
            <div className="calc-per-order">
              <span className="calc-per-order-label">Comisión + IVA por pedido</span>
              <span className="calc-per-order-value">{fmt(comisionPorPedido * (1 + ivaRate / 100))}</span>
            </div>

            {/* Context note */}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 20, lineHeight: 1.5 }}>
              Estimación basada en {pedidos} pedidos × {fmt(ticket)} ticket
            </p>
          </div>

        </div>

        {/* ── Disclaimer ── */}
        <p className="calc-disclaimer">
          Proyección estimada · No incluye costos operativos del restaurante
        </p>

      </div>
    </AppLayout>
  );
}
