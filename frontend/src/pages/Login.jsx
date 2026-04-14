import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const success = await login(email, password, role);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid credentials or unauthorized role login.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100">
          
          {/* Left Side: Branding/Info */}
          <div className="bg-indigo-600 p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-extrabold mb-8 leading-tight">
                Welcome back to <br /> Finma Finance.
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <p className="text-indigo-100 text-lg">Secure access to your financial dashboard.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <p className="text-indigo-100 text-lg">Detailed transaction logs and analytics.</p>
                </li>
              </ul>
            </div>

            <div className="relative z-10 pt-12 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="text-white w-7 h-7" />
              </div>
              <p className="text-indigo-200 text-sm font-medium italic">
                Advanced encryption protects every byte of your data.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Log in to Finma</h1>
              <p className="text-slate-500 font-medium">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 animate-shake">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{errorMsg}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 ml-1">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-sm font-bold text-indigo-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Login As</label>
                <div className="relative group text-slate-900	">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <select
                    className="block w-full pl-11 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 appearance-none"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Admin">Administrator</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <ArrowRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-indigo-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Log In Now <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 font-extrabold hover:underline">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
