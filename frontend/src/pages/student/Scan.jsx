import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle, XCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import attendanceService from '../../services/attendanceService';

const Scan = () => {
  const [status, setStatus] = useState('idle'); // idle, scanning, success, error
  const [message, setMessage] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (status === 'scanning') {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current = scanner;

      scanner.render(
        async (decodedText) => {
          // Pause scanning on successful read
          scanner.pause(true);
          await handleScan(decodedText);
          scanner.clear(); // Stop completely once processed
        },
        (error) => {
          // Ignore frequent scan errors when no QR is found
        }
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error(e));
        }
      };
    }
  }, [status]);

  const handleScan = async (qrData) => {
    try {
      // Parse QR data (Assuming it's JSON or format: sessionId|token)
      let sessionId, token;
      try {
        const parsed = JSON.parse(qrData);
        sessionId = parsed.sessionId;
        token = parsed.token;
      } catch (e) {
        // Fallback for custom formats
        const parts = qrData.split('|');
        sessionId = parts[0];
        token = parts[1];
      }

      if (!sessionId || !token) {
        setStatus('error');
        setMessage('Invalid QR Code Format');
        return;
      }

      if (!navigator.geolocation) {
        setStatus('error');
        setMessage('Geolocation is not supported by your browser. Cannot mark attendance.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await attendanceService.markAttendance(sessionId, token, latitude, longitude);
            if (res.success) {
              setStatus('success');
              setAttendanceData(res.attendance);
            } else {
              setStatus('error');
              setMessage(res.message);
            }
          } catch (err) {
            setStatus('error');
            setMessage('Something went wrong');
          }
        },
        (error) => {
          setStatus('error');
          let errorMsg = 'Failed to get your location.';
          if (error.code === 1) errorMsg = 'Location access denied. Please enable GPS and allow location access.';
          if (error.code === 2) errorMsg = 'Location unavailable. Ensure your GPS is active.';
          if (error.code === 3) errorMsg = 'Location request timed out.';
          setMessage(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

    } catch (err) {
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Scan Attendance QR</h1>
        <p className="text-slate-500 mt-1">Position the QR code inside the frame to mark your attendance.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {status === 'success' && attendanceData ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Attendance Marked</h2>
            <div className="space-y-1 text-slate-600 bg-slate-50 w-full p-4 rounded-xl">
              <p>Subject: <strong className="text-slate-900">{attendanceData.subject || 'Unknown'}</strong></p>
              <p>Time: <strong className="text-slate-900">{new Date(attendanceData.markedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></p>
              <p>Status: <strong className="text-green-600">{attendanceData.status}</strong></p>
            </div>
            <button onClick={() => setStatus('idle')} className="mt-6 text-brand-600 font-medium hover:text-brand-700">Scan another</button>
          </div>
        ) : status === 'error' ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Scan Failed</h2>
            <p className="text-slate-600 bg-slate-50 w-full p-4 rounded-xl font-medium">{message}</p>
            <button onClick={() => setStatus('idle')} className="mt-6 text-brand-600 font-medium hover:text-brand-700">Try Again</button>
          </div>
        ) : status === 'scanning' ? (
          <div className="space-y-6">
            <div id="qr-reader" className="w-full rounded-2xl overflow-hidden border-2 border-slate-200"></div>
            <button 
              onClick={() => {
                if (scannerRef.current) scannerRef.current.clear();
                setStatus('idle');
              }}
              className="w-full py-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all flex justify-center items-center gap-2"
            >
              Cancel Scanning
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="aspect-square bg-slate-900 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden group cursor-pointer hover:bg-slate-800 transition-colors"
                 onClick={() => setStatus('scanning')}>
              <Camera size={48} className="text-slate-500 mb-4 group-hover:text-white transition-colors" />
              <p className="text-slate-400 group-hover:text-white font-medium">Tap to start camera</p>
            </div>
            
            <button 
              onClick={() => setStatus('scanning')}
              className="w-full py-4 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 flex justify-center items-center gap-2"
            >
              <Camera size={20} />
              Start Scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
