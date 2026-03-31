import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++counter;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const remove = (id: number) => setToasts(t => t.filter(x => x.id !== id));

  const icons = {
    success: <CheckCircle size={18} className="text-emerald-600" />,
    error: <XCircle size={18} className="text-red-500" />,
    info: <Info size={18} className="text-blue-500" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none md:bottom-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 min-w-[240px] max-w-[320px] animate-fade-in"
          >
            {icons[toast.type]}
            <span className="text-sm text-gray-800 flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
