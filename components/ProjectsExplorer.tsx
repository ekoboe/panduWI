'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Briefcase,
  BookOpen,
  Radio,
  ArrowUpRight,
  Database,
  Server,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ProjectItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  hardwareStack: string[];
  softwareStack: string[];
  cloudStack: string[];
  pedagogyLink: string;
  keyOutputs: string[];
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'smart-tani',
    category: 'AIoT & Cyber-Physical Systems',
    title: 'Sistem AIoT "Smart Tani"',
    subtitle: 'Edge Computing Monitoring Kualitas Air Hidroponik Real-Time',
    description:
      'Solusi Cyber-Physical System (CPS) terpadu untuk agrikultur presisi. Menggunakan mikrokontroler ESP32/Pico W yang mengakuisisi parameter fisis dan kimia larutan nutrisi secara periodik, mentransmisikannya ke database Supabase, dan dirender dalam 2D Digital Twin interaktif di Vercel.',
    hardwareStack: ['ESP32-WROOM / Raspberry Pi Pico W', 'DS18B20 OneWire Temp Probe', 'Analog pH Glass Electrode (ADC)', 'TDS Conductivity Probe (ADC)', 'YF-B1 Water Flow Hall-Effect'],
    softwareStack: ['MicroPython / Python Microdot framework', 'REST API JSON Ingest', 'Next.js App Router', 'SVG Dynamic 2D Digital Twin'],
    cloudStack: ['Supabase PostgreSQL (Time-Series)', 'Row Level Security (RLS)', 'Vercel Edge Deployment'],
    pedagogyLink: 'Diterapkan pada modul Problem-Based Learning (PBL) SMK Pertanian dan Vokasi Informatika.',
    keyOutputs: [
      'Akuisisi data 4 parameter kualitas air dengan latensi < 500ms',
      'Digital Twin 2D SVG berbasis CSS dinamis tanpa library berat',
      'Penyimpanan time-series terindeks pada Supabase PostgreSQL',
    ],
  },
  {
    id: 'job-recommendation',
    category: 'Machine Learning & Vokasi',
    title: 'Job Recommendation System',
    subtitle: 'Sistem Rekomendasi Karir & Penyelarasan Kompetensi SMK-Industri',
    description:
      'Platform cerdas berbasis NLP dan Machine Learning untuk memetakan capaian pembelajaran dan portofolio kejuruan siswa SMK terhadap standar kualifikasi industri (SKKNI). Menghasilkan analisis skill gap dan rekomendasi jalur karir yang presisi.',
    hardwareStack: ['Server Komputasi Edge / Raspberry Pi 4 Edge Node'],
    softwareStack: ['Python Flask / FastAPI', 'Sentence-Transformers & Cosine Similarity', 'Pandas & Scikit-Learn', 'Interactive Radar Chart UI'],
    cloudStack: ['PostgreSQL Relational DB (Supabase)', 'Vercel Cloud Hosting'],
    pedagogyLink: 'Mendukung program Link and Match 8+i Kemendikbudristek untuk lulusan vokasi.',
    keyOutputs: [
      'Pencocokan vektor kompetensi lulusan vs deskripsi lowongan kerja',
      'Visualisasi Radar Chart Kesenjangan Keterampilan (Skill Gap Analysis)',
      'Rekomendasi kursus/sertifikasi penambal celah kompetensi',
    ],
  },
  {
    id: 'curriculum-genai',
    category: 'Desain Kurikulum & Widyaiswara',
    title: 'Kurikulum Generatif AI & Multi-Agent AIoT',
    subtitle: 'Program Master Trainer Widyaiswara & Pelatihan Guru Kejuruan',
    description:
      'Rancangan kurikulum pelatihan intensif untuk membekali widyaiswara dan guru SMK dengan kapabilitas membangun ekosistem multi-agen AIoT, orkestrasi cloud, serta pemanfaatan LLM dalam penyusunan instrumen asesmen autentik.',
    hardwareStack: ['ESP32 Multi-Node Kit', 'Sensor Shield Edukatif'],
    softwareStack: ['Multi-Agent PubSub Architecture', 'Prompt Engineering Frameworks', 'Microdot Python'],
    cloudStack: ['Supabase Edge Functions', 'Vercel Serverless Hosting'],
    pedagogyLink: 'Menggunakan Mission-Based Learning (MBL) 4 Milestone dan Taksonomi Bloom C1-C6.',
    keyOutputs: [
      'Modul ajar lengkap 40 JP terstandarisasi Pusdiklat/Balai Diklat',
      'Rubrik asesmen autentik berbasis bukti belajar (evidence-based)',
      'Bahan tayang dan simulasi proyek interaktif',
    ],
  },
  {
    id: 'tinyml-anomaly',
    category: 'Edge AI & TinyML',
    title: 'Edge AI TinyML Anomaly Detector',
    subtitle: 'Deteksi Kerusakan Pompa & Vibrasi Mekanik pada ESP32-S3',
    description:
      'Penelitian implementasi model neural network terkompresi (TensorFlow Lite for Microcontrollers) pada ESP32 untuk mendeteksi kavitasi pompa dan anomali vibrasi sebelum terjadi kegagalan fatal pada sistem pengairan.',
    hardwareStack: ['ESP32-S3 Dual Core', 'MPU6050 Accelerometer / I2S Microphone'],
    softwareStack: ['TinyML TFLite Micro', 'FFT Spectral Analysis (Python)', 'Edge Impulse Studio'],
    cloudStack: ['Supabase Alert Webhooks', 'Vercel Dashboard Log'],
    pedagogyLink: 'Materi pengayaan tingkat lanjut untuk mahasiswa vokasi elektro & mekatronika.',
    keyOutputs: [
      'Inferensi lokal pada mikrokontroler dengan memori SRAM < 100KB',
      'Deteksi anomali real-time tanpa ketergantungan koneksi internet',
      'Pengiriman notifikasi darurat saat terdeteksi getaran abnormal',
    ],
  },
];

interface ProjectsExplorerProps {
  onConsultPanduWi: (prompt: string) => void;
}

export function ProjectsExplorer({ onConsultPanduWi }: ProjectsExplorerProps) {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(PROJECTS_DATA[0]);

  const filteredProjects =
    filter === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="proyek" className="py-16 md:py-20 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Portofolio Rekayasa & Inovasi Widyaiswara
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            04. Proyek Unggulan Dr. Eko Subiyantoro
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Kumpulan artefak teknis dan proyek riset aplikatif di bidang AI, IoT, Cyber-Physical Systems, serta pengembangan kurikulum vokasi modern.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Proyek
          </button>
          <button
            onClick={() => setFilter('cyber-physical')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'cyber-physical'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            AIoT & CPS
          </button>
          <button
            onClick={() => setFilter('machine learning')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'machine learning'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Machine Learning
          </button>
          <button
            onClick={() => setFilter('kurikulum')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filter === 'kurikulum'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Kurikulum Diklat
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-50/70 rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed metadata with typographic separator */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-medium text-emerald-800">{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Dr. Eko Subiyantoro</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                <div className="text-xs font-medium text-slate-600 mt-1">{project.subtitle}</div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Outputs bullet points */}
                <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-700">Capaian Kunci:</div>
                  {project.keyOutputs.map((item, i) => (
                    <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">›</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Badges / Stack */}
                <div className="mt-4 pt-3 border-t border-slate-200/70">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Arsitektur Terintegrasi:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.hardwareStack.map((hw, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] font-mono bg-white border border-slate-200 text-slate-700 rounded-sm">
                        {hw}
                      </span>
                    ))}
                    {project.cloudStack.map((cloud, i) => (
                      <span key={i} className="px-2 py-0.5 text-[11px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm">
                        {cloud}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">{project.pedagogyLink}</span>
                <button
                  onClick={() =>
                    onConsultPanduWi(
                      `PanduWI, ceritakan lebih dalam mengenai proyek "${project.title}". Bagaimana saya dapat mereplikasi arsitektur teknisnya untuk bahan ajar atau dashboard web?`
                    )
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pelajari di PanduWI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
