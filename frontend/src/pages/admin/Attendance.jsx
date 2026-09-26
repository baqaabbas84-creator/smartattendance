import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Filter } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ date: '', status: '' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.date) params.date = filters.date;
    if (filters.status) params.status = filters.status;

    adminService.getAttendance(params)
      .then(res => { if (res.success) setRecords(res.data); })
      .catch(() => setError('Failed to load attendance records'))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Records</h1>
        <p className="text-slate-500 mt-1">System-wide attendance overview.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={16} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        />
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        >
          <option value="">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        {(filters.date || filters.status) && (
          <button onClick={() => setFilters({ date: '', status: '' })}
            className="px-3 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Records</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{records.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center text-sm">{error}</div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {records.map((rec, i) => {
              const studentName = rec.studentId?.userId?.name || 'Unknown';
              const subjectName = rec.subjectId?.name || 'Unknown';
              const isPresent = rec.status === 'Present';
              return (
                <div key={rec._id || i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-xs">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{studentName}</p>
                      <p className="text-xs text-slate-400">{subjectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-slate-400 hidden md:block">
                      {new Date(rec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isPresent ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {isPresent ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {rec.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminAttendance;
