'use client';

import React from 'react';
import { ArrowDownRight, Sparkles, BookOpen, UploadCloud, GraduationCap } from 'lucide-react';

interface HeroProps {
  onExploreDigitalTwin: () => void;
  onExploreModules: () => void;
  onOpenChatWithPrompt: (promptText: string) => void;
}

export function Hero({ onExploreDigitalTwin, onExploreModules, onOpenChatWithPrompt }: HeroProps) {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial kicker & title */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-3">
            <span>Pusat Inovasi Widyaiswara Teknologi Informasi</span>
            <span aria-hidden="true">·</span>
            <span>Dr. Eko Subiyantoro, MT</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
            Panduan Pembelajaran AIoT, Cyber-Physical Systems, & Pedagogi Vokasi Terintegrasi
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
            Selamat datang di <strong>PanduWI</strong> (Panduan Widyaiswara Informasi), ekosistem asisten cerdas dan basis pengetahuan teknis yang mewakili <strong>Dr. Eko Subiyantoro, S.Pd., S.ST., MT.</strong> Eksplorasi arsitektur edge-to-cloud modern (ESP32, Microdot, Supabase, Vercel), simulasi 2D Digital Twin, serta repositori modul ajar untuk mata kuliah <strong>Algoritma Pemrograman</strong>, <strong>Pemrograman Web</strong>, dan <strong>Pemrograman IoT</strong>.
          </p>

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreDigitalTwin}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-2"
            >
              <span>Uji 2D Digital Twin Smart Tani</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreModules}
              className="px-4 py-2.5 text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>Repositori & Unggah Modul Kuliah</span>
            </button>

            <button
              onClick={() =>
                onOpenChatWithPrompt(
                  'PanduWI, apa proyek terbaru Dr. Eko terkait pertanian pintar, dan bagaimana saya bisa membangun web dashboard-nya?'
                )
              }
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Tanya Arsitektur Smart Tani</span>
            </button>

            <button
              onClick={() =>
                onOpenChatWithPrompt(
                  'PanduWI, buatkan draf silabus pelatihan Multi-Agent AIoT berbasis Problem-Based Learning (PBL) dan Bloom\'s Taxonomy lengkap dengan rubrik penilaian.'
                )
              }
              className="px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Rancang Kurikulum PBL</span>
            </button>
          </div>
        </div>

        {/* 4-Column Domain Foundations Grid below Hero */}
        <div className="mt-14 pt-8 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Mata Kuliah Utama 01</div>
            <div className="text-base font-bold text-slate-900">Algoritma Pemrograman</div>
            <div className="text-xs text-slate-500 mt-1">Logika, pseudocode, struktur data rekursi, graf & Big-O</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Mata Kuliah Utama 02</div>
            <div className="text-base font-bold text-slate-900">Pemrograman Web</div>
            <div className="text-xs text-slate-500 mt-1">Next.js, REST API, Supabase PostgreSQL, RLS & Vercel</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Mata Kuliah Utama 03</div>
            <div className="text-base font-bold text-slate-900">Pemrograman IoT</div>
            <div className="text-xs text-slate-500 mt-1">ESP32, Microdot Python, OneWire, 2D Digital Twin & CPS</div>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Pedagogi Vokasi Terukur</div>
            <div className="text-base font-bold text-slate-900">MBL, PBL & Bloom C1-C6</div>
            <div className="text-xs text-slate-500 mt-1">Peta kompetensi bertahap dengan studi kasus industri</div>
          </div>
        </div>
      </div>
    </section>
  );
}
