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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .login-root * { font-family: 'Poppins', sans-serif; }
        .input-field {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 15px;
          color: #1A1A2E;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fafafa;
          font-family: 'Poppins', sans-serif;
        }
        .input-field:focus {
          border-color: #FF441F;
          box-shadow: 0 0 0 3px rgba(255,68,31,0.1);
          background: #fff;
        }
        .input-field::placeholder { color: #b0b0bf; }
        .btn-primary {
          width: 100%;
          background: #FF441F;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(255,68,31,0.30);
          margin-top: 4px;
        }
        .btn-primary:hover {
          background: #e03a17;
          transform: scale(1.01);
          box-shadow: 0 6px 20px rgba(255,68,31,0.38);
        }
        .btn-primary:active { transform: scale(0.99); }
      `}</style>

      <div
        className="login-root min-h-screen flex items-center justify-center px-4"
        style={{ background: '#f1f5f9' }}
      >
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Logo + nombre */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{
              width: 68, height: 68,
              background: '#FF441F',
              borderRadius: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 8px 24px rgba(255,68,31,0.35)',
            }}>
              <Zap size={32} color="white" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1A1A2E', margin: 0, letterSpacing: '-0.5px' }}>
              SmartPitch
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, fontWeight: 500 }}>
              Rappi Inside Sales
            </p>
          </div>

          {/* Tarjeta */}
          <div style={{
            background: 'white',
            borderRadius: 28,
            padding: '40px 44px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}>

            {/* Encabezado */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1A2E', margin: '0 0 6px 0' }}>
                Ingresa a tu cuenta
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                Smart Pitch: Tu herramienta de ventas para cerrar más restaurantes hoy.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                borderRadius: 10,
                padding: '12px 16px',
                fontSize: 14,
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            {/* Campo nombre */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>Nombre</label>
              <input
                className="input-field"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            {/* Campo correo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>Correo corporativo</label>
              <input
                className="input-field"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@rappi.com"
              />
            </div>

            {/* Botón */}
            <button className="btn-primary" type="button" onClick={handleSubmit as any}>
              Entrar
            </button>

          </div>

          {/* Pie */}
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 24, fontWeight: 500 }}>
            Solo para el equipo de Inside Sales · Rappi
          </p>

        </div>
      </div>
    </>
  );
}
