import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';
import type { User } from '../types';

export function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@rappi.com')) {
      setError('Solo se permiten correos @rappi.com');
      return;
    }
    if (!name.trim()) {
      setError('Ingresa tu nombre');
      return;
    }

    const user: User = {
      id: trimmedEmail,
      email: trimmedEmail,
      full_name: name.trim(),
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    setUser(user);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Zap size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">SmartPitch</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Rappi Inside Sales</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-dark mb-1">Ingresa a tu cuenta</h2>
            <p className="text-gray-400 text-sm">Usa tu correo corporativo @rappi.com</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-dark">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              className="border border-gray-200 rounded-xl py-3 px-4 text-dark text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-dark">Correo</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@rappi.com"
              className="border border-gray-200 rounded-xl py-3 px-4 text-dark text-sm outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white rounded-xl py-3 font-bold text-sm hover:bg-primary/90 transition-colors mt-1"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-xs text-[#A0A0B0] mt-6">
          Solo para el equipo de Inside Sales · Rappi
        </p>
      </div>
    </div>
  );
}
