import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-md" />
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-brand-600 font-medium capitalize">{user?.role}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="font-medium text-slate-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Roll Number</p>
              <p className="font-medium text-slate-900">{user?.rollNumber || user?.employeeId || 'N/A'}</p>
            </div>
            {user?.branch && (
              <div>
                <p className="text-sm text-slate-500">Branch</p>
                <p className="font-medium text-slate-900">{user?.branch}</p>
              </div>
            )}
            {user?.section && (
              <div>
                <p className="text-sm text-slate-500">Section</p>
                <p className="font-medium text-slate-900">{user?.section}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
