import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-6">La ruta que buscás no existe.</p>
      <Button onClick={() => navigate('/')}>Ir al inicio</Button>
    </div>
  );
}
