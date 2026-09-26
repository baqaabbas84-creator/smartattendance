const express = require('express');
const router = express.Router();
const { generateSubjectReport, generateCSVData } = require('../services/reportService');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// GET /api/reports/subject/:subjectId?classId=  - Subject-wise report (teacher/admin)
router.get('/subject/:subjectId', protect, requireRole('teacher', 'admin'), async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ success: false, message: 'classId query param is required.' });
    const report = await generateSubjectReport(subjectId, classId);
    return res.status(200).json({ success: true, data: report });
  } catch (error) { next(error); }
});

// GET /api/reports/subject/:subjectId/export?classId=  - CSV export
router.get('/subject/:subjectId/export', protect, requireRole('teacher', 'admin'), async (req, res, next) => {
  try {
    const { subjectId } = req.params;
    const { classId } = req.query;
    if (!classId) return res.status(400).json({ success: false, message: 'classId query param is required.' });
    const csvData = await generateCSVData(subjectId, classId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${subjectId}.csv"`);
    return res.status(200).send(csvData);
  } catch (error) { next(error); }
});

module.exports = router;
