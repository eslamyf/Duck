import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faHandshake,
  faShieldHalved,
  faHandshakeAngle,
  faTags,
  faPaperPlane,
  faLocationDot,
  faPeopleGroup,
  faTrophy,
  faArrowRight,
  faArrowLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from '../../shared/i18n/index.js';
import { Button } from '../../shared/ui/index.js';
import {
  GP_VIBES,
  GP_ACTS,
  GP_TIMES,
  GP_LOCATIONS,
  GP_PRESETS,
} from './groupsData.js';

import groupsMain640 from '../../shared/assets/images/groups/groups-main-640w.webp';
import groupsMain960 from '../../shared/assets/images/groups/groups-main-960w.webp';
import groupsSide1_480 from '../../shared/assets/images/groups/groups-side1-480w.webp';
import groupsSide1_720 from '../../shared/assets/images/groups/groups-side1-720w.webp';
import groupsSide2_480 from '../../shared/assets/images/groups/groups-side2-480w.webp';
import groupsSide2_720 from '../../shared/assets/images/groups/groups-side2-720w.webp';

function getFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const TODAY_ISO = new Date().toISOString().split('T')[0];

export default function GroupsPage({ onNavigateHome }) {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  const [vibe, setVibe] = useState('friends');
  const [size, setSize] = useState(20);
  const [act, setAct] = useState('kayak');
  const [locId, setLocId] = useState(0);
  const [date, setDate] = useState(() => getFutureDate(3));
  const [time, setTime] = useState('morning');

  const [org, setOrg] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const selectedLoc = GP_LOCATIONS.find((l) => l.id === locId) || GP_LOCATIONS[0];
  const selectedVibe = GP_VIBES.find((v) => v.id === vibe) || GP_VIBES[0];
  const selectedAct = GP_ACTS.find((a) => a.id === act) || GP_ACTS[0];
  const selectedTime = GP_TIMES.find((tm) => tm.id === time) || GP_TIMES[0];

  const handleSizeChange = (newVal) => {
    const val = Math.max(20, Math.min(250, Number(newVal) || 20));
    setSize(val);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (size < 20) {
      setErrorMessage(t('groupsPage.minSizeError'));
      return;
    }

    const cleanOrg = org.trim();
    const cleanCoord = coordinator.trim();
    const cleanPhone = phone.trim();

    if (cleanOrg.length < 2 || cleanCoord.length < 2 || cleanPhone.length < 8) {
      setErrorMessage(t('groupsPage.fillRequiredError'));
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (!digitsOnly.startsWith('01') && !digitsOnly.startsWith('201') && digitsOnly.length < 10) {
      setErrorMessage(t('groupsPage.invalidPhoneError'));
      return;
    }

    const ref = `GRP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const vibeLabel = t(selectedVibe.key);
    const actLabel = t(selectedAct.key);
    const locLabel = t(selectedLoc.labelKey);
    const timeLabel = t(selectedTime.key);

    const quoteRecord = {
      ref,
      org: cleanOrg,
      vibe,
      coordinator: cleanCoord,
      phone: cleanPhone,
      size,
      activity: act,
      location: locLabel,
      date,
      time: timeLabel,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('duck_group_quotes') || '[]');
      existing.unshift(quoteRecord);
      localStorage.setItem('duck_group_quotes', JSON.stringify(existing));
    } catch {
      // Ignore localStorage quotas if any
    }

    const waMsg = isRtl
      ? `أهلاً فريق Duck 🦆\n` +
        `طلب تسجيل مجموعة جديد (${ref}):\n` +
        `• المجموعة/الجهة: ${cleanOrg} (${vibeLabel})\n` +
        `• المسؤول: ${cleanCoord}\n` +
        `• الهاتف: ${cleanPhone}\n` +
        `• العدد: ${size} فرد\n` +
        `• النشاط: ${actLabel}\n` +
        `• الوجهة: ${locLabel}\n` +
        `• الموعد: ${date} - ${timeLabel}` +
        (notes.trim() ? `\n• ملاحظات: ${notes.trim()}` : '')
      : `Hello Duck Team 🦆\n` +
        `New Group Booking Request (${ref}):\n` +
        `• Group/Org: ${cleanOrg} (${vibeLabel})\n` +
        `• Coordinator: ${cleanCoord}\n` +
        `• WhatsApp: ${cleanPhone}\n` +
        `• Participants: ${size}\n` +
        `• Activity: ${actLabel}\n` +
        `• Destination: ${locLabel}\n` +
        `• Date & Time: ${date} - ${timeLabel}` +
        (notes.trim() ? `\n• Notes: ${notes.trim()}` : '');

    const waHref = `https://wa.me/201550061006?text=${encodeURIComponent(waMsg)}`;

    setSubmittedData({ ref, size, waHref });
    window.open(waHref, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="groupsPage"
      className="max-w-[1280px] mx-auto px-[4vw] py-6 min-[901px]:py-10 flex flex-col gap-8 min-[901px]:gap-10 font-body text-brand-navy"
      aria-label={t('groupsPage.tag')}
    >
      {/* Breadcrumb back button */}
      <div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 bg-[#f4f8fb] text-brand-navy border border-[rgba(20,125,159,0.16)] rounded-full px-4 py-1.5 text-xs font-bold hover:bg-brand-navy hover:text-brand-yellow transition-all duration-200 cursor-pointer shadow-sm group"
        >
          <FontAwesomeIcon
            icon={isRtl ? faArrowRight : faArrowLeft}
            className="text-xs transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span>{t('groupsPage.crumb')}</span>
        </button>
      </div>

      {/* 1. Concise Hero + 3 Real Group Photos */}
      <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.05fr_1.15fr] gap-7 items-center">
        {/* Copy */}
        <div className="flex flex-col gap-3.5 items-start">
          <span className="inline-flex items-center gap-2 bg-brand-yellow text-brand-navy px-3.5 py-1 rounded-full font-extrabold text-xs tracking-wide shadow-sm">
            <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
            {t('groupsPage.tag')}
          </span>

          <h1 className="text-[clamp(26px,3.6vw,42px)] font-black leading-tight text-brand-navy m-0">
            {t('groupsPage.title')}
          </h1>

          <p className="text-[15.5px] min-[901px]:text-[16.5px] leading-relaxed text-brand-navy/85 m-0">
            {t('groupsPage.sub')}
          </p>

          <div className="flex flex-wrap gap-2 mt-1">
            <span className="inline-flex items-center gap-2 bg-white border border-[rgba(20,125,159,0.16)] rounded-full px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm">
              <FontAwesomeIcon icon={faUsers} className="text-brand-blue" aria-hidden="true" />
              {t('groupsPage.highlight1')}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-[rgba(20,125,159,0.16)] rounded-full px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm">
              <FontAwesomeIcon icon={faHandshake} className="text-brand-blue" aria-hidden="true" />
              {t('groupsPage.highlight2')}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border border-[rgba(20,125,159,0.16)] rounded-full px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm">
              <FontAwesomeIcon icon={faShieldHalved} className="text-brand-blue" aria-hidden="true" />
              {t('groupsPage.highlight3')}
            </span>
          </div>
        </div>

        {/* Real Group Photography Collage */}
        <div
          className="grid grid-cols-2 min-[769px]:grid-cols-[1.15fr_0.95fr] grid-rows-[170px_130px] min-[769px]:grid-rows-[175px_175px] gap-3"
          aria-label={t('groupsPage.tag')}
        >
          {/* Main Photo */}
          <figure className="relative col-span-2 min-[769px]:col-span-1 min-[769px]:row-span-2 rounded-[20px] overflow-hidden border border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] bg-brand-navy group">
            <picture>
              <source media="(max-width: 768px)" srcSet={groupsMain640} />
              <img
                src={groupsMain960}
                alt={t('groupsPage.photoMainAlt')}
                loading="lazy"
                decoding="async"
                width={960}
                height={1200}
                className="w-full h-full object-cover object-[center_64%] transition-transform duration-500 group-hover:scale-104"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent pointer-events-none" />
            <b className="absolute bottom-2.5 inset-x-3 z-10 text-white text-xs min-[901px]:text-[13px] font-bold flex items-center gap-2 drop-shadow-md">
              <FontAwesomeIcon icon={faUsers} className="text-brand-yellow text-xs" aria-hidden="true" />
              {t('groupsPage.photoMainLabel')}
            </b>
          </figure>

          {/* Side Photo 1 */}
          <figure className="relative rounded-[20px] overflow-hidden border border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] bg-brand-navy group">
            <picture>
              <source media="(max-width: 768px)" srcSet={groupsSide1_480} />
              <img
                src={groupsSide1_720}
                alt={t('groupsPage.photoSide1Alt')}
                loading="lazy"
                decoding="async"
                width={720}
                height={900}
                className="w-full h-full object-cover object-[center_66%] transition-transform duration-500 group-hover:scale-104"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent pointer-events-none" />
            <b className="absolute bottom-2.5 inset-x-3 z-10 text-white text-[11px] min-[901px]:text-xs font-bold flex items-center gap-1.5 drop-shadow-md truncate">
              <FontAwesomeIcon icon={faPeopleGroup} className="text-brand-yellow text-xs shrink-0" aria-hidden="true" />
              <span className="truncate">{t('groupsPage.photoSide1Label')}</span>
            </b>
          </figure>

          {/* Side Photo 2 */}
          <figure className="relative rounded-[20px] overflow-hidden border border-[rgba(20,125,159,0.16)] shadow-[0_8px_24px_rgba(12,18,38,0.06)] bg-brand-navy group">
            <picture>
              <source media="(max-width: 768px)" srcSet={groupsSide2_480} />
              <img
                src={groupsSide2_720}
                alt={t('groupsPage.photoSide2Alt')}
                loading="lazy"
                decoding="async"
                width={720}
                height={900}
                className="w-full h-full object-cover object-[center_66%] transition-transform duration-500 group-hover:scale-104"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent pointer-events-none" />
            <b className="absolute bottom-2.5 inset-x-3 z-10 text-white text-[11px] min-[901px]:text-xs font-bold flex items-center gap-1.5 drop-shadow-md truncate">
              <FontAwesomeIcon icon={faTrophy} className="text-brand-yellow text-xs shrink-0" aria-hidden="true" />
              <span className="truncate">{t('groupsPage.photoSide2Label')}</span>
            </b>
          </figure>
        </div>
      </div>

      {/* 2. Streamlined Interactive Studio + Live Pass */}
      <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.32fr_0.88fr] gap-6 items-start">
        {/* Form Builder */}
        <form id="rfqForm" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Step 1: Trip & Group Parameters */}
          <div className="bg-white border border-[rgba(20,125,159,0.16)] rounded-[22px] p-5 min-[901px]:p-6 shadow-[0_8px_24px_rgba(12,18,38,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2.5 flex-wrap">
              <h2 className="text-lg min-[901px]:text-[19px] font-black text-brand-navy m-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-brand-yellow text-brand-navy font-black text-sm inline-grid place-items-center shrink-0">
                  1
                </span>
                {t('groupsPage.step1Title')}
              </h2>
              <span className="text-xs font-bold text-brand-blue bg-[#f4f8fb] px-3 py-1 rounded-full border border-[rgba(20,125,159,0.16)]">
                {t('groupsPage.step1Badge')}
              </span>
            </div>

            {/* Deal Note */}
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#fffbe0] to-[#f3fafc] border border-[rgba(6,123,161,0.22)] rounded-[14px] p-3 text-xs min-[901px]:text-[13px] font-bold text-brand-navy leading-relaxed">
              <FontAwesomeIcon icon={faHandshakeAngle} className="text-brand-blue text-base shrink-0" aria-hidden="true" />
              <span>{t('groupsPage.dealNote')}</span>
            </div>

            {/* Group Type (Vibes) */}
            <div>
              <span className="block text-xs font-black text-brand-navy mb-1.5">
                {t('groupsPage.groupType')}
              </span>
              <div className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-2" role="group">
                {GP_VIBES.map((v) => {
                  const isSelected = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center justify-center gap-2 min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md'
                          : 'bg-white text-brand-navy border-[rgba(20,125,159,0.16)] hover:border-brand-blue hover:bg-[#f4f8fb]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={v.icon}
                        className={`text-xs ${isSelected ? 'text-brand-yellow' : 'text-brand-blue'}`}
                        aria-hidden="true"
                      />
                      <span>{t(v.key)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Size Controls */}
            <div className="bg-[#f4f8fb] border border-[rgba(20,125,159,0.16)] rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2.5 flex-wrap">
                <div className="flex items-baseline gap-1.5 text-2xl font-black text-brand-navy">
                  <span>{size}</span>
                  <small className="text-xs font-bold text-brand-blue">{t('groupsPage.adventurersMin')}</small>
                </div>
                <div className="flex flex-wrap gap-1.5" role="group">
                  {GP_PRESETS.map((num) => {
                    const isSelected = size === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSizeChange(num)}
                        aria-pressed={isSelected}
                        className={`rounded-full px-3 py-1 text-xs font-extrabold cursor-pointer border transition-all duration-150 ${
                          isSelected
                            ? 'bg-brand-navy text-brand-yellow border-brand-navy'
                            : 'bg-white text-brand-navy border-[rgba(20,125,159,0.16)] hover:border-brand-blue'
                        }`}
                      >
                        {num}+
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider Row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSizeChange(size - 2)}
                  aria-label={t('groupsPage.decrease')}
                  className="w-8 h-8 rounded-full border border-[rgba(20,125,159,0.16)] bg-white text-brand-navy font-black text-base grid place-items-center hover:bg-brand-navy hover:text-brand-yellow cursor-pointer shrink-0"
                >
                  −
                </button>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="1"
                  value={Math.min(150, size)}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="flex-1 accent-brand-blue h-2 cursor-pointer"
                  aria-label={t('groupsPage.exactCountLabel')}
                />
                <button
                  type="button"
                  onClick={() => handleSizeChange(size + 2)}
                  aria-label={t('groupsPage.increase')}
                  className="w-8 h-8 rounded-full border border-[rgba(20,125,159,0.16)] bg-white text-brand-navy font-black text-base grid place-items-center hover:bg-brand-navy hover:text-brand-yellow cursor-pointer shrink-0"
                >
                  +
                </button>
              </div>
            </div>

            {/* Activity Selector */}
            <div>
              <span className="block text-xs font-black text-brand-navy mb-1.5">
                {t('groupsPage.activityLabel')}
              </span>
              <div className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-2" role="group">
                {GP_ACTS.map((a) => {
                  const isSelected = act === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAct(a.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center justify-center gap-2 min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md'
                          : 'bg-white text-brand-navy border-[rgba(20,125,159,0.16)] hover:border-brand-blue hover:bg-[#f4f8fb]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={a.icon}
                        className={`text-xs ${isSelected ? 'text-brand-yellow' : 'text-brand-blue'}`}
                        aria-hidden="true"
                      />
                      <span>{t(a.key)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destination Selector */}
            <div>
              <span className="block text-xs font-black text-brand-navy mb-1.5">
                {t('groupsPage.destinationLabel')}
              </span>
              <div className="grid grid-cols-2 min-[768px]:grid-cols-5 gap-2" role="group">
                {GP_LOCATIONS.map((loc) => {
                  const isSelected = locId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setLocId(loc.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center justify-center gap-1.5 min-h-[44px] px-2 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                        isSelected
                          ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md'
                          : 'bg-white text-brand-navy border-[rgba(20,125,159,0.16)] hover:border-brand-blue hover:bg-[#f4f8fb]'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className={`text-xs shrink-0 ${isSelected ? 'text-brand-yellow' : 'text-brand-blue'}`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{t(loc.labelKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 min-[640px]:grid-cols-[190px_1fr] gap-3 items-end">
              <div>
                <label htmlFor="q_dt" className="block text-xs font-black text-brand-navy mb-1.5">
                  {t('groupsPage.preferredDate')}
                </label>
                <input
                  id="q_dt"
                  type="date"
                  min={TODAY_ISO}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-bold focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>

              <div>
                <span className="block text-xs font-black text-brand-navy mb-1.5">
                  {t('groupsPage.preferredTime')}
                </span>
                <div className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-2" role="group">
                  {GP_TIMES.map((tm) => {
                    const isSelected = time === tm.id;
                    return (
                      <button
                        key={tm.id}
                        type="button"
                        onClick={() => setTime(tm.id)}
                        aria-pressed={isSelected}
                        className={`flex items-center justify-center min-h-[46px] px-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer border ${
                          isSelected
                            ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md'
                            : 'bg-white text-brand-navy border-[rgba(20,125,159,0.16)] hover:border-brand-blue hover:bg-[#f4f8fb]'
                        }`}
                      >
                        {t(tm.key)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Contact Details */}
          <div className="bg-white border border-[rgba(20,125,159,0.16)] rounded-[22px] p-5 min-[901px]:p-6 shadow-[0_8px_24px_rgba(12,18,38,0.06)] flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2.5">
              <h2 className="text-lg min-[901px]:text-[19px] font-black text-brand-navy m-0 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-brand-yellow text-brand-navy font-black text-sm inline-grid place-items-center shrink-0">
                  2
                </span>
                {t('groupsPage.step2Title')}
              </h2>
            </div>

            {/* Split 3 fields: Org, Coordinator, WhatsApp */}
            <div className="grid grid-cols-1 min-[768px]:grid-cols-3 gap-3">
              <div>
                <label htmlFor="q_org" className="block text-xs font-bold text-brand-navy mb-1.5">
                  {t('groupsPage.orgLabel')}
                </label>
                <input
                  id="q_org"
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder={t('groupsPage.orgPlaceholder')}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>

              <div>
                <label htmlFor="q_name" className="block text-xs font-bold text-brand-navy mb-1.5">
                  {t('groupsPage.coordinatorLabel')}
                </label>
                <input
                  id="q_name"
                  type="text"
                  required
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                  placeholder={t('groupsPage.coordinatorPlaceholder')}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>

              <div>
                <label htmlFor="q_ph" className="block text-xs font-bold text-brand-navy mb-1.5">
                  {t('groupsPage.whatsappLabel')}
                </label>
                <input
                  id="q_ph"
                  dir="ltr"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('groupsPage.whatsappPlaceholder')}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-medium text-left focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>
            </div>

            {/* Split 2 fields: Exact Size + Notes */}
            <div className="grid grid-cols-1 min-[768px]:grid-cols-[160px_1fr] gap-3">
              <div>
                <label htmlFor="q_sz_inp" className="block text-xs font-bold text-brand-navy mb-1.5">
                  {t('groupsPage.exactCountLabel')}
                </label>
                <input
                  id="q_sz_inp"
                  type="number"
                  min="20"
                  required
                  value={size}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-bold focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>

              <div>
                <label htmlFor="q_nt" className="block text-xs font-bold text-brand-navy mb-1.5">
                  {t('groupsPage.notesLabel')}
                </label>
                <input
                  id="q_nt"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('groupsPage.notesPlaceholder')}
                  className="w-full h-[46px] px-3 border border-[rgba(20,125,159,0.16)] rounded-xl bg-[#f9fcfd] text-brand-navy text-sm font-medium focus:outline-none focus:border-brand-blue focus:bg-white focus:ring-2 focus:ring-brand-blue/15"
                />
              </div>
            </div>

            {/* Validation Error Alert */}
            {errorMessage ? (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-3"
              >
                {errorMessage}
              </div>
            ) : null}

            {/* Form Success Bar */}
            {submittedData ? (
              <div
                role="status"
                className="bg-brand-yellow/20 border border-brand-yellow text-brand-navy rounded-xl p-3.5 flex flex-col min-[640px]:flex-row items-center justify-between gap-3 text-xs min-[901px]:text-sm font-bold"
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base shrink-0" />
                  <span>
                    {t('groupsPage.successAlert', {
                      ref: submittedData.ref,
                      size: submittedData.size,
                    })}
                  </span>
                </div>
                <Button
                  as="a"
                  href={submittedData.waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  className="w-full min-[640px]:w-auto shrink-0 inline-flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                  <span>{t('groupsPage.successWaBtn')}</span>
                </Button>
              </div>
            ) : null}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full min-h-[50px] font-black text-base rounded-xl shadow-[0_8px_24px_rgba(245,232,71,0.35)] flex items-center justify-center gap-2.5 cursor-pointer hover:scale-101 transition-all"
            >
              <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
              <span>{t('groupsPage.submitBtn')}</span>
            </Button>
          </div>
        </form>

        {/* Live Boarding Pass (Sticky on Desktop) */}
        <aside
          className="bg-brand-navy text-white rounded-3xl overflow-hidden shadow-[0_22px_48px_rgba(18,21,40,0.25)] border border-white/10 min-[960px]:sticky min-[960px]:top-[118px]"
          aria-live="polite"
        >
          {/* Header */}
          <div className="p-5 pb-3.5 bg-gradient-to-r from-brand-navy to-brand-blue flex justify-between items-center gap-2.5">
            <div>
              <small className="block text-[11px] text-brand-yellow font-extrabold tracking-wider uppercase">
                {t('groupsPage.passBadge')}
              </small>
              <b className="text-base min-[901px]:text-lg block mt-0.5 text-white">
                {t('groupsPage.passTitle')}
              </b>
            </div>
            <span className="bg-brand-yellow text-brand-navy px-3 py-1 rounded-full font-black text-[11.5px] whitespace-nowrap shadow-sm">
              {t('groupsPage.passTier')}
            </span>
          </div>

          {/* Perforation Line with Cutouts */}
          <div className="relative h-4 flex items-center px-4" aria-hidden="true">
            <span className="absolute top-1/2 -translate-y-1/2 -start-2.5 w-5 h-5 rounded-full bg-[#f4f8fb]" />
            <span className="absolute top-1/2 -translate-y-1/2 -end-2.5 w-5 h-5 rounded-full bg-[#f4f8fb]" />
            <div className="w-full border-t border-dashed border-white/20" />
          </div>

          {/* Body Rows */}
          <div className="p-5 pt-2 flex flex-col gap-2.5 text-xs min-[901px]:text-[13px]">
            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowOrg')}</span>
              <b className={`text-end ${org.trim() ? 'text-white' : 'text-white/40 italic font-normal'}`}>
                {org.trim() || t('groupsPage.notEntered')}
              </b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowCoord')}</span>
              <b className={`text-end ${coordinator.trim() ? 'text-white' : 'text-white/40 italic font-normal'}`}>
                {coordinator.trim() || t('groupsPage.notEntered')}
              </b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowPhone')}</span>
              <b dir="ltr" className={`text-end ${phone.trim() ? 'text-white font-mono' : 'text-white/40 italic font-normal'}`}>
                {phone.trim() || t('groupsPage.notEnteredPhone')}
              </b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowType')}</span>
              <b className="text-end text-brand-yellow">{t(selectedVibe.key)}</b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowSize')}</span>
              <b className="text-end text-white font-black">
                {t('groupsPage.passRowSizeVal', { count: size })}
              </b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowAct')}</span>
              <b className="text-end text-white">
                {t(selectedAct.key)} · {t(selectedLoc.labelKey)}
              </b>
            </div>

            <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
              <span className="text-white/70">{t('groupsPage.passRowSchedule')}</span>
              <b className="text-end text-white">
                {date} · {t(selectedTime.key)}
              </b>
            </div>

            {notes.trim() ? (
              <div className="flex justify-between items-start gap-3 pb-2 border-b border-white/10">
                <span className="text-white/70">{t('groupsPage.passRowNotes')}</span>
                <b className="text-end text-white max-w-[200px] truncate">{notes.trim()}</b>
              </div>
            ) : null}

            {/* Deal Note */}
            <div className="flex items-start gap-2 bg-white/10 border border-white/15 rounded-xl p-3 text-[11.5px] leading-relaxed text-white/90 my-1">
              <FontAwesomeIcon icon={faTags} className="text-brand-yellow text-sm shrink-0 mt-0.5" aria-hidden="true" />
              <span>{t('groupsPage.passDealNote')}</span>
            </div>

            {/* Direct WhatsApp Callout if submitted */}
            {submittedData ? (
              <Button
                as="a"
                href={submittedData.waHref}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="md"
                className="w-full inline-flex items-center justify-center gap-2 font-black rounded-xl cursor-pointer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                <span>{t('groupsPage.successWaBtn')}</span>
              </Button>
            ) : (
              <Button
                type="submit"
                form="rfqForm"
                variant="primary"
                size="md"
                className="w-full inline-flex items-center justify-center gap-2 font-black rounded-xl shadow-[0_8px_24px_rgba(245,232,71,0.35)] cursor-pointer hover:scale-101 transition-all"
              >
                <FontAwesomeIcon icon={faPaperPlane} aria-hidden="true" />
                <span>{t('groupsPage.passConfirmBtn')}</span>
              </Button>
            )}

            <p className="text-[11px] text-white/70 text-center m-0 mt-1">
              {t('groupsPage.passNote')}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
