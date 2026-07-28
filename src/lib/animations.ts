import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initPageMotion() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const hero = document.querySelector<HTMLElement>('.hero-stage');
  if (!hero) return;
  const moments = gsap.utils.toArray<HTMLElement>('.story-moment');
  const foods = gsap.utils.toArray<HTMLElement>('.floating-food');

  gsap.set(moments, { autoAlpha: 0, y: 35 });
  gsap.set(moments[0], { autoAlpha: 1, y: 0 });

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1, pin: '.hero-pin', anticipatePin: 1 }
  });
  moments.forEach((moment, index) => {
    if (index === 0) return;
    const at = index * 1.35;
    timeline.to(moments[index - 1], { autoAlpha: 0, y: -30, duration: .45 }, at)
      .to(moment, { autoAlpha: 1, y: 0, duration: .6 }, at + .16);
  });
  timeline.to(moments.at(-1)!, { autoAlpha: 0, y: -25, duration: .5 }, 6.55);

  foods.forEach((food, index) => {
    const x = Number(food.dataset.x || 0);
    const y = Number(food.dataset.y || -100);
    const rotation = Number(food.dataset.rotate || 110);
    const scale = Number(food.dataset.scale || 1);
    timeline.to(food, { xPercent: x, yPercent: y, rotation, scale, ease: 'none', duration: 7 }, 0);
    gsap.to(food, { y: index % 2 ? -15 : 13, duration: 2.4 + index * .2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  });
  timeline.to('.hero-wash', { backgroundColor: '#f3dfd1', duration: 1.8 }, 2.3)
    .to('.hero-wash', { backgroundColor: '#d9b5a5', duration: 1.9 }, 4.5);

  const nav = document.querySelector('.site-nav');
  if (nav) {
    gsap.set(nav, { autoAlpha: 0, y: -18 });
    ScrollTrigger.create({
      trigger: '.menu-section', start: 'top 78%',
      onEnter: () => gsap.to(nav, { autoAlpha: 1, y: 0, duration: .35, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(nav, { autoAlpha: 0, y: -18, duration: .2, ease: 'power2.in' })
    });
  }
  gsap.from('.menu-intro, .menu-card', { scrollTrigger: { trigger: '.menu-section', start: 'top 72%' }, y: 35, autoAlpha: 0, duration: .8, stagger: .13, ease: 'power3.out' });
}
