import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faPaperPlane,
  faTags,
  faUsers,
  faCalendarDays,
  faLocationDot,
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
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 min-h-[76px] rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md -translate-y-1'
                      : 'bg-white text-brand-navy border-brand-navy/15 hover:border-brand-blue hover:bg-surface-mist'
                  }`}
                >
                  <FontAwesomeIcon icon={type.icon} className={`text-xl ${isSelected ? 'text-brand-yellow' : 'text-brand-blue'}`} />
                  <span className="font-bold text-xs min-[901px]:text-sm text-center leading-tight">
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

        {/* Activities Selector */}
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
                  className={`flex flex-col items-center justify-center p-2.5 min-h-[96px] rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md -translate-y-1'
                      : 'bg-white text-brand-navy border-brand-navy/15 hover:border-brand-blue hover:bg-surface-mist'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden mb-1.5 border border-brand-navy/15 flex-shrink-0 shadow-2xs">
                    <img
                      src={act.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-xs min-[901px]:text-sm text-center leading-tight">
                    {t(`groupsPage.activities.${act.i18nKey}`)}
                  </span>
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
                  className={`group relative overflow-hidden flex flex-col items-center justify-end p-2.5 min-h-[82px] min-[901px]:min-h-[88px] rounded-2xl border-2 transition-all duration-200 cursor-pointer text-white shadow-sm ${
                    isSelected
                      ? 'border-brand-yellow ring-2 ring-brand-yellow/40 shadow-lg -translate-y-1'
                      : 'border-white/20 hover:border-brand-yellow/60 hover:scale-[1.02]'
                  }`}
                >
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
                        ? 'bg-gradient-to-t from-brand-navy/95 via-brand-navy/65 to-brand-navy/35'
                        : 'bg-gradient-to-t from-brand-navy/90 via-brand-navy/55 to-black/30 group-hover:from-brand-navy/80'
                    }`}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
                    <span
                      className={`font-bold text-xs min-[901px]:text-sm drop-shadow-md leading-tight transition-colors ${
                        isSelected ? 'text-brand-yellow font-black' : 'text-white'
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
                    className={`flex items-center justify-center gap-2 min-h-[56px] px-3.5 rounded-2xl border-2 font-bold text-xs min-[901px]:text-sm transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-brand-navy text-brand-yellow border-brand-navy shadow-md -translate-y-0.5'
                        : 'bg-surface-mist text-brand-navy border-brand-navy/15 hover:border-brand-blue hover:bg-white'
                    }`}
                  >
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

        {/* Step 1 CTA */}
        <div className="pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleNext}
            icon={<FontAwesomeIcon icon={isRtl ? faArrowLeft : faArrowRight} />}
            iconPosition="end"
            className="font-black text-lg shadow-md"
          >
            {t('groupsPage.nextStep')}
          </Button>
        </div>
      </fieldset>

      {/* ==================== STEP 2 ==================== */}
      <fieldset hidden={step !== 1} className={step === 1 ? 'space-y-6 block' : 'hidden'}>
        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="rfq-org"
            label={t('groupsPage.orgLabel')}
            placeholder={t('groupsPage.orgPlaceholder')}
            value={state.org}
            onChange={(e) => setField('org', e.target.value)}
            error={errors.org}
            autoComplete="organization"
            required
          />

          <Input
            id="rfq-name"
            label={t('groupsPage.coordinatorLabel')}
            placeholder={t('groupsPage.coordinatorPlaceholder')}
            value={state.nm}
            onChange={(e) => setField('nm', e.target.value)}
            error={errors.nm}
            autoComplete="name"
            required
          />

          <Input
            id="rfq-phone"
            type="tel"
            dir="ltr"
            inputMode="tel"
            label={t('groupsPage.whatsappLabel')}
            placeholder="+20 100 000 0000"
            value={state.ph}
            onChange={(e) => setField('ph', e.target.value)}
            error={errors.ph}
            autoComplete="tel"
            required
          />
        </div>

        {/* Size and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="rfq-exact-count"
            type="number"
            min={20}
            max={150}
            inputMode="numeric"
            label={t('groupsPage.exactCountLabel')}
            value={state.size}
            onChange={(e) => setSize(e.target.value)}
            error={errors.size}
            required
          />

          <Input
            id="rfq-notes"
            as="textarea"
            rows={2}
            label={t('groupsPage.notesLabel')}
            placeholder={t('groupsPage.notesPlaceholder')}
            value={state.nt}
            onChange={(e) => setField('nt', e.target.value)}
          />
        </div>

        {/* Live Trip Summary */}
        <Card variant="subtle" className="p-4 rounded-2xl border-2 border-dashed border-brand-blue/30 bg-surface-mist">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-brand-navy">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-brand-blue" />
              <span>
                <b>{Number(state.size).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {t('groupsPage.individuals')}</b> · {t(`groupsPage.types.${currentType.i18nKey}`)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-brand-blue" />
              <span>
                {t(`groupsPage.activities.${currentActivity.i18nKey}`)} · {t(`destinations.items.${currentDestination.key}.name`)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <FontAwesomeIcon icon={faCalendarDays} className="text-brand-blue" />
              <span>
                {state.date} · {t(`groupsPage.times.${currentTime.i18nKey}`)}
              </span>
            </div>
          </div>
        </Card>

        {/* No fixed price discount guarantee notice */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-brand-yellow/30 border-2 border-brand-yellow text-brand-navy font-bold text-xs min-[901px]:text-sm">
          <FontAwesomeIcon icon={faTags} className="text-lg text-brand-navy flex-shrink-0" />
          <span>{t('groupsPage.dealNote')}</span>
        </div>

        {/* Error message */}
        {errors.general && (
          <p role="alert" aria-live="assertive" className="text-error font-bold text-sm">
            {errors.general}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleBack}
            icon={<FontAwesomeIcon icon={isRtl ? faArrowRight : faArrowLeft} />}
            iconPosition="start"
            className="border-2 border-brand-navy text-brand-navy hover:bg-surface-mist font-bold"
          >
            {t('groupsPage.backBtn')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
            iconPosition="start"
            className="font-black text-lg shadow-md flex-1"
          >
            {t('groupsPage.submitBtn')}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
