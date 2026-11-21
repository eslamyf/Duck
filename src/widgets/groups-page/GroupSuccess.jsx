import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import duckIcon from '../../shared/assets/icons/Artboard_8-removebg-preview.png';
import { Button } from '../../shared/ui/index.js';

export default function GroupSuccess({
  refCode,
  waUrl,
  onEditAgain,
  t,
}) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4 space-y-5 animate-in fade-in zoom-in-95 duration-300" role="status" aria-live="polite">
      {/* Duck Avatar Badge */}
      <div className="w-24 h-24 rounded-full bg-brand-yellow flex items-center justify-center p-3 shadow-lg animate-bounce" style={{ animationDuration: '2.5s' }}>
        <img
          src={duckIcon}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Success Title */}
      <h2 className="text-2xl min-[901px]:text-3xl font-black text-brand-navy">
        {t('groupsPage.successTitle')}
      </h2>

      {/* Quote Ref */}
      <div className="inline-block bg-brand-navy text-brand-yellow px-5 py-1.5 rounded-full font-mono text-base font-bold tracking-wider" dir="ltr">
        {refCode}
      </div>

      {/* Friendly Description */}
      <p className="max-w-[460px] text-brand-navy/80 text-sm min-[901px]:text-base font-medium leading-relaxed">
        {t('groupsPage.successDesc')}
      </p>

      {/* Primary WhatsApp Action */}
      <div className="pt-2 w-full max-w-[340px]">
        <Button
          as="a"
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="lg"
          fullWidth
          icon={<FontAwesomeIcon icon={faWhatsapp} className="text-xl" />}
          className="font-black text-lg shadow-[0_8px_24px_rgba(37,211,102,0.35)]"
        >
          {t('groupsPage.continueOnWhatsapp')}
        </Button>
      </div>

      {/* Edit Request Link */}
      <button
        type="button"
        onClick={onEditAgain}
        className="text-brand-blue font-bold text-sm underline hover:text-brand-navy cursor-pointer transition-colors pt-1"
      >
        {t('groupsPage.editRequest')}
      </button>
    </div>
  );
}
