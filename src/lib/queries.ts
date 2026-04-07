import { supabase } from './supabase';
import type { Metrics, User } from '../types';

export async function getCountries(): Promise<{ country_code: string; country_name: string }[]> {
  const { data, error } = await supabase.rpc('get_distinct_countries');
  if (error) throw error;
  return data || [];
}

export async function getCities(countryCode: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_distinct_cities', { p_country: countryCode });
  if (error) throw error;
  return (data || []).map((r: { city: string }) => r.city);
}

export async function getMicrozones(countryCode: string, city: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_distinct_microzones', { p_country: countryCode, p_city: city });
  if (error) throw error;
  return (data || []).map((r: { microzone_id: string }) => r.microzone_id);
}

export async function getTags(countryCode: string, city: string, microzoneId: string): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_distinct_tags', { p_country: countryCode, p_city: city, p_microzone: microzoneId });
  if (error) throw error;
  return (data || []).map((r: { tag: string }) => r.tag);
}

export async function getMetrics(
  countryCode: string, city: string, microzoneId: string, tag: string
): Promise<Metrics | null> {
  const { data, error } = await supabase
    .from('smartpitch_metrics')
    .select('*')
    .eq('country_code', countryCode)
    .eq('city', city)
    .eq('microzone_id', microzoneId)
    .eq('tag', tag)
    .limit(1)
    .single();
  if (error) return null;
  return data as Metrics;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('smartpitch_users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) return null;
  return data as User;
}

export async function createUser(email: string, full_name: string): Promise<User> {
  const { data, error } = await supabase
    .from('smartpitch_users')
    .insert({ email, full_name })
    .select()
    .single();
  if (error) throw error;
  return data as User;
}

export async function updateUserName(email: string, full_name: string): Promise<void> {
  const { error } = await supabase
    .from('smartpitch_users')
    .update({ full_name, last_login: new Date().toISOString() })
    .eq('email', email);
  if (error) throw error;
}

export async function updateLastLogin(email: string): Promise<void> {
  const { error } = await supabase
    .from('smartpitch_users')
    .update({ last_login: new Date().toISOString() })
    .eq('email', email);
  if (error) throw error;
}

export async function upsertUser(email: string, googleName: string): Promise<User> {
  const existing = await getUserByEmail(email);
  if (existing) {
    await updateLastLogin(email);
    return { ...existing, last_login: new Date().toISOString() };
  }
  return createUser(email, googleName);
}
