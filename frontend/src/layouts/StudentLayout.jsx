import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, QrCode, ClipboardList, BookOpen, BarChart3, User, LogOut, Bell, Search, X, ChevronRight } from 'lucide-react';

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Scan Attendance', path: '/student/scan', icon: QrCode },
    { name: 'Attendance', path: '/student/attendance', icon: ClipboardList },
    { name: 'Subjects', path: '/student/subjects', icon: BookOpen },
    { name: 'Reports', path: '/student/reports', icon: BarChart3 },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  React.useEffect(() => {
    // We fetch notifications when the layout mounts
    import('../services/studentService').then(module => {
      module.default.getNotifications().then(res => {
        if (res.success) {
          setNotifications(res.data);
          setUnreadCount(res.unreadCount);
        }
      }).catch(err => console.error("Failed to fetch notifications", err));
    });
  }, []);

  const searchData = [
    { type: 'Action', title: 'Scan QR Code', link: '/student/scan' },
    { type: 'Page', title: 'My Subjects', link: '/student/subjects' },
    { type: 'Page', title: 'View Reports', link: '/student/reports' },
    { type: 'Setting', title: 'Edit Profile', link: '/student/profile' },
  ];

  const filteredResults = searchData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-screen bg-indigo-50 text-indigo-950 font-sans">
      {/* Sidebar - Soft Indigo Theme */}
      <aside className="w-72 bg-indigo-100 flex flex-col hidden md:flex border-r border-indigo-200 z-20 shadow-xl shadow-indigo-200/50">
        <div className="h-20 flex items-center px-6 border-b border-indigo-200">
          <div className="text-xl font-extrabold text-indigo-950 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <QrCode size={22} />
            </div>
            SmartAttendance
          </div>
        </div>
        <div className="flex-1 py-8 px-4 overflow-y-auto">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 px-3">Student Menu</p>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      active 
                        ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20' 
                        : 'hover:bg-indigo-200/70 text-indigo-700 hover:text-indigo-950 font-medium border border-transparent'
                    }`}
                  >
                    <item.icon size={20} className={active ? 'text-white' : 'text-indigo-500'} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-6 border-t border-indigo-200">
          <button onClick={logout} className="flex items-center justify-between w-full px-4 py-3 text-indigo-600 hover:bg-rose-100 hover:text-rose-600 rounded-2xl transition-colors font-medium group">
            <div className="flex items-center gap-3">
              <LogOut size={20} className="group-hover:text-rose-500" />
              <span>Log out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-indigo-100/80 backdrop-blur-xl border-b border-indigo-200 flex items-center justify-between px-8 z-40 sticky top-0 shadow-sm shadow-indigo-200/30">
          <div className="flex items-center w-full max-w-lg relative">
            <div className="relative w-full hidden md:block group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-brand-600' : 'text-indigo-400 group-hover:text-indigo-600'}`} size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
                placeholder="Search subjects, reports, or scan..." 
                className="w-full pl-12 pr-10 py-3 bg-indigo-50/80 border border-indigo-200 rounded-2xl text-sm text-indigo-950 focus:bg-indigo-50 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all outline-none placeholder-indigo-400 shadow-inner shadow-indigo-100/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 bg-indigo-200 rounded-full p-1 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Functional Search Dropdown */}
            {isSearching && searchQuery.length > 0 && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSearching(false)}></div>
                <div className="absolute top-16 left-0 w-full bg-indigo-50 border border-indigo-200 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-2">
                  <div className="px-3 py-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">Search Results</div>
                  {filteredResults.length > 0 ? (
                    filteredResults.map((res, i) => (
                      <Link 
                        key={i} 
                        to={res.link} 
                        onClick={() => {
                          setIsSearching(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-indigo-100 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-brand-600">
                            <Search size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-indigo-900 group-hover:text-brand-700 transition-colors">{res.title}</p>
                            <p className="text-xs text-indigo-500 font-medium">{res.type}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-indigo-300 group-hover:text-brand-500 transition-colors" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 mb-3">
                        <Search size={20} />
                      </div>
                      <p className="text-indigo-900 font-bold">No results found</p>
                      <p className="text-indigo-500 text-sm mt-1">Try searching for "scan" or "reports"</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-5">
            {/* Notification System */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 transition-all rounded-xl border ${showNotifications ? 'bg-brand-100 text-brand-600 border-brand-200' : 'bg-indigo-50 text-indigo-500 hover:bg-indigo-200 hover:text-indigo-800 border-indigo-200 shadow-sm'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-indigo-50"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-4 w-[360px] bg-indigo-50 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-indigo-200 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="px-6 py-4 border-b border-indigo-100 flex justify-between items-center bg-indigo-100/50">
                      <h3 className="font-extrabold text-indigo-950 text-lg">Notifications</h3>
                      <span className="text-xs bg-brand-100 text-brand-700 px-3 py-1 rounded-full font-bold border border-brand-200">{unreadCount > 0 ? `${unreadCount} New` : '0 New'}</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2">
                      {notifications.map((n, i) => (
                        <div key={n.id} className="p-4 rounded-2xl hover:bg-indigo-100 transition-colors cursor-pointer flex gap-4">
                          <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${i === 0 ? 'bg-amber-500' : 'bg-brand-500'}`}></div>
                          <div>
                            <p className="text-sm text-indigo-900 font-semibold mb-1 leading-snug">{n.message || n.text}</p>
                            <p className="text-xs text-indigo-500 font-medium">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-indigo-100/50 border-t border-indigo-200 text-center">
                      <button className="text-sm font-bold text-brand-600 hover:text-brand-700 py-1 px-4 rounded-lg hover:bg-brand-50 transition-colors">Mark all as read</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 pl-5 border-l border-indigo-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-indigo-950">{user?.name}</p>
                <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mt-0.5">{user?.role}</p>
              </div>
              <img src={user?.avatar} alt={user?.name} className="w-11 h-11 rounded-full border-2 border-indigo-100 shadow-md ring-1 ring-indigo-200 object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-indigo-100 border-t border-indigo-200 flex justify-around p-2 z-50 pb-safe">
        {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[5]].map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path} className={`flex flex-col items-center p-2.5 rounded-xl ${active ? 'text-brand-700 bg-brand-100' : 'text-indigo-500'}`}>
              <item.icon size={22} className={active ? 'fill-brand-200' : ''} />
              <span className="text-[10px] mt-1 font-bold">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  );
};

export default StudentLayout;
