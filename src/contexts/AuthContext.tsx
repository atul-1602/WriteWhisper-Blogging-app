'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (credentials: LoginData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profileData: ProfileData) => Promise<{ success: boolean; error?: string }>;
  changePassword: (passwordData: PasswordData) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: true,
  error: null
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', state.token);
      }
    } else {
      delete api.defaults.headers.common['Authorization'];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await api.get('/auth/me');
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.data,
              token: state.token
            }
          });
        } catch {
          dispatch({ type: 'AUTH_FAILURE', payload: 'Token expired' });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    loadUser();
  }, [state.token]);

  // Register user
  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await api.post('/auth/register', userData);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: response.data.data.token
        }
      });
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { error?: string } } };
      const message = errorResponse?.response?.data?.error || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials: LoginData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await api.post('/auth/login', credentials);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: response.data.data.token
        }
      });
      
      toast.success('Welcome back!');
      return { success: true };
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { error?: string } } };
      const message = errorResponse?.response?.data?.error || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (profileData: ProfileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      dispatch({ type: 'UPDATE_USER', payload: response.data.data });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { error?: string } } };
      const message = errorResponse?.response?.data?.error || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (passwordData: PasswordData) => {
    try {
      await api.put('/auth/change-password', passwordData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error: unknown) {
      const errorResponse = error as { response?: { data?: { error?: string } } };
      const message = errorResponse?.response?.data?.error || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 