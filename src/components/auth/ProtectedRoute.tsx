import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { useAuth0 } from '@auth0/auth0-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireSetup?: boolean;
}

export function ProtectedRoute({ children, requireSetup = false }: ProtectedRouteProps) {
  const { loading, isAuthenticated: supabaseAuthenticated } = useAuthContext();
  const { isAuthenticated: auth0Authenticated, isLoading: auth0Loading } = useAuth0();
  const isAuthenticated = supabaseAuthenticated || auth0Authenticated;
  const location = useLocation();

  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    if (requireSetup) {
      import('@/components/auth/SecureDataStore').then(({ SecureDataStore }) => {
        SecureDataStore.isSetupComplete().then(setIsSetupComplete);
      });
    }
  }, [requireSetup]);

  if (loading || auth0Loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireSetup) {
    if (isSetupComplete === null) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-muted-foreground">Validating setup...</p>
          </div>
        </div>
      );
    }

    if (!isSetupComplete) {
      return <Navigate to="/setup" replace />;
    }
  }

  return <>{children}</>;
}
