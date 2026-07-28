import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import SplitModal from '../components/SplitModal';
import { useFetch } from '../hooks/useApi';
import * as splitsApi from '../api/splits';
import { PlusCircle, Users2, CheckCircle2, Circle } from 'lucide-react';

const Splits = () => {
  const { user } = useAuth();
  const canSeeAll = user?.role === 'Analyst' || user?.role === 'Admin';
  const canCreate = user?.role === 'Analyst' || user?.role === 'Admin';

  const [view, setView] = useState(canSeeAll ? 'all' : 'mine');
  const [modalOpen, setModalOpen] = useState(false);
  const [settlingKey, setSettlingKey] = useState(null);

  const fetcher = view === 'all' ? splitsApi.getAllSplits : splitsApi.getMySplits;
  const { data: splits, loading, refetch } = useFetch(fetcher, [view]);

  const handleCreate = async (payload) => {
    await splitsApi.createSplit(payload);
    refetch();
  };

  const handleSettle = async (splitId, participantUserId) => {
    const key = `${splitId}:${participantUserId}`;
    setSettlingKey(key);
    try {
      await splitsApi.settleShare(splitId, participantUserId);
      refetch();
    } finally {
      setSettlingKey(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Split Expenses</h1>
            <p className="text-slate-500 font-medium">Share costs with the team and track who has settled up.</p>
          </div>
          {canCreate && (
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
              <PlusCircle size={18} />
              <span>Split an Expense</span>
            </button>
          )}
        </div>

        {canSeeAll && (
          <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setView('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              All Splits
            </button>
            <button
              onClick={() => setView('mine')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'mine' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              My Splits
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : splits?.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Users2 size={40} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">No split expenses yet</h2>
            <p className="text-slate-500">{canCreate ? 'Split a shared cost among team members to get started.' : 'Nothing has been split with you yet.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {splits?.map((split) => (
              <div key={split._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-lg">{split.description}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {split.category} · Paid by {split.paidBy?.name} · {new Date(split.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-slate-900">₹{split.totalAmount.toLocaleString()}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${split.status === 'Settled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {split.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {split.participants.map((p) => {
                    const isSelf = p.user?._id === user._id;
                    const canSettleThis = !p.settled && (isSelf || user.role === 'Admin');
                    const key = `${split._id}:${p.user?._id}`;
                    return (
                      <div key={p.user?._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          {p.settled ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300" />}
                          <span className="text-sm font-bold text-slate-700">{p.user?.name}{isSelf ? ' (You)' : ''}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-900">₹{p.share.toLocaleString()}</span>
                          {canSettleThis && (
                            <button
                              onClick={() => handleSettle(split._id, p.user?._id)}
                              disabled={settlingKey === key}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                            >
                              {settlingKey === key ? 'Settling…' : 'Settle'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SplitModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreate} currentUser={user} />
    </Layout>
  );
};

export default Splits;
