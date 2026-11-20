import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faFacebookF,
  faTiktok,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';
import {
  faLocationDot,
  faCompass,
  faBuilding,
  faMapLocationDot,
  faStar,
  faCircleQuestion,
  faCircleInfo,
  faWater,
  faSailboat,
  faUmbrellaBeach,
  faCity,
  faSun,
  faEnvelope,
  faShieldHalved,
  faVest,
} from '@fortawesome/free-solid-svg-icons';

export default function Footer({ onDestinationClick }) {
  return (
    <footer className="bg-brand-navy text-white p-0 text-start border-t border-white/8 font-body">
      {/* Top Grid */}
      <div className="grid grid-cols-1 min-[901px]:grid-cols-[1.35fr_1fr_1fr_1.25fr] gap-7 min-[901px]:gap-9 px-[5vw] min-[901px]:px-[6vw] pt-9 min-[901px]:pt-14 pb-6 min-[901px]:pb-10 max-w-[1360px] mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-3.5 items-start">
          <a href="#top" className="inline-block">
            <img
              src="https://www.duckegy.com/logo-transparent.png"
              alt="Duck Entertainment"
              width="160"
              height="44"
              className="bg-white py-1 px-3 rounded-full h-10 w-auto"
            />
          </a>
          <p className="text-sm text-white/78 leading-[1.65] max-w-[38ch] m-0">
            المنصة المصرية الأولى المتخصصة في سياحة وتجارب الرياضات المائية على نيل وبحر مصر. كاياك، ستاند أب بادل، ودراجات مائية بأعلى معايير الأمان ومرشدين معتمدين.
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <a
              href="https://www.instagram.com/duck.asw?igsh=d2Nwa2Nqb2t1bXVj&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.facebook.com/share/1AyX9yr91p/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a
              href="https://www.tiktok.com/@duckegy?_t=ZS-8yXR9sJsezl&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a
              href="https://wa.me/201550061006"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-[38px] h-[38px] rounded-full bg-white/8 text-white border border-white/14 flex items-center justify-center text-sm hover:bg-brand-yellow hover:text-brand-navy hover:border-brand-yellow hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            روابط سريعة
          </h4>
          <ul className="grid gap-2.5 list-none p-0 m-0">
            <li>
              <a href="#locations" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faLocationDot} className="text-xs text-brand-yellow opacity-85" />
                الوجهات المميزة
              </a>
            </li>
            <li>
              <a href="#trips" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCompass} className="text-xs text-brand-yellow opacity-85" />
                الرحلات والتجارب
              </a>
            </li>
            <li>
              <a href="#/groups" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faBuilding} className="text-xs text-brand-yellow opacity-85" />
                حجز المجموعات والفعاليات
              </a>
            </li>
            <li>
              <a href="#map" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faMapLocationDot} className="text-xs text-brand-yellow opacity-85" />
                خريطة الفروع واللقاء
              </a>
            </li>
            <li>
              <a href="#reviews" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faStar} className="text-xs text-brand-yellow opacity-85" />
                آراء وتقييمات الضيوف
              </a>
            </li>
            <li>
              <a href="#faq" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleQuestion} className="text-xs text-brand-yellow opacity-85" />
                الأسئلة الشائعة
              </a>
            </li>
            <li>
              <a href="#/about" className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200">
                <FontAwesomeIcon icon={faCircleInfo} className="text-xs text-brand-yellow opacity-85" />
                من نحن ورؤيتنا
              </a>
            </li>
          </ul>
        </div>

        {/* Destinations in Egypt */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            وجهاتنا في مصر
          </h4>
          <ul className="grid gap-2.5 list-none p-0 m-0">
            {[
              { id: 0, label: 'جزيرة أسوان — النيل', icon: faWater },
              { id: 1, label: 'قرية غرب سهيل — النوبة', icon: faSailboat },
              { id: 2, label: 'مرسى مطروح — شاطئ عجيبة', icon: faUmbrellaBeach },
              { id: 3, label: 'الجيزة — كوبري عباس', icon: faCity },
              { id: 4, label: 'واحة سيوة — قريباً', icon: faSun },
            ].map((loc) => (
              <li key={loc.id}>
                <a
                  href="#map"
                  onClick={() => onDestinationClick && onDestinationClick(loc.id)}
                  className="text-white/78 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:-translate-x-1 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={loc.icon} className="text-xs text-brand-yellow opacity-85" />
                  {loc.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Safety */}
        <div>
          <h4 className="text-[17px] font-bold text-white mb-3 min-[901px]:mb-4 relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-8 after:h-[3px] after:rounded-full after:bg-brand-yellow">
            تواصل معنا &amp; الأمان
          </h4>
          <div className="grid gap-3">
            <a
              href="https://wa.me/201550061006"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-white/85 no-underline hover:text-brand-yellow transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5 group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors">
                <FontAwesomeIcon icon={faWhatsapp} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">واتساب وخدمة العملاء</small>
                <span dir="ltr" className="text-[13.5px] font-semibold block">+20 155 006 1006</span>
              </div>
            </a>

            <a
              href="mailto:duck.asw@gmail.com"
              className="flex items-start gap-3 text-white/85 no-underline hover:text-brand-yellow transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5 group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">البريد الإلكتروني</small>
                <span className="text-[13.5px] font-semibold block">duck.asw@gmail.com</span>
              </div>
            </a>

            <div className="flex items-start gap-3 text-white/85">
              <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs text-brand-yellow flex-shrink-0 mt-0.5">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <div>
                <small className="text-[11px] text-white/60 font-medium block">المقر الرئيسي</small>
                <span className="text-[13.5px] font-semibold block">أسوان، جمهورية مصر العربية</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-3.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow bg-white/6 border border-white/10 px-2.5 py-1 rounded-full w-fit">
              <FontAwesomeIcon icon={faShieldHalved} /> إلغاء مجاني قبل ٢٤ ساعة
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-yellow bg-white/6 border border-white/10 px-2.5 py-1 rounded-full w-fit">
              <FontAwesomeIcon icon={faVest} /> سترات نجاة معتمدة ١٠٠٪
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-white/8 bg-black/15 px-[5vw] min-[901px]:px-[6vw] py-4 min-[901px]:py-4.5 pb-[calc(56px+env(safe-area-inset-bottom))] min-[901px]:pb-[calc(18px+env(safe-area-inset-bottom))] flex flex-col min-[901px]:flex-row items-center justify-between gap-2.5 min-[901px]:gap-4 text-xs text-white/60 text-center min-[901px]:text-start">
        <div>
          © 2026 <strong className="text-white font-bold">Duck Entertainment</strong>. جميع الحقوق محفوظة. · <em className="italic">IN DUCK WE TRUST</em> 🦆
        </div>
        <div className="flex items-center justify-center gap-2.5 text-white/75">
          <a href="https://www.duckegy.com/faq#safety" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            معلومات الأمان
          </a>
          <span>·</span>
          <a href="https://www.duckegy.com/faq#booking" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            سياسة الحجز
          </a>
          <span>·</span>
          <a href="https://alefmenu.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors">
            Powered by Alef
          </a>
        </div>
      </div>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/201550061006?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%D8%8C%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A3%D8%B3%D8%A3%D9%84%20%D8%B9%D9%86%20%D8%AD%D8%AC%D8%B2%20%D8%B1%D8%AD%D9%84%D8%A9"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="كلمنا على واتساب"
        className="fixed bottom-6 start-6 z-[90] bg-[#25D366] text-white font-bold text-sm px-4.5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.35)] inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
        <span>واتساب</span>
      </a>
    </footer>
  );
}
