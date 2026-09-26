import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchTeachers = () => {
    setLoading(true);
    adminService.getTeachers()
      .then(res => { if (res.success) setTeachers(res.data); })
      .catch(() => setError('Failed to load teachers'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this teacher? This cannot be undone.')) return;
    try {
      await adminService.deleteTeacher(id);
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete teacher');
    }
  };

  const filtered = teachers.filter(t =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
        <p className="text-slate-500 mt-1">Manage all teachers in the system.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Teacher List</h3>
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
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No teachers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {teacher.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{teacher.name}</p>
                    <p className="text-xs text-slate-400">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Employee ID</p>
                    <p className="font-mono font-semibold text-slate-700">{teacher.employeeId || '—'}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="font-semibold text-slate-700">{teacher.department || '—'}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Subjects</p>
                    <p className="font-semibold text-brand-600">{teacher.subjectsCount ?? (teacher.subjects?.length ?? 0)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(teacher.id)}
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
export default AdminTeachers;
