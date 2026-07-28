import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const emptyForm = { type: 'Expense', category: '', amount: '', date: new Date().toISOString().slice(0, 10), notes: '' };

const TransactionModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(initialData ? {
        type: initialData.type,
        category: initialData.category,
        amount: initialData.amount,
        date: new Date(initialData.date).toISOString().slice(0, 10),
        notes: initialData.notes || ''
      } : emptyForm);
    }
  }, [open, initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Transaction' : 'Add Transaction'} subtitle="Record an income or expense entry.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input type="number" name="amount" min="1" step="0.01" required value={form.amount} onChange={handleChange} className={inputClass} placeholder="0.00" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input type="text" name="category" required value={form.category} onChange={handleChange} className={inputClass} placeholder="e.g. Groceries, Salary" />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input type="date" name="date" required value={form.date} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} className={inputClass} placeholder="Optional note" />
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Add Transaction'}
        </button>
      </form>
    </Modal>
  );
};

export default TransactionModal;
