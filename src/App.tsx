import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NegociacionProvider } from './context/NegociacionContext';
import { ToastProvider } from './components/ui/Toast';

import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Pitch } from './pages/Pitch';
import { Objeciones } from './pages/Objeciones';
import { Comisiones } from './pages/Comisiones';
import { Calculadora } from './pages/Calculadora';
import { Requisitos } from './pages/Requisitos';
import { Propuesta } from './pages/Propuesta';
import { Negociacion } from './pages/Negociacion';
import { Perfil } from './pages/Perfil';
import { NotFound } from './pages/NotFound';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-orange-200 border-t-[#FF5A00] rounded-full animate-spin block" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/pitch" element={<ProtectedRoute><Pitch /></ProtectedRoute>} />
      <Route path="/objeciones" element={<ProtectedRoute><Objeciones /></ProtectedRoute>} />
      <Route path="/comisiones" element={<ProtectedRoute><Comisiones /></ProtectedRoute>} />
      <Route path="/calculadora" element={<ProtectedRoute><Calculadora /></ProtectedRoute>} />
      <Route path="/requisitos" element={<ProtectedRoute><Requisitos /></ProtectedRoute>} />
      <Route path="/propuesta" element={<ProtectedRoute><Propuesta /></ProtectedRoute>} />
      <Route path="/negociacion" element={<ProtectedRoute><Negociacion /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NegociacionProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </NegociacionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
