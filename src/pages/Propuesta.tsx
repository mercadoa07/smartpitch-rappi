import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { COMISIONES } from '../data/comisiones';
import { toast } from 'sonner';
import { Copy, MessageCircle, Send } from 'lucide-react';

function buildMessage(vars: Record<string, string>): string {
  return `🧡 *Propuesta Comercial Rappi*
━━━━━━━━━━━━━━━━━━━━

*Restaurante:* ${vars.restaurante}
*País:* ${vars.pais}
*Ciudad:* ${vars.ciudad}
*Categoría:* ${vars.tag}
*Comisión:* ${vars.comision}% (${vars.tipo_acuerdo} / ${vars.tipo_servicio})

━━━━━━━━━━━━━━━━━━━━

*Datos de tu zona:*
👥 ${vars.mz_active_users} usuarios activos
👑 ${vars.mz_active_users_prime} usuarios Prime
🎫 Ticket promedio: ${vars.mz_ticket_avg}
📦 ~${vars.mz_store_orders_avg} órdenes/mes por tienda
⏱️ Entrega promedio: ${vars.mz_order_time_avg} min

━━━━━━━━━━━━━━━━━━━━

*¿Por qué entrar a Rappi ahora?*

✅ Pagos semanales directos a tu cuenta
✅ Miles de clientes nuevos que hoy no te conocen
✅ Tus costos fijos no aumentan — solo pagás por venta
✅ +60 millones de usuarios en Latinoamérica
✅ Sesión fotográfica gratuita de tus productos
✅ El algoritmo prioriza restaurantes nuevos

━━━━━━━━━━━━━━━━━━━━

*Para activarte necesitamos:*
📄 Certificado bancario
📄 Documento de identidad del representante
📄 RUT/RFC/NIT/RUC
📄 Cámara de comercio
🍽️ Menú con mínimo 15 productos
📸 Fotos de productos + logo + portada

━━━━━━━━━━━━━━━━━━━━

*Timeline estimado:*
📅 Día 1 → Firma
📅 Días 1-3 → Carga de contenido
📅 Días 3-5 → Revisión Rappi
📅 Días 7-10 → ¡Restaurante activo!

━━━━━━━━━━━━━━━━━━━━

Propuesta enviada por *${vars.nombre_asesor}*
${vars.email_asesor}
${vars.fecha}`;
}

export function Propuesta() {
  const navigate = useNavigate();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const { user } = useAuth();
  const [phone, setPhone] = useState('');

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const c = cc ? COMISIONES[cc] : null;

  const OPCIONES = c ? [
    { label: 'Full Service · Exclusivo',     value: c.fullExclusivo,    tipo_acuerdo: 'Exclusivo',     tipo_servicio: 'Full Service' },
    { label: 'Full Service · No exclusivo',  value: c.fullNoExclusivo,  tipo_acuerdo: 'No exclusivo',  tipo_servicio: 'Full Service' },
    { label: 'Marketplace · Exclusivo',      value: c.mktExclusivo,     tipo_acuerdo: 'Exclusivo',     tipo_servicio: 'Marketplace'  },
    { label: 'Marketplace · No exclusivo',   value: c.mktNoExclusivo,   tipo_acuerdo: 'No exclusivo',  tipo_servicio: 'Marketplace'  },
  ] : [];

  const [selectedOpcion, setSelectedOpcion] = useState(0);
  const opcionActual = OPCIONES[selectedOpcion] ?? { label: '', value: 0, tipo_acuerdo: '', tipo_servicio: '' };

  const now = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

  const vars = {
    restaurante: negociacion.restaurant_name || 'No especificado',
    pais: negociacion.country_name,
    ciudad: negociacion.city,
    tag: negociacion.tag,
    comision: String(opcionActual.value),
    tipo_acuerdo: opcionActual.tipo_acuerdo,
    tipo_servicio: opcionActual.tipo_servicio,
    mz_active_users: formatNumber(m?.mz_active_users),
    mz_active_users_prime: formatNumber(m?.mz_active_users_prime),
    mz_ticket_avg: formatCurrency(m?.mz_ticket_avg, cc),
    mz_store_orders_avg: formatNumber(m?.mz_store_orders_avg),
    mz_order_time_avg: m?.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'N/D',
    nombre_asesor: user?.full_name || '',
    email_asesor: user?.email || '',
    fecha: now,
  };

  const message = buildMessage(vars);
  const encodedMsg = encodeURIComponent(message);

  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Propuesta WhatsApp">
        <div className="px-6 py-16 max-w-md mx-auto text-center">
          <p className="text-5xl mb-4">💬</p>
          <h2 className="text-2xl font-bold text-dark mb-2">Sin negociación activa</h2>
          <p className="text-sm text-gray-500 mb-6">Configura la negociación para generar la propuesta.</p>
          <Button onClick={() => navigate('/negociacion')}>Ir a Negociación</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Propuesta WhatsApp">
      <div className="space-y-6">

        {/* Selector de comisión */}
        {OPCIONES.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Selecciona la comisión a ofrecer</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {OPCIONES.map((op, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOpcion(i)}
                  style={{
                    padding: '14px 16px', borderRadius: 12, border: `2px solid ${selectedOpcion === i ? '#FF441F' : '#e5e7eb'}`,
                    background: selectedOpcion === i ? 'rgba(255,68,31,0.05)' : 'white',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s'
                  }}
                >
                  <p style={{ fontSize: 22, fontWeight: 800, color: selectedOpcion === i ? '#FF441F' : '#1A1A2E', lineHeight: 1 }}>{op.value}%</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginTop: 4 }}>{op.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => { navigator.clipboard.writeText(message); toast.success('Mensaje copiado'); }} size="lg" className="flex-1 gap-2">
            <Copy size={16} /> Copiar mensaje
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.open(`https://wa.me/?text=${encodedMsg}`, '_blank')} className="flex-1 gap-2">
            <MessageCircle size={16} /> Compartir por WhatsApp
          </Button>
        </div>

        {/* Enviar a número */}
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Enviar a número específico</p>
          <div className="flex gap-3">
            <input
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              className="flex-1 h-9 px-3 rounded-xl border border-gray-medium text-sm bg-white text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <Button onClick={() => window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank')} disabled={!phone} className="gap-2 shrink-0">
              <Send size={14} /> Enviar
            </Button>
          </div>
        </Card>

        {/* Vista previa */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Vista previa</p>
          <div className="bg-[#e8fdd8] rounded-2xl rounded-tl-none p-6 border border-green-200 shadow-sm">
            <pre className="text-sm text-dark whitespace-pre-wrap font-sans leading-relaxed">{message}</pre>
            <p className="text-xs text-gray-400 text-right mt-4">{now}</p>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
