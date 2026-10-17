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
  let pointerFrame = 0;
  let scrollFrame = 0;
  let surface;
  let pointer;
  let motionQuery;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  function resetSurface() {
    if (!surface) return;
    surface.classList.remove('is-pointer-active');
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
    surface = undefined;
  }

  function paintPointer() {
    pointerFrame = 0;
    if (!surface || !pointer || !surface.isConnected) return;
    const bounds = surface.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
    surface.style.setProperty('--pointer-x', (x * 100).toFixed(2) + '%');
    surface.style.setProperty('--pointer-y', (y * 100).toFixed(2) + '%');
    surface.style.setProperty('--tilt-x', ((.5 - y) * 4).toFixed(2) + 'deg');
    surface.style.setProperty('--tilt-y', ((x - .5) * 4).toFixed(2) + 'deg');
    surface.classList.add('is-pointer-active');
  }

  function onPointer(event) {
    if (event.pointerType !== 'mouse' || !finePointer.matches || reducedMotion()) return;
    const target = event.target instanceof Element
      ? event.target.closest('.hero-portrait, .project-card:not(.academic-card), .skill-card, .workbench')
      : null;
    if (target !== surface) { resetSurface(); surface = target; }
    if (!surface) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
  }

  function paintProgress() {
    scrollFrame = 0;
    const length = document.documentElement.scrollHeight - window.innerHeight;
    root?.style.setProperty('--reading-progress', String(length > 0 ? Math.max(0, Math.min(1, window.scrollY / length)) : 0));
  }

  function scheduleProgress() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(paintProgress);
  }

  function onFocus(event) {
    for (const element of pending.keys()) {
      if (element.contains(event.target)) reveal(element, true);
    }
  }

  function onMotionPreference() {
    if (!reducedMotion()) return;
    resetSurface();
    for (const element of [...pending.keys()]) reveal(element, true);
    for (const animation of [...running]) animation.cancel();
  }

  watch(route, async () => {
    resetSurface();
    await nextTick();
    scheduleProgress();
  });

  onMounted(() => {
    root = document.querySelector('.app-shell');
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    root?.addEventListener('pointermove', onPointer, { passive: true });
    root?.addEventListener('pointerleave', resetSurface);
    root?.addEventListener('focusin', onFocus);
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    motionQuery.addEventListener('change', onMotionPreference);
    scheduleProgress();
  });

  onUnmounted(() => {
    root?.removeEventListener('pointermove', onPointer);
    root?.removeEventListener('pointerleave', resetSurface);
    root?.removeEventListener('focusin', onFocus);
    window.removeEventListener('scroll', scheduleProgress);
    window.removeEventListener('resize', scheduleProgress);
    motionQuery?.removeEventListener('change', onMotionPreference);
    cancelAnimationFrame(pointerFrame);
    cancelAnimationFrame(scrollFrame);
    for (const element of [...pending.keys()]) reveal(element, true);
    for (const animation of [...running]) animation.cancel();
    revealObserver?.disconnect();
    revealObserver = undefined;
    resetSurface();
  });
}
