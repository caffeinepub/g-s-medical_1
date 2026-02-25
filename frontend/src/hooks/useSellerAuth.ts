import { useState, useCallback } from 'react';

const SELLER_TOKEN_KEY = 'sellerToken';

export function useSellerAuth() {
  const [sellerToken, setSellerToken] = useState<string | null>(() => {
    return localStorage.getItem(SELLER_TOKEN_KEY);
  });

  const login = useCallback((token: string) => {
    localStorage.setItem(SELLER_TOKEN_KEY, token);
    setSellerToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SELLER_TOKEN_KEY);
    setSellerToken(null);
  }, []);

  return {
    sellerToken,
    isAuthenticated: !!sellerToken,
    login,
    logout,
  };
}
