import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Briefcase, Hash } from 'lucide-react';

const TeacherProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Teacher Profile</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4">
            {user?.name?.charAt(0) || 'T'}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full mt-2 uppercase tracking-wide">
            Faculty
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm"><User className="text-slate-500" size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Full Name</p>
              <p className="font-semibold text-slate-900">{user?.name || '—'}</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm"><Mail className="text-slate-500" size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Email Address</p>
              <p className="font-semibold text-slate-900">{user?.email || '—'}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm"><Hash className="text-slate-500" size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Employee ID</p>
              <p className="font-semibold text-slate-900">{user?.employeeId || '—'}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm"><Briefcase className="text-slate-500" size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Department</p>
              <p className="font-semibold text-slate-900">{user?.department || '—'}</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 md:col-span-2">
            <div className="p-3 bg-white rounded-xl shadow-sm"><Shield className="text-slate-500" size={20} /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Account Status</p>
              <p className="font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
