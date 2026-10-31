import React, { useState, useEffect } from 'react';
import { ScreenType, Product, CartItem, Order, UserProfile, ChatMessage, Resident } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_USER } from './data';
import { getFlashSaleSchedule } from './utils/flashSale';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Bell, 
  Home as HomeIcon, 
  ShoppingCart, 
  User as UserIcon, 
  Sliders, 
  X,
  MessageSquare,
  ShieldCheck,
  Zap,
  RefreshCw,
  LogOut
} from 'lucide-react';

import LoginScreen from './components/LoginScreen';
import CustomerHome from './components/CustomerHome';
import ProductDetail from './components/ProductDetail';
import CartScreen from './components/CartScreen';
import CheckoutScreen from './components/CheckoutScreen';
import ReceiptScreen from './components/ReceiptScreen';
import AccountScreen from './components/AccountScreen';
import AdminDashboard from './components/AdminDashboard';
import FloatingChat from './components/FloatingChat';

export default function App() {
  // Authentication & Screen navigation
  const [user, setUser] = useState<UserProfile | null>(null); // Pre-logged in for better initial review
  const [userRole, setUserRole] = useState<string | null>(null); // 'manager' atau 'resident'
  const [screen, setScreen] = useState<ScreenType>(ScreenType.HOME);
  const [isAdmin, setIsAdmin] = useState(false); // Switcher state between Client Storefront & Admin Dashboard
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Dynamic lists
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load data from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodData, error: prodErr } = await supabase.from('products').select('*');
        let loadedProducts = INITIAL_PRODUCTS;
        if (!prodErr && prodData && prodData.length > 0) {
          loadedProducts = prodData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category,
            image: p.image,
            unit: p.unit,
            rating: p.rating || '5.0',
            description: p.description,
            left: p.left_stock ?? 10,
            isFlashSale: p.is_flash_sale ?? false,
            originalPrice: p.original_price ? Number(p.original_price) : undefined
          }));
        }
        
        // Pastikan Air Galon dan Gas 3Kg selalu ada di produk
        const hasGalon = loadedProducts.some(p => p.name === 'Air Galon');
        const hasGas = loadedProducts.some(p => p.name === 'Gas 3Kg');
        
        if (!hasGalon) {
          loadedProducts.unshift({
            id: 'p_added_galon',
            name: 'Air Galon',
            price: 5000,
            category: 'Air Galon',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbr02q0Ugb_8xz6twlyHKgFnMml-mcjEfDxoQDp2A1-lkhb4R3LoDXsJc4db65mAfE7hBnQJ0lHOGMnuEpFF8I8izwGirsGAY5UbFVEXidOSGezqo1i8ZWf7TP56ThtIKceXVNE_sePlxqWiWUgmQsYUkdGvdppJECHBGkzqZm7QqJ0WELwGmUyhpAPyyrTRTCmthsFlqjSbY2E7ywFWtq3bJo-AiJMLSPib5WmKUxdQCTihBllfy0RFHo-1pB8Y94VbxXpenQMM45',
            unit: '19 Liter',
            rating: '4.9',
            description: 'Air mineral galon isi ulang higienis.',
            left: 20
          });
        }
        
        if (!hasGas) {
          loadedProducts.unshift({
            id: 'p_added_gas',
            name: 'Gas 3Kg',
            price: 28000,
            category: 'Gas',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGtE9AswMvqosTT5WoCuVeXZFOK-bi8t6vFqiWU_bu-v50LBhCTos14X8gxLDUfT_2b8LiRnXWW04G4sE1dHH7u2tXvQUejwO8TP_XiukaPcSQr8SGCy8t4aIh1_jsFQnE6J96Elv3CTfJcJE-rsJY8n-dUCGTb-34ObQo5grcc-a_S5CkRLmjn5GJpeKIZyaY2ECcbHPi69kC1jez2gJJaIsT_F_mog5xcQVO436HFyBhyMZfd_wyWaM8OvtgdgzS-qNx9p0N2HX',
            unit: 'Tabung 3Kg',
            rating: '4.9',
            description: 'Gas LPG 3Kg bersubsidi.',
            left: 15
          });
        }
        
        setProducts(loadedProducts);

        const { data: ordData, error: ordErr } = await supabase.from('orders').select('*');
        if (!ordErr && ordData && ordData.length > 0) {
          setOrders(ordData.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            items: o.items,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.delivery_fee),
            total: Number(o.total),
            status: o.status,
            statusDescription: o.status_description,
            date: o.date,
            address: o.address,
            phone: o.phone,
            paymentMethod: o.payment_method
          })));
        } else {
          setOrders(INITIAL_ORDERS);
        }

        const { data: resData, error: resErr } = await supabase.from('residents').select('*');
        if (!resErr && resData && resData.length > 0) {
          setResidents(resData.map((r: any) => ({
            id: r.id,
            name: r.name,
            block: r.block,
            phone: r.phone,
            totalSpent: Number(r.total_spent || 0),
            transactions: Number(r.transactions || 0),
            status: r.status || 'Aktif',
            role: r.role
          })));

          // Set default user jika belum ada
          if (!user && resData.length > 0) {
            const defaultRes = resData[0];
            setUser({
              name: defaultRes.name,
              phone: defaultRes.phone,
              address: defaultRes.block,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
            });
            setUserRole(defaultRes.role || 'resident');
            // Jangan auto-set isAdmin - biarkan false, user harus klik toggle
            // setIsAdmin(defaultRes.role === 'manager');
          }
        } else {
          setResidents([]);
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    }
    fetchData();
  }, []);

  // Notification badge count & notifications list - MUST be BEFORE useEffect yang pakai
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  // Real-time listener untuk notifikasi
  useEffect(() => {
    // Skip jika belum login atau belum ada role
    if (!userRole || !user?.phone) {
      console.log('Skip notifications - userRole:', userRole, 'user:', user?.phone);
      return;
    }

    // Load notifikasi dari database dengan filter role
    async function loadNotifications() {
      try {
        let query = supabase
          .from('notifications')
          .select('*');

        // Filter berdasarkan role
        if (userRole === 'manager') {
          // Admin: notifikasi order baru (target_phone = 'manager')
          query = query.eq('target_phone', 'manager');
        } else if (userRole === 'resident' && user?.phone) {
          // Customer: notifikasi untuk nomor mereka saja
          query = query.eq('target_phone', user.phone);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        console.log('Load notifications - userRole:', userRole, 'user.phone:', user?.phone, 'data:', data, 'error:', error);
        
        if (data && data.length > 0) {
          setUnreadNotifications(data.length);
          setNotificationsList(data.map((n: any) => ({
            id: n.id,
            title: n.type === 'new_order' ? 'Pesanan Baru Masuk!' : 
                   n.type === 'order_shipped' ? 'Pesanan Sedang Diantar!' : 'Pesan Baru',
            body: n.type === 'new_order' ? `Pesanan #${n.order_id} masuk` :
                  n.type === 'order_shipped' ? `Pesanan #${n.order_id} sedang diantar` : 'Ada update baru',
            time: 'Baru saja'
          })));
        }
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }

    loadNotifications();

    // Listen notifications table INSERT untuk role ini
    const notifChannel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        console.log('Notification INSERT detected:', payload.new);
        
        // Filter: admin lihat target_phone='manager', resident lihat target_phone=nomor mereka
        const notif = payload.new;
        let shouldShow = false;
        
        if (userRole === 'manager' && notif.target_phone === 'manager') {
          shouldShow = true;
        } else if (userRole === 'resident' && notif.target_phone === user?.phone) {
          shouldShow = true;
        }
        
        if (!shouldShow) {
          console.log('Skip notification - not for this user:', notif);
          return;
        }

        setUnreadNotifications(prev => prev + 1);
        setNotificationsList(prev => [{
          id: notif.id,
          title: notif.type === 'new_order' ? 'Pesanan Baru Masuk!' : 
                 notif.type === 'order_shipped' ? 'Pesanan Sedang Diantar!' : 'Pesan Baru',
          body: notif.type === 'new_order' ? `Pesanan #${notif.order_id} masuk` :
                notif.type === 'order_shipped' ? `Pesanan #${notif.order_id} sedang diantar` : 'Update baru',
          time: 'Baru saja'
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
    };
  }, [userRole, user]);

  // Core Dynamic Chat State representation (Synchronized globally)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: 'msg_init', 
      sender: 'admin', 
      text: 'Halo! Selamat datang di Hub Sembako KomplekMart. Ada yang bisa kami bantu hari ini? Kakak bisa tanya status pengantaran kurir atau gampang upload bukti transfer di sini! 😊', 
      timestamp: '10:00 AM' 
    }
  ]);

  const handleCustomerSendMessage = (text: string, image?: string, fileName?: string) => {
    setChatMessages(prev => [
      ...prev,
      {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: 'customer',
        text,
        timestamp: new Date().toLocaleTimeString('id-US', { hour: '2-digit', minute: '2-digit' }),
        image,
        fileName
      }
    ]);
  };

  const handleAdminReplyChatMessage = (text: string) => {
    setChatMessages(prev => [
      ...prev,
      {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: 'admin',
        text,
        timestamp: new Date().toLocaleTimeString('id-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Flash Sale Friday 08:00 - 20:00 WIB Schedule & Simulation State
  const [overrideFlashSaleSimulation, setOverrideFlashSaleSimulation] = useState(false);
  const [remindedProductIds, setRemindedProductIds] = useState<string[]>([]);
  const [flashSaleToast, setFlashSaleToast] = useState<{ message: string; type: 'warning' | 'success' } | null>(null);

  const flashSaleSchedule = getFlashSaleSchedule(overrideFlashSaleSimulation);
  const isFlashSaleActive = flashSaleSchedule.isActive;

  useEffect(() => {
    if (!flashSaleToast) return;
    const timer = setTimeout(() => {
      setFlashSaleToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [flashSaleToast]);

  const handleToggleReminder = (productId: string, productName?: string) => {
    setRemindedProductIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        setFlashSaleToast({
          message: `Pengingat untuk ${productName || 'produk'} dinonaktifkan.`,
          type: 'warning'
        });
        return prev.filter(id => id !== productId);
      } else {
        setFlashSaleToast({
          message: `Pengingat aktif! Kami akan mengingatkan Anda saat Flash Sale ${productName ? '"' + productName + '"' : ''} dimulai hari Jumat pukul 08:00 WIB.`,
          type: 'success'
        });
        return [...prev, productId];
      }
    });
  };

  const handleBlockedFlashSaleAdd = () => {
    setFlashSaleToast({
      message: 'Penawaran terbatas Flash Sale dimulai pada Jumat 8:00 AM (08:00 - 20:00 WIB). Sebelum itu produk belum bisa ditambahkan ke keranjang.',
      type: 'warning'
    });
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    // Restriction: Flash sale products only 1 per user during active hours
    if (product.isFlashSale && isFlashSaleActive) {
      setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          // Already in cart, don't add more
          alert("Maaf, produk promo Flash Sale dibatasi maksimal 1 per orang.");
          return prev;
        }
        // Add only 1
        return [...prev, { id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9), product, quantity: 1 }];
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9), product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Switch viewing product details
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen(ScreenType.PRODUCT_DETAIL);
  };

  // Place order from Checkout screen
  const handlePlaceOrder = async (details: {
    address: string;
    recipientName: string;
    phone: string;
    paymentMethod: string;
    deliveryFee: number;
  }) => {
    // Automatically create account instantly without password
    const newUser: UserProfile = {
      name: details.recipientName,
      phone: details.phone,
      address: details.address,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };
    setUser(newUser);

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const orderTotal = subtotal + details.deliveryFee;

    // Restriction: User only one order per flash sale product per day
    const flashSaleItems = cart.filter(item => item.product.isFlashSale && isFlashSaleActive);
    
    if (flashSaleItems.length > 0) {
      // Cek dari tabel orders apakah user sudah order flash sale hari ini
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('items, created_at')
        .eq('phone', details.phone)
        .gte('created_at', todayStr + 'T00:00:00')
        .lte('created_at', todayStr + 'T23:59:59');

      if (todayOrders && todayOrders.length > 0) {
        // Cek apakah ada item flash sale di order hari ini
        const flashSaleProductNames = flashSaleItems.map(item => item.product.name);
        const alreadyOrderedFlashSale = todayOrders.some(order => {
          const items = order.items as Array<{ productName: string }>;
          return items?.some((item: { productName: string }) => 
            flashSaleProductNames.includes(item.productName)
          );
        });

        if (alreadyOrderedFlashSale) {
          alert("Maaf, Anda sudah melakukan order produk Flash Sale hari ini. Batasan promo adalah 1x per hari.");
          return;
        }
      }
    }

    const newOrder: Order = {
      id: 'KM-' + Math.floor(100000 + Math.random() * 900000),
      customerName: details.recipientName,
      items: cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image
      })),
      subtotal,
      deliveryFee: details.deliveryFee,
      total: orderTotal,
      status: 'Diproses',
      statusDescription: 'Pesanan sedang disiapkan',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      address: details.address,
      phone: details.phone,
      paymentMethod: details.paymentMethod,
      time: new Date().toLocaleTimeString('id-US', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await supabase.from('orders').insert({
        id: newOrder.id,
        customer_name: newOrder.customerName,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.deliveryFee,
        total: newOrder.total,
        status: newOrder.status,
        status_description: newOrder.statusDescription,
        date: newOrder.date,
        address: newOrder.address,
        phone: newOrder.phone,
        payment_method: newOrder.paymentMethod
      });

      // Notify all managers about new order
      const { data: managers } = await supabase.from('residents').select('phone').eq('role', 'manager');
      if (managers && managers.length > 0) {
        const notificationInserts = managers.map(manager => ({
          type: 'new_order',
          order_id: newOrder.id,
          target_phone: manager.phone,
          is_read: false
        }));
        await supabase.from('notifications').insert(notificationInserts);
        console.log('Notification sent to managers:', managers.length);
      }
    } catch (e) {
      console.error('Supabase error placing order:', e);
    }

    try {
      const residentId = 'res_' + details.phone.replace(/[^0-9]/g, '');
      const { data: existingRes } = await supabase.from('residents').select('*').eq('phone', details.phone).maybeSingle();
      
      if (existingRes) {
        await supabase.from('residents').update({
          total_spent: Number(existingRes.total_spent || 0) + orderTotal,
          transactions: Number(existingRes.transactions || 0) + 1,
          name: details.recipientName,
          block: details.address
        }).eq('id', existingRes.id);
      } else {
        await supabase.from('residents').insert({
          id: residentId,
          name: details.recipientName,
          block: details.address,
          phone: details.phone,
          total_spent: orderTotal,
          transactions: 1,
          status: 'Aktif'
        });
      }
    } catch (e) {
      console.error('Supabase error saving resident:', e);
    }

    // Kurangi stok produk (local state & supabase)
    try {
      setProducts(prevProducts => {
        const updated = [...prevProducts];
        cart.forEach(cartItem => {
          const pIndex = updated.findIndex(p => p.id === cartItem.product.id || p.name === cartItem.product.name);
          if (pIndex !== -1) {
            const newLeft = Math.max(0, (updated[pIndex].left || 10) - cartItem.quantity);
            updated[pIndex] = { ...updated[pIndex], left: newLeft };
            
            // Update ke supabase
            supabase.from('products').update({ left_stock: newLeft })
              .eq('id', updated[pIndex].id)
              .then(({ error }) => {
                if (error) console.error('Supabase error updating stock:', error);
              });
          }
        });
        return updated;
      });
    } catch (e) {
      console.error('Error updating product stock:', e);
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]); // Clear cart
    setScreen(ScreenType.RECEIPT);
  };

  // Manager admin actions
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'Diproses' | 'Diantar' | 'Selesai') => {
    let desc = '';
    if (nextStatus === 'Diproses') desc = 'Pesanan sedang disiapkan';
    else if (nextStatus === 'Diantar') desc = 'Driver sedang menuju lokasi';
    else desc = 'Pesanan telah selesai diterima';

    try {
      await supabase.from('orders').update({
        status: nextStatus,
        status_description: desc
      }).eq('id', orderId);

      // Notify customer when status becomes "Diantar"
      if (nextStatus === 'Diantar') {
        const order = orders.find(o => o.id === orderId);
        if (order && order.phone) {
          await supabase.from('notifications').insert({
            type: 'order_shipped',
            order_id: orderId,
            target_phone: order.phone,
            is_read: false
          });
          console.log('Notification sent to customer:', order.phone);
        }
      }
    } catch (e) {
      console.error('Supabase error updating order status:', e);
    }

    setOrders(prev => prev.map(ord => 
      ord.id === orderId 
        ? { ...ord, status: nextStatus, statusDescription: desc }
        : ord
    ));

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => prev ? { ...prev, status: nextStatus, statusDescription: desc } : null);
    }
  };

  const handleAddNewProductFromFile = async (newProduct: Product) => {
    try {
      await supabase.from('products').insert({
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        unit: newProduct.unit,
        rating: newProduct.rating,
        description: newProduct.description,
        left_stock: newProduct.left || 10,
        is_flash_sale: newProduct.isFlashSale || false,
        original_price: newProduct.originalPrice
      });
    } catch (e) {
      console.error('Supabase error adding product:', e);
    }
    alert(`Produk Baru "${newProduct.name}" Berhasil ditambahkan ke katalog Toko!`);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {
      console.error('Supabase error deleting product:', e);
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateProductStock = async (productId: string, newStock: number) => {
    const val = Math.max(0, newStock);
    try {
      await supabase.from('products').update({ left_stock: val }).eq('id', productId);
    } catch (e) {
      console.error('Supabase error updating stock:', e);
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, left: val } : p));
  };

  const handleUpdateProductPrice = async (productId: string, newPrice: number) => {
    const val = Math.max(0, newPrice);
    
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      if (p.originalPrice !== undefined) {
        return { ...p, originalPrice: val };
      } else {
        return { ...p, price: val };
      }
    }));

    try {
      const p = products.find(prod => prod.id === productId);
      if (p && p.originalPrice !== undefined) {
        await supabase.from('products').update({ original_price: val }).eq('id', productId);
      } else {
        await supabase.from('products').update({ price: val }).eq('id', productId);
      }
    } catch (e) {
      console.error('Supabase error updating price:', e);
    }
  };


  const handleUpdateProductFlashSale = async (productId: string, isFlashSale: boolean, flashSalePrice?: number) => {
    let updatedPrice = 0;
    let origPrice: number | undefined = undefined;

    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      if (isFlashSale) {
        origPrice = p.originalPrice || p.price;
        updatedPrice = (flashSalePrice !== undefined && !isNaN(flashSalePrice) && flashSalePrice > 0) ? flashSalePrice : p.price;
        return {
          ...p,
          isFlashSale: true,
          originalPrice: origPrice,
          price: updatedPrice
        };
      } else {
        updatedPrice = p.originalPrice || p.price;
        return {
          ...p,
          isFlashSale: false,
          price: updatedPrice,
          originalPrice: undefined
        };
      }
    }));

    try {
      const currentProduct = products.find(p => p.id === productId);
      const finalPrice = isFlashSale 
        ? ((flashSalePrice !== undefined && !isNaN(flashSalePrice) && flashSalePrice > 0) ? flashSalePrice : (currentProduct?.price || currentProduct?.originalPrice || 1000))
        : (currentProduct?.originalPrice || currentProduct?.price || 1000);

      await supabase.from('products').update({
        is_flash_sale: isFlashSale,
        price: finalPrice,
        original_price: isFlashSale ? (origPrice || currentProduct?.originalPrice || currentProduct?.price) : null
      }).eq('id', productId);
    } catch (e) {
      console.error('Supabase error updating flash sale:', e);
    }
  };
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.error('Supabase error deleting order:', e);
    }
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleTriggerReStock = (idx: number, newStock: number) => {
    // re-stock trigger callback
  };

  const handleLogoutFlow = () => {
    setUser(null);
    setUserRole(null);
    setScreen(ScreenType.LOGIN);
    setCart([]);
  };

  const handleLoginSuccess = async (phoneNumber: string, name?: string, block?: string) => {
    setUser({
      name: name || 'Warga Kompleks',
      phone: phoneNumber,
      address: block || 'Blok A, Perumahan Asri',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    });
    
    // Ambil role dari database
    try {
      const { data } = await supabase
        .from('residents')
        .select('role')
        .eq('phone', phoneNumber)
        .maybeSingle();
      
      if (data?.role) {
        setUserRole(data.role);
        setIsAdmin(data.role === 'manager');
      } else {
        setUserRole('resident');
        setIsAdmin(false);
      }
    } catch (e) {
      console.error('Error fetching role:', e);
      setUserRole('resident');
      setIsAdmin(false);
    }
    
    setScreen(ScreenType.HOME);
  };

  // Quick login via WhatsApp number, available from the cart & checkout screens
  const handleQuickLogin = async (phoneInput: string): Promise<{ success: boolean; message?: string }> => {
    const normalizePhone = (value: string) => {
      let digits = value.replace(/\D/g, '');
      if (digits.startsWith('62')) digits = digits.slice(2);
      else if (digits.startsWith('0')) digits = digits.slice(1);
      return digits;
    };

    const normalized = normalizePhone(phoneInput);
    if (normalized.length < 9) {
      return { success: false, message: 'Nomor telepon belum valid. Minimal 9 digit angka.' };
    }

    let found: { name: string; phone: string; address: string } | null = null;

    const localMatch = residents.find(r => normalizePhone(r.phone) === normalized);
    if (localMatch) {
      found = {
        name: localMatch.name,
        phone: localMatch.phone,
        address: localMatch.block
      };
    } else {
      try {
        const { data } = await supabase.from('residents').select('*');
        const remoteMatch = (data || []).find(
          (r: any) => normalizePhone(String(r.phone || '')) === normalized
        );
        if (remoteMatch) {
          found = {
            name: remoteMatch.name,
            phone: remoteMatch.phone,
            address: remoteMatch.block
          };
        }
      } catch (e) {
        console.error('Supabase error during quick login:', e);
        return { success: false, message: 'Gagal memeriksa akun. Periksa koneksi lalu coba lagi.' };
      }
    }

    if (!found) {
      return {
        success: false,
        message: 'Nomor belum terdaftar. Isi data pengiriman di bawah untuk membuat akun otomatis.'
      };
    }

    setUser({
      name: found.name || 'Warga Kompleks',
      phone: found.phone || normalized,
      address: found.address || 'Blok A, Perumahan Asri',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    });

    // Set role
    try {
      const { data } = await supabase
        .from('residents')
        .select('role')
        .eq('phone', found.phone)
        .maybeSingle();
      
      if (data?.role) {
        setUserRole(data.role);
        setIsAdmin(data.role === 'manager');
      } else {
        setUserRole('resident');
        setIsAdmin(false);
      }
    } catch (e) {
      console.error('Error fetching role:', e);
      setUserRole('resident');
      setIsAdmin(false);
    }

    return { success: true };
  };

  const handleNotificationsClear = () => {
    setNotificationsList([]);
  };

  // Filter recommendations based on active product being viewed or choose defaults
  const getRecommendedProducts = () => {
    if (!selectedProduct) return [];
    return products.filter(p => p.id !== selectedProduct.id).slice(0, 2);
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col antialiased relative">
      
      {/* Global Flash Sale Toast Popup */}
      <AnimatePresence>
        {flashSaleToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
              flashSaleToast.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500/50'
                : 'bg-slate-900 text-white border-[#ff6b00]/60'
            }`}
          >
            <span className="text-base flex-shrink-0">
              {flashSaleToast.type === 'success' ? '🔔' : '⚠️'}
            </span>
            <p className="flex-grow leading-relaxed">{flashSaleToast.message}</p>
            <button
              onClick={() => setFlashSaleToast(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Dynamic Header Tool Bar display based on user role and logged in details */}
      {user && screen !== ScreenType.LOGIN && (
        <header className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 flex justify-between items-center h-16 px-6 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff6b00]">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            {isAdmin ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">PANEL ADMIN</span>
                <span className="text-sm font-black text-[#ff6b00]">KomplekMart Admin</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Kirim ke</span>
                <span className="text-xs font-black text-slate-800 tracking-tight block max-w-[150px] truncate">
                  {user.address}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Notifications Trigger */}
            <button 
              onClick={() => {
                setShowNotifications(true);
                setUnreadNotifications(0);
                // Mark all notifications as read di database
                supabase.from('notifications')
                  .update({ is_read: true })
                  .eq('is_read', false)
                  .then()
                  .catch(e => console.error('Error marking notifications as read:', e));
              }}
              className="relative w-10 h-10 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center border border-slate-100 cursor-pointer text-slate-600"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Profile Avatar Trigger which shows screen switcher directly for quick access */}
            <button 
              id="btn_account_menu_header"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#ff6b05]/20 shadow-md cursor-pointer hover:border-[#ff6b00]/50 active:scale-95 transition-all outline-none"
            >
              <img 
                src={isAdmin ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDZI-JHFBIi-tGwHP75KlSKnP57JzXzrLtWnKgEURAb4LN-LyQHZisrV6HT9IerSVAWk6dfbTRBXVDz2IDFn3CYoaZSlCXdHq52r_f4sn0Jd96SK3i4AFzJYweuRyaG1IiW-I-MVS8g5L7SkgDuYGJ1a0-DIrJIvLvbadryV6pGfXnOELw37cEvvH-nq1oP1CMSGoL3gb8pMKUgdu0qo7CgSZdIbhSreFvtZlpcOzHTWjJEVPTh9b4MvJ3HsZYm6seeexCbPfWhkiYN" : user.avatar} 
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu Account */}
            {showAccountDropdown && (
              <>
                {/* Click outside backdrop spacer */}
                <div 
                  className="fixed inset-0 z-40 bg-zinc-900/10 cursor-default" 
                  onClick={() => setShowAccountDropdown(false)} 
                />
                
                <div 
                  id="dropdown_account_menu" 
                  className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 flex flex-col gap-3 text-left animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Avatar & Name Header inside dropdown */}
                  <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ff6b00]/20 bg-slate-50 flex-shrink-0">
                      <img 
                        src={isAdmin ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDZI-JHFBIi-tGwHP75KlSKnP57JzXzrLtWnKgEURAb4LN-LyQHZisrV6HT9IerSVAWk6dfbTRBXVDz2IDFn3CYoaZSlCXdHq52r_f4sn0Jd96SK3i4AFzJYweuRyaG1IiW-I-MVS8g5L7SkgDuYGJ1a0-DIrJIvLvbadryV6pGfXnOELw37cEvvH-nq1oP1CMSGoL3gb8pMKUgdu0qo7CgSZdIbhSreFvtZlpcOzHTWjJEVPTh9b4MvJ3HsZYm6seeexCbPfWhkiYN" : user.avatar} 
                        className="w-full h-full object-cover"
                        alt="Avatar User"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">
                        {isAdmin ? "Admin KomplekMart" : user.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">
                        {isAdmin ? "Sistem Pengelola Toko" : user.address}
                      </p>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="flex flex-col text-xs font-bold text-slate-600 gap-1 divide-y divide-slate-50">
                    {/* Toggle Admin only untuk manager */}
                    {userRole === 'manager' && (
                      <button
                        id="btn_dropdown_toggle_role"
                        onClick={() => {
                          setIsAdmin(!isAdmin);
                          setShowAccountDropdown(false);
                          if (isAdmin) {
                            // Switching to Customer Storefront
                            setScreen(ScreenType.HOME);
                          }
                        }}
                        className="w-full py-2.5 px-3 flex items-center gap-2.5 hover:bg-orange-50 rounded-xl hover:text-[#ff6b00] active:scale-95 transition-all text-left cursor-pointer"
                      >
                        {isAdmin ? (
                          <>
                            <ShoppingCart className="w-4.5 h-4.5 text-[#ff6b00]" />
                            <span>🛒 Toko Pelanggan</span>
                          </>
                        ) : (
                          <>
                            <Sliders className="w-4.5 h-4.5 text-[#ff6b00]" />
                            <span>🔧 Dashboard Admin</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Customer Account Page option if we are in customer view */}
                    {!isAdmin && (
                      <button
                        onClick={() => {
                          setScreen(ScreenType.ACCOUNT);
                          setShowAccountDropdown(false);
                        }}
                        className="w-full py-2.5 px-3 flex items-center gap-2.5 hover:bg-slate-50 rounded-xl hover:text-slate-850 active:scale-95 transition-all text-left cursor-pointer pt-2"
                      >
                        <UserIcon className="w-4.5 h-4.5 text-slate-400" />
                        <span>👤 Buka Halaman Akun</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowAccountDropdown(false);
                        handleLogoutFlow();
                      }}
                      className="w-full py-2.5 px-3 flex items-center gap-2.5 hover:bg-rose-50 rounded-xl hover:text-rose-600 active:scale-95 transition-all text-left cursor-pointer pt-2"
                    >
                      <LogOut className="w-4.5 h-4.5 text-rose-550" />
                      <span>🚪 Keluar Akun</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>
      )}

      {/* Main Container Stage viewport */}
      <main className={`flex-grow px-6 ${user && screen !== ScreenType.LOGIN ? 'pt-24' : 'pt-6'}`}>
        <AnimatePresence mode="wait">
          {screen === ScreenType.LOGIN && (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}

          {!isAdmin ? (
            // CUSTOMER VIEW WORKFLOWS
            <>
              {screen === ScreenType.HOME && (
                <CustomerHome 
                  products={products}
                  cartCount={cart.length}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onSwitchScreen={(sc) => setScreen(sc as any)}
                  isFlashSaleActive={isFlashSaleActive}
                  overrideFlashSaleSimulation={overrideFlashSaleSimulation}
                  onToggleFlashSaleSimulation={setOverrideFlashSaleSimulation}
                  remindedProductIds={remindedProductIds}
                  onToggleReminder={handleToggleReminder}
                  onBlockedFlashSaleAdd={handleBlockedFlashSaleAdd}
                />
              )}

              {screen === ScreenType.PRODUCT_DETAIL && selectedProduct && (
                <ProductDetail 
                  product={selectedProduct}
                  onBack={() => setScreen(ScreenType.HOME)}
                  onAddToCart={handleAddToCart}
                  onSelectRecommendedProduct={handleSelectProduct}
                  recommendedProducts={getRecommendedProducts()}
                  isFlashSaleActive={isFlashSaleActive}
                  isReminded={remindedProductIds.includes(selectedProduct.id)}
                  onToggleReminder={handleToggleReminder}
                />
              )}

              {screen === ScreenType.CART && (
                <CartScreen 
                  cartItems={cart}
                  onUpdateQuantity={handleUpdateCartQuantity}
                  onRemoveItem={handleRemoveCartItem}
                  onPlaceOrder={handlePlaceOrder}
                  onStartShopping={() => setScreen(ScreenType.HOME)}
                  defaultUserName={user?.name || ''}
                  defaultPhone={user?.phone || ''}
                  defaultAddress={user?.address || ''}
                  isLoggedIn={!!user}
                  onQuickLogin={handleQuickLogin}
                  isFlashSaleActive={isFlashSaleActive}
                />
              )}

              {screen === ScreenType.CHECKOUT && (
                <CheckoutScreen 
                  cartItems={cart}
                  onBack={() => setScreen(ScreenType.CART)}
                  onPlaceOrder={handlePlaceOrder}
                  defaultUserName={user?.name || ''}
                  defaultPhone={user?.phone || ''}
                  defaultAddress={user?.address || ''}
                  isLoggedIn={!!user}
                  onQuickLogin={handleQuickLogin}
                />
              )}

              {screen === ScreenType.RECEIPT && (
                <ReceiptScreen 
                  order={activeOrder}
                  onBackToHome={() => {
                    setActiveOrder(null);
                    setScreen(ScreenType.HOME);
                  }}
                  onContactCS={() => alert('Menghubungi Tim Layanan Hub KomplekMart... Salam hangat!')}
                />
              )}

              {screen === ScreenType.ACCOUNT && (
                <AccountScreen 
                  user={user}
                  orders={orders}
                  onUpdateUser={setUser}
                  onLogout={handleLogoutFlow}
                  onSwitchScreen={(sc) => {
                    if (sc === 'admin' && userRole === 'manager') {
                      setIsAdmin(true);
                    } else {
                      setScreen(sc as any);
                    }
                  }}
                  isLoggedIn={!!user}
                  onQuickLogin={handleQuickLogin}
                />
              )}
            </>
          ) : (
            // MERCHANT / ADMIN workflow view
            <AdminDashboard residents={residents} 
              orders={orders}
              products={products}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAddNewProduct={handleAddNewProductFromFile}
              onAddStockAlert={handleTriggerReStock}
              chatMessages={chatMessages}
              onAdminReplyChat={handleAdminReplyChatMessage}
              customerName={user?.name || 'Warga Kompleks'}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProductStock={handleUpdateProductStock}
              onUpdateProductPrice={handleUpdateProductPrice}
                  onUpdateProductFlashSale={handleUpdateProductFlashSale}
              onDeleteOrder={handleDeleteOrder}
              unreadNotifications={unreadNotifications}
              onResetNotifications={() => setUnreadNotifications(0)}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Dynamic bottom Navigation Bar, hidden on Login, and switches status highlights correctly */}
      {screen !== ScreenType.LOGIN && screen !== ScreenType.CHECKOUT && !isAdmin && (
        <nav className="fixed bottom-0 left-0 w-full z-45 flex justify-around items-center h-20 pb-safe bg-white border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] rounded-t-3xl">
          {/* Back to Home tab */}
          <button 
            onClick={() => setScreen(ScreenType.HOME)}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all cursor-pointer ${
              screen === ScreenType.HOME || screen === ScreenType.PRODUCT_DETAIL
                ? 'bg-orange-50 text-[#ff6b00] scale-95 font-bold' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <HomeIcon className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] uppercase font-black tracking-wider mt-1">Beranda</span>
          </button>

          {/* Cart items tab switcher */}
          <button 
            onClick={() => setScreen(ScreenType.CART)}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all cursor-pointer relative ${
              screen === ScreenType.CART || screen === ScreenType.CHECKOUT
                ? 'bg-orange-50 text-[#ff6b00] scale-95 font-bold' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] uppercase font-black tracking-wider mt-1">Keranjang</span>
            {cart.length > 0 && (
              <span className="absolute top-1 right-4 bg-[#ff6b00] text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                {cart.length}
              </span>
            )}
          </button>

          {/* Account profile tab switcher */}
          <button 
            onClick={() => setScreen(ScreenType.ACCOUNT)}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all cursor-pointer ${
              screen === ScreenType.ACCOUNT 
                ? 'bg-orange-50 text-[#ff6b00] scale-95 font-bold' 
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <UserIcon className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px] uppercase font-black tracking-wider mt-1">Akun</span>
          </button>
        </nav>
      )}

      {/* Notifications Drawer overlay dialog */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop color filter */}
            <div onClick={() => setShowNotifications(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" />
            
            <motion.div 
              initial={{ x: 280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              className="bg-white max-w-sm w-full h-full relative z-10 shadow-2xl flex flex-col p-6 space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#0b1c30]">Notifikasi</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {notificationsList.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-300 font-bold text-sm">
                  Tidak ada notifikasi baru
                </div>
              ) : (
                <div className="flex-grow divide-y divide-slate-50 overflow-y-auto space-y-3">
                  {notificationsList.map((not) => (
                    <div key={not.id} className="pt-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800">{not.title}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{not.time}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 leading-normal">{not.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handleNotificationsClear}
                className="w-full py-3 border-2 border-slate-200 hover:border-slate-300 text-slate-500 text-xs font-bold rounded-xl active:scale-95 transition-transform cursor-pointer pt-3.5"
              >
                Hapus Semua Notifikasi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Floating Chat for Seller messaging */}
      {user && screen !== ScreenType.LOGIN && !isAdmin && (
        <FloatingChat 
          messages={chatMessages}
          onSendMessage={handleCustomerSendMessage}
          user={user}
          orders={orders}
        />
      )}

    </div>

  );
}
