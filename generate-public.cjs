const fs = require('fs');
const path = require('path');

const files = {
  'pages/public/Landing.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, BarChart3, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <QrCode size={20} />
            </div>
            <span className="text-xl font-bold text-brand-950">SmartAttend</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How it Works</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Log in</Link>
            <Link to="/register" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm shadow-brand-500/20 hover:bg-brand-700 transition-all hover:shadow-brand-500/30">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Smart Attendance Management System
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Attendance management made faster, smarter and more secure. Beautiful dashboards, real-time analytics, and seamless QR code tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3 bg-brand-600 text-white font-medium rounded-xl shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-brand-500/40 transition-all text-lg">
              Get Started
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 font-medium rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-lg">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent z-10 top-1/2"></div>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transform md:-rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Mock Header */}
            <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Mock Dashboard */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50">
              <div className="md:col-span-1 space-y-4">
                <div className="h-8 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded-md w-2/3"></div>
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                <div className="h-24 bg-white border border-slate-200 rounded-xl"></div>
                <div className="h-24 bg-white border border-slate-200 rounded-xl"></div>
                <div className="h-24 bg-white border border-slate-200 rounded-xl"></div>
                <div className="col-span-3 h-48 bg-white border border-slate-200 rounded-xl mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
            <p className="text-lg text-slate-600">A complete ecosystem for educational institutions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard icon={QrCode} title="Smart QR Attendance" desc="Teachers generate time-limited QR sessions and students scan to mark attendance." />
            <FeatureCard icon={BarChart3} title="Real-Time Tracking" desc="Monitor attendance records and live attendance counts in beautiful charts." />
            <FeatureCard icon={Users} title="Role-Based Dashboards" desc="Dedicated experiences for Students, Teachers and Administrators." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center">
        <p className="mb-4 text-white font-medium flex justify-center items-center gap-2">
          <QrCode size={18} /> SmartAttend
        </p>
        <p className="text-sm">© 2026 SmartAttend Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all">
    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-6">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
`,
  'pages/public/Login.jsx': `import React, { useState } from 'react';
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
    setEmail(r + '@college.com');
    setPassword('demo123');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      if(email && password) {
        login(role);
        navigate(\`/\${role}/dashboard\`);
      } else {
        setError('Please fill in all fields');
        setLoading(false);
      }
    }, 800);
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
                  className={\`flex-1 py-1.5 text-sm font-medium rounded-lg capitalize transition-all \${role === r ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}\`}
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
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('Public pages written.');
