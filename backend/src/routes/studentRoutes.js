const express = require('express');
const router = express.Router();
const {
  getProfile, getDashboard, getAttendance, getAttendanceSummary,
  getSubjects, getReports, getNotifications,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// All student routes require authentication + student role
router.use(protect, requireRole('student'));

// GET /api/student/profile
router.get('/profile', getProfile);

// GET /api/student/dashboard
router.get('/dashboard', getDashboard);

// GET /api/student/attendance  ?subject=&status=&date=&month=
router.get('/attendance', getAttendance);

// GET /api/student/attendance/summary
router.get('/attendance/summary', getAttendanceSummary);

// GET /api/student/subjects
router.get('/subjects', getSubjects);

// GET /api/student/reports
router.get('/reports', getReports);

// GET /api/student/notifications
router.get('/notifications', getNotifications);

module.exports = router;
