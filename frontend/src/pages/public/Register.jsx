import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { QrCode } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    branch: '',
    year: '1',
    section: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const res = await authService.registerStudent({
      ...formData,
      year: parseInt(formData.year, 10)
    });

    if (res.success) {
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      let errMsg = res.message || 'Registration failed.';
      if (res.errors) {
        errMsg = Object.values(res.errors).join('. ');
      }
      setError(errMsg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
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
              Join SmartAttend Today
            </h1>
            <p className="text-lg text-slate-300">
              Create a student account to start marking your attendance securely via QR codes.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
             <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6 py-12 overflow-y-auto">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Sign up as a new student</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="john.doe@student.edu"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                <input 
                  type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. CS2024001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                <input 
                  type="text" name="branch" value={formData.branch} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. CSE"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <select name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white">
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <input 
                  type="text" name="section" value={formData.section} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. A"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 flex justify-center items-center disabled:opacity-70"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
