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
import { formatCurrency, formatNumber } from '../lib/currency';

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

  // Load countries on mount
  useEffect(() => {
    getCountries().then(data => {
      setCountries(data);
      setLoadingCountries(false);
    });
  }, []);

  // Load cities when country changes
  useEffect(() => {
    if (!negociacion.country_code) { setCities([]); return; }
    setLoadingCities(true);
    getCities(negociacion.country_code).then(data => {
      setCities(data);
      setLoadingCities(false);
    });
  }, [negociacion.country_code]);

  // Load microzones when city changes
  useEffect(() => {
    if (!negociacion.city) { setMicrozones([]); return; }
    setLoadingMicrozones(true);
    getMicrozones(negociacion.country_code, negociacion.city).then(data => {
      setMicrozones(data);
      setLoadingMicrozones(false);
    });
  }, [negociacion.city]);

  // Load tags when microzone changes
  useEffect(() => {
    if (!negociacion.microzone_id) { setTags([]); return; }
    setLoadingTags(true);
    getTags(negociacion.country_code, negociacion.city, negociacion.microzone_id).then(data => {
      setTags(data);
      setLoadingTags(false);
    });
  }, [negociacion.microzone_id]);

  // Load metrics when all 4 filters are set
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
    setNegociacion({
      ...negociacion,
      country_code: v,
      country_name: c?.country_name || '',
      city: '',
      microzone_id: '',
      tag: '',
      metrics: null,
    });
  };

  const handleCityChange = (v: string) => {
    setNegociacion({ ...negociacion, city: v, microzone_id: '', tag: '', metrics: null });
  };

  const handleMicrozoneChange = (v: string) => {
    setNegociacion({ ...negociacion, microzone_id: v, tag: '', metrics: null });
  };

  const handleTagChange = (v: string) => {
    setNegociacion({ ...negociacion, tag: v, metrics: null });
  };

  const m = negociacion.metrics;
  const cc = negociacion.country_code;
  const hasAllFilters = !!(negociacion.country_code && negociacion.city && negociacion.microzone_id && negociacion.tag);

  return (
    <AppLayout title="Negociación">
      <div className="px-4 py-5 max-w-2xl mx-auto flex flex-col gap-5">

        {/* Filtros en cascada */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">Datos del restaurante</h2>
          <div className="flex flex-col gap-4">
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
              placeholder={negociacion.country_code ? 'Selecciona una ciudad' : 'Primero selecciona un país'}
              disabled={!negociacion.country_code}
              options={cities.map(c => ({ value: c, label: c }))}
            />
            <Select
              label="Microzona"
              value={negociacion.microzone_id}
              onChange={e => handleMicrozoneChange(e.target.value)}
              loading={loadingMicrozones}
              placeholder={negociacion.city ? 'Selecciona una microzona' : 'Primero selecciona una ciudad'}
              disabled={!negociacion.city}
              options={microzones.map(m => ({ value: m, label: m }))}
            />
            <Select
              label="Categoría"
              value={negociacion.tag}
              onChange={e => handleTagChange(e.target.value)}
              loading={loadingTags}
              placeholder={negociacion.microzone_id ? 'Selecciona una categoría' : 'Primero selecciona una microzona'}
              disabled={!negociacion.microzone_id}
              options={tags.map(t => ({ value: t, label: t }))}
            />
            <Input
              label="Nombre del restaurante (opcional)"
              placeholder="Ej: Hamburguesas El Gordo"
              value={negociacion.restaurant_name}
              onChange={e => setNegociacion({ ...negociacion, restaurant_name: e.target.value })}
            />
          </div>
        </Card>

        {/* Tipo de acuerdo y servicio */}
        <Card>
          <h2 className="font-bold text-gray-900 mb-4">Tipo de acuerdo</h2>
          <div className="flex flex-col gap-4">
            <Toggle
              label="Exclusividad"
              options={[
                { value: 'exclusivo', label: 'Exclusivo' },
                { value: 'no_exclusivo', label: 'No exclusivo' },
              ]}
              value={negociacion.tipo_acuerdo}
              onChange={v => setNegociacion({ ...negociacion, tipo_acuerdo: v as 'exclusivo' | 'no_exclusivo' })}
            />
            <Toggle
              label="Tipo de servicio"
              options={[
                { value: 'full_service', label: 'Full Service' },
                { value: 'marketplace', label: 'Marketplace' },
              ]}
              value={negociacion.tipo_servicio}
              onChange={v => setNegociacion({ ...negociacion, tipo_servicio: v as 'full_service' | 'marketplace' })}
            />
          </div>
        </Card>

        {/* Mini-dashboard de métricas */}
        {hasAllFilters && (
          <div>
            <h2 className="font-bold text-gray-900 mb-3">
              {loadingMetrics ? 'Cargando métricas...' : `Métricas de ${negociacion.microzone_id} · ${negociacion.tag}`}
            </h2>
            {loadingMetrics ? (
              <div className="flex justify-center py-8">
                <span className="w-8 h-8 border-3 border-orange-200 border-t-[#FF5A00] rounded-full animate-spin block" />
              </div>
            ) : m ? (
              <div className="grid grid-cols-2 gap-3">
                <MetricCard icon="👥" label="Usuarios activos en zona" value={formatNumber(m.mz_active_users)} />
                <MetricCard icon="👑" label="Usuarios Prime" value={formatNumber(m.mz_active_users_prime)} />
                <MetricCard icon="🏪" label="Tiendas en la zona" value={formatNumber(m.mz_stores_count)} />
                <MetricCard icon="🎫" label={`Ticket promedio (${negociacion.tag})`} value={formatCurrency(m.mz_ticket_avg, cc)} highlight />
                <MetricCard icon="📦" label="Órdenes prom. por tienda" value={formatNumber(m.mz_store_orders_avg)} unit="/ mes" />
                <MetricCard icon="⏱️" label="Tiempo entrega promedio" value={m.mz_order_time_avg != null ? String(m.mz_order_time_avg) : 'Dato no disponible'} unit="min" />
                <MetricCard icon="🏙️" label={`Tiendas en ${negociacion.city} (${negociacion.tag})`} value={formatNumber(m.city_stores_count_tag)} />
                <MetricCard icon="📊" label={`Órdenes prom. ciudad (${negociacion.tag})`} value={formatNumber(m.city_orders_tag_avg)} />
              </div>
            ) : (
              <Card className="text-center py-6">
                <p className="text-gray-500">No se encontraron métricas para esta selección.</p>
              </Card>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/pitch')} size="lg" className="w-full" disabled={!hasAllFilters}>
            Continuar al Pitch →
          </Button>
          <Button variant="ghost" onClick={clearNegociacion} className="w-full text-gray-500">
            Limpiar negociación
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
