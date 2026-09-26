import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, GraduationCap, Users, BookOpen, Download } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getReports()
      .then(res => { if (res.success) setReports(res.data); })
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const exportToCSV = () => {
    if (!reports) return;
    const data = reports.classReports || reports.classes || [];
    const csvRows = ['Class Name,Students Count,Avg Attendance (%)'];
    
    data.forEach(cls => {
      const pct = cls.avgAttendance || cls.attendance || 0;
      csvRows.push(`"${cls.name}",${cls.studentsCount || 0},${pct}`);
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
  );

  const subjectReports = reports?.subjectReports || reports?.subjects || [];
  const classReports = reports?.classReports || reports?.classes || [];
  const overall = reports?.overall || {};

  const getBarColor = (pct) => {
    if (pct >= 85) return '#10b981';
    if (pct >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
          <p className="text-slate-500 mt-1">College-wide attendance analytics.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={!reports}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Overall Stats */}
      {overall && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Records', value: overall.totalRecords ?? '—', icon: BookOpen, color: 'brand' },
            { label: 'Overall Present', value: `${overall.overallAttendance ?? 0}%`, icon: TrendingUp, color: 'green' },
            { label: 'Total Students', value: overall.totalStudents ?? '—', icon: GraduationCap, color: 'indigo' },
            { label: 'Total Teachers', value: overall.totalTeachers ?? '—', icon: Users, color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => {
            const colorCls = { brand: 'bg-brand-50 text-brand-600', green: 'bg-green-50 text-green-600', indigo: 'bg-indigo-50 text-indigo-600', amber: 'bg-amber-50 text-amber-600' };
            return (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorCls[color]}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className="text-xl font-bold text-slate-900">{value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subject Chart */}
      {subjectReports.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-brand-600" />
            <h3 className="font-bold text-slate-900">Attendance by Subject</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={subjectReports.map(s => ({ name: s.code || s.name, attendance: s.avgAttendance || s.attendance }))}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Attendance']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {subjectReports.map((_, i) => (
                  <Cell key={i} fill={getBarColor(subjectReports[i].avgAttendance || subjectReports[i].attendance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Class Reports */}
      {classReports.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Class-wise Summary</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {classReports.map((cls, i) => {
              const pct = cls.avgAttendance || cls.attendance || 0;
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{cls.name}</p>
                    <p className="text-xs text-slate-400">{cls.studentsCount ?? 0} students</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 85 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${pct >= 85 ? 'text-green-600' : pct >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subjectReports.length === 0 && classReports.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center text-slate-400">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
          <p>No report data available yet.</p>
        </div>
      )}
    </div>
  );
};
export default AdminReports;
