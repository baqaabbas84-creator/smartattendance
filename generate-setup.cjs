const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToCreate = {
  'index.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  font-family: 'Inter', sans-serif;\n  background-color: #f8fafc;\n  color: #0f172a;\n}`,
  'context/AuthContext.jsx': `import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStudent, mockTeacher, mockAdmin } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('demo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (role) => {
    let userData = null;
    if (role === 'student') userData = mockStudent;
    if (role === 'teacher') userData = mockTeacher;
    if (role === 'admin') userData = mockAdmin;
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('demo_user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  'main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`,
  'App.jsx': `import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
`,
  'routes/AppRoutes.jsx': `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';

// Layouts
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import AdminLayout from '../layouts/AdminLayout';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentScan from '../pages/student/Scan';
import StudentAttendance from '../pages/student/Attendance';
import StudentSubjects from '../pages/student/Subjects';
import StudentReports from '../pages/student/Reports';
import StudentProfile from '../pages/student/Profile';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherClasses from '../pages/teacher/Classes';
import CreateSession from '../pages/teacher/CreateSession';
import SessionActive from '../pages/teacher/SessionActive';
import TeacherAttendance from '../pages/teacher/Attendance';
import TeacherReports from '../pages/teacher/Reports';
import TeacherProfile from '../pages/teacher/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminStudents from '../pages/admin/Students';
import AdminTeachers from '../pages/admin/Teachers';
import AdminSubjects from '../pages/admin/Subjects';
import AdminClasses from '../pages/admin/Classes';
import AdminAttendance from '../pages/admin/Attendance';
import AdminReports from '../pages/admin/Reports';
import AdminProfile from '../pages/admin/Profile';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="scan" element={<StudentScan />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="subjects" element={<StudentSubjects />} />
        <Route path="reports" element={<StudentReports />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="create-session" element={<CreateSession />} />
        <Route path="session/:id" element={<SessionActive />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="reports" element={<TeacherReports />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
`
};

Object.entries(filesToCreate).forEach(([filePath, content]) => {
  const fullPath = path.join(srcDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log('App setup files created.');
