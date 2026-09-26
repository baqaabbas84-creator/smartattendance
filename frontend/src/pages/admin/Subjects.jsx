import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubjects = () => {
    setLoading(true);
    adminService.getSubjects()
      .then(res => { if (res.success) setSubjects(res.data); })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await adminService.deleteSubject(id);
      setSubjects(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
        <p className="text-slate-500 mt-1">Manage all subjects in the system.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Subject List</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{subjects.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center text-sm">{error}</div>
        ) : subjects.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No subjects found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {subjects.map((sub) => (
              <div key={sub._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <BookOpen size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{sub.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{sub.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Class</p>
                    <p className="font-semibold text-slate-700">{sub.classId?.name || '—'}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Teacher</p>
                    <p className="font-semibold text-slate-700">{sub.teacherId?.userId?.name || sub.teacher || '—'}</p>
                  </div>
                  <div className="hidden md:block text-center">
                    <p className="text-xs text-slate-400">Credits</p>
                    <p className="font-semibold text-brand-600">{sub.credits ?? '—'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(sub._id)}
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
export default AdminSubjects;
