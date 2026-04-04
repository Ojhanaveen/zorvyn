import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Receipt,
  MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/transactions/summary', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-500 font-medium animate-pulse">Initializing dashboard...</span>
      </div>
    </div>
  );

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Finance Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        {/* Only Admin can add new entries */}
        {user?.role === 'Admin' && (
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98]">
              <Plus size={18} />
              <span>New Entry</span>
            </button>
          </div>
        )}
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-2xl group-hover:bg-emerald-100 transition-colors">
                  <TrendingUp size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Total Income</span>
                  <h3 className="text-3xl font-display font-bold text-slate-900 mt-0.5">₹{data?.summary.income.toLocaleString()}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> +12.5% vs last month
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 flex items-center justify-center rounded-2xl group-hover:bg-rose-100 transition-colors">
                  <TrendingDown size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">Total Expenses</span>
                  <h3 className="text-3xl font-display font-bold text-slate-900 mt-0.5">₹{data?.summary.expense.toLocaleString()}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 w-fit px-2 py-1 rounded-lg">
                <ArrowDownRight size={14} /> +4.2% vs last month
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow bg-gradient-to-br from-indigo-600 to-violet-700">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/20 text-white flex items-center justify-center rounded-2xl backdrop-blur-md">
                  <Wallet size={24} />
                </div>
                <div className="flex flex-col text-white">
                  <span className="text-[11px] font-bold text-indigo-100 uppercase tracking-widest opacity-80">Net Balance</span>
                  <h3 className="text-3xl font-display font-bold mt-0.5">₹{data?.summary.balance.toLocaleString()}</h3>
                </div>
              </div>
              <div className="mt-4 text-xs font-medium text-white/70">
                Available for withdrawal
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-fit">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">Category Insights</h3>
                  <p className="text-sm text-slate-500 mt-1">Distribution of primary finance flows</p>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="total"
                        nameKey="category"
                        stroke="none"
                      >
                        {data?.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {data?.categoryBreakdown.slice(0, 5).map((item, i) => (
                    <div key={item.category} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ background: COLORS[i % COLORS.length] }}></span>
                          <span className="text-sm font-bold text-slate-700">{item.category}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">₹{item.total.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            background: COLORS[i % COLORS.length],
                            width: `${(item.total / (data.summary.income + data.summary.expense) * 100).toFixed(0)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900">Recent Activity</h3>
                  <p className="text-sm text-slate-500 mt-1">Latest financial movements</p>
                </div>
                {/* Viewers only see dashboard, Analysts can see all transactions */}
                {user?.role !== 'Viewer' && (
                  <Link to="/transactions" className="text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">
                    See All
                  </Link>
                )}
              </div>

              <div className="space-y-6">
                {data?.recentActivity.map((activity) => (
                  <div key={activity._id} className="flex items-center gap-4 group cursor-default">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${activity.type === 'Income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Receipt size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{activity.category}</h4>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {activity.createdBy?.name || 'System'}
                      </p>
                    </div>
                    <div className={`text-sm font-black whitespace-nowrap ${activity.type === 'Income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                      {activity.type === 'Income' ? '+' : '-'}₹{activity.amount.toLocaleString()}
                    </div>
                  </div>
                ))}

                {data?.recentActivity.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-slate-400 italic">No recent transactions found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
            <Wallet size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">No data recorded yet</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Transactions you add will appear here in the overview.</p>
          {user?.role === 'Admin' && (
            <button className="mt-8 btn btn-primary flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-[0.98]">
              <Plus size={20} />
              <span>Add Your First Record</span>
            </button>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
