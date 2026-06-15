import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare, Shield, Calculator, CheckSquare, Target,
  BookOpen, Lightbulb, ChevronRight, Sparkles,
  Phone, MessageCircle, Database, ArrowRight
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = [
  { to: '/pitch',        icon: MessageSquare, label: 'Pitch',        desc: 'Libreto dinámico',        bg: '#fff7ed', color: '#f97316' },
  { to: '/objeciones',   icon: Shield,        label: 'Objeciones',   desc: '15 respuestas clave',     bg: '#faf5ff', color: '#a855f7' },
  { to: '/calculadora',  icon: Calculator,    label: 'Calculadora',  desc: 'Proyección de ganancias', bg: '#fefce8', color: '#eab308' },
  { to: '/requisitos',   icon: CheckSquare,   label: 'Requisitos',   desc: 'Checklist activación',    bg: '#fdf2f8', color: '#ec4899' },
  { to: '/negociacion',  icon: Target,        label: 'Negociación',  desc: 'Configura tu deal',       bg: '#fff7ed', color: '#FF441F' },
  { to: '/tips-ventas',  icon: Lightbulb,     label: 'Tips Ventas',  desc: 'Estrategias de cierre',   bg: '#f0fdf4', color: '#22c55e' },
];

const STEPS = [
  { num: 1, to: '/instrucciones', label: 'Revisa las instrucciones',  emoji: '📋' },
  { num: 2, to: '/negociacion',   label: 'Empieza tu negociación',    emoji: '🎯' },
  { num: 3, to: '/pitch',         label: 'Domina el pitch',           emoji: '🎤' },
  { num: 4, to: '/objeciones',    label: 'Maneja objeciones',         emoji: '🛡️' },
  { num: 5, to: '/propuesta',     label: 'Envía la propuesta',        emoji: '📨' },
  { num: 6, to: '/tips-ventas',   label: 'Aprende Tips de Ventas',    emoji: '💡' },
];

const TIPS_TABS = [
  { id: 'llamadas',  label: 'Llamadas en Frío', icon: Phone },
  { id: 'hubspot',   label: 'HubSpot CRM',      icon: Database },
  { id: 'whatsapp',  label: 'WhatsApp',          icon: MessageCircle },
];

const COUNTRIES = [
  { code: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { code: 'MX', flag: '🇲🇽', name: 'México' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CL', flag: '🇨🇱', name: 'Chile' },
  { code: 'PE', flag: '🇵🇪', name: 'Perú' },
  { code: 'EC', flag: '🇪🇨', name: 'Ecuador' },
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

  const [activeTab, setActiveTab] = useState<string>('llamadas');
  const [activeCountry, setActiveCountry] = useState<string>('CO');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .home-root, .home-root * { font-family: 'Poppins', sans-serif !important; }
        .step-card:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 12px 32px rgba(255,68,31,0.18); }
        .section-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
        .step-card, .section-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      <AppLayout title="Inicio">
        <div className="home-root" style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 60 }}>

          {/* ── Bienvenida ── */}
          <div style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
            border: '1px solid #fed7aa',
            borderRadius: 20,
            padding: '28px 32px',
            marginBottom: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: '#FF441F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(255,68,31,0.35)',
                flexShrink: 0,
              }}>
                <Sparkles size={26} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', margin: 0, lineHeight: 1.3 }}>
                  Hola, {firstName}: Tu herramienta de ventas está lista para cerrar más restaurantes hoy.
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#FF441F', margin: '6px 0 0 0' }}>
                  ¿Listo para vender? 🔥
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/negociacion')}
              style={{
                background: '#FF441F',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 4px 14px rgba(255,68,31,0.35)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e03a17'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FF441F'; }}
            >
              Comenzar →
            </button>
          </div>

          {/* ── Instrucciones horizontales ── */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              Instrucciones para utilizar la App
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
              {STEPS.map((step, i) => (
                <div key={step.num} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  {/* Tarjeta del paso */}
                  <button
                    className="step-card"
                    onClick={() => navigate(step.to)}
                    style={{
                      background: '#fff',
                      border: '1.5px solid #fed7aa',
                      borderRadius: 16,
                      padding: '18px 16px',
                      width: 148,
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: '#fff7ed',
                      border: '2px solid #FF441F',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 900, color: '#FF441F',
                    }}>
                      {step.num}
                    </div>
                    <span style={{ fontSize: 18 }}>{step.emoji}</span>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1A1A2E', margin: 0, lineHeight: 1.4 }}>
                      {step.label}
                    </p>
                  </button>

                  {/* Flecha conectora */}
                  {i < STEPS.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0 }}>
                      <ArrowRight size={22} color="#fdba74" strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Accesos rápidos ── */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              Accesos rápidos
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
              {SECTIONS.map(({ to, icon: Icon, label, desc, bg, color }) => (
                <button
                  key={to}
                  className="section-card"
                  onClick={() => navigate(to)}
                  style={{
                    background: bg,
                    border: `1.5px solid ${color}22`,
                    borderRadius: 20,
                    padding: '22px 16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 4px 12px ${color}33`,
                  }}>
                    <Icon size={22} color={color} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: '3px 0 0 0' }}>{desc}</p>
                  </div>
                  <ChevronRight size={14} color={color} style={{ marginTop: 2 }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Tips de Ventas ── */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
              Tips de Ventas para Delivery · Venta en Frío
            </p>

            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

              {/* Tabs de canal */}
              <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6', padding: '0 8px' }}>
                {TIPS_TABS.map(({ id, label, icon: TabIcon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '16px 20px',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 13, fontWeight: activeTab === id ? 700 : 500,
                      color: activeTab === id ? '#FF441F' : '#6b7280',
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

              {/* Tabs de país */}
              <div style={{ display: 'flex', gap: 8, padding: '16px 20px 8px', flexWrap: 'wrap' }}>
                {COUNTRIES.map(({ code, flag, name }) => (
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

              {/* País seleccionado */}
              <div style={{ padding: '8px 20px 20px' }}>
                {(() => {
                  const country = COUNTRIES.find(c => c.code === activeCountry)!;
                  return (
                    <div style={{
                      background: '#fff7ed', borderRadius: 14, padding: '14px 18px', marginBottom: 14,
                      display: 'flex', alignItems: 'center', gap: 10,
                      border: '1px solid #fed7aa',
                    }}>
                      <span style={{ fontSize: 28 }}>{country.flag}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#FF441F', margin: 0 }}>{country.name} · {country.code}</p>
                        <p style={{ fontSize: 11, color: '#9a3412', margin: '2px 0 0 0' }}>
                          {TIPS_TABS.find(t => t.id === activeTab)?.label}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(TIPS_CONTENT[activeTab]?.[activeCountry] ?? []).map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        background: '#fff', border: '1px solid #f3f4f6',
                        borderRadius: 12, padding: '12px 16px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      }}
                    >
                      <span style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#FF441F', color: '#fff',
                        fontSize: 11, fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 1,
                      }}>
                        {i + 1}
                      </span>
                      <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </AppLayout>
    </>
  );
}
