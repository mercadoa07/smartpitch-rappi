import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { REQUISITOS } from '../data/requisitos';
import { Info } from 'lucide-react';

const STORAGE_KEY = 'smartpitch_requisitos';

function getInitialChecked(): Record<string, boolean> {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return {};
}

const CATEGORIES = ['Documentos', 'Menú', 'Imágenes de marca', 'Operación'];

const TIMELINE = [
  { day: 'Día 1', label: 'Firma' },
  { day: 'Días 1-3', label: 'Carga de contenido' },
  { day: 'Días 3-5', label: 'Revisión Rappi' },
  { day: 'Días 7-10', label: '¡Restaurante activo!' },
];

export function Requisitos() {
  const [checked, setChecked] = useState<Record<string, boolean>>(getInitialChecked);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const totalDone = REQUISITOS.filter(r => checked[r.id]).length;

  return (
    <AppLayout title="Requisitos">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Progreso */}
        <Card>
          <ProgressBar
            value={totalDone}
            max={REQUISITOS.length}
            label={`Progreso de activación`}
          />
          {totalDone === REQUISITOS.length && (
            <p className="text-center text-emerald-600 font-semibold text-sm mt-3">
              ✅ ¡Todo listo para activar!
            </p>
          )}
        </Card>

        {/* Categorías */}
        {CATEGORIES.map(cat => {
          const items = REQUISITOS.filter(r => r.categoria === cat);
          const catDone = items.filter(r => checked[r.id]).length;
          return (
            <Card key={cat}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{cat}</h3>
                <span className="text-sm text-gray-400 font-medium">{catDone}/{items.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map(req => (
                  <div key={req.id} className="flex items-start gap-3 py-1">
                    <button
                      type="button"
                      onClick={() => toggle(req.id)}
                      className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-all ${
                        checked[req.id]
                          ? 'bg-[#FF5A00] border-[#FF5A00]'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      {checked[req.id] && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight ${checked[req.id] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {req.texto}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTooltip(tooltip === req.id ? null : req.id)}
                      className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                    >
                      <Info size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {/* Tooltip detalle */}
        {tooltip && (() => {
          const req = REQUISITOS.find(r => r.id === tooltip);
          return req ? (
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-blue-900 text-sm mb-1">{req.texto}</p>
                  <p className="text-blue-700 text-sm">{req.detalle}</p>
                </div>
                <button onClick={() => setTooltip(null)} className="text-blue-400 ml-3">✕</button>
              </div>
            </Card>
          ) : null;
        })()}

        {/* Timeline */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Timeline de activación</h3>
          <div className="flex flex-col gap-0">
            {TIMELINE.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#FF5A00] mt-1 flex-shrink-0" />
                  {i < TIMELINE.length - 1 && <div className="w-0.5 h-10 bg-orange-200 mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs text-gray-400 font-medium">{step.day}</p>
                  <p className="font-semibold text-gray-900 text-sm">{step.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button variant="secondary" onClick={() => setChecked({})} className="w-full">
          Resetear checklist
        </Button>
      </div>
    </AppLayout>
  );
}
