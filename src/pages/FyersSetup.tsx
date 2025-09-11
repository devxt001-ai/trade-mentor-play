import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import FyersAuth from '@/components/FyersAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FyersSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleComplete = () => {
    // Redirect to dashboard after successful Fyers setup
    navigate('/dashboard');
  };

  const handleSkip = () => {
    // Allow users to skip Fyers setup and go to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Setup
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Welcome, {user?.email}! Connect your Fyers account to unlock all trading features.
            </p>
            <p className="text-sm text-gray-500">
              Your Client ID: <span className="font-mono font-semibold">{user?.client_id || 'Not assigned'}</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Fyers Auth Component */}
          <div className="flex-1">
            <FyersAuth onComplete={handleComplete} />
          </div>

          {/* Information Panel */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Why Connect Fyers?</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Access real-time market data and live stock prices</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Place buy and sell orders directly from the platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>View your portfolio and track performance</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Get personalized trading insights and recommendations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Security & Privacy</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Your Fyers credentials are never stored on our servers</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>All connections use secure OAuth 2.0 authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>You can revoke access anytime from your Fyers account</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>We only access data necessary for trading operations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you encounter any issues during the setup process, you can:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Contact our support team</li>
                <li>• Check the Fyers API documentation</li>
                <li>• Skip setup for now and complete it later</li>
              </ul>
              <Button 
                variant="outline" 
                onClick={handleSkip}
                className="mt-4 w-full"
              >
                Skip Setup (Complete Later)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FyersSetup;