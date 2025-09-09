import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      
      if (response.valid) {
        setIsAuthenticated(true);
        return true;
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('fyers_token');
        setIsAuthenticated(false);
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

  const login = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Start login process
      const loginResponse = await authAPI.login();
      
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || 'Login failed');
      }
      
      // Get access token
      const tokenResponse = await authAPI.getToken();
      
      if (!tokenResponse.success) {
        throw new Error(tokenResponse.message || 'Failed to get access token');
      }
      
      setIsAuthenticated(true);
      toast.success('Successfully logged in to Fyers');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authAPI.logout();
    setIsAuthenticated(false);
    toast.info('Logged out successfully');
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};