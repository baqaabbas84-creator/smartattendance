const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const generateToken = require('../utils/generateToken');

// ─── Register Student ─────────────────────────────────────────────────────────
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, rollNumber, branch, year, section } = req.body;

    // Check existing user/roll
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(409).json({ success: false, message: 'Roll number already registered.' });
    }

    // Find or create class
    let cls = await Class.findOne({ branch: branch.toUpperCase(), year: Number(year), section: section.toUpperCase() });

    // Create user
    const user = await User.create({ name, email, password, role: 'student' });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      rollNumber,
      branch: branch.toUpperCase(),
      year: Number(year),
      section: section.toUpperCase(),
      classId: cls?._id || null,
    });

    // Add student to class if exists
    if (cls) {
      await Class.findByIdAndUpdate(cls._id, { $addToSet: { students: student._id } });
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: student.rollNumber,
        branch: student.branch,
        year: student.year,
        section: student.section,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Register Teacher ─────────────────────────────────────────────────────────
const registerTeacher = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const existingEmp = await Teacher.findOne({ employeeId: employeeId.toUpperCase() });
    if (existingEmp) {
      return res.status(409).json({ success: false, message: 'Employee ID already registered.' });
    }

    const user = await User.create({ name, email, password, role: 'teacher' });
    await Teacher.create({
      userId: user._id,
      employeeId: employeeId.toUpperCase(),
      department,
    });

    const token = generateToken(user._id, user.role);
    return res.status(201).json({
      success: true,
      message: 'Teacher registered successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, employeeId, department },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    // 1. Try finding by email
    let user = await User.findOne({ email: identifier }).select('+password');

    // 2. Try finding by student rollNumber
    if (!user) {
      const student = await Student.findOne({ rollNumber: identifier });
      if (student) {
        user = await User.findById(student.userId).select('+password');
      }
    }

    // 3. Try finding by teacher employeeId
    if (!user) {
      const teacher = await Teacher.findOne({ employeeId: identifier.toUpperCase() });
      if (teacher) {
        user = await User.findById(teacher.userId).select('+password');
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    // Build profile info based on role
    let profileInfo = {};
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      profileInfo = {
        rollNumber: student?.rollNumber,
        branch: student?.branch,
        year: student?.year,
        section: student?.section,
      };
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: user._id });
      profileInfo = {
        employeeId: teacher?.employeeId,
        department: teacher?.department,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        ...profileInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    let profileInfo = {};

    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id }).populate('classId');
      profileInfo = student ? { rollNumber: student.rollNumber, branch: student.branch, year: student.year, section: student.section, classId: student.classId } : {};
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ userId: user._id }).populate('subjects');
      profileInfo = teacher ? { employeeId: teacher.employeeId, department: teacher.department, subjects: teacher.subjects } : {};
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        ...profileInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

module.exports = { registerStudent, registerTeacher, login, getMe, logout };
