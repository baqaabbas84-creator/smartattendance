const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const { generateWeeklyTrend } = require('../services/reportService');
const { calculateAttendancePercentage } = require('../utils/calculateAttendance');

// ─── Teacher Dashboard ────────────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id }).populate('subjects');
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found.' });

    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    // Subjects with attendance stats
    const subjectStats = await Promise.all(
      (teacher.subjects || []).map(async (sub) => {
        const cls = await Class.findById(sub.classId);
        const totalStudents = cls?.students?.length || 0;
        const allRecords = await Attendance.find({ subjectId: sub._id }).lean();
        const present = allRecords.filter((r) => r.status === 'Present').length;
        const total = allRecords.length;
        const avgAttendance = calculateAttendancePercentage(present, total);
        const todaySessions = await AttendanceSession.countDocuments({
          subjectId: sub._id, teacherId: teacher._id,
          startTime: { $gte: todayStart },
        });
        return {
          id: sub._id, name: sub.name, code: sub.code,
          class: cls?.name, students: totalStudents,
          avgAttendance, sessionsToday: todaySessions,
        };
      })
    );

    const todaysSessions = await AttendanceSession.countDocuments({
      teacherId: teacher._id, startTime: { $gte: todayStart },
    });

    // Total unique students across all classes
    const classIds = [...new Set((teacher.subjects || []).map((s) => s.classId?.toString()))];
    const classes = await Class.find({ _id: { $in: classIds } });
    const studentsCount = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);

    // Avg attendance across all subjects
    const allAvg = subjectStats.length
      ? Math.round(subjectStats.reduce((s, sub) => s + sub.avgAttendance, 0) / subjectStats.length * 100) / 100
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        teacher: { name: req.user.name, email: req.user.email, employeeId: teacher.employeeId, department: teacher.department },
        stats: {
          subjectsCount: teacher.subjects?.length || 0,
          todaysSessions,
          studentsCount,
          avgAttendance: allAvg,
        },
        subjects: subjectStats,
      },
    });
  } catch (error) { next(error); }
};

// ─── Get Teacher Subjects ─────────────────────────────────────────────────────
const getSubjects = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    const subjects = await Subject.find({ teacherId: teacher._id })
      .populate('classId', 'name branch year section students')
      .lean();

    return res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) { next(error); }
};

// ─── Get Teacher Classes ──────────────────────────────────────────────────────
const getClasses = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    const subjects = await Subject.find({ teacherId: teacher._id }, 'classId').lean();
    const classIds = [...new Set(subjects.map((s) => s.classId?.toString()))].filter(Boolean);
    const classes = await Class.find({ _id: { $in: classIds } })
      .populate({ path: 'students', populate: { path: 'userId', select: 'name email' } })
      .lean();

    return res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) { next(error); }
};

// ─── Get Teacher Sessions ─────────────────────────────────────────────────────
const getSessions = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

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

// ─── Get Teacher Attendance Records ──────────────────────────────────────────
const getAttendance = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    const subjects = await Subject.find({ teacherId: teacher._id }, '_id').lean();
    const subjectIds = subjects.map((s) => s._id);

    const { subject, date, student } = req.query;
    const filter = { subjectId: { $in: subjectIds } };
    if (subject) filter.subjectId = subject;
    if (date) {
      const d = new Date(date); const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }
    if (student) filter.studentId = student;

    const records = await Attendance.find(filter)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .populate('subjectId', 'name code')
      .sort({ date: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

// ─── Get Teacher Reports ──────────────────────────────────────────────────────
const getReports = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    const subjects = await Subject.find({ teacherId: teacher._id }).lean();
    const subjectReports = await Promise.all(
      subjects.map(async (sub) => {
        const records = await Attendance.find({ subjectId: sub._id }).lean();
        const present = records.filter((r) => r.status === 'Present').length;
        const total = records.length;
        return {
          name: sub.name, code: sub.code,
          present, absent: total - present, total,
          avgAttendance: calculateAttendancePercentage(present, total),
        };
      })
    );

    return res.status(200).json({ success: true, data: { subjects: subjectReports } });
  } catch (error) { next(error); }
};

module.exports = { getDashboard, getSubjects, getClasses, getSessions, getAttendance, getReports };
