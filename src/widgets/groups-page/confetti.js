/**
 * Lightweight celebratory confetti generator
 * Automatically disabled if user has prefers-reduced-motion set
 */
export function burstConfetti() {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  const palette = ['#FDFB45', '#147D9F', '#ffffff', '#ff7a59', '#2ec4b6'];
  const count = 38;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'fixed pointer-events-none z-[300] rounded-xs';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = '-20px';
    el.style.width = `${8 + Math.random() * 8}px`;
    el.style.height = `${12 + Math.random() * 10}px`;
    el.style.backgroundColor = palette[i % palette.length];
    el.style.transition = 'transform 2.6s linear, opacity 2.6s ease-out';
    el.style.transform = `translateY(0) rotate(0deg)`;
    el.style.opacity = '1';

    document.body.appendChild(el);

    // Trigger falling animation in next frame
    requestAnimationFrame(() => {
      const delay = Math.random() * 0.4;
      setTimeout(() => {
        const fallDist = window.innerHeight + 100;
        const rotate = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 720);
        el.style.transform = `translateY(${fallDist}px) rotate(${rotate}deg)`;
        el.style.opacity = '0';
      }, delay * 1000);
    });

    // Cleanup
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 3200);
  }
}
