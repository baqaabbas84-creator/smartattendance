const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: [true, 'Session is required'],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required'],
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
    markedBy: {
      type: String,
      enum: ['student', 'teacher', 'system'],
      default: 'student',
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Compound unique index to prevent duplicate attendance
attendanceSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

// Additional indexes for efficient querying
attendanceSchema.index({ studentId: 1, subjectId: 1 });
attendanceSchema.index({ subjectId: 1, date: 1 });
attendanceSchema.index({ classId: 1, date: 1 });
attendanceSchema.index({ sessionId: 1, status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
