const fs = require('fs');
const path = require('path');

const generatePlaceholder = (title, desc) => `import React from 'react';
const ${title.replace(/\s/g, '')} = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">${title}</h1>
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
      <p className="text-slate-500">${desc}</p>
    </div>
  </div>
);
export default ${title.replace(/\s/g, '')};
`;

const files = {
  'pages/public/Register.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      <p className="text-slate-500 mb-6">This is a demo frontend. Registration is disabled. Please login using the demo credentials.</p>
      <Link to="/login" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 block w-full">Go to Login</Link>
    </div>
  </div>
);
export default Register;
`,
  'pages/teacher/Classes.jsx': generatePlaceholder('Teacher Classes', 'Manage your assigned classes and students.'),
  'pages/teacher/Attendance.jsx': generatePlaceholder('Teacher Attendance', 'View and modify student attendance records.'),
  'pages/teacher/Reports.jsx': generatePlaceholder('Teacher Reports', 'View attendance analytics and download reports.'),
  'pages/teacher/Profile.jsx': generatePlaceholder('Teacher Profile', 'Manage your teacher profile and settings.'),
  
  'pages/admin/Students.jsx': generatePlaceholder('Admin Students', 'Manage all students registered in the system.'),
  'pages/admin/Teachers.jsx': generatePlaceholder('Admin Teachers', 'Manage all teachers in the system.'),
  'pages/admin/Subjects.jsx': generatePlaceholder('Admin Subjects', 'Manage subjects and curriculum.'),
  'pages/admin/Classes.jsx': generatePlaceholder('Admin Classes', 'Manage class sections and assignments.'),
  'pages/admin/Attendance.jsx': generatePlaceholder('Admin Attendance', 'College-wide attendance monitoring.'),
  'pages/admin/Reports.jsx': generatePlaceholder('Admin Reports', 'Generate and view college-wide analytics.'),
  'pages/admin/Profile.jsx': generatePlaceholder('Admin Profile', 'System administrator settings.'),
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});
console.log('Remaining pages written.');
