const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Send validation errors back to client
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().reduce((acc, err) => {
      acc[err.path || err.param] = err.msg;
      return acc;
    }, {});
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};

// ─── Auth Validators ─────────────────────────────────────────────────────────
const validateStudentRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').matches(/@gmail\.com$/i).withMessage('Only @gmail.com addresses are allowed').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  validate,
];

const validateTeacherRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('email').trim().isEmail().withMessage('Valid email is required').matches(/@gmail\.com$/i).withMessage('Only @gmail.com addresses are allowed').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  validate,
];

const validateLogin = [
  body('identifier').trim().notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// ─── Session Validators ───────────────────────────────────────────────────────
const validateCreateSession = [
  body('subjectId').custom((v) => mongoose.Types.ObjectId.isValid(v)).withMessage('Valid subject ID is required'),
  body('classId').custom((v) => mongoose.Types.ObjectId.isValid(v)).withMessage('Valid class ID is required'),
  body('duration').isInt({ min: 1, max: 120 }).withMessage('Duration must be between 1 and 120 minutes'),
  validate,
];

// ─── Attendance Validators ────────────────────────────────────────────────────
const validateMarkAttendance = [
  body('sessionId').trim().notEmpty().withMessage('Session ID is required'),
  body('token').trim().notEmpty().withMessage('QR token is required'),
  validate,
];

// ─── Profile Validators ───────────────────────────────────────────────────────
const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate,
];

// ─── ObjectId Validator ───────────────────────────────────────────────────────
const validateObjectId = (paramName = 'id') => [
  param(paramName).custom((v) => mongoose.Types.ObjectId.isValid(v)).withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  validateStudentRegister,
  validateTeacherRegister,
  validateLogin,
  validateCreateSession,
  validateMarkAttendance,
  validatePasswordChange,
  validateObjectId,
  validate,
};
