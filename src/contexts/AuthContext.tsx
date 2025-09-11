import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  client_id: string;
  created_at: string;
  updated_at: string;
  fyers_access_token?: string;
  full_name?: string;
}

interface LoginCredentials {
  identifier: string; // email or client_id
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  getFyersAuthUrl: () => Promise<string>;
  completeFyersAuth: (authCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      // Check if session token exists in localStorage
      const sessionToken = localStorage.getItem('supabase_session_token');
      
      console.log('Checking auth status, token exists:', !!sessionToken);
      
      if (!sessionToken) {
        console.log('No session token found, user not authenticated');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
      
      // Verify session with backend
      const response = await authAPI.verifySession();
      
      console.log('Session verification response:', response);
      
      if (response && response.success) {
        console.log('Session valid, user authenticated');
        setIsAuthenticated(true);
        setUser(response.user || null);
        return true;
      } else {
        // Session is invalid, clear it
        console.log('Session invalid, clearing token');
        localStorage.removeItem('supabase_session_token');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('supabase_session_token');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Starting authentication check...');
      const isAuth = await checkAuthStatus();
      console.log('AuthContext: Auth check completed, result:', isAuth);
      setIsLoading(false);
      console.log('AuthContext: Loading set to false');
    };
    
    checkAuth();
  }, []);

  // Debug log whenever auth state changes
  useEffect(() => {
    console.log('AuthContext state changed - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);
  }, [isAuthenticated, isLoading, user]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login(credentials);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Login failed');
      }
      
      // Store session token
      if (response.session_token) {
        localStorage.setItem('supabase_session_token', response.session_token);
      }
      
      setIsAuthenticated(true);
      setUser(response.user || null);
      toast.success('Successfully logged in');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(`Login failed: ${errorMessage}`);
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.register(credentials);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Registration failed');
      }
      
      toast.success('Registration successful! Please log in.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(`Registration failed: ${errorMessage}`);
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getFyersAuthUrl = async (): Promise<string> => {
    try {
      const response = await authAPI.getFyersAuthUrl();
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to get Fyers auth URL');
      }
      
      return response.auth_url;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get Fyers auth URL';
      toast.error(errorMessage);
      console.error('Fyers auth URL error:', error);
      throw error;
    }
  };

  const completeFyersAuth = async (authCode: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.completeFyersAuth(authCode);
      
      if (!response || !response.success) {
        throw new Error(response?.message || 'Failed to complete Fyers authentication');
      }
      
      // Update user data with Fyers client ID
      setUser(response.user || null);
      toast.success('Fyers account linked successfully!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete Fyers authentication';
      toast.error(errorMessage);
      console.error('Fyers auth completion error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('supabase_session_token');
      setIsAuthenticated(false);
      setUser(null);
      toast.info('Logged out successfully');
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    checkAuthStatus,
    getFyersAuthUrl,
    completeFyersAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};