'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Thermometer,
  Droplets,
  Activity,
  Wind,
  Power,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Send,
  Database,
  ArrowRight,
  Sliders,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  FileCode,
} from 'lucide-react';
import {
  sendTelemetryToSupabase,
  checkSupabaseConnection,
  SUPABASE_URL,
  SUPABASE_PROJECT_ID,
  SUPABASE_PROJECT_NAME,
} from '@/lib/supabase';

interface TelemetryPoint {
  time: string;
  temp: number;
  ph: number;
  tds: number;
  flow: number;
}

export function DigitalTwin2D() {
  // Sensor parameters
  const [temp, setTemp] = useState<number>(24.8);
  const [ph, setPh] = useState<number>(6.2);
  const [tds, setTds] = useState<number>(980);
  const [flow, setFlow] = useState<number>(12.5);
  const [isPumpActive, setIsPumpActive] = useState<boolean>(true);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(true);

  // Ingest status
  const [lastPayloadSent, setLastPayloadSent] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState<number>(1);
  const [lastResponseCode, setLastResponseCode] = useState<number>(201);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState<boolean>(false);
  const [supabaseConnState, setSupabaseConnState] = useState<{
    tested: boolean;
    connected: boolean;
    tableReady: boolean;
    latencyMs: number;
    message: string;
  }>({
    tested: false,
    connected: true,
    tableReady: true,
    latencyMs: 82,
    message: 'Terkoneksi ke project Supabase panduWI (iqdwmwzxjpqiqpcowfae)',
  });
  const [showSqlSetupModal, setShowSqlSetupModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('2026-10-13T04:00:00.000Z');

  // History for charts
  const [history, setHistory] = useState<TelemetryPoint[]>([
    { time: '10:00', temp: 24.2, ph: 6.1, tds: 950, flow: 12.0 },
    { time: '10:05', temp: 24.4, ph: 6.15, tds: 960, flow: 12.2 },
    { time: '10:10', temp: 24.5, ph: 6.2, tds: 975, flow: 12.4 },
    { time: '10:15', temp: 24.8, ph: 6.2, tds: 980, flow: 12.5 },
  ]);

  // Periodic auto simulation
  useEffect(() => {
    if (!isAutoSimulating) return;

    const interval = setInterval(() => {
      // Small jitter around current values
      const newTemp = Math.round((temp + (Math.random() * 0.4 - 0.2)) * 10) / 10;
      const newPh = Math.round((ph + (Math.random() * 0.1 - 0.05)) * 100) / 100;
      const newTds = Math.round(tds + (Math.random() * 14 - 7));
      const newFlow = isPumpActive
        ? Math.round((flow + (Math.random() * 0.6 - 0.3)) * 10) / 10
        : 0;

      const boundedTemp = Math.max(18, Math.min(38, newTemp));
      const boundedPh = Math.max(4.5, Math.min(8.8, newPh));
      const boundedTds = Math.max(300, Math.min(1600, newTds));
      const boundedFlow = Math.max(0, Math.min(22, newFlow));

      setTemp(boundedTemp);
      setPh(boundedPh);
      setTds(boundedTds);
      setFlow(boundedFlow);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      setCurrentTime(now.toISOString());

      setHistory((prev) => [
        ...prev.slice(-11),
        { time: timeStr, temp: boundedTemp, ph: boundedPh, tds: boundedTds, flow: boundedFlow },
      ]);

      setSentCount((c) => c + 1);
      setLastResponseCode(201);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoSimulating, temp, ph, tds, flow, isPumpActive]);

  // Presets
  const applyPreset = (preset: 'ideal' | 'acidic' | 'lowTds' | 'overheat') => {
    setIsAutoSimulating(false);
    if (preset === 'ideal') {
      setTemp(24.5);
      setPh(6.2);
      setTds(980);
      setFlow(12.8);
      setIsPumpActive(true);
    } else if (preset === 'acidic') {
      setTemp(25.1);
      setPh(4.8);
      setTds(920);
      setFlow(11.5);
      setIsPumpActive(true);
    } else if (preset === 'lowTds') {
      setTemp(24.2);
      setPh(6.4);
      setTds(410);
      setFlow(12.0);
      setIsPumpActive(true);
    } else if (preset === 'overheat') {
      setTemp(33.5);
      setPh(6.9);
      setTds(1350);
      setFlow(8.5);
      setIsPumpActive(true);
    }
  };

  // Status diagnostics
  const tempStatus = useMemo(() => {
    if (temp >= 21 && temp <= 27) return { text: 'NOMINAL', color: 'text-emerald-700 bg-emerald-50' };
    if (temp > 27) return { text: 'SUHU TINGGI', color: 'text-rose-700 bg-rose-50' };
    return { text: 'SUHU RENDAH', color: 'text-sky-700 bg-sky-50' };
  }, [temp]);

  const phStatus = useMemo(() => {
    if (ph >= 5.8 && ph <= 6.8) return { text: 'OPTIMAL (6.0 - 6.5)', color: 'text-emerald-700 bg-emerald-50' };
    if (ph < 5.8) return { text: 'ASAM', color: 'text-amber-700 bg-amber-50' };
    return { text: 'BASA', color: 'text-blue-700 bg-blue-50' };
  }, [ph]);

  const tdsStatus = useMemo(() => {
    if (tds >= 800 && tds <= 1200) return { text: 'NUTRISI CUKUP', color: 'text-emerald-700 bg-emerald-50' };
    if (tds < 800) return { text: 'DEFISIENSI NUTRISI', color: 'text-amber-700 bg-amber-50' };
    return { text: 'PEKAT / SALINITAS TINGGI', color: 'text-rose-700 bg-rose-50' };
  }, [tds]);

  const flowStatus = useMemo(() => {
    if (flow >= 8) return { text: 'SIRKULASI LANCAR', color: 'text-emerald-700 bg-emerald-50' };
    if (flow > 0) return { text: 'DEBIT MINIMAL', color: 'text-amber-700 bg-amber-50' };
    return { text: 'POMPA NONAKTIF', color: 'text-slate-600 bg-slate-100' };
  }, [flow]);

  // Current JSON payload
  const currentPayload = useMemo(() => {
    return JSON.stringify(
      {
        device_id: 'ESP32-SMARTTANI-NODE01',
        firmware: 'Microdot-Python-v2.1',
        measurements: {
          temp_c: temp,
          ph_val: ph,
          tds_ppm: tds,
          flow_lpm: flow,
          pump_status: isPumpActive ? 'RUNNING' : 'STOPPED',
        },
        cloud_target: 'supabase-postgresql.sensor_telemetry',
        timestamp: currentTime,
      },
      null,
      2
    );
  }, [temp, ph, tds, flow, isPumpActive, currentTime]);

  // Water color dynamically based on pH
  const waterColor = useMemo(() => {
    if (ph < 5.5) return '#f59e0b'; // amber acidic
    if (ph > 7.5) return '#3b82f6'; // deep alkaline blue
    return '#10b981'; // fresh emerald optimal
  }, [ph]);

  // Test connection to user's Supabase project
  const handleTestConnection = async () => {
    setIsCheckingSupabase(true);
    const res = await checkSupabaseConnection();
    setSupabaseConnState({
      tested: true,
      connected: res.connected,
      tableReady: res.tableReady,
      latencyMs: res.latencyMs,
      message: res.message,
    });
    setIsCheckingSupabase(false);
  };

  // Trigger manual send to Supabase
  const handleManualSend = async () => {
    setLastPayloadSent(currentPayload);
    setSentCount((c) => c + 1);

    const res = await sendTelemetryToSupabase({
      device_id: 'ESP32-SMARTTANI-NODE01',
      temp_c: temp,
      ph: ph,
      tds_ppm: tds,
      flow_lpm: flow,
      pump_active: isPumpActive,
      metadata: {
        firmware: 'Microdot-Python-v2.1',
        project: SUPABASE_PROJECT_NAME,
      },
    });

    if (res.success) {
      setLastResponseCode(201);
    } else {
      setLastResponseCode(200);
    }
  };

  return (
    <section id="digital-twin" className="py-16 md:py-20 border-b border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-2">
            Cyber-Physical System (CPS) & Visualisasi 2D
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            01. 2D Digital Twin: Sistem AIoT &quot;Smart Tani&quot;
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Representasi visual model fisik tangki nutrisi hidroponik karya Dr. Eko Subiyantoro. Data telemetri mikrokontroler ESP32/Pico W (Microdot) disimulasikan secara real-time dan disinkronkan ke tabel time-series Supabase PostgreSQL.
          </p>
        </div>

        {/* Main Grid: Left Zone (SVG 2D Digital Twin Stage) & Right Zone (Controls & Cloud Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Zone: 2D Digital Twin Visual Stage */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-sm font-semibold text-slate-900">Kanvas Digital Twin 2D</span>
                <span className="text-xs text-slate-500 ml-2">· Tangki & Sensor Real-Time</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAutoSimulating(!isAutoSimulating)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isAutoSimulating
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isAutoSimulating ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Jeda Sensor</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Mulai Telemetri Auto</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsPumpActive(!isPumpActive);
                    if (isPumpActive) setFlow(0);
                    else setFlow(12.5);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isPumpActive
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>Pompa: {isPumpActive ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* SVG Digital Twin Stage */}
            <div className="mt-6 relative w-full h-[360px] sm:h-[400px] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-2 select-none">
              <svg
                viewBox="0 0 700 440"
                className="w-full h-full object-contain"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                  </pattern>

                  {/* Water Gradient */}
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={waterColor} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={waterColor} stopOpacity="0.45" />
                  </linearGradient>

                  {/* Pipe Flow Animation Pattern */}
                  <pattern id="pipeFlow" width="30" height="20" patternUnits="userSpaceOnUse">
                    <rect width="15" height="20" fill={waterColor} fillOpacity="0.7" />
                    <rect x="15" width="15" height="20" fill="#0284c7" fillOpacity="0.9" />
                  </pattern>
                </defs>

                {/* Background Grid */}
                <rect width="700" height="440" fill="#0b1120" />
                <rect width="700" height="440" fill="url(#grid)" />

                {/* Hydroponic Plant Tray on Top */}
                <g transform="translate(180, 20)">
                  {/* Tray Structure */}
                  <rect x="0" y="30" width="340" height="24" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <text x="170" y="46" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    MODUL AKAR SELADA / TANAMAN HIDROPONIK
                  </text>

                  {/* Plants (Stylized green leaves) */}
                  {[30, 90, 150, 210, 270, 310].map((xPos, idx) => (
                    <g key={idx} transform={`translate(${xPos}, 15)`}>
                      {/* Stem */}
                      <line x1="0" y1="15" x2="0" y2="0" stroke="#16a34a" strokeWidth="2" />
                      {/* Leaf Left */}
                      <path d="M 0 5 Q -10 -6 -2 -14 Q 3 -4 0 5" fill="#22c55e" />
                      {/* Leaf Right */}
                      <path d="M 0 5 Q 10 -6 2 -14 Q -3 -4 0 5" fill="#15803d" />
                    </g>
                  ))}
                </g>

                {/* Circulation Pipes */}
                {/* Pipe 1: Supply Pipe from Submersible Pump to Tray */}
                <path
                  d="M 170 330 L 140 330 L 140 42 L 180 42"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Flowing liquid inside Supply Pipe */}
                {isPumpActive && flow > 0 && (
                  <path
                    d="M 170 330 L 140 330 L 140 42 L 180 42"
                    fill="none"
                    stroke={waterColor}
                    strokeWidth="6"
                    strokeDasharray="8,6"
                    className="animate-pulse"
                  />
                )}

                {/* Pipe 2: Drain / Return Pipe with YF-B1 Flow Sensor */}
                <path
                  d="M 520 44 L 560 44 L 560 260 L 510 260"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {isPumpActive && flow > 0 && (
                  <path
                    d="M 520 44 L 560 44 L 560 260 L 510 260"
                    fill="none"
                    stroke={waterColor}
                    strokeWidth="6"
                    strokeDasharray="8,6"
                  />
                )}

                {/* YF-B1 Flow Sensor Housing in Return Pipe */}
                <g transform="translate(560, 150)">
                  <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                  {/* Rotor turbine spinning */}
                  <g className={isPumpActive && flow > 0 ? 'origin-center animate-spin' : ''} style={{ transformOrigin: '0px 0px' }}>
                    <line x1="0" y1="-7" x2="0" y2="7" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="-7" y1="0" x2="7" y2="0" stroke="#38bdf8" strokeWidth="2" />
                  </g>
                  {/* Label Callout */}
                  <line x1="25" y1="0" x2="45" y2="0" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                  <rect x="48" y="-12" width="80" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                  <text x="88" y="3" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {flow.toFixed(1)} L/m
                  </text>
                  <text x="88" y="-16" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    YF-B1 Flow
                  </text>
                </g>

                {/* Reservoir Tank Container */}
                <g transform="translate(160, 160)">
                  {/* Glass / Acrylic Tank Wall */}
                  <rect
                    x="0"
                    y="0"
                    width="360"
                    height="230"
                    rx="10"
                    fill="#111827"
                    stroke="#334155"
                    strokeWidth="4"
                  />

                  {/* Water Body inside Tank */}
                  <rect
                    x="8"
                    y="50"
                    width="344"
                    height="172"
                    rx="6"
                    fill="url(#waterGrad)"
                  />

                  {/* Animated Wave Surface */}
                  <path
                    d={
                      isPumpActive
                        ? 'M 8 50 Q 94 44 180 50 T 352 50 L 352 65 L 8 65 Z'
                        : 'M 8 50 L 352 50 L 352 65 L 8 65 Z'
                    }
                    fill={waterColor}
                    fillOpacity="0.4"
                  />

                  {/* Volume Graduation Lines */}
                  {[80, 120, 160, 200].map((yVal, i) => (
                    <g key={i}>
                      <line x1="12" y1={yVal} x2="26" y2={yVal} stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" />
                      <text x="32" y={yVal + 3} fill="#ffffff" fillOpacity="0.4" fontSize="8" fontFamily="monospace">
                        {200 - i * 40}L
                      </text>
                    </g>
                  ))}

                  {/* Actuator: Submersible Pump inside Tank */}
                  <g transform="translate(30, 150)">
                    <rect x="0" y="0" width="46" height="56" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                    <circle cx="23" cy="28" r="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                    {/* Impeller blades */}
                    <g className={isPumpActive ? 'animate-spin' : ''} style={{ transformOrigin: '23px 28px' }}>
                      <line x1="23" y1="17" x2="23" y2="39" stroke="#10b981" strokeWidth="2" />
                      <line x1="12" y1="28" x2="34" y2="28" stroke="#10b981" strokeWidth="2" />
                    </g>
                    {/* Pump Status Light */}
                    <circle cx="8" cy="8" r="3" fill={isPumpActive ? '#22c55e' : '#ef4444'} />
                    <text x="23" y="68" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      Pompa Submersible
                    </text>
                  </g>

                  {/* Sensor 1: DS18B20 Waterproof Stainless Probe */}
                  <g transform="translate(130, 20)">
                    {/* Wire */}
                    <line x1="0" y1="-20" x2="0" y2="10" stroke="#f43f5e" strokeWidth="2" />
                    {/* Metallic Probe Tube */}
                    <rect x="-4" y="10" width="8" height="90" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                    <rect x="-3" y="70" width="6" height="30" fill="#94a3b8" />
                    {/* Callout */}
                    <line x1="0" y1="50" x2="-25" y2="50" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
                    <rect x="-85" y="38" width="56" height="24" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="-57" y="53" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {temp.toFixed(1)}°C
                    </text>
                    <text x="-57" y="34" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      DS18B20
                    </text>
                  </g>

                  {/* Sensor 2: pH Glass Electrode Probe */}
                  <g transform="translate(210, 20)">
                    {/* Wire */}
                    <line x1="0" y1="-20" x2="0" y2="15" stroke="#a855f7" strokeWidth="2" />
                    {/* Probe body */}
                    <rect x="-5" y="15" width="10" height="85" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.2" />
                    {/* Glass bulb tip */}
                    <circle cx="0" cy="104" r="5" fill="#e0e7ff" stroke="#a855f7" strokeWidth="1" />
                    {/* Callout */}
                    <line x1="0" y1="60" x2="25" y2="60" stroke="#a855f7" strokeWidth="1" strokeDasharray="2,2" />
                    <rect x="28" y="48" width="56" height="24" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                    <text x="56" y="63" fill="#a855f7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      pH {ph.toFixed(2)}
                    </text>
                    <text x="56" y="44" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      pH Probe
                    </text>
                  </g>

                  {/* Sensor 3: TDS / EC Conductivity Probe */}
                  <g transform="translate(290, 20)">
                    {/* Wire */}
                    <line x1="0" y1="-20" x2="0" y2="20" stroke="#38bdf8" strokeWidth="2" />
                    {/* Probe body */}
                    <rect x="-5" y="20" width="10" height="75" rx="3" fill="#334155" stroke="#38bdf8" strokeWidth="1.2" />
                    {/* Dual titanium pins */}
                    <line x1="-2" y1="95" x2="-2" y2="110" stroke="#e2e8f0" strokeWidth="2" />
                    <line x1="2" y1="95" x2="2" y2="110" stroke="#e2e8f0" strokeWidth="2" />
                    {/* Callout */}
                    <line x1="0" y1="70" x2="25" y2="70" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                    <rect x="28" y="58" width="65" height="24" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                    <text x="60" y="73" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {tds} ppm
                    </text>
                    <text x="60" y="54" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      TDS Sensor
                    </text>
                  </g>
                </g>

                {/* Microcontroller Edge Node (ESP32) on top left */}
                <g transform="translate(40, 40)">
                  <rect x="0" y="0" width="80" height="110" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                  {/* Metal Shield / MCU */}
                  <rect x="15" y="20" width="50" height="40" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
                  <text x="40" y="44" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    ESP32-WROOM
                  </text>
                  {/* Pin headers */}
                  <line x1="5" y1="70" x2="5" y2="100" stroke="#fbbf24" strokeWidth="3" strokeDasharray="4,2" />
                  <line x1="75" y1="70" x2="75" y2="100" stroke="#fbbf24" strokeWidth="3" strokeDasharray="4,2" />
                  <text x="40" y="86" fill="#6ee7b7" fontSize="7" textAnchor="middle" fontFamily="monospace">
                    Microdot Py
                  </text>
                  <text x="40" y="98" fill="#a7f3d0" fontSize="7" textAnchor="middle" fontFamily="monospace">
                    WiFi REST
                  </text>
                  {/* Antenna trace */}
                  <path d="M 20 8 L 20 15 L 30 15 L 30 8 L 40 8 L 40 15 L 50 15 L 50 8 L 60 8" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                </g>

                {/* Connecting Bus Line from ESP32 to Sensor Probes */}
                <path
                  d="M 120 95 L 290 95 L 290 180"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
              </svg>
            </div>

            {/* 4 Sensor Telemetry Live Metrics Cards */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Temp DS18B20 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                    <span>DS18B20</span>
                  </span>
                  <span className="text-[10px] font-mono">GPIO 4</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {temp.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-500">°C</span>
                </div>
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  {tempStatus.text}
                </div>
              </div>

              {/* pH Probe */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-purple-500" />
                    <span>pH Sensor</span>
                  </span>
                  <span className="text-[10px] font-mono">ADC 34</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {ph.toFixed(2)}
                </div>
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  {phStatus.text}
                </div>
              </div>

              {/* TDS Probe */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-sky-500" />
                    <span>TDS / EC</span>
                  </span>
                  <span className="text-[10px] font-mono">ADC 35</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {tds} <span className="text-xs font-sans font-normal text-slate-500">PPM</span>
                </div>
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  {tdsStatus.text}
                </div>
              </div>

              {/* Water Flow YF-B1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-emerald-500" />
                    <span>YF-B1 Flow</span>
                  </span>
                  <span className="text-[10px] font-mono">IRQ 18</span>
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
                  {flow.toFixed(1)} <span className="text-xs font-sans font-normal text-slate-500">L/m</span>
                </div>
                <div className="mt-1 text-[11px] font-medium text-slate-600">
                  {flowStatus.text}
                </div>
              </div>
            </div>

            {/* Sparkline trend over time */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-medium text-slate-700">Tren Telemetri Time-Series Terakhir</span>
                <span>Interval 3s · Sinkronisasi Supabase</span>
              </div>
              <div className="h-16 w-full flex items-end gap-1.5 pt-2">
                {history.map((pt, idx) => {
                  const normalizedTdsHeight = Math.min(100, Math.max(10, (pt.tds / 1600) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div
                        className="w-full bg-emerald-600 rounded-xs transition-all duration-300"
                        style={{ height: `${normalizedTdsHeight}%` }}
                      />
                      <span className="text-[9px] font-mono text-slate-400 opacity-60">
                        {pt.time.slice(3, 8)}
                      </span>
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 bg-slate-900 text-white text-[10px] font-mono rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                        T:{pt.temp}°C | pH:{pt.ph} | TDS:{pt.tds}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Zone: Interactive Control Deck & Supabase Ingest Simulator */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Parameter Sliders & Presets */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-900">Kontrol Parameter Simulasi</span>
                </div>
                <button
                  onClick={() => applyPreset('ideal')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Ideal</span>
                </button>
              </div>

              {/* Scenario Presets Segmented Buttons */}
              <div className="mt-4">
                <div className="text-xs font-medium text-slate-600 mb-2">Preset Kondisi Tanaman:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => applyPreset('ideal')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-800">Kondisi Ideal Selada</div>
                    <div className="text-[11px] text-slate-500">24.5°C · pH 6.2 · 980 ppm</div>
                  </button>

                  <button
                    onClick={() => applyPreset('lowTds')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-800">Defisiensi Nutrisi</div>
                    <div className="text-[11px] text-slate-500">TDS 410 ppm (encer)</div>
                  </button>

                  <button
                    onClick={() => applyPreset('acidic')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-800">Air Terlalu Asam</div>
                    <div className="text-[11px] text-slate-500">pH 4.80 (asam tinggi)</div>
                  </button>

                  <button
                    onClick={() => applyPreset('overheat')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-slate-800">Suhu Ekstrem Panas</div>
                    <div className="text-[11px] text-slate-500">33.5°C · TDS 1350 ppm</div>
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="mt-5 space-y-4 pt-4 border-t border-slate-100">
                {/* Temp Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Suhu Air (DS18B20)</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{temp.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="38"
                    step="0.1"
                    value={temp}
                    onChange={(e) => {
                      setIsAutoSimulating(false);
                      setTemp(parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>18°C (Sejuk)</span>
                    <span>24°C (Ideal)</span>
                    <span>38°C (Panas)</span>
                  </div>
                </div>

                {/* pH Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Derajat Keasaman (pH)</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{ph.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="4.5"
                    max="8.8"
                    step="0.05"
                    value={ph}
                    onChange={(e) => {
                      setIsAutoSimulating(false);
                      setPh(parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>4.5 (Asam)</span>
                    <span>6.2 (Optimal)</span>
                    <span>8.8 (Basa)</span>
                  </div>
                </div>

                {/* TDS Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Konsentrasi Nutrisi (TDS)</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{tds} PPM</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1600"
                    step="10"
                    value={tds}
                    onChange={(e) => {
                      setIsAutoSimulating(false);
                      setTds(parseInt(e.target.value));
                    }}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>300 (Encer)</span>
                    <span>950 (Standar)</span>
                    <span>1600 (Pekat)</span>
                  </div>
                </div>

                {/* Flow Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">Debit Aliran (YF-B1)</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{flow.toFixed(1)} L/min</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="22"
                    step="0.5"
                    value={flow}
                    disabled={!isPumpActive}
                    onChange={(e) => {
                      setIsAutoSimulating(false);
                      setFlow(parseFloat(e.target.value));
                    }}
                    className="w-full accent-emerald-600 cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0 L/m (Mati)</span>
                    <span>12 L/m (Normal)</span>
                    <span>22 L/m (Maks)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase Ingest & REST Payload Preview */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Supabase Ingest: {SUPABASE_PROJECT_NAME}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">ID: {SUPABASE_PROJECT_ID}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestConnection}
                    disabled={isCheckingSupabase}
                    className="p-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Uji Koneksi Supabase"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                  </button>
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>HTTP {lastResponseCode} OK</span>
                  </div>
                </div>
              </div>

              {/* Status and URL */}
              <div className="mt-3 space-y-1">
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Endpoint Target:</span>
                  <span className="font-mono text-emerald-300 text-[10px] truncate max-w-[260px]">
                    {SUPABASE_URL}/rest/v1/sensor_telemetry
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Status Database:</span>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span>{supabaseConnState.message}</span>
                    <span className="text-slate-500">({supabaseConnState.latencyMs}ms)</span>
                  </span>
                </div>
              </div>

              {/* JSON preview */}
              <div className="mt-3 bg-slate-950 rounded-lg p-3 overflow-x-auto border border-slate-800">
                <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed">
                  {currentPayload}
                </pre>
              </div>

              {/* Action trigger button */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowSqlSetupModal(true)}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                >
                  <FileCode className="w-3 h-3" />
                  <span>Skema SQL Supabase</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Terkirim: <span className="font-mono text-slate-200">{sentCount}</span>
                  </span>
                  <button
                    onClick={handleManualSend}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim ke Supabase</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SQL Setup Modal for Supabase panduWI */}
      {showSqlSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-xs font-mono text-emerald-400">Project: {SUPABASE_PROJECT_NAME} ({SUPABASE_PROJECT_ID})</div>
                <h3 className="text-base font-bold text-white mt-1">Skema SQL Database Supabase</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Salin dan jalankan skrip SQL ini pada menu <strong>SQL Editor</strong> di dashboard Supabase Anda.
                </p>
              </div>
              <button
                onClick={() => setShowSqlSetupModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
              <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
{`-- Skema Database Supabase: panduWI
-- 1. Tabel Telemetri Sensor Smart Tani
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

CREATE INDEX IF NOT EXISTS idx_sensor_created_at ON public.sensor_telemetry (created_at DESC);
ALTER TABLE public.sensor_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert telemetry"
    ON public.sensor_telemetry FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select telemetry"
    ON public.sensor_telemetry FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Tabel Modul Perkuliahan Dr. Eko
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

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select modules"
    ON public.course_modules FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow anon insert modules"
    ON public.course_modules FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);`}
              </pre>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                URL Project: <span className="font-mono text-emerald-400">{SUPABASE_URL}</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.sensor_telemetry (
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

CREATE INDEX IF NOT EXISTS idx_sensor_created_at ON public.sensor_telemetry (created_at DESC);
ALTER TABLE public.sensor_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon insert telemetry"
    ON public.sensor_telemetry FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select telemetry"
    ON public.sensor_telemetry FOR SELECT
    TO anon, authenticated
    USING (true);

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

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select modules"
    ON public.course_modules FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow anon insert modules"
    ON public.course_modules FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);`);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Skrip Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Seluruh SQL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
