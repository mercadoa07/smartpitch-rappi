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
  .calc-root, .calc-root * {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Page header ── */
  .calc-header { margin-bottom: 28px; }
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

  /* ── Grid ── */
  .calc-grid {
    display: grid;
    grid-template-columns: 7fr 5fr;
    gap: 24px;
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
  .calc-inputs-wrapper {
    background: rgba(255, 68, 31, 0.02);
    border: 1.5px solid rgba(255, 68, 31, 0.08);
    border-radius: 18px;
    padding: 24px;
  }
  .calc-panel-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 16px;
  }

  /* Fields */
  .calc-field { display: flex; flex-direction: column; gap: 6px; }
  .calc-field-header { display: flex; align-items: center; gap: 6px; }
  .calc-field-label { font-size: 12px; font-weight: 700; color: #475569; letter-spacing: 0.03em; text-transform: uppercase; }
  .calc-field-info { color: #94a3b8; cursor: help; flex-shrink: 0; transition: color 0.2s ease; }
  .calc-field-info:hover { color: #FF441F; }

  /* Tooltip */
  .calc-tooltip-wrap { position: relative; display: inline-flex; }
  .calc-tooltip {
    display: none; position: absolute; left: 50%; bottom: calc(100% + 8px);
    transform: translateX(-50%); background: #1E293B; color: rgba(255,255,255,0.95);
    font-size: 11.5px; line-height: 1.55; font-weight: 500; padding: 10px 14px;
    border-radius: 10px; width: 230px; z-index: 20; box-shadow: 0 6px 20px rgba(0,0,0,0.15); pointer-events: none;
  }
  .calc-tooltip::after {
    content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
    border: 5px solid transparent; border-top-color: #1E293B;
  }
  .calc-tooltip-wrap:hover .calc-tooltip { display: block; }

  .calc-input {
    width: 100%; height: 46px; padding: 0 44px 0 16px !important; border-radius: 12px !important;
    border: 1.5px solid #cbd5e1 !important; font-size: 15px !important; font-weight: 600 !important;
    background: #fff !important; color: #0f172a !important; outline: none !important; box-sizing: border-box !important;
    transition: border-color 0.22s ease, box-shadow 0.22s ease !important;
  }
  .calc-input:focus { border-color: #FF441F !important; box-shadow: 0 0 0 3px rgba(255,68,31,0.12) !important; }

  .calc-input-wrap { position: relative; }
  .calc-input-suffix { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 14px; font-weight: 700; color: #64748b; }
  .calc-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .calc-fields-grid .span-2 { grid-column: 1 / -1; }

  /* Pre-fill badge */
  .calc-prefill-badge {
    background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px;
    padding: 10px 16px; font-size: 13px; font-weight: 600; color: #c2410c;
    display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
  }

  /* ── Right panel — Premium Gradient ── */
  .calc-right {
    background: linear-gradient(145deg, #FF441F 0%, #E03314 100%);
    border-radius: 20px; padding: 32px 28px;
    box-shadow: 0 10px 30px rgba(255, 68, 31, 0.2);
    display: flex; flex-direction: column; position: sticky; top: 20px;
  }
  .calc-right-title {
    font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 24px;
  }

  /* Rows */
  .calc-result-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.15); }
  .calc-result-row:last-of-type { border-bottom: none; }
  .calc-result-label { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); }
  .calc-result-value { font-size: 15px; font-weight: 700; color: #fff; text-align: right; }
  .calc-result-value.negative { color: #ffe4e6; font-weight: 600; }

  /* Neto White Hero Badge */
  .calc-neto-badge {
    background: #ffffff; border-radius: 16px; padding: 22px 20px;
    margin-top: 24px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  }
  .calc-neto-label { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
  .calc-neto-value { font-size: 34px; font-weight: 900; color: #059669; line-height: 1; margin-bottom: 4px; }
  .calc-neto-sub { font-size: 12px; color: #94a3b8; font-weight: 600; }

  /* Per-order row */
  .calc-per-order {
    margin-top: 18px; background: rgba(255,255,255,0.12); border-radius: 12px;
    padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
  }
  .calc-per-order-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); }
  .calc-per-order-value { font-size: 14px; font-weight: 800; color: #fff; }

  /* ── Disclaimer ── */
  .calc-disclaimer { font-size: 12px; color: #9ca3af; text-align: center; font-style: italic; margin-top: 24px; }

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

/* ─── Main Component ─────────────────────────────────────────────────────── */
export function Calculadora() {
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const m  = negociacion.metrics;
  const cc = negociacion.country_code || 'CO';

  const defaultComision = hasActiveNegociacion
    ? getComision(cc, negociacion.tipo_servicio, negociacion.tipo_acuerdo)
    : 25;

  const [ticket, setTicket] = useState<number>(m?.mz_ticket_avg || 0);
  const [pedidos, setPedidos] = useState<number>(m?.mz_store_orders_avg || 0);
  const [comision, setComision] = useState<number>(defaultComision);

  useEffect(() => {
    if (m?.mz_ticket_avg != null) setTicket(m.mz_ticket_avg);
    if (m?.mz_store_orders_avg != null) setPedidos(m.mz_store_orders_avg);
    setComision(defaultComision);
  }, [negociacion.tag, negociacion.tipo_acuerdo, negociacion.tipo_servicio]);

  const ivaRate = IVA_RATES[cc] ?? 19;
  const ingresoBruto = ticket * pedidos;
  const comisionRappi = ingresoBruto * (comision / 100);
  const ivaComision = comisionRappi * (ivaRate / 100);
  const totalDescuentos = comisionRappi + ivaComision;
  const ingresoNeto = ingresoBruto - totalDescuentos;
  const comisionPorPedido = ticket * (comision / 100);
  const fmt = (v: number) => formatCurrency(v, cc);

  return (
    <AppLayout title="Calculadora">
      <style>{css}</style>
      <div className="calc-root space-y-6">

        {/* Header */}
        <div className="calc-header">
          <p className="calc-header-eyebrow">Simulador financiero</p>
          <h1 className="calc-header-title">📊 Proyecta tus Ingresos</h1>
          <p className="calc-header-sub">Proyecta los ingresos estimados del restaurante con datos reales de la zona</p>
        </div>

        {/* Two-column layout */}
        <div className="calc-grid">

          {/* LEFT PANEL */}
          <div className="calc-left">
            <div className="calc-inputs-wrapper">
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
            </div>

            {/* Premium Glossary Section */}
            <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0f172a', marginBottom: 16 }}>
                Glosario rápido
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <Receipt size={14} color="#FF441F" />, term: 'Ticket promedio', text: 'Valor medio por pedido. Más ticket = más ingreso sin más operación.' },
                  { icon: <TrendingUp size={14} color="#FF441F" />, term: 'Ingreso bruto', text: 'Facturación total antes de comisiones e impuestos (ticket × pedidos).' },
                  { icon: <Percent size={14} color="#FF441F" />, term: `IVA sobre comisión (${ivaRate}%)`, text: 'Impuesto sobre el servicio de intermediación de Rappi, no sobre el ticket.' },
                  { icon: <Wallet size={14} color="#FF441F" />, term: 'Ingreso neto', text: 'Lo que recibe el restaurante después de comisión e IVA. Debe cubrir costos fijos.' },
                ].map(({ icon, term, text }) => (
                  <div key={term} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,68,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{term}</p>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, margin: 0 }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Hot Orange Console */}
          <div className="calc-right">
            <p className="calc-right-title">Proyección mensual</p>

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

            {/* Hero Neto Box */}
            <div className="calc-neto-badge">
              <p className="calc-neto-label">Ingreso neto estimado</p>
              <p className="calc-neto-value">{fmt(ingresoNeto)}</p>
              <p className="calc-neto-sub">después de comisión e IVA</p>
            </div>

            <div className="calc-per-order">
              <span className="calc-per-order-label">Comisión + IVA por pedido</span>
              <span className="calc-per-order-value">{fmt(comisionPorPedido * (1 + ivaRate / 100))}</span>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 24, fontWeight: 500 }}>
              Estimación basada en {pedidos} pedidos × {fmt(ticket)} ticket
            </p>
          </div>

        </div>

        {/* Disclaimer */}
        <p className="calc-disclaimer">
          Proyección estimada · No incluye costos operativos del restaurante
        </p>

      </div>
    </AppLayout>
  );
}
