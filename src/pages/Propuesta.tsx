import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { getComision } from '../data/comisiones';
import { useToast } from '../components/ui/Toast';
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
  const { showToast } = useToast();
  const [phone, setPhone] = useState('');

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const comision = hasActiveNegociacion
    ? getComision(cc, negociacion.tipo_servicio, negociacion.tipo_acuerdo)
    : 0;

  const now = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

  const vars = {
    restaurante: negociacion.restaurant_name || 'No especificado',
    pais: negociacion.country_name,
    ciudad: negociacion.city,
    tag: negociacion.tag,
    comision: String(comision),
    tipo_acuerdo: negociacion.tipo_acuerdo === 'exclusivo' ? 'Exclusivo' : 'No exclusivo',
    tipo_servicio: negociacion.tipo_servicio === 'full_service' ? 'Full Service' : 'Marketplace',
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

  const copyMessage = () => {
    navigator.clipboard.writeText(message);
    showToast('Mensaje copiado al portapapeles');
  };

  const openWhatsApp = (number?: string) => {
    const url = number
      ? `https://wa.me/${number.replace(/\D/g, '')}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;
    window.open(url, '_blank');
  };

  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Propuesta WhatsApp">
        <div className="px-4 py-8 max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sin negociación activa</h2>
          <p className="text-gray-500 mb-6">Configura la negociación para generar la propuesta con datos reales.</p>
          <Button onClick={() => navigate('/negociacion')}>Ir a Negociación</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Propuesta WhatsApp">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <Button onClick={copyMessage} className="w-full gap-2">
            <Copy size={16} />
            Copiar mensaje
          </Button>
          <Button variant="secondary" onClick={() => openWhatsApp()} className="w-full gap-2">
            <MessageCircle size={16} />
            Compartir por WhatsApp
          </Button>
        </div>

        {/* Enviar a número específico */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Enviar a número específico</h3>
          <div className="flex gap-2">
            <Input
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              className="flex-1"
            />
            <Button onClick={() => openWhatsApp(phone)} disabled={!phone} className="gap-1.5 flex-shrink-0">
              <Send size={14} />
              Enviar
            </Button>
          </div>
        </Card>

        {/* Vista previa estilo WhatsApp */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-2">Vista previa del mensaje</h3>
          <div className="bg-[#e8fdd8] rounded-2xl rounded-tl-none p-4 border border-green-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {message}
            </pre>
            <p className="text-xs text-gray-400 text-right mt-2">{now}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
