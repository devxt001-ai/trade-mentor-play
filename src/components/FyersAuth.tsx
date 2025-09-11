import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface FyersAuthProps {
  onComplete?: () => void;
}

const FyersAuth: React.FC<FyersAuthProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState('');
  const [step, setStep] = useState<'initial' | 'waiting' | 'code-entry' | 'completed'>('initial');
  const { getFyersAuthUrl, completeFyersAuth, user } = useAuth();

  // Check if user already has Fyers authentication
  const hasFyersAuth = user?.client_id && user.client_id.length > 0;

  useEffect(() => {
    if (hasFyersAuth) {
      setStep('completed');
    }
  }, [hasFyersAuth]);

  const handleStartAuth = async () => {
    setIsLoading(true);
    try {
      const url = await getFyersAuthUrl();
      setAuthUrl(url);
      setStep('waiting');
      
      // Open Fyers auth URL in new window
      window.open(url, '_blank', 'width=600,height=700,scrollbars=yes,resizable=yes');
      
      toast.info('Complete the authorization in the new window, then return here to enter the auth code.');
    } catch (error) {
      console.error('Failed to get Fyers auth URL:', error);
      toast.error('Failed to start Fyers authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteAuth = async () => {
    if (!authCode.trim()) {
      toast.error('Please enter the authorization code');
      return;
    }

    setIsLoading(true);
    try {
      await completeFyersAuth(authCode.trim());
      setStep('completed');
      onComplete?.();
    } catch (error) {
      console.error('Failed to complete Fyers auth:', error);
      toast.error('Failed to complete Fyers authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStep('initial');
    setAuthUrl(null);
    setAuthCode('');
  };

  if (step === 'completed') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-green-900">
            Fyers Account Connected
          </CardTitle>
          <CardDescription className="text-green-700">
            Your Fyers account has been successfully linked to your Trade Mentor account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You can now access all trading features including live market data, order placement, and portfolio management.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold">
          Connect Your Fyers Account
        </CardTitle>
        <CardDescription>
          Link your Fyers trading account to access live market data and trading features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'initial' && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You'll be redirected to Fyers to authorize Trade Mentor to access your account. This is secure and you can revoke access anytime.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleStartAuth} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect to Fyers
                </>
              )}
            </Button>
          </>
        )}

        {step === 'waiting' && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete the authorization in the Fyers window, then click "I've completed authorization" below.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setStep('code-entry')} 
                className="flex-1"
              >
                I've completed authorization
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRetry}
              >
                Retry
              </Button>
            </div>
            {authUrl && (
              <Button 
                variant="outline" 
                onClick={() => window.open(authUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Reopen Fyers Authorization
              </Button>
            )}
          </>
        )}

        {step === 'code-entry' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="auth-code">Authorization Code</Label>
              <Input
                id="auth-code"
                type="text"
                placeholder="Enter the authorization code from Fyers"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Copy the authorization code from the Fyers page and paste it above.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button 
                onClick={handleCompleteAuth} 
                className="flex-1" 
                disabled={isLoading || !authCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                disabled={isLoading}
              >
                Start Over
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FyersAuth;