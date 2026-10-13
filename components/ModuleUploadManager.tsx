'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Search,
  BookOpen,
  CheckCircle2,
  Trash2,
  Download,
  Sparkles,
  Layers,
  Code2,
  Cpu,
  Globe,
  Plus,
  X,
  FileCode,
  GraduationCap,
  Eye,
} from 'lucide-react';
import { saveModuleToSupabase, SUPABASE_PROJECT_NAME } from '@/lib/supabase';

export interface CourseModule {
  id: string;
  course: 'Algoritma Pemrograman' | 'Pemrograman Web' | 'Pemrograman IoT';
  title: string;
  meetingNo: number;
  docType: 'Modul Praktikum (LKM)' | 'RPS / Silabus' | 'Diktat / Bahan Ajar' | 'Tugas Kasus PBL' | 'Slide Presentasi';
  bloomLevel: string;
  description: string;
  cpmk: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  contentSnippet?: string;
  isUserUploaded?: boolean;
}

const INITIAL_MODULES: CourseModule[] = [
  {
    id: 'iot-mod-04',
    course: 'Pemrograman IoT',
    title: 'Praktikum 04: Akuisisi Sensor DS18B20 & Water Flow YF-B1 pada ESP32 dengan Microdot Python',
    meetingNo: 4,
    docType: 'Modul Praktikum (LKM)',
    bloomLevel: 'C3-C4',
    description:
      'Panduan praktikum laboratorium mengenai komunikasi OneWire pada sensor suhu DS18B20 dan penanganan interrupt pulsa pada sensor aliran air YF-B1 menggunakan microframework Microdot pada ESP32.',
    cpmk: 'Mahasiswa mampu mengimplementasikan pembacaan sensor bus digital dan interrupt pin hardware pada mikrokontroler ESP32 serta memformat data ke dalam payload JSON.',
    fileName: 'LKM-IoT-04-Sensor-Acquisition.pdf',
    fileSize: '3.4 MB',
    uploadDate: '10 Okt 2026',
    contentSnippet: `# Cuplikan Materi Modul 04:
1. Hubungkan pin data DS18B20 ke GPIO 4 dengan resistor pull-up 4.7k ohm.
2. Hubungkan pin pulsa YF-B1 ke GPIO 18 dan aktifkan mode Pin.IRQ_RISING.
3. Gunakan modul onewire dan ds18x20 pada MicroPython.
4. Buat server Microdot ringan untuk mengekspos endpoint GET /telemetry.`,
  },
  {
    id: 'iot-mod-08',
    course: 'Pemrograman IoT',
    title: 'Praktikum 08: Integrasi Cloud Supabase REST & Rendering 2D Digital Twin di Vercel',
    meetingNo: 8,
    docType: 'Tugas Kasus PBL',
    bloomLevel: 'C4-C6',
    description:
      'Proyek mini membangun pipeline telemetri lengkap dari edge controller ESP32 menuju database PostgreSQL Supabase dengan perlindungan RLS dan antarmuka dashboard 2D Digital Twin berbasis Next.js.',
    cpmk: 'Mahasiswa mampu merancang arsitektur Cyber-Physical System (CPS) terpadu dengan model 2D Digital Twin yang mencerminkan status fisis larutan nutrisi secara real-time.',
    fileName: 'PBL-IoT-08-DigitalTwin-Supabase.pdf',
    fileSize: '5.8 MB',
    uploadDate: '08 Okt 2026',
    contentSnippet: `# Cuplikan Materi Modul 08:
- Desain skema tabel sensor_telemetry di Supabase.
- Konfigurasi HTTP POST berotentikasi Bearer API key dari Microdot.
- Binding data telemetri ke atribut visual SVG (strokeDasharray & wave animation).`,
  },
  {
    id: 'web-mod-05',
    course: 'Pemrograman Web',
    title: 'Pertemuan 05: Arsitektur RESTful API & Ingest Serverless pada Next.js App Router',
    meetingNo: 5,
    docType: 'Modul Praktikum (LKM)',
    bloomLevel: 'C3-C4',
    description:
      'Membangun route handler /api/* pada Next.js untuk menerima data telemetri, validasi payload menggunakan Zod, dan penanganan respon HTTP standar.',
    cpmk: 'Mahasiswa memahami siklus permintaan-respon HTTP, arsitektur server-side API Routes, dan teknik sanitasi data masukan.',
    fileName: 'LKM-Web-05-API-Routes.pdf',
    fileSize: '2.9 MB',
    uploadDate: '05 Okt 2026',
    contentSnippet: `// Cuplikan Materi Modul 05:
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Validasi parameter masukan untuk mencegah serangan injeksi
  if (!body.device_id || typeof body.temp_c !== 'number') {
    return NextResponse.json({ error: 'Payload tidak valid' }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}`,
  },
  {
    id: 'web-mod-09',
    course: 'Pemrograman Web',
    title: 'Pertemuan 09: Manajemen Database PostgreSQL, Indexing Time-Series & Row Level Security',
    meetingNo: 9,
    docType: 'Diktat / Bahan Ajar',
    bloomLevel: 'C3-C5',
    description:
      'Pemanfaatan database relasional modern dengan Supabase, pembuatan view teragregasi untuk rata-rata telemetri per jam, dan penerapan kebijakan RLS agar data aman dari akses tidak sah.',
    cpmk: 'Mahasiswa mampu merancang skema database PostgreSQL yang teroptimasi untuk data deret waktu (time-series) dan menerapkan keamanan tingkat baris (RLS).',
    fileName: 'Diktat-Web-09-Supabase-RLS.pdf',
    fileSize: '4.1 MB',
    uploadDate: '02 Okt 2026',
  },
  {
    id: 'algo-mod-03',
    course: 'Algoritma Pemrograman',
    title: 'Pertemuan 03: Logika Percabangan Kompleks, Perulangan Bersarang & Notasi Pseudocode',
    meetingNo: 3,
    docType: 'Modul Praktikum (LKM)',
    bloomLevel: 'C1-C3',
    description:
      'Pengantar logika algoritma menggunakan diagram alir (flowchart) dan pseudocode berstandar. Studi kasus: penentuan status pH dan konsentrasi nutrisi hidroponik secara berjenjang.',
    cpmk: 'Mahasiswa mampu memecahkan masalah logika kondisional dan menyusun pseudocode algoritma yang terstruktur dan mudah diimplementasikan ke dalam bahasa Python/C++.',
    fileName: 'LKM-Algo-03-Logika-Percabangan.pdf',
    fileSize: '2.1 MB',
    uploadDate: '28 Sep 2026',
  },
  {
    id: 'algo-mod-07',
    course: 'Algoritma Pemrograman',
    title: 'Pertemuan 07: Algoritma Rekursi, Pencarian Biner & Analisis Kompleksitas Waktu Big-O',
    meetingNo: 7,
    docType: 'Diktat / Bahan Ajar',
    bloomLevel: 'C4-C5',
    description:
      'Analisis efisiensi algoritma matematis, pemahaman tumpukan panggilan rekursif (call stack), dan perbandingan kompleksitas waktu O(1), O(log n), O(n), hingga O(n^2).',
    cpmk: 'Mahasiswa mampu menghitung efisiensi algoritma secara asimtotik serta membedakan pendekatan iteratif vs rekursif pada struktur data berurutan.',
    fileName: 'Diktat-Algo-07-BigO-Rekursi.pdf',
    fileSize: '3.6 MB',
    uploadDate: '20 Sep 2026',
  },
  {
    id: 'algo-mod-11',
    course: 'Algoritma Pemrograman',
    title: 'Pertemuan 11: Struktur Data Graf & Pohon Biner untuk Pemodelan Sistem Rekomendasi Karir',
    meetingNo: 11,
    docType: 'Tugas Kasus PBL',
    bloomLevel: 'C4-C6',
    description:
      'Penerapan struktur data non-linear (Graph & Tree) untuk memetakan keterhubungan antara kompetensi vokasi dengan profil pekerjaan pada Job Recommendation System Dr. Eko.',
    cpmk: 'Mahasiswa mampu merancang dan menelusuri simpul graf kompetensi kejuruan menggunakan algoritma Breadth-First Search (BFS) dan Depth-First Search (DFS).',
    fileName: 'PBL-Algo-11-Graph-Recommendation.pdf',
    fileSize: '5.2 MB',
    uploadDate: '15 Sep 2026',
  },
];

interface ModuleUploadManagerProps {
  onConsultPanduWi: (prompt: string) => void;
}

export function ModuleUploadManager({ onConsultPanduWi }: ModuleUploadManagerProps) {
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedModuleDetail, setSelectedModuleDetail] = useState<CourseModule | null>(null);

  // Form states for new module upload
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCourse, setFormCourse] = useState<'Algoritma Pemrograman' | 'Pemrograman Web' | 'Pemrograman IoT'>(
    'Pemrograman IoT'
  );
  const [formMeetingNo, setFormMeetingNo] = useState<number>(1);
  const [formDocType, setFormDocType] = useState<CourseModule['docType']>('Modul Praktikum (LKM)');
  const [formBloomLevel, setFormBloomLevel] = useState<CourseModule['bloomLevel']>('C3-C4');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCpmk, setFormCpmk] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileSnippet, setUploadedFileSnippet] = useState<string>('');
  const [isSuccessAlert, setIsSuccessAlert] = useState<boolean>(false);

  // Filter modules
  const filteredModules = modules.filter((m) => {
    const matchesCourse = selectedCourseFilter === 'all' || m.course === selectedCourseFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cpmk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `pertemuan ${m.meetingNo}`.includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Handle local file drop/selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!formTitle) {
        setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      // Read text snippet if text/markdown/json
      if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.py') || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setUploadedFileSnippet(content.slice(0, 500));
        };
        reader.readAsText(file);
      }
    }
  };

  // Submit new module
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newModule: CourseModule = {
      id: `mod-custom-${Date.now()}`,
      course: formCourse,
      title: formTitle.trim(),
      meetingNo: Number(formMeetingNo) || 1,
      docType: formDocType,
      bloomLevel: formBloomLevel,
      description: formDescription.trim() || 'Modul ajar perkuliahan yang diunggah oleh Dr. Eko Subiyantoro.',
      cpmk: formCpmk.trim() || 'Mencapai penguasaan kompetensi sesuai capaian pembelajaran mata kuliah terkait.',
      fileName: uploadedFile ? uploadedFile.name : `Modul-${formCourse.replace(/\s+/g, '-')}-P${formMeetingNo}.pdf`,
      fileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.5 MB',
      uploadDate: 'Hari ini',
      contentSnippet: uploadedFileSnippet || undefined,
      isUserUploaded: true,
    };

    setModules([newModule, ...modules]);
    setIsUploadModalOpen(false);
    setIsSuccessAlert(true);
    setTimeout(() => setIsSuccessAlert(false), 3500);

    // Sync to Supabase course_modules table
    saveModuleToSupabase({
      course: formCourse,
      title: formTitle.trim(),
      meeting_no: Number(formMeetingNo) || 1,
      doc_type: formDocType,
      bloom_level: formBloomLevel,
      description: formDescription.trim() || 'Modul ajar perkuliahan yang diunggah oleh Dr. Eko Subiyantoro.',
      cpmk: formCpmk.trim() || 'Mencapai penguasaan kompetensi sesuai capaian pembelajaran mata kuliah terkait.',
      file_name: uploadedFile ? uploadedFile.name : `Modul-${formCourse.replace(/\s+/g, '-')}-P${formMeetingNo}.pdf`,
      file_size: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.5 MB',
      content_snippet: uploadedFileSnippet || undefined,
    });

    // Reset form
    setFormTitle('');
    setFormDescription('');
    setFormCpmk('');
    setUploadedFile(null);
    setUploadedFileSnippet('');
  };

  const handleDeleteModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
    if (selectedModuleDetail?.id === id) {
      setSelectedModuleDetail(null);
    }
  };

  const handleDownloadModule = (mod: CourseModule) => {
    const content = `# ${mod.title}
Mata Kuliah: ${mod.course} (Pertemuan ${mod.meetingNo})
Tipe: ${mod.docType}
Target Taksonomi Bloom: ${mod.bloomLevel}
Dosen Pengampu: Dr. Eko Subiyantoro, S.Pd., S.ST., MT.

## Capaian Pembelajaran Mata Kuliah (CPMK)
${mod.cpmk}

## Deskripsi Materi
${mod.description}

${mod.contentSnippet ? `\n## Cuplikan Dokumen\n${mod.contentSnippet}\n` : ''}
Dokumen ini disusun untuk perkuliahan semester ganjil/genap mahasiswa vokasi.`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mod.fileName.replace(/\.pdf$/, '')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConsultWithModule = (mod: CourseModule) => {
    const promptText = `PanduWI, tolong telaah modul perkuliahan ini untuk mata kuliah "${mod.course}" (Pertemuan ${mod.meetingNo}):
- Judul: "${mod.title}"
- CPMK: "${mod.cpmk}"
- Tipe Dokumen: "${mod.docType}"
- Target Taksonomi Bloom: "${mod.bloomLevel}"
- Deskripsi: "${mod.description}"

Mohon berikan:
1. Analisis keselarasan CPMK dengan Taksonomi Bloom yang ditargetkan.
2. 3 Butir saran penyempurnaan skenario praktikum berbasis Problem-Based Learning (PBL).
3. Buatkan 2 contoh soal studi kasus kontekstual (dengan tingkat kognitif C4-C6) yang cocok untuk evaluasi mahasiswa!`;

    onConsultPanduWi(promptText);
  };

  return (
    <section id="modul-ajar" className="py-16 md:py-20 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
              Repositori & Manajemen Perkuliahan Mahasiswa
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              04. Repositori & Unggah Modul Kuliah
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Kelola dan telaah modul pembelajaran yang diampu oleh <strong>Dr. Eko Subiyantoro</strong> untuk mata kuliah <strong>Algoritma Pemrograman</strong>, <strong>Pemrograman Web</strong>, dan <strong>Pemrograman IoT</strong>. Anda dapat mengunggah dokumen baru dan menelaah keselarasan pedagoginya via PanduWI AI.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Modul Baru</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {isSuccessAlert && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span><strong>Berhasil!</strong> Modul ajar telah ditambahkan ke repositori dan siap ditelaah dengan PanduWI.</span>
            </div>
            <button onClick={() => setIsSuccessAlert(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Course Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100">
          {/* Segmented Course Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedCourseFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCourseFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Mata Kuliah ({modules.length})
            </button>

            <button
              onClick={() => setSelectedCourseFilter('Algoritma Pemrograman')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCourseFilter === 'Algoritma Pemrograman'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Algoritma Pemrograman</span>
            </button>

            <button
              onClick={() => setSelectedCourseFilter('Pemrograman Web')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCourseFilter === 'Pemrograman Web'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Pemrograman Web</span>
            </button>

            <button
              onClick={() => setSelectedCourseFilter('Pemrograman IoT')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCourseFilter === 'Pemrograman IoT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pemrograman IoT</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul atau materi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-slate-50/70 rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between group"
            >
              <div>
                {/* Course tag & meeting info unboxed metadata */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    {mod.course === 'Algoritma Pemrograman' && <Code2 className="w-3.5 h-3.5 text-amber-600" />}
                    {mod.course === 'Pemrograman Web' && <Globe className="w-3.5 h-3.5 text-sky-600" />}
                    {mod.course === 'Pemrograman IoT' && <Cpu className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="text-slate-900 font-semibold">{mod.course}</span>
                  </div>
                  <span>Minggu ke-{mod.meetingNo}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                  {mod.title}
                </h3>

                {/* Metadata unboxed text */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                  <span>{mod.docType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-700 font-medium">Bloom {mod.bloomLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mod.fileSize}</span>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {mod.description}
                </p>

                {/* CPMK snippet */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">CPMK:</strong> {mod.cpmk}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 pt-3.5 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedModuleDetail(mod)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                    title="Lihat Detail Modul"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDownloadModule(mod)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                    title="Unduh Dokumen Modul"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {mod.isUserUploaded && (
                    <button
                      onClick={() => handleDeleteModule(mod.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleConsultWithModule(mod)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Telaah keselarasan Taksonomi Bloom & saran PBL di PanduWI"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Telaah di PanduWI</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-700">Tidak ada modul yang cocok</div>
            <div className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau pilih kategori mata kuliah lain.</div>
          </div>
        )}

        {/* Modal: Upload New Course Module */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Unggah Modul & Bahan Ajar Baru</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tambahkan bahan ajar Dr. Eko untuk mata kuliah Algoritma, Web, atau IoT.
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="p-6 space-y-4">
                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pilih File Dokumen (PDF, Markdown, DOCX, TXT, IPYNB)
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-lg p-5 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="module-file"
                      accept=".pdf,.docx,.doc,.txt,.md,.json,.ipynb,.py"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="module-file" className="cursor-pointer block">
                      <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-slate-700">
                        {uploadedFile ? uploadedFile.name : 'Klik untuk memilih dokumen atau tarik file ke sini'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Format yang didukung: PDF, DOCX, Markdown, Python (.py), Jupyter Notebook (.ipynb)
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form Row 1: Course & Meeting */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Kuliah</label>
                    <select
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Pemrograman IoT">Pemrograman IoT</option>
                      <option value="Pemrograman Web">Pemrograman Web</option>
                      <option value="Algoritma Pemrograman">Algoritma Pemrograman</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pertemuan / Minggu Ke-</label>
                    <input
                      type="number"
                      min={1}
                      max={16}
                      value={formMeetingNo}
                      onChange={(e) => setFormMeetingNo(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Form Row 2: Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Modul / Materi</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Praktikum 06: Pemrograman Asinkron & WebSocket pada ESP32"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Form Row 3: DocType & Bloom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Dokumen</label>
                    <select
                      value={formDocType}
                      onChange={(e) => setFormDocType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="Modul Praktikum (LKM)">Modul Praktikum (LKM)</option>
                      <option value="Tugas Kasus PBL">Tugas Kasus PBL</option>
                      <option value="Diktat / Bahan Ajar">Diktat / Bahan Ajar</option>
                      <option value="RPS / Silabus">RPS / Silabus</option>
                      <option value="Slide Presentasi">Slide Presentasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Taksonomi Bloom</label>
                    <select
                      value={formBloomLevel}
                      onChange={(e) => setFormBloomLevel(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="C1-C2">C1-C2 (Mengingat & Memahami)</option>
                      <option value="C3-C4">C3-C4 (Menerapkan & Menganalisis)</option>
                      <option value="C4-C6">C4-C6 (Menganalisis, Mengevaluasi & Mencipta)</option>
                    </select>
                  </div>
                </div>

                {/* Form Row 4: CPMK */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capaian Pembelajaran Mata Kuliah (CPMK)</label>
                  <input
                    type="text"
                    value={formCpmk}
                    onChange={(e) => setFormCpmk(e.target.value)}
                    placeholder="Contoh: Mahasiswa mampu menganalisis mekanisme komunikasi asinkron..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Form Row 5: Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat / Ringkasan Modul</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tuliskan gambaran umum materi praktikum atau tugas ini..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Simpan ke Repositori
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: View Module Detail */}
        {selectedModuleDetail && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    {selectedModuleDetail.course} · Pertemuan {selectedModuleDetail.meetingNo}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedModuleDetail.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedModuleDetail(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-900">Jenis Dokumen:</strong> {selectedModuleDetail.docType} (Ukuran: {selectedModuleDetail.fileSize})
                </div>
                <div>
                  <strong className="text-slate-900">Target Taksonomi Bloom:</strong> {selectedModuleDetail.bloomLevel}
                </div>
                <div>
                  <strong className="text-slate-900">Capaian Pembelajaran (CPMK):</strong>
                  <p className="mt-1 p-2.5 bg-slate-50 rounded-lg text-slate-800 border border-slate-200">
                    {selectedModuleDetail.cpmk}
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900">Deskripsi Lengkap:</strong>
                  <p className="mt-1 leading-relaxed text-slate-700">
                    {selectedModuleDetail.description}
                  </p>
                </div>

                {selectedModuleDetail.contentSnippet && (
                  <div>
                    <strong className="text-slate-900">Cuplikan Kode / Dokumen:</strong>
                    <pre className="mt-1 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed">
                      {selectedModuleDetail.contentSnippet}
                    </pre>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => handleDownloadModule(selectedModuleDetail)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen (.md)</span>
                </button>

                <button
                  onClick={() => {
                    handleConsultWithModule(selectedModuleDetail);
                    setSelectedModuleDetail(null);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Telaah dengan PanduWI AI</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
