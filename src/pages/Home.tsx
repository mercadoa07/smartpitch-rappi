import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, Shield, BarChart2, Calculator, CheckSquare, Target, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { to: '/pitch', icon: MessageSquare, label: 'Pitch', desc: 'Libreto dinámico', color: 'bg-blue-50 text-blue-600' },
  { to: '/objeciones', icon: Shield, label: 'Objeciones', desc: '15 respuestas', color: 'bg-purple-50 text-purple-600' },
  { to: '/comisiones', icon: BarChart2, label: 'Comisiones', desc: 'Tablas por país', color: 'bg-green-50 text-green-600' },
  { to: '/calculadora', icon: Calculator, label: 'Calculadora', desc: 'Proyección de ganancias', color: 'bg-yellow-50 text-yellow-600' },
  { to: '/requisitos', icon: CheckSquare, label: 'Requisitos', desc: 'Checklist de activación', color: 'bg-pink-50 text-pink-600' },
  { to: '/propuesta', icon: Target, label: 'Propuesta', desc: 'Enviar por WhatsApp', color: 'bg-orange-50 text-orange-600' },
];

const STEPS = [
  { num: 1, to: '/negociacion', label: 'Configura la negociación', desc: 'Ingresa los datos del restaurante' },
  { num: 2, to: '/pitch', label: 'Usa el Pitch dinámico', desc: 'Guía tu discurso con datos reales' },
  { num: 3, to: '/comisiones', label: 'Consulta las comisiones', desc: 'Ofrece el plan correcto' },
  { num: 4, to: '/calculadora', label: 'Muestra la calculadora', desc: 'Proyecta las ganancias del aliado' },
  { num: 5, to: '/propuesta', label: 'Envía la propuesta', desc: 'Valida requisitos y cierra por WhatsApp' },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-6">
        {/* CTA Principal */}
        <Card className="bg-gradient-to-br from-[#FF5A00] to-[#e54f00] text-white border-0 !p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">¿Lista para cerrar?</p>
              <h2 className="text-xl font-bold mb-3">Inicia una negociación</h2>
              <Button
                onClick={() => navigate('/negociacion')}
                variant="secondary"
                size="sm"
                className="!bg-white !text-[#FF5A00] border-0"
              >
                Comenzar →
              </Button>
            </div>
            <div className="text-5xl opacity-20">🎯</div>
          </div>
        </Card>

        {/* Accesos rápidos */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Accesos rápidos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SECTIONS.map(({ to, icon: Icon, label, desc, color }) => (
              <Card key={to} onClick={() => navigate(to)} className="!p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Flujo recomendado */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Flujo recomendado</h3>
          <div className="flex flex-col gap-2">
            {STEPS.map(({ num, to, label, desc }) => (
              <button
                key={num}
                onClick={() => navigate(to)}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-4 py-3.5 hover:border-orange-200 hover:bg-orange-50/30 transition-all text-left group"
              >
                <div className="w-8 h-8 bg-[#FF5A00] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
