import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getConfig } from "./config";

let supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    const { supabaseUrl, supabaseKey } = getConfig();
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};
