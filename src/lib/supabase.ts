import { createClient } from '@supabase/supabase-js';

type ViteMeta = ImportMeta & { env?: Record<string, string | undefined> };

const viteEnv = (import.meta as ViteMeta).env ?? {};
const urlKey = ['VITE', 'SUPABASE', 'URL'].join('_');
const anonKey = ['VITE', 'SUPABASE', 'ANON', 'KEY'].join('_');

const supabaseUrl = viteEnv[urlKey];
const supabaseAnonKey = viteEnv[anonKey];

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
