import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Scissors,
  Download,
  ShieldCheck,
  CheckCircle2,
  Receipt,
} from 'lucide-react';

export const BusinessReports: React.FC = () => {
  const {
    businessUser,
    salons,
    services,
    staffMembers,
    appointments,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salon = salons.find(s => s.id === businessUser.salonId) || salons[0];
  const salonAppointments = appointments.filter(a => a.salonId === salon.id);
  const salonServices = services.filter(s => s.salonId === salon.id);
  const salonStaff = staffMembers.filter(s => s.salonId === salon.id);

  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');
  const [currency] = useState<'AED' | 'USD' | 'SAR' | 'EUR'>('AED');
  const [exportToast, setExportToast] = useState<string | null>(null);

  const filteredAppointments = useMemo(() => {
    return salonAppointments;
  }, [salonAppointments, timeframe]);

  const grossRevenue = useMemo(() => {
    return filteredAppointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((acc, curr) => acc + curr.servicePrice, 0);
  }, [filteredAppointments]);

  const vatRate = 0.05;
  const vatAmount = Math.round(grossRevenue * (vatRate / (1 + vatRate)));
  const netRevenue = grossRevenue - vatAmount;
  const staffCommissionEst = Math.round(netRevenue * 0.35);
  const netSalonProfit = netRevenue - staffCommissionEst;

  const totalBookings = filteredAppointments.length;
  const completedBookings = filteredAppointments.filter(a => a.status === 'completed').length;
  const confirmedBookings = filteredAppointments.filter(a => a.status === 'confirmed').length;
  const avgOrderValue = totalBookings > 0 ? Math.round(grossRevenue / totalBookings) : 0;
  const occupancyRate = 84;

  const categoryStats = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    salonServices.forEach(s => {
      if (!map.has(s.category)) {
        map.set(s.category, { count: 0, revenue: 0 });
      }
    });

    filteredAppointments.forEach(apt => {
      const srv = salonServices.find(s => s.id === apt.serviceId);
      const cat = srv ? srv.category : 'Haircut';
      const existing = map.get(cat) || { count: 0, revenue: 0 };
      existing.count += 1;
      existing.revenue += apt.servicePrice;
      map.set(cat, existing);
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: grossRevenue > 0 ? Math.round((data.revenue / grossRevenue) * 100) : 0,
    })).sort((a, b) => b.revenue - a.revenue);
  }, [salonServices, filteredAppointments, grossRevenue]);

  const handleExportCSV = () => {
    const headers = 'Booking ID,Customer Name,Customer Phone,Service,Stylist,Date,Time,Price (AED),Status\n';
    const rows = filteredAppointments.map(a => 
      `"${a.id}","${a.customerName}","${a.customerPhone}","${a.serviceName}","${a.staffName}","${a.date}","${a.timeSlot}","${a.servicePrice}","${a.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ALGO_${salon.name.replace(/\s+/g, '_')}_Financial_Report_${timeframe.toUpperCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast('Financial statement CSV downloaded successfully.');
    setTimeout(() => setExportToast(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-in fade-in duration-200">
      {exportToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${currentThemeConfig.primaryHex}20`,
                color: currentThemeConfig.primaryHex,
              }}
            >
              ALGO Business Intelligence
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              • UAE VAT (5%) Compliant
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Financial & Performance Reports
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Comprehensive real-time analytics, revenue distribution, staff commissions, and tax ledgers.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div
            className={`flex items-center p-1 rounded-2xl border text-xs font-bold ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            {(['today', 'week', 'month', 'year', 'all'] as const).map(tf => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  timeframe === tf
                    ? 'text-white shadow-xs font-extrabold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: timeframe === tf ? currentThemeConfig.primaryHex : undefined,
                }}
              >
                {tf === 'all' ? 'All Time' : tf}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-white shadow-xs'
            }`}
          >
            <Download className="w-3.5 h-3.5" style={{ color: currentThemeConfig.primaryHex }} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Gross Revenue
            </span>
            <span className="flex items-center text-[11px] font-extrabold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {currency} {grossRevenue.toLocaleString()}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Total service billing ({timeframe})
            </p>
          </div>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Net Salon Profit
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">
              Post VAT & Payouts
            </span>
          </div>
          <div className="mt-2">
            <div
              className="text-2xl sm:text-3xl font-black font-mono"
              style={{ color: currentThemeConfig.primaryHex }}
            >
              {currency} {netSalonProfit.toLocaleString()}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              VAT: {currency} {vatAmount} • Staff: {currency} {staffCommissionEst}
            </p>
          </div>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Bookings Volume
            </span>
            <span className="flex items-center text-[11px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
              {confirmedBookings} active
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {totalBookings}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {completedBookings} completed appointments
            </p>
          </div>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden transition-all ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Avg Order Value
            </span>
            <span className="text-[11px] font-bold text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded-md">
              {occupancyRate}% occupancy
            </span>
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {currency} {avgOrderValue}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Per customer booking basket
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className={`lg:col-span-2 p-5 rounded-3xl border ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Revenue by Service Category
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Breakdown of top generating treatment lines
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
              <Scissors className="w-4 h-4" />
              <span>{salonServices.length} Services</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((cat, idx) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </span>
                    <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">
                      ({cat.count} bookings)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                      {currency} {cat.revenue.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(cat.percentage, 4)}%`,
                      backgroundColor: idx === 0 ? currentThemeConfig.primaryHex : `${currentThemeConfig.primaryHex}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-5 rounded-3xl border flex flex-col justify-between ${
            isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Tax & Payment Settlement
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Gross Sales</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{currency} {grossRevenue}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Tax Base (Net)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{currency} {netRevenue}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-rose-500 font-bold">
                <span>VAT 5% (Federal Tax)</span>
                <span className="font-mono">-{currency} {vatAmount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-indigo-400 font-bold">
                <span>Staff Commission Pool</span>
                <span className="font-mono">-{currency} {staffCommissionEst}</span>
              </div>
              <div className="flex justify-between py-2 text-emerald-500 font-extrabold text-sm">
                <span>Net Disbursed to Salon</span>
                <span className="font-mono">{currency} {netSalonProfit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
