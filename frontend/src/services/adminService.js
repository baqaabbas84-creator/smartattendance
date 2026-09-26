import api from './api';

const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Students
  getStudents: async (filters = {}) => {
    const response = await api.get('/admin/students', { params: filters });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/admin/students/${id}`);
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await api.put(`/admin/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/admin/students/${id}`);
    return response.data;
  },

  // Teachers
  getTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },

  updateTeacher: async (id, data) => {
    const response = await api.put(`/admin/teachers/${id}`, data);
    return response.data;
  },

  deleteTeacher: async (id) => {
    const response = await api.delete(`/admin/teachers/${id}`);
    return response.data;
  },

  // Subjects
  getSubjects: async () => {
    const response = await api.get('/admin/subjects');
    return response.data;
  },

  createSubject: async (data) => {
    const response = await api.post('/admin/subjects', data);
    return response.data;
  },

  updateSubject: async (id, data) => {
    const response = await api.put(`/admin/subjects/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await api.delete(`/admin/subjects/${id}`);
    return response.data;
  },

  // Classes
  getClasses: async () => {
    const response = await api.get('/admin/classes');
    return response.data;
  },

  createClass: async (data) => {
    const response = await api.post('/admin/classes', data);
    return response.data;
  },

  updateClass: async (id, data) => {
    const response = await api.put(`/admin/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id) => {
    const response = await api.delete(`/admin/classes/${id}`);
    return response.data;
  },

  // Attendance
  getAttendance: async (filters = {}) => {
    const response = await api.get('/admin/attendance', { params: filters });
    return response.data;
  },

  // Reports
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
};

export default adminService;
