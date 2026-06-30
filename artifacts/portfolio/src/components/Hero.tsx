import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

function TypewriterText({ phrases, className }: { phrases: string[]; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      setDisplayed(prev => prev.slice(0, -1));
      timeoutRef.current = setTimeout(tick, 45);
      if (displayed.length <= 1) {
        setIsDeleting(false);
        setPhraseIdx(i => (i + 1) % phrases.length);
      }
    } else {
      const next = current.slice(0, displayed.length + 1);
      setDisplayed(next);
      if (next === current) {
        // Pause at full word, then start deleting
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 1800);
      } else {
        timeoutRef.current = setTimeout(tick, 85);
      }
    }
  }, [phrases, phraseIdx, isDeleting, displayed]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, 120);
    return () => clearTimeout(timeoutRef.current);
  }, [tick]);

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = [eyebrowRef.current, line1Ref.current, line2Ref.current, subtextRef.current, ctaRef.current];

    if (isReducedMotion) {
      elements.forEach(el => { if (el) gsap.set(el, { opacity: 1, y: 0 }); });
      return;
    }

    gsap.set([eyebrowRef.current, subtextRef.current, ctaRef.current], { opacity: 0, y: 20 });
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: 36 });

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
      .to(line1Ref.current,   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .to(line2Ref.current,   { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.45')
      .to(subtextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to(ctaRef.current,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.25');

    const scrollHide = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (chevronRef.current) {
          chevronRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 5));
        }
      }
    });

    return () => { tl.kill(); scrollHide.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center pt-28 pb-16"
    >
      <div className="hero-text-scrim" aria-hidden="true" />

      <div className="container-layout w-full relative z-10">
        <div className="max-w-[680px]">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="eyebrow mb-8">
            {data.hero.eyebrow}
          </div>

          {/* Headline line 1 — static */}
          <h1 className="font-display font-medium leading-[0.93] tracking-[-0.03em] mb-2"
              style={{ fontSize: 'var(--text-hero)' }}>
            <span ref={line1Ref} className="block text-[#f5f5f2]">
              {data.hero.headlineLine1}
            </span>

            {/* Line 2 — typewriter */}
            <div ref={line2Ref} className="block text-[#d4ff4f]">
              <TypewriterText phrases={data.hero.typewriterPhrases} />
            </div>
          </h1>

          {/* Subtext */}
          <p ref={subtextRef} className="text-body text-[#8c8c94] max-w-[460px] mt-8 mb-12">
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
