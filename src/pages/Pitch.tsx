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
import { toast } from 'sonner';

function injectValues(text: string, vars: Record<string, string>): React.ReactNode[] {
  const parts = text.split(/(\{[A-Z_]+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{([A-Z_]+)\}$/);
    if (!match) return part;
    const key = match[1];
    const val = vars[key];
    if (!val || val === 'Dato no disponible') {
      return (
        <span key={i} className="inline-flex items-center bg-warning/10 text-warning font-semibold px-1.5 rounded text-[13px] italic">
          [{key.replace(/_/g, ' ')}]
        </span>
      );
    }
    return (
      <span key={i} className="bg-primary/10 text-primary font-bold px-1 rounded">
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
    { num: 1, titulo: 'Apertura', contenido: `Buenos días/tardes, mi nombre es {NOMBRE_ASESOR}, me comunico de Rappi.\nLo contacto porque tenemos una propuesta comercial para {NOMBRE_RESTAURANTE} que le permitirá llegar a más clientes en {CIUDAD}.\n¿Conoce Rappi? ¿Ha trabajado con aplicaciones de delivery?` },
    { num: 2, titulo: 'Contexto de zona', contenido: `Rappi está invirtiendo en {CIUDAD} donde vemos una oportunidad importante para restaurantes de {TAG}.\n\nEn su zona contamos con:\n• {MZ_ACTIVE_USERS} usuarios activos en la app\n• {MZ_ACTIVE_USERS_PRIME} usuarios Prime (alta recurrencia de compra)\n• Un ticket promedio de {MZ_TICKET_AVG} para {TAG}\n• {MZ_STORE_ORDERS_AVG} órdenes promedio por tienda al mes\n• Tiempos de entrega de {MZ_ORDER_TIME_AVG} minutos en promedio\n\nA nivel de {CIUDAD}, hay {CITY_STORES_COUNT_TAG} tiendas de {TAG} con un promedio de {CITY_ORDERS_TAG_AVG} órdenes.` },
    { num: 3, titulo: 'Propuesta de valor', contenido: `Rappi le ofrece un canal de ventas alternativo para construir su tienda online. Nosotros asumimos los costos de alta en la plataforma.\n\n${negociacion.tipo_servicio === 'full_service' ? 'Rappi provee los repartidores, usted solo prepara el pedido.' : 'Usted usa sus propios repartidores, con menor comisión.'}` },
    { num: 4, titulo: 'Comisiones', contenido: `Comisión aplicable: {COMISION}% — {TIPO_ACUERDO} / {TIPO_SERVICIO}\n→ Consultar pestaña de Comisiones para detalles` },
    { num: 5, titulo: 'Cierre', contenido: `¿Le gustaría que avancemos con el proceso?\nSolo necesitamos algunos documentos básicos para activar su restaurante.\n→ Ir a Requisitos para guiar al aliado` },
  ];

  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Pitch Comercial">
        <div className="px-6 md:px-8 py-16 max-w-md mx-auto text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-2xl font-bold text-dark mb-2">Sin negociación activa</h2>
          <p className="text-sm text-gray-500 mb-6">Configura la negociación para ver el pitch con datos reales.</p>
          <Button onClick={() => navigate('/negociacion')}>Ir a Negociación</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Pitch Comercial">
      <div className="space-y-6">

        {/* Info activa */}
        <div style={{ background: 'rgba(255,68,31,0.05)', border: '1px solid rgba(255,68,31,0.2)', borderRadius: 16, padding: '28px 36px', textAlign: 'center' }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>Negociación activa</p>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#6b7280' }}>{negociacion.restaurant_name || `${negociacion.city} · ${negociacion.tag}`}</p>
        </div>

        {/* Fases */}
        <div className="space-y-3">
          {FASES.map((fase, idx) => (
            <AccordionItem key={fase.num} title={`Fase ${fase.num} — ${fase.titulo}`} defaultOpen={idx === 0}>
              <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line font-medium">
                {injectValues(fase.contenido, vars)}
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => { navigator.clipboard.writeText(injectText(fase.contenido, vars)); toast.success('Texto copiado'); }}
                >
                  <Copy size={13} /> Copiar
                </Button>
              </div>
            </AccordionItem>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          <span className="bg-primary/10 text-primary px-1 rounded font-semibold">naranja</span> = datos reales inyectados · <span className="bg-warning/10 text-warning px-1 rounded font-semibold italic">amarillo</span> = datos faltantes
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/objeciones')}>
            Manejo de objeciones →
          </Button>
          <Button className="flex-1" onClick={() => navigate('/propuesta')}>
            Enviar propuesta WhatsApp →
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
