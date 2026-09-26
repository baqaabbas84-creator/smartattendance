const express = require('express');
const router = express.Router();
const {
  markAttendance, getSessionAttendance, getStudentAttendanceById,
  getSubjectAttendance, getClassAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validateMarkAttendance } = require('../middleware/validationMiddleware');

// POST /api/attendance/mark  - Student scans QR and marks attendance
router.post('/mark', protect, requireRole('student'), validateMarkAttendance, markAttendance);

// GET  /api/attendance/session/:id  - Get all attendance for a session (teacher/admin)
router.get('/session/:id', protect, requireRole('teacher', 'admin'), getSessionAttendance);

// GET  /api/attendance/student/:id  - Get attendance for a specific student (teacher/admin)
router.get('/student/:id', protect, requireRole('teacher', 'admin'), getStudentAttendanceById);

// GET  /api/attendance/subject/:id  - Get attendance for a subject (teacher/admin)
router.get('/subject/:id', protect, requireRole('teacher', 'admin'), getSubjectAttendance);

// GET  /api/attendance/class/:id    - Get attendance for a class (teacher/admin)
router.get('/class/:id', protect, requireRole('teacher', 'admin'), getClassAttendance);

module.exports = router;
