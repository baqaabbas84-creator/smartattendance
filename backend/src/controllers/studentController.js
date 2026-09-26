const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Notification = require('../models/Notification');
const {
  getStudentAttendanceSummary,
  getOverallAttendance,
} = require('../services/attendanceService');

// ─── Get Student Profile ──────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('classId');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
        student: {
          rollNumber: student.rollNumber,
          branch: student.branch,
          year: student.year,
          section: student.section,
          class: student.classId?.name,
        },
      },
    });
  } catch (error) { next(error); }
};

// ─── Get Student Dashboard ────────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('classId');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    const [overall, subjects, activeSessions] = await Promise.all([
      getOverallAttendance(student._id),
      getStudentAttendanceSummary(student._id),
      AttendanceSession.find({
        classId: student.classId,
        status: 'active',
        expiryTime: { $gt: new Date() },
      }).populate('subjectId', 'name code').lean(),
    ]);

    const warnings = subjects.filter((s) => s.warning);

    // Today's attendance
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayRecords = await Attendance.find({
      studentId: student._id,
      date: { $gte: todayStart },
    }).populate('subjectId', 'name').populate('sessionId', 'startTime').lean();

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: req.user.name,
          email: req.user.email,
          rollNumber: student.rollNumber,
          branch: student.branch,
          year: student.year,
          section: student.section,
          class: student.classId?.name,
        },
        overallAttendance: overall.overallAttendance,
        totalClasses: overall.total,
        present: overall.present,
        absent: overall.absent,
        subjects,
        warnings,
        todayAttendance: todayRecords.map((r) => ({
          subject: r.subjectId?.name,
          status: r.status,
          time: r.markedAt,
        })),
        activeSessions: activeSessions.map((s) => ({
          sessionId: s.sessionId,
          subject: s.subjectId?.name,
          expiryTime: s.expiryTime,
        })),
      },
    });
  } catch (error) { next(error); }
};

// ─── Get Attendance History ───────────────────────────────────────────────────
const getAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const { subject, status, date, month } = req.query;
    const filter = { studentId: student._id };

    if (subject) filter.subjectId = subject;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    if (month) {
      const [year, mon] = month.split('-');
      filter.date = {
        $gte: new Date(year, mon - 1, 1),
        $lt: new Date(year, mon, 1),
      };
    }

    const records = await Attendance.find(filter)
      .populate('subjectId', 'name code')
      .populate('sessionId', 'startTime')
      .sort({ date: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records.map((r) => ({
        id: r._id,
        subject: r.subjectId?.name,
        code: r.subjectId?.code,
        status: r.status,
        date: r.date,
        markedAt: r.markedAt,
      })),
    });
  } catch (error) { next(error); }
};

// ─── Get Attendance Summary ───────────────────────────────────────────────────
const getAttendanceSummary = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const [overall, subjects] = await Promise.all([
      getOverallAttendance(student._id),
      getStudentAttendanceSummary(student._id),
    ]);

    return res.status(200).json({ success: true, data: { ...overall, subjects } });
  } catch (error) { next(error); }
};

// ─── Get Student Subjects ─────────────────────────────────────────────────────
const getSubjects = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const subjects = await Subject.find({ classId: student.classId })
      .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name email' } })
      .lean();

    return res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) { next(error); }
};

// ─── Get Student Reports ──────────────────────────────────────────────────────
const getReports = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const { generateMonthlyTrend } = require('../services/reportService');
    const [subjects, monthly] = await Promise.all([
      getStudentAttendanceSummary(student._id),
      generateMonthlyTrend(student._id),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        subjects,
        monthly,
        chartData: subjects.map((s) => ({
          name: s.name,
          attendance: s.attendance,
          present: s.present,
          absent: s.absent,
        })),
      },
    });
  } catch (error) { next(error); }
};

// ─── Get Notifications ────────────────────────────────────────────────────────
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    return res.status(200).json({ success: true, unreadCount, data: notifications });
  } catch (error) { next(error); }
};

module.exports = { getProfile, getDashboard, getAttendance, getAttendanceSummary, getSubjects, getReports, getNotifications };
