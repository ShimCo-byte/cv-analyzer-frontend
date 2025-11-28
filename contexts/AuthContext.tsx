'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signUp, signOut, getCurrentUser, updateUserProfile } from '@/lib/api';

interface User {
  id: string;
  email: string;
  profile?: any;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, profile?: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: any) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Using the same keys as existing code for compatibility
const SESSION_KEY = 'sessionId';
const USER_KEY = 'userEmail';
const PROFILE_KEY = 'userProfile';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionId = localStorage.getItem(SESSION_KEY);
        const savedEmail = localStorage.getItem(USER_KEY);
        const savedProfile = localStorage.getItem(PROFILE_KEY);

        if (sessionId) {
          // Try to verify session with backend
          const userData = await getCurrentUser(sessionId);
          if (userData) {
            // Merge with local profile if backend profile is empty
            if (savedProfile && (!userData.profile || Object.keys(userData.profile).length === 0)) {
              userData.profile = JSON.parse(savedProfile);
            }
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn(email, password);
      localStorage.setItem(SESSION_KEY, result.sessionId);
      localStorage.setItem(USER_KEY, result.user.email);

      // If user has a profile from server, save it locally
      if (result.user.profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(result.user.profile));
      }

      setUser(result.user);

      // Migrate localStorage profile to user account if exists
      const localProfile = localStorage.getItem(PROFILE_KEY);
      if (localProfile && (!result.user.profile || Object.keys(result.user.profile).length === 0)) {
        const profile = JSON.parse(localProfile);
        await updateUserProfile(result.sessionId, profile);
        setUser({ ...result.user, profile });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, profile?: any) => {
    setLoading(true);
    setError(null);
    try {
      // If no profile provided, check localStorage for existing profile
      let userProfile = profile;
      if (!userProfile) {
        const localProfile = localStorage.getItem(PROFILE_KEY);
        if (localProfile) {
          userProfile = JSON.parse(localProfile);
        }
      }

      const result = await signUp(email, password, userProfile);
      localStorage.setItem(SESSION_KEY, result.sessionId);
      localStorage.setItem(USER_KEY, result.user.email);
      if (userProfile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
      }
      setUser(result.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        await signOut(sessionId);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (profile: any) => {
    setError(null);
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        // Not logged in, just save to localStorage
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
        return;
      }

      const result = await updateUserProfile(sessionId, profile);
      const updatedUser = { ...user!, profile: result.profile || profile };
      setUser(updatedUser);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
