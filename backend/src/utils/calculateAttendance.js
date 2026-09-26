// Minimum attendance percentage required
const MIN_ATTENDANCE_PERCENTAGE = 75;

/**
 * Calculate attendance percentage
 * @param {number} present - Number of classes attended
 * @param {number} total - Total classes held
 * @returns {number} Attendance percentage rounded to 2 decimal places
 */
const calculateAttendancePercentage = (present, total) => {
  if (!total || total === 0) return 0;
  return Math.round((present / total) * 100 * 100) / 100;
};

/**
 * Calculate how many classes a student needs to attend to reach minimum threshold
 * @param {number} present - Current present count
 * @param {number} total - Total classes held
 * @returns {number} Additional classes needed (0 if already meeting threshold)
 */
const classesNeededForMinAttendance = (present, total) => {
  const percentage = calculateAttendancePercentage(present, total);
  if (percentage >= MIN_ATTENDANCE_PERCENTAGE) return 0;

  // Formula: (present + x) / (total + x) = MIN/100
  // Solving for x: x = (MIN * total - 100 * present) / (100 - MIN)
  const needed = Math.ceil(
    (MIN_ATTENDANCE_PERCENTAGE * total - 100 * present) / (100 - MIN_ATTENDANCE_PERCENTAGE)
  );
  return Math.max(0, needed);
};

/**
 * Check if attendance is below minimum threshold
 * @param {number} present 
 * @param {number} total 
 * @returns {boolean}
 */
const isBelowThreshold = (present, total) => {
  return calculateAttendancePercentage(present, total) < MIN_ATTENDANCE_PERCENTAGE;
};

/**
 * Get attendance status label based on percentage
 * @param {number} percentage 
 * @returns {string}
 */
const getAttendanceStatus = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Good';
  if (percentage >= 75) return 'Safe';
  if (percentage >= 65) return 'Warning';
  return 'Low';
};

module.exports = {
  MIN_ATTENDANCE_PERCENTAGE,
  calculateAttendancePercentage,
  classesNeededForMinAttendance,
  isBelowThreshold,
  getAttendanceStatus,
};
