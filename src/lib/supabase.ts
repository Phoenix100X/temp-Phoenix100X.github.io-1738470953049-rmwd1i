import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'kidcare-connect-auth',
    storage: window.localStorage,
    flowType: 'pkce',
    debug: import.meta.env.DEV
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'kidcare-connect'
    }
  }
});

// Add auth state change logging and error handling
supabase.auth.onAuthStateChange((event, session) => {
  if (import.meta.env.DEV) {
    console.log('Auth state change:', event, session?.user?.id);
  }

  if (event === 'TOKEN_REFRESHED' && !session) {
    console.error('Token refresh failed');
  }

  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('kidcare-connect-auth');
  }
});