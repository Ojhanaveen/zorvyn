import React, { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import Modal from './Modal';
import { getUserDirectory } from '../api/users';

const inputClass = 'w-full bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900';
const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5';

const SplitModal = ({ open, onClose, onSubmit, currentUser }) => {
  const [directory, setDirectory] = useState([]);
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('Shared');
  const [paidBy, setPaidBy] = useState('');
  const [participants, setParticipants] = useState([{ user: '', share: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setDescription('');
    setTotalAmount('');
    setCategory('Shared');
    setPaidBy(currentUser?._id || '');
    setParticipants([{ user: currentUser?._id || '', share: '' }]);
    getUserDirectory().then((res) => setDirectory(res.data)).catch(() => setDirectory([]));
  }, [open, currentUser]);

  const updateParticipant = (index, field, value) => {
    const next = [...participants];
    next[index] = { ...next[index], [field]: value };
    setParticipants(next);
  };

  const addParticipant = () => setParticipants([...participants, { user: '', share: '' }]);
  const removeParticipant = (index) => setParticipants(participants.filter((_, i) => i !== index));

  const shareTotal = participants.reduce((sum, p) => sum + (Number(p.share) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        description,
        totalAmount: Number(totalAmount),
        category,
        paidBy,
        participants: participants
          .filter((p) => p.user)
          .map((p) => ({ user: p.user, share: Number(p.share) }))
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create split expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Split an Expense" subtitle="Divide a shared cost among team members." maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">{error}</div>}

        <div>
          <label className={labelClass}>Description</label>
          <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="e.g. Team Dinner" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Total Amount (₹)</label>
            <input type="number" min="1" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Paid By</label>
          <select required value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className={inputClass}>
            <option value="">Select a person</option>
            {directory.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelClass + ' mb-0'}>Participants & Shares</label>
            <span className={`text-xs font-bold ${Math.abs(shareTotal - Number(totalAmount || 0)) < 0.01 ? 'text-emerald-600' : 'text-rose-500'}`}>
              ₹{shareTotal} / ₹{totalAmount || 0}
            </span>
          </div>
          <div className="space-y-2">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <select value={p.user} onChange={(e) => updateParticipant(i, 'user', e.target.value)} required className={`${inputClass} flex-1 min-w-0`}>
                  <option value="">Select person</option>
                  {directory.map((u) => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
                <input type="number" min="0" placeholder="Share ₹" required value={p.share} onChange={(e) => updateParticipant(i, 'share', e.target.value)} className="w-20 shrink-0 bg-slate-50 px-2 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-medium text-slate-900" />
                <button type="button" onClick={() => removeParticipant(i)} disabled={participants.length === 1} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-30 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addParticipant} className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700">
            <Plus size={14} /> Add participant
          </button>
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-60">
          {saving ? 'Saving…' : 'Create Split'}
        </button>
      </form>
    </Modal>
  );
};

export default SplitModal;
