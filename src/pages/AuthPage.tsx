import { Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export default function AuthPage() {
  const isLogin = localStorage.getItem('isLogin') === 'true';

  if (isLogin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthForm />
    </div>
  );
} 