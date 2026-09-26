const fs = require('fs');
const path = require('path');

const files = {
  'pages/student/Subjects.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Subjects = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Subjects</h1>
        <p className="text-slate-500 mt-1">Detailed attendance per subject.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.subjects.map(sub => (
          <div key={sub.code} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{sub.name}</h3>
                <p className="text-sm text-slate-500">{sub.code}</p>
              </div>
              <span className={\`text-sm font-bold px-2 py-1 rounded-md \${
                sub.attendance >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }\`}>{sub.attendance}%</span>
            </div>
            <p className="text-sm text-slate-600 mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs">👨‍🏫</span>
              {sub.teacher}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Classes Attended</span>
                <span className="font-medium text-slate-700">{sub.present} / {sub.total}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={\`h-full rounded-full \${sub.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}\`} 
                  style={{ width: \`\${sub.attendance}%\` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Subjects;
`,
  'pages/student/Reports.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { user } = useAuth();
  
  const handleExport = () => {
    alert("Export feature will download a PDF/CSV in production.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 mt-1">Detailed breakdown of your attendance.</p>
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Attendance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={user?.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Subject Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={user?.subjects} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{fontSize: '12px'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="attendance" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;
`,
  'pages/student/Profile.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img src={user?.avatar} alt={user?.name} className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-md" />
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-brand-600 font-medium capitalize">{user?.role}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="font-medium text-slate-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Roll Number</p>
              <p className="font-medium text-slate-900">{user?.rollNumber || user?.employeeId || 'N/A'}</p>
            </div>
            {user?.branch && (
              <div>
                <p className="text-sm text-slate-500">Branch</p>
                <p className="font-medium text-slate-900">{user?.branch}</p>
              </div>
            )}
            {user?.section && (
              <div>
                <p className="text-sm text-slate-500">Section</p>
                <p className="font-medium text-slate-900">{user?.section}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
`,
  'pages/teacher/Dashboard.jsx': `import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Clock, TrendingUp } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  if(!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name} 👋</h1>
          <p className="text-slate-500 mt-1">Manage your classes and attendance sessions.</p>
        </div>
        <Link to="/teacher/create-session" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/30 transition-all">
          + Create Session
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Subjects" value={user.stats.subjectsCount} icon={BookOpen} color="brand" />
        <StatCard title="Today's Sessions" value={user.stats.todaysSessions} icon={Clock} color="indigo" />
        <StatCard title="Total Students" value={user.stats.studentsCount} icon={Users} color="slate" />
        <StatCard title="Avg Attendance" value={\`\${user.stats.avgAttendance}%\`} icon={TrendingUp} color="green" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6">My Subjects</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.subjects.map(sub => (
            <div key={sub.name} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-slate-900 text-lg mb-1">{sub.name}</h4>
              <p className="text-sm text-slate-500 mb-4">Class: {sub.class}</p>
              <div className="flex justify-between items-center mb-4 text-sm">
                <span className="text-slate-600"><Users size={14} className="inline mr-1"/> {sub.students} Students</span>
                <span className="font-semibold text-brand-600">{sub.avgAttendance}% Avg</span>
              </div>
              <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-green-50 text-green-600',
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

export default TeacherDashboard;
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('More pages written.');
