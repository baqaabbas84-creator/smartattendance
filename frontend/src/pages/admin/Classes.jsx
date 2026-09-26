import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Users } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', branch: 'CS', year: 1, section: 'A' });
  const [submitting, setSubmitting] = useState(false);

  const fetchClasses = () => {
    setLoading(true);
    adminService.getClasses()
      .then(res => { if (res.success) setClasses(res.data); })
      .catch(() => setError('Failed to load classes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createClass(form);
      setShowForm(false);
      setForm({ name: '', branch: 'CS', year: 1, section: 'A' });
      fetchClasses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await adminService.deleteClass(id);
      setClasses(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Classes</h1>
          <p className="text-slate-500 mt-1">Manage class sections and assignments.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all text-sm"
        >
          <Plus size={16} /> Add Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Create New Class</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Name (e.g. CS3A)</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Branch</label>
              <select value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500">
                {['CS','IT','EC','ME','CE'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
              <select value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500">
                {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Section</label>
              <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-500">
                {['A','B','C','D','E','F','G'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-4 flex gap-3">
              <button type="submit" disabled={submitting}
                className="px-6 py-2 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-700 disabled:opacity-60">
                {submitting ? 'Creating...' : 'Create Class'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="col-span-3 p-6 text-red-500 text-center text-sm">{error}</div>
        ) : classes.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <Layers size={40} className="mx-auto mb-3 opacity-30" />
            <p>No classes found.</p>
          </div>
        ) : (
          classes.map(cls => (
            <div key={cls._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                  <Layers size={22} className="text-rose-600" />
                </div>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{cls.name}</h3>
              <p className="text-sm text-slate-500 mb-3">{cls.branch} — Year {cls.year}, Section {cls.section}</p>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Users size={14} />
                <span>{cls.students?.length ?? 0} Students</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default AdminClasses;
