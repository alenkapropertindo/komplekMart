import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Edit2, 
  LogOut, 
  ChevronRight, 
  Sliders,
  User,
  Phone,
  MapPin,
  Save,
  CheckCircle,
  LogIn,
  ShoppingBag
} from 'lucide-react';
import { UserProfile, Order } from '../types';
import QuickLoginCard from './QuickLoginCard';

interface AccountScreenProps {
  user: UserProfile | null;
  orders: Order[];
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onSwitchScreen: (screen: 'home' | 'cart' | 'account' | 'admin') => void;
  isLoggedIn: boolean;
  onQuickLogin: (phone: string) => Promise<{ success: boolean; message?: string }>;
}

export default function AccountScreen({
  user,
  orders,
  onUpdateUser,
  onLogout,
  onSwitchScreen,
  isLoggedIn,
  onQuickLogin
}: AccountScreenProps) {
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditAddress(user.address);
    }
  }, [user]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    onUpdateUser({
      ...user,
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    setIsSavedSuccessfully(true);
    setTimeout(() => {
      setIsSavedSuccessfully(false);
    }, 3000);
  };

  const handleRegisterOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editPhone || !editAddress) return;
    const newProfile: UserProfile = {
      name: editName,
      phone: editPhone,
      address: editAddress,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };
    onUpdateUser(newProfile);
    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 3000);
  };

  const userOrders = orders.filter(o => 
    (user && o.customerName.toLowerCase() === user.name.toLowerCase()) || 
    (user && o.phone === user.phone)
  );

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto pb-28 space-y-6 px-4 mt-6"
      >
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 bg-orange-50 text-[#ff6b00] rounded-2xl flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-800">
              {showRegisterForm ? 'Buat Akun Baru' : 'Masuk ke Akun'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              {showRegisterForm ? 'Isi data untuk buat akun instan' : 'Masuk dengan nomor WhatsApp'}
            </p>
          </div>

          {!showRegisterForm ? (
            <>
              <QuickLoginCard
                isLoggedIn={false}
                onLogin={onQuickLogin}
              />

              <button 
                onClick={() => setShowRegisterForm(true)}
                className="w-full text-center text-[#ff6b00] font-bold text-sm border-b-2 border-[#ff6b00] hover:text-[#e05e00] hover:border-[#e05e00] transition-colors cursor-pointer bg-transparent py-2"
              >
                Belum punya akun? Buat Akun
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleRegisterOrLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                      placeholder="Nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Nomor WhatsApp</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                      placeholder="08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Alamat Blok Kompleks</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                      placeholder="Blok A-5 Kompleks"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white py-3.5 px-4 rounded-2xl font-extrabold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Buat Akun Instan</span>
                </button>
              </form>

              <button 
                onClick={() => setShowRegisterForm(false)}
                className="w-full text-center text-[#ff6b00] font-bold text-sm border-b-2 border-[#ff6b00] hover:text-[#e05e00] hover:border-[#e05e00] transition-colors cursor-pointer bg-transparent py-2"
              >
                Sudah punya akun? Masuk
              </button>
            </>
          )}

          {isSavedSuccessfully && (
            <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Akun berhasil dibuat & masuk otomatis!</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <button 
            onClick={() => onSwitchScreen('admin')}
            className="w-full p-4 flex items-center gap-4 hover:bg-orange-50/30 transition-colors text-left cursor-pointer group"
          >
            <Sliders className="w-5 h-5 text-[#ff6b00] stroke-[2.5]" />
            <span className="flex-grow text-sm font-semibold text-slate-700 group-hover:text-slate-950">Dashboard Admin</span>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto pb-28 space-y-6"
    >
      {/* Profile Hero section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center border border-slate-100 relative mt-2">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#ff6b00] shadow-md bg-slate-100">
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              src={user.avatar}
            />
          </div>
        </div>
        <h2 className="text-xl font-extrabold text-[#0b1c30]">{user.name}</h2>
        <p className="text-sm font-semibold text-slate-400 mt-0.5">{user.phone}</p>
        <p className="text-xs font-bold text-[#ff6b00] tracking-tight bg-orange-50 px-3 py-1 rounded-full mt-2 inline-block">
          {user.address}
        </p>
      </section>

      {/* Edit Profile Section */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
          <Edit2 className="w-4.5 h-4.5 text-[#ff6b00]" />
          <span>Ubah Profil Warga</span>
        </h3>
        
        <form onSubmit={handleSaveChanges} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                placeholder="Masukkan nama baru Anda"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Nomor WhatsApp</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wide">Alamat Blok Kompleks</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <MapPin className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#ff6b00]/50 rounded-2xl font-bold text-xs text-slate-800 outline-none transition-all"
                placeholder="Contoh: Greenwood Residence, Blok A-5"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#ff6b00] hover:bg-[#e05e00] text-white py-3 px-4 rounded-2xl font-extrabold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </form>

        {isSavedSuccessfully && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-center gap-2 text-emerald-800 font-bold text-xs mt-2"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profil sukses diperbarui!</span>
          </motion.div>
        )}
      </section>

      {/* History orders section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Riwayat Pesanan</h3>
          <span className="text-xs font-bold text-slate-400">{userOrders.length} Pesanan</span>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-600">Belum ada riwayat pesanan.</p>
            <p className="text-[11px] text-slate-400">Pesanan yang Anda buat akan muncul otomatis di sini.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userOrders.map((ord) => (
              <div 
                key={ord.id}
                className="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-slate-100 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-50 text-xs">
                  <span className="font-extrabold text-slate-800">#{ord.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                    ord.status === 'Selesai' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : ord.status === 'Diantar' 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {ord.status} ({ord.statusDescription})
                  </span>
                </div>

                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded-xl border border-slate-50" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.productName}</p>
                        <p className="text-[11px] text-slate-400 font-semibold">{item.quantity}x @ Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-xs">
                  <span className="text-[11px] font-bold text-slate-400">{ord.date} • {ord.paymentMethod}</span>
                  <span className="font-black text-[#ff6b00]">Total: Rp {ord.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* App Action Controls */}
      <section className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm divide-y divide-slate-50">
        <button 
          id="btn_switch_to_admin"
          onClick={() => onSwitchScreen('admin')}
          className="w-full p-4 flex items-center gap-4 hover:bg-orange-50/30 transition-colors text-left cursor-pointer group"
        >
          <Sliders className="w-5 h-5 text-[#ff6b00] stroke-[2.5]" />
          <span className="flex-grow text-sm font-semibold text-slate-700 group-hover:text-slate-950">Dashboard Admin</span>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full p-4 flex items-center gap-4 hover:bg-red-50/50 transition-colors text-left cursor-pointer group"
        >
          <LogOut className="w-5 h-5 text-red-500 stroke-[2.5]" />
          <span className="flex-grow text-sm font-bold text-red-500">Keluar Akun</span>
          <ChevronRight className="w-5 h-5 text-red-200 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </motion.div>
  );
}
