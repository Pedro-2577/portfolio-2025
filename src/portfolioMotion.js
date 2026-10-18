import { nextTick, onMounted, onUnmounted, watch } from 'vue';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pending = new Map();
const running = new Set();
let revealObserver;

function reveal(element, immediately = false) {
  const delay = pending.get(element) || 0;
  pending.delete(element);
  revealObserver?.unobserve(element);
  element.classList.remove('motion-pending');
  element.classList.add('motion-revealed');
  if (immediately || reducedMotion() || !element.animate) return;
  const animation = element.animate(
    [{ opacity: 0, transform: 'translate3d(0, 24px, 0)' }, { opacity: 1, transform: 'translate3d(0, 0, 0)' }],
    { duration: 650, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' },
  );
  running.add(animation);
  const finish = () => { running.delete(animation); animation.cancel(); };
  animation.onfinish = finish;
  animation.oncancel = () => running.delete(animation);
}

export const vReveal = {
  mounted(element, binding) {
    if (reducedMotion() || !('IntersectionObserver' in window) || !element.animate) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
      }, { threshold: 0, rootMargin: '0px 0px -28px 0px' });
    }
    pending.set(element, Math.min(180, Math.max(0, Number(binding.value) || 0)));
    element.classList.add('motion-pending');
    revealObserver.observe(element);
  },
  beforeUnmount(element) {
    pending.delete(element);
    revealObserver?.unobserve(element);
    element.classList.remove('motion-pending');
  },
};

export function usePortfolioMotion(route) {
  let root;
  let aura;
  let glow;
  let pointerFrame = 0;
  let scrollFrame = 0;
  let surface;
  let magnet;
  let pointer;
  let position;
  let motionQuery;
  const ripples = new Set();
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const canFollow = () => finePointer.matches && !reducedMotion();

  function resetSurface() {
    if (!surface) return;
    surface.classList.remove('is-pointer-active');
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
    surface = undefined;
  }

  function resetMagnet() {
    if (!magnet) return;
    magnet.style.removeProperty('--magnet-x');
    magnet.style.removeProperty('--magnet-y');
    magnet = undefined;
  }

  function hidePointer() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    position = undefined;
    pointer = undefined;
    aura?.classList.remove('is-visible', 'is-interactive', 'is-on-dark');
    resetSurface();
    resetMagnet();
  }

  function paintSurface() {
    if (!pointer) return;
    if (surface?.isConnected) {
      const bounds = surface.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      surface.style.setProperty('--pointer-x', (x * 100).toFixed(2) + '%');
      surface.style.setProperty('--pointer-y', (y * 100).toFixed(2) + '%');
      surface.style.setProperty('--tilt-x', ((.5 - y) * 4).toFixed(2) + 'deg');
      surface.style.setProperty('--tilt-y', ((x - .5) * 4).toFixed(2) + 'deg');
      surface.classList.add('is-pointer-active');
    }
    if (magnet?.isConnected) {
      const bounds = magnet.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      magnet.style.setProperty('--magnet-x', ((x - .5) * 5).toFixed(2) + 'px');
      magnet.style.setProperty('--magnet-y', ((y - .5) * 5).toFixed(2) + 'px');
      magnet.style.setProperty('--pointer-x', (x * 100).toFixed(2) + '%');
      magnet.style.setProperty('--pointer-y', (y * 100).toFixed(2) + '%');
    }
  }

  function paintPointer() {
    pointerFrame = 0;
    if (!pointer || !position || !canFollow()) return;
    const dx = pointer.x - position.x;
    const dy = pointer.y - position.y;
    const distance = Math.abs(dx) + Math.abs(dy);
    position.x = distance < .3 ? pointer.x : position.x + dx * .55;
    position.y = distance < .3 ? pointer.y : position.y + dy * .55;
    glow?.style.setProperty('transform', 'translate3d(' + position.x.toFixed(2) + 'px,' + position.y.toFixed(2) + 'px,0)');
    if (pointer.surfaceDirty) {
      paintSurface();
      pointer.surfaceDirty = false;
    }
    if (distance >= .3) pointerFrame = requestAnimationFrame(paintPointer);
  }

  function onPointer(event) {
    if (event.pointerType !== 'mouse' || !canFollow()) return;
    const element = event.target instanceof Element ? event.target : null;
    const nextSurface = element?.closest('.hero-portrait, .project-card:not(.academic-card), .skill-card, .workbench, .contact-method') || null;
    const nextMagnet = element?.closest('.hero-main .button:not(.button-outline), .availability .button') || null;
    if (nextSurface !== surface) { resetSurface(); surface = nextSurface; }
    if (nextMagnet !== magnet) { resetMagnet(); magnet = nextMagnet; }
    pointer = { x: event.clientX, y: event.clientY, surfaceDirty: true };
    if (!position) position = { x: pointer.x, y: pointer.y };
    const control = element?.closest('a, button, summary, input, select, textarea');
    aura?.classList.add('is-visible');
    aura?.classList.toggle('is-interactive', !!control && !control.matches(':disabled'));
    aura?.classList.toggle('is-on-dark', !!element?.closest('.hero, .workbench, .buyer-hero, .buyer-final, .contact-hero, .contact-guide'));
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
  }

  function clearRipples() {
    for (const ripple of [...ripples]) {
      ripple.getAnimations().forEach((animation) => animation.cancel());
      ripple.remove();
    }
    ripples.clear();
  }

  function onPointerDown(event) {
    if (reducedMotion() || event.button !== 0 || !(event.target instanceof Element)) return;
    const control = event.target.closest('.button, .icon-button, .workbench-choices button, .back-to-top');
    if (!control || control.matches(':disabled') || !control.animate) return;
    const bounds = control.getBoundingClientRect();
    const size = Math.max(bounds.width, bounds.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'motion-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - bounds.left - size / 2 + 'px';
    ripple.style.top = event.clientY - bounds.top - size / 2 + 'px';
    control.append(ripple);
    ripples.add(ripple);
    const animation = ripple.animate(
      [{ transform: 'scale(0)', opacity: .25 }, { transform: 'scale(1)', opacity: 0 }],
      { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' },
    );
    const remove = () => { ripple.remove(); ripples.delete(ripple); };
    animation.onfinish = remove;
    animation.oncancel = remove;
  }

  function paintProgress() {
    scrollFrame = 0;
    const length = document.documentElement.scrollHeight - window.innerHeight;
    // A nearly viewport-sized page should not complete the bar after a tiny scroll.
    const minimumScroll = Math.max(320, window.innerHeight * .5);
    const progress = length >= minimumScroll ? Math.max(0, Math.min(1, window.scrollY / length)) : 0;
    root?.style.setProperty('--reading-progress', String(progress));
    root?.classList.toggle('show-back-to-top', window.scrollY > 520);
    root?.style.setProperty('--hero-grid-offset', reducedMotion() ? '0px' : Math.min(64, window.scrollY * .12).toFixed(1) + 'px');
  }

  function scheduleProgress() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(paintProgress);
  }

  function onFocus(event) {
    for (const element of pending.keys()) {
      if (element.contains(event.target)) reveal(element, true);
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Tab') hidePointer();
  }

  function onVisibility() {
    if (document.hidden) { hidePointer(); clearRipples(); }
  }

  function onMotionPreference() {
    if (!canFollow()) hidePointer();
    if (!reducedMotion()) return;
    clearRipples();
    for (const element of [...pending.keys()]) reveal(element, true);
    for (const animation of [...running]) animation.cancel();
    scheduleProgress();
  }

  watch(route, async () => {
    hidePointer();
    clearRipples();
    await nextTick();
    scheduleProgress();
  });

  onMounted(() => {
    root = document.querySelector('.app-shell');
    aura = root?.querySelector('.cursor-aura');
    glow = aura?.querySelector('.cursor-aura-glow');
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    root?.addEventListener('pointermove', onPointer, { passive: true });
    root?.addEventListener('pointerdown', onPointerDown, { passive: true });
    root?.addEventListener('pointerleave', hidePointer);
    root?.addEventListener('focusin', onFocus);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', hidePointer);
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    motionQuery.addEventListener('change', onMotionPreference);
    finePointer.addEventListener('change', onMotionPreference);
    scheduleProgress();
  });

  onUnmounted(() => {
    root?.removeEventListener('pointermove', onPointer);
    root?.removeEventListener('pointerdown', onPointerDown);
    root?.removeEventListener('pointerleave', hidePointer);
    root?.removeEventListener('focusin', onFocus);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('blur', hidePointer);
    window.removeEventListener('scroll', scheduleProgress);
    window.removeEventListener('resize', scheduleProgress);
    motionQuery?.removeEventListener('change', onMotionPreference);
    finePointer.removeEventListener('change', onMotionPreference);
    hidePointer();
    clearRipples();
    cancelAnimationFrame(scrollFrame);
    for (const element of [...pending.keys()]) reveal(element, true);
    for (const animation of [...running]) animation.cancel();
    revealObserver?.disconnect();
    revealObserver = undefined;
  });
}
