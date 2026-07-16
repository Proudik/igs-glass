'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, AuthState, UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfile(userId: string, retries = 3): Promise<User | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, company, phone, role, created_at, last_sign_in_at')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        company: data.company ?? undefined,
        phone: data.phone ?? undefined,
        role: (data.role as UserRole) ?? 'customer',
        addresses: [],
        createdAt: data.created_at,
        lastSignInAt: data.last_sign_in_at ?? undefined,
      };
    }
    // Retry after a short delay — RLS token may not have propagated yet
    if (attempt < retries - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    // On mount, restore session from storage
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        const meta = session.user.user_metadata ?? {};
        const profile = await fetchProfile(session.user.id);
        if (!mounted) return;

        // Use profile if available, otherwise fall back to auth metadata
        const user: User = profile ?? {
          id: session.user.id,
          email: session.user.email ?? '',
          firstName: meta.firstName ?? '',
          lastName: meta.lastName ?? '',
          company: meta.company,
          phone: meta.phone,
          role: 'customer' as UserRole,
          addresses: [],
          createdAt: session.user.created_at,
        };

        setState({ user, isAuthenticated: true, isLoading: false });
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    // Only handle sign-out here. Sign-in state is set directly by signIn()/signUp()
    // to avoid a race condition where onAuthStateChange fires and clears state
    // mid-navigation.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setState((s) => ({ ...s, isLoading: false }));
      return { error: 'Invalid email or password.' };
    }

    if (!data.user) {
      setState((s) => ({ ...s, isLoading: false }));
      return { error: 'Sign-in failed. Please try again.' };
    }

    // Build user from auth data directly — querying profiles right after
    // signInWithPassword can race with RLS token propagation and return null.
    const meta = data.user.user_metadata ?? {};
    const user: User = {
      id: data.user.id,
      email: data.user.email ?? email,
      firstName: meta.firstName ?? '',
      lastName: meta.lastName ?? '',
      company: meta.company,
      phone: meta.phone,
      role: 'customer',
      addresses: [],
      createdAt: data.user.created_at,
    };

    // Best-effort: fetch profile to get the real role (needed for admin access)
    const profile = await fetchProfile(data.user.id);
    if (profile) {
      user.role = profile.role;
      user.company = profile.company ?? user.company;
      user.phone = profile.phone ?? user.phone;
    }

    setState({ user, isAuthenticated: true, isLoading: false });
    return {};
  }, []);

  const signUp = useCallback(async (data: SignUpData) => {
    setState((s) => ({ ...s, isLoading: true }));
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          phone: data.phone,
        },
      },
    });
    if (error) {
      setState((s) => ({ ...s, isLoading: false }));
      return { error: error.message };
    }

    if (signUpData.user) {
      const meta = signUpData.user.user_metadata ?? {};
      const user: User = {
        id: signUpData.user.id,
        email: signUpData.user.email ?? data.email,
        firstName: meta.firstName ?? '',
        lastName: meta.lastName ?? '',
        company: meta.company,
        phone: meta.phone,
        role: 'customer',
        addresses: [],
        createdAt: signUpData.user.created_at,
      };

      // Best-effort: fetch the profile once the trigger has had time to run
      await new Promise((r) => setTimeout(r, 600));
      const profile = await fetchProfile(signUpData.user.id);
      if (profile) {
        user.role = profile.role;
        user.company = profile.company ?? user.company;
        user.phone = profile.phone ?? user.phone;
      }

      setState({ user, isAuthenticated: true, isLoading: false });
    } else {
      setState((s) => ({ ...s, isLoading: false }));
    }
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return {};
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
