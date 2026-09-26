import api from './api';

const teacherService = {
  getDashboard: async () => {
    const response = await api.get('/teacher/dashboard');
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/teacher/subjects');
    return response.data;
  },

  getClasses: async () => {
    const response = await api.get('/teacher/classes');
    return response.data;
  },

  getSessions: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/teacher/sessions', { params });
    return response.data;
  },

  getAttendance: async (filters = {}) => {
    const response = await api.get('/teacher/attendance', { params: filters });
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/teacher/reports');
    return response.data;
  },

  // Session management
  createSession: async (subjectId, classId, duration) => {
    const response = await api.post('/sessions', { subjectId, classId, duration });
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  endSession: async (sessionId) => {
    const response = await api.put(`/sessions/${sessionId}/end`);
    return response.data;
  },

  getAllSessions: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/sessions', { params });
    return response.data;
  },
};

export default teacherService;
