import { toast } from 'sonner';

// Error types
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  SERVER = 'server',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown'
}

// Error response structure
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: any;
  status?: number;
}

/**
 * Handles API errors and provides appropriate user feedback
 * @param error The error object from the API call
 * @param fallbackMessage Optional fallback message if error doesn't have a message
 * @returns Structured error response
 */
export const handleApiError = (error: any, fallbackMessage = 'An unexpected error occurred'): ErrorResponse => {
  console.error('API Error:', error);
  
  // Default error response
  const errorResponse: ErrorResponse = {
    type: ErrorType.UNKNOWN,
    message: fallbackMessage,
  };

  // Handle Axios errors
  if (error.response) {
    // Server responded with an error status
    errorResponse.status = error.response.status;
    errorResponse.details = error.response.data;
    
    // Handle specific status codes
    switch (error.response.status) {
      case 401:
      case 403:
        errorResponse.type = ErrorType.AUTHENTICATION;
        errorResponse.message = 'Authentication failed. Please log in again.';
        break;
      case 400:
      case 422:
        errorResponse.type = ErrorType.VALIDATION;
        errorResponse.message = error.response.data?.message || 'Invalid request data';
        break;
      case 500:
      case 502:
      case 503:
        errorResponse.type = ErrorType.SERVER;
        errorResponse.message = 'Server error. Please try again later.';
        break;
      default:
        errorResponse.message = error.response.data?.message || fallbackMessage;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorResponse.type = ErrorType.NETWORK;
    errorResponse.message = 'Network error. Please check your connection.';
  } else {
    // Error in setting up the request
    errorResponse.message = error.message || fallbackMessage;
  }

  // Show toast notification for the error
  toast.error(errorResponse.message);

  return errorResponse;
};

/**
 * Wraps an async function with error handling
 * @param asyncFn The async function to wrap
 * @param fallbackMessage Optional fallback error message
 * @returns A function that returns a Promise resolving to the result or error
 */
export const withErrorHandling = <T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  fallbackMessage?: string
) => {
  return async (...args: Args): Promise<T | null> => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleApiError(error, fallbackMessage);
      return null;
    }
  };
};