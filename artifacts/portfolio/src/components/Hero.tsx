import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.5 }
    );
  }, []);

  return (
    <section className="min-h-[100dvh] flex items-center pt-24 pb-12 relative container-layout">
      <div ref={containerRef} className="max-w-4xl">
        <div className="eyebrow mb-8">{data.hero.eyebrow}</div>
        <h1 className="text-hero font-display font-medium text-[#f5f5f2] mb-8">
          <span className="block">{data.hero.headlineLine1}</span>
          <span className="block text-[#8c8c94]">{data.hero.headlineLine2}</span>
        </h1>
        <p className="text-body text-[#8c8c94] max-w-xl mb-12">
          {data.hero.subtext}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={data.hero.ctaPrimary.target} className="bg-[#d4ff4f] text-[#08080a] px-8 py-4 font-medium text-sm rounded-[2px] hover:bg-[#8a9c3a] transition-colors inline-block">
            {data.hero.ctaPrimary.label}
          </a>
          <a href={data.hero.ctaSecondary.target} className="border border-[#1f1f24] text-[#f5f5f2] px-8 py-4 font-medium text-sm rounded-[2px] hover:border-[#2e2e36] transition-colors inline-block">
            {data.hero.ctaSecondary.label}
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-6 md:left-16 flex flex-col items-center gap-2 text-[#4a4a52] animate-bounce pointer-events-none">
        <div className="w-[1px] h-8 bg-[#4a4a52]" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}