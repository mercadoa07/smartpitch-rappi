export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_login: string;
}

export interface Metrics {
  id: number;
  country_code: string;
  country_name: string;
  city: string;
  microzone_id: string;
  tag: string;
  mz_active_users: number | null;
  mz_active_users_prime: number | null;
  mz_stores_count: number | null;
  mz_orders: number | null;
  mz_ticket_avg: number | null;
  mz_order_time_avg: number | null;
  mz_store_orders_avg: number | null;
  mz_total_value_tag: number | null;
  city_stores_count_tag: number | null;
  city_orders_tag_avg: number | null;
  city_orders_tag_count: number | null;
  city_ticket_tag_avg: number | null;
  city_active_users: number | null;
  city_active_users_prime: number | null;
  city_stores_count: number | null;
  city_total_value_tag: number | null;
  created_at: string;
}

export interface NegociacionState {
  country_code: string;
  country_name: string;
  city: string;
  microzone_id: string;
  tag: string;
  restaurant_name: string;
  tipo_acuerdo: 'exclusivo' | 'no_exclusivo';
  tipo_servicio: 'full_service' | 'marketplace';
  metrics: Metrics | null;
}

export interface Objecion {
  id: number;
  titulo: string;
  pitchPropuesto: string;
  simplificado: string;
  flujo: string | null;
  isRP?: boolean;
}
