import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserByEmail, createUser, updateLastLogin } from '../lib/queries';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Zap } from 'lucide-react';

export function Login() {
  const { setUser } = useAuth();
  const [step, setStep] = useState<'email' | 'name'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.endsWith('@rappi.com')) {
      setError('Solo se permiten correos @rappi.com');
      return;
    }
    setLoading(true);
    try {
      const user = await getUserByEmail(email);
      if (user) {
        await updateLastLogin(email);
        setUser({ ...user, last_login: new Date().toISOString() });
      } else {
        setStep('name');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Ingresa tu nombre completo');
      return;
    }
    setLoading(true);
    try {
      const user = await createUser(email, name.trim());
      setUser(user);
    } catch (err) {
      setError('Error al crear usuario. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#FF5A00] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SmartPitch</h1>
          <p className="text-gray-500 mt-1">Herramienta de ventas Rappi</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Ingresa a tu cuenta</h2>
                <p className="text-gray-500 text-sm">Usa tu correo corporativo @rappi.com</p>
              </div>
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu.nombre@rappi.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                required
                error={error}
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Continuar
              </Button>
            </form>
          ) : (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">¡Bienvenido!</h2>
                <p className="text-gray-500 text-sm">
                  Primera vez con <strong>{email}</strong>. ¿Cómo te llamás?
                </p>
              </div>
              <Input
                label="Nombre completo"
                type="text"
                placeholder="Ej: María González"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                required
                error={error}
              />
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setStep('email')} className="flex-1">
                  Atrás
                </Button>
                <Button type="submit" loading={loading} className="flex-1">
                  Entrar
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Solo para el equipo de Inside Sales · Rappi
        </p>
      </div>
    </div>
  );
}
