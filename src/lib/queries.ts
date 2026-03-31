import { supabase } from './supabase';
import type { Metrics, User } from '../types';

export async function getCountries(): Promise<{ country_code: string; country_name: string }[]> {
  const { data, error } = await supabase
    .from('smartpitch_metrics')
    .select('country_code, country_name')
    .order('country_name');
  if (error) throw error;
  const seen = new Set<string>();
  return (data || []).filter(r => {
    if (seen.has(r.country_code)) return false;
    seen.add(r.country_code);
    return true;
  });
}

export async function getCities(countryCode: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('smartpitch_metrics')
    .select('city')
    .eq('country_code', countryCode)
    .order('city');
  if (error) throw error;
  const seen = new Set<string>();
  return (data || []).filter(r => {
    if (seen.has(r.city)) return false;
    seen.add(r.city);
    return true;
  }).map(r => r.city);
}

export async function getMicrozones(countryCode: string, city: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('smartpitch_metrics')
    .select('microzone_id')
    .eq('country_code', countryCode)
    .eq('city', city)
    .order('microzone_id');
  if (error) throw error;
  const seen = new Set<string>();
  return (data || []).filter(r => {
    if (seen.has(r.microzone_id)) return false;
    seen.add(r.microzone_id);
    return true;
  }).map(r => r.microzone_id);
}

export async function getTags(countryCode: string, city: string, microzoneId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('smartpitch_metrics')
    .select('tag')
    .eq('country_code', countryCode)
    .eq('city', city)
    .eq('microzone_id', microzoneId)
    .order('tag');
  if (error) throw error;
  const seen = new Set<string>();
  return (data || []).filter(r => {
    if (seen.has(r.tag)) return false;
    seen.add(r.tag);
    return true;
  }).map(r => r.tag);
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
