const fs = require('fs');
const path = require('path');

const files = {
  'layouts/StudentLayout.jsx': `import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, QrCode, ClipboardList, BookOpen, BarChart3, User, LogOut, Bell, Search } from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Scan Attendance', path: '/student/scan', icon: QrCode },
    { name: 'Attendance', path: '/student/attendance', icon: ClipboardList },
    { name: 'Subjects', path: '/student/subjects', icon: BookOpen },
    { name: 'Reports', path: '/student/reports', icon: BarChart3 },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="text-xl font-bold text-brand-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <QrCode size={20} />
            </div>
            SmartAttend
          </div>
        </div>
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${
                      active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                    }\`}
                  >
                    <item.icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center w-96">
            <div className="relative w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[5]].map(item => (
          <Link key={item.name} to={item.path} className={\`flex flex-col items-center p-2 \${location.pathname === item.path ? 'text-brand-600' : 'text-slate-400'}\`}>
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default StudentLayout;
`,
  'layouts/TeacherLayout.jsx': `import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, PlusCircle, ClipboardList, BarChart3, User, LogOut, Bell, Search } from 'lucide-react';

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'My Classes', path: '/teacher/classes', icon: Users },
    { name: 'Create Session', path: '/teacher/create-session', icon: PlusCircle },
    { name: 'Attendance', path: '/teacher/attendance', icon: ClipboardList },
    { name: 'Reports', path: '/teacher/reports', icon: BarChart3 },
    { name: 'Profile', path: '/teacher/profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="text-xl font-bold text-brand-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Users size={20} />
            </div>
            SmartAttend
          </div>
        </div>
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${
                      active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                    }\`}
                  >
                    <item.icon size={20} className={active ? 'text-brand-600' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-slate-200">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center w-96">
            <div className="relative w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]].map(item => (
          <Link key={item.name} to={item.path} className={\`flex flex-col items-center p-2 \${location.pathname === item.path ? 'text-brand-600' : 'text-slate-400'}\`}>
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default TeacherLayout;
`,
  'layouts/AdminLayout.jsx': `import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, Layers, ClipboardList, BarChart3, Settings, LogOut, Bell, Search, GraduationCap } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Teachers', path: '/admin/teachers', icon: Users },
    { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
    { name: 'Classes', path: '/admin/classes', icon: Layers },
    { name: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Profile', path: '/admin/profile', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center">
              <Settings size={20} />
            </div>
            SmartAttend Admin
          </div>
        </div>
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={\`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors \${
                      active ? 'bg-brand-600 text-white font-medium shadow-md' : 'hover:bg-slate-800 hover:text-white'
                    }\`}
                  >
                    <item.icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-lg transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center w-96">
            <div className="relative w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <img src={user?.avatar} alt={user?.name} className="w-9 h-9 rounded-full border border-slate-200" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        {[navItems[0], navItems[1], navItems[5], navItems[6], navItems[7]].map(item => (
          <Link key={item.name} to={item.path} className={\`flex flex-col items-center p-2 \${location.pathname === item.path ? 'text-brand-400' : 'text-slate-400'}\`}>
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AdminLayout;
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('Layouts written.');
