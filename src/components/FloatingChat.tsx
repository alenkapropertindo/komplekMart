import React from 'react';
import { MessageCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface FloatingChatProps {
  user: UserProfile;
  userRole?: string | null;
}

export default function FloatingChat({ user, userRole }: FloatingChatProps) {
  // Skip jika manager
  if (userRole === 'manager') {
    return null;
  }

  const phoneNumber = user.phone.replace(/\D/g, ''); // Hapus non-digits
  const waLink = `https://wa.me/62${phoneNumber.slice(-10)}?text=Halo%20KomplekMart%2C%20saya%20ingin%20bertanya%20tentang%20pesanan%20saya`;

  return (
    <div id="floating_chat_container" className="fixed bottom-24 right-6 z-40">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp KomplekMart"
        title="Chat via WhatsApp"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1fb355] text-white rounded-full flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
