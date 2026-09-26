import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Use reports endpoint which returns subjects WITH attendance data
        const res = await studentService.getReports();
        if (res.success && res.data.subjects) {
          setSubjects(res.data.subjects);
        }
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Subjects</h1>
        <p className="text-slate-500 mt-1">Detailed attendance per subject.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, idx) => (
          <div key={sub.subjectId || idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{sub.name}</h3>
                <p className="text-sm text-slate-500">{sub.code}</p>
              </div>
              <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                sub.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>{sub.attendance}%</span>
            </div>
            <p className="text-sm text-slate-600 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs">👨‍🏫</span>
              {sub.teacherName || 'Assigned Teacher'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Classes Attended</span>
                <span className="font-medium text-slate-700">{sub.present} / {sub.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${sub.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${sub.attendance}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {subjects.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No subjects enrolled.
          </div>
        )}
      </div>
    </div>
  );
};
export default Subjects;
