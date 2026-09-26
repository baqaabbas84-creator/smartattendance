const fs = require('fs');
const path = require('path');

const files = {
  'pages/teacher/CreateSession.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateSession = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/teacher/session/demo-123');
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Create Attendance Session</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none">
                <option>Data Structures</option>
                <option>Database Management System</option>
                <option>Operating Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Class / Section</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none">
                <option>CS2G</option>
                <option>CS3A</option>
                <option>CS3B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
              <input type="date" defaultValue="2026-09-24" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
              <input type="time" defaultValue="10:00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (minutes)</label>
              <input type="number" defaultValue="5" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" />
            </div>
          </div>
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Generate QR Code'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateSession;
`,
  'pages/teacher/SessionActive.jsx': `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SessionActive = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return \`\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* QR Code Section */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="font-bold text-red-500 tracking-wider">LIVE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Data Structures — CS2G</h2>
          <p className="text-slate-500 mb-8 font-mono text-lg">{formatTime(timeLeft)} remaining</p>
          
          <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl shadow-sm mb-8">
            {/* Mock QR */}
            <div className="w-64 h-64 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <QrCode size={100} />
            </div>
          </div>
          
          <p className="text-sm text-slate-500 mb-8">Students can scan this QR to mark attendance.</p>
          
          <div className="flex gap-4 w-full">
            <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
              <RefreshCw size={18} /> Refresh QR
            </button>
            <button onClick={() => navigate('/teacher/dashboard')} className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2">
              <XCircle size={18} /> End Session
            </button>
          </div>
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="w-full md:w-80 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Live Statistics</h3>
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-slate-600">Present: <strong className="text-green-600">47</strong></span>
            <span className="text-slate-600">Absent: <strong className="text-slate-900">3</strong></span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }}></div>
          </div>
          <p className="text-xs text-right text-slate-500">Total: 50 Students</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96 overflow-y-auto">
          <h3 className="font-bold text-slate-900 mb-4">Recent Scans</h3>
          <div className="space-y-4">
            {['Baqa Abbas', 'Rahul', 'Neha', 'Arjun', 'Simran'].map((name, i) => (
              <div key={i} className="flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center text-xs">
                    {name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{name}</span>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">Present</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SessionActive;
`,
  'pages/admin/Dashboard.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, Layers, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  const pieData = [
    { name: 'Present', value: 88.5, color: '#10b981' },
    { name: 'Absent', value: 11.5, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <AdminStat title="Students" value={user?.stats.students} icon={GraduationCap} />
        <AdminStat title="Teachers" value={user?.stats.teachers} icon={Users} />
        <AdminStat title="Subjects" value={user?.stats.subjects} icon={BookOpen} />
        <AdminStat title="Classes" value={user?.stats.classes} icon={Layers} />
        <AdminStat title="Attendance" value={\`\${user?.stats.todayAttendance}%\`} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Today's Attendance</h3>
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-2xl font-bold text-slate-900">88.5%</span>
              <span className="text-xs text-slate-500">Present</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {user?.recentActivity.map(act => (
              <div key={act.id} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-500 shrink-0"></div>
                <div>
                  <p className="text-sm text-slate-900">{act.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminStat = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-slate-50 rounded-lg">
        <Icon size={20} className="text-slate-600" />
      </div>
    </div>
    <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    <p className="text-xs font-medium text-slate-500 mt-1">{title}</p>
  </div>
);

export default AdminDashboard;
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('Teacher and Admin pages written.');
