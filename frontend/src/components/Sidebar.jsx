import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  Users, 
  LogOut,
  TrendingDown,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Viewer', 'Analyst', 'Admin'] },
    { name: 'Transactions', path: '/transactions', icon: ReceiptIndianRupee, roles: ['Analyst', 'Admin'] },
    { name: 'Analytics', path: '/analytics', icon: PieChartIcon, roles: ['Analyst', 'Admin'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['Admin'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className={`fixed left-0 top-0 h-screen ${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ease-in-out`}>
      <div className={`py-8 flex items-center ${isCollapsed ? 'px-0 justify-center' : 'px-6 justify-between'} transition-all`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? '' : 'overflow-hidden'}`}>
          <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-bold text-xl shadow-lg shadow-indigo-100 shrink-0">
            Z
          </div>
          {!isCollapsed && (
            <span className="text-xl font-display font-bold tracking-tight text-slate-900 lowercase animate-in fade-in slide-in-from-left-2">Zorvyn</span>
          )}
        </div>
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-300"
          >
            <PanelLeftClose size={20} />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button 
          onClick={toggleSidebar}
          className="mx-auto p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all animate-in fade-in zoom-in-75"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-4">
        {filteredItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} group px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            title={isCollapsed ? item.name : ''}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 transition-colors'} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-1">{item.name}</span>
                  )}
                </div>
                {!isCollapsed && <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-100">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} p-3 bg-slate-50 rounded-2xl mb-4 group ring-1 ring-slate-200/50 transition-all`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-slate-200 flex items-center justify-center text-indigo-700 font-bold text-sm ring-2 ring-white shrink-0">
            {user?.name?.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-1">
              <span className="text-sm font-bold text-slate-900 truncate">{user?.name}</span>
              <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest">{user?.role}</span>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 active:scale-[0.98] ring-1 ring-red-100"
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
