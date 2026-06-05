import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const STORAGE_KEY = 'lms_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      setUser(data);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { success: true, role: data.role };
    } catch (error) {
      const message = error?.response?.data?.error || 'Invalid credentials';
      return { success: false, error: message };
    }
  };

  const register = async ({ name, username, password }) => {
    try {
      const { data } = await axios.post('/api/auth/register', { name, username, password });
      setUser(data);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { success: true, role: data.role };
    } catch (error) {
      const message = error?.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
