import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AccordionItem } from '../components/ui/Accordion';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { getComision } from '../data/comisiones';
import { Copy } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

function injectValues(text: string, vars: Record<string, string>): React.ReactNode[] {
  const parts = text.split(/(\{[A-Z_]+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{([A-Z_]+)\}$/);
    if (!match) return part;
    const key = match[1];
    const val = vars[key];
    if (!val || val === 'Dato no disponible') {
      return (
        <span key={i} className="bg-orange-100 text-orange-600 font-semibold px-1 rounded text-sm italic">
          [{key.replace(/_/g, ' ')}]
        </span>
      );
    }
    return (
      <span key={i} className="bg-orange-50 text-orange-700 font-semibold px-1 rounded">
        {val}
      </span>
    );
  });
}

function injectText(text: string, vars: Record<string, string>): string {
  return text.replace(/\{([A-Z_]+)\}/g, (_, key) => vars[key] || `[${key}]`);
}

export function Pitch() {
  const navigate = useNavigate();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const { user } = useAuth();
  const { showToast } = useToast();
  const m = negociacion.metrics;
  const cc = negociacion.country_code;

  const comision = hasActiveNegociacion
    ? getComision(cc, negociacion.tipo_servicio, negociacion.tipo_acuerdo)
    : null;

  const vars: Record<string, string> = {
    NOMBRE_ASESOR: user?.full_name || '',
    NOMBRE_RESTAURANTE: negociacion.restaurant_name || negociacion.city || '',
    CIUDAD: negociacion.city,
    TAG: negociacion.tag,
    MZ_ACTIVE_USERS: formatNumber(m?.mz_active_users),
    MZ_ACTIVE_USERS_PRIME: formatNumber(m?.mz_active_users_prime),
    MZ_TICKET_AVG: formatCurrency(m?.mz_ticket_avg, cc),
    MZ_STORE_ORDERS_AVG: formatNumber(m?.mz_store_orders_avg),
    MZ_ORDER_TIME_AVG: m?.mz_order_time_avg != null ? `${m.mz_order_time_avg}` : 'Dato no disponible',
    CITY_STORES_COUNT_TAG: formatNumber(m?.city_stores_count_tag),
    CITY_ORDERS_TAG_AVG: formatNumber(m?.city_orders_tag_avg),
    COMISION: comision != null ? `${comision}` : '',
    TIPO_ACUERDO: negociacion.tipo_acuerdo === 'exclusivo' ? 'Exclusivo' : 'No exclusivo',
    TIPO_SERVICIO: negociacion.tipo_servicio === 'full_service' ? 'Full Service' : 'Marketplace',
  };

  const FASES = [
    {
      num: 1,
      titulo: 'Apertura',
      contenido: `Buenos días/tardes, mi nombre es {NOMBRE_ASESOR}, me comunico de Rappi.\nLo contacto porque tenemos una propuesta comercial para {NOMBRE_RESTAURANTE} que le permitirá llegar a más clientes en {CIUDAD}.\n¿Conoce Rappi? ¿Ha trabajado con aplicaciones de delivery?`,
    },
    {
      num: 2,
      titulo: 'Contexto de zona',
      contenido: `Rappi está invirtiendo en {CIUDAD} donde vemos una oportunidad importante para restaurantes de {TAG}.\n\nEn su zona contamos con:\n• {MZ_ACTIVE_USERS} usuarios activos en la app\n• {MZ_ACTIVE_USERS_PRIME} usuarios Prime (alta recurrencia de compra)\n• Un ticket promedio de {MZ_TICKET_AVG} para {TAG}\n• {MZ_STORE_ORDERS_AVG} órdenes promedio por tienda al mes\n• Tiempos de entrega de {MZ_ORDER_TIME_AVG} minutos en promedio\n\nA nivel de {CIUDAD}, hay {CITY_STORES_COUNT_TAG} tiendas de {TAG} con un promedio de {CITY_ORDERS_TAG_AVG} órdenes.`,
    },
    {
      num: 3,
      titulo: 'Propuesta de valor',
      contenido: `Rappi le ofrece un canal de ventas alternativo para construir su tienda online. Nosotros asumimos los costos de alta en la plataforma.\n\n${negociacion.tipo_servicio === 'full_service' ? 'Rappi provee los repartidores, usted solo prepara el pedido.' : 'Usted usa sus propios repartidores, con menor comisión.'}`,
    },
    {
      num: 4,
      titulo: 'Comisiones',
      contenido: `Comisión aplicable: {COMISION}% — {TIPO_ACUERDO} / {TIPO_SERVICIO}\n→ Consultar pestaña de Comisiones para detalles`,
    },
    {
      num: 5,
      titulo: 'Cierre',
      contenido: `¿Le gustaría que avancemos con el proceso?\nSolo necesitamos algunos documentos básicos para activar su restaurante.\n→ Ir a Requisitos para guiar al aliado`,
    },
  ];

  const fullPitchText = FASES.map(f =>
    `=== Fase ${f.num}: ${f.titulo} ===\n${injectText(f.contenido, vars)}`
  ).join('\n\n');

  const copyAll = () => {
    navigator.clipboard.writeText(fullPitchText);
    showToast('Pitch copiado al portapapeles');
  };

  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Pitch Comercial">
        <div className="px-4 py-8 max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sin negociación activa</h2>
          <p className="text-gray-500 mb-6">Configura la negociación para ver el pitch con datos reales del restaurante.</p>
          <Button onClick={() => navigate('/negociacion')}>Ir a Negociación</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Pitch Comercial">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-4">
        {/* Info activa */}
        <Card className="bg-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 text-sm font-medium">Negociación activa</p>
              <p className="font-bold text-gray-900">{negociacion.restaurant_name || `${negociacion.city} · ${negociacion.tag}`}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={copyAll} className="gap-1.5">
              <Copy size={14} />
              Copiar todo
            </Button>
          </div>
        </Card>

        {/* Fases */}
        <div className="flex flex-col gap-3">
          {FASES.map((fase, idx) => (
            <AccordionItem key={fase.num} title={`Fase ${fase.num} — ${fase.titulo}`} defaultOpen={idx === 0}>
              <div className="text-base leading-relaxed text-gray-800 whitespace-pre-line font-medium">
                {injectValues(fase.contenido, vars)}
              </div>
            </AccordionItem>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          Los valores resaltados en naranja son datos reales inyectados automáticamente.
        </p>
      </div>
    </AppLayout>
  );
}
