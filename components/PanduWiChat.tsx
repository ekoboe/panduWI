'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  {
    title: 'Arsitektur Smart Tani & Supabase',
    desc: 'Penjelasan sensor DS18B20, TDS, pH, YF-B1, ESP32 Microdot & Supabase',
    prompt:
      'PanduWI, apa proyek terbaru Dr. Eko terkait pertanian pintar, dan bagaimana saya bisa membangun web dashboard-nya?',
  },
  {
    title: 'Telaah Modul Algoritma & Big-O',
    desc: 'Review CPMK, struktur data rekursi & bank soal evaluasi mahasiswa',
    prompt:
      'PanduWI, tolong telaah modul mata kuliah Algoritma Pemrograman mengenai rekursi dan analisis Big-O. Buatkan 3 studi kasus pemrograman Python berbasis Problem-Based Learning (PBL) untuk mahasiswa!',
  },
  {
    title: 'Kode ESP32 Microdot ke Supabase',
    desc: 'Contoh skrip Python akuisisi sensor & HTTP POST payload aman',
    prompt:
      'PanduWI, bagaimana ESP32 menjalankan server Microdot dan mengirimkan payload data telemetri ke API Supabase secara aman?',
  },
  {
    title: 'Praktikum Web: REST & Supabase RLS',
    desc: 'Desain modul hands-on Next.js API Routes & database PostgreSQL',
    prompt:
      'PanduWI, tolong buatkan rancangan Lembar Kerja Mahasiswa (LKM) untuk mata kuliah Pemrograman Web: pembuatan REST API dengan Next.js dan otorisasi Row Level Security (RLS) di Supabase.',
  },
];

interface PanduWiChatProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export function PanduWiChat({ initialPrompt, onClearInitialPrompt }: PanduWiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Salam hormat, rekan pendidik, mahasiswa, dan sahabat diklat! Saya **PanduWI** (*Panduan Widyaiswara Informasi*), asisten AI yang mewakili **Dr. Eko Subiyantoro, S.Pd., S.ST., MT.**

Saya siap membimbing Anda dalam:
1. **Mata Kuliah Perkuliahan Mahasiswa**:
   - **Algoritma Pemrograman**: Logika pseudocode, rekursi, struktur data graf/pohon, serta efisiensi Big-O.
   - **Pemrograman Web**: Arsitektur Next.js, API routes, database Supabase PostgreSQL & Row Level Security.
   - **Pemrograman IoT**: Mikrokontroler ESP32/Pico W, Microdot Python, sensor interfacing, dan 2D Digital Twin.
2. **Arsitektur AIoT & Cyber-Physical Systems (CPS)**: Integrasi sensor (DS18B20, pH, TDS, YF-B1), Supabase time-series, dan visualisasi Vercel.
3. **Pengembangan & Telaah Modul Ajar**: Evaluasi keselarasan **CPMK** terhadap **Taksonomi Bloom (C1-C6)** dan skenario **Problem-Based Learning (PBL)**.

Silakan unggah modul kuliah Anda pada menu di atas atau ajukan pertanyaan teknis/pedagogis di sini!`,
      timestamp: 'Baru saja',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendPrompt = React.useCallback(
    async (promptText: string) => {
      if (!promptText.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: promptText.trim(),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal menghubungi server PanduWI.');
        }

        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.text || 'Maaf, tidak ada respon yang diterima.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err: any) {
        console.error(err);
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `Mohon maaf, terjadi kendala saat memproses permintaan: ${err.message}. Pastikan kunci API Gemini sudah terkonfigurasi pada server.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external prompt if passed
  useEffect(() => {
    if (initialPrompt) {
      const timer = setTimeout(() => {
        handleSendPrompt(initialPrompt);
        if (onClearInitialPrompt) onClearInitialPrompt();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt, handleSendPrompt, onClearInitialPrompt]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Sesi konsultasi telah diperbarui. Silakan ajukan pertanyaan seputar proyek AIoT Dr. Eko, kurikulum PBL/MBL, atau arsitektur sistem ESP32 + Supabase + Vercel.',
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <section id="konsultasi" className="py-16 md:py-20 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Konsultasi Mentor AI & Basis Pengetahuan
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            02. PanduWI AI: Mentor Virtual Dr. Eko Subiyantoro
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Konsultasikan implementasi teknis perangkat IoT, microframework Python, pipeline database Supabase, rancangan silabus Problem-Based Learning, hingga pemetaan taksonomi Bloom.
          </p>
        </div>

        {/* Quick Suggestion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(item.prompt)}
              className="p-3 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors cursor-pointer group bg-slate-50/60"
            >
              <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-800 flex items-center justify-between">
                <span>{item.title}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {item.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Chat Container Window */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[650px]">
          {/* Chat Window Header */}
          <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                WI
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>PanduWI Virtual Mentor</span>
                  <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">
                    · Dosen & Widyaiswara TI
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Model AI Aktif: Gemini 3.8 Flash · Integrasi Arsitektur Supabase & Vercel
                </div>
              </div>
            </div>

            <button
              onClick={handleResetChat}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Bersihkan riwayat percakapan"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Sesi</span>
            </button>
          </div>

          {/* Chat Message List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Body */}
                <div
                  className={`rounded-xl p-4 text-sm leading-relaxed border ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white border-slate-800'
                      : 'bg-white text-slate-900 border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Sender metadata & Copy Button */}
                  <div
                    className={`flex items-center justify-between gap-4 pb-2 mb-2 border-b text-[11px] ${
                      msg.role === 'user'
                        ? 'border-slate-800 text-slate-400'
                        : 'border-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="font-medium">
                      {msg.role === 'user' ? 'Pertanyaan Anda' : 'PanduWI (Dr. Eko Subiyantoro)'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-emerald-700 transition-colors p-0.5 rounded cursor-pointer"
                        title="Salin pesan"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Message Content rendered in Markdown */}
                  <div className="prose prose-sm max-w-none prose-slate prose-headings:font-bold prose-headings:text-slate-900 prose-headings:my-2 prose-p:my-1.5 prose-ul:my-1 prose-li:my-0.5 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-3 prose-pre:rounded-lg prose-code:font-mono prose-code:text-emerald-800 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-7 h-7 rounded-md shrink-0 bg-emerald-700 text-white flex items-center justify-center text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>PanduWI sedang menyusun penjelasan & referensi kurikulum...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ajukan pertanyaan mengenai AIoT, ESP32, Supabase, kurikulum PBL, atau proyek Dr. Eko..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </form>
            <div className="mt-2 text-[11px] text-slate-500 text-center">
              Jawaban berorientasi pedagogi kejuruan, kode aman, serta arsitektur cloud terverifikasi.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
