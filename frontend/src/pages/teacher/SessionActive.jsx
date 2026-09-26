import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { QrCode, XCircle, RefreshCw, Users, CheckCircle } from 'lucide-react';
import teacherService from '../../services/teacherService';

const SessionActive = () => {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const location = useLocation();

  // Session data may have been passed via navigation state
  const [session, setSession] = useState(location.state?.session || null);
  const [qrData, setQrData] = useState(location.state?.qrData || null);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, scans: [] });
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(!location.state?.session);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await teacherService.getSession(sessionId);
      if (res.success) {
        const d = res.data;
        setSession(d);
        setStats({
          present: d.present || 0,
          absent: d.absent || 0,
          total: d.total || d.totalStudents || 0,
          scans: d.recentAttendance || [],
        });
        const remaining = Math.max(0, Math.floor((new Date(d.expiryTime) - new Date()) / 1000));
        setTimeLeft(remaining);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Initial load
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll session stats every 10s
  useEffect(() => {
    const poll = setInterval(() => fetchSession(), 10000);
    return () => clearInterval(poll);
  }, [fetchSession]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndSession = async () => {
    if (!window.confirm('Are you sure you want to end this session?')) return;
    setEnding(true);
    try {
      await teacherService.endSession(sessionId);
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end session');
      setEnding(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">{error}</div>
  );

  const isExpired = session?.status === 'expired' || session?.status === 'ended' || timeLeft === 0;
  const attendancePct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* QR Code Section */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-2">
            {isExpired ? (
              <><div className="w-2.5 h-2.5 rounded-full bg-slate-400" /><span className="font-bold text-slate-500 tracking-wider">ENDED</span></>
            ) : (
              <><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /><span className="font-bold text-red-500 tracking-wider">LIVE</span></>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {session?.subject || session?.subjectId?.name} — {session?.class || session?.classId?.name}
          </h2>
          <p className={`font-mono text-lg mb-8 ${isExpired ? 'text-slate-400' : 'text-slate-500'}`}>
            {isExpired ? 'Session ended' : `${formatTime(timeLeft)} remaining`}
          </p>
          
          <div className="bg-white p-4 border-2 border-slate-100 rounded-2xl shadow-sm mb-8">
            {qrData ? (
              <img src={qrData} alt="Session QR Code" className="w-64 h-64 rounded-xl" />
            ) : (
              <div className="w-64 h-64 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <QrCode size={100} />
              </div>
            )}
          </div>
          
          <p className="text-sm text-slate-500 mb-8">Students can scan this QR to mark attendance.</p>
          
          <div className="flex gap-4 w-full">
            <button
              onClick={fetchSession}
              className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button
              onClick={handleEndSession}
              disabled={ending || isExpired}
              className="flex-1 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {ending ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" /> : <XCircle size={18} />}
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Live Feed Section */}
      <div className="w-full md:w-80 space-y-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Live Statistics</h3>
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-slate-600">Present: <strong className="text-green-600">{stats.present}</strong></span>
            <span className="text-slate-600">Absent: <strong className="text-slate-900">{stats.absent || (stats.total - stats.present)}</strong></span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${attendancePct}%` }}
            />
          </div>
          <p className="text-xs text-right text-slate-500">Total: {stats.total} Students ({attendancePct}%)</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-h-96 overflow-y-auto">
          <h3 className="font-bold text-slate-900 mb-4">Recent Scans</h3>
          {stats.scans.length > 0 ? (
            <div className="space-y-4">
              {stats.scans.map((scan, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center text-xs">
                      {(scan.name || scan.studentName || 'S').charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-900">{scan.studentName || scan.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    <CheckCircle size={12} className="inline mr-1" />Present
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Users size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Waiting for students to scan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SessionActive;
