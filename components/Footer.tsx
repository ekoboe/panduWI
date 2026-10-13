'use client';

import React from 'react';
import { Cpu, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <span>PanduWI</span>
              <span className="text-xs font-normal text-slate-500">· Panduan Widyaiswara Informasi</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 max-w-lg">
              Portal asisten AI dan basis pengetahuan teknis Dr. Eko Subiyantoro, S.Pd., S.ST., MT., Widyaiswara Bidang Teknologi Informasi untuk mahasiswa, guru vokasi, dan peserta pelatihan.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600">
            <a href="#digital-twin" className="hover:text-slate-900 transition-colors">
              Digital Twin 2D
            </a>
            <a href="#proyek" className="hover:text-slate-900 transition-colors">
              Portofolio Proyek
            </a>
            <a href="#kurikulum" className="hover:text-slate-900 transition-colors">
              Kurikulum PBL
            </a>
            <a href="#arsitektur" className="hover:text-slate-900 transition-colors">
              Arsitektur & Kode
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 cursor-pointer font-medium ml-2"
            >
              <span>Kembali ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 PanduWI · Dr. Eko Subiyantoro, S.Pd., S.ST., MT. Hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-3">
            <span>ESP32 & Microdot</span>
            <span aria-hidden="true">·</span>
            <span>Supabase PostgreSQL</span>
            <span aria-hidden="true">·</span>
            <span>Vercel Edge</span>
            <span aria-hidden="true">·</span>
            <span>Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
