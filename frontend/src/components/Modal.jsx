import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ open, onClose, title, subtitle, children, maxWidth = 'max-w-lg' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mt-1 -mr-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
