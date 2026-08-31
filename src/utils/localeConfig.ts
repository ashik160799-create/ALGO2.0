export interface CountryLocaleData {
  code: string;
  name: string;
  nativeName: string;
  currency: string;
  symbol: string;
  symbolNative: string;
  dialCode: string;
  flag: string;
  defaultLanguage: 'en' | 'ar' | 'hi' | 'fr' | 'es' | 'de';
  placeholder: string;
  defaultCity: string;
  exchangeRateFromAED: number;
}

export const COUNTRY_LOCALE_REGISTRY: Record<string, CountryLocaleData> = {
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    currency: 'AED',
    symbol: 'AED',
    symbolNative: 'د.إ',
    dialCode: '+971',
    flag: '🇦🇪',
    defaultLanguage: 'en',
    placeholder: '54 429 8306',
    defaultCity: 'Dubai Marina, UAE',
    exchangeRateFromAED: 1.0,
  },
  IN: {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत',
    currency: 'INR',
    symbol: '₹',
    symbolNative: '₹',
    dialCode: '+91',
    flag: '🇮🇳',
    defaultLanguage: 'en',
    placeholder: '98765 43210',
    defaultCity: 'Bandra West, Mumbai',
    exchangeRateFromAED: 22.8,
  },
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    currency: 'SAR',
    symbol: 'SAR',
    symbolNative: 'ر.س',
    dialCode: '+966',
    flag: '🇸🇦',
    defaultLanguage: 'ar',
    placeholder: '50 123 4567',
    defaultCity: 'Olaya, Riyadh',
    exchangeRateFromAED: 1.02,
  },
  US: {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    currency: 'USD',
    symbol: '$',
    symbolNative: '$',
    dialCode: '+1',
    flag: '🇺🇸',
    defaultLanguage: 'en',
    placeholder: '(555) 000-0000',
    defaultCity: 'Downtown, Los Angeles',
    exchangeRateFromAED: 0.272,
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    symbolNative: '£',
    dialCode: '+44',
    flag: '🇬🇧',
    defaultLanguage: 'en',
    placeholder: '7911 123456',
    defaultCity: 'Mayfair, London',
    exchangeRateFromAED: 0.215,
  },
  QA: {
    code: 'QA',
    name: 'Qatar',
    nativeName: 'دولة قطر',
    currency: 'QAR',
    symbol: 'QAR',
    symbolNative: 'ر.ق',
    dialCode: '+974',
    flag: '🇶🇦',
    defaultLanguage: 'ar',
    placeholder: '3312 3456',
    defaultCity: 'West Bay, Doha',
    exchangeRateFromAED: 0.99,
  },
  KW: {
    code: 'KW',
    name: 'Kuwait',
    nativeName: 'دولة الكويت',
    currency: 'KWD',
    symbol: 'KWD',
    symbolNative: 'د.ك',
    dialCode: '+965',
    flag: '🇰🇼',
    defaultLanguage: 'ar',
    placeholder: '9123 4567',
    defaultCity: 'Salmiya, Kuwait City',
    exchangeRateFromAED: 0.083,
  },
  OM: {
    code: 'OM',
    name: 'Oman',
    nativeName: 'سلطنة عمان',
    currency: 'OMR',
    symbol: 'OMR',
    symbolNative: 'ر.ع',
    dialCode: '+968',
    flag: '🇴🇲',
    defaultLanguage: 'ar',
    placeholder: '9123 4567',
    defaultCity: 'Qurum, Muscat',
    exchangeRateFromAED: 0.105,
  },
  BH: {
    code: 'BH',
    name: 'Bahrain',
    nativeName: 'مملكة البحرين',
    currency: 'BHD',
    symbol: 'BHD',
    symbolNative: 'د.ب',
    dialCode: '+973',
    flag: '🇧🇭',
    defaultLanguage: 'ar',
    placeholder: '3600 1234',
    defaultCity: 'Seef, Manama',
    exchangeRateFromAED: 0.103,
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    currency: 'CAD',
    symbol: 'CA$',
    symbolNative: '$',
    dialCode: '+1',
    flag: '🇨🇦',
    defaultLanguage: 'en',
    placeholder: '(555) 000-0000',
    defaultCity: 'Downtown, Toronto',
    exchangeRateFromAED: 0.375,
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    nativeName: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    symbolNative: '$',
    dialCode: '+61',
    flag: '🇦🇺',
    defaultLanguage: 'en',
    placeholder: '412 345 678',
    defaultCity: 'CBD, Sydney',
    exchangeRateFromAED: 0.42,
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    nativeName: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    symbolNative: '$',
    dialCode: '+65',
    flag: '🇸🇬',
    defaultLanguage: 'en',
    placeholder: '9123 4567',
    defaultCity: 'Orchard Road, Singapore',
    exchangeRateFromAED: 0.365,
  },
  MY: {
    code: 'MY',
    name: 'Malaysia',
    nativeName: 'Malaysia',
    currency: 'MYR',
    symbol: 'RM',
    symbolNative: 'RM',
    dialCode: '+60',
    flag: '🇲🇾',
    defaultLanguage: 'en',
    placeholder: '12-345 6789',
    defaultCity: 'Bukit Bintang, Kuala Lumpur',
    exchangeRateFromAED: 1.22,
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    nativeName: 'مصر',
    currency: 'EGP',
    symbol: 'EGP',
    symbolNative: 'ج.م',
    dialCode: '+20',
    flag: '🇪🇬',
    defaultLanguage: 'ar',
    placeholder: '100 123 4567',
    defaultCity: 'Zamalek, Cairo',
    exchangeRateFromAED: 13.2,
  },
  PK: {
    code: 'PK',
    name: 'Pakistan',
    nativeName: 'پاکستان',
    currency: 'PKR',
    symbol: 'PKR',
    symbolNative: '₨',
    dialCode: '+92',
    flag: '🇵🇰',
    defaultLanguage: 'en',
    placeholder: '300 1234567',
    defaultCity: 'Gulberg, Lahore',
    exchangeRateFromAED: 76.5,
  },
  BD: {
    code: 'BD',
    name: 'Bangladesh',
    nativeName: 'বাংলাদেশ',
    currency: 'BDT',
    symbol: 'BDT',
    symbolNative: '৳',
    dialCode: '+880',
    flag: '🇧🇩',
    defaultLanguage: 'en',
    placeholder: '1712 345678',
    defaultCity: 'Gulshan, Dhaka',
    exchangeRateFromAED: 32.5,
  },
  PH: {
    code: 'PH',
    name: 'Philippines',
    nativeName: 'Pilipinas',
    currency: 'PHP',
    symbol: '₱',
    symbolNative: '₱',
    dialCode: '+63',
    flag: '🇵🇭',
    defaultLanguage: 'en',
    placeholder: '917 123 4567',
    defaultCity: 'BGC, Taguig, Manila',
    exchangeRateFromAED: 15.5,
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    nativeName: 'Deutschland',
    currency: 'EUR',
    symbol: '€',
    symbolNative: '€',
    dialCode: '+49',
    flag: '🇩🇪',
    defaultLanguage: 'de',
    placeholder: '151 23456789',
    defaultCity: 'Mitte, Berlin',
    exchangeRateFromAED: 0.252,
  },
  FR: {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    currency: 'EUR',
    symbol: '€',
    symbolNative: '€',
    dialCode: '+33',
    flag: '🇫🇷',
    defaultLanguage: 'fr',
    placeholder: '6 12 34 56 78',
    defaultCity: 'Le Marais, Paris',
    exchangeRateFromAED: 0.252,
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    nativeName: 'Italia',
    currency: 'EUR',
    symbol: '€',
    symbolNative: '€',
    dialCode: '+39',
    flag: '🇮🇹',
    defaultLanguage: 'en',
    placeholder: '312 345 6789',
    defaultCity: 'Brera, Milan',
    exchangeRateFromAED: 0.252,
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    nativeName: 'España',
    currency: 'EUR',
    symbol: '€',
    symbolNative: '€',
    dialCode: '+34',
    flag: '🇪🇸',
    defaultLanguage: 'es',
    placeholder: '612 34 56 78',
    defaultCity: 'Salamanca, Madrid',
    exchangeRateFromAED: 0.252,
  },
  TR: {
    code: 'TR',
    name: 'Turkey',
    nativeName: 'Türkiye',
    currency: 'TRY',
    symbol: '₺',
    symbolNative: '₺',
    dialCode: '+90',
    flag: '🇹🇷',
    defaultLanguage: 'en',
    placeholder: '532 123 4567',
    defaultCity: 'Nişantaşı, Istanbul',
    exchangeRateFromAED: 9.3,
  },
  JO: {
    code: 'JO',
    name: 'Jordan',
    nativeName: 'الأردن',
    currency: 'JOD',
    symbol: 'JOD',
    symbolNative: 'د.أ',
    dialCode: '+962',
    flag: '🇯🇴',
    defaultLanguage: 'ar',
    placeholder: '7 9012 3456',
    defaultCity: 'Abdoun, Amman',
    exchangeRateFromAED: 0.193,
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本',
    currency: 'JPY',
    symbol: '¥',
    symbolNative: '円',
    dialCode: '+81',
    flag: '🇯🇵',
    defaultLanguage: 'en',
    placeholder: '90-1234-5678',
    defaultCity: 'Ginza, Tokyo',
    exchangeRateFromAED: 41.5,
  },
};

export const ALL_COUNTRY_LOCALES: CountryLocaleData[] = Object.values(COUNTRY_LOCALE_REGISTRY);

export interface DetectedRegionResult {
  countryCode: string;
  languageCode: string;
  country: CountryLocaleData;
  rawLocale: string;
  source: 'intl_locale' | 'navigator' | 'timezone' | 'default';
  isAutoDetected: boolean;
}

export function detectDeviceRegion(): DetectedRegionResult {
  let rawLocale = 'en-AE';
  let extractedCountry = '';
  let extractedLanguage = 'en';
  let source: DetectedRegionResult['source'] = 'default';

  try {
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      const resolved = Intl.NumberFormat().resolvedOptions();
      if (resolved && resolved.locale) {
        rawLocale = resolved.locale;
        source = 'intl_locale';
      }
    }
  } catch (e) {
  }

  if (!rawLocale && typeof navigator !== 'undefined') {
    rawLocale = navigator.language || (navigator.languages && navigator.languages[0]) || 'en-AE';
    source = 'navigator';
  }

  const normalized = rawLocale.replace('_', '-');
  const parts = normalized.split('-');

  if (parts.length >= 2) {
    extractedLanguage = parts[0].toLowerCase();
    const candidate = parts[parts.length - 1].toUpperCase();
    if (candidate.length === 2 && COUNTRY_LOCALE_REGISTRY[candidate]) {
      extractedCountry = candidate;
    }
  } else if (parts.length === 1) {
    extractedLanguage = parts[0].toLowerCase();
  }

  if (!extractedCountry && typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes('Dubai') || tz.includes('Abu_Dhabi') || tz.includes('Muscat')) {
          extractedCountry = 'AE';
          source = 'timezone';
        } else if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) {
          extractedCountry = 'IN';
          source = 'timezone';
        } else if (tz.includes('Riyadh')) {
          extractedCountry = 'SA';
          source = 'timezone';
        } else if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) {
          extractedCountry = 'US';
          source = 'timezone';
        } else if (tz.includes('London')) {
          extractedCountry = 'GB';
          source = 'timezone';
        } else if (tz.includes('Qatar') || tz.includes('Doha')) {
          extractedCountry = 'QA';
          source = 'timezone';
        } else if (tz.includes('Kuwait')) {
          extractedCountry = 'KW';
          source = 'timezone';
        }
      }
    } catch (e) {
    }
  }

  if (!extractedCountry || !COUNTRY_LOCALE_REGISTRY[extractedCountry]) {
    extractedCountry = 'AE';
  }

  const matchedCountry = COUNTRY_LOCALE_REGISTRY[extractedCountry] || COUNTRY_LOCALE_REGISTRY.AE;

  return {
    countryCode: matchedCountry.code,
    languageCode: extractedLanguage || matchedCountry.defaultLanguage || 'en',
    country: matchedCountry,
    rawLocale,
    source,
    isAutoDetected: true,
  };
}

export function formatLocalizedPrice(
  amountInAED: number,
  country: CountryLocaleData,
  options?: {
    useNativeSymbol?: boolean;
    compact?: boolean;
  }
): string {
  const rate = country.exchangeRateFromAED || 1;
  const converted = amountInAED * rate;

  let finalValue: number;
  if (converted >= 500) {
    finalValue = Math.round(converted / 10) * 10;
  } else if (converted >= 50) {
    finalValue = Math.round(converted);
  } else if (converted < 10 && rate < 0.2) {
    finalValue = Math.round(converted * 10) / 10;
  } else {
    finalValue = Math.round(converted);
  }

  const symbol = options?.useNativeSymbol ? country.symbolNative : country.symbol;

  if (country.code === 'US' || country.code === 'GB' || country.code === 'IN' || country.code === 'CA' || country.code === 'AU' || country.code === 'PH' || country.code === 'JP') {
    return `${symbol}${finalValue.toLocaleString()}`;
  }

  if (country.code === 'DE' || country.code === 'FR' || country.code === 'IT' || country.code === 'ES') {
    return `${finalValue.toLocaleString()} ${symbol}`;
  }

  if (options?.useNativeSymbol && (country.code === 'AE' || country.code === 'SA' || country.code === 'QA' || country.code === 'KW' || country.code === 'EG')) {
    return `${finalValue.toLocaleString()} ${symbol}`;
  }

  return `${symbol} ${finalValue.toLocaleString()}`;
}

export type SupportedLanguage = 'en' | 'ar' | 'hi' | 'fr' | 'es' | 'de';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.bookings': 'Bookings',
    'nav.saved': 'Saved',
    'nav.profile': 'Profile',
    'nav.discover': 'Discover',
    'hero.search_placeholder': 'Search salons, master stylists, haircut, spa...',
    'badge.open_now': 'Open now',
    'badge.closed': 'Closed',
    'badge.closing_soon': 'Closing Soon',
    'badge.verified': 'Verified Salon',
    'card.starting_from': 'Starting from',
    'card.book_now': 'Book',
    'card.details': 'Details',
    'card.reviews': 'reviews',
    'section.nearby_salons': 'Nearby Salons & Studios',
    'section.top_services': 'Popular Services',
    'section.featured_stylists': 'Top Rated Stylists',
    'booking.title': 'Book Appointment',
    'booking.select_service': 'Select Service',
    'booking.select_stylist': 'Select Stylist',
    'booking.date_time': 'Date & Time',
    'booking.confirm': 'Confirm Booking',
    'booking.success': 'Booking Confirmed!',
    'booking.subtotal': 'Subtotal',
    'booking.vat_tax': 'Taxes & Fees',
    'booking.total': 'Total',
    'booking.pay_at_salon': 'Pay at Salon (Cash / Card)',
    'booking.pay_now': 'Pay with Card / Apple Pay',
    'locale.device_detected': 'Auto-detected from Device',
    'locale.zero_permission': 'Zero permission popup • Instant OS locale match',
    'locale.region': 'Region',
    'locale.currency': 'Currency',
    'locale.dial_code': 'Dial Code',
    'locale.language': 'Language',
    'locale.auto_sync': 'Device Auto-Sync',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.bookings': 'الحجوزات',
    'nav.saved': 'المفضلة',
    'nav.profile': 'الملف الشخصي',
    'nav.discover': 'استكشاف',
    'hero.search_placeholder': 'ابحث عن صالونات، حلاقة، عناية، مساج...',
    'badge.open_now': 'مفتوح الآن',
    'badge.closed': 'مغلق',
    'badge.closing_soon': 'يغلق قريباً',
    'badge.verified': 'صالون موثق',
    'card.starting_from': 'يبدأ من',
    'card.book_now': 'احجز',
    'card.details': 'تفاصيل',
    'card.reviews': 'تقييم',
    'section.nearby_salons': 'الصالونات القريبة منك',
    'section.top_services': 'أبرز الخدمات',
    'section.featured_stylists': 'أفضل مصففي الشعر',
    'booking.title': 'حجز موعد',
    'booking.select_service': 'اختر الخدمة',
    'booking.select_stylist': 'اختر المصفف',
    'booking.date_time': 'التاريخ والوقت',
    'booking.confirm': 'تأكيد الحجز',
    'booking.success': 'تم تأكيد الحجز بنجاح!',
    'booking.subtotal': 'المجموع الفرعي',
    'booking.vat_tax': 'الضرائب والرسوم',
    'booking.total': 'الإجمالي',
    'booking.pay_at_salon': 'الدفع في الصالون (نقداً أو بطاقة)',
    'booking.pay_now': 'الدفع بالبطاقة / Apple Pay',
    'locale.device_detected': 'تم الكشف تلقائياً من إعدادات الهاتف',
    'locale.zero_permission': 'بدون أذونات • مطابقة فورية لإعدادات الجهاز',
    'locale.region': 'المنطقة',
    'locale.currency': 'العملة',
    'locale.dial_code': 'رمز الاتصال',
    'locale.language': 'اللغة',
    'locale.auto_sync': 'المزامنة التلقائية مع الهاتف',
  },
  hi: {
    'nav.home': 'होम',
    'nav.bookings': 'बुकिंग्स',
    'nav.saved': 'सेव किए गए',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.discover': 'खोजें',
    'hero.search_placeholder': 'सैलून, हेयरकट, स्पा, स्टाइल खोजें...',
    'badge.open_now': 'अभी खुला है',
    'badge.closed': 'बंद है',
    'badge.closing_soon': 'जल्द बंद होगा',
    'badge.verified': 'वेरिफाइड सैलून',
    'card.starting_from': 'शुरुआती कीमत',
    'card.book_now': 'बुक करें',
    'card.details': 'विवरण',
    'card.reviews': 'रिव्यू',
    'section.nearby_salons': 'नज़दीकी सैलून',
    'section.top_services': 'लोकप्रिय सेवाएं',
    'section.featured_stylists': 'टॉप रेटेड हेयर स्टाइलिस्ट',
    'booking.title': 'अपॉइंटमेंट बुक करें',
    'booking.select_service': 'सेवा चुनें',
    'booking.select_stylist': 'स्टाइलिस्ट चुनें',
    'booking.date_time': 'तारीख और समय',
    'booking.confirm': 'बुकिंग कन्फर्म करें',
    'booking.success': 'बुकिंग सफलतापूर्वक हो गई!',
    'booking.subtotal': 'सबटोटल',
    'booking.vat_tax': 'टैक्स व शुल्क',
    'booking.total': 'कुल राशि',
    'booking.pay_at_salon': 'सैलून में भुगतान करें',
    'booking.pay_now': 'कार्ड / यूपीआई द्वारा भुगतान',
    'locale.device_detected': 'डिवाइस से ऑटो-डिटेक्टेड',
    'locale.zero_permission': 'बिना जीपीएस अनुमति • तुरंत डिवाइस रीजन मैच',
    'locale.region': 'क्षेत्र / देश',
    'locale.currency': 'मुद्रा (करेंसी)',
    'locale.dial_code': 'कॉलिंग कोड',
    'locale.language': 'भाषा',
    'locale.auto_sync': 'डिवाइस ऑटो-सिंक',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.bookings': 'Réservations',
    'nav.saved': 'Favoris',
    'nav.profile': 'Profil',
    'nav.discover': 'Découvrir',
    'hero.search_placeholder': 'Rechercher salons, coiffure, spa...',
    'badge.open_now': 'Ouvert',
    'badge.closed': 'Fermé',
    'badge.closing_soon': 'Ferme bientôt',
    'badge.verified': 'Salon Vérifié',
    'card.starting_from': 'À partir de',
    'card.book_now': 'Réserver',
    'card.details': 'Détails',
    'card.reviews': 'avis',
    'section.nearby_salons': 'Salons à Proximité',
    'section.top_services': 'Prestations Populaires',
    'section.featured_stylists': 'Meilleurs Stylistes',
    'booking.title': 'Prendre Rendez-vous',
    'booking.select_service': 'Choisir un service',
    'booking.select_stylist': 'Choisir un coiffeur',
    'booking.date_time': 'Date & Heure',
    'booking.confirm': 'Confirmer la réservation',
    'booking.success': 'Réservation Confirmée !',
    'booking.subtotal': 'Sous-total',
    'booking.vat_tax': 'TVA et taxes',
    'booking.total': 'Total',
    'booking.pay_at_salon': 'Payer au salon',
    'booking.pay_now': 'Payer par carte',
    'locale.device_detected': 'Détecté depuis votre appareil',
    'locale.zero_permission': 'Aucune autorisation GPS nécessaire',
    'locale.region': 'Région',
    'locale.currency': 'Devise',
    'locale.dial_code': 'Indicatif',
    'locale.language': 'Langue',
    'locale.auto_sync': 'Synchronisation automatique',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.bookings': 'Citas',
    'nav.saved': 'Guardados',
    'nav.profile': 'Perfil',
    'nav.discover': 'Descubrir',
    'hero.search_placeholder': 'Buscar salones, cortes, barbería, spa...',
    'badge.open_now': 'Abierto',
    'badge.closed': 'Cerrado',
    'badge.closing_soon': 'Cierra pronto',
    'badge.verified': 'Salón Verificado',
    'card.starting_from': 'Desde',
    'card.book_now': 'Reservar',
    'card.details': 'Detalles',
    'card.reviews': 'reseñas',
    'section.nearby_salons': 'Salones Cercanos',
    'section.top_services': 'Servicios Populares',
    'section.featured_stylists': 'Estilistas Destacados',
    'booking.title': 'Reservar Cita',
    'booking.select_service': 'Seleccionar Servicio',
    'booking.select_stylist': 'Seleccionar Estilista',
    'booking.date_time': 'Fecha y Hora',
    'booking.confirm': 'Confirmar Reserva',
    'booking.success': '¡Reserva Confirmada!',
    'booking.subtotal': 'Subtotal',
    'booking.vat_tax': 'Impuestos y tasas',
    'booking.total': 'Total',
    'booking.pay_at_salon': 'Pagar en el salón',
    'booking.pay_now': 'Pagar con tarjeta',
    'locale.device_detected': 'Detectado desde el dispositivo',
    'locale.zero_permission': 'Sin permisos GPS • Detección instantánea',
    'locale.region': 'Región',
    'locale.currency': 'Moneda',
    'locale.dial_code': 'Código de país',
    'locale.language': 'Idioma',
    'locale.auto_sync': 'Sincronización automática',
  },
  de: {
    'nav.home': 'Start',
    'nav.bookings': 'Termine',
    'nav.saved': 'Gespeichert',
    'nav.profile': 'Profil',
    'nav.discover': 'Entdecken',
    'hero.search_placeholder': 'Salons, Haarschnitt, Bartpflege suchen...',
    'badge.open_now': 'Geöffnet',
    'badge.closed': 'Geschlossen',
    'badge.closing_soon': 'Schließt bald',
    'badge.verified': 'Verifizierter Salon',
    'card.starting_from': 'Ab',
    'card.book_now': 'Buchen',
    'card.details': 'Details',
    'card.reviews': 'Bewertungen',
    'section.nearby_salons': 'Salons in der Nähe',
    'section.top_services': 'Beliebte Angebote',
    'section.featured_stylists': 'Top Stylisten',
    'booking.title': 'Termin Buchen',
    'booking.select_service': 'Service wählen',
    'booking.select_stylist': 'Stylist wählen',
    'booking.date_time': 'Datum & Uhrzeit',
    'booking.confirm': 'Buchung bestätigen',
    'booking.success': 'Buchung bestätigt!',
    'booking.subtotal': 'Zwischensumme',
    'booking.vat_tax': 'MwSt. & Gebühren',
    'booking.total': 'Gesamtbetrag',
    'booking.pay_at_salon': 'Im Salon bezahlen',
    'booking.pay_now': 'Online bezahlen',
    'locale.device_detected': 'Vom Gerät automatisch erkannt',
    'locale.zero_permission': 'Keine GPS-Berechtigung erforderlich',
    'locale.region': 'Region',
    'locale.currency': 'Währung',
    'locale.dial_code': 'Vorwahl',
    'locale.language': 'Sprache',
    'locale.auto_sync': 'Automatische Synchronisierung',
  },
};
