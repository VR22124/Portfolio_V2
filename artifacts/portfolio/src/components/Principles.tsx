import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!.querySelector('.principles-header'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );

      if (!isReducedMotion) {
        entryRefs.current.forEach((entry) => {
          if (!entry) return;
          const numEl = entry.querySelector('.principle-num');
          const titleEl = entry.querySelector('.principle-title');
          const descEl = entry.querySelector('.principle-desc');

          if (numEl) {
            gsap.fromTo(numEl,
              { opacity: 0, x: -16 },
              { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out',
                scrollTrigger: { trigger: entry, start: 'top 82%', once: true } }
            );
          }
          if (titleEl) {
            gsap.fromTo(titleEl,
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.08,
                scrollTrigger: { trigger: entry, start: 'top 82%', once: true } }
            );
          }
          if (descEl) {
            gsap.fromTo(descEl,
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.18,
                scrollTrigger: { trigger: entry, start: 'top 82%', once: true } }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container-layout section-padding">
      <div className="principles-header mb-16" style={{ opacity: 0 }}>
        <div className="eyebrow mb-4">Principles</div>
        <h2 className="font-display font-medium text-[#f5f5f2] text-h1">What I believe.</h2>
      </div>

      {/* Editorial full-width entries */}
      <div className="flex flex-col">
        {data.principles.map((p, i) => (
          <div
            key={i}
            ref={el => { entryRefs.current[i] = el; }}
            className="group flex flex-col md:flex-row gap-6 md:gap-16 py-12 border-t border-[#1f1f24] last:border-b"
          >
            {/* Index numeral */}
            <div className="principle-num md:w-16 shrink-0" style={{ opacity: 0 }}>
              <span className="font-mono text-[11px] text-[#2e2e36] tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Title + desc */}
            <div className="flex-1">
              <h3
                className="principle-title font-display font-medium text-[#f5f5f2] mb-4"
                style={{ fontSize: 'clamp(22px, 2.8vw, 36px)', letterSpacing: '-0.02em', lineHeight: 1.2, opacity: 0 }}
              >
                {p.title}
              </h3>
              <p
                className="principle-desc text-body text-[#8c8c94] max-w-xl"
                style={{ opacity: 0 }}
              >
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
