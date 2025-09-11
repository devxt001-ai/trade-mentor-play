import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresFyers?: boolean; // Optional: require Fyers authentication as well
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresFyers = false 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);
    // Show toast notification when user tries to access protected route without auth
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, showing toast and redirecting to login');
      toast.error('🔒 Please log in to access the dashboard', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: 'white',
          fontWeight: 'bold'
        }
      });
    }
  }, [isAuthenticated, isLoading, user]);

  // Force immediate redirect if not loading and not authenticated
  if (!isLoading && !isAuthenticated) {
    console.log('FORCING REDIRECT - Not authenticated, redirecting to login');
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // This check is now handled above with forced redirect

  // Check Fyers authentication if required
  if (requiresFyers && user && !user.client_id) {
    toast.error('Fyers authentication required to access this feature', {
      duration: 4000,
      position: 'top-center',
    });
    
    // You could redirect to a Fyers auth page here
    // For now, we'll still show the component but the user will see the error
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;