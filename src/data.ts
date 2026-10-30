import { Product, Order, UserProfile } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Beras Premium Pandan Wangi',
    price: 78500,
    category: 'Beras',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTC6R_LtNsbC8ik2m1v_hiti1is9m9jXmDQrgG1b9K_KtCBcdXjlpe9xs1mC5ZshjxVWsX85jrc1bJnzIp5alXFRfnIKTm_BYxXmBUukM0tyHKvyZFaK--vJIJEtxHw3QiCF0Us4nIAroL8GWc7Ekm5vBobC2pBZPQC33kvdPIU2UMafODPiSKyuLTmRigQBmpINZca2dWVlVzsDS62UYaw789YXfdxU18pLnPl1o4Z8OmcyJbusW8xw3nUcD6xJTBrwCnKnizie1',
    unit: '5 Kilogram',
    rating: '4.9 (120+)',
    description: 'Beras kualitas premium, pulen dan bersih. Dipanen langsung dari petani lokal pilihan untuk menjamin kesegaran dan rasa terbaik bagi keluarga Anda di kompleks. Tekstur yang empuk dan aroma wangi alami menjadikannya pilihan utama untuk hidangan harian yang sehat.',
    left: 8,
    iconName: 'egg'
  },
  {
    id: 'p2',
    name: 'Stroberi Segar Organik',
    price: 45000,
    category: 'Sayuran',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hUUkDhKM1QLJYM6EAVHhtH9kd4gKLd9nYG19Ksjqis1i213PRisonFeGhAe_hidQeW1e8x2ux_5cS0cKD_VticxoT6nfHVMA2lcobnbGGlaFjnzXI3--of1a4TiO1-_L4VTHqcREQBbudadZsMDO1CQxnQ5dEFJOpK_7yU321O4q5kkYtD9ztH-fRZAdsJdqc5zCs4EFSUgggVSQ2N3HEtxF29yS3E-t2Q-Owqa2YDBqE7iwM4YxPuA001ePGWCfASK1XqtgVzk7',
    unit: 'Kotak 250g',
    rating: '4.8 (85+)',
    description: 'Stroberi segar organik pilihan dari petani dataran tinggi. Kaya vitamin C dengan rasa manis-segar alami, nikmat untuk camilan sehat atau pelengkap sarapan.',
    left: 20,
    isFlashSale: true,
    originalPrice: 65000
  },
  {
    id: 'p3',
    name: 'Susu Sapi Segar Murni',
    price: 22000,
    category: 'Air Mineral',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGotyw9m6jUk8X8Ts1jUeWOThF8KQpjIHUjnSSKoqHAIwg7-UWeElUFk3qr_-VCIOFeOawUZNnjCQvW__l6L7l3XcsBdIFrydFLNx0M3PWJo8eWtZX7Xc2WNyxazJ7Zcbd9IGBO3oB7Gdb4qgTJUtzjZ6tGuBDvZQdjkDJ5C73X-6Wsq6iQoaV7MHFUwku4anm6_gweIIPklIE8ojuf3hR_FlXX7GTqE84jP9WjJ--bH3iHZhEO7dvZ3ec4yJ1rvRuXx1xG0c4OqZe',
    unit: 'Botol 1 Liter',
    rating: '4.9 (210+)',
    description: 'Susu sapi murni segar dan lembut dari peternakan lokal terpercaya. Dipasteurisasi higienis menjaga kebaikan kalsium dan rasa gurih alaminya.',
    left: 15
  },
  {
    id: 'p4',
    name: 'Roti Sourdough Panggang',
    price: 35000,
    category: 'Roti',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdVQ_5aNdtAyzOmt9E6-wi38wlCCSSgenfVTXKUxdneMvyV_ydk05iYShGV6Ql8hXHbwbhQKqvlhqLB-6U5Ox5ruLB8J1QtETP1NPHl7CEAUNygU8dojLITEVLgqoGdVFBY68uAa1LQmpoB7ZQLbim5IiMxNsy3TorVjqj3F2xqHOCNv68dyZ1VWHtGHHlrRyPjE-HBbb_8Rdmpc_IHBD7ASBFhBSEh7L8WFIlzBiWKNlu5dRKCQv5XBKg-yn1u9zBcxZ3T_Slct9X',
    unit: '1 Porsi Utuh',
    rating: '4.9 (95+)',
    description: 'Roti sourdough artisanal berkerak renyah dengan tekstur kenyal dan lembut di dalam. Dibuat dengan ragi fermentasi alami 24 jam setiap pagi.',
    left: 5
  },
  {
    id: 'p5',
    name: 'Beras Ramos Super 5kg',
    price: 75000,
    category: 'Beras',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbr02q0Ugb_8xz6twlyHKgFnMml-mcjEfDxoQDp2A1-lkhb4R3LoDXsJc4db65mAfE7hBnQJ0lHOGMnuEpFF8I8izwGirsGAY5UbFVEXidOSGezqo1i8ZWf7TP56ThtIKceXVNE_sePlxqWiWUgmQsYUkdGvdppJECHBGkzqZm7QqJ0WELwGmUyhpAPyyrTRTCmthsFlqjSbY2E7ywFWtq3bJo-AiJMLSPib5WmKUxdQCTihBllfy0RFHo-1pB8Y94VbxXpenQMM45',
    unit: '5 Kilogram',
    rating: '4.7 (310+)',
    description: 'Beras putih kualitas tinggi, pulen sedang dan serbaguna untuk aneka masakan keluarga. Diproses higienis dan bebas pemutih.',
    left: 12,
    isFlashSale: true,
    originalPrice: 90000
  },
  {
    id: 'p6',
    name: 'Minyak Goreng Sawit 2L',
    price: 34500,
    category: 'Minyak',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsGtE9AswMvqosTT5WoCuVeXZFOK-bi8t6vFqiWU_bu-v50LBhCTos14X8gxLDUfT_2b8LiRnXWW04G4sE1dHH7u2tXvQUejwO8TP_XiukaPcSQr8SGCy8t4aIh1_jsFQnE6J96Elv3CTfJcJE-rsJY8n-dUCGTb-34ObQo5grcc-a_S5CkRLmjn5GJpeKIZyaY2ECcbHPi69kC1jez2gJJaIsT_F_mog5xcQVO436HFyBhyMZfd_wyWaM8OvtgdgzS-qNx9p0N2HX',
    unit: 'Pouch 2 Liter',
    rating: '4.8 (1.2k+)',
    description: 'Minyak goreng kelapa sawit jernih melalui 2 kali proses penyaringan. Titik asap tinggi, masakan lebih garing dan renyah sempurna.',
    left: 20,
    isFlashSale: true,
    originalPrice: 42000
  },
  {
    id: 'p7',
    name: 'Telur Ayam Negeri 1kg',
    price: 28000,
    category: 'Telur',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDh8H0BPFOljbKsSn6nalWDTrcwuiPPXpo-Msq51RGX_7fznQzrEmNfM8TKy1u1zcoY5Mnm2echZK0Mu2MbaiJJz_ArcnCXtzunqsE1si59n2PGProve6gSVMbE0K4vFPUf-wpx9T89XgP1eZ0rfjkyqcgOjzld0YsOiAwzuj_VpXqNgbA26PYfK0N255TPgejsjPAmzomjfOfV4hQuBOV2ukvpe7fRnL3otAcZ7srWQpE0_vkL2foLCwXyKxXXbZBH1JbJMNJKtK1s',
    unit: 'Sekitar 16 Butir',
    rating: '4.8 (850+)',
    description: 'Telur ayam negeri segar langsung dari kandang peternak. Dikemas aman dengan wadah pelindung khusus anti pecah.',
    left: 10,
    isFlashSale: true,
    originalPrice: 35000
  },
  {
    id: 'p8',
    name: 'Mie Instan Goreng (Paket 5 bks)',
    price: 15000,
    category: 'Mie Instan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA66-UlNl__0zUpFmLCirIOf5-E6DKh-wEpv9HDSLObEQEZ53Pbqx-8DITFftJjrXvkzOHho7c73p31OpHGkQPByFFYawVMqwwqtMq8OuyUii9NhkIZ-Czxh9Kb4tr8h5eubx6njC6R9kyrGFK2tDwsdlgLk05qWH221ZHSTYSXxNsExXubgQ-9vIA_IusuOmMSe8NUzmVtzI2_sj7iz7RYemJ8YSrVfdNPlTgfda2AGIZu0GGPx1l4TTEAd6O2lZnp7f3CVGFcN5hd',
    unit: '5 Bungkus',
    rating: '4.9 (4.3k+)',
    description: 'Paket praktis 5 bungkus mie instan rasa gurih khas Indonesia. Lengkap dengan bumbu pilihan dan taburan bawang goreng renyah.',
    left: 45,
    isFlashSale: true,
    originalPrice: 18500
  },
  // Recommended complements
  {
    id: 'p9',
    name: 'Minyak Goreng Botol 1L',
    price: 18000,
    category: 'Minyak',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByMPbOqRElQsgOe6GCbPyVt6iShG7hQrANTLO3efyvyBDCDjCHiDVqCjBmMLhhOWvHd-DarV9-PjnQtXOJqwEjPclUrUIUS1XuBQXpVZDmr3C__EAXtmoa1ris62UCCmb0Z-oSaHMfhrOg3aS4mAfzjyrsG3fxhVED1vwFTV7vUKLFkV0n2hBtVgEwv71Mpq1tcJSix-8fyX2vCrpt-AJCEqqu187DxhMBhqdXNHeAefdbJMbo13JIiWAjJixkSZJCf0O5zytoisR',
    unit: 'Botol 1 Liter',
    rating: '4.8',
    description: 'Minyak goreng botolan 1 liter praktis dan bersih untuk menumis dan memasak harian.'
  },
  {
    id: 'p10',
    name: 'Telur Ayam Negeri Isi 10',
    price: 26500,
    category: 'Telur',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5BKqYgHeBY4Fwcf7HzY3WKggh0A69H4xwZZO_HfpNIVIKUWx-w6NCfK1Yl8i2qVs1DXNC6EBfBPiZ3AAhVUjB6p25kelq4lxB2M4dFq1HzjGXLjidfJkjEdvSzRpouzYGQzzLzuyNirzr3BUuW27vGZzi-dn26pXybFnFoExsJ0UHMtzEXtHvZO6aW0lmoihoObelQFiFjIH__RcRnFU6eDpOmq6WVeWTvHyBI_NlLKH-7M73eR0dtPVelWpc476tWx3tYBRwkGBR',
    unit: 'Kotak 10 Butir',
    rating: '4.9',
    description: 'Telur ayam negeri pilihan dengan kuning telur berkualitas, dikemas dalam kotak karton rapi.'
  },
  {
    id: 'p11',
    name: 'Air Galon Aqua 19L',
    price: 22000,
    category: 'Air Mineral',
    image: 'https://images.unsplash.com/photo-1618506464119-979657db4bbf?auto=format&fit=crop&q=80&w=300',
    unit: '19 Liter',
    rating: '4.9 (1.5k+)',
    description: 'Air mineral galon Aqua 19L asli dan bersih, siap antar langsung ke depan pintu rumah Anda dengan pengantaran super cepat.',
    left: 30
  },
  {
    id: 'p12',
    name: 'Gas LPG Melon 3Kg',
    price: 24000,
    category: 'Lain-lain',
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=300',
    unit: 'Isi Ulang 3Kg',
    rating: '4.8 (2.1k+)',
    description: 'Gas LPG Melon 3Kg isi ulang resmi Pertamina. Aman, tersegel rapat, gratis pasang karet seal baru jika dibutuhkan. Diantar extra cepat!',
    left: 15
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KM-8921',
    customerName: 'Siti Rahma',
    items: [
      {
        productName: 'Wortel Organik 1kg',
        quantity: 1,
        price: 12500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtpu0eucxZu6vnqJIGfB-74K--8ElRJt3qPPzOJaud0TWfuvC14OKLoFKapNH9Rh_CCxKxUZu2mzVJFdEtlUqUyfblMSRl-I_pbCtywMjIpOp-lbCTtGNWdky5CfMcBHGU7bTnEsAeu-kwDiuEmHOt7rQCx6o-7NCB2r_WHhEd6ESZZNHUqTAUYIoVK3ToSD5SulSUrHzqMbqQYLUdnOFEdKD4jmqyZRiLhf49mbmoFbRfcAiF0e2SZ3iuaNynPoxtAzrL7yDeBwEE'
      },
      {
        productName: 'Minyak Goreng Botol 1L',
        quantity: 1,
        price: 18000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByMPbOqRElQsgOe6GCbPyVt6iShG7hQrANTLO3efyvyBDCDjCHiDVqCjBmMLhhOWvHd-DarV9-PjnQtXOJqwEjPclUrUIUS1XuBQXpVZDmr3C__EAXtmoa1ris62UCCmb0Z-oSaHMfhrOg3aS4mAfzjyrsG3fxhVED1vwFTV7vUKLFkV0n2hBtVgEwv71Mpq1tcJSix-8fyX2vCrpt-AJCEqqu187DxhMBhqdXNHeAefdbJMbo13JIiWAjJixkSZJCf0O5zytoisR'
      },
      {
        productName: 'Telur Ayam Negeri Isi 10',
        quantity: 1,
        price: 26500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5BKqYgHeBY4Fwcf7HzY3WKggh0A69H4xwZZO_HfpNIVIKUWx-w6NCfK1Yl8i2qVs1DXNC6EBfBPiZ3AAhVUjB6p25kelq4lxB2M4dFq1HzjGXLjidfJkjEdvSzRpouzYGQzzLzuyNirzr3BUuW27vGZzi-dn26pXybFnFoExsJ0UHMtzEXtHvZO6aW0lmoihoObelQFiFjIH__RcRnFU6eDpOmq6WVeWTvHyBI_NlLKH-7M73eR0dtPVelWpc476tWx3tYBRwkGBR'
      }
    ],
    subtotal: 57000,
    deliveryFee: 5000,
    total: 62000,
    status: 'Diproses',
    statusDescription: 'Pesanan sedang disiapkan di gudang hub komplek',
    date: '24 Okt 2023',
    time: '10:30 WIB',
    address: 'Green Valley Complex, Blok B4 No. 22',
    phone: '081234567812',
    paymentMethod: 'COD (Bayar di Tempat)'
  },
  {
    id: 'KM-8922',
    customerName: 'Budi Santoso',
    items: [
      {
        productName: 'Susu Sapi Segar Murni',
        quantity: 2,
        price: 22000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGotyw9m6jUk8X8Ts1jUeWOThF8KQpjIHUjnSSKoqHAIwg7-UWeElUFk3qr_-VCIOFeOawUZNnjCQvW__l6L7l3XcsBdIFrydFLNx0M3PWJo8eWtZX7Xc2WNyxazJ7Zcbd9IGBO3oB7Gdb4qgTJUtzjZ6tGuBDvZQdjkDJ5C73X-6Wsq6iQoaV7MHFUwku4anm6_gweIIPklIE8ojuf3hR_FlXX7GTqE84jP9WjJ--bH3iHZhEO7dvZ3ec4yJ1rvRuXx1xG0c4OqZe'
      }
    ],
    subtotal: 44000,
    deliveryFee: 5000,
    total: 49000,
    status: 'Diantar',
    statusDescription: 'Kurir sedang menuju ke alamat Anda',
    date: '24 Okt 2023',
    time: '10:55 WIB',
    address: 'Greenwood Residence, Blok A-5',
    phone: '081398716254',
    paymentMethod: 'Bayar via QRIS'
  },
  {
    id: 'KM-8923',
    customerName: 'Dewi Lestari',
    items: [
      {
        productName: 'Roti Sourdough Panggang',
        quantity: 2,
        price: 35000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdVQ_5aNdtAyzOmt9E6-wi38wlCCSSgenfVTXKUxdneMvyV_ydk05iYShGV6Ql8hXHbwbhQKqvlhqLB-6U5Ox5ruLB8J1QtETP1NPHl7CEAUNygU8dojLITEVLgqoGdVFBY68uAa1LQmpoB7ZQLbim5IiMxNsy3TorVjqj3F2xqHOCNv68dyZ1VWHtGHHlrRyPjE-HBbb_8Rdmpc_IHBD7ASBFhBSEh7L8WFIlzBiWKNlu5dRKCQv5XBKg-yn1u9zBcxZ3T_Slct9X'
      },
      {
        productName: 'Stroberi Segar Organik',
        quantity: 1,
        price: 45000,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hUUkDhKM1QLJYM6EAVHhtH9kd4gKLd9nYG19Ksjqis1i213PRisonFeGhAe_hidQeW1e8x2ux_5cS0cKD_VticxoT6nfHVMA2lcobnbGGlaFjnzXI3--of1a4TiO1-_L4VTHqcREQBbudadZsMDO1CQxnQ5dEFJOpK_7yU321O4q5kkYtD9ztH-fRZAdsJdqc5zCs4EFSUgggVSQ2N3HEtxF29yS3E-t2Q-Owqa2YDBqE7iwM4YxPuA001ePGWCfASK1XqtgVzk7'
      }
    ],
    subtotal: 115000,
    deliveryFee: 5000,
    total: 120000,
    status: 'Selesai',
    statusDescription: 'Pesanan telah diterima oleh pemesan',
    date: '23 Okt 2023',
    time: '11:15 WIB',
    address: 'Greenwood Residence, Blok C-3',
    phone: '081288223344',
    paymentMethod: 'COD (Bayar di Tempat)'
  }
];

export const DEFAULT_USER: UserProfile = {
  name: 'Rizqo Fadhilah',
  phone: '0812 3456 7890',
  address: 'Greenwood Residence, Blok C-12',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDVwsbzR7b6aVdOe-eAoDn1up2k5C3D2KBrpchCMgoSICPrVaym1yQCBNJBMasMAM7v_ZIXuP0T-WlLcOLZnAm_Hwi8qQahFTc_3R0i76hVMU3ZcFS3pmk9i-rbi21e6hb-8qQ1cwu57o-ED-ofBQogmFUeGc-4cjotG8dQsmer96CbE16Jy-9aRDo-AcgV9OgoV9oqy3JyqggaQ3k1F7dwC4rGuXHWc07jzQNSppfh5ic5jrdNYbHPxuGeWMmcDDUI7_YlNNKsEgH'
};
