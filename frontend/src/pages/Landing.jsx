import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Zap, 
  ArrowRight,
  PieChart,
  Lock,
  LineChart
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Modern Finance <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Data Processing
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-12 leading-relaxed">
              Experience the power of real-time financial tracking and granular access control. 
              Finma provides a secure, blazingly fast ecosystem for your enterprise data.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started for Free <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all duration-300"
              >
                Log in
              </Link>
            </div>
            
            {/* App Mockup */}
            <div className="mt-20 relative px-4">
              <div className="mx-auto max-w-5xl bg-slate-900 rounded-2xl shadow-2xl p-2 md:p-4 overflow-hidden border border-slate-800">
                <div className="bg-slate-800 rounded-xl overflow-hidden shadow-inner flex flex-col h-[400px] md:h-[600px]">
                  {/* Mock Sidebar & Headers */}
                  <div className="h-14 border-b border-white/5 bg-slate-900/50 flex items-center px-6 gap-3 shrink-0">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="ml-4 h-4 w-32 md:w-64 bg-white/5 rounded-full" />
                  </div>
                  <div className="flex-1 flex min-h-0 bg-slate-900/40">
                    <div className="w-16 md:w-60 border-r border-white/5 p-4 md:p-6 space-y-6 hidden md:block">
                      <div className="h-2 w-full bg-indigo-500/20 rounded-full" />
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-white/5" />
                            <div className={`h-2 ${i % 2 === 0 ? 'w-2/3' : 'w-full'} bg-white/5 rounded-full`} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 md:p-10 space-y-8 overflow-hidden">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</div>
                          <div className="text-xl font-bold text-white">₹42.8 Lakhs</div>
                          <div className="text-[10px] text-emerald-400 font-bold mt-1">▲ 12.5%</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Active Users</div>
                          <div className="text-xl font-bold text-white">1,240</div>
                          <div className="text-[10px] text-indigo-400 font-bold mt-1">▲ 4.2%</div>
                        </div>
                        <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20">
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Efficiency</div>
                          <div className="text-xl font-bold text-white">98.2%</div>
                          <div className="text-[10px] text-indigo-300 font-bold mt-1">Real-time</div>
                        </div>
                      </div>

                      {/* Main Chart Area */}
                      <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold text-white">Growth Performance</div>
                          <div className="flex gap-2">
                             <div className="w-2 h-2 rounded-full bg-indigo-500" />
                             <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          </div>
                        </div>
                        <div className="h-32 md:h-48 w-full flex items-end gap-1 px-2">
                           {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                             <div 
                               key={i} 
                               className="flex-1 bg-gradient-to-t from-indigo-600/20 to-indigo-500/40 rounded-t-sm transition-all hover:to-indigo-400" 
                               style={{ height: `${h}%` }} 
                             />
                           ))}
                        </div>
                      </div>

                      {/* Recent Log */}
                      <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Activity</div>
                        {[
                          { label: 'Cloud Infrastructure', amount: '₹1,24,000', status: 'Completed' },
                          { label: 'Marketing Campaign', amount: '₹45,500', status: 'Pending' }
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5 text-[11px]">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">Z</div>
                              <span className="text-white font-medium">{row.label}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-slate-400">{row.amount}</span>
                              <span className={`px-2 py-0.5 rounded-full ${row.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'} text-[9px] font-bold`}>{row.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">
              Everything you need to scale
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Finma combines powerful analytics with enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="text-indigo-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Real-time Analytics</h3>
              <p className="text-slate-500 leading-relaxed">
                Connect your data sources and watch as your dashboard updates in real-time with beautiful charts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-sky-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">RBAC Security</h3>
              <p className="text-slate-500 leading-relaxed">
                Role-based access control built directly into the core. Assign Admin, Analyst, or Viewer roles.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="text-emerald-600 w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Zero Latency</h3>
              <p className="text-slate-500 leading-relaxed">
                Optimized MongoDB aggregations ensure your data is processed and delivered in milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden relative bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-8">
            Ready to take control of your data?
          </h2>
          <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">
            Join 1,000+ teams who use Finma to power their financial dashboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
              to="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg shadow-2xl hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Now
            </Link>
            <Link 
              to="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-indigo-700 text-white rounded-full font-bold text-lg border border-indigo-400 hover:bg-indigo-800 transition-all duration-300"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
