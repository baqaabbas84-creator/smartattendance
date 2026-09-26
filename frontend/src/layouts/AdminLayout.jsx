import React from 'react';
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
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e293b] text-slate-300 flex flex-col hidden md:flex shadow-2xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-[#0f172a]">
          <div className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Settings size={22} />
            </div>
            SmartAttendance
          </div>
        </div>
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Management</p>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      active 
                        ? 'bg-slate-800 text-brand-400 font-medium shadow-md border border-slate-700/50' 
                        : 'hover:bg-slate-800/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <item.icon size={20} className={active ? 'text-brand-400' : 'text-slate-400'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-slate-700/50 bg-[#0f172a]/50">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-200/80 to-slate-100 z-0"></div>

        {/* Top Navbar */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-white/40 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center w-96">
            <div className="relative w-full hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students, classes or teachers..." 
                className="w-full pl-12 pr-4 py-2.5 bg-white/80 border border-slate-200/80 rounded-full text-sm focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all outline-none shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors bg-white rounded-full shadow-sm border border-slate-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-300/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs font-medium text-brand-600 uppercase tracking-wide">{user?.role}</p>
              </div>
              <div className="relative">
                <img src={user?.avatar} alt={user?.name} className="w-11 h-11 rounded-full border-2 border-white shadow-md" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        {[navItems[0], navItems[1], navItems[5], navItems[6], navItems[7]].map(item => (
          <Link key={item.name} to={item.path} className={`flex flex-col items-center p-2 ${location.pathname === item.path ? 'text-brand-400' : 'text-slate-400'}`}>
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default AdminLayout;
