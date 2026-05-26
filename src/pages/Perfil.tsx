import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

export function Perfil() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.full_name || '');

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleSave = () => {
    if (!name.trim() || !user) return;
    setUser({ ...user, full_name: name.trim() });
    toast.success('Perfil actualizado');
  };

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-CO', { dateStyle: 'long' })
    : '';

  return (
    <AppLayout title="Perfil">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Avatar */}
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-20 h-20 bg-primary/15 text-primary rounded-full flex items-center justify-center font-bold select-none" style={{ fontSize: 28 }}>
            {initials}
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-dark">{user?.full_name}</p>
            <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            {createdDate && <p className="text-xs text-gray-400 mt-1">Miembro desde {createdDate}</p>}
          </div>
        </div>

        {/* Editar */}
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-5">Editar perfil</p>
          <div className="space-y-4">
            <Input label="Nombre completo" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" />
            <Input label="Correo electrónico" value={user?.email || ''} disabled />
            <Button onClick={handleSave} className="w-full">Guardar cambios</Button>
          </div>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full gap-2 !text-danger !border-danger/30 hover:!bg-danger/5"
        >
          <LogOut size={16} /> Cerrar sesión
        </Button>

      </div>
    </AppLayout>
  );
}
