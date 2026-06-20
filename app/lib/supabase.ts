import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase-nycklar saknas! Kontrollera dina miljövariabler i Vercel.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
