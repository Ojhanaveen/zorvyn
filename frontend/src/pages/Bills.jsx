import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import BillModal from '../components/BillModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useFetch } from '../hooks/useApi';
import * as billsApi from '../api/bills';
import { PlusCircle, CalendarClock, Edit3, Trash2, CheckCircle2, ReceiptIndianRupee } from 'lucide-react';

const STATUS_BADGE = {
  Upcoming: 'bg-slate-50 text-slate-500 border-slate-200',
  Due: 'bg-amber-50 text-amber-600 border-amber-100',
  Overdue: 'bg-rose-50 text-rose-600 border-rose-100',
  Paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Completed: 'bg-indigo-50 text-indigo-600 border-indigo-100'
};

const Bills = () => {
  const { user } = useAuth();
  const { data: bills, loading, refetch } = useFetch(() => billsApi.getBills(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const isAdmin = user?.role === 'Admin';

  const handleSave = async (payload) => {
    if (editing) await billsApi.updateBill(editing._id, payload);
    else await billsApi.createBill(payload);
    refetch();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await billsApi.deleteBill(deleting._id);
      setDeleting(null);
      refetch();
    } finally {
      setDeletingBusy(false);
    }
  };

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await billsApi.payBill(id);
      refetch();
    } finally {
      setPayingId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Bills & EMIs</h1>
            <p className="text-slate-500 font-medium">Stay ahead of rent, subscriptions, and loan installments.</p>
          </div>
          {isAdmin && (
            <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <PlusCircle size={18} />
              <span>Add Bill</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bills?.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <CalendarClock size={40} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">No bills tracked yet</h2>
            <p className="text-slate-500">{isAdmin ? 'Add rent, subscriptions, or EMIs to get due-date reminders.' : 'Ask an Admin to add recurring bills.'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {bills?.map((bill) => (
                <div key={bill._id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 group hover:bg-slate-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <ReceiptIndianRupee size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900">{bill.name}</h3>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${STATUS_BADGE[bill.status]}`}>{bill.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {bill.category} · Due {new Date(bill.nextDueDate).toLocaleDateString()} · {bill.recurrence}
                      {bill.totalInstallments ? ` · ${bill.installmentsPaid}/${bill.totalInstallments} paid` : ''}
                    </p>
                    {bill.totalInstallments && (
                      <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${Math.min((bill.installmentsPaid / bill.totalInstallments) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-lg font-black text-slate-900">₹{bill.amount.toLocaleString()}</span>
                    {isAdmin && bill.status !== 'Completed' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePay(bill._id)}
                          disabled={payingId === bill._id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all disabled:opacity-60"
                        >
                          <CheckCircle2 size={14} />
                          {payingId === bill._id ? 'Paying…' : 'Mark Paid'}
                        </button>
                        <button onClick={() => { setEditing(bill); setModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => setDeleting(bill)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BillModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSave} initialData={editing} />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletingBusy}
        title="Delete Bill"
        message={`Remove "${deleting?.name}" from your tracked bills?`}
        confirmLabel="Delete"
      />
    </Layout>
  );
};

export default Bills;
