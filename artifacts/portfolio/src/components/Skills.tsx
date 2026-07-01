import { useEffect, useRef, useState } from 'react';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

type Skill = (typeof data.skills)[number];

const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'API', 'Database', 'Infra', 'Design'];
const sorted = [...data.skills].sort(
  (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
);

function SkillRow({
  skill,
  index,
  isRevealed,
  isHovered,
  isDimmed,
  isMobile,
  onMouseEnter,
  onMouseLeave,
}: {
  skill: Skill;
  index: number;
  isRevealed: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isMobile: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[skill.icon];

  const nameColor = isMobile
    ? '#d4d4d0'
    : isHovered
      ? '#f5f5f2'
      : isDimmed
        ? '#252530'
        : '#4a4a52';

  const accentColor = isMobile
    ? 'rgba(212,255,79,0.5)'
    : isHovered
      ? '#d4ff4f'
      : isDimmed
        ? '#1a1a22'
        : '#2e2e36';

  const metaColor = isMobile
    ? '#5a5a64'
    : isHovered
      ? '#d4ff4f'
      : '#252530';

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.875rem' : '1.5rem',
        padding: isMobile ? '1rem 0' : '1.25rem 0',
        borderTop: '1px solid #1f1f24',
        cursor: 'default',
        userSelect: 'none',
        overflow: 'hidden',
        opacity: isRevealed ? (isDimmed && !isMobile ? 0.35 : 1) : 0,
        transform: isRevealed ? 'translateX(0)' : 'translateX(-20px)',
        transition: `opacity 0.55s ease ${index * 0.04}s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.04}s`,
      }}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        style={{
          color: accentColor,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          filter: isHovered ? 'drop-shadow(0 0 8px rgba(212,255,79,0.5))' : 'none',
          transition: 'color 0.25s ease, filter 0.25s ease',
        }}
      >
        {Icon && <Icon size={isMobile ? 16 : 20} />}
      </span>

      {/* Skill name */}
      <h3
        className="font-display font-medium leading-none shrink-0"
        style={{
          fontSize: isMobile ? 'clamp(18px, 5vw, 26px)' : 'clamp(24px, 3vw, 46px)',
          letterSpacing: '-0.02em',
          color: nameColor,
          transition: 'color 0.25s ease',
        }}
      >
        {skill.name}
      </h3>

      {/* Leader line */}
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          alignSelf: 'center',
          overflow: 'hidden',
          minWidth: isMobile ? 12 : 24,
        }}
      >
        <div
          style={{
            height: '1px',
            transformOrigin: 'left center',
            transform: isRevealed ? 'scaleX(1)' : 'scaleX(0)',
            background: isHovered
              ? 'linear-gradient(to right, rgba(212,255,79,0.4), transparent)'
              : isMobile
                ? '#252530'
                : '#1a1a22',
            transition: isRevealed
              ? `transform 0.5s ease ${0.25 + index * 0.04}s, background 0.25s ease`
              : 'background 0.25s ease',
          }}
        />
      </div>

      {/* Category + level — always visible on mobile */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          flexShrink: 0,
          opacity: isRevealed ? (isMobile ? 1 : isHovered || !isDimmed ? 1 : 0.4) : 0,
          transition: `opacity 0.4s ease ${0.4 + index * 0.04}s`,
        }}
      >
        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '9px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: metaColor,
            display: isMobile ? 'none' : undefined,
            transition: 'color 0.25s ease',
          }}
        >
          {skill.category}
        </span>

        {/* Mobile: show category as small pill */}
        {isMobile && (
          <span
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '8px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(212,255,79,0.4)',
              border: '1px solid rgba(212,255,79,0.12)',
              padding: '2px 6px',
              borderRadius: '2px',
            }}
          >
            {skill.category}
          </span>
        )}

        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: isMobile ? '11px' : '13px',
            color: metaColor,
            transition: 'color 0.25s ease',
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
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedRows(new Set(sorted.map((_, i) => i)));
      return;
    }
    const cleanups: (() => void)[] = [];
    rowRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedRows((prev) => { const n = new Set(prev); n.add(i); return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.05, rootMargin: '0px 0px -4% 0px' }
      );
      obs.observe(el);
      cleanups.push(() => obs.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="container-layout section-padding">

      {/* Header */}
      <div
        style={{
          marginBottom: 'clamp(2.5rem, 5vh, 5rem)',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#d4ff4f',
                marginBottom: '1rem',
                opacity: 0.85,
              }}
            >
              Skills & Tools
            </div>
            <h2
              className="font-display"
              style={{
                fontWeight: 500,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                color: '#f5f5f2',
                margin: 0,
              }}
            >
              The toolkit.
            </h2>
          </div>
          <p
            style={{
              fontSize: 'clamp(13px, 1vw, 15px)',
              color: '#8c8c94',
              maxWidth: 280,
              lineHeight: 1.8,
              margin: 0,
              textAlign: isMobile ? 'left' : 'right',
            }}
          >
            Picked up over six years of solving real problems in production.
          </p>
        </div>
      </div>

      {/* Rows */}
      <div>
        {sorted.map((skill, i) => (
          <div key={skill.name} ref={(el) => { rowRefs.current[i] = el; }}>
            <SkillRow
              skill={skill}
              index={i}
              isRevealed={revealedRows.has(i)}
              isHovered={!isMobile && hoveredIdx === i}
              isDimmed={!isMobile && hoveredIdx !== null && hoveredIdx !== i}
              isMobile={isMobile}
              onMouseEnter={() => { if (!isMobile) setHoveredIdx(i); }}
              onMouseLeave={() => { if (!isMobile) setHoveredIdx(null); }}
            />
          </div>
        ))}
        <div style={{ borderTop: '1px solid #1f1f24' }} />
      </div>
    </section>
  );
}
