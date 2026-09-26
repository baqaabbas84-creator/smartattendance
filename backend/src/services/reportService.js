const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const User = require('../models/User');
const {
  calculateAttendancePercentage,
  getAttendanceStatus,
  MIN_ATTENDANCE_PERCENTAGE,
} = require('../utils/calculateAttendance');

/**
 * Generate subject-wise report for a class (optimized for Recharts)
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId
 * @returns {Object} report data
 */
const generateSubjectReport = async (subjectId, classId) => {
  const subject = await Subject.findById(subjectId).lean();
  const students = await Student.find({ classId }).populate('userId', 'name email').lean();

  const studentReports = await Promise.all(
    students.map(async (student) => {
      const records = await Attendance.find({
        studentId: student._id,
        subjectId,
      }).lean();

      const present = records.filter((r) => r.status === 'Present').length;
      const late = records.filter((r) => r.status === 'Late').length;
      const total = records.length;
      const percentage = calculateAttendancePercentage(present + late, total);

      return {
        rollNumber: student.rollNumber,
        name: student.userId?.name,
        email: student.userId?.email,
        present: present + late,
        absent: total - present - late,
        total,
        percentage,
        status: getAttendanceStatus(percentage),
        warning: percentage < MIN_ATTENDANCE_PERCENTAGE,
      };
    })
  );

  return {
    subject: subject?.name,
    code: subject?.code,
    students: studentReports,
    // Recharts format
    chartData: studentReports.map((s) => ({
      name: s.name,
      present: s.present,
      absent: s.absent,
      attendance: s.percentage,
    })),
  };
};

/**
 * Generate monthly attendance trend for Recharts
 * @param {ObjectId} studentId
 * @returns {Array} monthly data
 */
const generateMonthlyTrend = async (studentId) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const records = await Attendance.find({
    studentId,
    date: { $gte: sixMonthsAgo },
  }).lean();

  // Group by month
  const monthMap = {};
  records.forEach((r) => {
    const month = new Date(r.date).toLocaleString('default', { month: 'short' });
    if (!monthMap[month]) monthMap[month] = { present: 0, absent: 0, total: 0 };
    monthMap[month].total++;
    if (r.status === 'Present' || r.status === 'Late') monthMap[month].present++;
    else monthMap[month].absent++;
  });

  return Object.entries(monthMap).map(([name, data]) => ({
    name,
    present: data.present,
    absent: data.absent,
    attendance: calculateAttendancePercentage(data.present, data.total),
  }));
};

/**
 * Generate weekly attendance trend (last 7 days)
 * @param {ObjectId} classId
 * @param {ObjectId} subjectId (optional)
 * @returns {Array} daily data for Recharts
 */
const generateWeeklyTrend = async (classId, subjectId = null) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }

  const result = await Promise.all(
    days.map(async (day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const query = { classId, date: { $gte: day, $lt: nextDay } };
      if (subjectId) query.subjectId = subjectId;

      const records = await Attendance.find(query).lean();
      const present = records.filter((r) => r.status === 'Present').length;
      const absent = records.filter((r) => r.status === 'Absent').length;

      return {
        name: day.toLocaleString('default', { weekday: 'short' }),
        date: day.toISOString().split('T')[0],
        present,
        absent,
        total: records.length,
      };
    })
  );

  return result;
};

/**
 * Generate CSV data for export
 * @param {ObjectId} subjectId
 * @param {ObjectId} classId
 * @returns {string} CSV string
 */
const generateCSVData = async (subjectId, classId) => {
  const report = await generateSubjectReport(subjectId, classId);
  const headers = ['Roll Number', 'Name', 'Subject', 'Present', 'Absent', 'Total', 'Percentage', 'Status'];
  const rows = report.students.map((s) =>
    [s.rollNumber, s.name, report.subject, s.present, s.absent, s.total, `${s.percentage}%`, s.status]
  );

  const csvLines = [
    headers.join(','),
    ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
  ];
  return csvLines.join('\n');
};

module.exports = {
  generateSubjectReport,
  generateMonthlyTrend,
  generateWeeklyTrend,
  generateCSVData,
};
