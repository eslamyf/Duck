import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import heroVideoDesktop from '../../shared/assets/Videos/hero-desktop.mp4';
import heroVideoMobile from '../../shared/assets/Videos/hero-mobile.mp4';
import heroPosterDesktop from '../../shared/assets/images/hero-poster-desktop.webp';
import heroPosterMobile from '../../shared/assets/images/hero-poster-mobile.webp';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';

export default function HeroSection() {
  const { lang, t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 900 : true
  );
  const [videoError, setVideoError] = useState(() => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection =
      connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    return mediaQuery.matches || isSaveData || isSlowConnection;
  });
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? faArrowLeft : faArrowRight;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Performance & Accessibility Guard:
  // Defer background video stream until idle and skip under reduced motion / slow network
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMotion = () => mediaQuery.matches;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection =
      connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';

    if (checkMotion() || isSaveData || isSlowConnection) {
      return undefined;
    }

    const handleMotionChange = (e) => {
      if (e.matches) {
        setVideoError(true);
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    const startVideoLoad = () => {
      if (!checkMotion() && !isSaveData && !isSlowConnection) {
        setShouldLoadVideo(true);
      }
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(startVideoLoad, { timeout: 1500 });
      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange);
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    const timerId = setTimeout(startVideoLoad, 1000);
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      clearTimeout(timerId);
    };
  }, []);

  // Pause video when scrolled out of view, resume when visible
  useEffect(() => {
    if (!shouldLoadVideo || !sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [shouldLoadVideo]);

  const directionalScrim = isRtl
    ? 'bg-gradient-to-l from-brand-navy/92 via-brand-navy/68 to-brand-navy/15'
    : 'bg-gradient-to-r from-brand-navy/92 via-brand-navy/68 to-brand-navy/15';

  return (
    <section
      ref={sectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full bg-brand-navy font-body"
      aria-label="Hero"
    >
      {/* Navy Outer Margin Wrapper framing the Full-Width Cinematic Video */}
      <div className="px-3 pt-2 pb-4 sm:px-5 sm:pt-3 sm:pb-5 min-[901px]:px-[4vw] min-[901px]:pt-4 min-[901px]:pb-7">
        <div
          id="top"
          className="relative mx-auto max-w-[1400px] w-full min-h-[75vh] min-[901px]:min-h-[calc(100svh-180px)] overflow-hidden rounded-3xl min-[901px]:rounded-[30px] border border-white/15 bg-brand-navy text-white shadow-ocean flex items-end min-[901px]:items-center"
        >
          {/* Full-Bleed Background Media (Poster + Deferred Responsive Video) */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy" aria-hidden="true">
            <picture className="absolute inset-0 w-full h-full">
              <source media="(min-width: 901px)" srcSet={heroPosterDesktop} />
              <source media="(max-width: 900px)" srcSet={heroPosterMobile} />
              <img
                src={heroPosterDesktop}
                alt={t('hero.videoPosterAlt')}
                width={isDesktop ? 1400 : 400}
                height={isDesktop ? 760 : 824}
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </picture>

            {shouldLoadVideo && !videoError ? (
              <video
                key={isDesktop ? 'desktop-video' : 'mobile-video'}
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={isDesktop ? heroPosterDesktop : heroPosterMobile}
                onPlaying={() => setIsVideoPlaying(true)}
                onError={() => setVideoError(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  isVideoPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <source
                  src={isDesktop ? heroVideoDesktop : heroVideoMobile}
                  type="video/mp4"
                />
              </video>
            ) : null}

            {/* Directional Gradient Scrim (WCAG AAA contrast over text start side) */}
            <div className={`absolute inset-0 z-[1] ${directionalScrim} pointer-events-none`} />

            {/* Soft Bottom Vignette for Mobile Readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent pointer-events-none min-[901px]:from-brand-navy/55 min-[901px]:via-transparent" />
          </div>

          {/* Foreground Content Aligned to Start Edge */}
          <div className="relative z-10 w-full max-w-[700px] px-5 pt-24 pb-10 sm:px-9 sm:py-14 min-[901px]:px-14 min-[901px]:py-16">
            {/* Brand Badge with Glowing Yellow Dot */}
            <div className="inline-flex items-center gap-2.5 w-fit px-4 py-1.5 rounded-full bg-brand-navy/80 border border-brand-yellow/40 backdrop-blur-md text-brand-yellow text-xs font-extrabold tracking-[0.18em] mb-4 uppercase shadow-card">
              <span
                className="h-2 w-2 rounded-full bg-brand-yellow animate-pulse"
                aria-hidden="true"
              />
              <span lang="en" dir="ltr">{t('hero.tag')}</span>
            </div>

            {/* Bold Headline with Yellow Highlight */}
            <h1 className="font-heading text-[clamp(28px,4.6vw,58px)] font-extrabold leading-[1.2] tracking-tight mb-4 text-white drop-shadow-sm">
              {t('hero.titlePart1')}
              <span className="text-brand-yellow">{t('hero.titleHighlight')}</span>
              {t('hero.titlePart2')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base min-[901px]:text-lg text-white/90 leading-[1.75] max-w-[54ch] mb-6 min-[901px]:mb-8">
              {t('hero.desc')}
            </p>

            {/* Primary & Secondary Glass CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={sectionLink(SECTIONS.TRIPS)}
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] min-[901px]:min-h-[52px] px-6 sm:px-7 rounded-full bg-brand-yellow text-brand-navy font-extrabold text-sm sm:text-base hover:bg-brand-yellow-hover hover:-translate-y-0.5 transition-all shadow-ocean active:translate-y-0"
              >
                <span>{t('hero.ctaTrips')}</span>
                <FontAwesomeIcon icon={ArrowIcon} className="text-sm" aria-hidden="true" />
              </Link>

              <Link
                to={ROUTES.BOOKING}
                className="inline-flex items-center justify-center min-h-[48px] min-[901px]:min-h-[52px] px-6 sm:px-7 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/45 font-bold text-sm sm:text-base hover:bg-white/20 transition-all active:bg-white/25"
              >
                {t('hero.ctaBook')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Strip under Hero */}
      <div
        className="bg-surface-mist border-y border-brand-blue/16 px-[5vw] min-[901px]:px-[6vw] py-5 min-[901px]:py-7"
        role="list"
        aria-label="Platform Statistics"
      >
        <div className="grid grid-cols-3 gap-3 min-[901px]:gap-6 max-w-[1200px] mx-auto text-center">
          <div role="listitem">
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat1Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/75 font-medium mt-1 block">
              {t('hero.stat1Label')}
            </span>
          </div>

          <div role="listitem">
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat2Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/75 font-medium mt-1 block">
              {t('hero.stat2Label')}
            </span>
          </div>

          <div role="listitem">
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat3Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/75 font-medium mt-1 block">
              {t('hero.stat3Label')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
