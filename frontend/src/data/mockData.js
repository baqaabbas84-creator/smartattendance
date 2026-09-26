export const mockStudent = {
  name: 'Baqa Abbas',
  email: 'student@college.com',
  role: 'student',
  rollNumber: '22001',
  branch: 'CSE',
  year: '2nd Year',
  section: 'CS2G',
  avatar: 'https://ui-avatars.com/api/?name=Baqa+Abbas&background=0D8ABC&color=fff',
  stats: {
    overallAttendance: 82,
    present: 67,
    absent: 13,
    totalClasses: 80,
  },
  subjects: [
    { name: 'Data Structures', code: 'CS301', teacher: 'Dr. Sharma', attendance: 88, present: 35, absent: 5, total: 40, status: 'Good' },
    { name: 'Database Management System', code: 'CS302', teacher: 'Dr. Verma', attendance: 79, present: 31, absent: 9, total: 40, status: 'Safe' },
    { name: 'Operating System', code: 'CS303', teacher: 'Prof. Singh', attendance: 84, present: 33, absent: 7, total: 40, status: 'Good' },
    { name: 'Computer Networks', code: 'CS304', teacher: 'Dr. Gupta', attendance: 68, present: 27, absent: 13, total: 40, status: 'Low' },
    { name: 'Java', code: 'CS305', teacher: 'Prof. Kumar', attendance: 91, present: 36, absent: 4, total: 40, status: 'Excellent' },
  ],
  attendanceHistory: [
    { date: '2026-09-24', subject: 'DSA', class: 'CS2G', time: '10:02 AM', status: 'Present' },
    { date: '2026-09-24', subject: 'DBMS', class: 'CS2G', time: '12:05 PM', status: 'Present' },
    { date: '2026-09-23', subject: 'OS', class: 'CS2G', time: '11:00 AM', status: 'Absent' },
    { date: '2026-09-23', subject: 'Computer Networks', class: 'CS2G', time: '09:05 AM', status: 'Late' },
    { date: '2026-09-22', subject: 'Java', class: 'CS2G', time: '14:02 PM', status: 'Present' },
  ],
  weeklyData: [
    { name: 'Mon', attendance: 80 },
    { name: 'Tue', attendance: 100 },
    { name: 'Wed', attendance: 60 },
    { name: 'Thu', attendance: 100 },
    { name: 'Fri', attendance: 80 },
  ],
  monthlyData: [
    { name: 'Aug', attendance: 85 },
    { name: 'Sep', attendance: 82 },
    { name: 'Oct', attendance: 0 },
  ]
};

export const mockTeacher = {
  name: 'Dr. Sharma',
  email: 'teacher@college.com',
  role: 'teacher',
  employeeId: 'EMP1023',
  department: 'Computer Science',
  avatar: 'https://ui-avatars.com/api/?name=Dr.+Sharma&background=1E3A8A&color=fff',
  stats: {
    subjectsCount: 5,
    todaysSessions: 3,
    studentsCount: 156,
    avgAttendance: 84.5
  },
  subjects: [
    { name: 'Data Structures', class: 'CS2G', students: 50, avgAttendance: 88, sessionsToday: 1 },
    { name: 'Database Management System', class: 'CS3A', students: 55, avgAttendance: 79, sessionsToday: 1 },
    { name: 'Operating Systems', class: 'CS3B', students: 51, avgAttendance: 85, sessionsToday: 0 },
  ],
  studentsList: [
    { name: 'Baqa Abbas', roll: '22001', present: 35, absent: 5, attendance: 87.5, status: 'Good' },
    { name: 'Rahul', roll: '22002', present: 37, absent: 3, attendance: 92.5, status: 'Good' },
    { name: 'Aman', roll: '22003', present: 30, absent: 10, attendance: 75.0, status: 'Warning' },
    { name: 'Arjun', roll: '22004', present: 26, absent: 14, attendance: 65.0, status: 'Low' },
  ]
};

export const mockAdmin = {
  name: 'Administrator',
  email: 'admin@college.com',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=111827&color=fff',
  stats: {
    students: 1245,
    teachers: 68,
    subjects: 42,
    classes: 35,
    todayAttendance: 88.5
  },
  recentActivity: [
    { id: 1, action: 'Teacher created DSA attendance session', time: '10 mins ago' },
    { id: 2, action: 'Student Baqa Abbas marked attendance', time: '15 mins ago' },
    { id: 3, action: 'New student registered', time: '1 hour ago' },
    { id: 4, action: 'Subject DBMS assigned to Dr. Verma', time: '2 hours ago' },
  ],
  departmentStats: [
    { name: 'CSE', attendance: 88 },
    { name: 'IT', attendance: 85 },
    { name: 'ECE', attendance: 82 },
    { name: 'ME', attendance: 78 },
    { name: 'CE', attendance: 75 },
  ],
  studentsList: [
    { name: 'Baqa Abbas', roll: '22001', email: 'baqa@college.com', branch: 'CSE', year: '2nd', section: 'CS2G', attendance: '88%' },
    { name: 'Rahul', roll: '22002', email: 'rahul@college.com', branch: 'CSE', year: '2nd', section: 'CS2G', attendance: '92%' },
  ],
  teachersList: [
    { name: 'Dr. Sharma', empId: 'EMP1023', email: 'sharma@college.com', dept: 'CSE', subjects: 'DSA', status: 'Active' },
    { name: 'Dr. Verma', empId: 'EMP1024', email: 'verma@college.com', dept: 'IT', subjects: 'DBMS', status: 'Active' },
  ]
};
