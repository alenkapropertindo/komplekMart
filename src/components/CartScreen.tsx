import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight, 
  MapPin, 
  Trash2,
  CreditCard,
  User,
  Phone
} from 'lucide-react';
import { CartItem } from '../types';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (details: {
    address: string;
    recipientName: string;
    phone: string;
    paymentMethod: string;
    deliveryFee: number;
  }) => void;
  onStartShopping: () => void;
  defaultUserName: string;
  defaultPhone: string;
  defaultAddress: string;
}

export default function CartScreen({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onStartShopping,
  defaultUserName,
  defaultPhone,
  defaultAddress
}: CartScreenProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [name, setName] = useState(defaultUserName);
  const [phone, setPhone] = useState(defaultPhone);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isOrdering, setIsOrdering] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 5000; // Flat Komplek rate Rp 5.000
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !name || !phone) {
      alert('Mohon lengkapi Nama, No. WhatsApp, dan Alamat pengiriman.');
      return;
    }

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
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-48"
    >
      <div className="flex items-center gap-3 mb-6 mt-2">
        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff6b00]">
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Keranjang &amp; Checkout</h1>
          <p className="text-xs font-semibold text-slate-400">Periksa belanjaan Anda dan isi data pengiriman di bawah.</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-44 h-44 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-20 h-20 text-slate-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Keranjangmu Kosong</h2>
            <p className="text-sm font-medium text-slate-500 max-w-xs mt-2 leading-relaxed">
              Sepertinya kamu belum menambahkan barang apapun ke dalam keranjang belanja.
            </p>
          </div>
          <button 
            onClick={onStartShopping}
            className="px-8 py-4 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-full font-bold text-base shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="space-y-6">
          {/* Cart items list */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Daftar Item Belanja</h2>
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-center"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                  <img 
                    className="w-full h-full object-cover" 
                    src={item.product.image} 
                    alt={item.product.name}
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 truncate leading-snug">
                        {item.product.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-1">
                        {item.product.unit}
                      </p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-base font-extrabold text-[#006e2f]">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </span>

                    <div className="flex items-center bg-slate-50 rounded-full p-0.5 border border-slate-200">
                      <button 
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="w-7 text-center font-bold text-sm text-slate-800 select-none">
                        {item.quantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#ff6b00] active:scale-95 transition-transform cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Customer & Delivery Form on Cart Page */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <MapPin className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-base font-bold text-slate-800">Informasi Pengiriman &amp; Akun</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso" 
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">No. WhatsApp</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 08123456789" 
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Alamat / Blok Pengiriman</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00] resize-none" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Komplek Hijau Blok C4 No. 12" 
                  rows={2}
                  required
                />
              </div>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <CreditCard className="w-5 h-5 text-[#ff6b00]" />
              <h2 className="text-base font-bold text-slate-800">Metode Pembayaran</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${
                paymentMethod === 'cod' ? 'border-[#ff6b00] bg-orange-50/30' : 'border-slate-150 bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#ff6b00]"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">COD (Bayar di Tempat)</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Bayar saat kurir tiba</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${
                paymentMethod === 'qris' ? 'border-[#ff6b00] bg-orange-50/30' : 'border-slate-150 bg-white'
              }`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'qris'} 
                  onChange={() => setPaymentMethod('qris')}
                  className="accent-[#ff6b00]"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">QRIS / Transfer</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Scan otomatis</p>
                </div>
              </label>
            </div>
          </section>

          {/* Floating Bottom summary & Kirim Sekarang button */}
          <div className="fixed bottom-20 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-30">
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>Total Belanja ({cartItems.reduce((a, c) => a + c.quantity, 0)} item + Ongkir Rp 5.000)</span>
                <span className="text-base font-extrabold text-[#ff6b00]">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <button 
                type="submit"
                disabled={isOrdering}
                className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white py-4 rounded-2xl font-extrabold text-sm shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isOrdering ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses &amp; Membuat Akun...</span>
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
      )}
    </motion.div>
  );
}
