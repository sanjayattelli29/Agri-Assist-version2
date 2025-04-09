
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wadzqoyuctednxhymcju.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhZHpxb3l1Y3RlZG54aHltY2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NTczNTcsImV4cCI6MjA1NDUzMzM1N30.M7igIqkuvtqgt9Q-tme2mUQZ851_stijI4S8VVu3p-g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'agri-assist-admin',
    },
  },
});
