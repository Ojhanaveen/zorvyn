import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const emptyForm = { name: '', targetAmount: '', targetDate: '' };

export const GoalModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(initialData ? {
        name: initialData.name,
        targetAmount: initialData.targetAmount,
        targetDate: initialData.targetDate ? new Date(initialData.targetDate).toISOString().slice(0, 10) : ''
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
        targetAmount: Number(form.targetAmount),
        targetDate: form.targetDate || null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save goal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Goal' : 'New Savings Goal'} subtitle="Set a target and track progress over time.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div>
          <label className={labelClass}>Goal Name</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g. Diwali Trip" />
        </div>

        <div>
          <label className={labelClass}>Target Amount (₹)</label>
          <input type="number" name="targetAmount" min="1" required value={form.targetAmount} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Target Date (optional)</label>
          <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} className={inputClass} />
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Create Goal'}
        </button>
      </form>
    </Modal>
  );
};

export const ContributeModal = ({ open, onClose, onSubmit, goal }) => {
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setAmount('');
      setError('');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(Number(amount));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add contribution');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Contribute to "${goal?.name}"`} subtitle="Log money set aside towards this goal." maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}
        <div>
          <label className={labelClass}>Amount (₹)</label>
          <input type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} autoFocus />
        </div>
        <button type="submit" disabled={saving} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-60">
          {saving ? 'Adding…' : 'Add Contribution'}
        </button>
      </form>
    </Modal>
  );
};
