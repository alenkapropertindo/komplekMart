import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Clock, 
  Plus, 
  Check, 
  Sun, 
  Moon, 
  Zap, 
  Power, 
  HeartHandshake, 
  ShoppingBag, 
  ArrowUpRight, 
  Calendar,
  Flame,
  ChevronRight,
  Info
} from 'lucide-react';
import { Product } from '../types';

interface JumatBerkahFlashSaleProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  addedAnimationId: string | null;
}

export default function JumatBerkahFlashSale({
  products,
  onSelectProduct,
  onAddToCart,
  addedAnimationId
}: JumatBerkahFlashSaleProps) {
  // Check real day of week: 5 is Friday in JS (0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
  const isRealFriday = useMemo(() => new Date().getDay() === 5, []);

  // Force/Simulate Friday Mode toggle - default true so users can immediately experience & evaluate the UI
  const [isFridayModeActive, setIsFridayModeActive] = useState<boolean>(true);

  // Selected discount preset for the interactive arc dial
  const [selectedDialPreset, setSelectedDialPreset] = useState<number>(35); // 35% discount

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    hours: 4,
    minutes: 24,
    seconds: 15,
    daysUntilNextFriday: 0
  });

  // Calculate live countdown to Friday 21:00 WIB or to next Friday 06:00 WIB
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentDay = now.getDay();
      
      if (isFridayModeActive || currentDay === 5) {
        // Friday promo active: Countdown until Friday night 21:00 WIB
        const target = new Date(now);
        target.setHours(21, 0, 0, 0);
        
        let diff = target.getTime() - now.getTime();
        if (diff <= 0) {
          // If past 21:00, show remaining until midnight
          target.setHours(23, 59, 59, 999);
          diff = Math.max(0, target.getTime() - now.getTime());
        }
        
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        setCountdown({
          hours: isNaN(h) ? 4 : h,
          minutes: isNaN(m) ? 24 : m,
          seconds: isNaN(s) ? 15 : s,
          daysUntilNextFriday: 0
        });
      } else {
        // Not Friday: calculate days & time until next Friday 06:00
        let daysAhead = (5 - currentDay + 7) % 7;
        if (daysAhead === 0) daysAhead = 7;
        
        const nextFri = new Date(now);
        nextFri.setDate(now.getDate() + daysAhead);
        nextFri.setHours(6, 0, 0, 0);
        
        const diff = Math.max(0, nextFri.getTime() - now.getTime());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        setCountdown({
          hours: h,
          minutes: m,
          seconds: s,
          daysUntilNextFriday: days
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isFridayModeActive]);

  // Flash sale products (fallback to first 4 products if none marked)
  const flashSaleItems = useMemo(() => {
    const list = products.filter(p => p.isFlashSale);
    if (list.length >= 4) return list;
    return products.slice(0, 5);
  }, [products]);

  // Quick bundle / scene state
  const [activeScene, setActiveScene] = useState<'pagi' | 'sedekah'>('pagi');

  // Generate radial arc ticks for the Neumorphic dial
  // Dial covers approx -125deg to +125deg (250 degrees total) with 45 ticks
  const dialTicks = useMemo(() => {
    const totalTicks = 45;
    const startAngle = -125;
    const endAngle = 125;
    const angleStep = (endAngle - startAngle) / (totalTicks - 1);
    
    // Convert selected discount (10% to 50%) to active tick ratio
    const minVal = 10;
    const maxVal = 50;
    const ratio = Math.min(1, Math.max(0, (selectedDialPreset - minVal) / (maxVal - minVal)));
    const activeTickIndex = Math.round(ratio * (totalTicks - 1));

    const ticks = [];
    for (let i = 0; i < totalTicks; i++) {
      const angle = startAngle + i * angleStep;
      const angleRad = (angle * Math.PI) / 180;
      
      const innerRadius = i % 5 === 0 ? 60 : 64;
      const outerRadius = 74;

      const x1 = 110 + innerRadius * Math.sin(angleRad);
      const y1 = 110 - innerRadius * Math.cos(angleRad);
      const x2 = 110 + outerRadius * Math.sin(angleRad);
      const y2 = 110 - outerRadius * Math.cos(angleRad);

      ticks.push({
        id: i,
        angle,
        x1,
        y1,
        x2,
        y2,
        isMajor: i % 5 === 0,
        isActive: i <= activeTickIndex
      });
    }

    // Needle pointer coordinates
    const needleAngle = startAngle + activeTickIndex * angleStep;
    const needleRad = (needleAngle * Math.PI) / 180;
    const needleX1 = 110 + 44 * Math.sin(needleRad);
    const needleY1 = 110 - 44 * Math.cos(needleRad);
    const needleX2 = 110 + 82 * Math.sin(needleRad);
    const needleY2 = 110 - 82 * Math.cos(needleRad);

    return { ticks, needle: { x1: needleX1, y1: needleY1, x2: needleX2, y2: needleY2 } };
  }, [selectedDialPreset]);

  return (
    <section className="mb-10 w-full">
      {/* Neumorphic Section Container */}
      <div className="bg-[#e6ebf2] p-5 sm:p-7 rounded-[32px] border border-white/80 shadow-[10px_10px_24px_#c5ccd7,-10px_-10px_24px_#ffffff] transition-all">
        
        {/* Section Header with Neumorphism Banner & Real-time Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
                JUMAT BERKAH
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/60">
                Mingguan • Setiap Jumat
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              Flash Sale Jumat Berkah
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Subsidi sembako warga & sedekah pangan perumahan setiap hari Jumat
            </p>
          </div>

          {/* Neumorphic Power Toggle Switch (matching the "On." toggle from the reference image) */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500">
              {isFridayModeActive ? 'Hari Jumat' : 'Bukan Jumat'}
            </span>
            <button
              type="button"
              onClick={() => setIsFridayModeActive(!isFridayModeActive)}
              aria-label="Toggle Mode Jumat Berkah"
              className={`h-9 px-3 rounded-full flex items-center gap-2 transition-all cursor-pointer select-none ${
                isFridayModeActive
                  ? 'bg-[#e2e7ee] shadow-[inset_3px_3px_6px_#c2c9d4,inset_-3px_-3px_6px_#ffffff] text-slate-800'
                  : 'bg-[#e6ebf2] shadow-[4px_4px_10px_#c7cfda,-4px_-4px_10px_#ffffff] text-slate-400'
              }`}
              title="Klik untuk beralih antara Mode Jumat Aktif & Hitung Mundur"
            >
              <span className="text-xs font-black tracking-wide">
                {isFridayModeActive ? 'On.' : 'Off'}
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isFridayModeActive
                    ? 'bg-emerald-500 text-white shadow-[2px_2px_5px_#047857]'
                    : 'bg-slate-300 text-slate-500 shadow-[inset_1px_1px_2px_#94a3b8]'
                }`}
              >
                <Power className="w-3 h-3 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>

        {/* CONDITION 1: IF FRIDAY IS NOT ACTIVE (Countdown Teaser Mode) */}
        {!isFridayModeActive && (
          <div className="py-6 px-4 sm:px-8 text-center flex flex-col items-center">
            {/* Neumorphic Inset Clock Badge */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#e6ebf2] shadow-[6px_6px_14px_#c5ccd7,-6px_-6px_14px_#ffffff] border border-white/60 mb-4">
              <Calendar className="w-9 h-9 text-[#ff6b00]" />
            </div>

            <span className="text-xs font-black uppercase tracking-widest text-[#ff6b00] bg-orange-100/60 px-3 py-1 rounded-full border border-orange-200/60 mb-2">
              HANYA SETIAP HARI JUMAT
            </span>
            
            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight max-w-md">
              Flash Sale Jumat Berkah Kembali Hadir Hari Jumat Pukul 06:00 WIB
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Dapatkan subsidi minyak goreng, telur ayam segar, beras premium, dan paket sedekah Jumat dengan potongan harga s.d. 50%.
            </p>

            {/* Neumorphic Countdown Boxes */}
            <div className="mt-6 flex items-center gap-2 sm:gap-3">
              <div className="bg-[#e2e7ee] shadow-[inset_3px_3px_6px_#c2c9d4,inset_-3px_-3px_6px_#ffffff] border border-white/40 rounded-2xl px-3 py-2.5 min-w-[64px] text-center">
                <span className="block text-lg font-black text-slate-800 tabular-nums">
                  {countdown.daysUntilNextFriday || 3}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hari</span>
              </div>
              <span className="text-slate-400 font-black text-lg">:</span>
              <div className="bg-[#e2e7ee] shadow-[inset_3px_3px_6px_#c2c9d4,inset_-3px_-3px_6px_#ffffff] border border-white/40 rounded-2xl px-3 py-2.5 min-w-[64px] text-center">
                <span className="block text-lg font-black text-slate-800 tabular-nums">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Jam</span>
              </div>
              <span className="text-slate-400 font-black text-lg">:</span>
              <div className="bg-[#e2e7ee] shadow-[inset_3px_3px_6px_#c2c9d4,inset_-3px_-3px_6px_#ffffff] border border-white/40 rounded-2xl px-3 py-2.5 min-w-[64px] text-center">
                <span className="block text-lg font-black text-slate-800 tabular-nums">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Menit</span>
              </div>
              <span className="text-slate-400 font-black text-lg">:</span>
              <div className="bg-[#e2e7ee] shadow-[inset_3px_3px_6px_#c2c9d4,inset_-3px_-3px_6px_#ffffff] border border-white/40 rounded-2xl px-3 py-2.5 min-w-[64px] text-center">
                <span className="block text-lg font-black text-emerald-600 tabular-nums">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Detik</span>
              </div>
            </div>

            {/* Quick Button to preview / activate simulation */}
            <button
              onClick={() => setIsFridayModeActive(true)}
              className="mt-6 px-5 py-2.5 rounded-full bg-[#e6ebf2] shadow-[5px_5px_12px_#c7cfda,-5px_-5px_12px_#ffffff] border border-white/80 text-xs font-black text-slate-700 hover:text-slate-900 active:shadow-[inset_2px_2px_5px_#c2c9d4] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Buka Pratinjau Promo Jumat Berkah</span>
            </button>
          </div>
        )}

        {/* CONDITION 2: WHEN FRIDAY MODE IS ACTIVE (Faithful Neumorphism Layout from Image) */}
        {isFridayModeActive && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            
            {/* LEFT COLUMN: THE SPEEDOMETER/THERMOSTAT DIAL CARD + SCENES (Span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Card 1: Air Conditioner / Dial Equivalent for Friday Berkah */}
              <div className="bg-[#e6ebf2] rounded-3xl p-5 sm:p-6 border border-white/70 shadow-[7px_7px_18px_#c5ccd7,-7px_-7px_18px_#ffffff] relative">
                
                {/* Header inside Dial Card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#e6ebf2] shadow-[4px_4px_9px_#c7cfda,-4px_-4px_9px_#ffffff] border border-white/70 flex items-center justify-center text-slate-700">
                      <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight">
                        Subsidi Jumat Berkah
                      </h3>
                      <p className="text-[11px] font-medium text-slate-400">
                        Penyaluran Sembako Kompleks
                      </p>
                    </div>
                  </div>

                  {/* Power toggle in top right (as in reference image) */}
                  <div className="flex items-center gap-2 bg-[#e2e7ee] shadow-[inset_2px_2px_5px_#c2c9d4,inset_-2px_-2px_5px_#ffffff] px-2.5 py-1 rounded-full text-[10px] font-black text-slate-700">
                    <span>On.</span>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[1px_1px_3px_#047857] flex items-center justify-center text-white">
                      <Power className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>
                </div>

                {/* Sub-badge: Timer pill matching the reference photo "(⏱ 2h)" */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ee] shadow-[inset_2px_2px_4px_#c4cbd6,inset_-2px_-2px_4px_#ffffff] text-[11px] font-bold text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sisa Waktu: {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* THE SIGNATURE NEUMORPHIC ARC GAUGE (matching 24° Temprature meter in image) */}
                <div className="relative flex flex-col items-center justify-center my-4 select-none">
                  <svg className="w-56 h-48 sm:w-64 sm:h-52 overflow-visible" viewBox="0 0 220 180">
                    {/* Dotted Inner Reference Track */}
                    <path
                      d="M 52 145 A 64 64 0 1 1 168 145"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="2, 5"
                      opacity="0.4"
                    />

                    {/* Radial Ticks */}
                    {dialTicks.ticks.map((tick) => (
                      <line
                        key={tick.id}
                        x1={tick.x1}
                        y1={tick.y1}
                        x2={tick.x2}
                        y2={tick.y2}
                        stroke={tick.isActive ? '#1e293b' : '#cbd5e1'}
                        strokeWidth={tick.isMajor ? 2.5 : 1.2}
                        strokeLinecap="round"
                        className="transition-colors duration-150"
                      />
                    ))}

                    {/* Needle Indicator */}
                    <line
                      x1={dialTicks.needle.x1}
                      y1={dialTicks.needle.y1}
                      x2={dialTicks.needle.x2}
                      y2={dialTicks.needle.y2}
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Needle Tip Knob */}
                    <circle
                      cx={dialTicks.needle.x2}
                      cy={dialTicks.needle.y2}
                      r="3.5"
                      fill="#0f172a"
                    />

                    {/* Scale Labels (10%, 20%, 40%, 50% matching the 10°, 20°, 40° in photo) */}
                    <text x="32" y="152" fill="#64748b" fontSize="10" fontWeight="bold">10%</text>
                    <text x="105" y="44" fill="#64748b" fontSize="10" fontWeight="bold">35%</text>
                    <text x="174" y="152" fill="#64748b" fontSize="10" fontWeight="bold">50%</text>
                  </svg>

                  {/* Center Readout with Neumorphic Inset Circle (like 24° Temprature in photo) */}
                  <div className="absolute top-[88px] sm:top-[98px] flex flex-col items-center pointer-events-none">
                    <div className="w-24 h-24 rounded-full bg-[#e6ebf2] shadow-[inset_4px_4px_8px_#c2c9d4,inset_-4px_-4px_8px_#ffffff] border border-white/50 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none">
                        {selectedDialPreset}%
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                        Diskon Berkah
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dial Interactive Selector / Quick Presets */}
                <div className="flex items-center justify-center gap-2 mt-1">
                  {[20, 35, 50].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setSelectedDialPreset(preset)}
                      className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                        selectedDialPreset === preset
                          ? 'bg-[#15181e] text-white shadow-[3px_3px_8px_#cad1dc,-3px_-3px_8px_#ffffff]'
                          : 'bg-[#e6ebf2] text-slate-600 shadow-[3px_3px_7px_#c9d1dc,-3px_-3px_7px_#ffffff] hover:text-slate-900'
                      }`}
                    >
                      Potongan {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Two Squircle Cards Side-by-Side (matching "Morning Scene" & "Night Scene" in photo) */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Scene 1: Morning Berkah Bundle */}
                <div
                  onClick={() => setActiveScene('pagi')}
                  className={`rounded-3xl p-4 transition-all cursor-pointer select-none flex flex-col justify-between min-h-[130px] border ${
                    activeScene === 'pagi'
                      ? 'bg-[#e2e7ee] shadow-[inset_4px_4px_8px_#c2c9d4,inset_-4px_-4px_8px_#ffffff] border-white/30'
                      : 'bg-[#e6ebf2] shadow-[6px_6px_14px_#c5ccd7,-6px_-6px_14px_#ffffff] border-white/70 hover:shadow-[7px_7px_16px_#bec7d3,-7px_-7px_16px_#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-[#e6ebf2] shadow-[3px_3px_6px_#c8d0db,-3px_-3px_6px_#ffffff] flex items-center justify-center text-amber-500">
                      <Sun className="w-4 h-4" />
                    </div>
                    {/* 2 dots in top right (matching photo) */}
                    <div className="flex items-center gap-1 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">
                      Paket Subuh Berkah
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      Beras 5kg + Minyak 2L
                    </p>
                  </div>
                </div>

                {/* Scene 2: Sedekah Warga Bundle */}
                <div
                  onClick={() => setActiveScene('sedekah')}
                  className={`rounded-3xl p-4 transition-all cursor-pointer select-none flex flex-col justify-between min-h-[130px] border ${
                    activeScene === 'sedekah'
                      ? 'bg-[#e2e7ee] shadow-[inset_4px_4px_8px_#c2c9d4,inset_-4px_-4px_8px_#ffffff] border-white/30'
                      : 'bg-[#e6ebf2] shadow-[6px_6px_14px_#c5ccd7,-6px_-6px_14px_#ffffff] border-white/70 hover:shadow-[7px_7px_16px_#bec7d3,-7px_-7px_16px_#ffffff]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-[#e6ebf2] shadow-[3px_3px_6px_#c8d0db,-3px_-3px_6px_#ffffff] flex items-center justify-center text-indigo-500">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    {/* 2 dots in top right (matching photo) */}
                    <div className="flex items-center gap-1 opacity-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-slate-800 leading-tight">
                      Sedekah Tetangga
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                      Paket Santunan Dhuafa
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 3: Bottom Pill Bar matching "(+) You created 8 scenes ... See All" from photo */}
              <div className="bg-[#e6ebf2] rounded-full p-2.5 sm:px-4 flex items-center justify-between border border-white/70 shadow-[5px_5px_12px_#c6ced9,-5px_-5px_12px_#ffffff]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e2e7ee] shadow-[inset_2px_2px_4px_#c4cbd6,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-slate-700">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block leading-tight">
                      5 Pilihan Sembako Disubsidi
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Khusus warga Greenwood Residence
                    </span>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-[#e2e7ee] shadow-[inset_2px_2px_4px_#c2c9d4,inset_-2px_-2px_4px_#ffffff] text-[11px] font-bold text-slate-700">
                  Resmi RT/RW
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: AI POWER ANALYTICS EQUIVALENT - THE PRODUCT LIST (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Top User Status Pill matching "Hi, Larry Williams / 7 devices active" */}
              <div className="bg-[#e6ebf2] rounded-full p-2 pr-4 flex items-center justify-between border border-white/70 shadow-[5px_5px_12px_#c6ced9,-5px_-5px_12px_#ffffff]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#006e2f] shadow-[2px_2px_6px_#c0c8d4] text-white flex items-center justify-center text-sm font-black border-2 border-white">
                    🕌
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block leading-none">
                      Jumat Berkah Kompleks
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">
                      Diskon Subsidi Aktif
                    </span>
                  </div>
                </div>

                {/* 2 vertical dots matching the photo */}
                <div className="flex flex-col gap-1 items-center opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                </div>
              </div>

              {/* Main Vertical Card matching "AI Power Analytics / Daily Usage" in reference */}
              <div className="bg-[#e6ebf2] rounded-3xl p-5 border border-white/70 shadow-[7px_7px_18px_#c5ccd7,-7px_-7px_18px_#ffffff] flex flex-col flex-grow">
                
                {/* Header matching Lightning icon + "Daily Usage" + (↗) button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#e6ebf2] shadow-[3px_3px_7px_#c8d0db,-3px_-3px_7px_#ffffff] flex items-center justify-center text-slate-700">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                        Katalog Kilat Berkah
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        Diskon Khusus Hari Jumat
                      </span>
                    </div>
                  </div>

                  {/* Circular extruded arrow button matching (↗) in photo */}
                  <div className="w-8 h-8 rounded-full bg-[#e6ebf2] shadow-[3px_3px_7px_#c8d0db,-3px_-3px_7px_#ffffff] border border-white/60 flex items-center justify-center text-slate-600">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Stack of Soft Extruded Horizontal Pill Rows (matching Air Conditioner, Wi-Fi Router, etc.) */}
                <div className="flex flex-col gap-3">
                  {flashSaleItems.map((p) => {
                    const isAdded = addedAnimationId === p.id;
                    const discount = p.originalPrice 
                      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                      : 25;

                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectProduct(p)}
                        className="group bg-[#e6ebf2] rounded-2xl p-2.5 sm:p-3 border border-white/70 shadow-[4px_4px_10px_#c7cfda,-4px_-4px_10px_#ffffff] hover:shadow-[5px_5px_12px_#bfc7d2,-5px_-5px_12px_#ffffff] active:shadow-[inset_2px_2px_5px_#c2c9d4] transition-all cursor-pointer flex items-center justify-between gap-3"
                      >
                        {/* Left: Product Thumbnail in Inset Well */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#e2e7ee] shadow-[inset_2px_2px_4px_#c5ccd7] flex-shrink-0 relative">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] font-black px-1 rounded">
                              -{discount}%
                            </div>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-black text-slate-800 truncate" title={p.name}>
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold truncate">
                              {p.unit} • Sisa {p.left || 5}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.originalPrice && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  Rp {p.originalPrice.toLocaleString('id-ID')}
                                </span>
                              )}
                              <span className="text-[12px] font-black text-[#ff6b00]">
                                Rp {p.price.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Tactile Neumorphic Add Button (matching chevron button area in photo) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(p);
                          }}
                          aria-label={`Tambah ${p.name}`}
                          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-[inset_2px_2px_5px_#065f46]'
                              : 'bg-[#e6ebf2] text-slate-700 shadow-[3px_3px_7px_#c8d0db,-3px_-3px_7px_#ffffff] hover:text-[#ff6b00] active:shadow-[inset_2px_2px_5px_#c2c9d4]'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[3]" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Helper Note */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>*Maksimal 2 paket per KK</span>
                  <span className="text-emerald-600">Gratis Antar ke Rumah</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
