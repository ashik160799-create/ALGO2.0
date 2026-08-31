import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { StaffAvatar } from '../common/StaffAvatar';
import {
  Plus,
  Star,
  Search,
  Clock,
} from 'lucide-react';

export const BusinessStaffManager: React.FC = () => {
  const {
    businessUser,
    staffMembers,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salonStaff = staffMembers.filter(s => s.salonId === businessUser.salonId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDay, setFilterDay] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [roleTitle, setRoleTitle] = useState('Senior Barber & Stylist');
  const [phone, setPhone] = useState('+971544298306');
  const [avatar, setAvatar] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('Skin Fades, Beard Sculpting, Hot Towel Shave');
  const [shiftHours, setShiftHours] = useState('09:00 AM - 07:00 PM');
  const [workingDays, setWorkingDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]);

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleOpenCreate = () => {
    setEditingStaffId(null);
    setName('');
    setGender('Male');
    setRoleTitle('Master Stylist & Groomer');
    setPhone('+971544298306');
    setAvatar('');
    setSpecialtiesText('Classic Scissors, Beard Shaping, VIP Facials');
    setShiftHours('09:00 AM - 07:00 PM');
    setWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    setModalOpen(true);
  };

  const toggleAvailability = (st: StaffMember) => {
    updateStaffMember(st.id, {
      isAvailable: !st.isAvailable,
    });
  };

  const filteredStaff = salonStaff.filter(st => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.gender && st.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
      st.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDay = filterDay === 'all' || st.workingDays.includes(filterDay);

    return matchesSearch && matchesDay;
  });

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
              Team & Stylists Roster
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              • {salonStaff.length} Stylists Enrolled
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Staff & Stylists Management
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Configure staff profiles, manage working days, shift hours, gender specialties, and live duty status.
          </p>
        </div>

        <button
          id="add-new-staff-btn"
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl font-extrabold text-xs text-white shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto hover:opacity-95 cursor-pointer active:scale-95"
          style={{ backgroundColor: currentThemeConfig.primaryHex }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Staff Member</span>
        </button>
      </div>

      <div
        className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search stylists by name, role, gender, or specialty..."
            className={`w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border focus:outline-none transition-all ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
            }`}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          <button
            type="button"
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              filterDay === 'all'
                ? 'text-white'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
            style={{
              backgroundColor: filterDay === 'all' ? currentThemeConfig.primaryHex : undefined,
            }}
          >
            All Days
          </button>
          {allDays.map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setFilterDay(d)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterDay === d
                  ? 'text-white'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
              style={{
                backgroundColor: filterDay === d ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map(st => (
          <div
            key={st.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
              isLight
                ? 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <StaffAvatar
                name={st.name}
                avatar={st.avatar}
                gender={st.gender}
                size="lg"
                badge={
                  <button
                    type="button"
                    onClick={() => toggleAvailability(st)}
                    title={st.isAvailable ? 'Click to set on break' : 'Click to set available'}
                    className={`w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold shadow-xs transition-transform hover:scale-110 ${
                      st.isAvailable ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {st.isAvailable ? '✓' : '✕'}
                  </button>
                }
              />

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className={`text-base font-black truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {st.name}
                    </h3>
                    {st.gender && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border shrink-0 ${
                          st.gender === 'Female'
                            ? 'bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400'
                            : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {st.gender}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    {st.rating.toFixed(1)}
                  </span>
                </div>

                <p
                  className="text-xs font-bold truncate"
                  style={{ color: currentThemeConfig.primaryHex }}
                >
                  {st.roleTitle}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{st.phone || '+971 54 429 8306'}</span>
                  <span>•</span>
                  <span>{st.shiftHours || '09:00 AM - 07:00 PM'}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1.5">
                  {st.specialties.map(spec => (
                    <span
                      key={spec}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        isLight
                          ? 'bg-slate-100 border-slate-200 text-slate-700'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-xs grid grid-cols-2 gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Daily Shift Hours
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {st.shiftHours || '09:00 AM - 07:00 PM'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Booking Status
                </span>
                <span className={`font-bold inline-flex items-center gap-1 mt-0.5 ${
                  st.isAvailable ? 'text-emerald-500' : 'text-rose-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {st.isAvailable ? 'On Duty (Active)' : 'On Break / Off'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
