import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(sectionRef.current!.querySelector('.exp-header'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );

      if (!isReducedMotion) {
        entryRefs.current.forEach((entry) => {
          if (!entry) return;

          // Company name line-mask reveal
          const company = entry.querySelector('.exp-company');
          const meta = entry.querySelector('.exp-meta');
          const desc = entry.querySelector('.exp-desc');
          const highlights = entry.querySelectorAll('.exp-highlight');

          if (company) {
            gsap.fromTo(company,
              { opacity: 0, y: 40, skewY: 1.5 },
              { opacity: 1, y: 0, skewY: 0, duration: 0.85, ease: 'power3.out',
                scrollTrigger: { trigger: entry, start: 'top 80%', once: true } }
            );
          }
          if (meta) {
            gsap.fromTo(meta,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.15,
                scrollTrigger: { trigger: entry, start: 'top 80%', once: true } }
            );
          }
          if (desc) {
            gsap.fromTo(desc,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25,
                scrollTrigger: { trigger: entry, start: 'top 80%', once: true } }
            );
          }
          if (highlights.length) {
            gsap.fromTo(highlights,
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', stagger: 0.07, delay: 0.35,
                scrollTrigger: { trigger: entry, start: 'top 80%', once: true } }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="container-layout section-padding"
    >
      {/* Header */}
      <div className="exp-header mb-20" style={{ opacity: 0 }}>
        <div className="eyebrow mb-4">Experience</div>
        <h2 className="font-display font-medium text-[#f5f5f2] text-h1">
          Where I've worked.
        </h2>
      </div>

      {/* Entries — editorial magazine style */}
      <div className="flex flex-col">
        {data.experience.map((exp, i) => (
          <div
            key={i}
            ref={el => { entryRefs.current[i] = el; }}
            className="group py-14 border-t border-[#1f1f24] last:border-b"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">

              {/* Left — company + meta */}
              <div className="md:w-80 shrink-0">
                {/* Huge company name */}
                <div className="overflow-hidden mb-4">
                  <h3
                    className="exp-company font-display font-bold text-[#f5f5f2] leading-none"
                    style={{
                      fontSize: 'clamp(32px, 4.5vw, 60px)',
                      letterSpacing: '-0.03em',
                      opacity: 0,
                    }}
                  >
                    {exp.company}
                  </h3>
                </div>

                {/* Role + Period meta row */}
                <div className="exp-meta flex flex-col gap-1.5" style={{ opacity: 0 }}>
                  <span className="text-sm font-medium text-[#d4ff4f] tracking-wide">
                    {exp.role}
                  </span>
                  <span className="text-xs font-mono text-[#4a4a52] tracking-widest">
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Right — description + highlights */}
              <div className="flex-1 md:pt-1">
                <p
                  className="exp-desc text-body text-[#8c8c94] mb-8 max-w-lg leading-relaxed"
                  style={{ opacity: 0 }}
                >
                  {exp.description}
                </p>

                {/* Highlights — inline list with → markers */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {exp.highlights.map((hl, j) => (
                    <div
                      key={j}
                      className="exp-highlight flex items-center gap-2 text-sm text-[#8c8c94]"
                      style={{ opacity: 0 }}
                    >
                      <span className="text-[#d4ff4f] text-xs" aria-hidden="true">→</span>
                      {hl}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
