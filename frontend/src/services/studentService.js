import api from './api';

const studentService = {
  getProfile: async () => {
    const res = await api.get('/student/profile');
    return res.data;
  },

  getDashboard: async () => {
    const res = await api.get('/student/dashboard');
    return res.data;
  },

  getAttendanceHistory: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    if (filters.month) params.append('month', filters.month);
    
    const res = await api.get(`/student/attendance?${params.toString()}`);
    return res.data;
  },

  getSubjects: async () => {
    const res = await api.get('/student/subjects');
    return res.data;
  },

  getReports: async () => {
    const res = await api.get('/student/reports');
    return res.data;
  },

  getNotifications: async () => {
    const res = await api.get('/student/notifications');
    return res.data;
  }
};

export default studentService;
