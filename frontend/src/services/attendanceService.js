import api from './api';

const attendanceService = {
  markAttendance: async (sessionId, token, latitude, longitude) => {
    try {
      const response = await api.post('/attendance/mark', { sessionId, token, latitude, longitude });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data; // return backend error message
      }
      return { success: false, message: 'Network error or server unreachable' };
    }
  }
};

export default attendanceService;
