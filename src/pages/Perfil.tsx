import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { updateUserName } from '../lib/queries';
import { useToast } from '../components/ui/Toast';

export function Perfil() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.full_name || '');
  const [loading, setLoading] = useState(false);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleSave = async () => {
    if (!name.trim() || !user) return;
    setLoading(true);
    try {
      await updateUserName(user.email, name.trim());
      setUser({ ...user, full_name: name.trim() });
      showToast('Perfil actualizado');
    } catch {
      showToast('Error al actualizar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-CO', { dateStyle: 'long' })
    : '';

  return (
    <AppLayout title="Perfil" showBack>
      <div className="px-4 py-5 max-w-md mx-auto flex flex-col gap-5">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-20 h-20 bg-[#FF5A00] text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900 text-lg">{user?.full_name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {createdDate && <p className="text-gray-400 text-xs mt-1">Desde {createdDate}</p>}
          </div>
        </div>

        {/* Editar nombre */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Editar perfil</h3>
          <div className="flex flex-col gap-4">
            <Input
              label="Nombre completo"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
            <Input
              label="Correo electrónico"
              value={user?.email || ''}
              disabled
              className="bg-gray-50 text-gray-400"
            />
            <Button onClick={handleSave} loading={loading} className="w-full">
              Guardar cambios
            </Button>
          </div>
        </Card>

        {/* Cerrar sesión */}
        <Button variant="danger" onClick={handleLogout} className="w-full">
          Cerrar sesión
        </Button>
      </div>
    </AppLayout>
  );
}
