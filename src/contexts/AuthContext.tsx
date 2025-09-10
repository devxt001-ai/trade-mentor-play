import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, AuthResponse, LoginCredentials } from '../services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the context for use in hooks
export { AuthContext };

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook moved to separate file to fix Fast Refresh warnings

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  // Define checkAuthStatus function before using it in useEffect
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('fyers_token');
      
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }
      
      // Verify token with backend
      const response = await authAPI.verifyToken();
      
      if (response && response.valid) {
        setIsAuthenticated(true);
        setUser(response.user || null);
        return true;
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('fyers_token');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Start login process
      const loginResponse = await authAPI.login(credentials);
      
      if (!loginResponse || !loginResponse.success) {
        throw new Error(loginResponse?.message || 'Login failed');
      }
      
      // Get access token
      const tokenResponse = await authAPI.getToken();
      
      if (!tokenResponse || !tokenResponse.success) {
        throw new Error('Failed to get access token');
      }
      
      setIsAuthenticated(true);
      toast.success('Successfully logged in to Fyers');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(`Login failed: ${errorMessage}`);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};