'use client';

import React from 'react';
import { MessageSquareText, Cpu } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
}

export function Navbar({ onOpenChat }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a href="#hero" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <span>PanduWI</span>
          <span className="text-xs font-normal text-slate-500 hidden sm:inline">Dr. Eko Subiyantoro</span>
        </a>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#digital-twin" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Digital Twin 2D
          </a>
          <a href="#modul-ajar" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 font-semibold text-emerald-800">
            Modul Kuliah
          </a>
          <a href="#kurikulum" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Kurikulum & PBL
          </a>
          <a href="#proyek" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Portofolio Proyek
          </a>
          <a href="#konsultasi" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
            Tanya PanduWI
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Konsultasi Mentor AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
