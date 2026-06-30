import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Always ensure content is visible — set via gsap.set so they're never stuck hidden
    const elements = [eyebrowRef.current, line1Ref.current, line2Ref.current, subtextRef.current, ctaRef.current];

    if (isReducedMotion) {
      elements.forEach(el => { if (el) gsap.set(el, { opacity: 1, y: 0 }); });
      return;
    }

    // Set initial hidden state via GSAP (not inline CSS) so if JS fails, content is visible
    gsap.set([eyebrowRef.current, subtextRef.current, ctaRef.current], { opacity: 0, y: 20 });
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 32 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
      .to(line1Ref.current,   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.15')
      .to(line2Ref.current,   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.55')
      .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.6,  ease: 'power2.out' }, '-=0.35')
      .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.3');

    // Fade scroll indicator out on first scroll
    const scrollHide = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (chevronRef.current) {
          chevronRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 4));
        }
      }
    });

    return () => {
      tl.kill();
      scrollHide.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center pt-24 pb-16"
    >
      {/* Localized left-to-right scrim — lifts text off particle field */}
      <div className="hero-text-scrim" aria-hidden="true" />

      <div className="container-layout w-full relative z-10">
        <div className="max-w-[620px]">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="eyebrow mb-8">
            {data.hero.eyebrow}
          </div>

          {/* Headline */}
          <h1 className="text-hero font-display font-medium mb-8">
            <span ref={line1Ref} className="block text-[#f5f5f2]">
              {data.hero.headlineLine1}
            </span>
            <span ref={line2Ref} className="block text-[#8c8c94]">
              {data.hero.headlineLine2}
            </span>
          </h1>

          {/* Subtext */}
          <p ref={subtextRef} className="text-body text-[#8c8c94] max-w-[480px] mb-12">
            {data.hero.subtext}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <a
              href={data.hero.ctaPrimary.target}
              className="bg-[#d4ff4f] text-[#08080a] px-8 py-4 font-medium text-sm rounded-[2px] hover:bg-[#c8f03d] transition-colors inline-block"
            >
              {data.hero.ctaPrimary.label}
            </a>
            <a
              href={data.hero.ctaSecondary.target}
              className="border border-[#2e2e36] text-[#f5f5f2] px-8 py-4 font-medium text-sm rounded-[2px] hover:border-[#4a4a52] transition-colors inline-block"
            >
              {data.hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4a4a52] pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#4a4a52]" />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>
    </section>
  );
}
