import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { COMISIONES } from '../data/comisiones';
import { toast } from 'sonner';
import { Copy, MessageCircle, Send, MapPin, Tag, Percent, Store } from 'lucide-react';

/* ─── Message builder (plain UTF-8, native emojis only) ─────────────────── */
function buildMessage(vars: Record<string, string>): string {
  return `*Propuesta Comercial Rappi* \uD83E\uDDE1

*Restaurante:* ${vars.restaurante}
*Pa\u00EDs:* ${vars.pais}
*Ciudad:* ${vars.ciudad}
*Categor\u00EDa:* ${vars.tag}
*Comisi\u00F3n:* ${vars.comision}% (${vars.tipo_acuerdo} / ${vars.tipo_servicio})

*\u00BFPor qu\u00E9 entrar a Rappi ahora?*

\u2705 Pagos semanales directos a tu cuenta
\u2705 Miles de clientes nuevos que hoy no te conocen
\u2705 Tus costos fijos no aumentan \u2014 solo pag\u00E1s por venta
\u2705 +60 millones de usuarios en Latinoam\u00E9rica
\u2705 Sesi\u00F3n fotogr\u00E1fica gratuita de tus productos
\u2705 El algoritmo prioriza restaurantes nuevos

*Para activarte necesitamos:*

\uD83D\uDCC4 Certificado bancario
\uD83D\uDCC4 Documento de identidad del representante
\uD83D\uDCC4 RUT/RFC/NIT/RUC
\uD83D\uDCC4 C\u00E1mara de comercio
\uD83C\uDF7D\uFE0F Men\u00FA con m\u00EDnimo 15 productos
\uD83D\uDCF8 Fotos de productos + logo + portada

\uD83D\uDCDE D\u00E9janos dos n\u00FAmeros de contacto para que tu Ejecutivo de Cuenta pueda comunicarse y brindarte el acompa\u00F1amiento necesario.

Si tienes alguna duda adicional con gusto podemos agendar una llamada o reuni\u00F3n para ampliar la informaci\u00F3n. \uD83E\uDDE1

_Propuesta enviada por *${vars.nombre_asesor}* el ${vars.fecha}_`;
}

/* ─── Render rich preview (parse *bold* and emoji blocks) ───────────────── */
interface PreviewBlock {
  type: 'header' | 'benefits' | 'requirements' | 'footer' | 'plain';
  lines: string[];
}

function parseBlocks(text: string): PreviewBlock[] {
  const lines = text.split('\n');
  const blocks: PreviewBlock[] = [];
  let current: PreviewBlock | null = null;

  const flush = () => { if (current) { blocks.push(current); current = null; } };

  for (const raw of lines) {
    const line = raw.trim();

    if (line.startsWith('*Propuesta Comercial') || line.startsWith('*Restaurante') ||
        line.startsWith('*País') || line.startsWith('*Ciudad') ||
        line.startsWith('*Categoría') || line.startsWith('*Comisión')) {
      if (current?.type !== 'header') { flush(); current = { type: 'header', lines: [] }; }
      current.lines.push(line);
    } else if (line.startsWith('✅')) {
      if (current?.type !== 'benefits') { flush(); current = { type: 'benefits', lines: [] }; }
      current.lines.push(line);
    } else if (line.startsWith('📄') || line.startsWith('🍽') || line.startsWith('📸') || line.startsWith('📞')) {
      if (current?.type !== 'requirements') { flush(); current = { type: 'requirements', lines: [] }; }
      current.lines.push(line);
    } else if (line.startsWith('_Propuesta enviada')) {
      flush(); current = { type: 'footer', lines: [line] }; flush();
    } else if (line !== '') {
      if (current?.type !== 'plain') { flush(); current = { type: 'plain', lines: [] }; }
      current.lines.push(line);
    } else {
      // blank line — close current block
      flush();
    }
  }
  flush();
  return blocks;
}

function renderBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith('*') && p.endsWith('*')
      ? <strong key={i} style={{ fontWeight: 800, color: '#1e293b' }}>{p.slice(1, -1)}</strong>
      : p
  );
}

function RichPreview({ message, now }: { message: string; now: string }) {
  const blocks = parseBlocks(message);

  return (
    <div style={{
      background: 'linear-gradient(145deg, #f8fafc 0%, #fff7f0 100%)',
      borderRadius: 24,
      padding: 24,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    }}>
      {/* WA top bar mock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#E8360E,#FF5A2C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={18} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#1A1A2E', lineHeight: 1 }}>Rappi Comercial</p>
          <p style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 2 }}>● en línea</p>
        </div>
      </div>

      {/* Bubble */}
      <div style={{
        background: '#fff',
        borderRadius: '20px 20px 20px 4px',
        padding: '20px 22px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {blocks.map((block, bi) => {
          if (block.type === 'header') return (
            <div key={bi} style={{ background: 'linear-gradient(135deg,rgba(255,68,31,0.08),rgba(255,90,44,0.04))', borderRadius: 12, padding: '12px 14px', borderLeft: '3px solid #FF441F' }}>
              {block.lines.map((l, li) => (
                <p key={li} style={{ fontSize: 13, lineHeight: 1.65, color: '#374151', margin: 0 }}>
                  {renderBold(l)}
                </p>
              ))}
            </div>
          );

          if (block.type === 'benefits') return (
            <div key={bi} style={{ background: 'rgba(209,250,229,0.45)', borderRadius: 12, padding: '12px 14px', border: '1px solid #a7f3d0' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Por qué Rappi</p>
              {block.lines.map((l, li) => (
                <p key={li} style={{ fontSize: 13, lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>{l}</p>
              ))}
            </div>
          );

          if (block.type === 'requirements') return (
            <div key={bi} style={{ background: 'rgba(219,234,254,0.40)', borderRadius: 12, padding: '12px 14px', border: '1px solid #bfdbfe' }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Documentación</p>
              {block.lines.map((l, li) => (
                <p key={li} style={{ fontSize: 13, lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>{l}</p>
              ))}
            </div>
          );

          if (block.type === 'footer') return (
            <div key={bi} style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10, marginTop: 2 }}>
              <p style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic', lineHeight: 1.55 }}>
                {renderBold(block.lines[0].replace(/^_|_$/g, ''))}
              </p>
            </div>
          );

          // plain
          return (
            <div key={bi}>
              {block.lines.map((l, li) => (
                <p key={li} style={{ fontSize: 13.5, lineHeight: 1.72, color: '#374151', margin: 0 }}>
                  {renderBold(l)}
                </p>
              ))}
            </div>
          );
        })}

        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', marginTop: 4 }}>{now} ✓✓</p>
      </div>
    </div>
  );
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
  .prop-root div {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Summary banner ── */
  .prop-summary {
    background: #fff7f5;
    border: 1.5px solid #fed7aa;
    border-radius: 18px;
    padding: 20px 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    align-items: center;
  }
  .prop-summary-item { display: flex; flex-direction: column; gap: 5px; }
  .prop-summary-icon-row { display: flex; align-items: center; gap: 6px; }
  .prop-summary-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #c2410c;
  }
  .prop-summary-value {
    font-size: 15px;
    font-weight: 700;
    color: #1A1A2E;
    line-height: 1.3;
  }
  .prop-summary-divider { width: 1px; background: #fed7aa; align-self: stretch; }

  /* ── Section label ── */
  .prop-section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 10px;
    margin-top: 24px;
  }

  /* ── Commission selector — compact ── */
  .prop-com-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .prop-com-btn {
    padding: 10px 14px;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
    background: white;
    cursor: pointer;
    text-align: center;
    transition: all 0.18s ease;
  }
  .prop-com-btn:hover { border-color: rgba(255,68,31,0.4); background: #fffaf8; }
  .prop-com-btn.active {
    border-color: #FF441F;
    background: rgba(255,68,31,0.04);
    box-shadow: 0 4px 14px rgba(255,68,31,0.12);
  }
  .prop-com-value { font-size: 22px; font-weight: 900; line-height: 1; margin-bottom: 3px; }
  .prop-com-label { font-size: 11px; font-weight: 600; color: #9ca3af; }

  /* ── Action buttons — equal grid ── */
  .prop-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .btn-wa-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #E8360E 0%, #FF5A2C 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(232,54,14,0.30);
    transition: all 0.25s ease;
    width: 100%;
  }
  .btn-wa-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(232,54,14,0.40); }
  .btn-wa-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    background: #f3f4f6;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    width: 100%;
  }
  .btn-wa-secondary:hover { background: #e5e7eb; color: #1A1A2E; }

  /* ── Phone card ── */
  .prop-phone-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .prop-phone-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 12px;
  }
  .prop-phone-row { display: flex; gap: 10px; align-items: center; max-width: 460px; }
  .prop-phone-input {
    width: 260px !important;
    height: 44px;
    padding: 0 16px !important;
    border-radius: 12px !important;
    border: 1.5px solid #e5e7eb !important;
    font-size: 14px !important;
    background: #fafafa !important;
    color: #1A1A2E !important;
    outline: none !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
    box-sizing: border-box !important;
    flex-shrink: 0;
  }
  .prop-phone-input:focus {
    border-color: #FF441F !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.10) !important;
    background: #fff !important;
  }
  .btn-phone-send {
    display: flex; align-items: center; gap: 7px;
    padding: 0 28px; height: 44px; border-radius: 12px;
    font-size: 13px; font-weight: 800; color: #fff;
    background: linear-gradient(135deg, #E8360E, #FF5A2C);
    border: none; cursor: pointer;
    box-shadow: 0 3px 12px rgba(232,54,14,0.25);
    transition: all 0.2s ease; flex-shrink: 0;
  }
  .btn-phone-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(232,54,14,0.35); }
  .btn-phone-send:disabled { opacity: 0.38; cursor: not-allowed; box-shadow: none; }

  /* ── Preview title ── */
  .prop-preview-title {
    font-size: 18px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Empty ── */
  .prop-empty { max-width: 360px; margin: 60px auto; text-align: center; }
  .prop-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: rgba(255,68,31,0.07);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .prop-summary { grid-template-columns: repeat(2, 1fr); }
    .prop-actions { grid-template-columns: 1fr; }
    .prop-summary-divider { display: none; }
    .prop-phone-input { width: 100% !important; }
    .prop-phone-row { max-width: 100%; }
  }
`;

/* ─── Component ─────────────────────────────────────────────────────────── */
export function Propuesta() {
  const navigate = useNavigate();
  const { negociacion, hasActiveNegociacion } = useNegociacion();
  const { user } = useAuth();
  const [phone, setPhone] = useState('');

  const m   = negociacion.metrics;
  const cc  = negociacion.country_code;
  const c   = cc ? COMISIONES[cc] : null;

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
    restaurante:           negociacion.restaurant_name || 'No especificado',
    pais:                  negociacion.country_name,
    ciudad:                negociacion.city,
    tag:                   negociacion.tag,
    comision:              String(opcionActual.value),
    tipo_acuerdo:          opcionActual.tipo_acuerdo,
    tipo_servicio:         opcionActual.tipo_servicio,
    mz_active_users:       formatNumber(m?.mz_active_users),
    mz_active_users_prime: formatNumber(m?.mz_active_users_prime),
    mz_ticket_avg:         formatCurrency(m?.mz_ticket_avg, cc),
    mz_store_orders_avg:   formatNumber(m?.mz_store_orders_avg),
    mz_order_time_avg:     m?.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'N/D',
    nombre_asesor:         user?.full_name || '',
    email_asesor:          user?.email || '',
    fecha:                 now,
  };

  const message    = buildMessage(vars);
  const encodedMsg = encodeURIComponent(message);

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
              style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg,#E8360E,#FF5A2C)', color: '#fff', border: 'none', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
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
      <div className="prop-root space-y-5">

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

        {/* ── 3. Action buttons — symmetric grid ── */}
        <div className="prop-actions">
          <button
            className="btn-wa-primary"
            onClick={() => window.open(`https://wa.me/?text=${encodedMsg}`, '_blank')}
          >
            <MessageCircle size={17} /> Enviar por WhatsApp
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

        {/* ── 5. Rich preview ── */}
        <div>
          <p className="prop-preview-title">
            <MessageCircle size={20} color="#FF441F" />
            Vista previa del mensaje
          </p>
          <RichPreview message={message} now={now} />
        </div>

      </div>
    </AppLayout>
  );
}
