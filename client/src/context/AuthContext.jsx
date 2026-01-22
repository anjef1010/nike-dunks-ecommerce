// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const authAxios = useMemo(() => {
    // Create axios instance with credentials enabled for cookies
    const instance = axios.create({ 
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true 
    });

    // Interceptor to handle global errors (like 401 Unauthorized)
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          // Clear user state if the session/cookie is invalid or expired
          localStorage.removeItem('userInfo');
          setUser(null);
          // If you were using a 'token' state, clear it here too
          if (typeof setToken === 'function') setToken(null);
        }
        return Promise.reject(err);
      }
    );

    return instance;
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await authAxios.get('/api/auth/me');
          setUser(data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [authAxios]);

  const login = async (email, password) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // CRITICAL: This accepts the cookie from Render
  });

  const data = await response.json();
  if (response.ok) {
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return { success: true };
  } else {
    return { success: false, message: data.message };
  }
};

 
const logout = async () => {
  try {
    // 1. Call the backend to clear the HTTP-only cookie
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: 'GET',
      credentials: 'include', // CRITICAL: This allows the browser to clear the cookie
    });

    // 2. Clear local state and localStorage
    setUser(null);
    localStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Logout failed:', error);
    // Even if the network fails, clear local data so user isn't stuck "logged in"
    setUser(null);
    localStorage.removeItem('userInfo');
  }
};
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authAxios, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);