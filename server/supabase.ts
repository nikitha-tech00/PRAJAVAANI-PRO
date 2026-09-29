import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseServerConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co') &&
    typeof supabaseKey === 'string' &&
    supabaseKey.length > 20 &&
    !supabaseKey.includes('your-anon-key')
  );
};

export const serverSupabase = isSupabaseServerConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Syncs complaint to Supabase if credentials are active
 */
export async function syncComplaintToSupabase(complaint: any) {
  if (!serverSupabase) return null;

  try {
    const { data, error } = await serverSupabase
      .from('complaints')
      .upsert(complaint, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase Server Sync] Error:', error.message);
      return null;
    }
    return data;
  } catch (err: any) {
    console.warn('[Supabase Server Sync] Exception:', err.message);
    return null;
  }
}
