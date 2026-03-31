const CURRENCY_CONFIG: Record<string, { code: string; symbol: string; locale: string }> = {
  AR: { code: 'ARS', symbol: '$', locale: 'es-AR' },
  CL: { code: 'CLP', symbol: '$', locale: 'es-CL' },
  CO: { code: 'COP', symbol: '$', locale: 'es-CO' },
  EC: { code: 'USD', symbol: '$', locale: 'es-EC' },
  MX: { code: 'MXN', symbol: '$', locale: 'es-MX' },
  PE: { code: 'PEN', symbol: 'S/', locale: 'es-PE' },
};

export function formatCurrency(value: number | null | undefined, countryCode: string): string {
  if (value == null) return 'Dato no disponible';
  const config = CURRENCY_CONFIG[countryCode];
  if (!config) return value.toLocaleString();
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return 'Dato no disponible';
  return new Intl.NumberFormat('es-ES').format(value);
}

export function getCurrencySymbol(countryCode: string): string {
  return CURRENCY_CONFIG[countryCode]?.symbol || '$';
}
