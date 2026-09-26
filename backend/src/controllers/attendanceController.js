const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const { markStudentAttendance, getSessionStats } = require('../services/attendanceService');

// Calculate distance between two coordinates in meters (Haversine formula)
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const toRad = (angle) => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ─── Mark Attendance (Student scans QR) ──────────────────────────────────────
const markAttendance = async (req, res, next) => {
  try {
    const { sessionId, token, latitude, longitude } = req.body;

    // 1. Authenticate: must be a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can mark attendance.' });
    }

    // 2. Find session
    const session = await AttendanceSession.findOne({ sessionId })
      .populate('subjectId', 'name code')
      .populate('classId', 'name');
    if (!session) {
      return res.status(404).json({ success: false, message: 'Invalid QR code. Session not found.' });
    }

    // 3. Check session status
    if (session.status === 'ended') {
      return res.status(400).json({ success: false, message: 'This session has ended. Attendance cannot be marked.' });
    }

    // 4. Check QR token expiry
    if (new Date() > new Date(session.expiryTime)) {
      await AttendanceSession.findByIdAndUpdate(session._id, { status: 'expired' });
      return res.status(400).json({ success: false, message: 'QR code has expired. Please ask your teacher to create a new session.' });
    }

    // 5. Verify QR token matches
    if (session.qrToken !== token) {
      return res.status(400).json({ success: false, message: 'Invalid QR code. Token mismatch.' });
    }

    // 5b. Geo-Fencing Check (Campus Location) — only when enabled
    if (process.env.GEOFENCING_ENABLED !== 'false') {
      if (!latitude || !longitude) {
        return res.status(403).json({ success: false, message: 'Location access is required to mark attendance. Please enable GPS.' });
      }
      const COLLEGE_LAT = parseFloat(process.env.COLLEGE_LAT || '28.6139');
      const COLLEGE_LNG = parseFloat(process.env.COLLEGE_LNG || '77.2090');
      const MAX_DISTANCE_METERS = parseInt(process.env.MAX_DISTANCE_METERS || '200', 10);
      
      const distance = getDistanceInMeters(latitude, longitude, COLLEGE_LAT, COLLEGE_LNG);
      if (distance > MAX_DISTANCE_METERS) {
        return res.status(403).json({ 
          success: false, 
          message: `You are too far from the campus to mark attendance. Distance: ${Math.round(distance)}m (Max allowed: ${MAX_DISTANCE_METERS}m).`
        });
      }
    }

    // 6. Get student profile
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // 7. Check student is in the correct class
    if (!student.classId || student.classId.toString() !== session.classId._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this class. Attendance denied.' });
    }

    // 8. Check student is enrolled in the subject
    const subject = await Subject.findById(session.subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found.' });
    }
    // Confirm subject is for student's class
    if (subject.classId.toString() !== student.classId.toString()) {
      return res.status(403).json({ success: false, message: 'You are not enrolled in this subject.' });
    }

    // 9. Check duplicate attendance (database-level unique index also enforces this)
    const existing = await Attendance.findOne({ sessionId: session._id, studentId: student._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Attendance already marked for this session.',
        attendance: {
          subject: session.subjectId?.name,
          status: existing.status,
          markedAt: existing.markedAt,
        },
      });
    }

    // 10. All checks passed — mark attendance
    const ip = req.ip || req.connection?.remoteAddress;
    const attendance = await markStudentAttendance({ studentId: student._id, session, ipAddress: ip });

    return res.status(201).json({
      success: true,
      message: 'Attendance marked successfully! ✅',
      attendance: {
        subject: session.subjectId?.name,
        code: session.subjectId?.code,
        class: session.classId?.name,
        status: attendance.status,
        markedAt: attendance.markedAt,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key (extra safety)
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Attendance already marked for this session.' });
    }
    next(error);
  }
};

// ─── Get Attendance for a Session ─────────────────────────────────────────────
const getSessionAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await AttendanceSession.findOne({ sessionId: id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });

    const stats = await getSessionStats(session._id, session.totalStudents);

    const records = await Attendance.find({ sessionId: session._id })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ markedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        ...stats,
        records: records.map((r) => ({
          name: r.studentId?.userId?.name,
          roll: r.studentId?.rollNumber,
          status: r.status,
          markedAt: r.markedAt,
        })),
      },
    });
  } catch (error) { next(error); }
};

// ─── Get Student's Attendance ─────────────────────────────────────────────────
const getStudentAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, subject, date } = req.query;

    const filter = { studentId: id };
    if (status) filter.status = status;
    if (subject) filter.subjectId = subject;
    if (date) {
      const d = new Date(date); const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const records = await Attendance.find(filter)
      .populate('subjectId', 'name code')
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

// ─── Get Subject Attendance ───────────────────────────────────────────────────
const getSubjectAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { student, date, status } = req.query;

    const filter = { subjectId: id };
    if (student) filter.studentId = student;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date); const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const records = await Attendance.find(filter)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

// ─── Get Class Attendance ─────────────────────────────────────────────────────
const getClassAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, subject, status } = req.query;

    const filter = { classId: id };
    if (subject) filter.subjectId = subject;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date); const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const records = await Attendance.find(filter)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .populate('subjectId', 'name code')
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

module.exports = { markAttendance, getSessionAttendance, getStudentAttendanceById, getSubjectAttendance, getClassAttendance };
