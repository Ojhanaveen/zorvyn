import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setUsers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await axios.put(`${API_URL}/api/users/${userId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  if (currentUser.role !== 'Admin') {
    return (
      <Layout>
        <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Unauthorized Access</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Only users with Admin clearance are permitted to access the Identity & Access Management console.</p>
          <Link to="/dashboard" className="mt-8 btn btn-primary px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Return to Dashboard</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Identity & Access</h1>
            <p className="text-slate-500 font-medium font-sans">Manage organization users, roles, and security permissions.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]">
            <UserPlus size={20} />
            <span>Invite User</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm italic">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center text-indigo-600 font-black text-xl border border-white shadow-sm ring-4 ring-slate-50/50">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-display font-bold text-slate-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">
                      <Shield size={12} />
                      {user.role}
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  {user.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Mail size={16} />
                  </div>
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <Clock size={16} />
                  </div>
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => toggleStatus(user._id, user.status)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${user.status === 'Active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                  {user.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {loading && (
             <div className="col-span-full py-20 flex justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
