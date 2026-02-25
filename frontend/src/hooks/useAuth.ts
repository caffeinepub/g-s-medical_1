import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'gs_medical_admin_auth';
const AUTH_TOKEN = 'gs_medical_admin_token_2024';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === AUTH_TOKEN;
  });

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(stored === AUTH_TOKEN);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    if (email === 'gauravsaswade2009@gmail.com' && password === 'p1love2g') {
      localStorage.setItem(AUTH_KEY, AUTH_TOKEN);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
