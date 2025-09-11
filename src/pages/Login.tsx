import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Shield, TrendingUp, Lock } from 'lucide-react';

const Login = () => {
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.identifier || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginData);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await register({ email: registerData.email, password: registerData.password });
      // Success message is shown in AuthContext
      // Reset form
      setRegisterData({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trade Mentor
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              🔒 Secure access to your personalized trading dashboard
            </CardDescription>
          </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Email or Client ID
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or client ID"
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Secure Login
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    <Shield className="inline w-4 h-4 mr-1" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a strong password (min 6 characters)"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    minLength={6}
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-12 border-2 focus:border-blue-500 transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating your account...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Create Secure Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-1">
          <Shield className="w-4 h-4" />
          Your data is protected with enterprise-grade security
        </p>
      </div>
    </div>
    </div>
  );
};

export default Login;