const express = require('express');
const router = express.Router();
const {
  getDashboard, getStudents, getStudentById, updateStudent, deleteStudent,
  getTeachers, updateTeacher, deleteTeacher,
  getSubjects, createSubject, updateSubject, deleteSubject,
  getClasses, createClass, updateClass, deleteClass,
  getAttendance, getReports,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All admin routes require admin role
router.use(protect, requireRole('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Students
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Teachers
router.get('/teachers', getTeachers);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

// Subjects
router.get('/subjects', getSubjects);
router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

// Classes
router.get('/classes', getClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

// Attendance
router.get('/attendance', getAttendance);

// Reports
router.get('/reports', getReports);

module.exports = router;
