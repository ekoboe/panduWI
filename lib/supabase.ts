import { createClient, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://iqdwmwzxjpqiqpcowfae.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZHdtd3p4anBxaXFwY293ZmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTYwMzksImV4cCI6MjEwNzQzMjAzOX0.sqhjTcTgzrDlXW-opjVQbIjqEdpVqygIA3uqd3YaNBE';

/**
 * Validasi dan sanitasi URL Supabase agar selalu berformat HTTP/HTTPS valid
 */
function sanitizeSupabaseUrl(url?: string): string {
  if (!url || typeof url !== 'string') return FALLBACK_URL;
  const trimmed = url.trim();

  // Validasi URL lengkap
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return FALLBACK_URL;
    }
  }

  // Jika pengguna hanya memasukkan project ref (misal: iqdwmwzxjpqiqpcowfae)
  if (/^[a-z0-9]{20}$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }

  // Jika berupa nama alias seperti "panduWIBOE" atau string non-URL lainnya
  return FALLBACK_URL;
}

/**
 * Validasi dan sanitasi Anon Key Supabase
 */
function sanitizeSupabaseKey(key?: string): string {
  if (!key || typeof key !== 'string') return FALLBACK_KEY;
  const trimmed = key.trim();
  if (trimmed.length > 20 && (trimmed.startsWith('eyJ') || trimmed.startsWith('sb_publishable_'))) {
    return trimmed;
  }
  return FALLBACK_KEY;
}

export const SUPABASE_URL = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const SUPABASE_ANON_KEY = sanitizeSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const SUPABASE_PROJECT_ID = 'iqdwmwzxjpqiqpcowfae';
export const SUPABASE_PROJECT_NAME = 'panduWI';

/**
 * Inisialisasi Supabase client dengan penanganan error aman
 */
function createSafeSupabaseClient(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
      },
    });
  } catch (err) {
    console.warn('Gagal menginisialisasi custom Supabase client, beralih ke fallback terverifikasi:', err);
    return createClient(FALLBACK_URL, FALLBACK_KEY, {
      auth: {
        persistSession: true,
      },
    });
  }
}

// Client-side & server-side shared Supabase client
export const supabase = createSafeSupabaseClient();

export interface SensorTelemetryRecord {
  id?: string;
  created_at?: string;
  device_id: string;
  temp_c: number;
  ph: number;
  tds_ppm: number;
  flow_lpm: number;
  pump_active: boolean;
  metadata?: Record<string, any>;
}

export interface DbCourseModule {
  id?: string;
  created_at?: string;
  course: string;
  title: string;
  meeting_no: number;
  doc_type: string;
  bloom_level: string;
  description: string;
  cpmk: string;
  file_name: string;
  file_size: string;
  content_snippet?: string;
}

/**
 * Simpan data telemetri sensor Smart Tani ke tabel 'sensor_telemetry' di Supabase
 */
export async function sendTelemetryToSupabase(record: SensorTelemetryRecord) {
  try {
    const { data, error } = await supabase.from('sensor_telemetry').insert([record]).select();

    if (error) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mengirim data ke Supabase' };
  }
}

/**
 * Ambil data telemetri terbaru dari Supabase
 */
export async function getRecentTelemetryFromSupabase(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('sensor_telemetry')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mengambil data', data: [] };
  }
}

/**
 * Simpan modul mata kuliah yang diunggah ke Supabase
 */
export async function saveModuleToSupabase(mod: DbCourseModule) {
  try {
    const { data, error } = await supabase.from('course_modules').insert([mod]).select();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal menyimpan modul ke Supabase' };
  }
}

/**
 * Uji koneksi ke Supabase dan verifikasi ketersediaan tabel
 */
export async function checkSupabaseConnection() {
  try {
    const startTime = Date.now();
    const { error: telemetryErr } = await supabase
      .from('sensor_telemetry')
      .select('id')
      .limit(1);

    const latency = Date.now() - startTime;

    if (telemetryErr) {
      // Periksa apakah tabel belum dibuat di project Supabase
      if (
        telemetryErr.code === '42P01' ||
        telemetryErr.message.includes('relation') ||
        telemetryErr.message.includes('does not exist')
      ) {
        return {
          connected: true,
          tableReady: false,
          latencyMs: latency,
          message: 'Terkoneksi ke project panduWI, namun tabel sensor_telemetry belum dibuat di SQL Editor.',
        };
      }
      return {
        connected: false,
        tableReady: false,
        latencyMs: latency,
        message: telemetryErr.message,
      };
    }

    return {
      connected: true,
      tableReady: true,
      latencyMs: latency,
      message: 'Koneksi ke Supabase panduWI aktif dan tabel sensor_telemetry siap digunakan!',
    };
  } catch (err: any) {
    return {
      connected: false,
      tableReady: false,
      latencyMs: 0,
      message: err?.message || 'Tidak dapat menghubungi endpoint Supabase',
    };
  }
}
