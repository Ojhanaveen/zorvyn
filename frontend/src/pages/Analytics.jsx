import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  PieChart as PieChartIcon,
  Calendar,
  Filter
} from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/transactions/summary`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  // Format monthly trends for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = data?.monthlyTrends ? Object.values(data.monthlyTrends.reduce((acc, curr) => {
    const key = `${curr._id.year}-${curr._id.month}`;
    if (!acc[key]) {
      acc[key] = { name: `${months[curr._id.month - 1]} ${curr._id.year}`, Income: 0, Expense: 0 };
    }
    acc[key][curr._id.type] = curr.total;
    return acc;
  }, {})).slice(-6) : [];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Financial Analytics</h1>
            <p className="text-slate-500 font-medium">Deep-dive insights into your revenue and spending patterns.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Calendar size={18} />
              <span>Last 6 Months</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              <Filter size={18} />
              <span>Full Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue vs Expense Trend */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cash Flow Trend</h3>
                  <p className="text-xs text-slate-400 font-medium">Comparison of income vs expenses</p>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl">
                  <PieChartIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Spending by Category</h3>
                  <p className="text-xs text-slate-400 font-medium">Distribution of all expenses</p>
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryBreakdown.filter(c => c.type === 'Expense')}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="total"
                    nameKey="category"
                  >
                    {data?.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Savings Rate</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={16} />
              </div>
            </div>
            <h4 className="text-3xl font-display font-bold text-slate-900">
              {data?.summary.income > 0 ? ((data.summary.balance / data.summary.income) * 100).toFixed(1) : 0}%
            </h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">Percentage of income saved</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg Transaction</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Activity size={16} />
              </div>
            </div>
            <h4 className="text-3xl font-display font-bold text-slate-900">
              ₹{data?.recentActivity.length > 0 ? (data.summary.expense / 20).toFixed(0) : 0}
            </h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">Estimated monthly average</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Debt Ratio</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <TrendingDown size={16} />
              </div>
            </div>
            <h4 className="text-3xl font-display font-bold text-slate-900">12.4%</h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">Lower is better for health</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
