import { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}
