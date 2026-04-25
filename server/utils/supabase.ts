import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const useSupabaseServer = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = useRuntimeConfig();

  supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey);

  return supabaseClient;
};
