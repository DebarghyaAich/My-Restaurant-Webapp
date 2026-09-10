import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900/95 text-white rounded-2xl shadow-2xl backdrop-blur-md border border-slate-700/60 animate-bounce transition-all">
      {toast.type === 'info' ? (
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <span className="text-sm font-medium tracking-wide">{toast.message}</span>
    </div>
  );
};

export default Toast;
