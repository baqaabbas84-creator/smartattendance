import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { QrCode, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (r) => {
    setRole(r);
    if (r === 'student') {
      setEmail('arjun.singh@student.sas.edu');
      setPassword('Student@123');
    } else if (r === 'teacher') {
      setEmail('rajesh.kumar@sas.edu');
      setPassword('Teacher@123');
    } else if (r === 'admin') {
      setEmail('admin@sas.edu');
      setPassword('Admin@123');
    }
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      const userRole = result.user.role;
      navigate(`/${userRole}/dashboard`);
    } else {
      setError(result.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Left side */}
      <div className="hidden lg:flex flex-1 bg-slate-900 text-white flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply z-0"></div>
        <div className="relative z-10 p-12 flex flex-col h-full justify-between">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <QrCode size={24} />
            </div>
            SmartAttend
          </Link>
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
              Welcome back to SmartAttend
            </h1>
            <p className="text-lg text-slate-300">
              The smartest way to manage college attendance. Sign in to access your personalized dashboard.
            </p>
          </div>
          <div className="flex gap-4">
             {/* decorative dots */}
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          </div>
        </div>
      </div>
      
      {/* Right side form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2">Enter your credentials to continue</p>
          </div>
          
          {/* Demo role selector */}
          <div className="mb-8 p-4 bg-brand-50 rounded-xl border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">Quick Demo Login</p>
            <div className="flex gap-2">
              {['student', 'teacher', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleDemoFill(r)}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition-all ${role === r ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <span className="font-medium">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-brand-600 hover:text-brand-700">Forgot Password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account? <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
