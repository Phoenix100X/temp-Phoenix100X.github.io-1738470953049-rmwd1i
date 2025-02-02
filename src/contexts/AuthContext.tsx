import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Profile['role'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function retry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0 && err instanceof Error && err.message.includes('Failed to fetch')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | AuthError | null>(null);
  const [initialized, setInitialized] = useState(false);

  const createProfile = async (userId: string, role: UserRole = 'parent') => {
    try {
      const { data, error: profileError } = await retry(() =>
        supabase
          .from('profiles')
          .insert([{ 
            id: userId, 
            role,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()
      );

      if (profileError) {
        throw profileError;
      }

      return data;
    } catch (err) {
      console.error('Profile creation error:', err);
      throw err;
    }
  };

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await retry(() => 
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()
      );

      if (fetchError) {
        throw fetchError;
      }

      // If profile exists, return it
      if (existingProfile) {
        setProfile(existingProfile);
        setError(null);
        return existingProfile;
      }

      // If no profile exists, create one
      const newProfile = await createProfile(userId);
      setProfile(newProfile);
      setError(null);
      return newProfile;
    } catch (err) {
      console.error('Profile fetch/create error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch/create profile'));
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user && mounted) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          if (mounted && userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchProfile(session.user.id);
          if (mounted && userProfile) {
            setProfile(userProfile);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signInError } = await retry(() =>
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })
      );

      if (signInError) {
        throw signInError;
      }

      if (!data.user) {
        throw new Error('No user returned from authentication');
      }

      setUser(data.user);
      const userProfile = await fetchProfile(data.user.id);
      if (!userProfile) {
        throw new Error('Failed to load user profile');
      }
      setProfile(userProfile);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole = 'parent') => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signUpError } = await retry(() =>
        supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`
          }
        })
      );

      if (signUpError) {
        throw signUpError;
      }

      if (!data.user) {
        throw new Error('No user returned from registration');
      }

      await createProfile(data.user.id, role);
      // Don't set user or profile until email is verified
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: signOutError } = await retry(() => supabase.auth.signOut());
      if (signOutError) throw signOutError;
      
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err instanceof Error ? err : new Error('Failed to sign out'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  if (!initialized) {
    return null;
  }

  const value = {
    user,
    profile,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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