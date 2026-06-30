import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

// Sort so related categories are grouped
const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'API', 'Database', 'Infra', 'Design'];
const sorted = [...data.skills].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
);

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelector('.skills-header'),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      if (!isReducedMotion) {
        gsap.fromTo(
          rowRefs.current.filter(Boolean),
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.055,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
          }
        );
      } else {
        rowRefs.current.forEach(r => { if (r) r.style.opacity = '1'; });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="container-layout section-padding">

      {/* Header — identical pattern to Experience and Journey */}
      <div className="skills-header mb-20" style={{ opacity: 0 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Skills & Tools</div>
            <h2 className="font-display font-medium text-[#f5f5f2] text-h1">The toolkit.</h2>
          </div>
          <p className="text-body text-[#8c8c94] max-w-sm md:text-right">
            Picked up over six years of solving real problems in production.
          </p>
        </div>
      </div>

      {/* Skill table — editorial row-per-skill */}
      <div>
        {sorted.map((skill, i) => {
          const isHovered = hoveredIdx === i;
          const isDimmed = hoveredIdx !== null && !isHovered;

          return (
            <div
              key={skill.name}
              ref={el => { rowRefs.current[i] = el; }}
              className="flex items-center gap-5 md:gap-8 py-5 md:py-6 border-t border-[#1f1f24] cursor-default select-none"
              style={{ opacity: 0 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Skill name — large display, same scale as exp-company */}
              <h3
                className="font-display font-medium leading-none shrink-0"
                style={{
                  fontSize: 'clamp(26px, 3.2vw, 48px)',
                  letterSpacing: '-0.02em',
                  color: isHovered ? '#f5f5f2' : isDimmed ? '#2e2e36' : '#4a4a52',
                  transition: 'color 0.22s ease',
                }}
              >
                {skill.name}
              </h3>

              {/* Leader line — connects name to meta on right */}
              <div
                className="flex-1 self-center"
                style={{
                  height: '1px',
                  background: isHovered
                    ? 'linear-gradient(to right, rgba(212,255,79,0.35), transparent)'
                    : '#1f1f24',
                  transition: 'background 0.22s ease',
                  minWidth: '24px',
                }}
                aria-hidden="true"
              />

              {/* Category */}
              <span
                className="text-[10px] font-medium tracking-[0.12em] uppercase shrink-0 hidden sm:block"
                style={{
                  color: isHovered ? '#d4ff4f' : '#2e2e36',
                  transition: 'color 0.22s ease',
                }}
              >
                {skill.category}
              </span>

              {/* Proficiency — mono number */}
              <span
                className="font-mono text-sm shrink-0 tabular-nums"
                style={{
                  color: isHovered ? '#d4ff4f' : '#2e2e36',
                  transition: 'color 0.22s ease',
                }}
                aria-label={`${skill.level}% proficiency`}
              >
                {skill.level}
              </span>
            </div>
          );
        })}

        {/* Bottom rule */}
        <div className="border-t border-[#1f1f24]" />
      </div>
    </section>
  );
}
