const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const AttendanceSession = require('../models/AttendanceSession');
const { calculateAttendancePercentage } = require('../utils/calculateAttendance');

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    const [studentsCount, teachersCount, subjectsCount, classesCount] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Subject.countDocuments(),
      Class.countDocuments(),
    ]);

    const todayRecords = await Attendance.find({ date: { $gte: todayStart } }).lean();
    const todayPresent = todayRecords.filter((r) => r.status === 'Present').length;
    const todayAbsent = todayRecords.filter((r) => r.status === 'Absent').length;
    const todayAttendance = calculateAttendancePercentage(todayPresent, todayRecords.length);

    // Department-wise attendance
    const classes = await Class.find().lean();
    const departmentStats = await Promise.all(
      classes.map(async (cls) => {
        const records = await Attendance.find({ classId: cls._id }).lean();
        const present = records.filter((r) => r.status === 'Present').length;
        return { name: cls.name, attendance: calculateAttendancePercentage(present, records.length) };
      })
    );

    // Recent activity
    const recentSessions = await AttendanceSession.find()
      .populate('subjectId', 'name').populate({ path: 'teacherId', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 }).limit(5).lean();
    const recentActivity = recentSessions.map((s, i) => ({
      id: i + 1,
      action: `${s.teacherId?.userId?.name || 'Teacher'} created ${s.subjectId?.name || 'subject'} attendance session`,
      time: new Date(s.createdAt).toLocaleString(),
    }));

    return res.status(200).json({
      success: true,
      data: {
        stats: { students: studentsCount, teachers: teachersCount, subjects: subjectsCount, classes: classesCount, todayAttendance },
        today: { present: todayPresent, absent: todayAbsent, total: todayRecords.length },
        departmentStats,
        recentActivity,
      },
    });
  } catch (error) { next(error); }
};

// ─── Students CRUD ────────────────────────────────────────────────────────────
const getStudents = async (req, res, next) => {
  try {
    const { branch, year, section } = req.query;
    const filter = {};
    if (branch) filter.branch = branch.toUpperCase();
    if (year) filter.year = Number(year);
    if (section) filter.section = section.toUpperCase();

    const students = await Student.find(filter)
      .populate('userId', 'name email isActive avatar')
      .populate('classId', 'name')
      .sort({ rollNumber: 1 })
      .lean();

    const result = students.map((s) => ({
      id: s._id, userId: s.userId?._id,
      name: s.userId?.name, email: s.userId?.email,
      rollNumber: s.rollNumber, branch: s.branch,
      year: s.year, section: s.section,
      class: s.classId?.name, isActive: s.userId?.isActive,
    }));

    return res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) { next(error); }
};

const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email avatar isActive createdAt')
      .populate('classId', 'name branch year section')
      .lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    return res.status(200).json({ success: true, data: student });
  } catch (error) { next(error); }
};

const updateStudent = async (req, res, next) => {
  try {
    const { name, branch, year, section } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    if (name) await User.findByIdAndUpdate(student.userId, { name });
    if (branch) student.branch = branch.toUpperCase();
    if (year) student.year = Number(year);
    if (section) student.section = section.toUpperCase();
    await student.save();

    return res.status(200).json({ success: true, message: 'Student updated successfully.' });
  } catch (error) { next(error); }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    await User.findByIdAndUpdate(student.userId, { isActive: false });
    return res.status(200).json({ success: true, message: 'Student deactivated successfully.' });
  } catch (error) { next(error); }
};

// ─── Teachers CRUD ────────────────────────────────────────────────────────────
const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find()
      .populate('userId', 'name email isActive avatar')
      .populate('subjects', 'name code')
      .lean();

    const result = teachers.map((t) => ({
      id: t._id, name: t.userId?.name, email: t.userId?.email,
      employeeId: t.employeeId, department: t.department,
      subjects: t.subjects?.map((s) => s.name).join(', ') || '',
      status: t.userId?.isActive ? 'Active' : 'Inactive',
    }));

    return res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) { next(error); }
};

const updateTeacher = async (req, res, next) => {
  try {
    const { name, department, designation } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });

    if (name) await User.findByIdAndUpdate(teacher.userId, { name });
    if (department) teacher.department = department;
    if (designation) teacher.designation = designation;
    await teacher.save();

    return res.status(200).json({ success: true, message: 'Teacher updated successfully.' });
  } catch (error) { next(error); }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found.' });
    await User.findByIdAndUpdate(teacher.userId, { isActive: false });
    return res.status(200).json({ success: true, message: 'Teacher deactivated.' });
  } catch (error) { next(error); }
};

// ─── Subjects CRUD ────────────────────────────────────────────────────────────
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find()
      .populate({ path: 'teacherId', populate: { path: 'userId', select: 'name' } })
      .populate('classId', 'name')
      .lean();
    return res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) { next(error); }
};

const createSubject = async (req, res, next) => {
  try {
    const { name, code, teacherId, classId, credits, description } = req.body;
    const existing = await Subject.findOne({ code: code?.toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Subject code already exists.' });

    const subject = await Subject.create({ name, code: code.toUpperCase(), teacherId, classId, credits, description });

    // Add subject to teacher's list
    await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { subjects: subject._id } });

    return res.status(201).json({ success: true, message: 'Subject created successfully.', data: subject });
  } catch (error) { next(error); }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    return res.status(200).json({ success: true, message: 'Subject updated.', data: subject });
  } catch (error) { next(error); }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found.' });
    await Teacher.findByIdAndUpdate(subject.teacherId, { $pull: { subjects: subject._id } });
    return res.status(200).json({ success: true, message: 'Subject deleted.' });
  } catch (error) { next(error); }
};

// ─── Classes CRUD ─────────────────────────────────────────────────────────────
const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find()
      .populate({ path: 'students', populate: { path: 'userId', select: 'name email' } })
      .lean();
    return res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) { next(error); }
};

const createClass = async (req, res, next) => {
  try {
    const { name, branch, year, section } = req.body;
    const existing = await Class.findOne({ name: name?.toUpperCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Class already exists.' });
    const cls = await Class.create({ name: name.toUpperCase(), branch: branch.toUpperCase(), year, section: section.toUpperCase() });
    return res.status(201).json({ success: true, message: 'Class created.', data: cls });
  } catch (error) { next(error); }
};

const updateClass = async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    return res.status(200).json({ success: true, message: 'Class updated.', data: cls });
  } catch (error) { next(error); }
};

const deleteClass = async (req, res, next) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ success: false, message: 'Class not found.' });
    return res.status(200).json({ success: true, message: 'Class deleted.' });
  } catch (error) { next(error); }
};

// ─── Admin Attendance ─────────────────────────────────────────────────────────
const getAttendance = async (req, res, next) => {
  try {
    const { date, subject, student, status } = req.query;
    const filter = {};
    if (subject) filter.subjectId = subject;
    if (student) filter.studentId = student;
    if (status) filter.status = status;
    if (date) {
      const d = new Date(date); const next = new Date(d); next.setDate(next.getDate() + 1);
      filter.date = { $gte: d, $lt: next };
    }

    const records = await Attendance.find(filter)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name' } })
      .populate('subjectId', 'name code')
      .sort({ date: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

// ─── Admin Reports ────────────────────────────────────────────────────────────
const getReports = async (req, res, next) => {
  try {
    const [subjects, classes] = await Promise.all([Subject.find().lean(), Class.find().lean()]);

    const subjectReports = await Promise.all(
      subjects.map(async (sub) => {
        const records = await Attendance.find({ subjectId: sub._id }).lean();
        const present = records.filter((r) => r.status === 'Present').length;
        return { name: sub.name, code: sub.code, present, absent: records.length - present, total: records.length, attendance: calculateAttendancePercentage(present, records.length) };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        subjectReports,
        chartData: subjectReports.map((s) => ({ name: s.code, present: s.present, absent: s.absent, attendance: s.attendance })),
      },
    });
  } catch (error) { next(error); }
};

module.exports = {
  getDashboard, getStudents, getStudentById, updateStudent, deleteStudent,
  getTeachers, updateTeacher, deleteTeacher,
  getSubjects, createSubject, updateSubject, deleteSubject,
  getClasses, createClass, updateClass, deleteClass,
  getAttendance, getReports,
};
