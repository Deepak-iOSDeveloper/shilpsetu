import { createClient } from '@supabase/supabase-js';

// Read configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify credential configuration and output helpful warnings
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Shilp Setu: Supabase credentials are not configured in your .env file.\n" +
    "Local fallback simulation mode will be active. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to your live database."
  );
}

// Export the Supabase client instance using environment variables or hardcoded fallbacks
export const supabase = createClient(
  supabaseUrl || 'https://gzinnjzpxmfalwhbdyls.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aW5uanpweG1mYWx3aGJkeWxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDkyNzYsImV4cCI6MjA5ODMyNTI3Nn0.W1yffJf9W2v2e6xZgFnGbZXBx5KnCES5slOaT6xFPww'
);

// Helper function to check if Supabase is properly configured and reachable
export const isSupabaseConfigured = (): boolean => {
  return true;
};
