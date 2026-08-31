import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCountryInput } from '../common/PhoneCountryInput';
import { SecurityBadge } from '../common/SecurityBadge';
import { getSalonMapUrl } from '../../utils/salonUtils';
import {
  Store,
  MapPin,
  Phone,
  CheckCircle2,
  Save,
  KeyRound,
  ShieldCheck,
  Receipt,
  Navigation,
  UploadCloud,
  Camera,
  Heart,
  Star,
  ImageIcon,
} from 'lucide-react';

export const BusinessProfileManager: React.FC = () => {
  const {
    businessUser,
    loginAsBusiness,
    salons,
    updateSalonProfile,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salon = salons.find(s => s.id === businessUser.salonId) || salons[0];

  const [activeSettingsSection, setActiveSettingsSection] = useState<
    'profile' | 'verification' | 'credentials' | 'tax' | 'notifications'
  >('profile');

  const [bannerActionNotice, setBannerActionNotice] = useState<string | null>(null);

  const [name, setName] = useState(salon.name);
  const [category, setCategory] = useState(businessUser.category || salon.categories?.[0] || 'Luxury Hair Salon');
  const [tagline, setTagline] = useState(salon.tagline);
  const [description, setDescription] = useState(salon.description);
  const [address, setAddress] = useState(salon.address);
  const [city, setCity] = useState(salon.city);
  const [mapUrl, setMapUrl] = useState(salon.mapUrl || '');
  const [phone, setPhone] = useState(salon.phone || '+971544298306');
  const [image, setImage] = useState(salon.image);

  const [ownerName, setOwnerName] = useState(businessUser.name || 'Marcus Vance');
  const [ownerRole, setOwnerRole] = useState(businessUser.ownerRole || 'Master Stylist & Salon Director');
  const [ownerEmail, setOwnerEmail] = useState(businessUser.email || 'marcus@algosalon.com');
  const [signUpGmail, setSignUpGmail] = useState(
    businessUser.signUpGmail || businessUser.email || 'ashik160799@gmail.com'
  );
  const [appCode, setAppCode] = useState(businessUser.appCode || '1234');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Luxury Hair Salon',
    'Barber Shop & Shave Lounge',
    'Spa & Wellness Sanctuary',
    'Nail & Beauty Couture',
    'Unisex Aesthetic Studio',
  ];

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      alert('Image size exceeds 6MB. Please choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        updateSalonProfile(salon.id, { image: reader.result });
        setBannerActionNotice('Storefront hero banner updated successfully!');
        setTimeout(() => setBannerActionNotice(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    updateSalonProfile(salon.id, {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      address: address.trim(),
      city: city.trim(),
      mapUrl: mapUrl.trim(),
      phone: phone.trim(),
      image: image.trim(),
    });

    loginAsBusiness(
      {
        name: ownerName.trim(),
        ownerRole: ownerRole.trim(),
        email: ownerEmail.trim(),
        signUpGmail: signUpGmail.trim(),
        isGmailLinked: true,
        appCode: appCode.trim(),
        businessName: name.trim(),
        category: category,
        location: city.trim(),
      },
      salon.id
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg flex items-center gap-1.5"
              style={{
                backgroundColor: `${currentThemeConfig.primaryHex}20`,
                color: currentThemeConfig.primaryHex,
              }}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Business Settings & Identity</span>
            </span>
            <span className="text-[11px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Partner</span>
            </span>
            <SecurityBadge variant="pill" showTooltip={true} />
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Salon Settings & Configuration
          </h1>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Manage salon branding, Sign-up Gmail credentials, 4-digit terminal App Code, UAE VAT, and automated alerts.
          </p>
        </div>

        <button
          id="save-business-settings-btn"
          type="button"
          onClick={() => handleSave()}
          className="px-6 py-3 rounded-2xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 self-start sm:self-auto hover:opacity-95 active:scale-95 cursor-pointer shrink-0"
          style={{
            backgroundColor: currentThemeConfig.primaryHex,
            boxShadow: `0 4px 18px ${currentThemeConfig.glowHex}`,
          }}
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span>Settings saved successfully! All salon profile details, Gmail credentials, and station App Code are live.</span>
          </div>
        </div>
      )}

      {activeSettingsSection === 'profile' && (
        <div
          className={`p-5 sm:p-6 rounded-3xl border space-y-6 animate-in fade-in duration-150 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h2 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Shop Banner View & Hero Media
                </h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Live storefront banner showcasing your brand name, tagline, address & Google Maps navigation.
                </p>
              </div>
            </div>

            {bannerActionNotice && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bannerActionNotice}</span>
              </div>
            )}

            <div
              id="shop-banner-preview-card"
              className={`rounded-3xl border overflow-hidden shadow-xl transition-all ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950 group">
                {image ? (
                  <img
                    src={image}
                    alt={name || 'Shop Storefront Banner'}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-[#141416]">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-2">
                      <ImageIcon className="w-7 h-7 opacity-70" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">No Banner Image Selected</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40 pointer-events-none" />

                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      id="banner-camera-upload-btn"
                      onClick={() => heroImageInputRef.current?.click()}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all shadow-lg active:scale-95 cursor-pointer hover:scale-105"
                      title="Upload / Change Banner Photo"
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>

                    <span
                      className="px-3 py-1 rounded-full text-white font-extrabold text-[11px] sm:text-xs shadow-md backdrop-blur-md"
                      style={{
                        backgroundColor: currentThemeConfig.primaryHex,
                        boxShadow: `0 4px 12px ${currentThemeConfig.glowHex}`,
                      }}
                    >
                      ★ {category || 'Barber Shop & Shave Lounge'}
                    </span>

                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow-sm backdrop-blur-md">
                      ● Open Now
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/20 shadow-lg shrink-0">
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 fill-rose-400" />
                    <span className="leading-none">{salon.likesCount || 128}</span>
                  </div>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white z-10">
                  <div className="flex items-center gap-1.5 font-bold bg-black/80 border border-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
                    <span className="leading-none">
                      {salon.rating ? salon.rating.toFixed(1) : '4.8'}
                    </span>
                    <span className="text-slate-400 text-[10px] font-normal">
                      ({salon.reviewCount || 142} reviews)
                    </span>
                  </div>

                  <div className="bg-black/80 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                    <span className="text-[10px] text-slate-400 mr-1">Starting</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono leading-none">
                      From ${salon.startingPrice || 32}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-lg sm:text-xl font-black font-['Outfit',sans-serif] tracking-tight truncate ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {name || 'Your Salon Legal / Brand Name'}
                    </h3>
                    <span
                      className="inline-flex items-center justify-center shrink-0"
                      title="Verified & Approved ALGO Salon"
                    >
                      <CheckCircle2
                        className="w-4 h-4"
                        style={{ color: currentThemeConfig.primaryHex }}
                      />
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {category}
                    </span>
                  </div>

                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: currentThemeConfig.primaryHex }}
                  >
                    {tagline || 'Add your signature slogan or catchy marketplace tagline'}
                  </p>

                  <div className={`text-xs flex items-center gap-3 flex-wrap ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    <a
                      href={getSalonMapUrl({ name, address, city, mapUrl })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:underline text-rose-500 font-medium cursor-pointer"
                      title="Open in Google Maps"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        {address ? `${address}, ` : ''}{city || 'Dubai, UAE'}
                      </span>
                    </a>

                    {phone && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{phone}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={getSalonMapUrl({ name, address, city, mapUrl })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isLight
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                        : 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/60'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Map Route</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => heroImageInputRef.current?.click()}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isLight
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Banner</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={e => {
                    setImage(e.target.value);
                    updateSalonProfile(salon.id, { image: e.target.value });
                  }}
                  placeholder="Paste banner image URL (https://images.unsplash.com/...)"
                  className={`flex-1 border rounded-xl px-3.5 py-2.5 font-mono text-[11px] focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                />

                <input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroImageUpload}
                />

                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  className={`px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                      : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Local File</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-5 border-slate-100 dark:border-slate-800 space-y-4">
            <div className="border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Salon Identity & Location Details
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Information displayed to customers across the marketplace and booking search.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Salon Legal / Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    updateSalonProfile(salon.id, { name: e.target.value });
                  }}
                  placeholder="e.g. Spot-Pro Signature Studio"
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Business Category
                </label>
                <select
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value);
                    updateSalonProfile(salon.id, {
                      categories: [e.target.value, ...(salon.categories?.filter(c => c !== e.target.value) || [])],
                    });
                  }}
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <PhoneCountryInput
                  id="business-phone-setting"
                  value={phone}
                  onChange={full => {
                    setPhone(full);
                    updateSalonProfile(salon.id, { phone: full });
                  }}
                  label="Direct Salon Contact Number"
                  placeholder="54 429 8306"
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  City / Emirate
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => {
                    setCity(e.target.value);
                    updateSalonProfile(salon.id, { city: e.target.value });
                  }}
                  placeholder="e.g. Dubai, UAE"
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Street Address & Suite
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => {
                    setAddress(e.target.value);
                    updateSalonProfile(salon.id, { address: e.target.value });
                  }}
                  placeholder="e.g. 420 Grand Avenue, Suite 102"
                  className={`w-full border rounded-xl px-3.5 py-2.5 font-semibold focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-500'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
