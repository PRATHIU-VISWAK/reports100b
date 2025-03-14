import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      storage: {
        getItem: async (key: string) => {
          const allCookies = await cookies();
          return allCookies.get(key)?.value || null;
        },
        setItem: async (key: string, value: string) => {
          // Implement setItem logic if needed
        },
        removeItem: async (key: string) => {
          // Implement removeItem logic if needed
        }
      }
    }
  });
};