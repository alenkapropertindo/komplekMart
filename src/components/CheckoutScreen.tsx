import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  MapPin, 
  CreditCard, 
  Coins, 
  Receipt, 
  ArrowRight,
  ShieldCheck,
  Truck,
  QrCode
} from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onPlaceOrder: (details: {
    address: string;
    recipientName: string;
    phone: string;
    paymentMethod: string;
    deliveryFee: number;
  }) => void;
  defaultUserName: string;
  defaultPhone: string;
  defaultAddress: string;
}

export default function CheckoutScreen({
  cartItems,
  onBack,
  onPlaceOrder,
  defaultUserName,
  defaultPhone,
  defaultAddress
}: CheckoutScreenProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [name, setName] = useState(defaultUserName);
  const [phone, setPhone] = useState(defaultPhone);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or qris
  const [isOrdering, setIsOrdering] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 5000; // Flat Komplek rate Rp 5.000
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !name || !phone) return;

    setIsOrdering(true);
    setTimeout(() => {
      onPlaceOrder({
        address,
        recipientName: name,
        phone,
        paymentMethod: paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'Bayar via QRIS (Otomatis)',
        deliveryFee
      });
      setIsOrdering(false);
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-32"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-[#ff6b00]" />
          </button>
          <h1 className="text-xl font-extrabold text-slate-800">Pembayaran</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Address Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <MapPin className="w-5 h-5 text-[#ff6b00]" />
            <h2 className="text-base font-bold text-slate-800">Alamat Pengiriman</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-1" htmlFor="address">Alamat/Blok</label>
              <textarea 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00] transition-colors resize-none" 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Komplek Hijau Blok C4 No. 12" 
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">Nama Penerima</label>
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#ff6b00] transition-colors" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Budi Santoso" 
                  type="text"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">No. WhatsApp</label>
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700 focus:outline-none focus:border-[#ff6b00] transition-colors" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx" 
                  type="text"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <CreditCard className="w-5 h-5 text-[#ff6b00]" />
            <h2 className="text-base font-bold text-slate-800">Metode Pembayaran</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* COD option */}
            <label className={`relative flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              paymentMethod === 'cod' 
                ? 'border-[#ff6b00] bg-orange-50/30' 
                : 'border-slate-150 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  paymentMethod === 'cod' ? 'bg-[#ff6b00] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">COD (Bayar di Tempat)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Bayar saat kurir sampai di depan rumah.</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')}
                className="w-5 h-5 text-[#ff6b00] border-slate-300 focus:ring-[#ff6b00] accent-[#ff6b00]"
              />
            </label>

            {/* QRIS option */}
            <label className={`relative flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              paymentMethod === 'qris' 
                ? 'border-[#ff6b00] bg-orange-50/30' 
                : 'border-slate-150 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                  paymentMethod === 'qris' ? 'bg-[#ff6b00] text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">Bayar dengan QRIS</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mendukung GoPay, OVO, Dana, LinkAja, Sakuku, &amp; m-Banking.</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                value="qris" 
                checked={paymentMethod === 'qris'} 
                onChange={() => setPaymentMethod('qris')}
                className="w-5 h-5 text-[#ff6b00] border-slate-300 focus:ring-[#ff6b00] accent-[#ff6b00]"
              />
            </label>

            {/* Expands to show the QR Code for instant scanning */}
            {paymentMethod === 'qris' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 p-5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
                  {/* QRIS BRAND HEADER */}
                  <div className="flex items-center justify-between w-full pb-3 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-400">METODE SCAN QRIS</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-black tracking-tighter text-[#1c305c] border-2 border-[#1c305c] px-1.5 py-0 rounded italic font-sans">QRIS</span>
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase">GPN</span>
                    </div>
                  </div>

                  {/* QR CODE DISPLAY */}
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200 relative flex flex-col items-center">
                    {/* Fake corner scanning indicators */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff6b00]" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff6b00]" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff6b00]" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff6b00]" />
                    
                    <div className="w-40 h-40 bg-zinc-50 flex items-center justify-center relative rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=300"
                        alt="QRIS QR Code" 
                        referrerPolicy="no-referrer"
                        className="w-36 h-36 object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-sm font-black text-slate-800">Scan Kode QR di Atas</h4>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-[320px]">
                      Buka aplikasi LinkAja, OVO, GoPay, Dana, ShopeePay, atau m-Banking Anda, lalu scan kode QR di atas untuk menyelesaikan pesanan sebesar <span className="font-extrabold text-[#ff6b00]">Rp {total.toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-base font-bold text-slate-800">Ringkasan Pesanan</h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-[#dfebd5] px-2.5 py-1 rounded-full">
              {cartItems.length} Item
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="flex py-3 gap-4 items-center">
                <img 
                  className="w-14 h-14 object-cover rounded-xl border border-slate-50" 
                  src={item.product.image} 
                  alt={item.product.name}
                />
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{item.product.name}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Jml: {item.quantity}</p>
                </div>
                <p className="text-sm font-extrabold text-[#006e2f]">
                  Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-500 animate-none">
              <span>Subtotal</span>
              <span className="text-slate-800 font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500 animate-none">
              <span>Ongkos Kirim (Flat Komplek)</span>
              <span className="text-[#006e2f] font-bold">Rp {deliveryFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <span className="text-base font-extrabold text-slate-800">Total Bayar</span>
              <span className="text-lg font-extrabold text-[#ff6b00]">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </section>

        {/* Security Indicator */}
        <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 opacity-80 pt-2 pb-6">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aman &amp; Terpercaya</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-[#ff6b00]" />
            <span>Pengiriman Cepat</span>
          </div>
        </div>

        {/* Sticky bottom checkout bar layout matching spec */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-40">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Pembayaran</p>
              <p className="text-2xl font-black text-[#ff6b00]">Rp {total.toLocaleString('id-ID')}</p>
            </div>
            <button 
              type="submit"
              disabled={isOrdering}
              className="w-full sm:w-auto sm:min-w-[240px] bg-[#ff6b00] hover:bg-[#e05e00] text-white font-extrabold text-base py-4 px-8 rounded-2xl shadow-lg hover:shadow-orange-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isOrdering ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Kirim Sekarang</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
