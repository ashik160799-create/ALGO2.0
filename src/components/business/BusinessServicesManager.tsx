import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { ServiceBannerCard } from '../common/ServiceBannerCard';
import { AiBannerModal } from '../common/AiBannerModal';
import { getRecommendedAiBanner, generateAiPromptForService } from '../../utils/aiBannerGenerator';
import {
  Scissors,
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
} from 'lucide-react';

export const BusinessServicesManager: React.FC = () => {
  const {
    businessUser,
    services,
    addService,
    updateService,
    deleteService,
    currentThemeConfig,
    colorThemeMode,
  } = useApp();

  const isLight = colorThemeMode === 'light';
  const salonServices = services.filter(s => s.salonId === businessUser.salonId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'banner' | 'compact'>('banner');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeServiceForAi, setActiveServiceForAi] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceItem['category']>('Haircut');
  const [genderTarget, setGenderTarget] = useState<'Unisex' | 'Male' | 'Female'>('Unisex');
  const [price, setPrice] = useState(28);
  const [originalPrice, setOriginalPrice] = useState(35);
  const [offerTag, setOfferTag] = useState('20% off');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [description, setDescription] = useState('Hair services • Precision cut, wash, hot towel finish & styling.');
  const [image, setImage] = useState('');
  const [isPopular, setIsPopular] = useState(false);

  const categoriesList: Array<ServiceItem['category']> = [
    'Haircut',
    'Styling',
    'Coloring',
    'Beard & Shave',
    'Spa & Facial',
    'Nails & Lashes',
  ];

  const handleOpenCreate = () => {
    setEditingServiceId(null);
    setName('Haircut');
    setCategory('Haircut');
    setGenderTarget('Unisex');
    setPrice(28);
    setOriginalPrice(35);
    setOfferTag('20% off');
    setDurationMinutes(30);
    setDescription('Hair services • Precision cut, wash, hot towel finish & styling.');
    const recommended = getRecommendedAiBanner('Haircut', 'Haircut', 'Unisex');
    setImage(recommended.imageUrl);
    setIsPopular(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setName(srv.name);
    setCategory(srv.category);
    setGenderTarget(srv.genderTarget || 'Unisex');
    setPrice(srv.price);
    const defOrig = srv.originalPrice || Math.round(srv.price * 1.25);
    setOriginalPrice(defOrig);
    setOfferTag(srv.offerTag || '20% off');
    setDurationMinutes(srv.durationMinutes);
    setDescription(srv.description);
    setImage(srv.image || getRecommendedAiBanner(srv.name, srv.category, srv.genderTarget || 'Unisex').imageUrl);
    setIsPopular(!!srv.isPopular);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discountPercent =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const serviceData = {
      salonId: businessUser.salonId,
      name: name.trim(),
      category,
      genderTarget,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent,
      offerTag: offerTag.trim() || `${discountPercent}% off`,
      durationMinutes: Number(durationMinutes),
      description: description.trim(),
      image: image.trim() || getRecommendedAiBanner(name, category, genderTarget).imageUrl,
      isPopular,
    };

    if (editingServiceId) {
      updateService(editingServiceId, serviceData);
    } else {
      addService(serviceData);
    }

    setModalOpen(false);
  };

  const handleOpenAiStudio = (srv: ServiceItem) => {
    setActiveServiceForAi(srv);
    setAiModalOpen(true);
  };

  const handleApplyAiBanner = (newImg: string) => {
    if (activeServiceForAi) {
      updateService(activeServiceForAi.id, { image: newImg });
    }
  };

  const filteredServices = salonServices.filter(srv => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesGender =
      selectedGender === 'All' ||
      (srv.genderTarget || 'Unisex') === selectedGender ||
      (selectedGender === 'Unisex' && !srv.genderTarget);

    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.genderTarget && srv.genderTarget.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesGender && matchesSearch;
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
              Catalog & Visual Banners
            </span>
            <span className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              • {salonServices.length} Offerings
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Services & Prices Management
          </h1>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            AI-powered service banner cards with prominent price, offer discounts, duration, audience tags, and descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('banner')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'banner'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Reference Banner Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="add-service-btn"
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-2xl font-black text-xs text-white shadow-md transition-all flex items-center gap-1.5 hover:opacity-95"
            style={{ backgroundColor: currentThemeConfig.primaryHex }}
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Service</span>
          </button>
        </div>
      </div>

      {notificationMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificationMsg(null)}
            className="text-emerald-400 hover:text-emerald-200 text-sm font-black px-2"
          >
            ✕
          </button>
        </div>
      )}

      <div
        className={`p-4 rounded-3xl border flex flex-col gap-3.5 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Haircut, Beard, Color, Facial, Unisex..."
              className={`w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-2xl border focus:outline-none transition-all ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                  : 'bg-slate-950 border-slate-800 text-white focus:border-slate-600'
              }`}
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs shrink-0">
            {(['All', 'Unisex', 'Male', 'Female'] as const).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedGender === g
                    ? 'text-white shadow-xs'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: selectedGender === g ? currentThemeConfig.primaryHex : undefined,
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'text-white'
                : isLight
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
            style={{
              backgroundColor: selectedCategory === 'All' ? currentThemeConfig.primaryHex : undefined,
            }}
          >
            All Treatments ({salonServices.length})
          </button>
          {categoriesList.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'text-white'
                  : isLight
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
              style={{
                backgroundColor: selectedCategory === cat ? currentThemeConfig.primaryHex : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div
          className={`p-12 text-center rounded-3xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}
        >
          <Scissors className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            No Services Found
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            No offerings match your current search, category, or gender filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredServices.map(srv => (
            <ServiceBannerCard
              key={srv.id}
              service={srv}
              variant="business"
              onEdit={handleOpenEdit}
              onDelete={deleteService}
              onGenerateAi={handleOpenAiStudio}
            />
          ))}
        </div>
      )}

      {activeServiceForAi && (
        <AiBannerModal
          isOpen={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          serviceName={activeServiceForAi.name}
          category={activeServiceForAi.category}
          genderTarget={activeServiceForAi.genderTarget || 'Unisex'}
          currentImage={activeServiceForAi.image || ''}
          onSelectImage={handleApplyAiBanner}
        />
      )}
    </div>
  );
};
