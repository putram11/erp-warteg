import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { apiCall } from '../lib/api';
import { AuthContext } from './auth-context';
import type { AuthContextType, User, RegisterData } from '../types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiCall<{ user: User; token: string }>('POST', '/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login berhasil!');
        return true;
      } else {
        toast.error(response.error || 'Login gagal');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan saat login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiCall<{ user: User; token: string }>('POST', '/auth/register', data);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Registrasi berhasil!');
        return true;
      } else {
        toast.error(response.error || 'Registrasi gagal');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan saat registrasi');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      // Call logout endpoint to invalidate token on server
      await apiCall('POST', '/auth/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      toast.success('Logout berhasil');
    } catch {
      // Even if logout fails on server, we still clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      toast.error('Terjadi kesalahan saat logout');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
