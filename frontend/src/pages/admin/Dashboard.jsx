import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, Layers, Activity, MoreVertical, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => { if (res.success) setDashData(res.data); })
      .catch(() => setError('Failed to load dashboard'))
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

  const { stats, today, recentActivity } = dashData || {};

  const presentPct = today?.total > 0 ? Math.round((today.present / today.total) * 100) : stats?.todayAttendance || 0;
  const absentPct = 100 - presentPct;

  const pieData = [
    { name: 'Present', value: presentPct, color: '#10b981' },
    { name: 'Absent', value: absentPct, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Monitor college-wide attendance and statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <AdminStat title="Total Students" value={stats?.students ?? 0} icon={GraduationCap} color="brand" />
        <AdminStat title="Total Teachers" value={stats?.teachers ?? 0} icon={Users} color="indigo" />
        <AdminStat title="Active Subjects" value={stats?.subjects ?? 0} icon={BookOpen} color="amber" />
        <AdminStat title="Total Classes" value={stats?.classes ?? 0} icon={Layers} color="rose" />
        <AdminStat title="Today's Avg" value={`${stats?.todayAttendance ?? 0}%`} icon={Activity} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-32 bg-brand-50 rounded-full blur-[80px] -z-10 group-hover:bg-brand-100 transition-colors duration-500" />
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Today's Attendance</h3>
          </div>
          
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => [`${v}%`]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">
                {presentPct}<span className="text-2xl text-slate-400">%</span>
              </span>
              <span className="text-sm font-semibold text-green-500 mt-1">Present</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-8 mt-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-600">Present ({today?.present ?? 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-sm font-medium text-slate-600">Absent ({today?.absent ?? 0})</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-800">Recent Activity Logs</h3>
          </div>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-6">
              {recentActivity.map((act, index) => (
                <div key={act.id || index} className="flex gap-5 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 mt-1.5 rounded-full bg-brand-500 ring-4 ring-brand-50 group-hover:scale-125 transition-transform" />
                    {index !== recentActivity.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-100 mt-2" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-medium text-slate-800 group-hover:text-brand-700 transition-colors">{act.action}</p>
                    <p className="text-sm text-slate-400 mt-1 font-medium">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Activity size={40} className="mx-auto mb-3 opacity-30" />
              <p>No recent activity found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminStat = ({ title, value, icon: Icon, color }) => {
  const colorStyles = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl border ${colorStyles[color]}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h4>
      <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">{title}</p>
    </div>
  );
};

export default AdminDashboard;
