import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, PlusCircle, ClipboardList, BarChart3, User, LogOut, Bell, Search, BookOpen, X } from 'lucide-react';

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Build search results from user data
  const getSearchResults = (query) => {
    if (!query.trim() || !user) return [];
    const q = query.toLowerCase();
    const results = [];

    // Search subjects
    (user.subjects || []).forEach((sub) => {
      if (sub.name.toLowerCase().includes(q) || sub.class.toLowerCase().includes(q)) {
        results.push({ type: 'subject', label: sub.name, sub: `Class: ${sub.class}`, icon: 'book', data: sub });
      }
    });

    // Search students
    (user.studentsList || []).forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.roll.includes(q)) {
        results.push({ type: 'student', label: s.name, sub: `Roll: ${s.roll} | ${s.attendance}% attendance`, icon: 'user', data: s });
      }
    });

    return results.slice(0, 6);
  };

  const searchResults = getSearchResults(searchQuery);

  const navItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'My Classes', path: '/teacher/classes', icon: Users },
    { name: 'Create Session', path: '/teacher/create-session', icon: PlusCircle },
    { name: 'Attendance', path: '/teacher/attendance', icon: ClipboardList },
    { name: 'Reports', path: '/teacher/reports', icon: BarChart3 },
    { name: 'Profile', path: '/teacher/profile', icon: User },
  ];

  const notifications = [
    { id: 1, text: 'DSA Session Summary: 47 Present, 3 Absent', time: '1 hour ago' },
    { id: 2, text: 'New student enrolled in Database Management', time: '5 hours ago' }
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#1e293b] text-slate-300 flex flex-col hidden md:flex shadow-2xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-700/50 bg-[#0f172a]">
          <div className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Users size={22} />
            </div>
            SmartAttendance
          </div>
        </div>
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Teacher Menu</p>
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
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-200/80 to-slate-100 z-0 pointer-events-none"></div>

        {/* Top Navbar */}
        <header className="h-20 bg-white/60 backdrop-blur-md border-b border-white/40 flex items-center justify-between px-8 z-20 sticky top-0">
          <div className="flex items-center w-96">
            <div className="relative w-full hidden md:block" ref={searchRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              <input
                type="text"
                placeholder="Search classes or students..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                className="w-full pl-12 pr-10 py-2.5 bg-white/80 border border-slate-200/80 rounded-full text-sm focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowResults(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
              {/* Results dropdown */}
              {showResults && searchQuery && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-5 text-sm text-slate-400 text-center">
                      No results found for &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 pt-3 pb-1">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </p>
                      {searchResults.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchQuery('');
                            setShowResults(false);
                            if (r.type === 'subject') {
                              navigate('/teacher/classes', { state: { subject: r.data } });
                            } else {
                              navigate('/teacher/classes');
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            r.type === 'subject' ? 'bg-brand-50' : 'bg-indigo-50'
                          }`}>
                            {r.type === 'subject'
                              ? <BookOpen size={16} className="text-brand-600" />
                              : <User size={16} className="text-indigo-600" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{r.label}</p>
                            <p className="text-xs text-slate-400 truncate">{r.sub}</p>
                          </div>
                          <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            r.type === 'subject' ? 'bg-brand-100 text-brand-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {r.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors rounded-full shadow-sm border ${showNotifications ? 'bg-brand-50 text-brand-600 border-brand-200' : 'bg-white text-slate-500 hover:text-slate-800 border-slate-100'}`}
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-semibold">2 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="text-sm text-slate-800 font-medium mb-1 leading-snug">{n.text}</p>
                        <p className="text-xs text-slate-400">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]].map(item => (
          <Link key={item.name} to={item.path} className={`flex flex-col items-center p-2 ${location.pathname === item.path ? 'text-brand-400' : 'text-slate-400'}`}>
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default TeacherLayout;
