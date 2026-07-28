import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import BudgetModal from '../components/BudgetModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useFetch } from '../hooks/useApi';
import * as budgetsApi from '../api/budgets';
import { PlusCircle, Wallet, Edit3, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STATUS_STYLES = {
  'On Track': { text: 'text-emerald-600', bg: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  Warning: { text: 'text-amber-600', bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 border-amber-100' },
  Exceeded: { text: 'text-rose-600', bg: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600 border-rose-100' }
};

const Budgets = () => {
  const { user } = useAuth();
  const { data: budgets, loading, refetch } = useFetch(() => budgetsApi.getBudgets(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const handleSave = async (payload) => {
    if (editing) await budgetsApi.updateBudget(editing._id, payload);
    else await budgetsApi.createBudget(payload);
    refetch();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await budgetsApi.deleteBudget(deleting._id);
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
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Budgets</h1>
            <p className="text-slate-500 font-medium">Set monthly spending caps and catch overspending early.</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <PlusCircle size={18} />
              <span>New Budget</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : budgets?.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Wallet size={40} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">No budgets set yet</h2>
            <p className="text-slate-500">{isAdmin ? 'Create your first category budget to start tracking limits.' : 'Ask an Admin to set up category budgets.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets?.map((b) => {
              const styles = STATUS_STYLES[b.status] || STATUS_STYLES['On Track'];
              return (
                <div key={b._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-display font-bold text-slate-900">{b.category}</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Monthly limit ₹{b.monthlyLimit.toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border flex items-center gap-1 ${styles.badge}`}>
                      {b.status === 'Exceeded' ? <AlertTriangle size={11} /> : b.status === 'On Track' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                      {b.status}
                    </span>
                  </div>

                  <div className="flex items-end justify-between mb-2">
                    <span className={`text-2xl font-black ${styles.text}`}>₹{b.spent.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 font-bold">{b.percentUsed}% used</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${styles.bg} transition-all duration-700`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                  </div>

                  {isAdmin && (
                    <div className="grid grid-cols-2 gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditing(b); setModalOpen(true); }} className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => setDeleting(b)} className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BudgetModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} initialData={editing} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title="Delete Budget"
        message={`Remove the budget for "${deleting?.category}"?`}
        confirmLabel="Delete"
      />
    </Layout>
  );
};

export default Budgets;
