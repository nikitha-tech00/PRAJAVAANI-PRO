import { createClient } from '@supabase/supabase-js';
import type { Complaint } from './types';

// Retrieve Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid credentials are provided
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Create Supabase client instance (or a harmless mock client if unconfigured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-prajavaani.supabase.co', 'placeholder-anon-key-prajavaani-civic');

/**
 * Fetch complaints directly from Supabase with realtime status
 */
export async function fetchSupabaseComplaints(): Promise<Complaint[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('complaints')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[Supabase] Failed to fetch complaints:', error.message);
    return [];
  }

  return (data || []) as unknown as Complaint[];
}

/**
 * Insert new complaint into Supabase
 */
export async function insertSupabaseComplaint(complaint: Partial<Complaint>) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase
    .from('complaints')
    .insert([complaint])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to insert complaint:', error.message);
    throw error;
  }

  return data;
}

/**
 * Upload photographic evidence to Supabase Storage bucket 'evidence-photos'
 */
export async function uploadEvidenceToSupabase(
  file: File | Blob,
  fileName: string
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const filePath = `evidence/${Date.now()}_${fileName}`;
  const { data, error } = await supabase.storage
    .from('evidence-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('[Supabase Storage] Upload error:', error.message);
    return null;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('evidence-photos')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Listen for live civic updates in realtime
 */
export function subscribeToGrievanceUpdates(
  onUpdate: (payload: any) => void
) {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }

  const channel = supabase
    .channel('complaints-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'complaints' },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}

/**
 * Connect user login session to Supabase cloud
 */
export async function recordUserLoginToSupabase(user: {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
}) {
  if (!isSupabaseConfigured()) {
    console.log('[Supabase] Offline/Demo mode: session connected locally');
    return { success: true, mode: 'local' };
  }

  try {
    const identifier = user.phone || user.email || '9876543210';
    // 1. Upsert user into users table
    const { error: userError } = await supabase.from('users').upsert({
      id: user.id,
      name: user.name,
      phone: identifier,
      role: user.role,
      aadhaar_verified: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (userError) {
      console.warn('[Supabase] User upsert warning:', userError.message);
    }

    // 2. Insert audit log recording connection
    await supabase.from('audit_logs').insert([{
      complaint_id: 'comp-seed-1',
      action: 'USER_LOGIN_CONNECTED',
      actor_id: user.id,
      actor_name: user.name,
      actor_role: user.role,
      details: `Session connected to Supabase. Identifier: ${identifier}`,
    }]);

    // 3. Insert notification confirming connection
    await supabase.from('notifications').insert([{
      user_id: user.id,
      title: 'Supabase Cloud Connected',
      message: `Active session established for ${user.name}. Live cloud synchronization active.`,
      type: 'success',
      read: false,
    }]);

    console.log('[Supabase] User successfully connected to Supabase:', user.name);
    return { success: true, mode: 'supabase' };
  } catch (err: any) {
    console.warn('[Supabase] Failed to sync login to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Disconnect user session from Supabase cloud
 */
export async function disconnectUserFromSupabase(user?: {
  id: string;
  name: string;
  role?: string;
}) {
  if (!isSupabaseConfigured() || !user) {
    console.log('[Supabase] Offline/Demo mode: session disconnected locally');
    return { success: true, mode: 'local' };
  }

  try {
    // Record disconnect in Supabase audit ledger
    await supabase.from('audit_logs').insert([{
      complaint_id: 'comp-seed-1',
      action: 'USER_LOGOUT_DISCONNECTED',
      actor_id: user.id,
      actor_name: user.name,
      actor_role: user.role || 'citizen',
      details: `User logged out. Active session disconnected from Supabase cloud.`,
    }]);

    console.log('[Supabase] User session successfully disconnected from Supabase:', user.name);
    return { success: true, mode: 'supabase' };
  } catch (err: any) {
    console.warn('[Supabase] Failed to sync disconnect to Supabase:', err.message);
    return { success: false, error: err.message };
  }
}

