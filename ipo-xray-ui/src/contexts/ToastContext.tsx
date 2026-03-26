import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg glass-card shadow-2xl border-l-[3px] w-[320px] backdrop-blur-3xl
                ${toast.type === 'success' ? 'border-success/60 bg-success/5 shadow-[0_10px_40px_rgba(0,227,150,0.15)]' : ''}
                ${toast.type === 'error' ? 'border-danger/60 bg-danger/5 shadow-[0_10px_40px_rgba(255,69,96,0.15)]' : ''}
                ${toast.type === 'info' ? 'border-primary/60 bg-primary/5 shadow-[0_10px_40px_rgba(0,212,255,0.15)]' : ''}
              `}
            >
              <div className="flex items-start mr-3">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />}
              </div>
              
              <div className="flex-1 pr-3">
                <p className="text-sm font-medium text-textPrimary leading-snug">{toast.message}</p>
              </div>
              
              <button onClick={() => removeToast(toast.id)} className="text-textMuted hover:text-white transition-colors self-start">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
