import React, { useState, useEffect } from 'react';
import { Users, Filter, CheckCircle, XCircle } from 'lucide-react';
import teacherService from '../../services/teacherService';

const TeacherAttendance = () => {
  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ subject: '', date: '' });

  useEffect(() => {
    teacherService.getSubjects()
      .then(res => { if (res.success) setSubjects(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.subject) params.subject = filters.subject;
    if (filters.date) params.date = filters.date;

    teacherService.getAttendance(params)
      .then(res => { if (res.success) setRecords(res.data); })
      .catch(() => setError('Failed to load attendance records'))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance Records</h1>
        <p className="text-slate-500 mt-1">View and filter attendance for your subjects.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Filter size={16} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select
          value={filters.subject}
          onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        >
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        />
        {(filters.subject || filters.date) && (
          <button
            onClick={() => setFilters({ subject: '', date: '' })}
            className="px-3 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Records Table */}
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{studentName}</p>
                      <p className="text-xs text-slate-400">{subjectName} — {new Date(rec.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isPresent ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {isPresent ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {rec.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default TeacherAttendance;
