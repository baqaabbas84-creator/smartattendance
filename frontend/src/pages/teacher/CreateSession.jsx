import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Loader } from 'lucide-react';
import teacherService from '../../services/teacherService';

const CreateSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [fetchingSubjects, setFetchingSubjects] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    subjectId: '',
    classId: '',
    duration: 10,
  });

  useEffect(() => {
    teacherService.getSubjects()
      .then(res => { if (res.success) setSubjects(res.data); })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setFetchingSubjects(false));
  }, []);

  const selectedSubject = subjects.find(s => s._id === form.subjectId);

  const handleSubjectChange = (e) => {
    const subId = e.target.value;
    const sub = subjects.find(s => s._id === subId);
    setForm(f => ({ ...f, subjectId: subId, classId: sub?.classId?._id || '' }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.subjectId || !form.classId) {
      setError('Please select a subject.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await teacherService.createSession(form.subjectId, form.classId, Number(form.duration));
      if (res.success) {
        // Navigate to active session page with session data
        navigate(`/teacher/session/${res.session.sessionId}`, { state: { session: res.session, qrData: res.qrData } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Create Attendance Session</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
        )}
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              {fetchingSubjects ? (
                <div className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-400">
                  <Loader size={16} className="animate-spin" /> Loading subjects...
                </div>
              ) : (
                <select
                  value={form.subjectId}
                  onChange={handleSubjectChange}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                >
                  <option value="">-- Select a Subject --</option>
                  {subjects.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code}) — {sub.classId?.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedSubject && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Class / Section</label>
                <input
                  type="text"
                  readOnly
                  value={selectedSubject.classId?.name || ''}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 outline-none cursor-not-allowed"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                max={120}
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || fetchingSubjects}
              className="w-full py-3.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating QR...</>
              ) : (
                <><BookOpen size={18} /> Generate QR Code</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateSession;

