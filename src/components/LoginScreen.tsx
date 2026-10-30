import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (phoneNumber: string, name?: string, block?: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.startsWith('0')) {
      return raw.substring(1);
    }
    const limited = raw.substring(0, 12);
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i === 3 || i === 7) formatted += ' ';
      formatted += limited[i];
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\s/g, '').length >= 9) {
      onLoginSuccess('+62 ' + phone, undefined, block.trim() || undefined);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="flex-grow flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full bg-white border border-slate-200 rounded-3xl shadow-sm rounded-3xl mt-6 border border-white/80"
    >
      <div className="w-full flex flex-col items-center">
        {/* Illustration */}
        <div className="mb-6 w-full aspect-square max-w-[220px] relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center">
          <img 
            alt="Grocery delivery illustration" 
            className="w-full h-full object-contain grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2wA9zbcpY19xE7YcPEHvxn5_cIcdCvpMVVp3OFP7pSn70IvaXb2sXZsgAg0uywRYLy9WyDWDwUxohDgGPUdoCoD_wH7SJlQvOCh3UwrtOOFFG4VsFSPrdlHu-lI_XC5io5hamABTgDloEgVY6_fGMDghupkjRpxXvk02Jd4BGxAph0W_39C13kSm05KOyfLygfAxxb5rhCa7RX1MG_-1PzD6NKZlH5dxUxFHhNa1rcQujpb1KVum-ZHthyj8uccOtdrYm1k3VAZ8_"
          />
        </div>

        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight mb-1">
            KomplekMart
          </h1>
          <p className="text-xs font-semibold text-slate-500 max-w-xs leading-relaxed">
            Belanja kebutuhan harian jadi lebih mudah, cepat, dan terpercaya.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1" htmlFor="phone">
              Nomor Telepon
            </label>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl rounded-2xl px-4 py-1">
              <div className="pr-3 border-r border-slate-300/80 flex items-center gap-1">
                <span className="text-slate-950 font-black text-base select-none font-mono">+62</span>
              </div>
              <input 
                className="w-full py-3 px-3 bg-transparent border-none outline-none text-slate-950 font-black text-base placeholder:text-slate-400 font-mono"
                id="phone" 
                name="phone" 
                value={phone}
                onChange={handlePhoneChange}
                placeholder="812 3456 7890" 
                type="tel"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1" htmlFor="block">
              No. Blok Rumah <span className="text-[9px] text-slate-400 lowercase font-semibold">(opsional)</span>
            </label>
            <input 
              className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl rounded-2xl text-slate-900 font-bold text-sm placeholder:text-slate-400"
              id="block" 
              name="block" 
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="Contoh: Blok B4 No. 12" 
              type="text"
            />
          </div>

          <p className="text-[11px] font-medium text-slate-500 px-1 text-center">
            Kode verifikasi otomatis dikirimkan via SMS atau WhatsApp.
          </p>

          <button 
            className="w-full h-14 bg-[#ff6b00] text-white hover:bg-[#e05e00] text-white font-black text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all" 
            type="submit"
          >
            <span>Masuk ke KomplekMart</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Demo info note */}
        <div className="mt-6 text-center text-xs font-semibold text-slate-500">
          Akun Demo Siap Pakai • Klik Masuk untuk Eksplorasi
        </div>
      </div>
    </motion.div>
  );
}
