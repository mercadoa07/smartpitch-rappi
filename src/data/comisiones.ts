export const COMISIONES: Record<string, {
  fullExclusivo: number;
  fullNoExclusivo: number;
  mktExclusivo: number;
  mktNoExclusivo: number;
}> = {
  AR: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
  CL: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
  CO: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
  EC: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
  MX: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
  PE: { fullExclusivo: 23, fullNoExclusivo: 25, mktExclusivo: 15, mktNoExclusivo: 15 },
};

export function getComision(
  countryCode: string,
  tipoServicio: 'full_service' | 'marketplace',
  tipoAcuerdo: 'exclusivo' | 'no_exclusivo'
): number {
  const c = COMISIONES[countryCode];
  if (!c) return 25;
  if (tipoServicio === 'full_service') {
    return tipoAcuerdo === 'exclusivo' ? c.fullExclusivo : c.fullNoExclusivo;
  } else {
    return tipoAcuerdo === 'exclusivo' ? c.mktExclusivo : c.mktNoExclusivo;
  }
}
