import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare, ShieldAlert, Calculator, CheckSquare, Target,
  Lightbulb, ChevronRight, Sparkles,
  Phone, MessageCircle, Database, ArrowRight,
  BookOpen, ClipboardList
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = [
  { to: '/pitch',       icon: MessageSquare, label: 'Pitch',       desc: 'Libreto dinámico',        bg: '#fff7ed', color: '#f97316' },
  { to: '/objeciones',  icon: ShieldAlert,   label: 'Objeciones',  desc: '15 respuestas clave',     bg: '#faf5ff', color: '#a855f7' },
  { to: '/calculadora', icon: Calculator,    label: 'Calculadora', desc: 'Proyección de ganancias', bg: '#fefce8', color: '#eab308' },
  { to: '/requisitos',  icon: ClipboardList, label: 'Requisitos',  desc: 'Checklist activación',    bg: '#fdf2f8', color: '#ec4899' },
  { to: '/negociacion', icon: Target,        label: 'Negociación', desc: 'Configura tu deal',       bg: '#fff7ed', color: '#FF441F' },
  { to: '/tips-ventas', icon: Lightbulb,     label: 'Tips Ventas', desc: 'Estrategias de cierre',   bg: '#f0fdf4', color: '#22c55e' },
];

const STEPS = [
  { num: 1, to: '/negociacion',  label: 'Conoce tu mercado',    icon: Target,        color: '#FF441F' },
  { num: 2, to: '/pitch',        label: 'Domina tu pitch',      icon: MessageSquare, color: '#f97316' },
  { num: 3, to: '/objeciones',   label: 'Maneja objeciones',    icon: ShieldAlert,   color: '#a855f7' },
  { num: 4, to: '/propuesta',    label: 'Envía la propuesta',   icon: CheckSquare,   color: '#22c55e' },
  { num: 5, to: '/tips-ventas',  label: 'Revisa Tips de Ventas',icon: Lightbulb,     color: '#eab308' },
];

const TIPS_TABS = [
  { id: 'llamadas', label: 'Llamadas en Frío', icon: Phone },
  { id: 'hubspot',  label: 'HubSpot CRM',      icon: Database },
  { id: 'whatsapp', label: 'WhatsApp',          icon: MessageCircle },
];

const COUNTRIES = [
  { code: 'CO', flag: '🇨🇴', name: 'Colombia'  },
  { code: 'MX', flag: '🇲🇽', name: 'México'    },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', flag: '🇨🇱', name: 'Chile'     },
  { code: 'PE', flag: '🇵🇪', name: 'Perú'      },
  { code: 'EC', flag: '🇪🇨', name: 'Ecuador'   },
];

const TIPS_CONTENT: Record<string, Record<string, string[]>> = {
  llamadas: {
    CO: ['Llama entre 10am–12pm o 3pm–5pm.', 'Saluda con "¿Habla con el dueño o encargado?" antes de presentarte.', 'Menciona restaurantes conocidos de la zona que ya usan Rappi.'],
    MX: ['Usa un tono cálido y directo desde el inicio.', 'Referencia éxitos locales: "taquerías en tu colonia ya venden 30% más".', 'Evita lunes por la mañana; martes y jueves funcionan mejor.'],
    AR: ['Sé directo y argumentativo; el restaurantero porteño valora datos.', 'Habla de márgenes y ticket promedio desde la primera llamada.', 'Confirma siempre con un "¿Te queda claro?" para generar compromiso.'],
    CL: ['Tono formal pero cercano; usa "usted" al inicio.', 'Destaca la puntualidad y confiabilidad de la plataforma.', 'Agenda una demo corta de 10 min como siguiente paso.'],
    PE: ['Menciona el crecimiento del delivery post-pandemia en Lima.', 'Ofrece un caso de éxito local como gancho inicial.', 'Cierra la llamada proponiendo una visita presencial.'],
    EC: ['Resalta la simplicidad de onboarding (menos de 48 h).', 'Habla de comisiones competitivas vs. otras plataformas.', 'El WhatsApp funciona mejor que el email para hacer seguimiento.'],
  },
  hubspot: {
    CO: ['Registra cada interacción en el mismo día.', 'Usa la etiqueta "Interesado" al primer contacto positivo.', 'Programa follow-up automático a 48 h si no hay respuesta.'],
    MX: ['Aprovecha las secuencias de HubSpot para 3 toques en 7 días.', 'Adjunta el deck de propuesta directamente en el deal.', 'Usa notas de voz en el registro para ahorrar tiempo.'],
    AR: ['Filtra tu pipeline por "último contacto > 5 días" cada mañana.', 'Asigna una tarea de cierre a cada deal en etapa "Propuesta".', 'Integra WhatsApp Business con HubSpot para trazabilidad.'],
    CL: ['Define fechas de cierre estimadas desde que abres el deal.', 'Sube el menú del restaurante como documento adjunto.', 'Usa el tablero Kanban para reuniones semanales de equipo.'],
    PE: ['Crea vistas personalizadas por zona o distrito.', 'Registra objeciones en el campo de notas para aprender.', 'Revisa el "Health Score" del deal antes de cada llamada.'],
    EC: ['Mantén el estado del deal actualizado en tiempo real.', 'Usa plantillas de email predefinidas para agilizar seguimientos.', 'Marca los deals "en riesgo" con la etiqueta roja de HubSpot.'],
  },
  whatsapp: {
    CO: ['Saluda por nombre y menciona el barrio del restaurante.', 'Envía el video demo de 60 s como primer mensaje.', 'Usa listas de difusión segmentadas por ciudad.'],
    MX: ['Manda un voice note de 20 s en lugar de texto largo.', 'Envía la propuesta en PDF, nunca como imagen.', 'Usa emojis con moderación: 🍕🚀 generan más apertura.'],
    AR: ['Escribe mensajes cortos y concretos; evita el texto en bloque.', 'Comparte screenshots de ganancias de aliados similares.', 'Propón siempre un horario de videollamada al finalizar.'],
    CL: ['Mantén un tono profesional incluso en WhatsApp.', 'Envía recordatorios 1 h antes de cualquier reunión agendada.', 'Confirma la lectura con "¿Pudiste revisar la propuesta?".'],
    PE: ['Usa stickers de la marca Rappi para generar familiaridad.', 'Envía el catálogo de beneficios en formato carrusel.', 'Haz seguimiento a las 24 h si el mensaje tiene doble check azul.'],
    EC: ['El horario ideal de envío es 9am y 7pm.', 'Personaliza el saludo con el nombre del restaurante.', 'Cierra siempre con una pregunta abierta para mantener el hilo.'],
  },
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = user?.full_name?.split(' ')[0] || 'asesor';
  const isFemale = user?.email?.includes('a.') || user?.email?.endsWith('a@rappi.com');
  const readyLabel = isFemale ? '¿Lista para vender? 🔥' : '¿Listo para vender? 🔥';

  const [activeTab,     setActiveTab]     = useState('llamadas');
  const [activeCountry, setActiveCountry] = useState('CO');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .home-root, .home-root * { font-family: 'Poppins', sans-serif !important; }
        .section-card { transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: none; }
        .section-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.10); }
        .step-row-item { transition: background 0.18s; cursor: pointer; }
        .step-row-item:hover { background: rgba(255,68,31,0.05); border-radius: 14px; }
      `}</style>

      <AppLayout title="Inicio">
        <div className="home-root" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 72 }}>

          {/* ══════════════════════════════════════
              HERO / SALUDO
          ══════════════════════════════════════ */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 48,
            padding: '32px 36px',
            background: 'linear-gradient(130deg, #fff7ed 0%, #ffedd5 100%)',
            borderRadius: 24,
            border: '1px solid #fed7aa',
          }}>
            {/* Ícono + texto */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: '#FF441F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(255,68,31,0.30)',
                flexShrink: 0,
              }}>
                <Sparkles size={28} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1A1A2E', margin: 0, lineHeight: 1.2 }}>
                  ¡Hola, {firstName}! 👋
                </h1>
                <p style={{ fontSize: 14, color: '#78716c', margin: '5px 0 0 0', fontWeight: 500, lineHeight: 1.5 }}>
                  Tu herramienta de ventas está lista para cerrar más restaurantes hoy.
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FF441F', margin: '6px 0 0 0' }}>
                  {readyLabel}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/negociacion')}
              style={{
                background: '#FF441F',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 30px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 4px 16px rgba(255,68,31,0.35)',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#e03a17';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FF441F';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              Comenzar →
            </button>
          </div>

          {/* ══════════════════════════════════════
              INSTRUCCIONES — LÍNEA HORIZONTAL
          ══════════════════════════════════════ */}
          <div style={{ marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 22 }}>
              Instrucciones para utilizar la App
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'unset' }}>
                    {/* Item */}
                    <div
                      className="step-row-item"
                      onClick={() => navigate(step.to)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        flexShrink: 0,
                      }}
                    >
                      {/* Círculo numerado */}
                      <div style={{
                        width: 34, height: 34,
                        borderRadius: '50%',
                        background: step.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 10px ${step.color}44`,
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{step.num}</span>
                      </div>

                      {/* Ícono + label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon size={15} color={step.color} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>
                          {step.label}
                        </span>
                      </div>
                    </div>

                    {/* Flecha conectora */}
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 20 }}>
                        <ArrowRight size={16} color="#d1d5db" strokeWidth={2} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════
              ACCESOS RÁPIDOS
          ══════════════════════════════════════ */}
          <div style={{ marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 22 }}>
              Accesos rápidos
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}>
              {SECTIONS.map(({ to, icon: Icon, label, desc, bg, color }) => (
                <button
                  key={to}
                  className="section-card"
                  onClick={() => navigate(to)}
                  style={{
                    background: '#fff',
                    border: '1px solid #f3f4f6',
                    borderRadius: 20,
                    padding: '22px 20px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    outline: 'none',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} color={color} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0 0' }}>{desc}</p>
                  </div>
                  <ChevronRight size={16} color="#d1d5db" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════
              TIPS DE VENTAS
          ══════════════════════════════════════ */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 22 }}>
              Tips de Ventas para Delivery · Venta en Frío
            </p>

            <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 20, overflow: 'hidden' }}>

              {/* Tabs canal */}
              <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', padding: '0 8px' }}>
                {TIPS_TABS.map(({ id, label, icon: TabIcon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '16px 20px',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: activeTab === id ? 700 : 500,
                      color: activeTab === id ? '#FF441F' : '#9ca3af',
                      borderBottom: activeTab === id ? '2.5px solid #FF441F' : '2.5px solid transparent',
                      marginBottom: -1,
                      transition: 'color 0.15s',
                    }}
                  >
                    <TabIcon size={15} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tabs país */}
              <div style={{ display: 'flex', gap: 8, padding: '18px 20px 10px', flexWrap: 'wrap' }}>
                {COUNTRIES.map(({ code, flag }) => (
                  <button
                    key={code}
                    onClick={() => setActiveCountry(code)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 30,
                      border: activeCountry === code ? '2px solid #FF441F' : '1.5px solid #e5e7eb',
                      background: activeCountry === code ? '#fff7ed' : '#fafafa',
                      cursor: 'pointer', fontSize: 12,
                      fontWeight: activeCountry === code ? 700 : 500,
                      color: activeCountry === code ? '#FF441F' : '#6b7280',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{flag}</span>
                    {code}
                  </button>
                ))}
              </div>

              {/* Contenido tips */}
              <div style={{ padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(TIPS_CONTENT[activeTab]?.[activeCountry] ?? []).map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '14px 16px',
                      background: '#fafafa',
                      border: '1px solid #f3f4f6',
                      borderRadius: 14,
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: '#FF441F', color: '#fff',
                      fontSize: 11, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.65 }}>{tip}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </AppLayout>
    </>
  );
}
