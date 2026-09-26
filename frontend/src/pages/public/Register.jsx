import React from 'react';
import { Link } from 'react-router-dom';
const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <p className="text-slate-500 mb-6">This is a demo frontend. Registration is disabled. Please login using the demo credentials.</p>
      <Link to="/login" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 block w-full">Go to Login</Link>
    </div>
  </div>
);
export default Register;
