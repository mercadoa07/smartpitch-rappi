import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { useNegociacion } from '../context/NegociacionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatNumber } from '../lib/currency';
import { getComision } from '../data/comisiones';
import {
  TrendingUp, Users, Clock, ShoppingBag, Zap, CheckCircle2,
  Copy, MessageCircle, AlertTriangle, ChevronRight, Star, Target
} from 'lucide-react';
import { toast } from 'sonner';

/* ─── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .pitch-root,
  .pitch-root * {
    font-family: 'Poppins', system-ui, -apple-system, sans-serif !important;
  }

  /* ── Hero banner ── */
  .pitch-hero {
    background: linear-gradient(135deg, #1A1A2E 0%, #2d2d4e 100%);
    border-radius: 20px;
    padding: 28px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 8px 32px rgba(26,26,46,0.18);
  }
  .pitch-hero-left { flex: 1; }
  .pitch-hero-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin-bottom: 4px;
  }
  .pitch-hero-name {
    font-size: 24px;
    font-weight: 900;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 6px;
  }
  .pitch-hero-sub {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
  }
  .pitch-hero-badge {
    background: linear-gradient(135deg, #E8360E, #FF5A2C);
    border-radius: 14px;
    padding: 12px 20px;
    text-align: center;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(232,54,14,0.35);
  }
  .pitch-hero-badge-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 2px;
  }
  .pitch-hero-badge-value {
    font-size: 28px;
    font-weight: 900;
    color: #fff;
    line-height: 1;
  }
  .pitch-hero-badge-unit {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    margin-top: 2px;
  }

  /* ── Stats row ── */
  .pitch-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  .pitch-stat-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    padding: 18px 16px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .pitch-stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
  .pitch-stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
  }
  .pitch-stat-value {
    font-size: 18px;
    font-weight: 800;
    color: #1A1A2E;
    line-height: 1.1;
    margin-bottom: 3px;
  }
  .pitch-stat-label {
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── Phase cards ── */
  .phase-card {
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
  }
  .phase-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.09);
  }
  .phase-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 24px;
  }
  .phase-num {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 900;
    flex-shrink: 0;
  }
  .phase-title {
    font-size: 15px;
    font-weight: 800;
    flex: 1;
  }
  .phase-body {
    padding: 0 24px 22px;
  }
  .phase-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.75;
  }
  .phase-copy-row {
    margin-top: 14px;
    display: flex;
    justify-content: flex-end;
  }

  /* Copy button */
  .btn-copy {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,0,0,0.06);
    border: none;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    color: #374151;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .btn-copy:hover {
    background: rgba(0,0,0,0.10);
    color: #1A1A2E;
  }

  /* Data pill (injected values) */
  .pill-data {
    display: inline;
    background: rgba(255,68,31,0.10);
    color: #E8360E;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 6px;
    font-size: 13.5px;
  }
  .pill-missing {
    display: inline;
    background: rgba(234,179,8,0.12);
    color: #b45309;
    font-weight: 600;
    padding: 1px 7px;
    border-radius: 6px;
    font-size: 13px;
    font-style: italic;
  }

  /* ── Action buttons ── */
  .pitch-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  .btn-pitch-primary {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #E8360E 0%, #FF5A2C 100%);
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(232,54,14,0.32);
    transition: all 0.25s ease;
  }
  .btn-pitch-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232,54,14,0.42);
  }
  .btn-pitch-outline {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    color: #1A1A2E;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .btn-pitch-outline:hover {
    border-color: #E8360E;
    color: #E8360E;
    background: rgba(232,54,14,0.04);
  }

  /* ── Legend ── */
  .pitch-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
  }

  /* ── Empty state ── */
  .pitch-empty {
    max-width: 380px;
    margin: 60px auto;
    text-align: center;
  }
  .pitch-empty-icon {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: rgba(255,68,31,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .pitch-stats { grid-template-columns: repeat(2, 1fr); }
    .pitch-hero { flex-direction: column; align-items: flex-start; }
    .pitch-actions { flex-direction: column; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function injectValues(text: string, vars: Record<string, string>): React.ReactNode[] {
  const parts = text.split(/(\{[A-Z_]+\})/g);
  return parts.map((part, i) => {
    const match = part.match(/^\{([A-Z_]+)\}$/);
    if (!match) return part;
    const key = match[1];
    const val = vars[key];
    if (!val || val === 'Dato no disponible') {
      return <span key={i} className="pill-missing">[{key.replace(/_/g, ' ')}]</span>;
    }
    return <span key={i} className="pill-data">{val}</span>;
  });
}

function injectText(text: string, vars: Record<string, string>): string {
  return text.replace(/\{([A-Z_]+)\}/g, (_, key) => vars[key] || `[${key}]`);
}

/* ─── Phase definitions ──────────────────────────────────────────────────── */
interface Phase {
  num: number;
  titulo: string;
  icon: React.ReactNode;
  headerBg: string;
  headerBorder: string;
  numBg: string;
  numColor: string;
  titleColor: string;
  bodyBg: string;
  contenido: string;
}

function buildFases(tipoServicio: string, tipoAcuerdo: string): Phase[] {
  const esFullService = tipoServicio === 'full_service';
  const esExclusivo = tipoAcuerdo === 'exclusivo';

  return [
    {
      num: 1,
      titulo: 'Apertura — Primera Impresión',
      icon: <Zap size={16} />,
      headerBg: '#fff7ed',
      headerBorder: '#fed7aa',
      numBg: '#ffedd5',
      numColor: '#c2410c',
      titleColor: '#9a3412',
      bodyBg: '#fffbf7',
      contenido: `¡Buenos días! Soy {NOMBRE_ASESOR} de Rappi. 🙌 Le llamo porque identificamos que restaurantes de {TAG} como {NOMBRE_RESTAURANTE} tienen una oportunidad real de crecer en {CIUDAD} con nosotros, y quería contarle por qué esto puede ser un antes y un después para su negocio. ¿Tiene dos minutos?`,
    },
    {
      num: 2,
      titulo: 'Contexto de Zona — Los Datos Hablan',
      icon: <TrendingUp size={16} />,
      headerBg: '#eff6ff',
      headerBorder: '#bfdbfe',
      numBg: '#dbeafe',
      numColor: '#1d4ed8',
      titleColor: '#1e40af',
      bodyBg: '#f8faff',
      contenido: `En su zona tenemos {MZ_ACTIVE_USERS} usuarios activos en Rappi, de los cuales {MZ_ACTIVE_USERS_PRIME} son clientes Prime con alta frecuencia de compra. El ticket promedio en {TAG} es de {MZ_TICKET_AVG} y cada tienda recibe en promedio {MZ_STORE_ORDERS_AVG} órdenes al mes, con tiempos de entrega de {MZ_ORDER_TIME_AVG} minutos. A nivel ciudad, compite con {CITY_STORES_COUNT_TAG} tiendas que ya están capturando {CITY_ORDERS_TAG_AVG} órdenes en promedio. La pregunta es: ¿por qué no estar donde ya están sus clientes?`,
    },
    {
      num: 3,
      titulo: 'Propuesta de Valor — Por Qué Rappi',
      icon: <Star size={16} />,
      headerBg: '#f0fdf4',
      headerBorder: '#bbf7d0',
      numBg: '#dcfce7',
      numColor: '#15803d',
      titleColor: '#166534',
      bodyBg: '#f7fef9',
      contenido: esFullService
        ? `Con Rappi Full Service, usted solo se enfoca en cocinar: nosotros ponemos los repartidores, la tecnología y la visibilidad. Cero inversión en logística. Usted recibe el pedido, lo prepara, y nosotros lo llevamos. Es la forma más inteligente de abrir un canal de ventas digital sin complicaciones operativas.`
        : `Con Rappi Marketplace, usted usa su propia red de entrega y paga una comisión menor. Es ideal si ya tiene repartidores propios y quiere aprovechar la demanda de Rappi sin ceder el control logístico. Menor costo, más autonomía, más clientes.`,
    },
    {
      num: 4,
      titulo: 'Comisión — Transparencia Total',
      icon: <Target size={16} />,
      headerBg: '#fdf4ff',
      headerBorder: '#e9d5ff',
      numBg: '#f3e8ff',
      numColor: '#7c3aed',
      titleColor: '#6d28d9',
      bodyBg: '#fefbff',
      contenido: `La comisión para un acuerdo {TIPO_SERVICIO} {TIPO_ACUERDO} en su caso es del {COMISION}%. ${esExclusivo ? 'Al ser exclusivo con Rappi, tiene acceso a nuestras mejores condiciones comerciales, mayor visibilidad en el catálogo y soporte prioritario.' : 'Y si en el futuro crece con nosotros, podemos revisar condiciones exclusivas que mejoran aún más su rentabilidad.'} Esto es lo que cobramos; sin costos ocultos.`,
    },
    {
      num: 5,
      titulo: 'Cierre — El Siguiente Paso',
      icon: <CheckCircle2 size={16} />,
      headerBg: '#1A1A2E',
      headerBorder: '#1A1A2E',
      numBg: 'rgba(255,255,255,0.15)',
      numColor: '#fff',
      titleColor: '#fff',
      bodyBg: '#22223b',
      contenido: `¿Le parece si avanzamos hoy mismo? El proceso de vinculación es rápido, y en cuestión de días {NOMBRE_RESTAURANTE} ya podría estar recibiendo pedidos en Rappi. Solo necesitamos algunos documentos básicos para activar su tienda. Le acompaño en cada paso. ¿Arrancamos?`,
    },
  ];
}

/* ─── Component ──────────────────────────────────────────────────────────── */
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

  const FASES = buildFases(negociacion.tipo_servicio, negociacion.tipo_acuerdo);

  /* ── Empty state ── */
  if (!hasActiveNegociacion) {
    return (
      <AppLayout title="Pitch Comercial">
        <style>{css}</style>
        <div className="pitch-root">
          <div className="pitch-empty">
            <div className="pitch-empty-icon">
              <MessageCircle size={32} color="#E8360E" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>Sin negociación activa</h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
              Configura los datos del restaurante primero para activar el pitch con datos reales.
            </p>
            <button className="btn-pitch-primary" style={{ width: '100%' }} onClick={() => navigate('/negociacion')}>
              <ChevronRight size={16} /> Ir a Negociación
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  /* ── Stats for hero row ── */
  const stats = [
    { icon: <Users size={18} color="#2563eb" />, iconBg: '#dbeafe', value: formatNumber(m?.mz_active_users), label: 'Usuarios activos' },
    { icon: <Star size={18} color="#7c3aed" />, iconBg: '#f3e8ff', value: formatNumber(m?.mz_active_users_prime), label: 'Usuarios Prime' },
    { icon: <ShoppingBag size={18} color="#15803d" />, iconBg: '#dcfce7', value: formatNumber(m?.mz_store_orders_avg), label: 'Órdenes / tienda' },
    { icon: <Clock size={18} color="#c2410c" />, iconBg: '#ffedd5', value: m?.mz_order_time_avg != null ? `${m.mz_order_time_avg} min` : '—', label: 'Tiempo entrega' },
  ];

  return (
    <AppLayout title="Pitch Comercial">
      <style>{css}</style>
      <div className="pitch-root space-y-5">

        {/* ── Hero banner ── */}
        <div className="pitch-hero">
          <div className="pitch-hero-left">
            <p className="pitch-hero-eyebrow">Pitch activo · {negociacion.city} · {negociacion.tag}</p>
            <p className="pitch-hero-name">
              {negociacion.restaurant_name || `${negociacion.city} — ${negociacion.tag}`}
            </p>
            <p className="pitch-hero-sub">
              {negociacion.tipo_servicio === 'full_service' ? 'Full Service' : 'Marketplace'} &nbsp;·&nbsp;
              {negociacion.tipo_acuerdo === 'exclusivo' ? 'Exclusivo' : 'No exclusivo'}
            </p>
          </div>
          {comision != null && (
            <div className="pitch-hero-badge">
              <p className="pitch-hero-badge-label">Comisión</p>
              <p className="pitch-hero-badge-value">{comision}%</p>
              <p className="pitch-hero-badge-unit">{negociacion.tipo_acuerdo === 'exclusivo' ? 'Exclusivo' : 'No exclusivo'}</p>
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="pitch-stats">
          {stats.map((s, i) => (
            <div key={i} className="pitch-stat-card">
              <div className="pitch-stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
              <p className="pitch-stat-value">{s.value}</p>
              <p className="pitch-stat-label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Phase cards ── */}
        {FASES.map((fase) => (
          <div key={fase.num} className="phase-card" style={{ border: `1px solid ${fase.headerBorder}` }}>
            {/* Header */}
            <div className="phase-header" style={{ background: fase.headerBg, borderBottom: `1px solid ${fase.headerBorder}` }}>
              <div className="phase-num" style={{ background: fase.numBg, color: fase.numColor }}>
                {fase.num}
              </div>
              <p className="phase-title" style={{ color: fase.titleColor }}>{fase.titulo}</p>
              <div style={{ color: fase.numColor, opacity: 0.7 }}>{fase.icon}</div>
            </div>
            {/* Body */}
            <div className="phase-body" style={{ background: fase.bodyBg }}>
              <p className="phase-text" style={{ color: fase.num === 5 ? 'rgba(255,255,255,0.88)' : '#374151' }}>
                {injectValues(fase.contenido, vars)}
              </p>
              <div className="phase-copy-row">
                <button
                  className="btn-copy"
                  style={fase.num === 5 ? { background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' } : {}}
                  onClick={() => {
                    navigator.clipboard.writeText(injectText(fase.contenido, vars));
                    toast.success('Texto copiado al portapapeles');
                  }}
                >
                  <Copy size={12} /> Copiar fase
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* ── Legend ── */}
        <div className="pitch-legend">
          <div className="legend-item">
            <span className="pill-data" style={{ fontSize: 11 }}>valor</span>
            Dato inyectado
          </div>
          <div className="legend-item">
            <span className="pill-missing" style={{ fontSize: 11 }}>faltante</span>
            Dato no disponible
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="pitch-actions">
          <button className="btn-pitch-outline" onClick={() => navigate('/objeciones')}>
            <AlertTriangle size={15} /> Manejo de objeciones
          </button>
          <button className="btn-pitch-primary" onClick={() => navigate('/propuesta')}>
            <MessageCircle size={15} /> Enviar propuesta WhatsApp
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
