import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  X,
  Flame,
  Truck,
  Zap,
  Wheat,
  Droplet,
  Egg,
  Soup,
  GlassWater,
  Timer,
  Bell,
  ChevronUp,
  Lock,
  Info,
  Apple,
  Copy
} from 'lucide-react';
import { Product } from '../types';
import { getFlashSaleSchedule, FlashSaleTimeInfo } from '../utils/flashSale';

interface CustomerHomeProps {
  products: Product[];
  cartCount: number;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSwitchScreen: (screen: 'home' | 'cart' | 'account' | 'admin') => void;
  isFlashSaleActive?: boolean;
  overrideFlashSaleSimulation?: boolean;
  onToggleFlashSaleSimulation?: (active: boolean) => void;
  remindedProductIds?: string[];
  onToggleReminder?: (productId: string, productName?: string) => void;
  onBlockedFlashSaleAdd?: () => void;
  initSearchQuery?: string;
  initCategory?: string;
}

export default function CustomerHome({
  products,
  cartCount,
  onSelectProduct,
  onAddToCart,
  onSwitchScreen,
  isFlashSaleActive = false,
  overrideFlashSaleSimulation = false,
  onToggleFlashSaleSimulation,
  remindedProductIds = [],
  onToggleReminder,
  onBlockedFlashSaleAdd,
  initSearchQuery = '',
  initCategory = 'Semua'
}: CustomerHomeProps) {
  const [searchQuery, setSearchQuery] = useState(initSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initCategory !== 'Semua' ? initCategory : null);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);
  const [showAllFlashSale, setShowAllFlashSale] = useState(false);
  const [localToast, setLocalToast] = useState<string | null>(null);

  // Dynamic live countdown based on Friday 08:00 - 20:00 schedule
  const [scheduleInfo, setScheduleInfo] = useState<FlashSaleTimeInfo>(() => 
    getFlashSaleSchedule(overrideFlashSaleSimulation)
  );

  useEffect(() => {
    const update = () => {
      setScheduleInfo(getFlashSaleSchedule(overrideFlashSaleSimulation));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [overrideFlashSaleSimulation]);

  // Auto Scroll Carousel for Flash Sale
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || isCarouselHovered) return;

    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 195, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isCarouselHovered, products]);

  // Filters
  const categories = [
    { name: 'Beras', icon: Wheat },
    { name: 'Minyak', icon: Droplet },
    { name: 'Telur', icon: Egg },
    { name: 'Mie Instan', icon: Soup },
    { name: 'Air Mineral', icon: GlassWater },
    { name: 'Sayur&Buah', icon: Apple },
  ];

  const popularProducts = products.filter(p => p.left !== undefined && (p.left ?? 0) > 0);
  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const fastDeliveryProducts = products.filter(p => p.name === 'Air Galon' || p.name === 'Gas 3Kg');

  const filteredProducts = products.filter((p) => {
    const searchNormalized = searchQuery.toLowerCase().replace(/\s+/g, '');
    const nameNormalized = p.name.toLowerCase().replace(/\s+/g, '');
    const matchesSearch = nameNormalized.includes(searchNormalized) || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const hasStock = (p.left ?? 0) > 0;
    return matchesSearch && matchesCategory && hasStock;
  });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    // Jika flash sale belum aktif, gunakan harga normal (originalPrice)
    const productToAdd = product.isFlashSale && !scheduleInfo.isActive && product.originalPrice
      ? { ...product, price: product.originalPrice }
      : product;

    onAddToCart(productToAdd);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  const handleReminderClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onToggleReminder) {
      onToggleReminder(product.id, product.name);
    } else {
      setLocalToast(`Pengingat disetel untuk ${product.name}! Kami akan ingatkan Anda saat Flash Sale dimulai Jumat 8:00 AM.`);
      setTimeout(() => setLocalToast(null), 3500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-28 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-bold"
          >
            <Info className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
            <p className="flex-grow">{localToast}</p>
            <button onClick={() => setLocalToast(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <section className="mb-4">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white border border-slate-100 shadow-sm rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/20 transition-all focus:border-[#ff6b00]" 
            placeholder="Cari kebutuhan harian di kompleks..."
          />
        </div>
      </section>

      {/* ========================================================================= */}
      

      {/* Antar Cepat Section - Galon & Gas LPG (Placed above Flash Sale) */}
      {fastDeliveryProducts.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 bg-[#ff6b00]/5 px-4 py-3 rounded-2xl border border-[#ff6b00]/10">
            <div className="flex items-center gap-2">
              <div className="bg-[#ff6b00] text-white p-1.5 rounded-xl flex items-center justify-center shadow-md animate-pulse">
                <Zap className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 tracking-tight leading-none">Antar Cepat Kompleks</h3>
                <span className="text-[10px] font-bold text-slate-500">Estimasi 5-10 Menit Sampai!</span>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#ff6b00] bg-orange-100/50 px-2.5 py-1 rounded-full border border-orange-200/50">
              ⚡ KIRIM INSTAN
            </span>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {fastDeliveryProducts.map((p) => {
              const isAdded = addedAnimationId === p.id;
              return (
                <div 
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 hover:border-[#ff6b00]/20 relative flex flex-col gap-2.5 group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  {/* Badge Express */}
                  <div className="absolute top-3 left-3 z-10 bg-[#006e2f] text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1">
                    <Truck className="w-2.5 h-2.5" />
                    <span>ONGKIR RP0</span>
                  </div>

                  {/* Cover Image */}
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-50 relative flex items-center justify-center">
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      src={p.image}
                    />
                    {p.left && p.left <= 15 && (
                      <div className="absolute bottom-1 right-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">
                        Sisa {p.left}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-grow text-left">
                    <span className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider leading-none">
                      {p.category}
                    </span>
                    <span className="text-xs font-black text-slate-800 leading-snug tracking-tight mt-1 truncate" title={p.name}>
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">
                      {p.unit}
                    </span>

                    {/* Pricing and Cart button */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-black text-[#ff6b00]">
                          Rp {p.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleQuickAdd(e, p)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer ${
                          isAdded 
                            ? 'bg-[#006e2f] text-white' 
                            : 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[3]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


      {/* FLASH SALE SPECIAL CONTAINER (EXACT PIXEL REPLICA OF USER REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      <section className="mb-6">
        <div className="bg-[#fff1e5] border border-[#fddbc2] rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          
          {/* Header Bar: [Stopwatch Icon] Sembako Flash Deals          Dimulai dalam [JAM] [MNT] [DTK] ^ */}
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#fed4b2]/80">
            {/* Left: Stopwatch with motion lines + Italic Bold Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shadow-xs">
                <Timer className="w-4.5 h-4.5 stroke-[2.5]" />
              </div>
              <h3 className="font-black italic text-slate-900 text-base sm:text-lg tracking-tight">
                Jumat Berkah
              </h3>
            </div>

            {/* Right: "Dimulai dalam" + 3 Dark Blocks [JAM] [MNT] [DTK] + ChevronUp */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-bold text-slate-600">
                {scheduleInfo.label}
              </span>

              <div className="flex items-center gap-1">
                {/* JAM BOX */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#ff6b00] text-white font-mono font-black text-xs sm:text-sm px-2 py-0.5 rounded-md min-w-[28px] sm:min-w-[32px] text-center shadow-xs">
                    {String(scheduleInfo.hours).padStart(2, '0')}
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                    JAM
                  </span>
                </div>

                {/* MNT BOX */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#ff6b00] text-white font-mono font-black text-xs sm:text-sm px-2 py-0.5 rounded-md min-w-[28px] sm:min-w-[32px] text-center shadow-xs">
                    {String(scheduleInfo.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                    MNT
                  </span>
                </div>

                {/* DTK BOX */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#ff6b00] text-white font-mono font-black text-xs sm:text-sm px-2 py-0.5 rounded-md min-w-[28px] sm:min-w-[32px] text-center shadow-xs">
                    {String(scheduleInfo.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                    DTK
                  </span>
                </div>

                <ChevronUp className="w-4 h-4 text-slate-400 ml-0.5 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Body: Single Horizontal Track containing [Jangan Lewatkan Card] + [Deal Product Cards] */}
          <div 
            className="mt-3.5 relative"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div 
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x scroll-smooth -mx-1 px-1 items-stretch"
            >
              
              {/* BOX 1: "Jangan Lewatkan 🔥" (Exact card from user screenshot) */}
              <div className="min-w-[150px] sm:min-w-[170px] w-[150px] sm:w-[170px] flex-shrink-0 flex flex-col justify-between p-3.5 rounded-2xl relative overflow-hidden text-left bg-gradient-to-b from-white/70 to-transparent border border-[#fed4b2]/60 snap-start">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    {scheduleInfo.isActive ? 'Sedang Berlangsung' : 'Jangan Lewatkan'} <span className="inline-block animate-bounce">🔥</span>
                  </h4>
                  
                  <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
                    {scheduleInfo.isActive ? 'Penawaran terbatas berakhir pada' : 'Penawaran terbatas dimulai pada'}
                  </p>

                  <p className="text-base sm:text-lg font-black text-[#ff6b00] tracking-tight mt-0.5">
                    {scheduleInfo.scheduleNotice}
                  </p>

                  <p className="text-[10px] font-bold text-slate-400 mt-2 leading-tight">
                    Khusus hari Jumat jam 08:00 - 20:00 WIB
                  </p>
                </div>

                {/* Subtle Flame Watermark Graphic in bottom corner */}
                <div className="mt-4 flex items-end">
                  <div className="opacity-25 text-[#ff6b00]">
                    <Flame className="w-16 h-16 fill-[#ff6b00]" />
                  </div>
                </div>
              </div>

              {/* DEAL CARDS: (Exact cards from screenshot with Quota and "Ingatkan Saya" buttons) */}
              {flashSaleProducts.map((p) => {
                const isAdded = addedAnimationId === p.id;
                const isReminded = remindedProductIds.includes(p.id);
                const discountPercentage = p.originalPrice 
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 20;

                return (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className="min-w-[165px] sm:min-w-[185px] w-[165px] sm:w-[185px] bg-white rounded-2xl p-3 shadow-xs border border-[#fed4b2]/80 hover:border-[#ff6b00]/40 relative flex flex-col justify-between group hover:shadow-md transition-all duration-200 cursor-pointer snap-start flex-shrink-0"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <div className="h-28 w-full rounded-xl overflow-hidden bg-slate-50 relative border border-slate-100">
                        <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          -{discountPercentage}%
                        </span>

                        {!scheduleInfo.isActive && (
                          <span className="absolute top-2 right-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Jumat
                          </span>
                        )}

                        <img 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          src={p.image}
                        />
                      </div>

                      {/* Header details */}
                      <div className="mt-2 text-left">
                        <h5 className="text-xs font-black text-slate-800 leading-snug truncate" title={p.name}>
                          {p.name}
                        </h5>

                        {/* Large Orange Price & Strikethrough (matches 8% p.a. & 6% p.a. from screenshot) */}
                        <div className="mt-1.5">
                          <span className="text-base sm:text-lg font-black text-[#ff6b00] block leading-none">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 line-through leading-none block mt-1">
                            Rp {p.originalPrice?.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {/* Quota info (matches "700 kuota" / "1,650 kuota" from screenshot) */}
                        <div className="mt-2">
                          <span className="text-xs font-bold text-[#ff6b00] block leading-none">
                            {p.left || 20} kuota
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: "Ingatkan Saya" when inactive, "+ Keranjang" when active */}
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      {!scheduleInfo.isActive ? (
                        <button 
                          onClick={(e) => handleReminderClick(e, p)}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
                            isReminded 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-700 hover:bg-slate-800 text-white'
                          }`}
                        >
                          {isReminded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Diingatkan</span>
                            </>
                          ) : (
                            <>
                              <Bell className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Ingatkan Saya</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => handleQuickAdd(e, p)}
                          className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer ${
                            isAdded 
                              ? 'bg-[#006e2f] text-white' 
                              : 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Ditambahkan</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[3]" />
                              <span>+ Keranjang</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* End Card: "Lihat Semua" */}
              <div 
                onClick={() => setShowAllFlashSale(true)}
                className="min-w-[140px] w-[140px] bg-white rounded-2xl p-4 border border-dashed border-[#fed4b2] flex flex-col items-center justify-center text-center gap-2 hover:border-[#ff6b00] transition-all cursor-pointer snap-start flex-shrink-0"
              >
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#ff6b00]">
                  <Flame className="w-5 h-5 fill-[#ff6b00]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-800">Lihat Semua</span>
                  <span className="text-[9px] font-bold text-slate-400">Promo Jumat</span>
                </div>
              </div>
            </div>

            {/* Bottom Right See More Link */}
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => setShowAllFlashSale(true)}
                className="text-[11px] font-black text-[#ff6b00] hover:text-[#e05e00] flex items-center gap-1 hover:underline cursor-pointer"
              >
                Lihat Lebih Banyak <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Interactive Simulation Switcher */}
          {onToggleFlashSaleSimulation && (
            <div className="mt-3 pt-3 border-t border-[#fed4b2]/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-[#ff6b00] animate-pulse" />
                <span>Simulasi Jadwal:</span>
              </div>
              
              <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-orange-200">
                <button
                  type="button"
                  onClick={() => onToggleFlashSaleSimulation(false)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    !overrideFlashSaleSimulation 
                      ? 'bg-slate-800 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📅 Waktu Saat Ini (Terkunci)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFlashSaleSimulation(true)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    overrideFlashSaleSimulation 
                      ? 'bg-[#ff6b00] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-[#ff6b00]'
                  }`}
                >
                  ⚡ Coba Jumat 08:00-20:00 (Aktif)
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Categories Grid */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Kategori</h3>
          <span 
            className="text-xs font-bold text-[#ff6b00] cursor-pointer hover:underline"
            onClick={() => setSelectedCategory(null)}
          >
            Atur Ulang Filter
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x pointer-events-auto">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <div 
                key={idx} 
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer snap-align-none"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                  isSelected 
                    ? 'bg-[#ff6b00] text-white scale-105' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`text-[11px] font-bold tracking-tight text-center ${
                  isSelected ? 'text-[#ff6b00]' : 'text-slate-500'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products list header */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Katalog Produk</h3>
        </div>

        {/* Search + Filter + Share */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk (misal: Gas 3kg)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]"
            />
          </div>

          {/* Share Link Button */}
          {(searchQuery || selectedCategory !== 'Semua') && (
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (searchQuery) params.append('q', searchQuery);
                if (selectedCategory !== 'Semua') params.append('cat', selectedCategory);
                const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
                
                navigator.clipboard.writeText(shareUrl);
                alert('Link disalin ke clipboard! Sekarang bisa dibagikan.');
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Salin Link Katalog
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl text-slate-400 font-medium border border-dashed border-slate-200">
            Tidak ada produk yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((p) => {
              const isAdded = addedAnimationId === p.id;
              const isReminded = remindedProductIds.includes(p.id);
              const isFlashItem = !!p.isFlashSale;
              const isFlashLocked = false;

              return (
                <div 
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2 relative group transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-50 relative">
                    <img 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={p.image}
                    />

                    {isFlashLocked && (
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Jumat 8 AM
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <span className="text-sm font-bold text-slate-800 leading-snug truncate mt-0.5">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                      {p.unit}
                    </span>
                    <span className="text-base font-extrabold text-[#006e2f] mt-1">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Stock Alert Label */}
                  {p.left !== undefined && p.left <= 2 && (
                    <div className="absolute top-4 left-4 bg-red-100 text-red-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                      Sisa {p.left}
                    </div>
                  )}

                  {/* Add / Action Button */}
                  {isFlashLocked ? (
                    <button 
                      onClick={(e) => handleReminderClick(e, p)}
                      title="Ingatkan Saya (Flash Sale Jumat)"
                      className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer ${
                        isReminded 
                          ? 'bg-[#006e2f] text-white' 
                          : 'bg-white border-2 border-[#ff6b00] text-[#ff6b00] hover:bg-orange-50'
                      }`}
                    >
                      {isReminded ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Bell className="w-4 h-4 stroke-[2.2]" />
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handleQuickAdd(e, p)}
                      className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer ${
                        isAdded 
                          ? 'bg-[#006e2f] text-white' 
                          : 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Flash Sale Full modal overlay */}
      {showAllFlashSale && (
        <div id="modal_flash_sale_all" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
          >
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-500 to-[#ff6b00] text-white relative">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 fill-white text-white" />
                <div>
                  <h4 className="text-base font-black tracking-tight">Katalog Promo Flash Sale</h4>
                  <p className="text-[11px] font-medium text-orange-100">
                    {scheduleInfo.isActive 
                      ? 'Sedang Berlangsung! Berakhir Jumat jam 8:00 PM' 
                      : 'Jangan Lewatkan: Dimulai Jumat jam 8:00 AM (08:00 - 20:00 WIB)'}
                  </p>
                </div>
              </div>
              <button 
                id="btn_close_flash_sale_modal"
                onClick={() => setShowAllFlashSale(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all border border-white/10 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* List Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-grow">
              {flashSaleProducts.map((p) => {
                const isAdded = addedAnimationId === p.id;
                const isReminded = remindedProductIds.includes(p.id);
                const discountPercentage = p.originalPrice 
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 20;

                return (
                  <div 
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      setShowAllFlashSale(false);
                    }}
                    className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#ff6b00]/25 hover:bg-white transition-all duration-200 cursor-pointer group"
                  >
                    {/* Gambar */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-slate-100 relative flex-shrink-0">
                      <span className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm">
                        -{discountPercentage}%
                      </span>
                      <img 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        src={p.image}
                      />
                    </div>

                    {/* Metadata & Details */}
                    <div className="flex-grow flex flex-col justify-between text-left min-w-0">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                          {p.category}
                        </span>
                        <h5 className="text-sm font-black text-slate-800 leading-snug truncate mt-0.5">
                          {p.name}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-sm font-black text-[#ff6b00]">
                            Rp {p.price.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 line-through">
                            Rp {p.originalPrice?.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Quota */}
                      <div className="mt-1">
                        <span className="text-[11px] font-extrabold text-[#ff6b00]">
                          {p.left || 20} kuota
                        </span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center self-center flex-shrink-0 pl-1">
                      {scheduleInfo.isActive ? (
                        <button 
                          onClick={(e) => handleQuickAdd(e, p)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer ${
                            isAdded 
                              ? 'bg-[#006e2f] text-white' 
                              : 'bg-[#ff6b00] hover:bg-[#e05e00] text-white'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[3]" />
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => handleReminderClick(e, p)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs border flex items-center gap-1 transition-all cursor-pointer ${
                            isReminded 
                              ? 'border-[#006e2f] text-[#006e2f] bg-emerald-50' 
                              : 'border-[#ff6b00] text-[#ff6b00] hover:bg-orange-50 bg-white'
                          }`}
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>{isReminded ? 'Diingatkan' : 'Ingatkan'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Modal Info */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] font-bold text-slate-500">
              {scheduleInfo.isActive 
                ? '⚡ Flash Sale aktif sampai jam 20:00 WIB hari ini!' 
                : '🔒 Produk belum bisa ditambahkan ke keranjang sebelum hari Jumat pukul 08:00 WIB.'}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
