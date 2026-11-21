import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faPaperPlane,
  faTags,
  faUsers,
  faCalendarDays,
  faLocationDot,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import {
  GROUP_TYPES,
  GROUP_ACTIVITIES,
  TIMES_OF_DAY,
} from './sceneData.js';
import { DESTINATIONS } from '../destinations/destinationsData.js';
import {
  Button,
  Input,
  QuantityStepper,
  DatePicker,
  Card,
} from '../../shared/ui/index.js';

export default function GroupForm({
  state,
  step,
  setStep,
  errors,
  setField,
  setSize,
  validateStep1,
  onSubmit,
  t,
  lang,
}) {
  const isRtl = lang === 'ar';
  const todayIso = new Date().toISOString().slice(0, 10);

  const handleNext = () => {
    if (validateStep1()) {
      setStep(1);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  const currentType = GROUP_TYPES[state.type];
  const currentActivity = GROUP_ACTIVITIES.find((a) => a.id === state.act) || GROUP_ACTIVITIES[0];
  const currentDestination = DESTINATIONS[state.loc] || DESTINATIONS[0];
  const currentTime = TIMES_OF_DAY[state.time];

  return (
    <form
      id="rfq-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {/* ==================== STEP 1 ==================== */}
      <fieldset hidden={step !== 0} className={step === 0 ? 'space-y-6 block' : 'hidden'}>
        {/* Group Type Selector */}
        <div>
          <label className="block font-bold text-sm min-[901px]:text-base text-brand-navy mb-2.5">
            {t('groupsPage.groupTypeLabel')}
          </label>
          <div className="grid grid-cols-2 min-[768px]:grid-cols-4 gap-2.5" role="group" aria-label={t('groupsPage.groupTypeLabel')}>
            {GROUP_TYPES.map((type, idx) => {
              const isSelected = state.type === idx;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setField('type', idx)}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col items-center justify-center gap-1.5 p-3 min-h-[82px] rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-navy text-brand-yellow border-brand-yellow ring-4 ring-brand-yellow/30 shadow-lg -translate-y-1 scale-[1.02] z-10'
                      : 'bg-white text-brand-navy border-brand-navy/15 hover:border-brand-blue hover:bg-surface-mist opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Distinctive Checkmark Badge */}
                  {isSelected && (
                    <span className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center text-[10px] font-black shadow-sm">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  )}
                  <FontAwesomeIcon icon={type.icon} className={`text-xl ${isSelected ? 'text-brand-yellow' : 'text-brand-blue'}`} />
                  <span className={`font-bold text-xs min-[901px]:text-sm text-center leading-tight ${isSelected ? 'font-black' : ''}`}>
                    {t(`groupsPage.types.${type.i18nKey}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group Size Stepper */}
        <div>
          <QuantityStepper
            value={state.size}
            onChange={setSize}
            min={20}
            max={150}
            step={1}
            label={t('groupsPage.groupSizeLabel')}
            presets={[20, 30, 50, 75, 100]}
            lang={lang}
            decrementLabel={t('groupsPage.decreaseAria')}
            incrementLabel={t('groupsPage.increaseAria')}
          />
        </div>

        {/* Activities Selector - Full Card Background Photography */}
        <div>
          <label className="block font-bold text-sm min-[901px]:text-base text-brand-navy mb-2.5">
            {t('groupsPage.activityLabel')}
          </label>
          <div className="grid grid-cols-2 min-[768px]:grid-cols-4 gap-2.5" role="group" aria-label={t('groupsPage.activityLabel')}>
            {GROUP_ACTIVITIES.map((act) => {
              const isSelected = state.act === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setField('act', act.id)}
                  aria-pressed={isSelected}
                  className={`group relative overflow-hidden flex flex-col items-center justify-end p-3 min-h-[96px] min-[901px]:min-h-[106px] rounded-2xl border-3 transition-all duration-200 cursor-pointer text-white ${
                    isSelected
                      ? 'border-brand-yellow ring-4 ring-brand-yellow/40 shadow-xl -translate-y-1.5 scale-[1.03] z-10'
                      : 'border-white/20 hover:border-brand-yellow/60 hover:scale-[1.01] opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Distinctive Checkmark Badge */}
                  {isSelected && (
                    <span className="absolute top-2 end-2 z-20 w-6 h-6 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center text-xs font-black shadow-md">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  )}

                  {/* Full Bleed Background Activity Photo */}
                  {act.image && (
                    <img
                      src={act.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Dark Vignette Overlay for Readability */}
                  <div
                    className={`absolute inset-0 transition-colors duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-brand-navy/20'
                        : 'bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-black/30'
                    }`}
                  />

                  {/* Activity Name with Clear Active Pill */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
                    <span
                      className={`font-bold text-xs min-[901px]:text-sm drop-shadow-md leading-tight transition-all px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-brand-yellow text-brand-navy font-black shadow-sm'
                          : 'text-white'
                      }`}
                    >
                      {t(`groupsPage.activities.${act.i18nKey}`)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Destinations Selector */}
        <div>
          <label className="block font-bold text-sm min-[901px]:text-base text-brand-navy mb-2.5">
            {t('groupsPage.destinationLabel')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 min-[901px]:grid-cols-5 gap-2.5" role="group" aria-label={t('groupsPage.destinationLabel')}>
            {DESTINATIONS.map((dest) => {
              const isSelected = state.loc === dest.id;
              const name = t(`destinations.items.${dest.key}.name`);
              const imgSrc = dest.images?.stripSrc || dest.images?.defaultSrc;

              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => setField('loc', dest.id)}
                  aria-pressed={isSelected}
                  className={`group relative overflow-hidden flex flex-col items-center justify-end p-2.5 min-h-[86px] min-[901px]:min-h-[94px] rounded-2xl border-3 transition-all duration-200 cursor-pointer text-white ${
                    isSelected
                      ? 'border-brand-yellow ring-4 ring-brand-yellow/40 shadow-xl -translate-y-1.5 scale-[1.03] z-10'
                      : 'border-white/20 hover:border-brand-yellow/60 hover:scale-[1.01] opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Distinctive Checkmark Badge */}
                  {isSelected && (
                    <span className="absolute top-2 end-2 z-20 w-6 h-6 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center text-xs font-black shadow-md">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                  )}

                  {/* Background Destination Photo */}
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Dark Vignette Overlay for Readability */}
                  <div
                    className={`absolute inset-0 transition-colors duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-brand-navy/20'
                        : 'bg-gradient-to-t from-brand-navy/90 via-brand-navy/55 to-black/30'
                    }`}
                  />

                  {/* Content with Active Pill Highlight */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
                    <span
                      className={`font-bold text-xs min-[901px]:text-sm drop-shadow-md leading-tight transition-all px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-brand-yellow text-brand-navy font-black shadow-sm'
                          : 'text-white'
                      }`}
                    >
                      {name}
                    </span>
                    {dest.soon && (
                      <span className="text-[10px] bg-brand-yellow text-brand-navy font-black rounded-full px-2 py-0.5 mt-1 shadow-sm">
                        {t('common.soonBadge', 'قريباً')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date and Time - Reordered and balanced sequentially */}
        <div className="space-y-4">
          <DatePicker
            id="rfq-date"
            label={t('groupsPage.preferredDate')}
            min={todayIso}
            value={state.date}
            onChange={(e) => setField('date', e.target.value)}
            error={errors.date}
            required
          />

          <div>
            <label className="block font-bold text-sm min-[901px]:text-base text-brand-navy mb-2.5">
              {t('groupsPage.preferredTime')}
            </label>
            <div
              className="grid grid-cols-2 min-[640px]:grid-cols-4 gap-2.5"
              role="group"
              aria-label={t('groupsPage.preferredTime')}
            >
              {TIMES_OF_DAY.map((time, idx) => {
                const isSelected = state.time === idx;
                return (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setField('time', idx)}
                    aria-pressed={isSelected}
                    className={`relative flex items-center justify-center gap-2 min-h-[56px] px-3.5 rounded-2xl border-2 font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-navy text-brand-yellow border-brand-yellow ring-4 ring-brand-yellow/30 shadow-md -translate-y-0.5 scale-[1.02]'
                        : 'bg-surface-mist text-brand-navy border-brand-navy/15 hover:border-brand-blue hover:bg-white opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Distinctive Checkmark Badge */}
                    {isSelected && (
                      <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center text-[10px] font-black shadow-sm">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                    <FontAwesomeIcon
                      icon={time.icon}
                      className={isSelected ? 'text-brand-yellow text-base' : 'text-brand-blue text-base'}
                    />
                    <span>{t(`groupsPage.times.${time.i18nKey}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {errors.general && (
          <p role="alert" aria-live="assertive" className="text-error font-bold text-sm">
            {errors.general}
          </p>
        )}

        {/* Next Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-black flex items-center justify-center gap-2"
          >
            <span>{t('groupsPage.continue')}</span>
            <FontAwesomeIcon icon={isRtl ? faArrowLeft : faArrowRight} />
          </Button>
        </div>
      </fieldset>

      {/* ==================== STEP 2 ==================== */}
      <fieldset hidden={step !== 1} className={step === 1 ? 'space-y-6 block' : 'hidden'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="rfq-org"
            label={t('groupsPage.groupEntityName')}
            placeholder={t('groupsPage.orgPlaceholder')}
            value={state.org}
            onChange={(e) => setField('org', e.target.value)}
            error={errors.org}
            required
            autoComplete="organization"
          />

          <Input
            id="rfq-nm"
            label={t('groupsPage.contactName')}
            placeholder={t('groupsPage.contactPlaceholder')}
            value={state.nm}
            onChange={(e) => setField('nm', e.target.value)}
            error={errors.nm}
            required
            autoComplete="name"
          />
        </div>

        <Input
          id="rfq-ph"
          label={t('groupsPage.whatsapp')}
          type="tel"
          placeholder={t('groupsPage.phonePlaceholder')}
          value={state.ph}
          onChange={(e) => setField('ph', e.target.value)}
          error={errors.ph}
          required
          autoComplete="tel"
          helperText={t('groupsPage.phoneHelper')}
        />

        {/* Optional Notes */}
        <div>
          <label htmlFor="rfq-notes" className="block font-bold text-sm text-brand-navy mb-1.5">
            {t('groupsPage.notesOptional')}
          </label>
          <textarea
            id="rfq-notes"
            rows={3}
            value={state.notes}
            onChange={(e) => setField('notes', e.target.value)}
            placeholder={t('groupsPage.notesPlaceholder')}
            className="w-full rounded-2xl border-2 border-brand-navy/15 p-3.5 text-sm font-medium focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
          />
        </div>

        {/* Order Summary Strip */}
        <Card variant="default" className="bg-surface-mist border border-brand-blue/20 p-4.5 rounded-2xl">
          <h4 className="font-bold text-sm text-brand-navy mb-2.5 flex items-center gap-2">
            <FontAwesomeIcon icon={faTags} className="text-brand-blue" />
            <span>{t('groupsPage.orderSummary')}</span>
          </h4>
          <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-navy">
            <span className="bg-white px-3 py-1.5 rounded-full border border-brand-navy/10 flex items-center gap-1.5">
              <FontAwesomeIcon icon={currentType.icon} className="text-brand-blue text-xs" />
              <span>{t(`groupsPage.types.${currentType.i18nKey}`)}</span>
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full border border-brand-navy/10 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUsers} className="text-brand-blue text-xs" />
              <span>{state.size} {t('groupsPage.individuals')}</span>
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full border border-brand-navy/10 flex items-center gap-1.5">
              <span>{t(`groupsPage.activities.${currentActivity.i18nKey}`)}</span>
            </span>
            <span className="bg-white px-3 py-1.5 rounded-full border border-brand-navy/10 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-brand-blue text-xs" />
              <span>{t(`destinations.items.${currentDestination.key}.name`)}</span>
            </span>
            {state.date && (
              <span className="bg-white px-3 py-1.5 rounded-full border border-brand-navy/10 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCalendarDays} className="text-brand-blue text-xs" />
                <span>{state.date} · {t(`groupsPage.times.${currentTime.i18nKey}`)}</span>
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-brand-navy/70 font-medium">
            {t('groupsPage.noFixedPriceNotice')}
          </p>
        </Card>

        {/* Error message if any */}
        {errors.general && (
          <p role="alert" aria-live="assertive" className="text-error font-bold text-sm">
            {errors.general}
          </p>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="px-6 py-3 font-bold text-sm flex items-center gap-2"
          >
            <FontAwesomeIcon icon={isRtl ? faArrowRight : faArrowLeft} />
            <span>{t('groupsPage.back')}</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            className="px-8 py-3.5 text-base font-black flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
          >
            <span>{t('groupsPage.sendWhatsApp')}</span>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
