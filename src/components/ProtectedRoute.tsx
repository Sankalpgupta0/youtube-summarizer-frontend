import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLogin = localStorage.getItem('isLogin') === 'true';

  useEffect(() => {
    if (!isLogin) {
      toast.error('Please sign in to access this page', {
        id: 'auth-required',
        duration: 3000,
        position: 'top-center',
      });
    }
  }, [isLogin]);

  if (!isLogin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 