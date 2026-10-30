import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  MapPin, 
  Box, 
  Truck, 
  CheckSquare, 
  Phone, 
  MessageSquare,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Order } from '../types';

interface ReceiptScreenProps {
  order: Order | null;
  onContactCS: () => void;
  onBackToHome: () => void;
}

export default function ReceiptScreen({
  order,
  onContactCS,
  onBackToHome
}: ReceiptScreenProps) {
  // If no order is active, use the default mock from screen specs
  const activeOrder = order || {
    id: 'KM-882910',
    customerName: 'Rizqo Fadhilah',
    items: [
      {
        productName: 'Paket Sayur Segar A',
        quantity: 1,
        price: 45000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0495a7BYoAiGJOHDh3fnVztZeu-TEyzw02JJDq7bQWHQrryqGLyohk6-e2sxJ9y_WhxzeSWqxvMQvdI_gXYRxd9WqOpEDYDXVsroW1tOYowiTrlJfkrgWeF4aNoDt5Ql-4cp4wym2Owi-SLLhd0tVsdFY09z592kDcPYep--oDL34yakxtYWUH-EMMhAELTQ9jCWPcyO4rCRMTtaBi0JqvFZyWM0O0d2cwciQ2oNSso3ayPG9YXnskC7xOJgoHTBvlxwd2IQIDT2n'
      },
      {
        productName: 'Susu & Telur Omega',
        quantity: 1,
        price: 32000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOclp8-1N3oYHaUo6vE2_6D5rj7vINv9yZdi84aX3PwWAANnkyr_SHD6nJEiRCAMxODtK5MHCfCb6JdyPl9uSEklcqnHZ-qLuGdUZdWG85gUrna3RcT81zFQYvFSV_yyMocDvopJThudnqMDdd1jlFim9jYGqIp62TFPPuv3cFQXp5h2VysUtwUusVHhcFq-GyfqreR9yLGdL0dO9F0Djlzc-M3aJwV6Y3SrRSlyqIQKxyWphrQWkzpUuuq9ZToRYH-Q8auzJ2ysse'
      }
    ],
    subtotal: 77000,
    deliveryFee: 5000,
    total: 82000,
    status: 'Diantar' as const,
    date: '24 Okt 2023',
    time: '10:30 WIB',
    address: 'Green Valley Complex, Blok B4',
    phone: '+62 812-3456-7890',
    paymentMethod: 'COD (Bayar di Tempat)',
  };

  const steps = [
    {
      title: 'Diproses',
      description: 'Pesanan sedang disiapkan',
      time: '10:30 WIB',
      icon: Box,
      completed: true,
      current: activeOrder.status === 'Diproses',
      badgeText: 'Selesai'
    },
    {
      title: 'Diantar',
      description: 'Driver sedang menuju lokasi',
      time: '10:55 WIB',
      icon: Truck,
      completed: activeOrder.status === 'Diantar' || activeOrder.status === 'Selesai',
      current: activeOrder.status === 'Diantar',
      badgeText: 'Sekarang'
    },
    {
      title: 'Selesai',
      description: 'Estimasi tiba pukul 11:15 WIB',
      time: '11:15 WIB',
      icon: CheckSquare,
      completed: activeOrder.status === 'Selesai',
      current: activeOrder.status === 'Selesai',
      badgeText: 'Selesai'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-28"
    >
      {/* Top action header to navigate back to Home */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <span className="font-bold text-slate-800 tracking-tight text-lg">Detail Pesanan</span>
        <button 
          onClick={onBackToHome}
          className="text-xs font-bold text-[#ff6b00] hover:underline cursor-pointer"
        >
          Belanja Lagi
        </button>
      </div>

      {/* Success Banner */}
      <section className="mb-6 text-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <motion.div 
          initial={{ scale: 0.6, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stifness: 100, damping: 10 }}
          className="w-16 h-16 bg-[#e1f3e5] text-[#006e2f] rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 className="w-10 h-10 stroke-[2.5] fill-emerald-50 text-[#006e2f]" />
        </motion.div>
        <h1 className="text-xl font-extrabold text-slate-900 mb-1">Pesanan Berhasil!</h1>
        <p className="text-sm font-semibold text-slate-400">
          Nomor Pesanan: <span className="font-extrabold text-[#ff6b00]">#{activeOrder.id}</span>
        </p>
      </section>

      {/* Shipping Timeline */}
      <section className="mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-800 mb-5">Status Pengiriman</h2>
        <div className="relative flex flex-col gap-6">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isCompleted = step.completed;
            const isCurrent = step.current;
            const showLine = idx < steps.length - 1;

            return (
              <div key={idx} className="flex gap-4 relative">
                {/* Timeline connector circle & bar layout carefully styled with high contrast */}
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 ${
                    isCurrent 
                      ? 'bg-[#ff6b00] text-white animate-pulse'
                      : isCompleted ? 'bg-[#ff6b00]/20 text-[#ff6b00]' : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    <StepIcon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  {showLine && (
                    <div className={`w-0.5 h-12 absolute top-8 ${
                      isCompleted ? 'bg-[#ff6b00]' : 'bg-slate-200'
                    }`} />
                  )}
                </div>

                {/* Information block */}
                <div className="flex flex-col flex-grow">
                  <span className={`text-sm font-bold ${
                    isCurrent ? 'text-[#ff6b00]' : 'text-slate-800'
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 mt-0.5">
                    {step.time} - {step.description}
                  </span>
                </div>

                {/* Right side status pill indicators matching pixel screens design layout */}
                {(isCurrent || (isCompleted && !isCurrent && step.badgeText === 'Selesai')) && (
                  <div className="ml-auto flex items-start">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      isCurrent 
                        ? 'bg-[#6bff8f]/20 text-[#007432]' 
                        : 'bg-orange-50 text-[#ff6b00]'
                    }`}>
                      {step.badgeText}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Order list items summary */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
          <h2 className="text-base font-extrabold text-slate-800">Ringkasan Pesanan</h2>
          <span className="text-xs font-bold text-[#ff6b00] hover:underline cursor-pointer">Lihat Detail</span>
        </div>

        <div className="space-y-4">
          {activeOrder.items.map((it, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 border border-slate-100">
                <img className="w-full h-full object-cover" src={it.image} alt={it.productName} />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{it.productName}</p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{it.quantity} Barang • 1.2 kg</p>
              </div>
              <p className="text-sm font-extrabold text-[#006e2f]">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Pricing break downs */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-800 font-bold">Rp {activeOrder.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Biaya Pengiriman</span>
            <span className="text-slate-800 font-bold">Rp {activeOrder.deliveryFee.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center text-base font-bold mt-2 pt-2 border-t border-slate-50">
            <span className="text-slate-900 font-black">Total Pembayaran</span>
            <span className="text-base font-extrabold text-[#ff6b00]">Rp {activeOrder.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </section>

      {/* Courier Driver details */}
      <section className="bg-[#ffdbcc]/40 p-4 rounded-2xl flex items-center gap-4 mb-6 border border-[#ffdbcc]/30">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ff6b00] bg-slate-100">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw-UzAxT0isLr4nVATmRyGOrSUNs4o1UuanaxmGVENcgbxpP-n87HuIJqHrRRUyf57Gg6kMNXUSWtIce-3DArXRM_j1837YRbjcPNJ9O4sJTjJ54T4tNQMjTxErAo0ijniXAzt94U7EB7X5mfqy5aA_P_V5T9zxBttraH4eFL_dTXwcvfigTZ38gzkPGfOju2rXzCWryQ6833WzbgQrMi0JMfPVz_dahzLVLvyr9yveR4N1AjBcLDboVUuiXdp47CQCQBVohs9KwpZ" 
            alt="Courier Driver"
          />
        </div>
        <div className="flex-grow">
          <p className="text-[10px] text-[#7a3000] uppercase tracking-wider font-extrabold">Kurir Anda</p>
          <p className="text-sm font-bold text-[#351000]">Budi Santoso</p>
        </div>
        <div className="flex gap-2">
          {/* Mock call triggers */}
          <a 
            href="tel:12345"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff6b00] shadow-sm hover:scale-95 transition-transform"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
          <button 
            onClick={onContactCS}
            className="w-10 h-10 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-full flex items-center justify-center shadow-sm hover:scale-95 transition-transform cursor-pointer"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-current" />
          </button>
        </div>
      </section>

      {/* Big Customer assistant support */}
      <button 
        onClick={onContactCS}
        className="w-full h-14 bg-amber-900 hover:bg-amber-950 text-white font-extrabold rounded-2xl shadow-md active:scale-95 transition-all text-sm cursor-pointer"
      >
        Hubungi CS KomplekMart
      </button>
    </motion.div>
  );
}
