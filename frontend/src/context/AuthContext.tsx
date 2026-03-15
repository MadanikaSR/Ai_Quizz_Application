'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = Cookies.get('access_token');
      if (token) {
        try {
          // If you have a /me endpoint, fetch it here.
          // For now, assume user context is lost from reload but token is valid
          // We can decode JWT or fetch from backend endpoint.
          const res = await api.get('auth/user/');
          setUser(res.data);
        } catch (error) {
          console.error("Token invalid or expired", error);
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set('access_token', token, { expires: 1 }); // 1 day
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
