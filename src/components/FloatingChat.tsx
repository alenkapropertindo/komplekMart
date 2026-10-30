import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Loader2, 
  FileText,
  Plus
} from 'lucide-react';
import { ChatMessage, UserProfile, Order } from '../types';

interface FloatingChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string, fileName?: string) => void;
  user: UserProfile;
  orders: Order[];
}

export default function FloatingChat({ messages, onSendMessage, user, orders }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadName, setUploadName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');
    onSendMessage(textToSend);

    // Simulated Auto response
    generateAutoResponse(textToSend);
  };

  const generateAutoResponse = (customerText: string) => {
    const lowercase = customerText.toLowerCase();
    let responseText = '';
    
    setTimeout(() => {
      if (lowercase.includes('status') || lowercase.includes('antar') || lowercase.includes('kirim') || lowercase.includes('belum')) {
        const activeOrder = orders[0];
        if (activeOrder) {
          responseText = `Halo kak ${user.name}! Pesanan Kakak #${activeOrder.id} yang berisi ${activeOrder.items.length} item saat ini sedang bertatus: "${activeOrder.status}" (${activeOrder.statusDescription}). Kurir siap mengantar dalam 10-15 menit se-kompleks!`;
        } else {
          responseText = `Halo kak ${user.name}! Kami belum mendeteksi adanya order aktif atas nama Kakak hari ini. Silakan pesan melalui katalog ya Kak!`;
        }
      } else if (lowercase.includes('stok') || lowercase.includes('ready') || lowercase.includes('ada')) {
        responseText = `Tenang Kak, stok sembako (beras, telur, minyak dll) di KomplekMart selalu terupdate realtime di halaman depan. Jika ada di katalog berarti ready siap antar!`;
      } else if (lowercase.includes('bukti') || lowercase.includes('transfer') || lowercase.includes('bayar') || lowercase.includes('qris')) {
        responseText = `Siap Kak! Kakak bisa lampirkan gambar bukti transaksinya langsung di sini dengan mengetuk tombol plus (+) di bagian bawah. Kami akan segera me-verifikasi pesanan Kakak!`;
      } else {
        responseText = `Pesan Kakak sudah diterima! Admin & Kurir KomplekMart sedang menyiapkan kebutuhan warga. Kami akan segera membalas chat Kakak jika ada hal khusus ya!`;
      }

      onSendMessage(responseText, undefined, undefined);
    }, 1500);
  };

  // Real image upload handler
  const handleRealImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadName(file.name);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        const reader = new FileReader();
        reader.onload = () => {
          setIsUploading(false);
          const dataUrl = reader.result as string;
          onSendMessage(`Mengirimkan Gambar: ${file.name}`, dataUrl, file.name);

          // Response trigger
          setTimeout(() => {
            onSendMessage(
              `Terima kasih Kak! Gambar [${file.name}] berhasil kami terima. Tim KomplekMart akan segera memproses pesanan Kakak!`,
              undefined,
              undefined
            );
          }, 1200);
        };
        reader.readAsDataURL(file);
      }
    }, 150);
  };

  return (
    <div id="floating_chat_container" className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            id="chat_window"
            className="w-80 sm:w-96 h-[500px] bg-white border border-slate-200 rounded-3xl shadow-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-white/80"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-300/60 bg-[#e6ebf1]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff6b00] text-white hover:bg-[#e05e00] rounded-full flex items-center justify-center text-white">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-tight leading-none text-slate-900">Hub Penjual KomplekMart</h3>
                  <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Biasanya membalas cepat se-kompleks</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Tutup Chat"
                className="w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 rounded-full text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Quick Actions Guide */}
            <div className="p-2.5 border-b border-slate-300/40 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[10px] font-bold text-slate-600 no-scrollbar">
              <span className="text-slate-400 font-bold">Tanya:</span>
              <button 
                onClick={() => {
                  setInputText('Bagaimana status pengantaran pesanan saya hari ini?');
                }}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full px-2.5 py-1 rounded-full cursor-pointer text-slate-800 active:scale-95 transition-all"
              >
                Status Antar
              </button>
              <button 
                onClick={() => {
                  setInputText('Apakah stok telur dan beras premium masih ready?');
                }}
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-full px-2.5 py-1 rounded-full cursor-pointer text-slate-800 active:scale-95 transition-all"
              >
                Stok Ready?
              </button>
            </div>

            {/* Message Pane */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
              {messages.map((msg) => {
                const isCustomer = msg.sender === 'customer';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isCustomer ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    {/* Render bubbles */}
                    <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      isCustomer 
                        ? 'bg-[#ff6b00] text-white hover:bg-[#e05e00] text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 rounded-3xl shadow-sm-sm text-slate-900 rounded-tl-none'
                    }`}>
                      {msg.text}
                      
                      {/* Image Preview */}
                      {msg.image && (
                        <div className="mt-2 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 rounded-xl max-w-[180px] p-1">
                          <img 
                            src={msg.image} 
                            alt={msg.fileName || "bukti"} 
                            className="w-full h-auto object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                          {msg.fileName && (
                            <div className="p-1 pb-0 flex items-center gap-1 text-[9px] font-black uppercase text-slate-300 tracking-tight select-none">
                              <FileText className="w-3 h-3 text-white" />
                              <span className="truncate max-w-[120px]" title={msg.fileName}>{msg.fileName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Timestamp */}
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 px-1 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Uploading progress overlay mockup */}
              {isUploading && (
                <div className="self-end max-w-[80%] flex flex-col items-end">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-3xl shadow-sm-sm text-slate-800 rounded-2xl rounded-tr-none flex items-center gap-3">
                    <Loader2 className="w-4 h-4 text-slate-900 animate-spin" />
                    <div className="text-left text-[11px] font-bold">
                      <p className="text-slate-900 leading-snug">Mengunggah {uploadName}...</p>
                      <div className="w-32 h-1.5 bg-slate-50 border border-slate-200 rounded-xl mt-1 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-900 font-black font-mono">{uploadProgress}%</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input field */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-300/60 flex items-center gap-2">
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleRealImageUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Kirim Gambar"
                aria-label="Upload gambar"
                className="w-10 h-10 text-slate-500 hover:bg-slate-100 rounded-full rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 disabled:opacity-50"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-grow p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl rounded-xl font-bold text-slate-900 outline-none placeholder-slate-400"
              />
              <button 
                type="submit"
                aria-label="Kirim Pesan"
                className="w-10 h-10 bg-[#ff6b00] text-white hover:bg-[#e05e00] text-white rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat Layanan"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ff6b00] text-white hover:bg-[#e05e00] rounded-full text-white flex items-center justify-center cursor-pointer relative shadow-xl"
        title="Chat Layanan Sembako"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-2 -right-1 bg-[#ff6b00] text-white text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-full border border-white/40">
              Chat
            </span>
          </>
        )}
      </button>
    </div>
  );
}
