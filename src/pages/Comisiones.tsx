import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { AccordionItem } from '../components/ui/Accordion';
import { useNegociacion } from '../context/NegociacionContext';
import { COMISIONES } from '../data/comisiones';
import { AlertTriangle } from 'lucide-react';

const COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'MX', name: 'México' },
  { code: 'PE', name: 'Perú' },
];

export function Comisiones() {
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const [selected, setSelected] = useState(negociacion.country_code || 'CO');

  const c = COMISIONES[selected];
  const isFullExclusivo = hasActiveNegociacion && negociacion.country_code === selected && negociacion.tipo_servicio === 'full_service' && negociacion.tipo_acuerdo === 'exclusivo';
  const isFullNoExclusivo = hasActiveNegociacion && negociacion.country_code === selected && negociacion.tipo_servicio === 'full_service' && negociacion.tipo_acuerdo === 'no_exclusivo';
  const isMktExclusivo = hasActiveNegociacion && negociacion.country_code === selected && negociacion.tipo_servicio === 'marketplace' && negociacion.tipo_acuerdo === 'exclusivo';
  const isMktNoExclusivo = hasActiveNegociacion && negociacion.country_code === selected && negociacion.tipo_servicio === 'marketplace' && negociacion.tipo_acuerdo === 'no_exclusivo';

  return (
    <AppLayout title="Comisiones">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Aviso */}
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            <strong>Valores de referencia</strong> — pendiente validación para inside sales
          </p>
        </div>

        {/* Tabs de país */}
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map(c => (
            <button
              key={c.code}
              onClick={() => setSelected(c.code)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selected === c.code
                  ? 'bg-[#FF5A00] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <Card className="!p-0 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide" />
            <div className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wide text-center border-l border-gray-200">
              Exclusivo
            </div>
            <div className="p-3 text-xs font-semibold text-gray-700 uppercase tracking-wide text-center border-l border-gray-200">
              No exclusivo
            </div>
          </div>

          {/* Full Service */}
          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="p-4">
              <p className="font-semibold text-gray-900 text-sm">Full Service</p>
              <p className="text-xs text-gray-400">Rappi reparte</p>
            </div>
            <ComisionCell value={c?.fullExclusivo} highlight={isFullExclusivo} />
            <ComisionCell value={c?.fullNoExclusivo} highlight={isFullNoExclusivo} borderLeft />
          </div>

          {/* Marketplace */}
          <div className="grid grid-cols-3">
            <div className="p-4">
              <p className="font-semibold text-gray-900 text-sm">Marketplace</p>
              <p className="text-xs text-gray-400">Tú repartes</p>
            </div>
            <ComisionCell value={c?.mktExclusivo} highlight={isMktExclusivo} />
            <ComisionCell value={c?.mktNoExclusivo} highlight={isMktNoExclusivo} borderLeft />
          </div>
        </Card>

        {hasActiveNegociacion && negociacion.country_code === selected && (
          <p className="text-sm text-center text-orange-600 font-medium">
            ✓ Celda resaltada = configuración activa de la negociación
          </p>
        )}

        {/* Ventajas exclusividad */}
        <AccordionItem title="Ventajas de ser exclusivo">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="text-[#FF5A00] font-bold text-lg">↓</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Menor comisión</p>
                <p className="text-gray-500 text-sm">Ahorro de 2 puntos porcentuales en Full Service.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#FF5A00] font-bold text-lg">↑</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Mejor posicionamiento en el algoritmo</p>
                <p className="text-gray-500 text-sm">Los restaurantes exclusivos aparecen más arriba en los resultados de búsqueda de Rappi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#FF5A00] font-bold text-lg">★</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Acceso prioritario a promociones</p>
                <p className="text-gray-500 text-sm">Participación en campañas de Rappi con mayor visibilidad y descuentos subsidiados.</p>
              </div>
            </div>
          </div>
        </AccordionItem>
      </div>
    </AppLayout>
  );
}

function ComisionCell({ value, highlight, borderLeft }: { value?: number; highlight?: boolean; borderLeft?: boolean }) {
  return (
    <div className={`p-4 flex items-center justify-center ${borderLeft ? 'border-l border-gray-100' : ''} ${highlight ? 'bg-orange-50' : ''}`}>
      <div className={`text-center ${highlight ? 'text-[#FF5A00]' : 'text-gray-900'}`}>
        <span className={`text-2xl font-bold ${highlight ? 'text-[#FF5A00]' : ''}`}>{value ?? '-'}%</span>
        {highlight && <p className="text-xs text-orange-500 font-medium mt-0.5">Tu acuerdo</p>}
      </div>
    </div>
  );
}
