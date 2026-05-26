import type { Metrics } from '../types';

interface RawRow {
  COUNTRY: string;
  CITY: string;
  STORE_MICROZONE_ID: string;
  TAG: string;
  MZ_ACTIVE_USER_PRIME: string;
  MZ_ACTIVE_USER: string;
  MZ_STORES_COUNT: string;
  MZ_ORDERS: string;
  MZ_TICKET_AVG: string;
  MZ_ORDER_TIME_AVG: string;
  MZ_STORE_ORDERS_AVG: string;
  MZ_SUM_TOTAL_VALUE_TAG: string;
  CITY_STORES_COUNT_TAG: string;
  CITY_ORDERS_TAG_AVG: string;
  CITY_TICKET_TAG_AVG: string;
  CITY_ORDERS_TAG_COUNT: string;
  CITY_ACTIVE_USER: string;
  CITY_ACTIVE_USER_PRIME: string;
  CITY_STORES_COUNT: string;
  CITY_SUM_TOTAL_VALUE_TAG: string;
  COUNTRY_NAME: string;
}

let cache: RawRow[] | null = null;

async function loadData(): Promise<RawRow[]> {
  if (cache) return cache;
  const res = await fetch('/data/metrics.csv');
  const text = await res.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  cache = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] ?? '').trim(); });
    return obj as unknown as RawRow;
  });
  return cache;
}

function n(val: string): number | null {
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function toMetrics(row: RawRow, id: number): Metrics {
  return {
    id,
    country_code: row.COUNTRY,
    country_name: row.COUNTRY_NAME,
    city: row.CITY,
    microzone_id: row.STORE_MICROZONE_ID,
    tag: row.TAG,
    mz_active_users: n(row.MZ_ACTIVE_USER),
    mz_active_users_prime: n(row.MZ_ACTIVE_USER_PRIME),
    mz_stores_count: n(row.MZ_STORES_COUNT),
    mz_orders: n(row.MZ_ORDERS),
    mz_ticket_avg: n(row.MZ_TICKET_AVG),
    mz_order_time_avg: n(row.MZ_ORDER_TIME_AVG),
    mz_store_orders_avg: n(row.MZ_STORE_ORDERS_AVG),
    mz_total_value_tag: n(row.MZ_SUM_TOTAL_VALUE_TAG),
    city_stores_count_tag: n(row.CITY_STORES_COUNT_TAG),
    city_orders_tag_avg: n(row.CITY_ORDERS_TAG_AVG),
    city_ticket_tag_avg: n(row.CITY_TICKET_TAG_AVG),
    city_orders_tag_count: n(row.CITY_ORDERS_TAG_COUNT),
    city_active_users: n(row.CITY_ACTIVE_USER),
    city_active_users_prime: n(row.CITY_ACTIVE_USER_PRIME),
    city_stores_count: n(row.CITY_STORES_COUNT),
    city_total_value_tag: n(row.CITY_SUM_TOTAL_VALUE_TAG),
    created_at: '',
  };
}

export async function getCountries(): Promise<{ country_code: string; country_name: string }[]> {
  const data = await loadData();
  const seen = new Map<string, string>();
  for (const row of data) {
    if (!seen.has(row.COUNTRY)) seen.set(row.COUNTRY, row.COUNTRY_NAME);
  }
  return Array.from(seen.entries()).map(([country_code, country_name]) => ({ country_code, country_name }));
}

export async function getCities(countryCode: string): Promise<string[]> {
  const data = await loadData();
  const seen = new Set<string>();
  for (const row of data) {
    if (row.COUNTRY === countryCode) seen.add(row.CITY);
  }
  return Array.from(seen);
}

export async function getMicrozones(countryCode: string, city: string): Promise<string[]> {
  const data = await loadData();
  const seen = new Set<string>();
  for (const row of data) {
    if (row.COUNTRY === countryCode && row.CITY === city) seen.add(row.STORE_MICROZONE_ID);
  }
  return Array.from(seen);
}

export async function getTags(countryCode: string, city: string, microzoneId: string): Promise<string[]> {
  const data = await loadData();
  const seen = new Set<string>();
  for (const row of data) {
    if (row.COUNTRY === countryCode && row.CITY === city && row.STORE_MICROZONE_ID === microzoneId) {
      seen.add(row.TAG);
    }
  }
  return Array.from(seen);
}

export async function getMetrics(
  countryCode: string, city: string, microzoneId: string, tag: string
): Promise<Metrics | null> {
  const data = await loadData();
  const idx = data.findIndex(
    row => row.COUNTRY === countryCode && row.CITY === city &&
      row.STORE_MICROZONE_ID === microzoneId && row.TAG === tag
  );
  if (idx === -1) return null;
  return toMetrics(data[idx], idx);
}
