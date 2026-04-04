import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Trash2, 
  Edit3, 
  Plus,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const res = await axios.get(`${API_URL}/api/transactions?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTransactions(res.data.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', startDate: '', endDate: '', search: '' });
    setSearchTerm('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Transaction Log</h1>
            <p className="text-slate-500 font-medium">Browse and manage all financial entries.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline h-11">
              <Download size={18} />
              <span>Export</span>
            </button>
            {/* Only Admin can add records */}
            {user?.role === 'Admin' && (
              <button className="btn btn-primary h-11">
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search category, note, or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder:text-slate-400 text-sm font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600'} text-sm font-bold transition-all`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {(filters.type || filters.category || filters.startDate) && (
                <span className="flex items-center justify-center w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px]">1</span>
              )}
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <button className="btn btn-outline px-3 h-10 border-none hover:bg-slate-50">
              <ArrowUpDown size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Transaction Type</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="w-full bg-white px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
              >
                <option value="">All Types</option>
                <option value="Income">Income Only</option>
                <option value="Expense">Expense Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Date Range (From)</label>
              <input 
                type="date" 
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full bg-white px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Date Range (To)</label>
              <input 
                type="date" 
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full bg-white px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium" 
              />
            </div>

            <div className="flex items-end gap-2">
              <button 
                onClick={clearFilters}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white rounded-xl transition-all"
              >
                Clear All
              </button>
              <button className="flex-1 btn btn-primary py-2.5 text-sm">
                Apply
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm shadow-slate-100 transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-bottom border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Detail</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Creator</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  {user.role === 'Admin' && <th className="px-6 py-4 h-11 w-20"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((trx) => (
                  <tr key={trx._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{new Date(trx.date).toLocaleDateString()}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(trx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{trx.category}</span>
                        <span className="text-xs text-slate-500 italic max-w-[200px] truncate">{trx.notes || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ring-1 ${trx.type === 'Income' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-rose-100'}`}>
                        {trx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {trx.createdBy?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-600">{trx.createdBy?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-base font-black tracking-tight ${trx.type === 'Income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {trx.type === 'Income' ? '+' : '-'}₹{trx.amount.toLocaleString()}
                      </span>
                    </td>
                    {user.role === 'Admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {transactions.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="max-w-[200px] mx-auto opacity-30 mb-4">
                        <Receipt size={64} className="mx-auto" />
                      </div>
                      <p className="text-slate-400 font-medium">No transactions found match your criteria.</p>
                      <button onClick={clearFilters} className="text-indigo-600 font-bold text-sm mt-2 hover:underline">Clear all filters</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 italic">Showing {transactions.length} entries</span>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30" disabled>
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm">1</button>
              </div>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30" disabled>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
