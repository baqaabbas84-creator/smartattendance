import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Fetch subjects once for the dropdown
    studentService.getSubjects().then(res => {
      if(res.success) setSubjects(res.data);
    });
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (filterSubject) filters.subject = filterSubject;
        if (filterStatus) filters.status = filterStatus;
        
        const res = await studentService.getAttendanceHistory(filters);
        if (res.success) {
          setHistory(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch attendance history', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [filterSubject, filterStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>
        <p className="text-slate-500 mt-1">View your past attendance records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
          <select 
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
          </select>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
             <div className="flex justify-center items-center h-32">
               <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Time</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.length > 0 ? history.map((record, i) => (
                  <tr key={record.id || i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {record.date ? new Date(record.date).toLocaleDateString() : new Date(record.markedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {record.subject || 'Unknown'}
                      {record.code && <span className="block text-xs text-slate-500 font-normal">{record.code}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record.markedAt ? new Date(record.markedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        record.status === 'Present' ? 'bg-green-100 text-green-700' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
export default Attendance;
