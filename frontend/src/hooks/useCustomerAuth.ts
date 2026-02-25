import { useState, useCallback } from 'react';

const CUSTOMER_TOKEN_KEY = 'customerToken';

export function useCustomerAuth() {
  const [customerToken, setCustomerToken] = useState<string | null>(() => {
    return localStorage.getItem(CUSTOMER_TOKEN_KEY);
  });

  const login = useCallback((token: string) => {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    setCustomerToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    setCustomerToken(null);
  }, []);

  return {
    customerToken,
    isAuthenticated: !!customerToken,
    login,
    logout,
  };
}
