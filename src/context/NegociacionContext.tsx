import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { NegociacionState } from '../types';

const DEFAULT_STATE: NegociacionState = {
  country_code: '',
  country_name: '',
  city: '',
  microzone_id: '',
  tag: '',
  restaurant_name: '',
  tipo_acuerdo: 'exclusivo',
  tipo_servicio: 'full_service',
  metrics: null,
};

interface NegociacionContextValue {
  negociacion: NegociacionState;
  setNegociacion: (n: NegociacionState) => void;
  updateNegociacion: (partial: Partial<NegociacionState>) => void;
  clearNegociacion: () => void;
  hasActiveNegociacion: boolean;
}

const NegociacionContext = createContext<NegociacionContextValue | null>(null);

export function NegociacionProvider({ children }: { children: ReactNode }) {
  const [negociacion, setNegociacionState] = useState<NegociacionState>(() => {
    const stored = localStorage.getItem('smartpitch_negociacion');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const setNegociacion = (n: NegociacionState) => {
    setNegociacionState(n);
    localStorage.setItem('smartpitch_negociacion', JSON.stringify(n));
  };

  const updateNegociacion = (partial: Partial<NegociacionState>) => {
    const next = { ...negociacion, ...partial };
    setNegociacion(next);
  };

  const clearNegociacion = () => {
    setNegociacionState(DEFAULT_STATE);
    localStorage.removeItem('smartpitch_negociacion');
  };

  const hasActiveNegociacion = !!(
    negociacion.country_code &&
    negociacion.city &&
    negociacion.microzone_id &&
    negociacion.tag
  );

  return (
    <NegociacionContext.Provider value={{
      negociacion,
      setNegociacion,
      updateNegociacion,
      clearNegociacion,
      hasActiveNegociacion,
    }}>
      {children}
    </NegociacionContext.Provider>
  );
}

export function useNegociacion() {
  const ctx = useContext(NegociacionContext);
  if (!ctx) throw new Error('useNegociacion must be used within NegociacionProvider');
  return ctx;
}
