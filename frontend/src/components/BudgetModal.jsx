import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const emptyForm = { category: '', monthlyLimit: '', alertThresholdPercent: 80 };

const BudgetModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(initialData ? {
        category: initialData.category,
        monthlyLimit: initialData.monthlyLimit,
        alertThresholdPercent: initialData.alertThresholdPercent
      } : emptyForm);
    }
  }, [open, initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        ...form,
        monthlyLimit: Number(form.monthlyLimit),
        alertThresholdPercent: Number(form.alertThresholdPercent)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save budget');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Budget' : 'New Budget'} subtitle="Set a monthly spending cap for a category.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div>
          <label className={labelClass}>Category</label>
          <input type="text" name="category" required disabled={!!initialData} value={form.category} onChange={handleChange} className={`${inputClass} disabled:opacity-60`} placeholder="e.g. Groceries" />
        </div>

        <div>
          <label className={labelClass}>Monthly Limit (₹)</label>
          <input type="number" name="monthlyLimit" min="1" required value={form.monthlyLimit} onChange={handleChange} className={inputClass} placeholder="8000" />
        </div>

        <div>
          <label className={labelClass}>Alert Threshold (%)</label>
          <input type="number" name="alertThresholdPercent" min="1" max="100" required value={form.alertThresholdPercent} onChange={handleChange} className={inputClass} />
          <p className="text-xs text-slate-400 mt-1.5">You'll be flagged once spend crosses this % of the limit.</p>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Create Budget'}
        </button>
      </form>
    </Modal>
  );
};

export default BudgetModal;
