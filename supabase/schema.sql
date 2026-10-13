-- ====================================================================
-- PANDUWI (Panduan Widyaiswara Informasi) - Database Migration Script
-- Dosen / Widyaiswara: Dr. Eko Subiyantoro, S.Pd., S.ST., MT.
-- Project Supabase: panduWI (ID: iqdwmwzxjpqiqpcowfae)
-- URL: https://iqdwmwzxjpqiqpcowfae.supabase.co
-- ====================================================================

-- Pastikan extension pgcrypto aktif untuk pembuatan UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. TABEL TELEMETRI SENSOR SMART TANI (Time-Series AIoT & CPS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.sensor_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    device_id VARCHAR(50) NOT NULL DEFAULT 'ESP32-SMARTTANI-NODE01',
    temp_c NUMERIC(5, 2) NOT NULL,              -- Suhu air DS18B20 (°C)
    ph NUMERIC(4, 2) NOT NULL,                  -- pH Sensor Analog (0.00 - 14.00)
    tds_ppm INTEGER NOT NULL,                   -- Total Dissolved Solids (ppm)
    flow_lpm NUMERIC(5, 2) NOT NULL,             -- Debit aliran YF-B1 (Liter/menit)
    pump_active BOOLEAN NOT NULL DEFAULT true,  -- Status aktuator pompa
    metadata JSONB DEFAULT '{}'::jsonb,         -- Data tambahan (firmware, rssi WiFi, dll)
    CONSTRAINT check_temp_c CHECK (temp_c >= -20.00 AND temp_c <= 100.00),
    CONSTRAINT check_ph CHECK (ph >= 0.00 AND ph <= 14.00),
    CONSTRAINT check_tds CHECK (tds_ppm >= 0 AND tds_ppm <= 5000),
    CONSTRAINT check_flow CHECK (flow_lpm >= 0.00 AND flow_lpm <= 100.00)
);

-- Indexing untuk mempercepat kueri dashboard real-time & grafik time-series
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at 
    ON public.sensor_telemetry (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_telemetry_device 
    ON public.sensor_telemetry (device_id);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.sensor_telemetry ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses (RLS Policies):
-- Perbolehkan pengiriman data telemetri dari mikrokontroler (anon / authenticated)
CREATE POLICY "Allow anonymous and authenticated insert telemetry"
    ON public.sensor_telemetry
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Perbolehkan dashboard membaca data telemetri
CREATE POLICY "Allow public select telemetry"
    ON public.sensor_telemetry
    FOR SELECT
    TO anon, authenticated
    USING (true);


-- ====================================================================
-- 2. TABEL REPOSITORI MODUL PERKULIAHAN DR. EKO SUBIYANTORO
--    Mata Kuliah: Algoritma Pemrograman, Pemrograman Web, Pemrograman IoT
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    course VARCHAR(100) NOT NULL,               -- 'Algoritma Pemrograman' | 'Pemrograman Web' | 'Pemrograman IoT'
    title VARCHAR(255) NOT NULL,
    meeting_no INTEGER NOT NULL DEFAULT 1,      -- Pertemuan ke- (1 sd 16)
    doc_type VARCHAR(50) NOT NULL,              -- 'Modul Praktikum (LKM)', 'Tugas Kasus PBL', 'Diktat / Bahan Ajar', dll
    bloom_level VARCHAR(20) NOT NULL,           -- 'C1-C2', 'C3-C4', 'C4-C6'
    description TEXT,
    cpmk TEXT,                                  -- Capaian Pembelajaran Mata Kuliah
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    content_snippet TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexing repositori modul
CREATE INDEX IF NOT EXISTS idx_modules_course 
    ON public.course_modules (course);

CREATE INDEX IF NOT EXISTS idx_modules_meeting 
    ON public.course_modules (meeting_no);

CREATE INDEX IF NOT EXISTS idx_modules_created_at 
    ON public.course_modules (created_at DESC);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses (RLS Policies):
CREATE POLICY "Allow public select course modules"
    ON public.course_modules
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert course modules"
    ON public.course_modules
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update course modules"
    ON public.course_modules
    FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow delete user uploaded modules"
    ON public.course_modules
    FOR DELETE
    TO anon, authenticated
    USING (true);


-- ====================================================================
-- 3. VIEW STATISTIK & AGREGASI DATA
-- ====================================================================

-- View Rata-Rata Telemetri Per Jam (Sanitized Time-Series View)
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

-- View Rekapitulasi Modul per Mata Kuliah
CREATE OR REPLACE VIEW public.course_module_summary AS
SELECT 
    course,
    COUNT(*) AS total_modules,
    COUNT(CASE WHEN doc_type LIKE '%Praktikum%' THEN 1 END) AS praktikum_count,
    COUNT(CASE WHEN doc_type LIKE '%PBL%' THEN 1 END) AS pbl_count,
    COUNT(CASE WHEN doc_type LIKE '%Diktat%' THEN 1 END) AS diktat_count
FROM public.course_modules
GROUP BY course;


-- ====================================================================
-- 4. INITIAL SEED DATA (DATA AWAL CONTOH & DEMOSTRASI)
-- ====================================================================

-- Data Awal Telemetri Sensor Smart Tani
INSERT INTO public.sensor_telemetry (device_id, temp_c, ph, tds_ppm, flow_lpm, pump_active, metadata)
VALUES 
('ESP32-SMARTTANI-NODE01', 24.50, 6.20, 980, 12.50, true, '{"firmware": "Microdot-v2.1", "status": "nominal"}'::jsonb),
('ESP32-SMARTTANI-NODE01', 24.60, 6.25, 975, 12.40, true, '{"firmware": "Microdot-v2.1", "status": "nominal"}'::jsonb),
('ESP32-SMARTTANI-NODE01', 24.80, 6.18, 990, 12.60, true, '{"firmware": "Microdot-v2.1", "status": "nominal"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Data Awal Modul Perkuliahan Dr. Eko Subiyantoro
INSERT INTO public.course_modules (course, title, meeting_no, doc_type, bloom_level, description, cpmk, file_name, file_size, content_snippet)
VALUES
(
    'Pemrograman IoT',
    'Praktikum 04: Akuisisi Sensor DS18B20 & Water Flow YF-B1 pada ESP32 dengan Microdot Python',
    4,
    'Modul Praktikum (LKM)',
    'C3-C4',
    'Panduan praktikum laboratorium mengenai komunikasi OneWire pada sensor suhu DS18B20 dan penanganan interrupt pulsa pada sensor aliran air YF-B1 menggunakan microframework Microdot pada ESP32.',
    'Mahasiswa mampu mengimplementasikan pembacaan sensor bus digital dan interrupt pin hardware pada mikrokontroler ESP32 serta memformat data ke dalam payload JSON.',
    'LKM-IoT-04-Sensor-Acquisition.pdf',
    '3.4 MB',
    'Materi: 1. Konfigurasi OneWire GPIO 4. 2. Interrupt pulsa YF-B1 GPIO 18. 3. JSON serialization Microdot.'
),
(
    'Pemrograman IoT',
    'Praktikum 08: Integrasi Cloud Supabase REST & Rendering 2D Digital Twin di Vercel',
    8,
    'Tugas Kasus PBL',
    'C4-C6',
    'Proyek mini membangun pipeline telemetri lengkap dari edge controller ESP32 menuju database PostgreSQL Supabase dengan perlindungan RLS dan antarmuka dashboard 2D Digital Twin berbasis Next.js.',
    'Mahasiswa mampu merancang arsitektur Cyber-Physical System (CPS) terpadu dengan model 2D Digital Twin yang mencerminkan status fisis larutan nutrisi secara real-time.',
    'PBL-IoT-08-DigitalTwin-Supabase.pdf',
    '5.8 MB',
    'Materi: 1. Supabase REST API Header. 2. Row Level Security. 3. 2D Digital Twin SVG Binding.'
),
(
    'Pemrograman Web',
    'Pertemuan 05: Arsitektur RESTful API & Ingest Serverless pada Next.js App Router',
    5,
    'Modul Praktikum (LKM)',
    'C3-C4',
    'Membangun route handler /api/* pada Next.js untuk menerima data telemetri, validasi payload menggunakan Zod, dan penanganan respon HTTP standar.',
    'Mahasiswa memahami siklus permintaan-respon HTTP, arsitektur server-side API Routes, dan teknik sanitasi data masukan.',
    'LKM-Web-05-API-Routes.pdf',
    '2.9 MB',
    'Materi: Next.js API Routes, NextRequest, NextResponse, HTTP Status Codes.'
),
(
    'Pemrograman Web',
    'Pertemuan 09: Manajemen Database PostgreSQL, Indexing Time-Series & Row Level Security',
    9,
    'Diktat / Bahan Ajar',
    'C3-C5',
    'Pemanfaatan database relasional modern dengan Supabase, pembuatan view teragregasi untuk rata-rata telemetri per jam, dan penerapan kebijakan RLS agar data aman dari akses tidak sah.',
    'Mahasiswa mampu merancang skema database PostgreSQL yang teroptimasi untuk data deret waktu (time-series) dan menerapkan keamanan tingkat baris (RLS).',
    'Diktat-Web-09-Supabase-RLS.pdf',
    '4.1 MB',
    'Materi: PostgreSQL DDL, B-Tree Indexing, Row Level Security Policies, Views.'
),
(
    'Algoritma Pemrograman',
    'Pertemuan 03: Logika Percabangan Kompleks, Perulangan Bersarang & Notasi Pseudocode',
    3,
    'Modul Praktikum (LKM)',
    'C1-C3',
    'Pengantar logika algoritma menggunakan diagram alir (flowchart) dan pseudocode berstandar. Studi kasus: penentuan status pH dan konsentrasi nutrisi hidroponik secara berjenjang.',
    'Mahasiswa mampu memecahkan masalah logika kondisional dan menyusun pseudocode algoritma yang terstruktur dan mudah diimplementasikan ke dalam bahasa Python/C++.',
    'LKM-Algo-03-Logika-Percabangan.pdf',
    '2.1 MB',
    'Materi: Flowchart, Pseudocode IEEE, Nested Loop, Multi-way Branching.'
),
(
    'Algoritma Pemrograman',
    'Pertemuan 07: Algoritma Rekursi, Pencarian Biner & Analisis Kompleksitas Waktu Big-O',
    7,
    'Diktat / Bahan Ajar',
    'C4-C5',
    'Analisis efisiensi algoritma matematis, pemahaman tumpukan panggilan rekursif (call stack), dan perbandingan kompleksitas waktu O(1), O(log n), O(n), hingga O(n^2).',
    'Mahasiswa mampu menghitung efisiensi algoritma secara asimtotik serta membedakan pendekatan iteratif vs rekursif pada struktur data berurutan.',
    'Diktat-Algo-07-BigO-Rekursi.pdf',
    '3.6 MB',
    'Materi: Rekursi dasar, Base Case, Call Stack, Binary Search, Big-O Notation.'
),
(
    'Algoritma Pemrograman',
    'Pertemuan 11: Struktur Data Graf & Pohon Biner untuk Pemodelan Sistem Rekomendasi Karir',
    11,
    'Tugas Kasus PBL',
    'C4-C6',
    'Penerapan struktur data non-linear (Graph & Tree) untuk memetakan keterhubungan antara kompetensi vokasi dengan profil pekerjaan pada Job Recommendation System Dr. Eko.',
    'Mahasiswa mampu merancang dan menelusuri simpul graf kompetensi kejuruan menggunakan algoritma Breadth-First Search (BFS) dan Depth-First Search (DFS).',
    'PBL-Algo-11-Graph-Recommendation.pdf',
    '5.2 MB',
    'Materi: Adjacency List, BFS, DFS, Binary Search Tree, Recommender Graph Modeling.'
)
ON CONFLICT DO NOTHING;
