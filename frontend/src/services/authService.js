import api from './api';

const authService = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
  },

  registerStudent: async (data) => {
    try {
      const response = await api.post('/auth/register/student', data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: 'Network error or server unreachable' };
    }
  }
};

export default authService;
