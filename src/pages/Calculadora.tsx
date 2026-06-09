import { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency } from '../lib/currency';
import { getComision } from '../data/comisiones';
import { Receipt, TrendingUp, Percent, Wallet } from 'lucide-react';

const IVA_RATES: Record<string, number> = {
  AR: 21, CL: 19, CO: 19, EC: 12, MX: 16, PE: 18,
};

export function Calculadora() {
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const m = negociacion.metrics;
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
      <div className="space-y-8">

        {/* Título */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A2E', marginBottom: 6 }}>
            Calculadora de ventas y comisión
          </h1>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Proyecta los ingresos estimados del restaurante</p>
        </div>

        {/* Grid principal: calculadora (2 cols) + glosario (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Columna izquierda: parámetros + resultados */}
          <div className="lg:col-span-2 space-y-8">

            {/* Parámetros */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, textAlign: 'center' }}>Parámetros</p>
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 18, padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {hasActiveNegociacion && (
                  <div style={{ background: 'rgba(255,68,31,0.05)', border: '1px solid rgba(255,68,31,0.2)', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#FF441F', fontWeight: 600, textAlign: 'center' }}>
                    Pre-llenado con datos de {negociacion.city} · {negociacion.tag}
                  </div>
                )}
                <NumberField label="Ticket promedio" value={ticket} onChange={setTicket} />
                <NumberField label="Pedidos estimados por mes" value={pedidos} onChange={setPedidos} />
                <NumberField label="Comisión Rappi (%)" value={comision} onChange={setComision} max={100} suffix="%" />
              </div>
            </div>

            {/* Resultados */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, textAlign: 'center' }}>Proyección mensual</p>
              <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 18, padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Row label="Ingreso bruto mensual" value={fmt(ingresoBruto)} />
                <Row label={`Comisión Rappi (${comision}%)`} value={`- ${fmt(comisionRappi)}`} negative />
                <Row label={`IVA sobre comisión (${ivaRate}%)`} value={`- ${fmt(ivaComision)}`} negative />
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>Ingreso neto estimado</span>
                  <span style={{ fontSize: 30, fontWeight: 800, color: '#10B981' }}>{fmt(ingresoNeto)}</span>
                </div>
                <Row label="Comisión + IVA por pedido" value={fmt(comisionPorPedido * (1 + ivaRate / 100))} muted />
              </div>
            </div>

          </div>

          {/* Columna derecha: glosario */}
          <div className="lg:col-span-1">
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, textAlign: 'center' }}>Glosario</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DefCard
                icon={<Receipt size={13} strokeWidth={2.5} />}
                term="Ticket promedio"
                text="El valor medio que gasta cada cliente en un pedido. Subirlo —con combos, tamaños o sugerencias en el menú— es la palanca más rápida para crecer sin aumentar el volumen de pedidos."
              />
              <DefCard
                icon={<TrendingUp size={13} strokeWidth={2.5} />}
                term="Ingreso bruto mensual"
                text="La facturación total antes de descontar comisiones e impuestos. Refleja el tamaño real del negocio en la plataforma: ticket × pedidos del mes."
              />
              <DefCard
                icon={<Percent size={13} strokeWidth={2.5} />}
                term={`IVA sobre la comisión (${ivaRate}%)`}
                text="Impuesto al valor agregado que aplica sobre el servicio de intermediación cobrado por Rappi, según la tasa vigente en cada país."
              />
              <DefCard
                icon={<Wallet size={13} strokeWidth={2.5} />}
                term="Ingreso neto estimado"
                text="Lo que efectivamente recibe el restaurante después de comisión e IVA. Este número debe cubrir costos de materia prima, nómina y operación para que el negocio sea rentable."
              />
            </div>
          </div>

        </div>

        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
          Proyección estimada. No incluye costos operativos del restaurante.
        </p>

      </div>
    </AppLayout>
  );
}

function NumberField({ label, value, onChange, min = 0, max, suffix }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={value || ''}
          min={min}
          max={max}
          onChange={e => onChange(Number(e.target.value) || 0)}
          style={{ width: '100%', height: 42, padding: '0 40px 0 16px', borderRadius: 12, border: '1px solid #E0E0E0', fontSize: 15, background: 'white', color: '#1A1A2E', outline: 'none', textAlign: 'center', boxSizing: 'border-box' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#FF441F'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,68,31,0.1)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13 }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, negative, muted }: { label: string; value: string; negative?: boolean; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14, color: muted ? '#9ca3af' : '#6b7280' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: negative ? '#EF4444' : muted ? '#9ca3af' : '#1A1A2E' }}>{value}</span>
    </div>
  );
}

function DefCard({ icon, term, text }: { icon: React.ReactNode; term: string; text: string }) {
  return (
    <div style={{
      background: 'rgba(255,68,31,0.03)',
      border: '1px solid rgba(255,68,31,0.12)',
      borderRadius: 14,
      padding: '16px 18px',
    }}>
      <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#FF441F', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px 0' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        {term}
      </p>
      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}
