import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Shield, BarChart3, Users, CheckCircle2, ScanLine, Smartphone, Calendar, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <QrCode size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SmartAttendance</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How it Works</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Log in</Link>
            <Link to="/register" className="text-sm font-medium bg-brand-600 text-white px-5 py-2.5 rounded-xl shadow-sm shadow-brand-500/20 hover:bg-brand-700 transition-all hover:shadow-brand-500/40">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-400/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-indigo-400/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            The Future of College Administration
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Attendance management made <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">smarter</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Experience lightning-fast QR code tracking, real-time analytics, and role-based dashboards built for modern educational institutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 text-white font-medium rounded-xl shadow-xl shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2">
              Get Started <TrendingUp size={20} />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 font-medium rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-lg">
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-24 relative mx-auto max-w-5xl z-20 perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform md:-rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
            {/* Window Controls Header */}
            <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50/80 backdrop-blur">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 flex-1 flex justify-center">
                <div className="bg-white/60 text-slate-400 text-xs px-4 py-1 rounded-md border border-slate-200/50 flex items-center gap-2">
                  <Shield size={12} /> app.smartattendance.com
                </div>
              </div>
            </div>
            
            {/* Mock Dashboard Content */}
            <div className="flex bg-slate-50 min-h-[400px]">
              {/* Mock Sidebar */}
              <div className="hidden md:flex flex-col w-48 border-r border-slate-200 bg-white p-4 space-y-4">
                <div className="flex items-center gap-2 text-brand-600 font-bold mb-4">
                  <QrCode size={18} /> <span className="text-sm">SmartAttendance</span>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-brand-50 rounded-lg flex items-center px-3 text-brand-700 text-xs font-medium gap-2"><BarChart3 size={14}/> Dashboard</div>
                  <div className="h-8 hover:bg-slate-50 rounded-lg flex items-center px-3 text-slate-500 text-xs gap-2"><ScanLine size={14}/> Scan QR</div>
                  <div className="h-8 hover:bg-slate-50 rounded-lg flex items-center px-3 text-slate-500 text-xs gap-2"><Calendar size={14}/> History</div>
                  <div className="h-8 hover:bg-slate-50 rounded-lg flex items-center px-3 text-slate-500 text-xs gap-2"><Users size={14}/> Subjects</div>
                </div>
              </div>
              
              {/* Mock Main Area */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Good Morning, Rahul 👋</h2>
                    <p className="text-xs text-slate-500 mt-1">Here is your attendance overview for today.</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold">R</div>
                </div>

                {/* Mock Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Overall Attendance</p>
                    <div className="flex items-end gap-2">
                      <h3 className="text-2xl font-bold text-slate-800">85%</h3>
                      <span className="text-xs text-green-500 mb-1 font-medium flex items-center"><TrendingUp size={12} className="mr-0.5"/> +2%</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Classes Attended</p>
                    <h3 className="text-2xl font-bold text-slate-800">42 <span className="text-sm font-normal text-slate-400">/ 50</span></h3>
                  </div>
                  <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-4 rounded-xl shadow-sm text-white flex flex-col justify-center items-start">
                    <ScanLine size={20} className="mb-2 text-brand-100" />
                    <p className="text-xs font-medium">Mark Today's Attendance</p>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-slate-800">Subject Breakdown</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded">This Month</span>
                  </div>
                  <div className="space-y-3">
                    {/* Subject Row */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Data Structures</span>
                        <span className="text-green-600 font-bold">88%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[88%] h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Subject Row */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Database Management</span>
                        <span className="text-brand-600 font-bold">79%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[79%] h-full bg-brand-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Subject Row */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Computer Networks</span>
                        <span className="text-amber-500 font-bold">65%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[65%] h-full bg-amber-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Mock Dashboard */}

          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-sm font-bold text-brand-600 tracking-wide uppercase mb-2">Features</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Everything you need for seamless management</h3>
            <p className="text-lg text-slate-600">A complete ecosystem designed to eliminate proxy attendance and save time for educators.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Smartphone} 
              title="Smart QR Scanning" 
              desc="Time-limited dynamic QR codes generated by teachers. Students scan directly from their mobile devices to mark attendance instantly." 
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Real-Time Analytics" 
              desc="Beautiful, actionable insights. Track trends, identify low-attendance students, and generate automated monthly reports in one click." 
            />
            <FeatureCard 
              icon={Users} 
              title="Role-Based Dashboards" 
              desc="Tailored interfaces for Students, Teachers, and Administrators ensuring everyone has exactly the tools they need." 
            />
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Four simple steps to secure, verified attendance.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 -z-10"></div>
            
            <StepCard number="1" title="Teacher Creates Session" desc="Select subject, duration and instantly generate a live QR code." />
            <StepCard number="2" title="Display QR Code" desc="Project the QR code on screen. It updates dynamically to prevent sharing." />
            <StepCard number="3" title="Student Scans" desc="Students use their dashboard scanner to read the active QR code." />
            <StepCard number="4" title="Attendance Verified" desc="System verifies enrollment, location and marks them present instantly." />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <QrCode size={24} className="text-brand-500" />
              <span className="text-xl font-bold tracking-tight">SmartAttendance</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center text-slate-500 text-sm">
            © 2026 SmartAttendance Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all group">
    <div className="w-14 h-14 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="flex flex-col items-center text-center relative z-10">
    <div className="w-16 h-16 rounded-full bg-white border-4 border-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600 mb-6 shadow-lg shadow-brand-500/10">
      {number}
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-slate-600 text-sm">{desc}</p>
  </div>
);

export default Landing;
