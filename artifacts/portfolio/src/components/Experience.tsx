import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Eyebrow
      gsap.fromTo(sectionRef.current!.querySelector('.section-eyebrow'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      if (isReducedMotion) {
        cardRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 1, y: 0 }); });
        return;
      }

      // Per-card stagger entrances
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { opacity: 0, y: 48 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container-layout section-padding section-frame"
    >
      <div className="eyebrow section-eyebrow mb-14" style={{ opacity: 0 }}>Experience</div>

      <div className="flex flex-col gap-5 max-w-4xl">
        {data.experience.map((exp, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el; }}
            className="group relative p-8 md:p-10 border border-[#1f1f24] bg-[#111114]/60 backdrop-blur-sm rounded-[2px] transition-all duration-500 hover:border-[#2e2e36] hover:bg-[#111114] cursor-default"
            style={{ opacity: 0 }}
          >
            {/* Subtle left accent line on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#d4ff4f] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom rounded-[2px]" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-display text-[#f5f5f2] font-medium mb-1 leading-tight">
                  {exp.company}
                </h3>
                <div className="text-sm font-medium text-[#8c8c94] tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>
                  {exp.role}
                </div>
              </div>
              <div className="text-sm font-mono text-[#4a4a52] shrink-0 pt-1">{exp.period}</div>
            </div>

            <p className="text-[#8c8c94] text-body mb-7 max-w-2xl leading-relaxed">{exp.description}</p>

            <ul className="grid sm:grid-cols-2 gap-2.5">
              {exp.highlights.map((hl, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-[#8c8c94]">
                  <svg
                    className="w-4 h-4 text-[#d4ff4f] shrink-0 mt-0.5"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="square"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="group-hover:text-[#f5f5f2] transition-colors duration-300">{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
