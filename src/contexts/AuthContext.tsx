import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false 
      };
    case 'LOGIN_FAILURE':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: action.payload 
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.register(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};