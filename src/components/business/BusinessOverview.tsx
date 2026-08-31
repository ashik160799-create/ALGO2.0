import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffAvatar } from '../common/StaffAvatar';
import {
  Store,
  MapPin,
  Settings,
  ShieldCheck,
  DollarSign,
  Users,
  Scissors,
  Calendar,
  Box,
  CreditCard,
  BarChart3,
  Power,
  CheckCircle2,
  X,
  Upload,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const BusinessOverview: React.FC = () => {
  const {
    businessUser,
    salons,
    services,
    staffMembers,
    appointments,
    updateSalonProfile,
    setActiveBusinessTab,
    currentThemeConfig,
    colorThemeMode,
    activeCountry,
  } = useApp();

  const isLight = colorThemeMode === 'light';

  const salon = salons.find(s => s.id === businessUser.salonId) || salons[0];
  const salonAppointments = appointments.filter(a => a.salonId === salon.id);
  const salonServices = services.filter(s => s.salonId === salon.id);
  const salonStaff = staffMembers.filter(s => s.salonId === salon.id);

  const [selectedCurrency, setSelectedCurrency] = useState<string>(activeCountry.currency);

  React.useEffect(() => {
    setSelectedCurrency(activeCountry.currency);
  }, [activeCountry.currency]);

  const [isAcceptingOnline, setIsAcceptingOnline] = useState<boolean>(salon.isOpenNow ?? true);

  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'submitted' | 'verified'>('pending');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const totalRevenue = useMemo(() => {
    return salonAppointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((acc, curr) => acc + curr.servicePrice, 0);
  }, [salonAppointments]);

  const uniqueCustomersList = useMemo(() => {
    const map = new Map<string, { name: string; email?: string; phone?: string; totalSpent: number; bookingsCount: number; lastDate: string }>();
    salonAppointments.forEach(apt => {
      const existing = map.get(apt.customerName) || {
        name: apt.customerName,
        totalSpent: 0,
        bookingsCount: 0,
        lastDate: apt.date,
      };
      existing.totalSpent += apt.servicePrice;
      existing.bookingsCount += 1;
      existing.lastDate = apt.date;
      map.set(apt.customerName, existing);
    });
    return Array.from(map.values());
  }, [salonAppointments]);

  const [inventoryItems] = useState([
    { id: '1', sku: 'SKU-OIL-01', name: 'Argan Beard & Scalp Oil 50ml', stock: 18, price: 65, category: 'Hair Care' },
    { id: '2', sku: 'SKU-POM-02', name: 'Matte Clay High Hold Pomade', stock: 24, price: 45, category: 'Styling' },
    { id: '3', sku: 'SKU-SHP-03', name: 'Keratin Nourish Shampoo 250ml', stock: 12, price: 80, category: 'Care' },
    { id: '4', sku: 'SKU-BLD-04', name: 'Japanese Barber Razor Blades 100pk', stock: 8, price: 110, category: 'Equipment' },
  ]);

  const handleToggleOnlineStatus = () => {
    const newState = !isAcceptingOnline;
    setIsAcceptingOnline(newState);
    updateSalonProfile(salon.id, { isOpenNow: newState });
  };

  const handleUploadDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setVerificationStatus('submitted');
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-all ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
            }`}
            style={{
              borderColor: `${currentThemeConfig.primaryHex}40`,
            }}
          >
            <Store className="w-5 h-5 shrink-0" style={{ color: currentThemeConfig.primaryHex }} />
          </div>

          <div className="min-w-0">
            <h1 className={`text-lg sm:text-xl font-black leading-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {businessUser.name || 'Marcus Vance'}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isAcceptingOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className={`text-xs font-medium truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Shop {isAcceptingOnline ? 'Online • Accepting' : 'Offline • Paused'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="shop-power-toggle-btn"
            type="button"
            onClick={handleToggleOnlineStatus}
            title={isAcceptingOnline ? 'Switch Shop Offline' : 'Switch Shop Online'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
              isAcceptingOnline
                ? isLight
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                : isLight
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                : 'bg-rose-950/70 border-rose-500/40 text-rose-400 hover:bg-rose-900'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span className="hidden xs:inline font-semibold">{isAcceptingOnline ? 'Accepting' : 'Paused'}</span>
          </button>
        </div>
      </div>

      <div
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs transition-colors ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/90 border-slate-800/90'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <MapPin className="w-4 h-4 shrink-0" style={{ color: currentThemeConfig.primaryHex }} />
          <span className={`truncate font-medium text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {salon.address || '420 Grand Avenue, Suite 102'}, {salon.city || 'Metro Hub'}
          </span>
        </div>

        <button
          id="quick-shop-settings-btn"
          type="button"
          onClick={() => setActiveBusinessTab('profile')}
          className={`flex items-center gap-1.5 text-xs font-bold hover:underline shrink-0 whitespace-nowrap`}
          style={{ color: currentThemeConfig.primaryHex }}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Shop Settings</span>
        </button>
      </div>

      <div className="pt-2">
        <h2 className={`text-xs font-extrabold uppercase tracking-widest ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
          BUSINESS MANAGEMENT HUB
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <button
          id="hub-card-customers"
          type="button"
          onClick={() => setActiveBusinessTab('customers')}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group relative ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          {salonAppointments.filter(a => a.status === 'pending').length > 0 && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-sm animate-pulse">
              {salonAppointments.filter(a => a.status === 'pending').length} Pending
            </span>
          )}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <Users className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Customers
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {uniqueCustomersList.length} Customers • Pending Decisions & VIP
          </p>
        </button>

        <button
          id="hub-card-services"
          type="button"
          onClick={() => setActiveBusinessTab('services')}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <Scissors className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Services
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {salonServices.length} Services
          </p>
        </button>

        <button
          id="hub-card-staff"
          type="button"
          onClick={() => setActiveBusinessTab('staff')}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <Users className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Staff
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {salonStaff.length} Stylists
          </p>
        </button>

        <button
          id="hub-card-appointments"
          type="button"
          onClick={() => setActiveBusinessTab('calendar')}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Appointments
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {salonAppointments.length} Bookings
          </p>
        </button>

        <button
          id="hub-card-inventory"
          type="button"
          onClick={() => setShowInventoryModal(true)}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <Box className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Inventory
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {inventoryItems.length} SKUs
          </p>
        </button>

        <button
          id="hub-card-payroll"
          type="button"
          onClick={() => setShowPayrollModal(true)}
          className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
            style={{
              backgroundColor: `${currentThemeConfig.primaryHex}15`,
              color: currentThemeConfig.primaryHex,
            }}
          >
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Staff Payroll
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {salonStaff.length} Active Records
          </p>
        </button>

        <button
          id="hub-card-reports"
          type="button"
          onClick={() => setActiveBusinessTab('reports')}
          className={`col-span-2 sm:col-span-2 p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] group ${
            isLight
              ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
              style={{
                backgroundColor: `${currentThemeConfig.primaryHex}15`,
                color: currentThemeConfig.primaryHex,
              }}
            >
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <h3 className={`text-sm font-black leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Financial & Tax Reports
          </h3>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {selectedCurrency} {totalRevenue.toLocaleString()} Revenue • Tax Invoices & P&L
          </p>
        </button>
      </div>

      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Business License Verification
              </h3>
              <button onClick={() => setShowDocsModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <p className={isLight ? 'text-slate-600' : 'text-slate-300'}>
                Upload your registered trade license or national business tax registration to earn verified status on ALGO.
              </p>

              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="font-bold text-slate-700 dark:text-slate-200">Click to upload license (PDF / PNG)</span>
                <span className="text-[10px] text-slate-400 mt-1">Maximum file size 10MB</span>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUploadDocument} className="hidden" />
              </label>

              {uploadedFileName && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-semibold truncate">{uploadedFileName}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDocsModal(false)}
                className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow"
                style={{ backgroundColor: currentThemeConfig.primaryHex }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
