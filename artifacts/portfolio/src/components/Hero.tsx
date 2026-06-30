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

    if (isReducedMotion) {
      [eyebrowRef, line1Ref, line2Ref, subtextRef, ctaRef].forEach(r => {
        if (r.current) gsap.set(r.current, { opacity: 1, y: 0 });
      });
      return;
    }

    const tl = gsap.timeline({ delay: 0.4 });

    // Eyebrow fades in first
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Line 1 — rolls up from below clip
    tl.fromTo(line1Ref.current,
      { y: '105%' },
      { y: '0%', duration: 0.9, ease: 'power3.out' },
      '-=0.2'
    );

    // Line 2 — slight stagger after line 1
    tl.fromTo(line2Ref.current,
      { y: '105%' },
      { y: '0%', duration: 0.9, ease: 'power3.out' },
      '-=0.65'
    );

    // Subtext + CTAs fade in
    tl.fromTo([subtextRef.current, ctaRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12 },
      '-=0.4'
    );

    // Chevron fades out on first scroll
    const scrollHide = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=120',
      scrub: true,
      onUpdate: (self) => {
        if (chevronRef.current) {
          gsap.set(chevronRef.current, { opacity: 1 - self.progress * 3 });
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
      style={{ contain: 'layout' }}
    >
      {/* Localized scrim — lifts text off particle field on the left side only */}
      <div className="hero-text-scrim" aria-hidden="true" />

      <div className="container-layout w-full relative z-10">
        <div className="max-w-[640px]">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="eyebrow mb-8" style={{ opacity: 0 }}>
            {data.hero.eyebrow}
          </div>

          {/* Headline — each line wrapped in overflow:hidden clip for roll-up */}
          <h1 className="text-hero font-display font-medium mb-8">
            <span className="text-reveal-wrap">
              <span ref={line1Ref} className="text-reveal-line text-[#f5f5f2]">
                {data.hero.headlineLine1}
              </span>
            </span>
            <span className="text-reveal-wrap">
              <span ref={line2Ref} className="text-reveal-line text-[#8c8c94]">
                {data.hero.headlineLine2}
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="text-body text-[#8c8c94] max-w-[480px] mb-12"
            style={{ opacity: 0 }}
          >
            {data.hero.subtext}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
            <a
              href={data.hero.ctaPrimary.target}
              className="bg-[#d4ff4f] text-[#08080a] px-8 py-4 font-medium text-sm rounded-[2px] hover:bg-[#c8f03d] transition-colors inline-block"
            >
              {data.hero.ctaPrimary.label}
            </a>
            <a
              href={data.hero.ctaSecondary.target}
              className="border border-[#2e2e36] text-[#f5f5f2] px-8 py-4 font-medium text-sm rounded-[2px] hover:border-[#4a4a52] hover:text-[#f5f5f2] transition-colors inline-block"
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
