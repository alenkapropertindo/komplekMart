import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Award, 
  Scale, 
  Truck,
  Timer,
  Bell,
  Lock,
  Flame
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectRecommendedProduct: (product: Product) => void;
  recommendedProducts: Product[];
  isFlashSaleActive?: boolean;
  isReminded?: boolean;
  onToggleReminder?: (productId: string, productName?: string) => void;
}

export default function ProductDetail({
  product,
  onBack,
  onAddToCart,
  onSelectRecommendedProduct,
  recommendedProducts,
  isFlashSaleActive = false,
  isReminded = false,
  onToggleReminder
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showBlockedToast, setShowBlockedToast] = useState(false);

  const isLockedFlashSale = !!product.isFlashSale && !isFlashSaleActive;

  const handleIncrement = () => {
    if (isLockedFlashSale) return;
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (isLockedFlashSale) return;
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAdd = () => {
    if (isLockedFlashSale) {
      setShowBlockedToast(true);
      setTimeout(() => setShowBlockedToast(false), 3500);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onAddToCart(product, quantity);
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-32 relative"
    >
      {/* Toast Notification when trying to buy locked Flash Sale */}
      {showBlockedToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-bold"
        >
          <Timer className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
          <p className="flex-grow">
            Flash Sale belum dimulai! Penawaran terbatas baru dibuka hari Jumat pukul 08:00 - 20:00 WIB.
          </p>
        </motion.div>
      )}

      {/* Header toolbar */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Detail Produk</span>
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500 animate-pulse' : 'text-slate-500'}`} />
        </button>
      </div>

      {/* Hero Image Section */}
      <section className="relative w-full aspect-square overflow-hidden bg-slate-50 rounded-3xl border border-slate-100">
        <img 
          className="w-full h-full object-cover" 
          src={product.image} 
          alt={product.name} 
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          {isLockedFlashSale ? (
            <span className="bg-slate-900/85 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow-md flex items-center gap-1.5 border border-slate-700">
              <Lock className="w-3.5 h-3.5 text-[#ff6b00]" />
              <span>Flash Sale Jumat 8:00 AM</span>
            </span>
          ) : (
            <span className="bg-[#6bff8f] text-[#007432] px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
              Stok Tersedia
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.isFlashSale && product.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% PROMO
          </div>
        )}
      </section>

      {/* FLASH SALE SPECIAL WARNING BANNER (When item is flash sale & locked) */}
      {isLockedFlashSale && (
        <section className="mt-4 p-4 rounded-2xl bg-[#fff3e8] border border-[#fedec5] flex items-start gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
            <Timer className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Jangan Lewatkan 🔥
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Penawaran terbatas dimulai pada <strong className="text-[#ff6b00] font-black">Jumat 8:00 AM</strong> (berakhir pukul 20:00 WIB). Sebelum itu, produk promo belum bisa ditambahkan ke keranjang.
            </p>
            {onToggleReminder && (
              <button
                type="button"
                onClick={() => onToggleReminder(product.id, product.name)}
                className={`mt-2.5 px-3 py-1.5 rounded-xl font-bold text-xs border flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                  isReminded
                    ? 'border-[#006e2f] bg-emerald-50 text-[#006e2f]'
                    : 'border-[#ff6b00] bg-white text-[#ff6b00] hover:bg-orange-50'
                }`}
              >
                <Bell className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isReminded ? 'Pengingat Aktif ✓' : 'Ingatkan Saya Saat Mulai'}</span>
              </button>
            )}
          </div>
        </section>
      )}

      {/* Content canvas */}
      <article className="mt-6 space-y-4">
        <div>
          <span className="text-xs font-extrabold text-slate-400 tracking-wider uppercase mb-1 block">
            {product.category} &amp; Sembako
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
            {product.name}
          </h2>
        </div>

        {/* Price & Rating row */}
        <div className="flex items-center gap-6 mt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-[#ff6b00]">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-bold text-slate-400 line-through">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-amber-900">{product.rating}</span>
          </div>

          {product.left && (
            <div className="text-xs font-bold text-slate-500">
              <span className="text-[#ff6b00] font-black">{product.left} kuota</span> tersisa
            </div>
          )}
        </div>

        <div className="w-full h-px bg-slate-100 my-4" />

        {/* Description section */}
        <section>
          <h3 className="text-base font-bold text-slate-800 mb-2">Deskripsi Produk</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            {product.description}
          </p>
        </section>

        {/* Metadata Chips */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">Kualitas Pilihan</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-600">{product.unit}</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <Truck className="w-4 h-4 text-[#ff6b00]" />
            <span className="text-xs font-semibold text-slate-600">Instan 10-15 Menit</span>
          </div>
        </div>

        {/* Recommended bundles section */}
        <section className="pt-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">Lengkapi Belanjaan Anda</h3>
          <div className="grid grid-cols-2 gap-4">
            {recommendedProducts.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => onSelectRecommendedProduct(rec)}
                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="aspect-square rounded-xl bg-slate-50 mb-3 overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={rec.image} 
                    alt={rec.name} 
                  />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-snug truncate">
                  {rec.name}
                </p>
                <p className="text-xs font-extrabold text-[#006e2f] mt-1">
                  Rp {rec.price.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* Floating Bottom action dock */}
      <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-4 rounded-t-3xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between w-full gap-4">
          
          {/* Quantity stepper (Only active when NOT locked) */}
          <div className={`flex items-center gap-2 bg-slate-50 px-3 py-3 rounded-2xl border border-slate-100 ${
            isLockedFlashSale ? 'opacity-40 pointer-events-none' : ''
          }`}>
            <button 
              onClick={handleDecrement}
              disabled={isLockedFlashSale}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-800 active:scale-90 transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <span className="w-10 text-center text-base font-bold text-slate-900">
              {quantity}
            </span>
            <button 
              onClick={handleIncrement}
              disabled={isLockedFlashSale}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-800 active:scale-90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Action button */}
          {isLockedFlashSale ? (
            <button 
              onClick={() => {
                if (onToggleReminder) onToggleReminder(product.id, product.name);
                setShowBlockedToast(true);
                setTimeout(() => setShowBlockedToast(false), 3500);
              }}
              className="flex-1 h-14 rounded-2xl font-bold text-sm bg-orange-50 hover:bg-orange-100 border-2 border-[#ff6b00] text-[#ff6b00] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Bell className="w-5 h-5 stroke-[2.2]" />
              <span>{isReminded ? 'Diingatkan (Mulai Jumat 8:00 AM)' : 'Ingatkan Saya (Mulai Jumat 8:00 AM)'}</span>
            </button>
          ) : (
            <button 
              onClick={handleAdd}
              disabled={isProcessing || success}
              className={`flex-1 h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff6b00]/10 active:scale-95 cursor-pointer ${
                success 
                  ? 'bg-[#006e2f] text-white shadow-emerald-500/10' 
                  : 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
              }`}
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : success ? (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Berhasil Ditambahkan!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Tambah ke Keranjang</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </motion.div>
  );
}
