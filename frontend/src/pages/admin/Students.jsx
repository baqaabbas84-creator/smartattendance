import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Filter, Trash2, CheckCircle, XCircle } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ branch: '', year: '' });

  const fetchStudents = () => {
    setLoading(true);
    const params = {};
    if (filters.branch) params.branch = filters.branch;
    if (filters.year) params.year = filters.year;
    adminService.getStudents(params)
      .then(res => { if (res.success) setStudents(res.data); })
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await adminService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  };

  const filtered = students.filter(s =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 mt-1">Manage all students registered in the system.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or roll..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={filters.branch}
          onChange={e => setFilters(f => ({ ...f, branch: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        >
          <option value="">All Branches</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="EC">EC</option>
          <option value="ME">ME</option>
        </select>
        <select
          value={filters.year}
          onChange={e => setFilters(f => ({ ...f, year: e.target.value }))}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
        >
          <option value="">All Years</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Student List</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{filtered.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
            <p>No students found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((student) => (
              <div key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {student.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Roll</p>
                    <p className="font-mono font-semibold text-slate-700">{student.rollNumber}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Branch</p>
                    <p className="font-semibold text-slate-700">{student.branch} Y{student.year}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Class</p>
                    <p className="font-semibold text-slate-700">{student.class || '—'}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${student.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {student.isActive ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminStudents;
