import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BookOpen, Download } from 'lucide-react';
import teacherService from '../../services/teacherService';

const TeacherReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    teacherService.getReports()
      .then(res => { if (res.success) setReports(res.data); })
      .catch(() => setError('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const exportToCSV = () => {
    if (!reports) return;
    const subjects = reports.subjects || [];
    const csvRows = ['Subject Name,Subject Code,Present,Absent,Total,Avg Attendance (%)'];
    
    subjects.forEach(sub => {
      csvRows.push(`"${sub.name}","${sub.code}",${sub.present},${sub.absent},${sub.total},${sub.avgAttendance}`);
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
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

  const subjects = reports?.subjects || [];
  const chartData = subjects.map(s => ({
    name: s.code || s.name,
    attendance: s.avgAttendance,
    present: s.present,
    total: s.total,
  }));

  const getBarColor = (pct) => {
    if (pct >= 85) return '#10b981'; // green
    if (pct >= 75) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Reports</h1>
          <p className="text-slate-500 mt-1">Analytics across all your subjects.</p>
        </div>
        <button 
          onClick={exportToCSV}
          disabled={!reports}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      {/* Subject Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map(sub => {
          const pct = sub.avgAttendance;
          const colorClass = pct >= 85 ? 'text-green-600 bg-green-50' : pct >= 75 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
          return (
            <div key={sub.code} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <BookOpen size={18} className="text-brand-600" />
                </div>
                <span className={`text-lg font-bold px-2.5 py-1 rounded-xl ${colorClass}`}>{pct}%</span>
              </div>
              <h4 className="font-bold text-slate-900">{sub.name}</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{sub.code}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <span className="text-green-600 font-semibold">✓ {sub.present} Present</span>
                <span className="text-red-500 font-semibold">✗ {sub.absent} Absent</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${pct >= 85 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-400' : 'bg-red-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-brand-600" />
            <h3 className="font-bold text-slate-900">Attendance by Subject</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Attendance']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="attendance" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.attendance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {subjects.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center text-slate-400">
          <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
          <p>No report data available yet.</p>
        </div>
      )}
    </div>
  );
};
export default TeacherReports;
