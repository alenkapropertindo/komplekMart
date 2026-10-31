import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserRound,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone
} from 'lucide-react';

interface QuickLoginResult {
  success: boolean;
  message?: string;
}

interface QuickLoginCardProps {
  isLoggedIn: boolean;
  userName?: string;
  userPhone?: string;
  onLogin: (phone: string) => Promise<QuickLoginResult>;
}

const formatPhoneNumber = (value: string) => {
  const raw = value.replace(/\D/g, '');
  const withoutPrefix = raw.startsWith('0')
    ? raw.substring(1)
    : raw.startsWith('62')
      ? raw.substring(2)
      : raw;
  const limited = withoutPrefix.substring(0, 12);
  let formatted = '';
  for (let i = 0; i < limited.length; i++) {
    if (i === 3 || i === 7) formatted += ' ';
    formatted += limited[i];
  }
  return formatted;
};

export default function QuickLoginCard({
  isLoggedIn,
  userName,
  userPhone,
  onLogin
}: QuickLoginCardProps) {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isLoggedIn) {
    return (
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-800 truncate">
            Masuk sebagai {userName || 'Warga Kompleks'}
          </p>
          <p className="text-xs font-bold text-slate-500 truncate mt-0.5 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            {userPhone || '-'}
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setError('');

    if (phone.replace(/\s/g, '').length < 9) {
      setError('Nomor telepon belum valid. Minimal 9 digit angka.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onLogin(phone);
      if (!result.success) {
        setError(result.message || 'Nomor telepon belum terdaftar.');
      }
    } catch {
      setError('Gagal masuk. Periksa koneksi lalu coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
        <UserRound className="w-5 h-5 text-[#ff6b00]" />
        <div>
          <h2 className="text-base font-bold text-slate-800">Sudah Punya Akun?</h2>
          <p className="text-[11px] font-semibold text-slate-400">
            Masuk dengan nomor WhatsApp, data pengiriman terisi otomatis.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 flex-grow">
            <span className="text-slate-900 font-black text-xs font-mono pr-2 border-r border-slate-200 select-none">
              +62
            </span>
            <input
              id="input_quick_login_phone"
              className="w-full py-3 px-3 bg-transparent border-none outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 font-mono"
              value={phone}
              onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="812 3456 7890"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
            />
          </div>

          <button
            id="btn_quick_login"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6b00] hover:bg-[#e05e00] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/10 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memeriksa...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5]" />
                <span>Masuk</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] font-bold text-rose-600 leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
        Belum punya akun? Lanjutkan isi data pengiriman di bawah. Akun Anda dibuat otomatis
        saat pesanan pertama dikirim.
      </p>
    </motion.section>
  );
}
