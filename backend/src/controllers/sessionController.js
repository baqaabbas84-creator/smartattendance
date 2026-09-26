const AttendanceSession = require('../models/AttendanceSession');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const { generateSessionQR } = require('../services/qrService');
const { getSessionStats } = require('../services/attendanceService');

// ─── Create Session ───────────────────────────────────────────────────────────
const createSession = async (req, res, next) => {
  try {
    const { subjectId, classId, duration } = req.body;

    // Get teacher profile
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(403).json({ success: false, message: 'Teacher profile not found.' });

    // Verify subject belongs to this teacher
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    if (subject.teacherId.toString() !== teacher._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized for this subject.' });
    }

    // Verify class exists
    const cls = await Class.findById(classId);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });

    // Check for an already active session for this subject+class
    const existingActive = await AttendanceSession.findOne({
      subjectId, classId, teacherId: teacher._id, status: 'active',
      expiryTime: { $gt: new Date() },
    });
    if (existingActive) {
      return res.status(409).json({ success: false, message: 'An active session already exists for this subject and class.' });
    }

    const startTime = new Date();
    const expiryTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Generate unique sessionId & QR
    const { v4: uuidv4 } = require('uuid');
    const sessionId = uuidv4();
    const { token: qrToken, qrDataUrl } = await generateSessionQR(sessionId);

    // Save session
    const session = await AttendanceSession.create({
      sessionId,
      subjectId,
      teacherId: teacher._id,
      classId,
      startTime,
      expiryTime,
      duration,
      qrToken,
      status: 'active',
      totalStudents: cls.students?.length || 0,
    });

    const populatedSession = await AttendanceSession.findById(session._id)
      .populate('subjectId', 'name code')
      .populate('classId', 'name')
      .lean();

    return res.status(201).json({
      success: true,
      message: 'Attendance session created successfully.',
      session: {
        id: session._id,
        sessionId: session.sessionId,
        subject: populatedSession.subjectId?.name,
        code: populatedSession.subjectId?.code,
        class: populatedSession.classId?.name,
        startTime: session.startTime,
        expiryTime: session.expiryTime,
        duration: session.duration,
        status: session.status,
        totalStudents: session.totalStudents,
      },
      qrData: qrDataUrl, // base64 PNG for frontend display
    });
  } catch (error) { next(error); }
};

// ─── Get Live Session ─────────────────────────────────────────────────────────
const getSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await AttendanceSession.findOne({ sessionId: id })
      .populate('subjectId', 'name code')
      .populate('classId', 'name branch section')
      .lean();

    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });

    // Auto-expire check
    if (session.status === 'active' && new Date() > new Date(session.expiryTime)) {
      await AttendanceSession.findByIdAndUpdate(session._id, { status: 'expired' });
      session.status = 'expired';
    }

    const stats = await getSessionStats(session._id, session.totalStudents);

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        subject: session.subjectId?.name,
        code: session.subjectId?.code,
        class: session.classId?.name,
        startTime: session.startTime,
        expiryTime: session.expiryTime,
        duration: session.duration,
        status: session.status,
        ...stats,
      },
    });
  } catch (error) { next(error); }
};

// ─── End Session ──────────────────────────────────────────────────────────────
const endSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(403).json({ success: false, message: 'Teacher profile not found.' });

    const session = await AttendanceSession.findOne({ sessionId: id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    if (session.teacherId.toString() !== teacher._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to end this session.' });
    }
    if (session.status === 'ended') {
      return res.status(400).json({ success: false, message: 'Session is already ended.' });
    }

    session.status = 'ended';
    await session.save();

    const stats = await getSessionStats(session._id, session.totalStudents);

    return res.status(200).json({
      success: true,
      message: 'Session ended successfully.',
      data: { sessionId: session.sessionId, status: 'ended', ...stats },
    });
  } catch (error) { next(error); }
};

// ─── Get All Sessions ─────────────────────────────────────────────────────────
const getAllSessions = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(403).json({ success: false, message: 'Teacher not found.' });

    const { status } = req.query;
    const filter = { teacherId: teacher._id };
    if (status) filter.status = status;

    const sessions = await AttendanceSession.find(filter)
      .populate('subjectId', 'name code')
      .populate('classId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) { next(error); }
};

module.exports = { createSession, getSession, endSession, getAllSessions };
