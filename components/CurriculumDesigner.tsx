'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Target,
  Flag,
  CheckCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileSpreadsheet,
} from 'lucide-react';

interface BloomLevel {
  level: string;
  name: string;
  kko: string[];
  activity: string;
  evidence: string;
}

interface CurriculumModule {
  id: string;
  title: string;
  targetAudience: string;
  duration: string;
  pblScenario: {
    title: string;
    drivingQuestion: string;
    authenticContext: string;
  };
  mblMissions: {
    stage: string;
    missionTitle: string;
    objective: string;
    deliverable: string;
  }[];
  bloomMatrix: BloomLevel[];
}

const MODULES_DATA: CurriculumModule[] = [
  {
    id: 'smart-tani',
    title: 'Sistem AIoT Smart Tani & 2D Digital Twin',
    targetAudience: 'Siswa SMK Pertanian/RPL & Mahasiswa Vokasi',
    duration: '32 Jam Pelajaran (JP)',
    pblScenario: {
      title: 'Tantangan Gagal Panen Selada Akibat Fluktuasi pH & Nutrisi',
      drivingQuestion:
        'Bagaimana merancang sistem pemantauan kualitas nutrisi hidroponik berbasis ESP32, Supabase, dan 2D Digital Twin agar petani dapat mengantisipasi anomali air secara presisi?',
      authenticContext:
        'Sebuah instalasi greenhouse hidroponik modern sering mengalami busuk akar dan daun menguning karena keterlambatan mendeteksi penurunan pH dan kenaikan suhu larutan nutrisi di atas 28°C.',
    },
    mblMissions: [
      {
        stage: 'Misi 1',
        missionTitle: 'Hardware Wiring & Sensor Conditioning',
        objective: 'Menghubungkan DS18B20 (OneWire GPIO 4), sensor pH (ADC 34), TDS (ADC 35), dan flow sensor YF-B1 (GPIO 18 Interrupt).',
        deliverable: 'Skema pengkabelan terverifikasi dan log pembacaan sensor mentah di Serial Monitor.',
      },
      {
        stage: 'Misi 2',
        missionTitle: 'Microdot Python REST Engine',
        objective: 'Membangun microservice ringan menggunakan Microdot pada ESP32 untuk memformat payload JSON telemetri.',
        deliverable: 'Script main.py Microdot dengan endpoint GET /metrics dan fungsi auto-post.',
      },
      {
        stage: 'Misi 3',
        missionTitle: 'Supabase Cloud Persistence & RLS',
        objective: 'Membuat tabel sensor_telemetry di Supabase PostgreSQL dengan indexing timestamp dan Row Level Security (RLS).',
        deliverable: 'DDL SQL schema dan payload ingestion berhasil tercatat di Supabase dashboard.',
      },
      {
        stage: 'Misi 4',
        missionTitle: 'Vercel Dashboard & 2D Digital Twin',
        objective: 'Merender data sensor ke antarmuka web modern dengan representasi visual SVG dinamis (tangki & level air).',
        deliverable: 'Aplikasi web aktif di hosting Vercel dengan grafik time-series dan indikator visual.',
      },
    ],
    bloomMatrix: [
      {
        level: 'C1',
        name: 'Mengingat (Remembering)',
        kko: ['Menyebutkan', 'Mengidentifikasi', 'Mendaftar'],
        activity: 'Menyebutkan spesifikasi tegangan kerja, pinout ESP32, dan protokol sensor DS18B20 serta YF-B1.',
        evidence: 'Lembar kerja identifikasi komponen dan tabel pinout hardware.',
      },
      {
        level: 'C2',
        name: 'Memahami (Understanding)',
        kko: ['Menjelaskan', 'Menguraikan', 'Membedakan'],
        activity: 'Menjelaskan perbedaan pembacaan analog ADC vs interrupt pulsa pada flow sensor serta alur payload HTTP REST.',
        evidence: 'Diagram alur sistem telemetri dari mikrokontroler menuju cloud database.',
      },
      {
        level: 'C3',
        name: 'Menerapkan (Applying)',
        kko: ['Mengimplementasikan', 'Mengonfigurasi', 'Menghubungkan'],
        activity: 'Mengonfigurasi Microdot pada ESP32 dan menulis skrip pengiriman payload JSON periodik ke Supabase API.',
        evidence: 'Kode program Python Microdot yang berjalan stabil mengirim data ke database.',
      },
      {
        level: 'C4',
        name: 'Menganalisis (Analyzing)',
        kko: ['Mendiagnosis', 'Mengorelasikan', 'Menguji'],
        activity: 'Mendiagnosis deviasi nilai sensor pH dan TDS terhadap larutan kalibrasi standar buffer pH 4.01 dan 6.86.',
        evidence: 'Tabel analisis error sensor dan grafik perbandingan hasil uji kalibrasi.',
      },
      {
        level: 'C5',
        name: 'Mengevaluasi (Evaluating)',
        kko: ['Memvalidasi', 'Menilai', 'Mengkritisi'],
        activity: 'Menilai keandalan transmisi data saat terjadi packet loss atau WiFi dropout pada lingkungan pertanian.',
        evidence: 'Laporan evaluasi ketahanan sistem (system resilience report) dan mekanisme offline buffering.',
      },
      {
        level: 'C6',
        name: 'Mencipta (Creating)',
        kko: ['Merancang', 'Membangun', 'Memproduksi'],
        activity: 'Merancang antarmuka 2D Digital Twin berbasis SVG dinamis yang terhubung ke cloud Supabase dan di-deploy ke Vercel.',
        evidence: 'Produk Web Dashboard terpadu yang siap didemokan kepada stakeholder pertanian.',
      },
    ],
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent AIoT & Edge Intelligence',
    targetAudience: 'Guru SMK Jurusan TJKT/RPL & Peserta Pelatihan Widyaiswara',
    duration: '40 Jam Pelajaran (JP)',
    pblScenario: {
      title: 'Koordinasi Otonom Multi-Simpul Irigasi & Pemupukan Presisi',
      drivingQuestion:
        'Bagaimana menerapkan kolaborasi agen AI otonom di tingkat edge dan cloud untuk mengoptimalkan penjadwalan nutrisi tanaman tanpa intervensi manual?',
      authenticContext:
        'Skala pertanian cerdas multisektor membutuhkan koordinasi antara simpul sensor, simpul aktuator katup pompa, dan agen pemantau cuaca eksternal secara terdistribusi.',
    },
    mblMissions: [
      {
        stage: 'Misi 1',
        missionTitle: 'Perancangan Peran Multi-Agent',
        objective: 'Mendefinisikan peran Agent Sensor, Agent Pengambil Keputusan (Reasoner), dan Agent Aktuator.',
        deliverable: 'Matriks interaksi agen dan protokol pesan terstruktur (JSON RPC / PubSub).',
      },
      {
        stage: 'Misi 2',
        missionTitle: 'Edge Inference & Rule Engine',
        objective: 'Menanamkan logika penalaran berbasis ambang batas adaptif pada simpul mikrokontroler ESP32.',
        deliverable: 'Skrip Microdot Python dengan handler keputusan lokal saat koneksi internet terputus.',
      },
      {
        stage: 'Misi 3',
        missionTitle: 'Cloud Agent Coordination di Supabase',
        objective: 'Mengonfigurasi Database Webhooks & Edge Functions di Supabase untuk sinkronisasi antar agen.',
        deliverable: 'Automasi trigger event dan pencatatan audit log aktivitas seluruh agen.',
      },
      {
        stage: 'Misi 4',
        missionTitle: 'Dashboard Monitoring Kolaborasi Agen',
        objective: 'Membangun antarmuka pemantauan status agen, riwayat negosiasi, dan visualisasi topologi.',
        deliverable: 'Web Dashboard Next.js di Vercel dengan indikator status kesehatan tiap simpul agen.',
      },
    ],
    bloomMatrix: [
      {
        level: 'C1',
        name: 'Mengingat (Remembering)',
        kko: ['Mendefinisikan', 'Menyebutkan'],
        activity: 'Mendefinisikan konsep dasar AIoT, agen otonom, dan protokol komunikasi mesin-ke-mesin (M2M).',
        evidence: 'Daftar istilah dan peta konsep arsitektur Multi-Agent.',
      },
      {
        level: 'C2',
        name: 'Memahami (Understanding)',
        kko: ['Menerangkan', 'Mengilustrasikan'],
        activity: 'Menerangkan bagaimana sistem multi-agen mencegah single-point of failure dibandingkan arsitektur terpusat.',
        evidence: 'Presentasi komparasi arsitektur terpusat vs multi-agen terdistribusi.',
      },
      {
        level: 'C3',
        name: 'Menerapkan (Applying)',
        kko: ['Memprogram', 'Menjalankan'],
        activity: 'Memprogram interaksi pub-sub antar mikrokontroler menggunakan protokol REST/WebSocket ringan.',
        evidence: 'Kode komunikasi antar ESP32 yang saling bertukar status operasional.',
      },
      {
        level: 'C4',
        name: 'Menganalisis (Analyzing)',
        kko: ['Memeriksa', 'Mendeteksi'],
        activity: 'Menganalisis pola latensi dan potensi benturan perintah (race condition) antar agen aktuator.',
        evidence: 'Log analisis latensi dan diagram sequence penanganan konflik aktuator.',
      },
      {
        level: 'C5',
        name: 'Mengevaluasi (Evaluating)',
        kko: ['Menilai', 'Mengukur efisiensi'],
        activity: 'Menilai efisiensi konsumsi daya dan penggunaan memori pada simpul edge ESP32.',
        evidence: 'Laporan benchmarking performa komputasi edge pada skenario beban tinggi.',
      },
      {
        level: 'C6',
        name: 'Mencipta (Creating)',
        kko: ['Mengonstruksi', 'Memformulasikan'],
        activity: 'Memformulasikan arsitektur sistem irigasi cerdas mandiri terpadu dengan web supervisor di Vercel.',
        evidence: 'Prototipe sistem Cyber-Physical multi-agen terpadu siap uji implementasi.',
      },
    ],
  },
];

interface CurriculumDesignerProps {
  onConsultPanduWi: (prompt: string) => void;
}

export function CurriculumDesigner({ onConsultPanduWi }: CurriculumDesignerProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('smart-tani');
  const [activeTab, setActiveTab] = useState<'bloom' | 'pbl' | 'mbl'>('bloom');

  const currentModule = MODULES_DATA.find((m) => m.id === selectedModuleId) || MODULES_DATA[0];

  const handleAskDetailedSyllabus = () => {
    const promptText = `PanduWI, tolong kembangkan modul ajar dan silabus rinci untuk materi "${currentModule.title}" (${currentModule.duration}) bagi sasaran "${currentModule.targetAudience}". Susun menggunakan sintaks Problem-Based Learning (PBL), tahapan Mission-Based Learning (MBL), dan sertakan rubrik penilaian autentik berbasis Bloom's Revised Taxonomy (C1-C6).`;
    onConsultPanduWi(promptText);
  };

  return (
    <section id="kurikulum" className="py-16 md:py-20 border-b border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Pedagogi Kejuruan & Standar Pembelajaran
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            03. Desain Kurikulum: MBL, PBL &amp; Bloom&apos;s Taxonomy
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Kerangka kurikulum pembelajaran kejuruan karya Dr. Eko Subiyantoro. Dirancang untuk memastikan keselarasan antara kompetensi kognitif (Taksonomi Bloom), tantangan autentik (PBL), dan penyelesaian misi terstruktur (MBL).
          </p>
        </div>

        {/* Module Selector Segmented Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {MODULES_DATA.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModuleId(mod.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedModuleId === mod.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {mod.title}
            </button>
          ))}
        </div>

        {/* Selected Module Card Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-500 font-medium">Modul Pembelajaran Terpilih</div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{currentModule.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span>Sasaran: <strong className="text-slate-700 font-semibold">{currentModule.targetAudience}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Alokasi Waktu: <strong className="text-slate-700 font-semibold">{currentModule.duration}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Pendekatan: MBL + PBL + Bloom C1-C6</span>
              </div>
            </div>

            <button
              onClick={handleAskDetailedSyllabus}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kembangkan Silabus di PanduWI</span>
            </button>
          </div>

          {/* Subtabs for Bloom, PBL, MBL */}
          <div className="mt-6 flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('bloom')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'bloom'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Matriks Bloom&apos;s Taxonomy (C1-C6)</span>
            </button>
            <button
              onClick={() => setActiveTab('pbl')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pbl'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skenario Problem-Based Learning (PBL)</span>
            </button>
            <button
              onClick={() => setActiveTab('mbl')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mbl'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mission-Based Learning (MBL Roadmap)</span>
            </button>
          </div>

          {/* Tab 1 Content: Bloom's Revised Taxonomy Matrix Table */}
          {activeTab === 'bloom' && (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-2.5 px-3 w-16">Level</th>
                    <th className="py-2.5 px-3 w-40">Dimensi Kognitif</th>
                    <th className="py-2.5 px-3 w-44">Kata Kerja Operasional (KKO)</th>
                    <th className="py-2.5 px-3">Aktivitas Siswa / Peserta</th>
                    <th className="py-2.5 px-3">Bukti Belajar / Instrumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentModule.bloomMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{row.level}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.name}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-slate-600">{row.kko.join(', ')}</span>
                      </td>
                      <td className="py-3 px-3 leading-relaxed">{row.activity}</td>
                      <td className="py-3 px-3 text-slate-600 italic">{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2 Content: Problem-Based Learning (PBL) Trigger */}
          {activeTab === 'pbl' && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                  Studi Kasus Autentik (PBL Trigger)
                </div>
                <h4 className="text-base font-bold text-slate-900">{currentModule.pblScenario.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {currentModule.pblScenario.authenticContext}
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-1">
                  Pertanyaan Pemantik Utama (Driving Question)
                </div>
                <p className="text-sm font-medium text-emerald-950 italic leading-relaxed">
                  &ldquo;{currentModule.pblScenario.drivingQuestion}&rdquo;
                </p>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                Siswa bekerja dalam tim kecil (3-4 orang) untuk menganalisis akar masalah, menyusun hipotesis, dan membuktikan solusi teknis menggunakan mikrokontroler ESP32 dan database Supabase.
              </div>
            </div>
          )}

          {/* Tab 3 Content: Mission-Based Learning (MBL) */}
          {activeTab === 'mbl' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentModule.mblMissions.map((mission, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700 font-mono">{mission.stage}</span>
                    <span className="text-[11px] text-slate-400">Milestone Terukur</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{mission.missionTitle}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>Tujuan:</strong> {mission.objective}
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-700 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Deliverable:</strong> {mission.deliverable}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
