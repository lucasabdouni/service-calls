import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './loading';

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

export function ProtectedRoute({ requiredRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (
    requiredRoles &&
    !requiredRoles.some((role) => user.role.includes(role))
  ) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
