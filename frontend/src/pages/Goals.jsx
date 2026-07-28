import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { GoalModal, ContributeModal } from '../components/GoalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useFetch } from '../hooks/useApi';
import * as goalsApi from '../api/goals';
import { PlusCircle, Target, Edit3, Trash2, PiggyBank, CheckCircle2 } from 'lucide-react';

const Goals = () => {
  const { user } = useAuth();
  const { data: goals, loading, refetch } = useFetch(() => goalsApi.getGoals(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [contributing, setContributing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const isAdmin = user?.role === 'Admin';
  const canContribute = user?.role === 'Admin' || user?.role === 'Analyst';

  const handleSave = async (payload) => {
    if (editing) await goalsApi.updateGoal(editing._id, payload);
    else await goalsApi.createGoal(payload);
    refetch();
  };

  const handleContribute = async (amount) => {
    await goalsApi.contributeToGoal(contributing._id, amount);
    refetch();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await goalsApi.deleteGoal(deleting._id);
      setDeleting(null);
      refetch();
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Savings Goals</h1>
            <p className="text-slate-500 font-medium">Set targets and track progress towards them.</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <PlusCircle size={18} />
              <span>New Goal</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : goals?.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Target size={40} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">No savings goals yet</h2>
            <p className="text-slate-500">{isAdmin ? 'Create a goal like "Emergency Fund" or "Diwali Trip".' : 'Ask an Admin to set up a savings goal.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals?.map((goal) => {
              const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <div key={goal._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                        <PiggyBank size={22} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-slate-900">{goal.name}</h3>
                        {goal.targetDate && (
                          <p className="text-xs text-slate-400 font-semibold">by {new Date(goal.targetDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    {goal.status === 'Completed' && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border bg-emerald-50 text-emerald-600 border-emerald-100">
                        <CheckCircle2 size={11} /> Done
                      </span>
                    )}
                  </div>

                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" stroke="#6366f1" strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - percent / 100)}`}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-slate-900">{Math.round(percent)}%</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-sm font-bold text-slate-900">₹{goal.currentAmount.toLocaleString()} <span className="text-slate-400 font-medium">/ ₹{goal.targetAmount.toLocaleString()}</span></p>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {canContribute && goal.status !== 'Completed' && (
                      <button onClick={() => setContributing(goal)} className="w-full py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                        Contribute
                      </button>
                    )}
                    {isAdmin && (
                      <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditing(goal); setModalOpen(true); }} className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <Edit3 size={14} /> Edit
                        </button>
                        <button onClick={() => setDeleting(goal)} className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <GoalModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} initialData={editing} />

      <ContributeModal open={!!contributing} onClose={() => setContributing(null)} onSubmit={handleContribute} goal={contributing} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title="Delete Goal"
        message={`Remove the "${deleting?.name}" goal?`}
        confirmLabel="Delete"
      />
    </Layout>
  );
};

export default Goals;
