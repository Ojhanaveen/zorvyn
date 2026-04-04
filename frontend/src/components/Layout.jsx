import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-64'} p-8 transition-all duration-300 ease-in-out`}>
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-indigo-50/50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-64 -z-10 w-1/4 h-1/4 bg-blue-50/50 rounded-full blur-3xl opacity-50 -translate-x-1/4 translate-y-1/4" />
    </div>
  );
};

export default Layout;
