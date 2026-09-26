const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const attendanceSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class is required'],
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    expiryTime: {
      type: Date,
      required: [true, 'Expiry time is required'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [120, 'Duration cannot exceed 120 minutes'],
    },
    qrToken: {
      type: String,
      required: true,
      // This is the secure random token embedded in QR
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'ended'],
      default: 'active',
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-expire check (virtual)
attendanceSessionSchema.virtual('isExpired').get(function () {
  return new Date() > this.expiryTime || this.status !== 'active';
});

// Index for efficient querying
attendanceSessionSchema.index({ teacherId: 1, status: 1 });
attendanceSessionSchema.index({ subjectId: 1, classId: 1 });
attendanceSessionSchema.index({ expiryTime: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
