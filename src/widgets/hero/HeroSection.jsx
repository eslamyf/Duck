import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroVideoDesktop from '../../shared/assets/Videos/hero-v2.mp4';
import heroVideoMobile from '../../shared/assets/Videos/hero-mobile.mp4';
import heroPosterDesktop from '../../shared/assets/images/hero-poster-desktop.webp';
import heroPosterMobile from '../../shared/assets/images/hero-poster-mobile.webp';
import { useTranslation } from '../../shared/i18n/index.js';
import { ROUTES, SECTIONS, sectionLink } from '../../shared/config/routes.js';
import { DuckManifesto, DuckIcon } from '../../shared/ui/index.js';

export default function HeroSection() {
  const { lang, t } = useTranslation();
  const [videoTarget, setVideoTarget] = useState(null); // 'desktop' | 'mobile' | null
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const isRtl = lang === 'ar';
  const ArrowIcon = isRtl ? 'faArrowLeft' : 'faArrowRight';

  // Performance & Accessibility Guard:
  // Defer background video stream until idle and skip under reduced motion / slow network
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMotion = () => mediaQuery.matches;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection =
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '3g';

    if (checkMotion() || isSaveData || isSlowConnection) {
      return undefined;
    }

    const handleMotionChange = (e) => {
      if (e.matches) {
        setVideoError(true);
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    let loaded = false;
    let timerId = null;
    const startVideoLoad = () => {
      if (loaded) return;
      if (!checkMotion() && !isSaveData && !isSlowConnection) {
        loaded = true;
        setVideoTarget(window.innerWidth > 900 ? 'desktop' : 'mobile');
      }
    };

    const onResize = () => {
      if (loaded) {
        setVideoTarget(window.innerWidth > 900 ? 'desktop' : 'mobile');
      }
    };

    const onInteract = () => {
      startVideoLoad();
    };

    const triggerVideo = () => {
      timerId = setTimeout(startVideoLoad, 4500);
      window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
      window.addEventListener('scroll', onInteract, { once: true, passive: true });
      window.addEventListener('keydown', onInteract, { once: true, passive: true });
      window.addEventListener('resize', onResize, { passive: true });
    };

    if (document.readyState === 'complete') {
      triggerVideo();
    } else {
      window.addEventListener('load', triggerVideo, { once: true });
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('load', triggerVideo);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Pause video when scrolled out of view, resume when visible
  useEffect(() => {
    if (!videoTarget || !sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => { });
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
  }, [videoTarget]);

  // Directional gradient stays strictly behind text edge and fades to 0% before screen center,
  // keeping the kayaker and Nile river colors clean and unclouded.
  const directionalScrim = isRtl
    ? 'max-[900px]:hidden min-[901px]:bg-gradient-to-l min-[901px]:from-brand-navy/82 min-[901px]:from-0% min-[901px]:via-brand-navy/45 min-[901px]:via-30% min-[901px]:to-transparent min-[901px]:to-50%'
    : 'max-[900px]:hidden min-[901px]:bg-gradient-to-r min-[901px]:from-brand-navy/82 min-[901px]:from-0% min-[901px]:via-brand-navy/45 min-[901px]:via-30% min-[901px]:to-transparent min-[901px]:to-50%';

  return (
    <section
      id={SECTIONS.TOP}
      ref={sectionRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full bg-surface-white font-body scroll-mt-[var(--header-offset)]"
      aria-label="Hero"
    >
      {/* Clean White Canvas Wrapper framing the Floating Cinematic Video (all 4 corners visible below fixed navbar) */}
      <div className="px-3 pt-4 pb-6 sm:px-5 min-[901px]:px-[4vw] min-[901px]:pt-6 min-[901px]:pb-8">
        <div
          data-hero-frame="true"
          className="relative isolate [transform:translateZ(0)] mx-auto max-w-[1400px] w-full min-h-[68vh] min-[901px]:min-h-[min(620px,calc(100svh-185px))] overflow-hidden rounded-3xl min-[901px]:rounded-[28px] border border-brand-navy/10 bg-brand-navy text-white shadow-hero-frame flex items-end min-[901px]:items-center"
        >
          {/* Full-Bleed Background Media (HD Poster + Deferred HD Responsive Video) */}
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] bg-brand-navy" aria-hidden="true">
            <picture className="absolute inset-0 w-full h-full rounded-[inherit]">
              <source media="(min-width: 901px)" srcSet={heroPosterDesktop} width={1080} height={560} />
              <source media="(max-width: 900px)" srcSet={heroPosterMobile} width={600} height={800} />
              <img
                src={heroPosterDesktop}
                alt={t('hero.videoPosterAlt')}
                width={1080}
                height={560}
                fetchPriority="high"
                decoding="sync"
                className="w-full h-full rounded-[inherit] object-cover object-[center_56%] contrast-[1.06] saturate-[1.12] [transform:translateZ(0)]"
              />
            </picture>

            {videoTarget && !videoError ? (
              <video
                key={videoTarget}
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                onPlaying={() => setIsVideoPlaying(true)}
                onError={() => setVideoError(true)}
                className={`absolute inset-0 w-full h-full rounded-[inherit] object-cover object-[center_56%] contrast-[1.06] saturate-[1.12] [transform:translateZ(0)] transition-opacity duration-700 ${isVideoPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <source
                  src={videoTarget === 'desktop' ? heroVideoDesktop : heroVideoMobile}
                  type="video/mp4"
                />
              </video>
            ) : null}

            {/* Smart Directional Scrim (Desktop: start-edge behind text only, fades before center) */}
            <div className={`absolute inset-0 z-[1] ${directionalScrim} pointer-events-none`} />

            {/* Soft Bottom Vignette for Mobile Readability Only */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-brand-navy/88 from-0% via-brand-navy/50 via-35% to-transparent to-60% pointer-events-none min-[901px]:hidden" />
          </div>

          {/* Foreground Content Aligned to Start Edge */}
          <div className="relative z-10 w-full max-w-[700px] px-5 pt-24 pb-10 sm:px-9 sm:py-14 min-[901px]:px-14 min-[901px]:py-16">
            {/* Editorial River-Wave & Decal Manifesto */}
            <DuckManifesto
              text={t('hero.tag')}
              theme="dark"
              align="start"
              className="mb-4 sm:mb-5"
            />

            {/* Bold Headline with Yellow Highlight */}
            <h1 className="font-heading text-[clamp(28px,4.6vw,58px)] font-extrabold leading-[1.2] tracking-tight mb-4 text-white drop-shadow-sm">
              {t('hero.titlePart1')}
              <span className="text-brand-yellow">{t('hero.titleHighlight')}</span>
              {t('hero.titlePart2')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base min-[901px]:text-lg text-white/95 leading-[1.75] max-w-[54ch] mb-6 min-[901px]:mb-8 drop-shadow-sm">
              {t('hero.desc')}
            </p>

            {/* Primary & Secondary Glass CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={sectionLink(SECTIONS.TRIPS)}
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] min-[901px]:min-h-[52px] px-6 sm:px-7 rounded-full bg-brand-yellow text-brand-navy font-extrabold text-sm sm:text-base hover:bg-brand-yellow-hover hover:-translate-y-0.5 transition-all shadow-ocean active:translate-y-0"
              >
                <span>{t('hero.ctaTrips')}</span>
                <DuckIcon icon={ArrowIcon} className="text-sm" aria-hidden="true" />
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
      <div className="bg-surface-mist border-y border-brand-blue/16 px-[5vw] min-[901px]:px-[6vw] py-5 min-[901px]:py-7">
        <ul
          className="grid grid-cols-3 gap-3 min-[901px]:gap-6 max-w-[1200px] mx-auto text-center list-none m-0 p-0"
          aria-label="Platform Statistics"
        >
          <li>
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat1Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/80 font-medium mt-1 block">
              {t('hero.stat1Label')}
            </span>
          </li>

          <li>
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat2Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/80 font-medium mt-1 block">
              {t('hero.stat2Label')}
            </span>
          </li>

          <li>
            <b className="block text-2xl min-[901px]:text-3xl lg:text-4xl font-bold text-brand-blue leading-tight">
              {t('hero.stat3Number')}
            </b>
            <span className="text-xs min-[901px]:text-sm text-brand-navy/80 font-medium mt-1 block">
              {t('hero.stat3Label')}
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
