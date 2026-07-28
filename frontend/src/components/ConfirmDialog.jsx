import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', loading }) => {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 shrink-0 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">{message}</p>
      </div>
      <div className="flex gap-3 mt-8">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all disabled:opacity-60"
        >
          {loading ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
