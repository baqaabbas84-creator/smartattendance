/**
 * seedData.js — Populate database with realistic demo data
 * Run: npm run seed
 *
 * Creates:
 *  - 1 Admin user
 *  - 3 Teacher users with profiles
 *  - 1 Class (CSE-3A)
 *  - 5 Student users with profiles (enrolled in CSE-3A)
 *  - 4 Subjects (assigned to teachers)
 *  - Sample attendance sessions (past, completed)
 *  - Sample attendance records
 *  - Notifications
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const AttendanceSession = require('../models/AttendanceSession');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seeding...\n');

    // ── Clear existing data ────────────────────────────────────────────────────
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      AttendanceSession.deleteMany({}),
      Attendance.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data.');

    // ── Admin ─────────────────────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@sas.edu',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`✅ Admin created: ${adminUser.email}`);

    // ── Teachers ──────────────────────────────────────────────────────────────
    const teacherData = [
      { name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@sas.edu', employeeId: 'EMP001', department: 'Computer Science', designation: 'Professor' },
      { name: 'Prof. Anita Sharma', email: 'anita.sharma@sas.edu', employeeId: 'EMP002', department: 'Computer Science', designation: 'Associate Professor' },
      { name: 'Dr. Mohit Verma', email: 'mohit.verma@sas.edu', employeeId: 'EMP003', department: 'Mathematics', designation: 'Assistant Professor' },
    ];

    const teachers = [];
    for (const t of teacherData) {
      const user = await User.create({ name: t.name, email: t.email, password: 'Teacher@123', role: 'teacher' });
      const teacher = await Teacher.create({ userId: user._id, employeeId: t.employeeId, department: t.department, designation: t.designation });
      teachers.push(teacher);
      console.log(`✅ Teacher created: ${t.email}`);
    }

    // ── Class ─────────────────────────────────────────────────────────────────
    const cls = await Class.create({
      name: 'CSE-3A',
      branch: 'CSE',
      year: 3,
      section: 'A',
    });
    console.log(`✅ Class created: ${cls.name}`);

    // ── Students ──────────────────────────────────────────────────────────────
    const studentData = [
      { name: 'Arjun Singh', email: 'arjun.singh@student.sas.edu', rollNumber: 'CSE21001' },
      { name: 'Priya Patel', email: 'priya.patel@student.sas.edu', rollNumber: 'CSE21002' },
      { name: 'Rahul Gupta', email: 'rahul.gupta@student.sas.edu', rollNumber: 'CSE21003' },
      { name: 'Sneha Mishra', email: 'sneha.mishra@student.sas.edu', rollNumber: 'CSE21004' },
      { name: 'Vikram Yadav', email: 'vikram.yadav@student.sas.edu', rollNumber: 'CSE21005' },
    ];

    const students = [];
    for (const s of studentData) {
      const user = await User.create({ name: s.name, email: s.email, password: 'Student@123', role: 'student' });
      const student = await Student.create({
        userId: user._id,
        rollNumber: s.rollNumber,
        branch: 'CSE',
        year: 3,
        section: 'A',
        classId: cls._id,
      });
      students.push(student);
      await Class.findByIdAndUpdate(cls._id, { $addToSet: { students: student._id } });
      console.log(`✅ Student created: ${s.email}`);
    }

    // ── Subjects ──────────────────────────────────────────────────────────────
    const subjectData = [
      { name: 'Data Structures & Algorithms', code: 'CS301', teacherIdx: 0, credits: 4, description: 'Core DSA course covering arrays, trees, graphs, sorting, and searching.' },
      { name: 'Database Management Systems', code: 'CS302', teacherIdx: 1, credits: 4, description: 'Relational models, SQL, normalization, transactions, and indexing.' },
      { name: 'Operating Systems', code: 'CS303', teacherIdx: 0, credits: 3, description: 'Process management, memory, file systems, and synchronization.' },
      { name: 'Discrete Mathematics', code: 'MA301', teacherIdx: 2, credits: 3, description: 'Logic, sets, graph theory, combinatorics, and probability.' },
    ];

    const subjects = [];
    for (const sub of subjectData) {
      const teacher = teachers[sub.teacherIdx];
      const subject = await Subject.create({
        name: sub.name,
        code: sub.code,
        teacherId: teacher._id,
        classId: cls._id,
        credits: sub.credits,
        description: sub.description,
      });
      await Teacher.findByIdAndUpdate(teacher._id, { $addToSet: { subjects: subject._id } });
      subjects.push(subject);
      console.log(`✅ Subject created: ${sub.code} - ${sub.name}`);
    }

    // ── Attendance Sessions (past 14 days) ────────────────────────────────────
    console.log('\n📅 Creating attendance sessions and records...');
    const attendanceMatrix = {
      'CSE21001': [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1], // 12/14
      'CSE21002': [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], // 12/14
      'CSE21003': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // 7/14 - LOW
      'CSE21004': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 14/14 - Perfect
      'CSE21005': [1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1], // 8/14
    };

    for (const subject of subjects) {
      for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() - dayOffset);
        sessionDate.setHours(9, 0, 0, 0);
        const expiryTime = new Date(sessionDate.getTime() + 30 * 60 * 1000); // 30 min

        const sessionId = uuidv4();
        const teacher = teachers[subjects.indexOf(subject) % 2];

        const session = await AttendanceSession.create({
          sessionId,
          subjectId: subject._id,
          teacherId: teacher._id,
          classId: cls._id,
          startTime: sessionDate,
          expiryTime,
          duration: 30,
          qrToken: require('crypto').randomBytes(32).toString('hex'),
          status: 'ended',
          totalStudents: students.length,
        });

        // Mark attendance for each student
        for (const student of students) {
          const rollNum = studentData.find((_, i) => students[i]._id.toString() === student._id.toString())?.rollNumber
            || studentData[students.indexOf(student)].rollNumber;
          const dayIdx = 13 - dayOffset;
          const isPresent = (attendanceMatrix[rollNum] || [])[dayIdx] === 1;

          if (isPresent) {
            await Attendance.create({
              sessionId: session._id,
              studentId: student._id,
              subjectId: subject._id,
              classId: cls._id,
              date: sessionDate,
              status: 'Present',
              markedAt: new Date(sessionDate.getTime() + Math.floor(Math.random() * 10) * 60 * 1000),
              markedBy: 'student',
            });
          }
        }
      }
    }
    console.log(`✅ Created ${subjects.length * 14} sessions with attendance records.`);

    // ── Low Attendance Notifications ──────────────────────────────────────────
    const rahulStudent = students[2]; // CSE21003 - low attendance
    const rahulUser = await User.findById(rahulStudent.userId);
    await Notification.create([
      {
        userId: rahulUser._id,
        title: '⚠️ Low Attendance Warning',
        message: `Your attendance in Data Structures & Algorithms is 50%, below the required 75%. Please attend regularly.`,
        type: 'warning',
        relatedId: subjects[0]._id,
        relatedModel: 'Subject',
      },
      {
        userId: rahulUser._id,
        title: '⚠️ Low Attendance Warning',
        message: `Your attendance in Discrete Mathematics is 50%, below the required 75%. You are at risk.`,
        type: 'warning',
        relatedId: subjects[3]._id,
        relatedModel: 'Subject',
      },
    ]);

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║      ✅ SEEDING COMPLETE                   ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log('║  CREDENTIALS (all same password format)    ║');
    console.log('║─────────────────────────────────────────  ║');
    console.log('║  Admin:   admin@sas.edu / Admin@123        ║');
    console.log('║  Teacher: rajesh.kumar@sas.edu / Teacher@123║');
    console.log('║  Student: arjun.singh@student.sas.edu      ║');
    console.log('║           / Student@123                    ║');
    console.log('║                                            ║');
    console.log('║  Low Attendance: rahul.gupta@student.sas.edu║');
    console.log('╚═══════════════════════════════════════════╝\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
