// Environment utility functions
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Get the correct API URL for the current environment
export const getApiUrl = (): string => {
  // If NEXT_PUBLIC_API_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In production, use the same domain as the current page
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  
  // Fallback for server-side rendering
  return isProduction ? '/api' : 'http://localhost:3000/api';
};

// Get the correct app URL for the current environment
export const getAppUrl = (): string => {
  // If NEXT_PUBLIC_APP_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // In production, use the same domain as the current page
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side rendering
  return isProduction ? '' : 'http://localhost:3000';
};

// Debug function to help troubleshoot environment issues
export const debugEnvironment = () => {
  if (typeof window !== 'undefined') {
    console.log('Environment Debug Info:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    console.log('- window.location.origin:', window.location.origin);
    console.log('- Detected API URL:', getApiUrl());
    console.log('- Detected App URL:', getAppUrl());
  }
}; 