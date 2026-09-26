import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, TrendingUp, BookOpen, X, ChevronRight, Clock, Loader } from 'lucide-react';
import teacherService from '../../services/teacherService';

const statusColor = {
  Good: 'bg-green-100 text-green-700',
  Warning: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-red-100 text-red-700',
  Excellent: 'bg-brand-100 text-brand-700',
};

const TeacherClasses = () => {
  const location = useLocation();
  const [selectedSubject, setSelectedSubject] = useState(location.state?.subject || null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    teacherService.getDashboard()
      .then(res => { if (res.success) setSubjects(res.data.subjects || []); })
      .catch(() => setError('Failed to load subjects'))
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {selectedSubject && (
          <button
            onClick={() => setSelectedSubject(null)}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <X size={18} className="text-slate-600" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {selectedSubject ? selectedSubject.name : 'My Classes'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {selectedSubject ? `Class: ${selectedSubject.class}` : 'All your assigned subjects and classes'}
          </p>
        </div>
      </div>

      {!selectedSubject ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.length > 0 ? subjects.map((sub) => (
            <SubjectCard key={sub.id} sub={sub} onViewDetails={() => setSelectedSubject(sub)} />
          )) : (
            <div className="col-span-3 text-center py-16 text-slate-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p>No subjects assigned yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <Users size={20} className="text-brand-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Students</p>
                <p className="text-2xl font-bold text-slate-900">{selectedSubject.students}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Avg Attendance</p>
                <p className="text-2xl font-bold text-slate-900">{selectedSubject.avgAttendance}%</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Clock size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Sessions Today</p>
                <p className="text-2xl font-bold text-slate-900">{selectedSubject.sessionsToday ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Subject: {selectedSubject.name}</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {selectedSubject.class}
              </span>
            </div>
            <div className="px-6 py-12 text-center text-slate-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p>View detailed student list from the Attendance page.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SubjectCard = ({ sub, onViewDetails }) => {
  const pct = sub.avgAttendance;
  const color = pct >= 85 ? 'bg-green-500' : pct >= 75 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
            <BookOpen size={22} className="text-brand-600" />
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{sub.class}</span>
        </div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{sub.name}</h3>
        <p className="text-xs text-slate-400 font-mono mb-2">{sub.code}</p>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <span className="flex items-center gap-1"><Users size={13} /> {sub.students} Students</span>
          <span className="font-semibold text-brand-600">{sub.avgAttendance}% Avg</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-5">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-all group-hover:shadow-sm"
        >
          View Details <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default TeacherClasses;
