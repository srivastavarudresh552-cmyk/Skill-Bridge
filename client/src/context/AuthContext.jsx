import { createContext, useContext, useEffect, useState } from 'react';
import api, { registerSessionExpiredHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authError, setAuthError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      clearSession();
      setSessionExpired(true);
    });
  }, []);

  const signup = async (name, email, password) => {
    setAuthError('');
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.error?.message || 'Signup failed');
      return false;
    }
  };

  const login = async (email, password) => {
    setAuthError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
      setSessionExpired(false);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.error?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    clearSession();
  };

  const dismissSessionExpired = () => setSessionExpired(false);

  const value = { user, token, authError, signup, login, logout, sessionExpired, dismissSessionExpired };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}