import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { COMISIONES } from '../data/comisiones';
import { toast } from 'sonner';
import { Copy, MessageCircle, Send, MapPin, Tag, Percent, Store } from 'lucide-react';

/* ─── Message builder ────────────────────────────────────────────────────── */
function buildMessage(vars: Record<string, string>): string {
  return `*Propuesta Comercial Rappi* 🧡

*Restaurante:* ${vars.restaurante}
*País:* ${vars.pais}
*Ciudad:* ${vars.ciudad}
*Categoría:* ${vars.tag}
*Comisión:* ${vars.comision}% (${vars.tipo_acuerdo} / ${vars.tipo_servicio})

*¿Por qué entrar a Rappi ahora?*

✅ Pagos semanales directos a tu cuenta
✅ Miles de clientes nuevos que hoy no te conocen
✅ Tus costos fijos no aumentan — solo pagás por venta
✅ +60 millones de usuarios en Latinoamérica
✅ Sesión fotográfica gratuita de tus productos
✅ El algoritmo prioriza restaurantes nuevos

*Para activarte necesitamos:*

📄 Certificado bancario
📄 Documento de identidad del representante
📄 RUT/RFC/NIT/RUC
📄 Cámara de comercio
🍽️ Menú con mínimo 15 productos
📸 Fotos de productos + logo + portada
📞 Déjanos dos números de contacto para que tu Ejecutivo de Cuenta pueda comunicarse y brindarte el acompañamiento necesario.

Si tienes alguna duda o deseas ampliar la información, con gusto podemos agendar una llamada o una reunión. 🧡

_Propuesta enviada por *${vars.nombre_asesor}* el ${vars.fecha}_`;
}

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .prop-root,
  .prop-root *,
  .prop-root input,
  .prop-root button,
  .prop-root p,
  .prop-root h2,
  .prop-root span,
  .prop-root div,
  .prop-root pre {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Summary banner ── */
  .prop-summary {
    background: #fff7f5;
    border: 1.5px solid #fed7aa;
    border-radius: 18px;
    padding: 24px 28px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .prop-summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .prop-summary-icon-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
  .prop-summary-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #c2410c;
  }
  .prop-summary-value {
    font-size: 14px;
    font-weight: 700;
    color: #1A1A2E;
    line-height: 1.3;
  }
  .prop-summary-divider {
    width: 1px;
    background: #fed7aa;
    align-self: stretch;
  }

  /* ── Commission selector ── */
  .prop-com-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .prop-com-btn {
    padding: 14px 16px;
    border-radius: 14px;
    border: 2px solid #e5e7eb;
    background: white;
    cursor: pointer;
    text-align: center;
    transition: all 0.18s ease;
  }
  .prop-com-btn:hover {
    border-color: rgba(255,68,31,0.4);
    background: #fffaf8;
  }
  .prop-com-btn.active {
    border-color: #FF441F;
    background: rgba(255,68,31,0.04);
    box-shadow: 0 4px 14px rgba(255,68,31,0.12);
  }
  .prop-com-value {
    font-size: 26px;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 4px;
  }
  .prop-com-label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
  }

  /* ── Action buttons ── */
  .prop-actions {
    display: flex;
    gap: 12px;
  }
  .btn-wa-primary {
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 15px 24px;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #E8360E 0%, #FF5A2C 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(232,54,14,0.32);
    transition: all 0.25s ease;
    letter-spacing: 0.01em;
  }
  .btn-wa-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(232,54,14,0.42);
  }
  .btn-wa-secondary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 15px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    background: #f3f4f6;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .btn-wa-secondary:hover {
    background: #e5e7eb;
    color: #1A1A2E;
  }

  /* ── Phone input row ── */
  .prop-phone-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 22px 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .prop-phone-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 12px;
  }
  .prop-phone-row {
    display: flex;
    gap: 10px;
  }
  .prop-phone-input {
    flex: 1;
    height: 46px;
    padding: 0 16px !important;
    border-radius: 12px !important;
    border: 1.5px solid #e5e7eb !important;
    font-size: 14px !important;
    background: #fafafa !important;
    color: #1A1A2E !important;
    outline: none !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    box-sizing: border-box !important;
  }
  .prop-phone-input:focus {
    border-color: #FF441F !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.10) !important;
    background: #fff !important;
  }
  .btn-phone-send {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 20px;
    height: 46px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #E8360E, #FF5A2C);
    border: none;
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(232,54,14,0.28);
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .btn-phone-send:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(232,54,14,0.36);
  }
  .btn-phone-send:disabled {
    opacity: 0.40;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* ── WhatsApp bubble preview ── */
  .prop-preview-wrap {
    background: #e8f5e2;
    border-radius: 20px;
    padding: 24px;
    border: 1px solid #c8e6c9;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.04);
  }
  .prop-preview-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #4caf50;
    margin-bottom: 14px;
  }
  .prop-bubble {
    background: #fff;
    border-radius: 16px 16px 16px 4px;
    padding: 18px 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.10);
    max-width: 600px;
  }
  .prop-bubble-text {
    font-size: 13.5px;
    color: #111827;
    white-space: pre-wrap;
    line-height: 1.72;
    word-break: break-word;
  }
  .prop-bubble-time {
    font-size: 11px;
    color: #9ca3af;
    text-align: right;
    margin-top: 10px;
  }

  /* ── Empty state ── */
  .prop-empty {
    max-width: 360px;
    margin: 60px auto;
    text-align: center;
  }
  .prop-empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(255,68,31,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  /* ── Section title ── */
  .prop-section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 12px;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .prop-summary { grid-template-columns: repeat(2, 1fr); }
    .prop-actions { flex-direction: column; }
    .prop-summary-divider { display: none; }
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */
export function Propuesta() {
  const navigate = useNavigate();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const { user } = useAuth();
  const [phone, setPhone] = useState('');

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const c = cc ? COMISIONES[cc] : null;

  const OPCIONES = c ? [
    { label: 'Full Service · Exclusivo',    value: c.fullExclusivo,   tipo_acuerdo: 'Exclusivo',    tipo_servicio: 'Full Service' },
    { label: 'Full Service · No exclusivo', value: c.fullNoExclusivo, tipo_acuerdo: 'No exclusivo', tipo_servicio: 'Full Service' },
    { label: 'Marketplace · Exclusivo',     value: c.mktExclusivo,    tipo_acuerdo: 'Exclusivo',    tipo_servicio: 'Marketplace'  },
    { label: 'Marketplace · No exclusivo',  value: c.mktNoExclusivo,  tipo_acuerdo: 'No exclusivo', tipo_servicio: 'Marketplace'  },
  ] : [];

  const [selectedOpcion, setSelectedOpcion] = useState(0);
  const opcionActual = OPCIONES[selectedOpcion] ?? { label: '', value: 0, tipo_acuerdo: '', tipo_servicio: '' };

  const now = new Date().toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' });

  const vars: Record<string, string> = {
    restaurante:          negociacion.restaurant_name || 'No especificado',
    pais:                 negociacion.country_name,
    ciudad:               negociacion.city,
    tag:                  negociacion.tag,
    comision:             String(opcionActual.value),
    tipo_acuerdo:         opcionActual.tipo_acuerdo,
    tipo_servicio:        opcionActual.tipo_servicio,
    mz_active_users:      formatNumber(m?.mz_active_users),
    mz_active_users_prime:formatNumber(m?.mz_active_users_prime),
    mz_ticket_avg:        formatCurrency(m?.mz_ticket_avg, cc),
    mz_store_orders_avg:  formatNumber(m?.mz_store_orders_avg),
    mz_order_time_avg:    m?.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'N/D',
    nombre_asesor:        user?.full_name || '',
    email_asesor:         user?.email || '',
    fecha:                now,
  };

  const message     = buildMessage(vars);
  const encodedMsg  = encodeURIComponent(message);

  /* ── Empty state ── */
  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Propuesta WhatsApp">
        <style>{css}</style>
        <div className="prop-root">
          <div className="prop-empty">
            <div className="prop-empty-icon">
              <MessageCircle size={32} color="#E8360E" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Sin negociación activa</h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
              Configura los datos del restaurante para generar la propuesta.
            </p>
            <button
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg,#E8360E,#FF5A2C)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
              onClick={() => navigate('/negociacion')}
            >
              Ir a Negociación →
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Propuesta WhatsApp">
      <style>{css}</style>
      <div className="prop-root space-y-6">

        {/* ── 1. Summary banner ── */}
        <div className="prop-summary">
          <div className="prop-summary-item">
            <div className="prop-summary-icon-row">
              <Store size={13} color="#FF441F" />
              <span className="prop-summary-label">Restaurante</span>
            </div>
            <span className="prop-summary-value">{vars.restaurante}</span>
          </div>

          <div className="prop-summary-divider" />

          <div className="prop-summary-item">
            <div className="prop-summary-icon-row">
              <MapPin size={13} color="#FF441F" />
              <span className="prop-summary-label">Ubicación</span>
            </div>
            <span className="prop-summary-value">{vars.ciudad}, {vars.pais}</span>
          </div>

          <div className="prop-summary-divider" />

          <div className="prop-summary-item">
            <div className="prop-summary-icon-row">
              <Tag size={13} color="#FF441F" />
              <span className="prop-summary-label">Categoría</span>
            </div>
            <span className="prop-summary-value">{vars.tag || '—'}</span>
          </div>

          <div className="prop-summary-divider" />

          <div className="prop-summary-item">
            <div className="prop-summary-icon-row">
              <Percent size={13} color="#FF441F" />
              <span className="prop-summary-label">Comisión activa</span>
            </div>
            <span className="prop-summary-value" style={{ color: '#FF441F' }}>
              {opcionActual.value}% — {opcionActual.tipo_servicio}
            </span>
          </div>
        </div>

        {/* ── 2. Commission selector ── */}
        {OPCIONES.length > 0 && (
          <div>
            <p className="prop-section-title">Selecciona la comisión a ofrecer</p>
            <div className="prop-com-grid">
              {OPCIONES.map((op, i) => (
                <button
                  key={i}
                  className={`prop-com-btn${selectedOpcion === i ? ' active' : ''}`}
                  onClick={() => setSelectedOpcion(i)}
                >
                  <p className="prop-com-value" style={{ color: selectedOpcion === i ? '#FF441F' : '#1A1A2E' }}>
                    {op.value}%
                  </p>
                  <p className="prop-com-label">{op.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. Action buttons ── */}
        <div className="prop-actions">
          <button
            className="btn-wa-primary"
            onClick={() => window.open(`https://wa.me/?text=${encodedMsg}`, '_blank')}
          >
            <MessageCircle size={18} /> Enviar por WhatsApp
          </button>
          <button
            className="btn-wa-secondary"
            onClick={() => { navigator.clipboard.writeText(message); toast.success('Mensaje copiado'); }}
          >
            <Copy size={15} /> Copiar propuesta
          </button>
        </div>

        {/* ── 4. Send to specific number ── */}
        <div className="prop-phone-card">
          <p className="prop-phone-label">Enviar a número específico</p>
          <div className="prop-phone-row">
            <input
              type="tel"
              placeholder="+57 300 000 0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="prop-phone-input"
            />
            <button
              className="btn-phone-send"
              disabled={!phone}
              onClick={() => window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMsg}`, '_blank')}
            >
              <Send size={14} /> Enviar
            </button>
          </div>
        </div>

        {/* ── 5. WhatsApp bubble preview ── */}
        <div className="prop-preview-wrap">
          <p className="prop-preview-label">📱 Vista previa del mensaje</p>
          <div className="prop-bubble">
            <pre className="prop-bubble-text">{message}</pre>
            <p className="prop-bubble-time">{now} ✓✓</p>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
