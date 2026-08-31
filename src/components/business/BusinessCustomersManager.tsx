import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Crown,
  X,
  Check,
  ChevronRight,
} from 'lucide-react';

interface BusinessCustomersManagerProps {
  onBackToOverview?: () => void;
}

export const BusinessCustomersManager: React.FC<BusinessCustomersManagerProps> = ({
}) => {
  const {
    businessUser,
    salons,
    appointments,
    acceptAppointment,
    suggestNewAppointmentTime,
    declineAppointment,
    isCustomerVip,
    currentThemeConfig,
    colorThemeMode,
    setActiveBusinessTab,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salon = salons.find(s => s.id === businessUser.salonId) || salons[0];
  const salonAppointments = appointments.filter(a => a.salonId === salon.id);

  const [activeFilter, setActiveFilter] = useState<
    'pending' | 'vip' | 'rescheduled' | 'confirmed' | 'cancelled'
  >('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [suggestModalApt, setSuggestModalApt] = useState<Appointment | null>(null);
  const [suggestDate, setSuggestDate] = useState('');
  const [suggestTimeSlot, setSuggestTimeSlot] = useState('04:00 PM');
  const [suggestNote, setSuggestNote] = useState('');

  const [declineModalApt, setDeclineModalApt] = useState<Appointment | null>(null);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState('Shop Closed / Emergency Maintenance');
  const [customDeclineReason, setCustomDeclineReason] = useState('');
  const [declineApology, setDeclineApology] = useState(
    'We sincerely apologize for the inconvenience. We would love to welcome you at another available slot.'
  );

  const filteredAppointments = useMemo(() => {
    return salonAppointments.filter(apt => {
      const isVipClient = isCustomerVip(apt.customerId || apt.customerName, salon.id);
      
      if (activeFilter === 'pending' && apt.status !== 'pending') return false;
      if (activeFilter === 'vip' && !isVipClient) return false;
      if (activeFilter === 'rescheduled' && apt.status !== 'rescheduled_by_business') return false;
      if (activeFilter === 'confirmed' && apt.status !== 'confirmed') return false;
      if (activeFilter === 'cancelled' && apt.status !== 'cancelled') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        apt.id.toLowerCase().includes(q) ||
        apt.customerName.toLowerCase().includes(q) ||
        apt.customerPhone.includes(q) ||
        apt.serviceName.toLowerCase().includes(q) ||
        apt.staffName.toLowerCase().includes(q) ||
        apt.date.includes(q)
      );
    });
  }, [salonAppointments, activeFilter, searchQuery, isCustomerVip, salon.id]);

  const pendingCount = salonAppointments.filter(a => a.status === 'pending').length;

  const handleOpenSuggestModal = (apt: Appointment) => {
    setSuggestModalApt(apt);
    setSuggestDate(apt.date);
    setSuggestTimeSlot(apt.timeSlot);
    setSuggestNote(
      `Hello ${apt.customerName}, our stylist ${apt.staffName} has an opening at this proposed time. Would this work for you?`
    );
  };

  const handleConfirmSuggestTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestModalApt) return;
    suggestNewAppointmentTime(suggestModalApt.id, suggestDate, suggestTimeSlot, suggestNote);
    setSuggestModalApt(null);
  };

  const handleOpenDeclineModal = (apt: Appointment) => {
    setDeclineModalApt(apt);
    setSelectedDeclineReason('Shop Closed / Emergency Maintenance');
    setCustomDeclineReason('');
    setDeclineApology(
      `Dear ${apt.customerName}, we sincerely apologize for being unable to accept your booking for ${apt.date} at ${apt.timeSlot}. We hope to serve you again soon!`
    );
  };

  const handleConfirmDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineModalApt) return;
    const finalReason =
      selectedDeclineReason === 'Other Reason (Specify below)'
        ? customDeclineReason.trim() || 'Salon Unavailable'
        : selectedDeclineReason;

    declineAppointment(declineModalApt.id, finalReason, declineApology);
    setDeclineModalApt(null);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveBusinessTab('overview')}
              className={`text-xs font-semibold hover:underline flex items-center gap-1 ${
                isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Management Hub
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span
              className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${currentThemeConfig.primaryHex}20`,
                color: currentThemeConfig.primaryHex,
              }}
            >
              Customers Inside
            </span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Customer Management & Booking Requests
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Review incoming requests, check VIP client status (5+ completed visits), accept bookings, suggest new times, or decline with apologies.
          </p>
        </div>

        <button
          onClick={() => setActiveBusinessTab('calendar')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>View Confirmed Calendar</span>
        </button>
      </div>

      {pendingCount > 0 && (
        <div
          className={`p-4 rounded-3xl border flex items-center justify-between gap-3 shadow-md ${
            isLight ? 'bg-amber-50/90 border-amber-300 text-amber-950' : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
          }`}
          style={{
            boxShadow: `0 8px 24px -8px ${currentThemeConfig.glowHex}`,
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold truncate">
                {pendingCount} Pending Customer {pendingCount === 1 ? 'Booking Request' : 'Booking Requests'} Awaiting Decision
              </h4>
              <p className={`text-[11px] truncate ${isLight ? 'text-amber-900/80' : 'text-amber-200/70'}`}>
                Respond quickly to accept, suggest alternate slots, or decline to notify your customers instantly.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveFilter('pending')}
            className="px-3.5 py-2 rounded-xl text-xs font-black text-white shrink-0 shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: currentThemeConfig.primaryHex }}
          >
            Review Pending ({pendingCount})
          </button>
        </div>
      )}

      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="search-customer-requests-input"
            type="text"
            placeholder="Search by customer name, request ID (#REQ-...), stylist, service, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-slate-400 shadow-sm'
                : 'bg-slate-900/90 border-slate-800 text-white focus:border-slate-700'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'pending'
                ? 'text-white shadow'
                : isLight
                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            style={{
              backgroundColor: activeFilter === 'pending' ? currentThemeConfig.primaryHex : undefined,
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Decisions</span>
            {pendingCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('vip')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFilter === 'vip'
                ? 'text-white shadow'
                : isLight
                ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
            style={{
              backgroundColor: activeFilter === 'vip' ? currentThemeConfig.primaryHex : undefined,
            }}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Clients</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              No Customer Requests Found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no customer bookings in this category right now.
            </p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className={`p-5 rounded-3xl border transition-all ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 shadow'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {apt.customerName}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      {apt.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {apt.serviceName} with {apt.staffName} on {apt.date} @ {apt.timeSlot}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => acceptAppointment(apt.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleOpenSuggestModal(apt)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Suggest Time
                      </button>
                      <button
                        onClick={() => handleOpenDeclineModal(apt)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-500 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
