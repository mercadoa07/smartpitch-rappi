import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { AccordionItem } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useNegociacion } from '../context/NegociacionContext';
import { formatCurrency } from '../lib/currency';
import { OBJECIONES } from '../data/objeciones';
import { Search } from 'lucide-react';

function injectObjecion(text: string, mzTicketAvg: string): string {
  return text.replace(/\{MZ_TICKET_AVG\}/g, mzTicketAvg);
}

export function Objeciones() {
  const [query, setQuery] = useState('');
  const { negociacion } = useNegociacion();
  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const ticketAvg = m?.mz_ticket_avg != null ? formatCurrency(m.mz_ticket_avg, cc) : '[Ticket promedio]';

  const filtered = OBJECIONES.filter(o =>
    query === '' || o.titulo.toLowerCase().includes(query.toLowerCase())
  );

  const regular = filtered.filter(o => !o.isRP);
  const rp = filtered.filter(o => o.isRP);

  return (
    <AppLayout title="Manejo de Objeciones">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar objeción..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-[#FF5A00] focus:border-transparent"
          />
        </div>

        {/* Objeciones regulares */}
        {regular.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Objeciones generales</h3>
            {regular.map(obj => (
              <AccordionItem
                key={obj.id}
                title={`${obj.id}. ${obj.titulo}`}
              >
                <div className="flex flex-col gap-4">
                  {/* Pitch propuesto */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pitch propuesto</p>
                    <p className="text-base text-gray-800 leading-relaxed font-medium">
                      {injectObjecion(obj.pitchPropuesto, ticketAvg)}
                    </p>
                  </div>

                  {/* Versión simplificada */}
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Versión corta</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {injectObjecion(obj.simplificado, ticketAvg)}
                    </p>
                  </div>

                  {/* Flujo */}
                  {obj.flujo && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Flujo de manejo</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {obj.flujo.split(' → ').map((step, i, arr) => (
                          <React.Fragment key={i}>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              i === 0 ? 'bg-red-100 text-red-700' :
                              i === arr.length - 1 ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{step}</span>
                            {i < arr.length - 1 && <span className="text-gray-300 text-xs">→</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>
            ))}
          </div>
        )}

        {/* Reactivación Partners */}
        {rp.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Reactivación de Partners</h3>
              <Badge variant="orange">RP</Badge>
            </div>
            {rp.map(obj => (
              <AccordionItem
                key={obj.id}
                title={`${obj.id}. ${obj.titulo}`}
                badge={<Badge variant="orange">RP</Badge>}
              >
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pitch propuesto</p>
                    <p className="text-base text-gray-800 leading-relaxed font-medium">{obj.pitchPropuesto}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Versión corta</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{obj.simplificado}</p>
                  </div>
                </div>
              </AccordionItem>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p>No se encontraron objeciones con "{query}"</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
