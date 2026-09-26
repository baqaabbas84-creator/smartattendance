import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Clock, TrendingUp } from 'lucide-react';
import teacherService from '../../services/teacherService';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    teacherService.getDashboard()
      .then(res => { if (res.success) setDashData(res.data); })
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
  );

  const { teacher, stats, subjects } = dashData || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {teacher?.name || user?.name} 👋</h1>
          <p className="text-slate-500 mt-1">Manage your classes and attendance sessions.</p>
        </div>
        <Link to="/teacher/create-session" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 transition-all">
          + Create Session
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Subjects" value={stats?.subjectsCount ?? 0} icon={BookOpen} color="brand" />
        <StatCard title="Today's Sessions" value={stats?.todaysSessions ?? 0} icon={Clock} color="indigo" />
        <StatCard title="Total Students" value={stats?.studentsCount ?? 0} icon={Users} color="slate" />
        <StatCard title="Avg Attendance" value={`${stats?.avgAttendance ?? 0}%`} icon={TrendingUp} color="green" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">My Subjects</h3>
        {subjects && subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map(sub => (
              <div key={sub.id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-900 text-lg mb-1">{sub.name}</h4>
                <p className="text-xs font-mono text-slate-400 mb-1">{sub.code}</p>
                <p className="text-sm text-slate-500 mb-4">Class: {sub.class}</p>
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-slate-600"><Users size={14} className="inline mr-1"/> {sub.students} Students</span>
                  <span className="font-semibold text-brand-600">{sub.avgAttendance}% Avg</span>
                </div>
                <button
                  onClick={() => navigate('/teacher/classes', { state: { subject: sub } })}
                  className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No subjects assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </div>
  );
};

export default TeacherDashboard;
