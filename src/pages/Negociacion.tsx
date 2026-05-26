import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Toggle } from '../components/ui/Toggle';
import { Input } from '../components/ui/Input';
import { MetricCard } from '../components/ui/MetricCard';
import { useNegociacion } from '../context/NegociacionContext';
import { getCountries, getCities, getMicrozones, getTags, getMetrics } from '../lib/queries';
import { formatCurrency, formatNumber, getCurrencyLabel } from '../lib/currency';
import { COMISIONES } from '../data/comisiones';

export function Negociacion() {
  const navigate = useNavigate();
  const { negociacion, setNegociacion, clearNegociacion } = useNegociacion();

  const [countries, setCountries] = useState<{ country_code: string; country_name: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [microzones, setMicrozones] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingMicrozones, setLoadingMicrozones] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    getCountries().then(data => { setCountries(data); setLoadingCountries(false); });
  }, []);

  useEffect(() => {
    if (!negociacion.country_code) { setCities([]); return; }
    setLoadingCities(true);
    getCities(negociacion.country_code).then(data => { setCities(data); setLoadingCities(false); });
  }, [negociacion.country_code]);

  useEffect(() => {
    if (!negociacion.city) { setMicrozones([]); return; }
    setLoadingMicrozones(true);
    getMicrozones(negociacion.country_code, negociacion.city).then(data => { setMicrozones(data); setLoadingMicrozones(false); });
  }, [negociacion.city]);

  useEffect(() => {
    if (!negociacion.microzone_id) { setTags([]); return; }
    setLoadingTags(true);
    getTags(negociacion.country_code, negociacion.city, negociacion.microzone_id).then(data => { setTags(data); setLoadingTags(false); });
  }, [negociacion.microzone_id]);

  useEffect(() => {
    if (!negociacion.country_code || !negociacion.city || !negociacion.microzone_id || !negociacion.tag) return;
    setLoadingMetrics(true);
    getMetrics(negociacion.country_code, negociacion.city, negociacion.microzone_id, negociacion.tag).then(data => {
      setNegociacion({ ...negociacion, metrics: data });
      setLoadingMetrics(false);
    });
  }, [negociacion.tag]);

  const handleCountryChange = (v: string) => {
    const c = countries.find(x => x.country_code === v);
    setNegociacion({ ...negociacion, country_code: v, country_name: c?.country_name || '', city: '', microzone_id: '', tag: '', metrics: null });
  };
  const handleCityChange = (v: string) => setNegociacion({ ...negociacion, city: v, microzone_id: '', tag: '', metrics: null });
  const handleMicrozoneChange = (v: string) => setNegociacion({ ...negociacion, microzone_id: v, tag: '', metrics: null });
  const handleTagChange = (v: string) => setNegociacion({ ...negociacion, tag: v, metrics: null });

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const hasAllFilters = !!(negociacion.country_code && negociacion.city && negociacion.microzone_id && negociacion.tag);

  return (
    <AppLayout title="Negociación">
      <div className="space-y-6">

        {/* Filtros */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>Datos del restaurante</h2>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <Card className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7" style={{ padding: '70px 32px' }}>
            <Select
              label="País"
              value={negociacion.country_code}
              onChange={e => handleCountryChange(e.target.value)}
              loading={loadingCountries}
              placeholder="Selecciona un país"
              options={countries.map(c => ({ value: c.country_code, label: c.country_name }))}
            />
            <Select
              label="Ciudad"
              value={negociacion.city}
              onChange={e => handleCityChange(e.target.value)}
              loading={loadingCities}
              placeholder={negociacion.country_code ? 'Selecciona ciudad' : 'Primero selecciona país'}
              disabled={!negociacion.country_code}
              options={cities.map(c => ({ value: c, label: c }))}
            />
            <Select
              label="Microzona"
              value={negociacion.microzone_id}
              onChange={e => handleMicrozoneChange(e.target.value)}
              loading={loadingMicrozones}
              placeholder={negociacion.city ? 'Selecciona microzona' : 'Primero selecciona ciudad'}
              disabled={!negociacion.city}
              options={microzones.map(m => ({ value: m, label: m }))}
            />
            <Select
              label="Categoría"
              value={negociacion.tag}
              onChange={e => handleTagChange(e.target.value)}
              loading={loadingTags}
              placeholder={negociacion.microzone_id ? 'Selecciona categoría' : 'Primero selecciona microzona'}
              disabled={!negociacion.microzone_id}
              options={tags.map(t => ({ value: t, label: t }))}
            />
            <div className="sm:col-span-2">
              <Input
                label="Nombre del restaurante (opcional)"
                placeholder="Ej: Hamburguesas El Gordo"
                value={negociacion.restaurant_name}
                onChange={e => setNegociacion({ ...negociacion, restaurant_name: e.target.value })}
              />
            </div>
          </div>
        </Card>
        </div>
        </div>


        {/* Comisiones */}
        {negociacion.country_code && COMISIONES[negociacion.country_code] && (() => {
          const c = COMISIONES[negociacion.country_code];
          return (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>Comisiones disponibles</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 520, margin: '0 auto' }}>
                {[
                  { label: 'Full Service · Exclusivo', value: c.fullExclusivo, tag: 'Recomendado' },
                  { label: 'Full Service · No exclusivo', value: c.fullNoExclusivo },
                  { label: 'Marketplace · Exclusivo', value: c.mktExclusivo },
                  { label: 'Marketplace · No exclusivo', value: c.mktNoExclusivo },
                ].map(({ label, value, tag }) => (
                  <div key={label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '20px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{label}</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: '#FF441F', lineHeight: 1 }}>{value}%</p>
                    {tag && <p style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 6 }}>✓ {tag}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Métricas */}
        {hasAllFilters && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              {loadingMetrics ? 'Cargando métricas...' : `Métricas · ${negociacion.microzone_id}`}
            </p>
            {loadingMetrics ? (
              <div className="flex justify-center py-12">
                <span className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin block" />
              </div>
            ) : m ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <MetricCard icon="👥" label="Usuarios activos" value={formatNumber(m.mz_active_users)} />
                <MetricCard icon="👑" label="Usuarios Prime" value={formatNumber(m.mz_active_users_prime)} />
                <MetricCard icon="🏪" label="Tiendas en zona" value={formatNumber(m.mz_stores_count)} />
                <MetricCard icon="🎫" label={`Ticket (${negociacion.tag})`} value={formatCurrency(m.mz_ticket_avg, cc)} highlight currencyLabel={getCurrencyLabel(cc)} />
                <MetricCard icon="📦" label="Órdenes / tienda" value={formatNumber(m.mz_store_orders_avg)} unit="/mes" />
                <MetricCard icon="⏱️" label="Tiempo entrega" value={m.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'Dato no disponible'} unit="min" />
                <MetricCard icon="🏙️" label={`Tiendas en ${negociacion.city}`} value={formatNumber(m.city_stores_count_tag)} />
                <MetricCard icon="📊" label="Órdenes prom. ciudad" value={formatNumber(m.city_orders_tag_avg)} />
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-400 text-sm">No se encontraron métricas para esta selección.</p>
              </Card>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3" style={{ marginTop: 48 }}>
          <Button onClick={() => navigate('/pitch')} size="lg" className="w-full" disabled={!hasAllFilters}>
            Continuar al Pitch →
          </Button>
          <Button variant="ghost" onClick={clearNegociacion} className="w-full text-gray-400 text-sm">
            Limpiar negociación
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}
