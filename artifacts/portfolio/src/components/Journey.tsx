import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Section header
      gsap.fromTo(sectionRef.current!.querySelector('.journey-header'),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
        }
      );

      // Line draw — scrubbed through scroll
      if (lineFillRef.current) {
        gsap.fromTo(lineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              end: 'bottom 55%',
              scrub: 1.2,
            }
          }
        );
      }

      if (!isReducedMotion) {
        itemRefs.current.forEach((item) => {
          if (!item) return;

          const yearEl = item.querySelector('.journey-year');
          const contentEl = item.querySelector('.journey-content');
          const dotEl = item.querySelector('.journey-dot');

          if (dotEl) {
            gsap.fromTo(dotEl,
              { scale: 0, opacity: 0 },
              {
                scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)',
                scrollTrigger: { trigger: item, start: 'top 80%', once: true }
              }
            );
          }

          if (yearEl) {
            gsap.fromTo(yearEl,
              { opacity: 0, x: -20 },
              {
                opacity: 1, x: 0, duration: 0.65, ease: 'power2.out',
                scrollTrigger: { trigger: item, start: 'top 82%', once: true }
              }
            );
          }

          if (contentEl) {
            gsap.fromTo(contentEl,
              { opacity: 0, y: 22 },
              {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1,
                scrollTrigger: { trigger: item, start: 'top 82%', once: true }
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="container-layout section-padding"
    >
      {/* Section header */}
      <div className="journey-header mb-20 max-w-lg" style={{ opacity: 0 }}>
        <div className="eyebrow mb-5">The Journey</div>
        <p className="text-[#8c8c94] text-body leading-relaxed">
          Six years from first commit to independent practice — every step a sharper understanding of what building actually means.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical track */}
        <div className="absolute left-0 top-2 bottom-2 w-[1px] bg-[#1f1f24] hidden md:block" aria-hidden="true">
          <div ref={lineFillRef} className="absolute inset-0 bg-[#d4ff4f] origin-top" style={{ scaleY: 0 }} />
        </div>

        <div className="flex flex-col">
          {data.journey.map((item, i) => (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className="relative md:pl-24 pb-0"
            >
              {/* Timeline dot */}
              <div
                className="journey-dot absolute left-[-5px] top-3 w-[11px] h-[11px] bg-[#08080a] border-2 border-[#d4ff4f] hidden md:block z-10"
                style={{ transform: 'scale(0)', opacity: 0 }}
                aria-hidden="true"
              />

              {/* Entry */}
              <div className="flex flex-col md:flex-row gap-0 group py-10 border-b border-[#1f1f24] last:border-0">
                {/* Year — large display background element */}
                <div className="journey-year md:w-32 shrink-0 flex items-start" style={{ opacity: 0 }}>
                  <span
                    className="font-display font-bold text-[#d4ff4f] leading-none select-none"
                    style={{ fontSize: 'clamp(52px, 6vw, 80px)', letterSpacing: '-0.04em', opacity: 0.15 }}
                    aria-hidden="true"
                  >
                    {item.year}
                  </span>
                </div>

                {/* Content */}
                <div className="journey-content flex-1 md:pt-2" style={{ opacity: 0 }}>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-display text-[#f5f5f2] font-medium"
                        style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', letterSpacing: '-0.02em' }}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-medium tracking-[0.12em] text-[#d4ff4f] uppercase px-2.5 py-1 border border-[#d4ff4f]/20 rounded-[2px]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-body text-[#8c8c94] max-w-lg">{item.description}</p>
                </div>

                {/* Visible year for mobile */}
                <div className="md:hidden text-xs font-mono text-[#4a4a52] mb-2 tracking-wider">
                  {item.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
