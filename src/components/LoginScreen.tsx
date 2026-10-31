import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, UserRound, LogIn, Loader2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (phoneNumber: string, name?: string, block?: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');
  const [name, setName] = useState('');
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleQuickLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (phone.replace(/\s/g, '').length >= 9) {
      // Simulasi login eksisting user
      onLoginSuccess('+62 ' + phone, undefined, block.trim() || undefined);
    }
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\s/g, '').length >= 9) {
      onLoginSuccess('+62 ' + phone, name.trim() || undefined, block.trim() || undefined);
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

        {!showQuickLogin ? (
          /* Registration Form */
          <>
            <div className="w-full mb-4 flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <UserRound className="w-5 h-5 text-[#ff6b00] flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-black text-slate-900">Informasi Pengiriman & Akun</h2>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1" htmlFor="name">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1">
                  <UserRound className="w-4 h-4 text-slate-400 mr-2" />
                  <input 
                    className="w-full py-3 bg-transparent border-none outline-none text-slate-950 font-bold text-sm placeholder:text-slate-400"
                    id="name" 
                    name="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso" 
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1" htmlFor="phone">
                  No. WhatsApp
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1">
                  <div className="pr-3 border-r border-slate-300/80 flex items-center gap-1">
                    <span className="text-slate-950 font-black text-sm select-none font-mono">+62</span>
                  </div>
                  <input 
                    className="w-full py-3 px-3 bg-transparent border-none outline-none text-slate-950 font-bold text-sm placeholder:text-slate-400 font-mono"
                    id="phone" 
                    name="phone" 
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Contoh: 08123456789" 
                    type="tel"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1" htmlFor="block">
                  Alamat / Blok Pengiriman
                </label>
                <input 
                  className="w-full py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm placeholder:text-slate-400"
                  id="block" 
                  name="block" 
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Contoh: Komplek Hijau Blok C4 No. 12" 
                  type="text"
                  required
                />
              </div>

              <button 
                className="w-full h-14 bg-[#ff6b00] text-white hover:bg-[#e05e00] text-white font-black text-base rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all" 
                type="submit"
              >
                <span>Daftar & Mulai Belanja</span>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Login Link */}
            <div className="mt-6 text-center">
              <button 
                type="button"
                className="text-[#ff6b00] font-bold text-sm border-b-2 border-[#ff6b00] hover:text-[#e05e00] hover:border-[#e05e00] transition-colors cursor-pointer bg-transparent"
                onClick={() => setShowQuickLogin(true)}
              >
                Sudah punya akun? Masuk disini
              </button>
            </div>
          </>
        ) : (
          /* Quick Login Form */
          <>
            <div className="w-full mb-4 flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <LogIn className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-black text-slate-900">Sudah Punya Akun?</h2>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Masuk dengan nomor WhatsApp yang sudah terdaftar
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickLoginSubmit} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 ml-1" htmlFor="phone_login">
                  No. WhatsApp
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-1">
                  <div className="pr-3 border-r border-slate-300/80 flex items-center gap-1">
                    <span className="text-slate-950 font-black text-sm select-none font-mono">+62</span>
                  </div>
                  <input 
                    className="w-full py-3 px-3 bg-transparent border-none outline-none text-slate-950 font-bold text-sm placeholder:text-slate-400 font-mono"
                    id="phone_login" 
                    name="phone_login" 
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="812 3456 7890" 
                    type="tel"
                    required
                  />
                </div>
              </div>

              <button 
                className="w-full h-14 bg-[#ff6b00] text-white hover:bg-[#e05e00] disabled:opacity-70 disabled:cursor-not-allowed text-white font-black text-base rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 stroke-[2.5]" />
                    <span>Masuk ke Akun</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Register Link */}
            <div className="mt-6 text-center">
              <button 
                type="button"
                className="text-[#ff6b00] font-bold text-sm border-b-2 border-[#ff6b00] hover:text-[#e05e00] hover:border-[#e05e00] transition-colors cursor-pointer bg-transparent"
                onClick={() => setShowQuickLogin(false)}
              >
                Belum punya akun? Daftar disini
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
