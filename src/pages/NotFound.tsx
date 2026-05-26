import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-light flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-extrabold text-dark mb-2">Página no encontrada</h1>
      <p className="text-gray-400 text-sm mb-6">La ruta que buscás no existe.</p>
      <Button onClick={() => navigate('/')}>Ir al inicio</Button>
    </div>
  );
}
