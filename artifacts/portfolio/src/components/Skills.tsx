import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

type Skill = (typeof data.skills)[number];

const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'API', 'Database', 'Infra', 'Design'];
const sorted = [...data.skills].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
);

function SkillRow({
  skill,
  index,
  hoveredIdx,
  onHover,
  onLeave,
  rowRef,
  lineRef,
  metaRef,
}: {
  skill: Skill;
  index: number;
  hoveredIdx: number | null;
  onHover: (i: number) => void;
  onLeave: () => void;
  rowRef: (el: HTMLDivElement | null) => void;
  lineRef: (el: HTMLDivElement | null) => void;
  metaRef: (el: HTMLDivElement | null) => void;
}) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[skill.icon];
  const isHovered = hoveredIdx === index;
  const isDimmed = hoveredIdx !== null && !isHovered;

  return (
    <div
      ref={rowRef}
      className="flex items-center gap-4 md:gap-7 py-5 md:py-6 border-t border-[#1f1f24] cursor-default select-none overflow-hidden"
      style={{ opacity: 0 }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      {/* Icon */}
      <span
        style={{
          color: isHovered ? '#d4ff4f' : isDimmed ? '#1f1f24' : '#2e2e36',
          transition: 'color 0.22s ease',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(212,255,79,0.4))' : 'none',
          transitionProperty: 'color, filter',
        }}
        aria-hidden="true"
      >
        {Icon && <Icon size={20} />}
      </span>

      {/* Skill name */}
      <h3
        className="font-display font-medium leading-none shrink-0"
        style={{
          fontSize: 'clamp(24px, 3vw, 46px)',
          letterSpacing: '-0.02em',
          color: isHovered ? '#f5f5f2' : isDimmed ? '#2e2e36' : '#4a4a52',
          transition: 'color 0.22s ease',
        }}
      >
        {skill.name}
      </h3>

      {/* Leader line — drawn by GSAP on scroll */}
      <div className="flex-1 self-center overflow-hidden" style={{ minWidth: 24 }} aria-hidden="true">
        <div
          ref={lineRef}
          style={{
            height: '1px',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            background: isHovered
              ? 'linear-gradient(to right, rgba(212,255,79,0.4), transparent)'
              : '#1f1f24',
            transition: 'background 0.25s ease',
          }}
        />
      </div>

      {/* Category + level — fade in after line draws */}
      <div
        ref={metaRef}
        className="flex items-center gap-4 shrink-0"
        style={{ opacity: 0 }}
      >
        <span
          className="text-[10px] font-medium tracking-[0.12em] uppercase hidden sm:block"
          style={{
            color: isHovered ? '#d4ff4f' : '#2e2e36',
            transition: 'color 0.22s ease',
          }}
        >
          {skill.category}
        </span>
        <span
          className="font-mono text-sm tabular-nums"
          style={{
            color: isHovered ? '#d4ff4f' : '#2e2e36',
            transition: 'color 0.22s ease',
          }}
          aria-label={`${skill.level}% proficiency`}
        >
          {skill.level}
        </span>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      if (isReducedMotion) {
        rowRefs.current.forEach(r => { if (r) r.style.opacity = '1'; });
        lineRefs.current.forEach(l => { if (l) l.style.transform = 'scaleX(1)'; });
        metaRefs.current.forEach(m => { if (m) m.style.opacity = '1'; });
        return;
      }

      // Each row gets its own per-element scroll trigger
      sorted.forEach((_, i) => {
        const row = rowRefs.current[i];
        const line = lineRefs.current[i];
        const meta = metaRefs.current[i];
        if (!row) return;

        // 1. Row slides in from the left
        gsap.fromTo(row,
          { opacity: 0, x: -28 },
          {
            opacity: 1, x: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          }
        );

        // 2. Leader line draws left → right, starts after row lands
        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.55,
              ease: 'power2.inOut',
              delay: 0.25,
              scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            }
          );
        }

        // 3. Meta (category + number) fades in after the line finishes
        if (meta) {
          gsap.fromTo(meta,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              delay: 0.55,
              scrollTrigger: { trigger: row, start: 'top 88%', once: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="container-layout section-padding">

      <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
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

      <div>
        {sorted.map((skill, i) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            index={i}
            hoveredIdx={hoveredIdx}
            onHover={setHoveredIdx}
            onLeave={() => setHoveredIdx(null)}
            rowRef={el => { rowRefs.current[i] = el; }}
            lineRef={el => { lineRefs.current[i] = el; }}
            metaRef={el => { metaRefs.current[i] = el; }}
          />
        ))}
        <div className="border-t border-[#1f1f24]" />
      </div>
    </section>
  );
}
