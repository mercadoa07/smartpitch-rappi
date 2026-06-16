import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare, ShieldAlert, Calculator, Target,
  Lightbulb, ChevronRight, Sparkles, FileText,
  Phone, MessageCircle, Database, ArrowRight,
  ClipboardList
} from 'lucide-react';

/* ─────────────────────────────────────────────
    DATA
───────────────────────────────────────────── */
const SECTIONS = [
  { to: '/negociacion', icon: Target,        label: 'Negociación', desc: 'Configura tu deal',        bg: '#fff7ed', color: '#FF441F' },
  { to: '/pitch',       icon: MessageSquare, label: 'Pitch',       desc: 'Libreto dinámico',        bg: '#fff7ed', color: '#f97316' },
  { to: '/objeciones',  icon: ShieldAlert,    label: 'Objeciones',  desc: '15 respuestas clave',     bg: '#faf5ff', color: '#a855f7' },
  { to: '/propuesta',   icon: FileText,       label: 'Propuesta',   desc: 'Vista previa y envío',    bg: '#f0fdfa', color: '#0d9488' },
  { to: '/calculadora', icon: Calculator,     label: 'Calculadora', desc: 'Proyección de ganancias', bg: '#fefce8', color: '#eab308' },
  { to: '/requisitos',  icon: ClipboardList,  label: 'Requisitos',  desc: 'Checklist activación',    bg: '#fdf2f8', color: '#ec4899' },
];

const STEPS = [
  { num: 1, to: '/negociacion', label: 'Empieza tu negociación',      icon: Target,        color: '#FF441F' },
  { num: 2, to: '/pitch',       label: 'Domina tu pitch',             icon: MessageSquare, color: '#f97316' },
  { num: 3, to: '/objeciones',  label: 'Maneja objeciones',            icon: ShieldAlert,   color: '#a855f7' },
  { num: 4, to: '/propuesta',   label: 'Envía la propuesta',          icon: FileText,      color: '#0d9488' },
  { num: 5, to: '/calculadora', label: 'Utiliza la calculadora',       icon: Calculator,    color: '#eab308' },
  { num: 6, to: '/requisitos',  label: 'Ten presente los requisitos', icon: ClipboardList, color: '#ec4899' },
];

const TIPS_TABS = [
  { id: 'llamadas', label: 'Llamadas en Frío', icon: Phone },
  { id: 'hubspot',  label: 'HubSpot CRM',      icon: Database },
  { id: 'whatsapp', label: 'WhatsApp',           icon: MessageCircle },
];

const COUNTRIES = [
  { code: 'CO', flag: '🇨🇴' },
  { code: 'MX', flag: '🇲🇽' },
  { code: 'AR', flag: '🇦🇷' },
  { code: 'CL', flag: '🇨🇱' },
  { code: 'PE', flag: '🇵🇪' },
  { code: 'EC', flag: '🇪🇨' },
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
    COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName  = user?.full_name?.split(' ')[0] || 'asesor';
  const isFemale   = user?.email?.includes('a.') || user?.email?.endsWith('a@rappi.com');
  const readyLabel = isFemale ? '¿Lista para vender? 🔥' : '¿Listo para vender? 🔥';

  const [activeTab, setActiveTab] = useState('llamadas');
  const [activeCountry, setActiveCountry] = useState('CO');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .home-root, .home-root * { font-family: 'Poppins', sans-serif !important; }
        .section-card { transition: transform 0.25s ease, box-shadow 0.25s ease; box-shadow: none; }
        .section-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.06); }
        .step-box-item { transition: all 0.2s ease; border-radius: 16px; border: 1px solid #f1f5f9; background: #fff; }
        .step-box-item:hover { background: rgba(255,68,31,0.02); border-color: rgba(255,68,31,0.15); transform: translateY(-2px); }
        .tip-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .tip-card:hover { box-shadow: 0 6px 20px rgba(255,100,30,0.08); transform: translateY(-1px); }
        .country-tab { transition: all 0.15s ease; }
      `}</style>

      <AppLayout title="Inicio">
        <div className="home-root" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 72 }}>

          {/* HERO / SALUDO */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 24, marginBottom: 44, padding: '32px 36px',
            background: 'linear-gradient(130deg, #fff7ed 0%, #ffedd5 100%)',
            borderRadius: 24, border: '1px solid #fed7aa',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18, background: '#FF441F',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(255,68,31,0.30)', flexShrink: 0,
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

            <button
              onClick={() => navigate('/negociacion')}
              style={{
                background: '#FF441F', color: '#fff', border: 'none', borderRadius: 14,
                padding: '14px 30px', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(255,68,31,0.35)',
                transition: 'background 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#e03a17';
                (e.currentTarget as HTMLButtonElement).style.transform  = 'scale(1.02)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#FF441F';
                (e.currentTarget as HTMLButtonElement).style.transform  = 'scale(1)';
              }}
            >
              Comenzar →
            </button>
          </div>

          {/* INSTRUCCIONES — REESTRUCTURACIÓN MATEMÁTICA SIMÉTRICA 3X3 */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 18 }}>
              Instrucciones para utilizar la App
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}>
              {STEPS.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="step-box-item"
                    onClick={() => navigate(step.to)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '18px 20px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Círculo numerado perfectamente centrado */}
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: step.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: `0 4px 10px ${step.color}33`,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{step.num}</span>
                    </div>

                    {/* Texto + Icono alineado y de mayor tamaño */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <StepIcon size={16} color={step.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      <span style={{ 
                        fontSize: '14.5px', 
                        fontWeight: 700, 
                        color: '#0f172a', 
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACCESOS RÁPIDOS ORDENADOS POR EMBUDO */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 22 }}>
              Accesos rápidos
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {SECTIONS.map(({ to, icon: Icon, label, desc, bg, color }) => (
                <button
                  key={to}
                  className="section-card"
                  onClick={() => navigate(to)}
                  style={{
                    background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20,
                    padding: '22px 20px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 16, outline: 'none',
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, background: bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={22} color={color} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0 0', fontWeight: 500 }}>{desc}</p>
                  </div>
                  <ChevronRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* TIPS DE VENTAS CON BANDERAS CORREGIDAS */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 22 }}>
              Tips de Ventas para Delivery · Venta en Frío
            </p>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>

              {/* Tabs canal */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 8px' }}>
                {TIPS_TABS.map(({ id, label, icon: TabIcon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '16px 20px',
                      border: 'none', background: 'none', cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: activeTab === id ? 700 : 500,
                      color: activeTab === id ? '#FF441F' : '#94a3b8',
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

              {/* Tabs país — ¡Banderas 100% Corregidas! */}
              <div style={{
                display: 'flex', flexDirection: 'row', gap: 8,
                padding: '16px 20px 12px',
                flexWrap: 'nowrap', overflowX: 'auto',
              }}>
                {COUNTRIES.map(({ code, flag }) => {
                  const isActive = activeCountry === code;
                  return (
                    <button
                      key={code}
                      className="country-tab"
                      onClick={() => setActiveCountry(code)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 30,
                        border: isActive ? '2px solid #FF5630' : '1.5px solid #cbd5e1',
                        background: isActive ? '#fff7ed' : '#ffffff',
                        cursor: 'pointer', fontSize: 13,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#FF5630' : '#475569',
                        whiteSpace: 'nowrap', flexShrink: 0,
                        boxShadow: isActive ? '0 2px 8px rgba(255,86,48,0.12)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: 16, display: 'inline-block', lineHeight: 1 }}>{flag}</span>
                      <span>{code}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tarjetas de tips */}
              <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(TIPS_CONTENT[activeTab]?.[activeCountry] ?? []).map((tip, i) => (
                  <div
                    key={i}
                    className="tip-card"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '14px 16px',
                      background: 'rgba(255, 111, 72, 0.03)',
                      border: '1px solid rgba(255, 111, 72, 0.15)',
                      borderRadius: 14,
                    }}
                  >
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%',
                      background: '#FF5630', color: '#fff',
                      fontSize: 11, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {i + 1}
                    </span>
                    <p style={{ fontSize: 13.5, color: '#92400e', margin: 0, lineHeight: 1.65, fontWeight: 500 }}>{tip}</p>
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
