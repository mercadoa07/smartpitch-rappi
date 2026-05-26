import { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { AccordionItem } from '../components/ui/Accordion';
import { useNegociacion } from '../context/NegociacionContext';
import { COMISIONES } from '../data/comisiones';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/cn';

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

  const isActive = (servicio: 'full_service' | 'marketplace', acuerdo: 'exclusivo' | 'no_exclusivo') =>
    hasActiveNegociacion && negociacion.country_code === selected &&
    negociacion.tipo_servicio === servicio && negociacion.tipo_acuerdo === acuerdo;

  return (
    <AppLayout title="Comisiones">
      <div className="space-y-6">

        {/* Aviso */}
        <div className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-xl p-4">
          <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-warning font-semibold">
            Valores de referencia — pendiente validación para inside sales
          </p>
        </div>

        {/* Tabs de país */}
        <div className="flex flex-wrap gap-2">
          {COUNTRIES.map(ctry => (
            <button
              key={ctry.code}
              onClick={() => setSelected(ctry.code)}
              className={cn(
                'px-4 h-9 rounded-xl text-sm font-semibold transition-all',
                selected === ctry.code
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-gray-medium text-gray-600 hover:border-gray-300'
              )}
            >
              {ctry.name}
            </button>
          ))}
        </div>

        {/* Tabla */}
        <Card>
          <div className="grid grid-cols-3 bg-gray-light border-b border-gray-medium">
            <div className="px-6 py-4" />
            <div className="px-6 py-4 border-l border-gray-medium">
              <p className="text-xs font-semibold uppercase tracking-wider text-dark text-center">Exclusivo</p>
            </div>
            <div className="px-6 py-4 border-l border-gray-medium">
              <p className="text-xs font-semibold uppercase tracking-wider text-dark text-center">No exclusivo</p>
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-100">
            <div className="px-6 py-6">
              <p className="text-sm font-semibold text-dark">Full Service</p>
              <p className="text-xs text-gray-400 mt-1">Rappi reparte</p>
            </div>
            <ComisionCell value={c?.fullExclusivo} active={isActive('full_service', 'exclusivo')} />
            <ComisionCell value={c?.fullNoExclusivo} active={isActive('full_service', 'no_exclusivo')} borderLeft />
          </div>
          <div className="grid grid-cols-3">
            <div className="px-6 py-6">
              <p className="text-sm font-semibold text-dark">Marketplace</p>
              <p className="text-xs text-gray-400 mt-1">Tú repartes</p>
            </div>
            <ComisionCell value={c?.mktExclusivo} active={isActive('marketplace', 'exclusivo')} />
            <ComisionCell value={c?.mktNoExclusivo} active={isActive('marketplace', 'no_exclusivo')} borderLeft />
          </div>
        </Card>

        {hasActiveNegociacion && negociacion.country_code === selected && (
          <p className="text-center text-xs text-primary font-semibold">
            ✓ Celda resaltada = configuración activa de la negociación
          </p>
        )}

        {/* Ventajas exclusividad */}
        <AccordionItem title="¿Por qué ser exclusivo?">
          <div className="space-y-4 pt-1">
            {[
              { icon: '↓', title: 'Menor comisión', desc: 'Ahorro de 2 puntos porcentuales en Full Service.' },
              { icon: '↑', title: 'Mejor posicionamiento', desc: 'Los restaurantes exclusivos aparecen primero en búsquedas de Rappi.' },
              { icon: '★', title: 'Acceso prioritario a promociones', desc: 'Participación en campañas con mayor visibilidad y descuentos subsidiados.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-dark">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>

      </div>
    </AppLayout>
  );
}

function ComisionCell({ value, active, borderLeft }: { value?: number; active?: boolean; borderLeft?: boolean }) {
  return (
    <div className={cn('flex items-center justify-center py-6', borderLeft && 'border-l border-gray-100', active && 'bg-primary/5')}>
      <div className="text-center">
        <span className={cn('font-extrabold', active ? 'text-primary' : 'text-dark')} style={{ fontSize: 28 }}>
          {value ?? '-'}%
        </span>
        {active && <p className="text-xs text-primary font-semibold mt-1">Tu acuerdo</p>}
      </div>
    </div>
  );
}
