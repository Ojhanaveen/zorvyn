import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const emptyForm = {
  name: '', category: 'Other', amount: '', nextDueDate: new Date().toISOString().slice(0, 10),
  recurrence: 'Monthly', totalInstallments: '', reminderDaysBefore: 3, notes: ''
};

const BillModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(initialData ? {
        name: initialData.name,
        category: initialData.category,
        amount: initialData.amount,
        nextDueDate: new Date(initialData.nextDueDate).toISOString().slice(0, 10),
        recurrence: initialData.recurrence,
        totalInstallments: initialData.totalInstallments || '',
        reminderDaysBefore: initialData.reminderDaysBefore,
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
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        reminderDaysBefore: Number(form.reminderDaysBefore),
        totalInstallments: form.totalInstallments ? Number(form.totalInstallments) : null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save bill');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Bill' : 'Add Bill / EMI'} subtitle="Track a recurring bill or loan installment.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div>
          <label className={labelClass}>Name</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="e.g. Car Loan EMI" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {['Rent', 'EMI', 'Subscription', 'Utility', 'Loan', 'Insurance', 'Other'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input type="number" name="amount" min="1" required value={form.amount} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Next Due Date</label>
            <input type="date" name="nextDueDate" required value={form.nextDueDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Recurrence</label>
            <select name="recurrence" value={form.recurrence} onChange={handleChange} className={inputClass}>
              {['One-time', 'Weekly', 'Monthly', 'Yearly'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Total Installments (EMI only)</label>
            <input type="number" name="totalInstallments" min="1" value={form.totalInstallments} onChange={handleChange} className={inputClass} placeholder="Leave blank if N/A" />
          </div>
          <div>
            <label className={labelClass}>Remind (days before)</label>
            <input type="number" name="reminderDaysBefore" min="0" value={form.reminderDaysBefore} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} className={inputClass} placeholder="Optional note" />
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Add Bill'}
        </button>
      </form>
    </Modal>
  );
};

export default BillModal;
