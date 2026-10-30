import { supabase } from "../lib/supabase";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Plus, 
  AlertTriangle, 
  Egg, 
  Droplet, 
  Cookie, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  PlusCircle, 
  Megaphone, 
  Users, 
  X,
  CheckCircle2,
  Trash2,
  Activity,
  ChevronRight,
  Send,
  ArrowLeft,
  FileText,
  MessageSquare,
  Search,
  Filter,
  DollarSign,
  Phone,
  Check,
  Sliders
} from 'lucide-react';
import { Order, Product, ChatMessage, Resident } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  residents: Resident[];
  onUpdateOrderStatus: (orderId: string, nextStatus: 'Diproses' | 'Diantar' | 'Selesai') => void;
  onAddNewProduct: (newProduct: Product) => void;
  onAddStockAlert: (index: number, newStock: number) => void;
  chatMessages: ChatMessage[];
  onAdminReplyChat: (text: string) => void;
  customerName: string;
  onDeleteProduct?: (productId: string) => void;
  onUpdateProductStock?: (productId: string, newStock: number) => void;
  onUpdateProductPrice?: (productId: string, newPrice: number) => void;
  onUpdateProductFlashSale?: (productId: string, isFlashSale: boolean, flashSalePrice?: number) => void;
  onDeleteOrder?: (orderId: string) => void;
}

type TabType = 'overview' | 'products' | 'orders' | 'residents';

export default function AdminDashboard({
  orders,
  products,
  onUpdateOrderStatus,
  onAddNewProduct,
  onAddStockAlert,
  chatMessages,
  onAdminReplyChat,
  customerName,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateProductPrice,
  onUpdateProductFlashSale,
  residents,
  onDeleteOrder
}: AdminDashboardProps) {
  // Tabs for structured workflows
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Local state triggers for Admin Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showFlashSaleModal, setShowFlashSaleModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Dynamic search and filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Semua');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Semua');
  const [residentSearch, setResidentSearch] = useState('');

  // Editing pricing or stocks inline states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<number>(0);
  const [editingStock, setEditingStock] = useState<number>(0);

  // Dynamic live Customer chatting state
  const [selectedChatUser, setSelectedChatUser] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // New product form states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Beras');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdUnit, setNewProdUnit] = useState('1');
  const [newProdImage, setNewProdImage] = useState<string | null>(null);

  // Flash sale form states
  const [selectedDiscountProduct, setSelectedDiscountProduct] = useState('');
  const [discountPercent, setDiscountPercent] = useState('15');

  // Support list simulations
  const supportConversations = useMemo(() => [
    { customer: 'Rudi Santoso', block: 'B4 No.12', msg: 'Mas, pesanan air mineral galon saya belum sampai ya?', time: '2 mins ago' },
    { customer: 'Ani Wijaya', block: 'C2 No.5', msg: 'Telur ayamnya pecah satu pas diantar tadi, boleh minta ganti?', time: '10 mins ago' },
    { customer: 'Dewi Lestari', block: 'A1 No.2', msg: 'Terimakasih beras wangi pandannya pulen sekali!', time: '1 hour ago' }
  ], []);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status === 'Selesai' ? sum + o.total : sum, 0);
    const lowStockItems = products.filter(p => (p.left ?? 0) <= 5);
    const pendingOrders = orders.filter(o => o.status !== 'Selesai');
    
    return {
      revenue: totalRevenue || 1485000,
      totalOrders: orders.length,
      pendingCount: pendingOrders.length,
      lowStockCount: lowStockItems.length
    };
  }, [orders, products]);

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    let next: 'Diproses' | 'Diantar' | 'Selesai' = 'Diproses';
    if (currentStatus === 'Diproses') next = 'Diantar';
    else if (currentStatus === 'Diantar') next = 'Selesai';
    else return;

    onUpdateOrderStatus(orderId, next);
  };
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setNewProdImage(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      alert('Gagal mengunggah gambar ke Supabase Storage.');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    const added: Product = {
      id: 'p_added_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: newProdName,
      category: isCustomCategory ? customCategoryName : newProdCategory,
      price: parseInt(newProdPrice),
      image: newProdImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      unit: newProdUnit,
      rating: '5.0',
      description: newProdDesc || 'Produk KomplekMart kualitas teramin.',
      left: parseInt(newProdStock)
    };

    onAddNewProduct(added);
    // Reset form
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setNewProdStock('10'); setNewProdImage(null);
    setShowAddProductModal(false);
  };

  const handleTriggerDiscount = () => {
    if (!selectedDiscountProduct) return;
    alert(`Promo Flash Sale ${discountPercent}% berhasil diumumkan di Kompleks!`);
    setShowFlashSaleModal(false);
  };

  const handleStartEditing = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditingPrice(prod.originalPrice || prod.price);
    setEditingStock(prod.left ?? 10);
  };

  const handleSaveProductChanges = (prodId: string) => {
    if (onUpdateProductPrice) onUpdateProductPrice(prodId, editingPrice);
    if (onUpdateProductStock) onUpdateProductStock(prodId, editingStock);
    setEditingProductId(null);
  };

  // Filter products list based on search and category tab
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchCategory = productCategoryFilter === 'Semua' || p.category === productCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Filter orders list based on status tab and customer name search
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'Semua' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredResidents = useMemo(() => {
    return residents.filter(res => 
      res.name.toLowerCase().includes(residentSearch.toLowerCase()) || 
      res.block.toLowerCase().includes(residentSearch.toLowerCase())
    );
  }, [residents, residentSearch]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto pb-16 space-y-8"
    >
      {/* Top Welcome Title & Statistics overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-[10px] bg-orange-50 text-[#ff6b00] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
            DASHBOARD ADMIN KOMPLEKTMART
          </span>
          <h1 className="text-2xl font-black text-slate-800 mt-2 tracking-tight">
            Hub Kelola Sembako &amp; Warga Kompleks
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Manfaatkan tab kontrol di bawah untuk tambah item sayur, kelola pesanan masuk, dan pantau support warga.
          </p>
        </div>
        
        {/* Date visual */}
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 text-slate-600">
          <Calendar className="w-4 h-4 text-[#ff6b00]" />
          <span className="text-xs font-bold font-mono">25 Mei 2026</span>
        </div>
      </div>

      {/* Tabs Selector System */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview' 
              ? 'bg-[#ff6b00] text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Ringkasan Utama</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products' 
              ? 'bg-[#ff6b00] text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Package className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Kelola Katalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders' 
              ? 'bg-[#ff6b00] text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Kelola Pesanan ({orders.filter(o => o.status !== 'Selesai').length} Aktif)</span>
        </button>

        <button
          onClick={() => setActiveTab('residents')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-tight transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'residents' 
              ? 'bg-[#ff6b00] text-white shadow-md' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4.5 h-4.5 stroke-[2.2]" />
          <span>Daftar Warga & Bantuan</span>
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {/***************************** TAB 1: OVERVIEW *****************************/}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Bento Grid */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-1.5 hover:border-[#ff6b00] transition-all">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Pemasukan Selesai</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black text-slate-800">Rp {stats.revenue.toLocaleString('id-ID')}</span>
                    <span className="text-emerald-600 text-xs font-bold pb-0.5 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +15%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '82%' }} />
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-1.5 hover:border-[#ff6b00] transition-all">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Total Transaksi</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black text-slate-800">{stats.totalOrders} Pesanan</span>
                    <span className="text-blue-600 text-[10px] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                      Semua
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '70%' }} />
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-1.5 hover:border-[#ff6b00] transition-all">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Pesanan Diproses</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black text-amber-600">{stats.pendingCount} Antrean</span>
                    <span className="text-amber-600 text-[9px] font-bold bg-amber-50 px-2.5 py-0.5 rounded-full animate-pulse">
                      Menunggu
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                  </div>
                </div>

                <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-1.5 hover:border-[#ff6b00] transition-all">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400">Minim Stok (&lt;=5)</span>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-black text-rose-600">{stats.lowStockCount} Produk</span>
                    <span className="text-rose-600 text-xs font-bold pb-0.5 flex items-center gap-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Kritis
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: '30%' }} />
                  </div>
                </div>
              </section>

              {/* Bento Row Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Status Pesanan Ringkas */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Antrean Pesanan Warga Terakhir</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Tindakan cepat mengubah status di bawah ini</p>
                    </div>
                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-[#ff6b00] hover:underline">
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                    {orders.slice(0, 4).map((ord) => (
                      <div 
                        key={ord.id}
                        className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-slate-200 transition-all gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl border border-orange-100">
                            <Package className="w-5 h-5 text-[#ff6b00]" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800">{ord.customerName}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">Order #{ord.id} • {ord.items.length} item • {ord.address}</p>
                            <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md mt-1.5 ${
                              ord.status === 'Selesai' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : ord.status === 'Diantar' 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-end gap-1 w-full sm:w-auto self-end sm:self-center justify-between bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl">
                          <span className="text-xs font-black text-[#ff6b00]">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </span>
                          
                          <div className="flex items-center gap-1.5 mt-1">
                            {ord.status !== 'Selesai' ? (
                              <button 
                                type="button"
                                onClick={() => handleUpdateStatus(ord.id, ord.status)}
                                className="px-3 py-1.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-[10px] font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                              >
                                Ubah Ke {ord.status === 'Diproses' ? 'Diantar' : 'Selesai'}
                              </button>
                            ) : (
                              <span className="text-[10px] font-extrabold text-[#006e2f] bg-[#dfebd5] px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Selesai
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Yakin ingin membatalkan/menghapus pesanan #${ord.id}?`)) {
                                  if (onDeleteOrder) onDeleteOrder(ord.id);
                                }
                              }}
                              className="p-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer flex items-center justify-center"
                              title="Batalkan Pesanan"
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Warning list */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-55 flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Peringatan Stok</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">Tingkat persediaan rendah di toko</p>
                    </div>
                  </div>

                  <div className="space-y-3 divide-y divide-slate-50 max-h-[260px] overflow-y-auto pr-1">
                    {products.filter(p => (p.left ?? 0) <= 5).slice(0, 5).map((p) => (
                      <div key={p.id} className="pt-3 flex items-center justify-between hover:bg-slate-50/25 transition-colors">
                        <div className="flex items-center gap-2">
                          <img src={p.image} className="w-8 h-8 rounded-lg object-cover border border-slate-100" alt={p.name} />
                          <div className="max-w-[120px]">
                            <h4 className="text-xs font-bold text-slate-700 truncate">{p.name}</h4>
                            <p className="text-[9px] text-slate-400 font-semibold">{p.category}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 text-[9px] font-black rounded ${
                            (p.left ?? 0) === 0 
                              ? 'bg-rose-100 text-rose-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {(p.left ?? 0) === 0 ? 'Habis' : `${p.left} tersisa`}
                          </span>
                          <button 
                            onClick={() => {
                              if (onUpdateProductStock) onUpdateProductStock(p.id, 50);
                              alert(`Stok produk ${p.name} berhasil di-restock ke 50 unit!`);
                            }}
                            className="text-[9px] font-black text-blue-600 hover:underline"
                          >
                            Isi Ulang +50
                          </button>
                        </div>
                      </div>
                    ))}
                    {products.filter(p => (p.left ?? 0) <= 5).length === 0 && (
                      <div className="text-center py-6 text-xs font-bold text-slate-400">
                        🎉 Semua stok aman &amp; melimpah!
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      products.forEach(p => {
                        if (onUpdateProductStock && (p.left ?? 0) <= 5) {
                          onUpdateProductStock(p.id, 50);
                        }
                      });
                      alert('Mengisi penuh semua stok yang berada di tingkat kritis!');
                    }}
                    className="w-full py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Activity className="w-4.5 h-4.5 text-[#ff6b00]" />
                    Isi Semua Stok Kritis
                  </button>
                </div>

              </div>

              {/* Quick Actions Grid panels */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-white p-6 border border-slate-100 rounded-3xl hover:border-[#ff6b00] group cursor-pointer transition-all flex items-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-orange-50 text-[#ff6b00] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Tambah Katalog Baru</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Input beras, minyak, sayuran terbaru</p>
                  </div>
                </div>

                <div 
                  onClick={() => setShowFlashSaleModal(true)}
                  className="bg-white p-6 border border-slate-100 rounded-3xl hover:border-emerald-500 group cursor-pointer transition-all flex items-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-[#dfebd5] text-[#006e2f] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Megaphone className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Sentralkan Flash Sale</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sebarkan info diskon kilat ke warga</p>
                  </div>
                </div>

                <div 
                  onClick={() => setShowSupportModal(true)}
                  className="bg-white p-6 border border-slate-100 rounded-3xl hover:border-blue-500 group cursor-pointer transition-all flex items-center gap-4 shadow-sm"
                >
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Komplek Support Chat</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Verifikasi transfer &amp; balas chat warga</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/***************************** TAB 2: MANAGE PRODUCTS *****************************/}
          {activeTab === 'products' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Katalog Sembako Kompleks</h3>
                  <p className="text-xs text-slate-400 font-semibold">Tentukan harga jual, edit kuantitas stok realtime, atau hapus item dari jangkauan belanja warga.</p>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#ff6b00] hover:bg-[#e05e00] text-white text-xs font-extrabold rounded-2xl shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Tambah Item</span>
                </button>
              </div>

              {/* Filters header bar */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari nama produk sembako..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]/30 transition-all"
                  />
                </div>

                {/* Category selectors */}
                <div className="flex flex-wrap gap-1.5">
                  {['Semua', 'Beras', 'Telur', 'Minyak', 'Mie Instan', 'Sayuran'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        productCategoryFilter === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table/Grid list */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-left">
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 w-12">Foto</th>
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Nama Item</th>
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Kategori</th>
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Harga</th>
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center w-36">Stok Toko</th>
                      <th className="pb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-right w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {filteredProducts.map((p) => {
                      const isEditing = editingProductId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/25 transition-colors group">
                          <td className="py-4 pr-3">
                            <img src={p.image} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" alt={p.name} />
                          </td>
                          <td className="py-4 pr-3 font-bold text-slate-800">
                            <div>
                              <span>{p.name}</span>
                              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{p.unit}</span>
                            </div>
                          </td>
                          <td className="py-4 pr-3">
                            <span className="px-2.5 py-0.5 font-bold uppercase tracking-wide text-[9px] bg-slate-100 text-slate-500 rounded">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 pr-3 text-right font-bold text-slate-800 font-mono">
                            {isEditing ? (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-slate-400">Rp</span>
                                <input
                                  type="number"
                                  value={editingPrice}
                                  onChange={(e) => setEditingPrice(parseInt(e.target.value) || 0)}
                                  className="w-20 p-1.5 border border-[#ff6b00]/50 rounded-lg text-right text-xs font-black outline-none bg-orange-50/20"
                                />
                              </div>
                            ) : (
                              <span>Rp {(p.originalPrice || p.price).toLocaleString('id-ID')}</span>
                            )}
                          </td>
                          <td className="py-4 px-3 text-center">
                            {isEditing ? (
                              <div className="flex items-center gap-1 justify-center">
                                <button
                                  type="button"
                                  onClick={() => setEditingStock(prev => Math.max(0, prev - 1))}
                                  className="w-6 h-6 bg-slate-150 hover:bg-slate-200 rounded text-slate-700 font-black flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={editingStock}
                                  onChange={(e) => setEditingStock(parseInt(e.target.value) || 0)}
                                  className="w-12 p-1.5 border border-[#ff6b00]/50 rounded-lg text-center text-xs font-black outline-none bg-orange-50/20"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingStock(prev => prev + 1)}
                                  className="w-6 h-6 bg-slate-150 hover:bg-slate-200 rounded text-slate-700 font-black flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-1 font-extrabold rounded-md text-[10px] ${
                                (p.left ?? 0) === 0 
                                  ? 'bg-rose-100 text-rose-700' 
                                  : (p.left ?? 0) <= 5 
                                    ? 'bg-amber-100 text-amber-500' 
                                    : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {p.left ?? 0} Unit
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveProductChanges(p.id)}
                                  className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center justify-center"
                                  title="Simpan"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEditing(p)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer flex items-center justify-center"
                                  title="Ubah Stok &amp; Harga"
                                >
                                  <Sliders className="w-3.5 h-3.5 stroke-[2.2]" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  if (confirm(`Yakin ingin menghapus ${p.name} dari katalog toko?`)) {
                                    if (onDeleteProduct) onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 rounded-lg cursor-pointer flex items-center justify-center"
                                title="Hapus Dari Toko"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 font-bold text-slate-400">
                          Tidak ditemukan produk yang cocok dengan pencarian / filter Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/***************************** TAB 3: MANAGE ORDERS *****************************/}
          {activeTab === 'orders' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Kelola Antrean Pesanan Warga</h3>
                  <p className="text-xs text-slate-400 font-semibold">Tinjau pesanan masuk, koordinasikan dengan driver, dan konfirmasikan status kiriman.</p>
                </div>
              </div>

              {/* Status & Search Filters */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Masukkan nama warga atau ID order..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]/30 transition-all"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {['Semua', 'Diproses', 'Diantar', 'Selesai'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                        orderStatusFilter === status
                          ? 'bg-[#ff6b00] text-white shadow'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                      }`}
                    >
                      {status} ({status === 'Semua' ? orders.length : orders.filter(o => o.status === status).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List Expanded Blocks with item visualization */}
              <div className="space-y-5">
                {filteredOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="p-5 border border-slate-150 rounded-3xl space-y-4 hover:border-[#ff6b00]/45 transition-all bg-slate-50/50"
                  >
                    {/* Top Order block info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-150 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-white bg-slate-800 px-3 py-1 rounded-xl">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{ord.date} • {ord.time || '10:00 AM'}</span>
                      </div>

                      {/* Address detail of citizens */}
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5 bg-white border px-3 py-1 rounded-xl shadow-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#ff6b00] flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{ord.address}</span>
                      </span>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left: citizen recipient name and phone coordinates */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Pelanggan / Warga</span>
                        <h4 className="text-sm font-black text-slate-800 mt-1">{ord.customerName}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{ord.phone || '081234567800'}</p>
                        <p className="text-[10px] font-extrabold text-[#006e2f] bg-[#dfebd5] w-max px-2.5 py-0.5 rounded-md mt-2 flex items-center gap-1">
                          Pembayaran: {ord.paymentMethod === 'qris' ? 'QRIS / M-Bangking' : ord.paymentMethod || 'COD / Tunai'}
                        </p>
                      </div>

                      {/* Middle: items list summary */}
                      <div className="md:col-span-1 border-l border-r border-slate-150 px-0 md:px-6">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-2">Item Belanjaan</span>
                        <ul className="space-y-1.5 text-xs text-slate-600 font-bold max-h-[120px] overflow-y-auto pr-1">
                          {ord.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between items-center gap-1">
                              <span className="truncate max-w-[150px]">{it.productName}</span>
                              <span className="text-slate-400 font-mono">x{it.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: pricing breakdown & Step controls */}
                      <div className="flex flex-col justify-between items-start md:items-end gap-3 text-left md:text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Pembayaran</span>
                          <span className="text-lg font-black text-[#ff6b00] mt-1 block">
                            Rp {ord.total.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {/* Interactive state controls */}
                        <div className="flex gap-2 w-full justify-start md:justify-end">
                          {ord.status !== 'Selesai' ? (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, ord.status)}
                              className="px-4 py-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl shadow-sm text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                            >
                              {ord.status === 'Diproses' ? (
                                <>
                                  <Activity className="w-3.5 h-3.5 shrink-0" />
                                  <span>🚀 Atur Diantar Kurir</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  <span>✅ Selesaikan Kiriman</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="px-3 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black rounded-xl flex items-center gap-1">
                              <Check className="w-4 h-4" />
                              Selesai Diterima Warga
                            </span>
                          )}

                          {/* Order cancellation */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Yakin ingin membatalkan/menghapus pesanan #${ord.id}?`)) {
                                if (onDeleteOrder) onDeleteOrder(ord.id);
                              }
                            }}
                            className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                            title="Batalkan Pesanan"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Batalkan</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Timeline Tracker strip */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wide text-slate-400 max-w-[450px]">
                        <span className={ord.status === 'Diproses' ? 'text-amber-600' : 'text-emerald-600'}>1. Diproses</span>
                        <span className={ord.status === 'Diantar' ? 'text-blue-600' : ord.status === 'Selesai' ? 'text-emerald-600' : 'text-slate-300'}>2. Diantar Kurir</span>
                        <span className={ord.status === 'Selesai' ? 'text-emerald-600' : 'text-slate-300'}>3. Selesai</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full relative max-w-[450px]">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            ord.status === 'Diproses'
                              ? 'bg-amber-500 w-[15%]'
                              : ord.status === 'Diantar'
                                ? 'bg-blue-500 w-[55%]'
                                : 'bg-emerald-500 w-[100%]'
                          }`}
                        />
                      </div>
                    </div>

                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 font-bold text-slate-400">
                    Tidak ditemukan antrean pesanan yang cocok dengan kriteria pencarian / filter Anda.
                  </div>
                )}
              </div>
            </div>
          )}

          {/***************************** TAB 4: LIST RESIDENTS & SUPPORT *****************************/}
          {activeTab === 'residents' && (
            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Daftar Warga Perumahan (Klien)</h3>
                  <p className="text-xs text-slate-400 font-semibold">Tinjau profil pembeli reguler, kelola status, dan hubungi langsung via live support KomplekMart.</p>
                </div>
              </div>

              {/* Resident Search Filter */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={residentSearch}
                  onChange={(e) => setResidentSearch(e.target.value)}
                  placeholder="Cari warga berdasarkan nama atau nomor blok..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-[#ff6b00]/30 transition-all"
                />
              </div>

              {/* Grid List of Residents */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResidents.map((res, idx) => {
                  const hasUnreadPrompt = res.name !== customerName;
                  return (
                    <div 
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-150 hover:border-[#ff6b00]/30 rounded-2xl space-y-3 transition-all flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50/75 border border-orange-100 text-[#ff6b00] flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                          {res.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">{res.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{res.block}</span>
                          <span className="text-[10px] text-slate-400 font-semibold font-mono">{res.phone}</span>
                        </div>
                      </div>

                      {/* Spend values */}
                      <div className="bg-white border rounded-xl p-2.5 grid grid-cols-2 text-center text-[10px] font-bold text-slate-500 gap-2">
                        <div className="border-r">
                          <span className="block text-slate-400 text-[9px] uppercase">Transaksi</span>
                          <span className="font-mono text-slate-800 mt-0.5 block">{res.transactions} pesanan</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[9px] uppercase">Total Belanja</span>
                          <span className="font-mono text-emerald-700 mt-0.5 block">Rp {res.totalSpent.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                        <span className={`text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full ${
                          res.status === 'Baru' ? 'text-blue-600 bg-blue-50' : ''
                        }`}>
                          {res.status}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedChatUser(res.name);
                            setShowSupportModal(true);
                          }}
                          className="flex items-center gap-1 text-[10px] font-black text-[#ff6b00] hover:underline"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Mulai Chat</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* MODAL WINDOWS FOR ACTIONS */}
      <AnimatePresence>
        {/* ADD PRODUCT MODAL */}

        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-800">Tambah Katalog Produk</h3>
                <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-bold text-slate-500">
                <div className="space-y-1">
                  <label>Nama Produk</label>
                  <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="Contoh: Beras Solok Premium" className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl" required />
                </div>
                <div className="space-y-1">
                  <label>Gambar Produk</label>
                  <input type="file" onChange={handleUploadImage} className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer" accept="image/*" />
                  {newProdImage && <img src={newProdImage} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label>Harga (Rp)</label>
                    <input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder="82000" className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl" required />
                  </div>
                  <div className="space-y-1">
                    <label>Stok Awal</label>
                    <input type="number" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label>Kategori</label>
                    <select value={newProdCategory} onChange={(e) => { setNewProdCategory(e.target.value); setIsCustomCategory(e.target.value === 'Lainnya'); }} className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl">
                      <option value="Beras">Beras</option>
                      <option value="Minyak">Minyak</option>
                      <option value="Telur">Telur</option>
                      <option value="Mie Instan">Mie Instan</option>
                      <option value="Sayuran">Sayuran</option>
                      <option value="Lainnya">+ Tambah Kategori Baru</option>
                    </select>
                    {isCustomCategory && (
                      <input type="text" value={customCategoryName} onChange={(e) => setCustomCategoryName(e.target.value)} placeholder="Nama kategori baru" className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl mt-2" required />
                    )}
                  <div className="space-y-1">
                    <label>Unit/Porsi</label>
                  </div>
                    <input type="text" value={newProdUnit} onChange={(e) => setNewProdUnit(e.target.value)} placeholder="5 Kilogram" className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label>Deskripsi Singkat</label>
                  <textarea value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} placeholder="Beras lokal berkualitas langsung dari pertanian..." rows={2} className="w-full p-3 font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl resize-none" />
                </div>

                <button type="submit" className="w-full h-12 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors pt-1">
                  Simpan ke Katalog
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* FLASH SALE MODAL */}
        {showFlashSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  <span>Sentralkan Flash Sale</span>
                </h3>
                <button onClick={() => setShowFlashSaleModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              <div className="space-y-4 text-xs font-bold text-slate-500">
                <div className="space-y-3">
                  <label>Atur Produk Flash Sale Jumat Berkah</label>
                  <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-2">
                    {products.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={!!p.isFlashSale} 
                          onChange={() => onUpdateProductFlashSale?.(p.id, !p.isFlashSale, p.isFlashSale ? undefined : p.price)}
                        />
                        <div className="flex-grow flex flex-col">
                          <span>{p.name} (Asli: Rp {p.price.toLocaleString('id-ID')})</span>
                          {p.isFlashSale && (
                            <input 
                              type="number" 
                              value={p.price} 
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val)) {
                                  onUpdateProductFlashSale?.(p.id, true, val);
                                }
                              }}
                              className="w-full p-1.5 mt-1 border border-slate-200 rounded"
                              placeholder="Harga Flash Sale"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowFlashSaleModal(false)}
                  className="w-full h-12 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors pt-1"
                >
                  Selesai
                </button>
              </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* SUPPORT / CUSTOMER CHAT MODAL */}
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 max-w-lg w-full h-[525px] shadow-2xl flex flex-col justify-between"
            >
              {/* HEADER WITH TOGGLE TO BACK */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {selectedChatUser && (
                    <button 
                      onClick={() => setSelectedChatUser(null)} 
                      className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 mr-1"
                    >
                      <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-black text-slate-800">
                      {selectedChatUser ? `Chat dengan ${selectedChatUser}` : 'Komplek Customer Support'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowSupportModal(false);
                    setSelectedChatUser(null);
                  }} 
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-105"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL WORKSPACE - LIST OF USERS VS ACTIVE LIVE CHAT LOG */}
              <div className="flex-grow overflow-y-auto my-3 min-h-0 space-y-3 pr-1">
                {!selectedChatUser ? (
                  // USER SELECTION LIST VERSION
                  <div className="space-y-3">
                    {/* Dynamic Real Active Customer Chat Row */}
                    <div 
                      onClick={() => setSelectedChatUser(customerName)}
                      className="p-4 bg-orange-50/50 border-2 border-orange-200 rounded-2xl flex flex-col gap-1 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer relative"
                    >
                      <span className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                        ● LIVE CHAT
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-800">{customerName} (Warga)</span>
                        <span className="text-[10px] text-slate-400 font-bold">Sekarang</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-1 truncate max-w-[85%]">
                        {chatMessages[chatMessages.length - 1]?.text || "Mulai percakapan dengan warga kompleks"}
                      </p>
                      
                      {/* Badge if receipt uploaded */}
                      {chatMessages.some(m => m.image) && (
                        <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1 mt-1 bg-emerald-50 w-max px-2 py-0.5 rounded-lg border border-emerald-100">
                          📎 ADA BUKTI TRANSFER
                        </span>
                      )}

                      <button 
                        className="mt-2 text-[10px] font-black text-[#ff6b00] hover:underline flex justify-end gap-1 items-center self-end"
                      >
                        Masuk Obrolan Live
                        <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Passive/Mock Citizen chat rows */}
                    {supportConversations.map((chat, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedChatUser(chat.customer)}
                        className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col gap-1 hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">{chat.customer} ({chat.block})</span>
                          <span className="text-[10px] text-slate-400 font-bold">{chat.time}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-1 italic">
                          "{chat.msg}"
                        </p>
                        <button 
                          className="mt-2 text-[10px] font-bold text-blue-600 hover:underline flex justify-end gap-1 items-center self-end"
                        >
                          Balas Chat
                          <ChevronRight className="w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : selectedChatUser === customerName ? (
                  // ACTIVE CUSTOMER LIVE CHAT WINDOW INNER DYNAMIC
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex-grow overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 max-h-[290px]">
                      {chatMessages.map(msg => {
                        const isAdminMsg = msg.sender === 'admin';
                        return (
                          <div 
                            key={msg.id} 
                            className={`flex flex-col max-w-[80%] ${isAdminMsg ? 'self-end ml-auto items-end' : 'self-start mr-auto items-start'}`}
                          >
                            <span className="text-[9px] text-slate-400 font-black mb-1">
                              {isAdminMsg ? 'Anda (Admin)' : customerName}
                            </span>
                            <div className={`p-2.5 rounded-xl text-xs font-medium ${
                              isAdminMsg 
                                ? 'bg-[#ff6b00] text-white rounded-tr-none' 
                                : 'bg-white text-slate-800 border border-slate-150 rounded-tl-none'
                            }`}>
                              {msg.text}

                              {/* Show proof image if sent */}
                              {msg.image && (
                                <div className="mt-2 rounded-lg bg-slate-100 border p-1 max-w-[150px]">
                                  <img 
                                    src={msg.image} 
                                    alt={msg.fileName} 
                                    className="w-full h-auto object-cover rounded"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="text-[8px] font-black text-slate-500 mt-1 block truncate">
                                    {msg.fileName}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-[8px] text-slate-400 font-bold mt-1">
                              {msg.timestamp}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* REPLY INPUT FIELD */}
                    <div className="pt-3 border-t border-slate-100 mt-3 flex-shrink-0 flex gap-2 animate-fadeIn">
                      <input 
                        type="text" 
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (!adminReplyText.trim()) return;
                            onAdminReplyChat(adminReplyText);
                            setAdminReplyText('');
                          }
                        }}
                        placeholder={`Tulis balasan koordinasi untuk warga ${customerName}...`}
                        className="flex-grow p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:border-[#ff6b00]/50 outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (!adminReplyText.trim()) return;
                          onAdminReplyChat(adminReplyText);
                          setAdminReplyText('');
                        }}
                        className="p-2.5 bg-[#ff6b00] text-white rounded-xl shadow-sm hover:bg-[#e05e00] flex items-center justify-center font-bold"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // SIMULATED STATIC CHAT LOG WINDOW FOR Rudi, Ani, or Dewi
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex-grow overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-2xl border border-slate-100 max-h-[290px]">
                      <div className="flex flex-col max-w-[80%] self-start mr-auto items-start">
                        <span className="text-[9px] text-slate-400 font-black mb-1">{selectedChatUser}</span>
                        <div className="p-2.5 rounded-xl text-xs font-medium bg-white text-slate-800 border border-slate-150 rounded-tl-none">
                          {supportConversations.find(c => c.customer === selectedChatUser)?.msg || "Mas, tolong diproses ya."}
                        </div>
                        <span className="text-[8px] text-slate-400 font-bold mt-1">
                          {supportConversations.find(c => c.customer === selectedChatUser)?.time}
                        </span>
                      </div>
                    </div>

                    {/* MOCK REPLY CHAT */}
                    <div className="pt-3 border-t border-slate-100 mt-3 flex-shrink-0 flex gap-2">
                      <input 
                        type="text" 
                        placeholder={`Tulis pesan koordinasi untuk ${selectedChatUser}...`}
                        className="flex-grow p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            alert(`Simulasi Balasan Berhasil Terkirim ke ${selectedChatUser}`);
                            setSelectedChatUser(null);
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          alert(`Simulasi Balasan Berhasil Terkirim ke ${selectedChatUser}`);
                          setSelectedChatUser(null);
                        }}
                        className="p-2.5 bg-[#ff6b00] text-white rounded-xl shadow-sm hover:bg-[#e05e00] flex items-center justify-center font-bold"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
