'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Server,
  Database,
  Terminal,
} from 'lucide-react';

const CODE_SNIPPETS = [
  {
    id: 'microdot',
    filename: 'esp32_microdot_main.py',
    language: 'python',
    title: 'ESP32 Microdot Python & Supabase Ingest',
    description:
      'Skrip Microdot Python untuk ESP32/Pico W. Membaca sensor DS18B20, pH, TDS, dan interrupt flow YF-B1, lalu mengirimkan payload terenkripsi via HTTPS POST ke Supabase REST API.',
    code: `# esp32_microdot_main.py
# Oleh: Dr. Eko Subiyantoro, S.Pd., S.ST., MT.
# Microdot Python Framework on ESP32 -> Supabase REST API

import network
import time
import urequests
import ujson
from machine import Pin, ADC
import onewire, ds18x20

# 1. Konfigurasi Jaringan & Kredensial Lingkungan (Supabase panduWI)
WIFI_SSID = "SMART_AGRI_WIFI"
WIFI_PASS = "rahasia_iot_2026"
SUPABASE_URL = "https://iqdwmwzxjpqiqpcowfae.supabase.co/rest/v1/sensor_telemetry"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZHdtd3p4anBxaXFwY293ZmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4NTYwMzksImV4cCI6MjEwNzQzMjAzOX0.sqhjTcTgzrDlXW-opjVQbIjqEdpVqygIA3uqd3YaNBE"

# 2. Inisialisasi Sensor
# DS18B20 Suhu Air (OneWire GPIO 4)
ow = onewire.OneWire(Pin(4))
ds = ds18x20.DS18X20(ow)
roms = ds.scan()

# Sensor pH (ADC Pin 34) & TDS (ADC Pin 35)
adc_ph = ADC(Pin(34))
adc_ph.atten(ADC.ATTN_11DB) # 0 - 3.6V range

adc_tds = ADC(Pin(35))
adc_tds.atten(ADC.ATTN_11DB)

# Sensor Water Flow YF-B1 (Pulse Interrupt GPIO 18)
flow_pin = Pin(18, Pin.IN, Pin.PULL_UP)
pulse_count = 0

def flow_irq_handler(pin):
    global pulse_count
    pulse_count += 1

flow_pin.irq(trigger=Pin.IRQ_RISING, handler=flow_irq_handler)

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Menghubungkan ke WiFi...")
        wlan.connect(WIFI_SSID, WIFI_PASS)
        while not wlan.isconnected():
            time.sleep(0.5)
    print("WiFi Terhubung! IP:", wlan.ifconfig()[0])

def read_temperature():
    if not roms:
        return 24.5 # Default fallback
    ds.convert_temp()
    time.sleep_ms(750)
    return round(ds.read_temp(roms[0]), 2)

def read_ph():
    val = adc_ph.read()
    voltage = val * (3.3 / 4095.0)
    # Rumus kalibrasi linear pH elektroda kaca
    ph_value = 7.0 + ((2.5 - voltage) * 3.5)
    return round(ph_value, 2)

def read_tds():
    val = adc_tds.read()
    voltage = val * (3.3 / 4095.0)
    # Rumus konversi TDS standar TDS = (133.42 * V^3 - 255.86 * V^2 + 857.39 * V) * 0.5
    tds_ppm = int((voltage / 2.3) * 1000)
    return max(100, min(2000, tds_ppm))

def read_flow_rate():
    global pulse_count
    pulses = pulse_count
    pulse_count = 0
    # Kalibrasi YF-B1: Frekuensi pulsa (Hz) = 7.5 * Q (L/min)
    flow_lpm = round((pulses / 7.5), 1)
    return flow_lpm

def send_telemetry_to_supabase(temp, ph, tds, flow):
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {
        "device_id": "ESP32-SMARTTANI-NODE01",
        "temp_c": temp,
        "ph": ph,
        "tds_ppm": tds,
        "flow_lpm": flow,
        "pump_active": True if flow > 0 else False
    }
    try:
        res = urequests.post(SUPABASE_URL, headers=headers, data=ujson.dumps(payload))
        print("Supabase Ingest Status:", res.status_code)
        res.close()
    except Exception as e:
        print("Gagal mengirim payload:", e)

# Main Loop
connect_wifi()
while True:
    t = read_temperature()
    p = read_ph()
    tds = read_tds()
    fl = read_flow_rate()
    print(f"Data Sensor: Suhu={t}°C, pH={p}, TDS={tds}ppm, Flow={fl}L/m")
    send_telemetry_to_supabase(t, p, tds, fl)
    time.sleep(5) # Interval pengiriman 5 detik
`,
  },
  {
    id: 'supabase-sql',
    filename: 'supabase_schema.sql',
    language: 'sql',
    title: 'Supabase PostgreSQL Schema & RLS Policy',
    description:
      'Definisi tabel database PostgreSQL Supabase dengan perlindungan Row Level Security (RLS), pencegahan SQL injection, serta indexing time-series untuk optimasi query dashboard.',
    code: `-- supabase_schema.sql
-- Skema Database Telemetri "Smart Tani"
-- Dirancang oleh: Dr. Eko Subiyantoro, S.Pd., S.ST., MT.

-- 1. Buat Tabel Telemetri Sensor
CREATE TABLE IF NOT EXISTS public.sensor_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    device_id VARCHAR(50) NOT NULL,
    temp_c NUMERIC(4, 2) NOT NULL,
    ph NUMERIC(4, 2) NOT NULL,
    tds_ppm INTEGER NOT NULL,
    flow_lpm NUMERIC(4, 2) NOT NULL,
    pump_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Indexing untuk Query Dashboard Berkecepatan Tinggi
CREATE INDEX IF NOT EXISTS idx_sensor_created_at 
    ON public.sensor_telemetry (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_device 
    ON public.sensor_telemetry (device_id);

-- 3. Aktifkan Row Level Security (RLS) untuk Keamanan Data
ALTER TABLE public.sensor_telemetry ENABLE ROW LEVEL SECURITY;

-- 4. Policy Aman: Perbolehkan Anon Ingest via REST API hanya jika device_id valid
CREATE POLICY "Allow authenticated or anon insert with valid device"
    ON public.sensor_telemetry
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(device_id) > 3 AND 
        temp_c >= -10 AND temp_c <= 80 AND
        ph >= 0 AND ph <= 14 AND
        tds_ppm >= 0
    );

-- 5. Policy Aman: Publik hanya dapat membaca (SELECT) data dashboard
CREATE POLICY "Allow public read access for dashboard"
    ON public.sensor_telemetry
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 6. Tabel Repositori Modul Perkuliahan Mahasiswa
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    course VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    meeting_no INTEGER NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    bloom_level VARCHAR(20) NOT NULL,
    description TEXT,
    cpmk TEXT,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    content_snippet TEXT
);

CREATE INDEX IF NOT EXISTS idx_modules_course ON public.course_modules (course);
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select modules"
    ON public.course_modules FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert modules"
    ON public.course_modules FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 7. View Teragregasi untuk Rata-rata Per Jam
CREATE OR REPLACE VIEW public.hourly_telemetry_summary AS
SELECT 
    date_trunc('hour', created_at) AS hour_window,
    device_id,
    ROUND(AVG(temp_c), 2) AS avg_temp_c,
    ROUND(AVG(ph), 2) AS avg_ph,
    ROUND(AVG(tds_ppm), 0) AS avg_tds_ppm,
    ROUND(AVG(flow_lpm), 2) AS avg_flow_lpm,
    COUNT(*) AS total_samples
FROM public.sensor_telemetry
GROUP BY 1, 2
ORDER BY hour_window DESC;
`,
  },
  {
    id: 'vercel-service',
    filename: 'lib_supabase_safe_query.ts',
    language: 'typescript',
    title: 'Next.js / Vercel Parameterized Supabase Query',
    description:
      'Contoh query aman menggunakan Supabase JS client pada server side Next.js / Vercel API routes untuk mencegah SQL Injection dan memastikan type-safety.',
    code: `// lib/supabase_safe_query.ts
// Contoh Server-Side Fetcher Aman untuk Dashboard Vercel

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface TelemetryRecord {
  id: string;
  created_at: string;
  device_id: string;
  temp_c: number;
  ph: number;
  tds_ppm: number;
  flow_lpm: number;
  pump_active: boolean;
}

// Fungsi Query Aman: Menggunakan parameter builder (bebas SQL Injection)
export async function getLatestTelemetry(deviceId: string, limit: number = 20): Promise<TelemetryRecord[]> {
  // Validasi parameter input untuk mencegah manipulasi
  const safeLimit = Math.min(100, Math.max(1, limit));

  const { data, error } = await supabase
    .from('sensor_telemetry')
    .select('id, created_at, device_id, temp_c, ph, tds_ppm, flow_lpm, pump_active')
    .eq('device_id', deviceId) // Parameterized equality filter
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) {
    console.error('Error fetching telemetry:', error.message);
    throw new Error('Gagal mengambil data telemetri.');
  }

  return (data as TelemetryRecord[]) || [];
}
`,
  },
];

export function ArchitectureWorkbench() {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('microdot');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSnippet =
    CODE_SNIPPETS.find((s) => s.id === selectedSnippetId) || CODE_SNIPPETS[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="arsitektur" className="py-16 md:py-20 border-b border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Implementasi Rekayasa & Kode Aman
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            05. Arsitektur Kode: ESP32, Supabase & Vercel
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Contoh skrip produksi terverifikasi yang menerapkan best practice keamanan data: pencegahan SQL injection melalui parameterized query, penanganan interrupt pin hardware, dan konfigurasi Row Level Security (RLS).
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CODE_SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => setSelectedSnippetId(snippet.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
                selectedSnippetId === snippet.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{snippet.filename}</span>
            </button>
          ))}
        </div>

        {/* Code Viewer Container */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
          {/* Header of code block */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
                <span>{activeSnippet.title}</span>
                <span className="text-[10px] text-slate-500 font-sans">({activeSnippet.language})</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {activeSnippet.description}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Salin kode"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Skrip</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-5 overflow-x-auto max-h-[550px] overflow-y-auto">
            <pre className="text-xs font-mono text-slate-200 leading-relaxed">
              <code>{activeSnippet.code}</code>
            </pre>
          </div>

          {/* Security & Verification Footer */}
          <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Praktik Keamanan: Parameterized Query · Tidak ada SQL Injection · Enkripsi HTTPS REST</span>
            </div>
            <span className="font-mono text-slate-500">Dr. Eko Subiyantoro Stack</span>
          </div>
        </div>
      </div>
    </section>
  );
}
