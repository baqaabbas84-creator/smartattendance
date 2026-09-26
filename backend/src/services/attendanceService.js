const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Notification = require('../models/Notification');
const { sendLowAttendanceEmail } = require('./emailService');
const {
  calculateAttendancePercentage,
  isBelowThreshold,
  getAttendanceStatus,
  MIN_ATTENDANCE_PERCENTAGE,
} = require('../utils/calculateAttendance');

/**
 * Get subject-wise attendance summary for a student
 * @param {ObjectId} studentId
 * @returns {Array} subjects with attendance stats and warnings
 */
const getStudentAttendanceSummary = async (studentId) => {
  // Get all subjects for the student's class
  const student = await Student.findById(studentId);
  if (!student) return [];

  const subjects = await Subject.find({ classId: student.classId })
    .populate('teacherId', 'userId department')
    .lean();

  const summaries = await Promise.all(
    subjects.map(async (subject) => {
      // Count present/total for this student+subject
      const records = await Attendance.find({
        studentId,
        subjectId: subject._id,
      }).lean();

      const present = records.filter((r) => r.status === 'Present').length;
      const late = records.filter((r) => r.status === 'Late').length;
      const total = records.length;
      const percentage = calculateAttendancePercentage(present + late, total);
      const warning = isBelowThreshold(present + late, total);

      return {
        subjectId: subject._id,
        name: subject.name,
        code: subject.code,
        teacher: subject.teacherId,
        present: present + late,
        absent: total - present - late,
        total,
        attendance: percentage,
        status: getAttendanceStatus(percentage),
        warning,
        ...(warning && {
          warningMessage: `Attendance is ${percentage}%. Minimum required: ${MIN_ATTENDANCE_PERCENTAGE}%`,
        }),
      };
    })
  );

  return summaries;
};

/**
 * Get overall attendance stats for a student
 * @param {ObjectId} studentId
 * @returns {{ present, absent, total, overallAttendance }}
 */
const getOverallAttendance = async (studentId) => {
  const records = await Attendance.find({ studentId }).lean();
  const present = records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const total = records.length;
  const overallAttendance = calculateAttendancePercentage(present, total);
  return { present, absent, total, overallAttendance };
};

/**
 * Mark attendance for a student in a session
 * @param {Object} params
 * @returns {Object} attendance record
 */
const markStudentAttendance = async ({ studentId, session, ipAddress }) => {
  const attendance = await Attendance.create({
    sessionId: session._id,
    studentId,
    subjectId: session.subjectId,
    classId: session.classId,
    date: new Date(),
    status: 'Present',
    markedAt: new Date(),
    markedBy: 'student',
    ipAddress,
  });

  // Check if student attendance falls below threshold after marking and send warning
  const student = await Student.findById(studentId).populate('userId');
  if (student) {
    const subjectRecords = await Attendance.find({
      studentId,
      subjectId: session.subjectId,
    });
    const present = subjectRecords.filter((r) => r.status === 'Present').length;
    const total = subjectRecords.length;
    const pct = calculateAttendancePercentage(present, total);

    if (isBelowThreshold(present, total)) {
      const subject = await Subject.findById(session.subjectId);
      
      // In-app Notification
      await Notification.create({
        userId: student.userId._id,
        title: '⚠️ Low Attendance Warning',
        message: `Your attendance in ${subject?.name || 'a subject'} is ${pct}%, which is below the required ${MIN_ATTENDANCE_PERCENTAGE}%.`,
        type: 'warning',
        relatedId: session.subjectId,
        relatedModel: 'Subject',
      });
      
      // Email Notification
      if (student.userId && student.userId.email) {
        await sendLowAttendanceEmail(
          student.userId.email,
          student.userId.name,
          subject?.name || 'Subject',
          pct
        );
      }
    }
  }

  return attendance;
};

/**
 * Get attendance stats for a session (for teacher live view)
 * @param {ObjectId} sessionId (MongoDB _id)
 * @param {number} totalStudents
 * @returns {{ present, absent, late, total, recentAttendance }}
 */
const getSessionStats = async (sessionId, totalStudents) => {
  const records = await Attendance.find({ sessionId })
    .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
    .sort({ markedAt: -1 })
    .lean();

  const present = records.filter((r) => r.status === 'Present').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const absent = totalStudents - present - late;

  const recentAttendance = records.slice(0, 10).map((r) => ({
    studentName: r.studentId?.userId?.name || 'Unknown',
    status: r.status,
    markedAt: r.markedAt,
  }));

  return { present, late, absent: Math.max(0, absent), total: totalStudents, recentAttendance };
};

module.exports = {
  getStudentAttendanceSummary,
  getOverallAttendance,
  markStudentAttendance,
  getSessionStats,
};
