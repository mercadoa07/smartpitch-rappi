import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { getComision } from '../data/comisiones';

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

  const ingresoBruto = ticket * pedidos;
  const comisionRappi = ingresoBruto * (comision / 100);
  const ingresoNeto = ingresoBruto - comisionRappi;
  const comisionPorPedido = ticket * (comision / 100);

  const fmt = (v: number) => formatCurrency(v, cc);

  return (
    <AppLayout title="Calculadora">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Entradas */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">Parámetros</h2>
          {hasActiveNegociacion && (
            <div className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 mb-4 font-medium">
              Pre-llenado con datos de {negociacion.city} · {negociacion.tag}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <NumberField
              label={`Ticket promedio (${cc || 'moneda local'})`}
              value={ticket}
              onChange={setTicket}
              min={0}
            />
            <NumberField
              label="Pedidos estimados por mes"
              value={pedidos}
              onChange={setPedidos}
              min={0}
            />
            <NumberField
              label="Comisión Rappi (%)"
              value={comision}
              onChange={setComision}
              min={0}
              max={100}
              step={1}
              suffix="%"
            />
          </div>
        </Card>

        {/* Resultados */}
        <Card className="bg-gray-50">
          <h2 className="font-bold text-gray-900 mb-4">Proyección mensual</h2>
          <div className="flex flex-col gap-3">
            <ResultRow label="Ingreso bruto mensual" value={fmt(ingresoBruto)} />
            <ResultRow label={`Comisión Rappi (${comision}%)`} value={`- ${fmt(comisionRappi)}`} negative />
            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Ingreso neto estimado</span>
                <span className="text-2xl font-bold text-emerald-600">{fmt(ingresoNeto)}</span>
              </div>
            </div>
            <ResultRow label="Comisión por pedido" value={fmt(comisionPorPedido)} muted />
          </div>
        </Card>

        <p className="text-xs text-gray-400 text-center">
          Proyección estimada. No incluye costos operativos del restaurante.
        </p>
      </div>
    </AppLayout>
  );
}

function NumberField({
  label, value, onChange, min = 0, max, step = 1, suffix
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value) || 0)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A00] focus:border-transparent"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, negative, muted }: { label: string; value: string; negative?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      <span className={`font-semibold ${negative ? 'text-red-500' : muted ? 'text-gray-500' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}
