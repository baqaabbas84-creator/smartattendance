const fs = require('fs');
const path = require('path');

const files = {
  'pages/student/Dashboard.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { QrCode, TrendingUp, TrendingDown, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  
  if(!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good Morning, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500 mt-1">Here's your attendance overview for today.</p>
        </div>
        <Link to="/student/scan" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all">
          <QrCode size={18} />
          Scan Attendance QR
        </Link>
      </div>

      {/* Warning Card */}
      {user.subjects.some(s => s.status === 'Low') && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex gap-4 items-start shadow-sm">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">Attendance Warning</h3>
            <p className="text-sm text-amber-700 mt-1">
              Your attendance in <strong>{user.subjects.find(s => s.status === 'Low')?.name}</strong> is below the required 75%. You need to attend upcoming classes to improve your attendance.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Overall Attendance" value={\`\${user.stats.overallAttendance}%\`} icon={TrendingUp} trend="up" color="brand" />
        <KpiCard title="Total Present" value={user.stats.present} icon={BookOpen} trend="up" color="green" />
        <KpiCard title="Total Absent" value={user.stats.absent} icon={TrendingDown} trend="down" color="red" />
        <KpiCard title="Total Classes" value={user.stats.totalClasses} icon={Clock} trend="neutral" color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subjects list */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Subject Overview</h3>
            <Link to="/student/subjects" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View All</Link>
          </div>
          <div className="space-y-5 flex-1">
            {user.subjects.slice(0, 4).map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700 text-sm">{sub.name}</span>
                  <span className={\`text-xs font-bold px-2 py-1 rounded-md \${
                    sub.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }\`}>{sub.attendance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={\`h-full rounded-full \${sub.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}\`} 
                    style={{ width: \`\${sub.attendance}%\` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    slate: 'bg-slate-100 text-slate-600',
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={\`w-14 h-14 rounded-2xl flex items-center justify-center \${colorMap[color]}\`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
      </div>
    </div>
  );
};

export default Dashboard;
`,
  'pages/student/Scan.jsx': `import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

const Scan = () => {
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error

  const handleDemoScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Scan Attendance QR</h1>
        <p className="text-slate-500 mt-1">Position the QR code inside the frame to mark your attendance.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {status === 'success' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Attendance Marked</h2>
            <div className="space-y-1 text-slate-600 bg-slate-50 w-full p-4 rounded-xl">
              <p>Subject: <strong className="text-slate-900">Data Structures</strong></p>
              <p>Time: <strong className="text-slate-900">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></p>
              <p>Status: <strong className="text-green-600">Present</strong></p>
            </div>
            <button onClick={() => setStatus('idle')} className="mt-6 text-brand-600 font-medium hover:text-brand-700">Scan another</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="aspect-square bg-slate-900 rounded-2xl relative flex items-center justify-center overflow-hidden group">
              {status === 'scanning' && (
                <div className="absolute inset-0 bg-brand-500/20 z-10 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Scanner Frame */}
              <div className="absolute inset-8 border-2 border-dashed border-white/50 rounded-xl z-0"></div>
              
              <Camera size={48} className="text-slate-600 group-hover:text-slate-500 transition-colors" />
            </div>
            <button 
              onClick={handleDemoScan}
              disabled={status === 'scanning'}
              className="w-full py-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex justify-center items-center gap-2"
            >
              <QrScannerIcon />
              Use Demo QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const QrScannerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="7" y="7" width="3" height="3"></rect>
    <rect x="14" y="7" width="3" height="3"></rect>
    <rect x="7" y="14" width="3" height="3"></rect>
    <rect x="14" y="14" width="3" height="3"></rect>
  </svg>
)

export default Scan;
`,
  'pages/student/Attendance.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>
        <p className="text-slate-500 mt-1">View your past attendance records.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500">
            <option>All Subjects</option>
            {user?.subjects.map(s => <option key={s.code}>{s.name}</option>)}
          </select>
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-500">
            <option>All Statuses</option>
            <option>Present</option>
            <option>Absent</option>
          </select>
        </div>
        <div className="overflow-x-auto">
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
              {user?.attendanceHistory.map((record, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900">{record.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {record.subject}
                    <span className="block text-xs text-slate-500 font-normal">{record.class}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.time}</td>
                  <td className="px-6 py-4">
                    <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' :
                      record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }\`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Attendance;
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('Student pages written.');
