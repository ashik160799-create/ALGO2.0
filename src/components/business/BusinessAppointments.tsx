import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus } from '../../types';
import {
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';

export const BusinessAppointments: React.FC = () => {
  const {
    businessUser,
    salons,
    services,
    staffMembers,
    appointments,
    createAppointment,
    acceptAppointment,
    isCustomerVip,
    setActiveBusinessTab,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salon = salons.find(s => s.id === businessUser.salonId) || salons[0];
  const salonAppointments = appointments.filter(a => a.salonId === salon.id);
  const salonServices = services.filter(s => s.salonId === salon.id);
  const salonStaff = staffMembers.filter(s => s.salonId === salon.id);

  const [filterStatus, setFilterStatus] = useState<string>('upcoming');
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [searchClient, setSearchClient] = useState('');

  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('+971544298306');
  const [walkinServiceId, setWalkinServiceId] = useState(salonServices[0]?.id || '');
  const [walkinStaffId, setWalkinStaffId] = useState(salonStaff[0]?.id || '');
  const [walkinTimeSlot, setWalkinTimeSlot] = useState('03:00 PM');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinNotes, setWalkinNotes] = useState('');

  const filteredAppointments = salonAppointments.filter(apt => {
    let matchStatus = true;
    if (filterStatus === 'upcoming') {
      matchStatus = apt.status === 'confirmed' || apt.status === 'in_progress';
    } else if (filterStatus === 'completed') {
      matchStatus = apt.status === 'completed';
    } else if (filterStatus === 'cancelled') {
      matchStatus = apt.status === 'cancelled';
    } else if (filterStatus === 'pending') {
      matchStatus = apt.status === 'pending' || apt.status === 'rescheduled_by_business';
    } else if (filterStatus !== 'all') {
      matchStatus = apt.status === filterStatus;
    }

    const matchStaff = filterStaff === 'all' || apt.staffId === filterStaff;
    const matchSearch =
      searchClient === '' ||
      apt.customerName.toLowerCase().includes(searchClient.toLowerCase()) ||
      apt.customerPhone.includes(searchClient) ||
      apt.serviceName.toLowerCase().includes(searchClient.toLowerCase());

    return matchStatus && matchStaff && matchSearch;
  });

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    const service = salonServices.find(s => s.id === walkinServiceId) || salonServices[0];
    const staff = salonStaff.find(st => st.id === walkinStaffId) || salonStaff[0];

    createAppointment({
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      salonPhone: salon.phone,
      salonImage: salon.image,
      customerId: `walkin-${Date.now()}`,
      customerName: walkinName.trim() || 'Walk-in Guest',
      customerPhone: walkinPhone.trim() || '+971 54 429 8306',
      customerEmail: 'guest@walkin.com',
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      durationMinutes: service.durationMinutes,
      staffId: staff.id,
      staffName: staff.name,
      staffAvatar: staff.avatar,
      date: walkinDate,
      timeSlot: walkinTimeSlot,
      paymentMethod: 'pay_at_salon',
      notes: walkinNotes.trim() || 'Walk-in guest registered by front desk.',
    });

    setWalkinModalOpen(false);
    setWalkinName('');
    setWalkinNotes('');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto animate-in fade-in duration-200">
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
              Salon Schedule & Queue
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              • {filteredAppointments.length} Bookings
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Bookings & Calendar
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Manage client appointments, walk-in reservations, and live service progress.
          </p>
        </div>

        <button
          id="add-walkin-btn"
          type="button"
          onClick={() => setWalkinModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto hover:opacity-95"
          style={{ backgroundColor: currentThemeConfig.primaryHex }}
        >
          <Plus className="w-4 h-4" />
          <span>+ New Walk-in Booking</span>
        </button>
      </div>

      <div
        className={`p-3.5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchClient}
            onChange={e => setSearchClient(e.target.value)}
            placeholder="Search client name, phone (+971...), or service..."
            className={`w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border focus:outline-none transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-xs">
          {[
            { id: 'upcoming', label: 'UPCOMING (Accepted)' },
            { id: 'completed', label: 'COMPLETED' },
            { id: 'cancelled', label: 'CANCELLED' },
            { id: 'pending', label: 'PENDING REQUESTS' },
            { id: 'all', label: 'ALL' },
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-tight shrink-0 transition-all ${
                filterStatus === st.id
                  ? 'text-white shadow-sm'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
              style={{
                backgroundColor: filterStatus === st.id ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="shrink-0">
          <select
            value={filterStaff}
            onChange={e => setFilterStaff(e.target.value)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border focus:outline-none ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-slate-950 border-slate-800 text-white'
            }`}
          >
            <option value="all">All Stylists ({salonStaff.length})</option>
            {salonStaff.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3.5">
        {filteredAppointments.length === 0 ? (
          <div
            className={`p-12 text-center rounded-3xl border ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
              No Bookings Found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no appointments matching your current search or status filters.
            </p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div
              key={apt.id}
              className={`p-5 rounded-3xl border transition-all ${
                isLight
                  ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={apt.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={apt.customerName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {apt.customerName}
                      </h3>
                      {isCustomerVip(apt.customerId || apt.customerName, salon.id) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          VIP
                        </span>
                      )}
                      {getStatusBadge(apt.status)}
                    </div>

                    <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
                      {apt.serviceName}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {apt.date} at {apt.timeSlot}
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1">
                        <img
                          src={apt.staffAvatar}
                          alt={apt.staffName}
                          className="w-4 h-4 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <strong className="text-slate-700 dark:text-slate-300">{apt.staffName}</strong>
                      </span>

                      <span>•</span>

                      <span className="font-mono text-slate-500">
                        {apt.customerPhone}
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        Note: "{apt.notes}"
                      </p>
                    )}

                    {apt.status === 'pending' && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => acceptAppointment(apt.id)}
                          className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveBusinessTab('customers')}
                          className="px-3 py-1 rounded-xl text-xs font-semibold border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 flex items-center gap-1"
                        >
                          <span>Manage in Customers Hub</span>
                        </button>
                      </div>
                    )}

                    {apt.status === 'cancelled' && apt.declineReason && (
                      <div className="text-[11px] text-rose-500 pt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>Reason: {apt.declineReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
