import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { QrCode, TrendingUp, TrendingDown, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import studentService from '../../services/studentService';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, reportRes] = await Promise.all([
          studentService.getDashboard(),
          studentService.getReports()
        ]);
        if (dashRes.success) setData(dashRes.data);
        if (reportRes.success && reportRes.data.monthly) setChartData(reportRes.data.monthly);
      } catch (error) {
        console.error('Failed to fetch dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  
  if (!user || loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!data) return <div className="p-8 text-center text-slate-500">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-950 tracking-tight">Good Morning, {user.name?.split(' ')[0]} 👋</h1>
          <p className="text-indigo-500 mt-2 font-medium text-lg">Here's your attendance overview for today.</p>
        </div>
        <Link to="/student/scan" className="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/30 flex items-center gap-3 transition-all hover:-translate-y-1">
          <QrCode size={22} />
          Scan QR
        </Link>
      </div>

      {/* Warning Card */}
      {data.warnings && data.warnings.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200/50 p-6 rounded-3xl flex gap-5 items-start relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-amber-600" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-900 text-lg">Attendance Warning</h3>
            <p className="text-amber-800/80 mt-1 font-medium leading-relaxed">
              Your attendance in <strong className="text-amber-900 bg-amber-200/30 px-2 py-0.5 rounded-md">{data.warnings[0].name}</strong> is {data.warnings[0].attendance}%, below the required 75%.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Overall Attendance" value={`${data.overallAttendance}%`} icon={TrendingUp} color="brand" />
        <KpiCard title="Total Present" value={data.present} icon={BookOpen} color="green" />
        <KpiCard title="Total Absent" value={data.absent} icon={TrendingDown} color="rose" />
        <KpiCard title="Total Classes" value={data.totalClasses} icon={Clock} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-indigo-100/60 p-8 rounded-3xl border border-indigo-200 shadow-sm shadow-indigo-200/50 relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 p-40 bg-brand-50 rounded-full blur-[80px] -z-10 group-hover:bg-brand-100 transition-colors duration-1000"></div>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-indigo-950">Monthly Trend</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c7d2fe" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6366f1', fontSize: 13, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6366f1', fontSize: 13, fontWeight: 600}} dx={-15} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: '1px solid #e0e7ff', backgroundColor: '#eef2ff', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 20px', fontWeight: 'bold' }} 
                  itemStyle={{color: '#312e81', fontWeight: '800'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#14b8a6" 
                  strokeWidth={5} 
                  dot={{r: 6, fill: '#eef2ff', strokeWidth: 3, stroke: '#14b8a6'}} 
                  activeDot={{r: 9, strokeWidth: 0, fill: '#0d9488'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subjects list */}
        <div className="bg-indigo-100/60 p-8 rounded-3xl border border-indigo-200 shadow-sm shadow-indigo-200/50 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-indigo-950">Subjects</h3>
            <Link to="/student/subjects" className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-lg transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-7 flex-1">
            {data.subjects?.slice(0, 4).map((sub, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-indigo-800 text-sm group-hover:text-brand-600 transition-colors">{sub.name}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                    sub.attendance >= 75 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>{sub.attendance}%</span>
                </div>
                <div className="w-full h-2.5 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${sub.attendance >= 75 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-rose-400 to-rose-500'}`} 
                    style={{ width: `${sub.attendance}%` }}
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

const KpiCard = ({ title, value, icon: Icon, color }) => {
  const colorMap = {
    brand: 'bg-brand-100 text-brand-700 border-brand-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    indigo: 'bg-indigo-200 text-indigo-700 border-indigo-300',
  };
  
  return (
    <div className="bg-indigo-100/60 p-7 rounded-3xl border border-indigo-200 shadow-sm shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/30 hover:-translate-y-1.5 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colorMap[color]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
      <h4 className="text-4xl font-black text-indigo-950 tracking-tight">{value}</h4>
      <p className="text-sm font-bold text-indigo-500 mt-2 uppercase tracking-widest">{title}</p>
    </div>
  );
};

export default Dashboard;
