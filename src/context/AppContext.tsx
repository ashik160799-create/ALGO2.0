import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  CustomerUser,
  BusinessUser,
  Salon,
  ServiceItem,
  StaffMember,
  Appointment,
  Review,
  NotificationItem,
  AppointmentStatus,
  ColorThemeId,
  ColorThemeMode,
  ThemeConfig,
} from '../types';
import { THEME_PRESETS } from '../utils/themeConfig';
import { getRecommendedAiBanner } from '../utils/aiBannerGenerator';
import {
  CountryLocaleData,
  COUNTRY_LOCALE_REGISTRY,
  DetectedRegionResult,
  detectDeviceRegion,
  formatLocalizedPrice,
  SupportedLanguage,
  TRANSLATIONS,
} from '../utils/localeConfig';
import {
  INITIAL_CUSTOMER,
  INITIAL_BUSINESS_USER,
  INITIAL_SALONS,
  INITIAL_SERVICES,
  INITIAL_STAFF,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  activeColorTheme: ColorThemeId;
  setActiveColorTheme: (themeId: ColorThemeId) => void;
  colorThemeMode: ColorThemeMode;
  setColorThemeMode: (mode: ColorThemeMode) => void;
  toggleColorThemeMode: () => void;
  currentThemeConfig: ThemeConfig;

  activeCountry: CountryLocaleData;
  activeCountryCode: string;
  setActiveCountryCode: (code: string) => void;
  activeLanguage: SupportedLanguage;
  setActiveLanguage: (lang: SupportedLanguage) => void;
  isAutoRegionEnabled: boolean;
  setIsAutoRegionEnabled: (enabled: boolean) => void;
  detectedLocaleInfo: DetectedRegionResult;
  resetToDeviceLocale: () => void;
  formatPrice: (amountInAED: number, options?: { useNativeSymbol?: boolean; compact?: boolean }) => string;
  t: (key: string, fallback?: string) => string;
  currencySymbol: string;
  dialCode: string;
  isLocaleModalOpen: boolean;
  setIsLocaleModalOpen: (open: boolean) => void;

  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;

  customerUser: CustomerUser;
  businessUser: BusinessUser;
  loginAsCustomer: (user: Partial<CustomerUser>) => void;
  loginAsBusiness: (user: Partial<BusinessUser>, salonId?: string) => void;
  logoutCustomer: () => void;
  logoutBusiness: () => void;

  salons: Salon[];
  selectedSalon: Salon | null;
  setSelectedSalon: (salon: Salon | null) => void;
  updateSalonProfile: (salonId: string, updates: Partial<Salon>) => void;
  toggleFavoriteSalon: (salonId: string) => void;

  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (serviceId: string, updates: Partial<ServiceItem>) => void;
  deleteService: (serviceId: string) => void;

  staffMembers: StaffMember[];
  addStaffMember: (staff: Omit<StaffMember, 'id'>) => void;
  updateStaffMember: (staffId: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (staffId: string) => void;

  appointments: Appointment[];
  createAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>, initialStatus?: AppointmentStatus) => string;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  acceptAppointment: (appointmentId: string) => void;
  suggestNewAppointmentTime: (appointmentId: string, newDate: string, newTimeSlot: string, note?: string) => void;
  declineAppointment: (appointmentId: string, reason: string, apology?: string) => void;
  customerAcceptSuggestedTime: (appointmentId: string) => void;
  customerDeclineSuggestedTime: (appointmentId: string, note?: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  isCustomerVip: (customerIdOrName: string, salonId?: string) => boolean;
  getCustomerCompletedCount: (customerIdOrName: string, salonId?: string) => number;

  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  replyToReview: (reviewId: string, replyMessage: string) => void;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: (role: Role) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  activeCustomerTab: 'discover' | 'bookings' | 'saved' | 'profile';
  setActiveCustomerTab: (tab: 'discover' | 'bookings' | 'saved' | 'profile') => void;

  activeBusinessTab: 'overview' | 'calendar' | 'services' | 'staff' | 'hours' | 'reviews' | 'profile' | 'reports' | 'settings' | 'customers';
  setActiveBusinessTab: (tab: 'overview' | 'calendar' | 'services' | 'staff' | 'hours' | 'reviews' | 'profile' | 'reports' | 'settings' | 'customers') => void;

  bookingModalOpen: boolean;
  setBookingModalOpen: (open: boolean) => void;
  preselectedSalon: Salon | null;
  setPreselectedSalon: (salon: Salon | null) => void;
  preselectedService: ServiceItem | null;
  setPreselectedService: (service: ServiceItem | null) => void;
  preselectedStaff: StaffMember | null;
  setPreselectedStaff: (staff: StaffMember | null) => void;

  userLocation: string;
  setUserLocation: (loc: string) => void;
  locationPermissionGranted: boolean | null;
  setLocationPermissionGranted: (granted: boolean | null) => void;
  requestLocationPermission: () => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const detectedLocaleInfo = React.useMemo(() => detectDeviceRegion(), []);

  const [isAutoRegionEnabled, setIsAutoRegionEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('algosalon_auto_region');
    return saved !== null ? saved === 'true' : true;
  });

  const [activeCountryCode, setActiveCountryCodeState] = useState<string>(() => {
    const saved = localStorage.getItem('algosalon_country_code');
    if (saved && COUNTRY_LOCALE_REGISTRY[saved]) {
      return saved;
    }
    return detectedLocaleInfo.countryCode || 'AE';
  });

  const [activeLanguage, setActiveLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('algosalon_app_language') as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    return (detectedLocaleInfo.languageCode as SupportedLanguage) || 'en';
  });

  const [isLocaleModalOpen, setIsLocaleModalOpen] = useState(false);

  const activeCountry = COUNTRY_LOCALE_REGISTRY[activeCountryCode] || COUNTRY_LOCALE_REGISTRY.AE;

  const setActiveCountryCode = (code: string) => {
    if (COUNTRY_LOCALE_REGISTRY[code]) {
      setActiveCountryCodeState(code);
      localStorage.setItem('algosalon_country_code', code);
    }
  };

  const setActiveLanguage = (lang: SupportedLanguage) => {
    if (TRANSLATIONS[lang]) {
      setActiveLanguageState(lang);
      localStorage.setItem('algosalon_app_language', lang);
    }
  };

  const resetToDeviceLocale = () => {
    const detected = detectDeviceRegion();
    setActiveCountryCodeState(detected.countryCode);
    setActiveLanguageState(detected.languageCode as SupportedLanguage || 'en');
    setIsAutoRegionEnabled(true);
    localStorage.setItem('algosalon_country_code', detected.countryCode);
    localStorage.setItem('algosalon_app_language', detected.languageCode || 'en');
    localStorage.setItem('algosalon_auto_region', 'true');
  };

  useEffect(() => {
    const isArabic = activeLanguage === 'ar';
    document.documentElement.setAttribute('lang', activeLanguage);
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  }, [activeLanguage]);

  useEffect(() => {
    localStorage.setItem('algosalon_auto_region', String(isAutoRegionEnabled));
  }, [isAutoRegionEnabled]);

  const formatPrice = (
    amountInAED: number,
    options?: { useNativeSymbol?: boolean; compact?: boolean }
  ): string => {
    return formatLocalizedPrice(amountInAED, activeCountry, options);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[activeLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || fallback || key;
  };

  const [activeColorTheme, setActiveColorTheme] = useState<ColorThemeId>(() => {
    const saved = localStorage.getItem('algosalon_color_theme');
    return (saved as ColorThemeId) || 'emerald';
  });

  const [colorThemeMode, setColorThemeMode] = useState<ColorThemeMode>(() => {
    const saved = localStorage.getItem('algosalon_theme_mode');
    return (saved as ColorThemeMode) || 'light';
  });

  const toggleColorThemeMode = () => {
    setColorThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentThemeConfig = THEME_PRESETS[activeColorTheme] || THEME_PRESETS.monochrome;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeColorTheme);
    localStorage.setItem('algosalon_color_theme', activeColorTheme);
  }, [activeColorTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', colorThemeMode);
    if (colorThemeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('algosalon_theme_mode', colorThemeMode);
  }, [colorThemeMode]);

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    const saved = localStorage.getItem('algosalon_seen_splash');
    return !saved;
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('algosalon_role') as Role) || 'customer';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [customerUser, setCustomerUser] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('algosalon_customer');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [businessUser, setBusinessUser] = useState<BusinessUser>(() => {
    const saved = localStorage.getItem('algosalon_business_user');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_USER;
  });

  const [salons, setSalons] = useState<Salon[]>(() => {
    const saved = localStorage.getItem('algosalon_salons');
    return saved ? JSON.parse(saved) : INITIAL_SALONS;
  });

  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('algosalon_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('algosalon_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('algosalon_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('algosalon_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('algosalon_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCustomerTab, setActiveCustomerTab] = useState<'discover' | 'bookings' | 'saved' | 'profile'>('discover');
  const [activeBusinessTab, setActiveBusinessTab] = useState<
    'overview' | 'calendar' | 'services' | 'staff' | 'hours' | 'reviews' | 'profile' | 'reports' | 'settings' | 'customers'
  >('overview');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedSalon, setPreselectedSalon] = useState<Salon | null>(null);
  const [preselectedService, setPreselectedService] = useState<ServiceItem | null>(null);
  const [preselectedStaff, setPreselectedStaff] = useState<StaffMember | null>(null);

  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem('algosalon_user_location') || 'Dubai Marina, UAE';
  });

  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean | null>(() => {
    const saved = localStorage.getItem('algosalon_location_permission');
    return saved !== null ? saved === 'true' : null;
  });

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setLocationPermissionGranted(false);
      localStorage.setItem('algosalon_location_permission', 'false');
      return false;
    }

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocationPermissionGranted(true);
          localStorage.setItem('algosalon_location_permission', 'true');
          const mockLoc = 'Dubai Marina, UAE';
          setUserLocation(mockLoc);
          localStorage.setItem('algosalon_user_location', mockLoc);
          resolve(true);
        },
        error => {
          setLocationPermissionGranted(false);
          localStorage.setItem('algosalon_location_permission', 'false');
          resolve(false);
        },
        { timeout: 8000 }
      );
    });
  };

  const loginAsCustomer = (userUpdates: Partial<CustomerUser>) => {
    setCustomerUser(prev => {
      const updated = { ...prev, ...userUpdates };
      localStorage.setItem('algosalon_customer', JSON.stringify(updated));
      return updated;
    });
    setCurrentRole('customer');
    localStorage.setItem('algosalon_role', 'customer');
  };

  const loginAsBusiness = (userUpdates: Partial<BusinessUser>, salonId?: string) => {
    setBusinessUser(prev => {
      const updated = {
        ...prev,
        ...userUpdates,
        salonId: salonId || userUpdates.salonId || prev.salonId || 'salon-1',
      };
      localStorage.setItem('algosalon_business_user', JSON.stringify(updated));
      return updated;
    });
    setCurrentRole('business');
    localStorage.setItem('algosalon_role', 'business');
  };

  const logoutCustomer = () => {
    setCurrentRole('customer');
    setAuthModalOpen(true);
    setAuthMode('login');
  };

  const logoutBusiness = () => {
    setCurrentRole('customer');
    setAuthModalOpen(true);
    setAuthMode('login');
  };

  const updateSalonProfile = (salonId: string, updates: Partial<Salon>) => {
    setSalons(prev => {
      const updated = prev.map(s => (s.id === salonId ? { ...s, ...updates } : s));
      localStorage.setItem('algosalon_salons', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavoriteSalon = (salonId: string) => {
    setCustomerUser(prev => {
      const isSaved = prev.savedSalonIds.includes(salonId);
      const newSaved = isSaved
        ? prev.savedSalonIds.filter(id => id !== salonId)
        : [...prev.savedSalonIds, salonId];
      const updated = { ...prev, savedSalonIds: newSaved };
      localStorage.setItem('algosalon_customer', JSON.stringify(updated));
      return updated;
    });
  };

  const addService = (service: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => {
      const updated = [newService, ...prev];
      localStorage.setItem('algosalon_services', JSON.stringify(updated));
      return updated;
    });
  };

  const updateService = (serviceId: string, updates: Partial<ServiceItem>) => {
    setServices(prev => {
      const updated = prev.map(s => (s.id === serviceId ? { ...s, ...updates } : s));
      localStorage.setItem('algosalon_services', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== serviceId);
      localStorage.setItem('algosalon_services', JSON.stringify(updated));
      return updated;
    });
  };

  const addStaffMember = (staff: Omit<StaffMember, 'id'>) => {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
    };
    setStaffMembers(prev => {
      const updated = [newStaff, ...prev];
      localStorage.setItem('algosalon_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const updateStaffMember = (staffId: string, updates: Partial<StaffMember>) => {
    setStaffMembers(prev => {
      const updated = prev.map(s => (s.id === staffId ? { ...s, ...updates } : s));
      localStorage.setItem('algosalon_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteStaffMember = (staffId: string) => {
    setStaffMembers(prev => {
      const updated = prev.filter(s => s.id !== staffId);
      localStorage.setItem('algosalon_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const createAppointment = (
    data: Omit<Appointment, 'id' | 'createdAt' | 'status'>,
    initialStatus: AppointmentStatus = 'confirmed'
  ): string => {
    const newId = `apt-${Date.now()}`;
    const newAppointment: Appointment = {
      ...data,
      id: newId,
      status: initialStatus,
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => {
      const updated = [newAppointment, ...prev];
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });

    return newId;
  };

  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments(prev => {
      const updated = prev.map(a => (a.id === appointmentId ? { ...a, status } : a));
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const acceptAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'confirmed');
  };

  const suggestNewAppointmentTime = (
    appointmentId: string,
    newDate: string,
    newTimeSlot: string,
    note?: string
  ) => {
    setAppointments(prev => {
      const updated = prev.map(a =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'rescheduled_by_business' as AppointmentStatus,
              suggestedDate: newDate,
              suggestedTimeSlot: newTimeSlot,
              suggestedNote: note,
            }
          : a
      );
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const declineAppointment = (appointmentId: string, reason: string, apology?: string) => {
    setAppointments(prev => {
      const updated = prev.map(a =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'cancelled' as AppointmentStatus,
              declineReason: reason,
              declineApology: apology,
            }
          : a
      );
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const customerAcceptSuggestedTime = (appointmentId: string) => {
    setAppointments(prev => {
      const updated = prev.map(a => {
        if (a.id === appointmentId) {
          return {
            ...a,
            date: a.suggestedDate || a.date,
            timeSlot: a.suggestedTimeSlot || a.timeSlot,
            status: 'confirmed' as AppointmentStatus,
            suggestedDate: undefined,
            suggestedTimeSlot: undefined,
            suggestedNote: undefined,
          };
        }
        return a;
      });
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const customerDeclineSuggestedTime = (appointmentId: string, note?: string) => {
    setAppointments(prev => {
      const updated = prev.map(a =>
        a.id === appointmentId
          ? {
              ...a,
              status: 'cancelled' as AppointmentStatus,
              declineReason: note || 'Customer declined suggested rescheduled time',
            }
          : a
      );
      localStorage.setItem('algosalon_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const cancelAppointment = (appointmentId: string) => {
    updateAppointmentStatus(appointmentId, 'cancelled');
  };

  const getCustomerCompletedCount = (customerIdOrName: string, salonId?: string): number => {
    return appointments.filter(
      a =>
        (a.customerId === customerIdOrName || a.customerName === customerIdOrName) &&
        (!salonId || a.salonId === salonId) &&
        a.status === 'completed'
    ).length;
  };

  const isCustomerVip = (customerIdOrName: string, salonId?: string): boolean => {
    const completedCount = getCustomerCompletedCount(customerIdOrName, salonId);
    return completedCount >= 5;
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => {
      const updated = [newRev, ...prev];
      localStorage.setItem('algosalon_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const replyToReview = (reviewId: string, replyMessage: string) => {
    setReviews(prev => {
      const updated = prev.map(r => (r.id === reviewId ? { ...r, reply: replyMessage } : r));
      localStorage.setItem('algosalon_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem('algosalon_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllNotifications = (role: Role) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.userType !== role);
      localStorage.setItem('algosalon_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeColorTheme,
        setActiveColorTheme,
        colorThemeMode,
        setColorThemeMode,
        toggleColorThemeMode,
        currentThemeConfig,

        activeCountry,
        activeCountryCode,
        setActiveCountryCode,
        activeLanguage,
        setActiveLanguage,
        isAutoRegionEnabled,
        setIsAutoRegionEnabled,
        detectedLocaleInfo,
        resetToDeviceLocale,
        formatPrice,
        t,
        currencySymbol: activeCountry.currencySymbol,
        dialCode: activeCountry.dialCode,
        isLocaleModalOpen,
        setIsLocaleModalOpen,

        currentRole,
        setCurrentRole,
        showSplash,
        setShowSplash,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,

        customerUser,
        businessUser,
        loginAsCustomer,
        loginAsBusiness,
        logoutCustomer,
        logoutBusiness,

        salons,
        selectedSalon,
        setSelectedSalon,
        updateSalonProfile,
        toggleFavoriteSalon,

        services,
        addService,
        updateService,
        deleteService,

        staffMembers,
        addStaffMember,
        updateStaffMember,
        deleteStaffMember,

        appointments,
        createAppointment,
        updateAppointmentStatus,
        acceptAppointment,
        suggestNewAppointmentTime,
        declineAppointment,
        customerAcceptSuggestedTime,
        customerDeclineSuggestedTime,
        cancelAppointment,
        isCustomerVip,
        getCustomerCompletedCount,

        reviews,
        addReview,
        replyToReview,

        notifications,
        markNotificationRead,
        clearAllNotifications,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeCustomerTab,
        setActiveCustomerTab,

        activeBusinessTab,
        setActiveBusinessTab,

        bookingModalOpen,
        setBookingModalOpen,
        preselectedSalon,
        setPreselectedSalon,
        preselectedService,
        setPreselectedService,
        preselectedStaff,
        setPreselectedStaff,

        userLocation,
        setUserLocation,
        locationPermissionGranted,
        setLocationPermissionGranted,
        requestLocationPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
