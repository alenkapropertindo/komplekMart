/**
 * Utility for managing Friday 08:00 - 20:00 (8:00 AM - 8:00 PM) Flash Sale schedule
 */

export interface FlashSaleTimeInfo {
  isActive: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  label: string; // "Dimulai dalam" vs "Berakhir dalam"
  scheduleNotice: string; // "Jumat 8:00 AM" vs "Jumat 8:00 PM"
  nextFridayDateString: string;
}

export function getFlashSaleSchedule(overrideActiveFriday?: boolean): FlashSaleTimeInfo {
  // If explicitly overridden for preview/testing
  if (overrideActiveFriday === true) {
    const now = new Date();
    const endToday = new Date(now);
    endToday.setHours(20, 0, 0, 0);
    let diff = Math.max(0, Math.floor((endToday.getTime() - now.getTime()) / 1000));
    if (diff <= 0) diff = 11 * 3600 + 45 * 60 + 20;

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return {
      isActive: true,
      hours,
      minutes,
      seconds,
      label: 'Berakhir dalam',
      scheduleNotice: 'Jumat 8:00 PM',
      nextFridayDateString: 'Hari ini (Simulasi Aktif)'
    };
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 5 = Friday
  const currentHour = now.getHours();

  // Check if today is Friday (5) and between 08:00 and 20:00
  const isFriday = currentDay === 5;
  const isWithinHours = currentHour >= 8 && currentHour < 20;

  if (isFriday && isWithinHours) {
    // Currently Active: countdown to Friday 20:00:00 (8:00 PM)
    const targetEnd = new Date(now);
    targetEnd.setHours(20, 0, 0, 0);

    const diffSec = Math.max(0, Math.floor((targetEnd.getTime() - now.getTime()) / 1000));
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return {
      isActive: true,
      hours,
      minutes,
      seconds,
      label: 'Berakhir dalam',
      scheduleNotice: 'Jumat 8:00 PM',
      nextFridayDateString: 'Jumat Ini'
    };
  }

  // Flash Sale is NOT active: calculate countdown to next Friday 08:00:00 AM
  const targetStart = new Date(now);
  let daysUntilFriday = (5 - currentDay + 7) % 7;

  if (isFriday && currentHour >= 20) {
    daysUntilFriday = 7;
  } else if (daysUntilFriday === 0 && currentHour < 8) {
    daysUntilFriday = 0;
  }

  targetStart.setDate(now.getDate() + daysUntilFriday);
  targetStart.setHours(8, 0, 0, 0);

  const diffSec = Math.max(0, Math.floor((targetStart.getTime() - now.getTime()) / 1000));
  const totalHours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  return {
    isActive: false,
    hours: totalHours,
    minutes,
    seconds,
    label: 'Dimulai dalam',
    scheduleNotice: 'Jumat 8:00 AM',
    nextFridayDateString: targetStart.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })
  };
}
