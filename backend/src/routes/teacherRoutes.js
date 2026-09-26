const express = require('express');
const router = express.Router();
const {
  getDashboard, getSubjects, getClasses, getSessions, getAttendance, getReports,
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All teacher routes require authentication + teacher role
router.use(protect, requireRole('teacher'));

// GET /api/teacher/dashboard
router.get('/dashboard', getDashboard);

// GET /api/teacher/subjects
router.get('/subjects', getSubjects);

// GET /api/teacher/classes
router.get('/classes', getClasses);

// GET /api/teacher/sessions  ?status=active|ended|expired
router.get('/sessions', getSessions);

// GET /api/teacher/attendance  ?subject=&date=&student=
router.get('/attendance', getAttendance);

// GET /api/teacher/reports
router.get('/reports', getReports);

module.exports = router;
