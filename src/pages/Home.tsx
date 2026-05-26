import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Shield, Calculator, CheckSquare, Target, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { to: '/pitch',       icon: MessageSquare, label: 'Pitch',       desc: 'Libreto dinámico',        iconBg: 'bg-blue-50   text-blue-500'   },
  { to: '/objeciones',  icon: Shield,        label: 'Objeciones',  desc: '15 respuestas',           iconBg: 'bg-purple-50 text-purple-500' },
  { to: '/calculadora', icon: Calculator,    label: 'Calculadora', desc: 'Proyección de ganancias', iconBg: 'bg-yellow-50 text-yellow-500' },
  { to: '/requisitos',  icon: CheckSquare,   label: 'Requisitos',  desc: 'Checklist de activación', iconBg: 'bg-pink-50   text-pink-500'   },
  { to: '/propuesta',   icon: Target,        label: 'Propuesta',   desc: 'Enviar por WhatsApp',     iconBg: 'bg-orange-50 text-primary'    },
];

const STEPS = [
  { num: 1, to: '/negociacion', label: 'Configura la negociación',  desc: 'Ingresa los datos del restaurante'       },
  { num: 2, to: '/pitch',       label: 'Usa el Pitch dinámico',     desc: 'Guía tu discurso con datos reales'       },
  { num: 3, to: '/comisiones',  label: 'Consulta las comisiones',   desc: 'Ofrece el plan correcto'                 },
  { num: 4, to: '/calculadora', label: 'Muestra la calculadora',    desc: 'Proyecta las ganancias del aliado'       },
  { num: 5, to: '/propuesta',   label: 'Envía la propuesta',        desc: 'Valida requisitos y cierra por WhatsApp' },
];

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AppLayout title="Inicio">

      {/* Heading */}
      <h1 className="text-2xl font-bold text-dark mb-2">
        Hola, {user?.full_name?.split(' ')[0] || 'asesor'} 👋
      </h1>
      <p className="text-sm text-gray-500" style={{ marginBottom: 32 }}>
        Tu herramienta de ventas para cerrar más restaurantes hoy.
      </p>

      {/* CTA */}
      <div style={{ marginBottom: 64 }}>
        <div
          className="max-w-2xl rounded-2xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          style={{ background: 'linear-gradient(135deg, #FF441F 0%, #E63B1A 100%)', padding: '22px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, margin: '0 auto' }}
          onClick={() => navigate('/negociacion')}
        >
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p className="text-white/70 font-medium uppercase tracking-wider" style={{ fontSize: 13, marginBottom: 8 }}>
              ¿Lista para cerrar?
            </p>
            <h2 className="text-white font-bold" style={{ fontSize: 22, marginBottom: 16 }}>
              Inicia una negociación
            </h2>
            <Button
              variant="outline"
              className="!bg-white !text-primary !border-transparent hover:!bg-white/90 font-semibold"
              style={{ fontSize: 15, padding: '10px 24px', height: 'auto' }}
              onClick={e => { e.stopPropagation(); navigate('/negociacion'); }}
            >
              Comenzar →
            </Button>
          </div>
          <span style={{ fontSize: 80, opacity: 0.2 }} className="select-none hidden sm:block">🎯</span>
        </div>
      </div>

      {/* Secciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Accesos rápidos */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Accesos rápidos
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SECTIONS.map(({ to, icon: Icon, label, desc, iconBg }) => (
              <Card
                key={to}
                onClick={() => navigate(to)}
                className="p-6 min-h-[140px] flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBg}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Flujo recomendado */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Flujo recomendado
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {STEPS.map(({ num, to, label, desc }, i) => (
              <button
                key={num}
                onClick={() => navigate(to)}
                className={`flex items-center gap-4 w-full text-left hover:bg-gray-50 transition-colors group rounded-lg px-2 ${i < STEPS.length - 1 ? 'border-b border-gray-100' : ''}`}
                style={{ padding: '16px 8px' }}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-primary shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
