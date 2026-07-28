import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const emptyForm = { name: '', email: '', password: '', role: 'Viewer', status: 'Active' };

const UserModal = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setError('');
    }
  }, [open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite User" subtitle="Create a new team member account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div>
          <label className={labelClass}>Full Name</label>
          <input type="text" name="name" required value={form.name} onChange={handleChange} className={inputClass} placeholder="Jane Doe" />
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className={inputClass} placeholder="jane@company.com" />
        </div>

        <div>
          <label className={labelClass}>Temporary Password</label>
          <input type="text" name="password" required minLength={6} value={form.password} onChange={handleChange} className={inputClass} placeholder="min. 6 characters" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
              <option value="Viewer">Viewer</option>
              <option value="Analyst">Analyst</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Creating…' : 'Create User'}
        </button>
      </form>
    </Modal>
  );
};

export default UserModal;
