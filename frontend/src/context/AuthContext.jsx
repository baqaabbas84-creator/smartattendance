import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and fetch user details
          const response = await authService.getMe();
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Failed to authenticate user", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      console.error("Login error", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network error, please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch(e) {} // ignore logout error
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
