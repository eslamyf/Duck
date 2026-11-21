import { useState, useRef, useEffect } from 'react';
import heroVideoDesktop from '../../shared/assets/Videos/hero-desktop.mp4';
import heroVideoMobile from '../../shared/assets/Videos/hero-mobile.mp4';
import heroPosterDesktop from '../../shared/assets/images/hero-poster-desktop.webp';
import heroPosterMobile from '../../shared/assets/images/hero-poster-mobile.webp';
import { useTranslation } from '../../shared/i18n/index.js';

export default function HeroSection() {
  const { lang, t } = useTranslation();
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > 900 : true));
  const [videoError, setVideoError] = useState(() => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
    return mediaQuery.matches || isSaveData || isSlowConnection;
  });
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Performance & Accessibility Guard:
  // - prefers-reduced-motion
  // - navigator.connection.saveData
  // - 2g or slow-2g connections
  // If any of these apply, never load the video and stick to the high-performance poster.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const checkMotion = () => mediaQuery.matches;

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSaveData = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';

    if (checkMotion() || isSaveData || isSlowConnection) {
      return;
    }

    const handleMotionChange = (e) => {
      if (e.matches) {
        setVideoError(true);
      }
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // Defer video loading until browser is idle or after initial render to maximize LCP
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
    } else {
      const timerId = setTimeout(startVideoLoad, 1000);
      return () => {
        mediaQuery.removeEventListener('change', handleMotionChange);
        clearTimeout(timerId);
      };
    }
  }, []);

  // IntersectionObserver: Pause video when scrolled out of view, resume when visible
  useEffect(() => {
    if (!shouldLoadVideo || !sectionRef.current) return;

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

  // Diagonal clip paths matching Final_4.html
  const outerClipPath = isDesktop
    ? isRtl
      ? 'polygon(0 0, 100% 0, 84% 100%, 0 100%)'
      : 'polygon(0 0, 100% 0, 100% 100%, 16% 100%)'
    : 'none';

  const innerClipPath = isDesktop
    ? isRtl
      ? 'polygon(0 0, calc(100% - 12px) 0, calc(84% - 12px) 100%, 0 100%)'
      : 'polygon(12px 0, 100% 0, 100% 100%, calc(16% + 12px) 100%)'
    : 'none';

  return (
    <section ref={sectionRef} className="relative w-full bg-brand-navy font-body" aria-label="Hero">
      {/* Hero Visual Container */}
      <div
        id="top"
        className="relative overflow-hidden bg-brand-navy text-white min-h-[calc(100svh-52px)] min-[901px]:min-h-[calc(100svh-100px)] flex flex-col justify-end min-[901px]:grid min-[901px]:grid-cols-[1fr_1.15fr]"
      >
        {/* Content Column */}
        <div className="relative z-10 flex flex-col justify-center px-[5vw] min-[901px]:px-[6vw] min-[901px]:pe-[2vw] pt-14 pb-12 min-[901px]:py-20">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 w-fit px-3.5 py-1.5 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-bold tracking-[0.18em] mb-4 uppercase">
            <span lang="en" dir="ltr">{t('hero.tag')}</span>
          </div>

          {/* Heading with Brand Highlight */}
          <h1 className="text-[clamp(32px,5vw,62px)] font-bold leading-[1.22] tracking-tight mb-4 text-white">
            {t('hero.titlePart1')}
            <mark className="bg-transparent bg-gradient-to-t from-brand-yellow to-brand-yellow bg-[length:100%_24%] bg-no-repeat bg-bottom text-inherit font-bold">
              {t('hero.titleHighlight')}
            </mark>
            {t('hero.titlePart2')}
          </h1>

          {/* Description */}
          <p className="text-base min-[901px]:text-lg text-white/90 leading-[1.75] max-w-[520px] mb-6 min-[901px]:mb-8">
            {t('hero.desc')}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#trips"
              className="inline-flex items-center justify-center min-h-[50px] min-[901px]:min-h-[52px] px-7 rounded-full bg-brand-yellow text-brand-navy font-bold text-base hover:bg-brand-yellow-hover hover:-translate-y-0.5 transition-all shadow-[0_12px_32px_rgba(12,18,38,0.08)] active:translate-y-0"
            >
              {t('hero.ctaTrips')}
            </a>
            <a
              href="#trips"
              className="inline-flex items-center justify-center min-h-[50px] min-[901px]:min-h-[52px] px-7 rounded-full bg-transparent text-white border border-white/45 font-semibold text-base hover:bg-white/15 transition-all active:bg-white/20"
            >
              {t('hero.ctaBook')}
            </a>
          </div>
        </div>

        {/* Media Column (Desktop Diagonal Cut / Mobile Full-Bleed Stack) */}
        <div className="absolute inset-0 min-[901px]:relative min-[901px]:inset-auto overflow-hidden">
          {/* Yellow Divider Line (Desktop only) */}
          {isDesktop && (
            <div
              className="absolute inset-0 z-[2] bg-brand-yellow pointer-events-none transition-all duration-300"
              style={{ clipPath: outerClipPath }}
              aria-hidden="true"
            />
          )}

          {/* Masked Video/Image Wrapper */}
          <div
            className="absolute inset-0 z-[3] bg-brand-navy overflow-hidden transition-all duration-300"
            style={{ clipPath: innerClipPath }}
          >
            {/* Dark gradient overlay for mobile readability */}
            <div
              className="absolute inset-0 z-[4] min-[901px]:hidden bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Subtle marine overlay on desktop */}
            <div
              className="hidden min-[901px]:block absolute inset-0 z-[4] bg-gradient-to-b from-[rgba(12,18,38,0.12)] to-[rgba(20,125,159,0.24)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Poster / Primary LCP Element (Responsive picture for instant visual paint) */}
            <picture className="absolute inset-0 w-full h-full">
              <source media="(min-width: 901px)" srcSet={heroPosterDesktop} />
              <source media="(max-width: 900px)" srcSet={heroPosterMobile} />
              <img
                src={heroPosterDesktop}
                alt={t('hero.videoPosterAlt')}
                width={isDesktop ? 960 : 400}
                height={isDesktop ? 960 : 824}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>

            {/* Deferred HTML5 Background Video */}
            {shouldLoadVideo && !videoError ? (
              <video
                key={isDesktop ? 'desktop-video' : 'mobile-video'}
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onPlaying={() => setIsVideoPlaying(true)}
                onError={() => setVideoError(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  isVideoPlaying ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              >
                <source
                  src={isDesktop ? heroVideoDesktop : heroVideoMobile}
                  type="video/mp4"
                />
              </video>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stats Strip under Hero (Matching Final_4.html .st) */}
      <div
        className="bg-surface-mist border-y border-[rgba(20,125,159,0.16)] px-[5vw] min-[901px]:px-[6vw] py-5 min-[901px]:py-7"
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
