import { Salon, ServiceItem, WorkingDayHour } from '../types';

export function format12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export interface LiveStatusResult {
  isOpen: boolean;
  statusText: string;
  badgeLabel: string;
  badgeClass: string;
  closingTimeFormatted?: string;
  openingTimeFormatted?: string;
}

export function computeSalonLiveStatus(workingHours?: WorkingDayHour[]): LiveStatusResult {
  if (!workingHours || workingHours.length === 0) {
    return {
      isOpen: true,
      statusText: 'Open today',
      badgeLabel: 'Open',
      badgeClass: 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300',
    };
  }

  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = workingHours.find(
    wh => wh.day.toLowerCase() === todayName.toLowerCase()
  );

  if (!todaySchedule || !todaySchedule.isOpen) {
    const todayIndex = now.getDay();
    let nextOpenSchedule: WorkingDayHour | undefined;
    let daysAhead = 1;
    for (let i = 1; i <= 7; i++) {
      const nextDayName = daysOfWeek[(todayIndex + i) % 7];
      const found = workingHours.find(wh => wh.day.toLowerCase() === nextDayName.toLowerCase() && wh.isOpen);
      if (found) {
        nextOpenSchedule = found;
        daysAhead = i;
        break;
      }
    }

    const nextDayLabel = daysAhead === 1 ? 'Tomorrow' : (nextOpenSchedule?.day || 'Soon');
    const openTime = nextOpenSchedule?.open ? format12Hour(nextOpenSchedule.open) : '9 AM';

    return {
      isOpen: false,
      statusText: `Closed today • Opens ${nextDayLabel} ${openTime}`,
      badgeLabel: 'Closed',
      badgeClass: 'bg-slate-900/90 border border-slate-700 text-slate-400',
    };
  }

  const [openH, openM] = todaySchedule.open.split(':').map(n => parseInt(n, 10) || 0);
  const [closeH, closeM] = todaySchedule.close.split(':').map(n => parseInt(n, 10) || 0);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const formattedOpen = format12Hour(todaySchedule.open);
  const formattedClose = format12Hour(todaySchedule.close);

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: `Closed • Opens today at ${formattedOpen}`,
      badgeLabel: `Opens ${formattedOpen}`,
      badgeClass: 'bg-amber-950/80 border border-amber-500/40 text-amber-300',
      openingTimeFormatted: formattedOpen,
    };
  }

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const minutesRemaining = closeMinutes - currentMinutes;
    if (minutesRemaining <= 45) {
      return {
        isOpen: true,
        statusText: `Closing soon • Closes ${formattedClose}`,
        badgeLabel: 'Closing Soon',
        badgeClass: 'bg-amber-900/80 border border-amber-400 text-amber-200 animate-pulse',
        closingTimeFormatted: formattedClose,
      };
    }

    return {
      isOpen: true,
      statusText: `Open now • Closes ${formattedClose}`,
      badgeLabel: 'Open now',
      badgeClass: 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300',
      closingTimeFormatted: formattedClose,
    };
  }

  return {
    isOpen: false,
    statusText: `Closed for today • Opens tomorrow`,
    badgeLabel: 'Closed',
    badgeClass: 'bg-slate-900/90 border border-slate-700 text-slate-400',
  };
}

export function getSalonStartingPrice(salon: Salon, services: ServiceItem[]): number {
  if (salon.startingPrice) return salon.startingPrice;
  const salonServices = services.filter(s => s.salonId === salon.id);
  if (salonServices.length === 0) return 30;
  return Math.min(...salonServices.map(s => s.price));
}

export function getSalonMapUrl(salon: {
  name: string;
  address: string;
  city?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}): string {
  if (salon.mapUrl && salon.mapUrl.trim().length > 0) {
    const trimmed = salon.mapUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  const query = `${salon.name}, ${salon.address}${salon.city ? ', ' + salon.city : ''}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function getCleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}
