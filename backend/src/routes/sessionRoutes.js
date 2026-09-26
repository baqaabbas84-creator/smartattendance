const express = require('express');
const router = express.Router();
const { createSession, getSession, endSession, getAllSessions } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validateCreateSession } = require('../middleware/validationMiddleware');

// POST /api/sessions  - Create session (teacher only)
router.post('/', protect, requireRole('teacher'), validateCreateSession, createSession);

// GET  /api/sessions  - List all teacher sessions
router.get('/', protect, requireRole('teacher'), getAllSessions);

// GET  /api/sessions/:id  - Get live session by sessionId (UUID)
router.get('/:id', protect, getSession);

// PUT  /api/sessions/:id/end  - End session (teacher only)
router.put('/:id/end', protect, requireRole('teacher'), endSession);

module.exports = router;
