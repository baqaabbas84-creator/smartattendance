const express = require('express');
const router = express.Router();
const { registerStudent, registerTeacher, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateStudentRegister,
  validateTeacherRegister,
  validateLogin,
} = require('../middleware/validationMiddleware');

// POST /api/auth/register/student
router.post('/register/student', validateStudentRegister, registerStudent);

// POST /api/auth/register/teacher
router.post('/register/teacher', validateTeacherRegister, registerTeacher);

// POST /api/auth/login
router.post('/login', validateLogin, login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
