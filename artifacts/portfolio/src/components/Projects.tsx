import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type Project = (typeof data.projects)[number];

function pad(n: number) {
  return String(n + 1).padStart(2, '0');
}

interface RowProps {
  project: Project;
  index: number;
  isExpanded: boolean;
  isDimmed: boolean;
  isRevealed: boolean;
  isMobile: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
}

function IndexRow({
  project, index, isExpanded, isDimmed, isRevealed, isMobile,
  onEnter, onLeave, onTap,
}: RowProps) {
  const idx = pad(index);
  const ruleDelay = `${index * 0.11}s`;
  const contentDelay = `${index * 0.11 + 0.22}s`;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={isMobile ? onTap : undefined}
      style={{
        padding: '0 5vw',
        opacity: isDimmed ? 0.3 : 1,
        transition: 'opacity 0.35s ease',
        cursor: isMobile ? 'pointer' : 'default',
      }}
    >
      {/* Rule — draws left to right */}
      <div
        aria-hidden="true"
        style={{
          height: '1px',
          backgroundColor: '#1f1f24',
          width: isRevealed ? '100%' : '0%',
          transition: `width 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${ruleDelay}`,
        }}
      />

      {/* Main row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 2.5vw, 2.5rem)',
          padding: 'clamp(1.25rem, 2.25vh, 1.875rem) 0',
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
          transition: `opacity 0.55s ease ${contentDelay}, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${contentDelay}`,
        }}
      >
        {/* Ghost index number */}
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: 'clamp(18px, 2.2vw, 34px)',
            fontWeight: 200,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            flexShrink: 0,
            width: 'clamp(2.25rem, 3.5vw, 5rem)',
            color: isExpanded ? '#d4ff4f' : '#252530',
            textShadow: isExpanded ? '0 0 18px rgba(212,255,79,0.55)' : 'none',
            transition: 'color 0.35s ease, text-shadow 0.35s ease',
            userSelect: 'none',
          }}
        >
          {idx}
        </span>

        {/* Project name */}
        <div style={{ flex: 1, position: 'relative', minWidth: 0, overflow: 'visible' }}>
          <h3
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: isExpanded
                ? 'clamp(20px, 2.6vw, 40px)'
                : 'clamp(26px, 4.5vw, 72px)',
              letterSpacing: isExpanded ? '-0.025em' : '-0.04em',
              color: '#f5f5f2',
              lineHeight: 1,
              margin: 0,
              transition:
                'font-size 0.45s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {project.title}
          </h3>
          {/* Accent underline draws on hover */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              height: '1px',
              backgroundColor: '#d4ff4f',
              width: isExpanded ? '100%' : '0%',
              transition: isExpanded
                ? 'width 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.08s'
                : 'width 0.3s ease',
            }}
          />
        </div>

        {/* Year — hides on expand */}
        <span
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#3a3a44',
            letterSpacing: '0.12em',
            flexShrink: 0,
            opacity: isExpanded ? 0 : 1,
            transition: 'opacity 0.2s ease',
            userSelect: 'none',
          }}
        >
          {project.year}
        </span>
      </div>

      {/* Expanded accordion body */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile
                ? '1fr'
                : '1.1fr 2fr 1fr',
              gap: isMobile ? '1.25rem' : 'clamp(1rem, 3vw, 3rem)',
              paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
              /* indent to align under project name (past the index number) */
              paddingLeft: `calc(clamp(2.25rem, 3.5vw, 5rem) + clamp(1rem, 2.5vw, 2.5rem))`,
              alignItems: 'start',
            }}
          >
            {/* Left — subtitle / type label */}
            <div
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0)' : 'translateY(10px)',
                transition: isExpanded
                  ? 'opacity 0.4s ease 0.18s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.18s'
                  : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'Menlo, monospace',
                  fontSize: '11px',
                  color: '#6a6a74',
                  letterSpacing: '0.06em',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {project.subtitle}
              </p>
            </div>

            {/* Center — description */}
            <div
              style={{
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'translateY(0)' : 'translateY(10px)',
                transition: isExpanded
                  ? 'opacity 0.4s ease 0.25s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s'
                  : 'none',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: '#8c8c94',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {project.description}
              </p>
            </div>

            {/* Right — tags + View link */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.375rem',
                  justifyContent: isMobile ? 'flex-start' : 'flex-end',
                }}
              >
                {project.tags.map((tag, j) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      color: '#8c8c94',
                      border: '1px solid #2a2a34',
                      padding: '3px 9px',
                      borderRadius: '2px',
                      letterSpacing: '0.04em',
                      opacity: isExpanded ? 1 : 0,
                      transform: isExpanded ? 'translateY(0)' : 'translateY(6px)',
                      transition: isExpanded
                        ? `opacity 0.35s ease ${0.32 + j * 0.06}s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${0.32 + j * 0.06}s`
                        : 'none',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* View Project → */}
              <a
                href={project.link}
                onClick={e => { if (project.link === '#') e.preventDefault(); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#d4ff4f',
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? 'translateX(0)' : 'translateX(10px)',
                  transition: isExpanded
                    ? 'opacity 0.35s ease 0.5s, transform 0.35s ease 0.5s'
                    : 'none',
                }}
              >
                View Project <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      setSectionVisible(true);
      setRevealedRows(new Set(data.projects.map((_, i) => i)));
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setSectionVisible(true);
          data.projects.forEach((_, i) => {
            setTimeout(() => {
              setRevealedRows(prev => {
                const next = new Set(prev);
                next.add(i);
                return next;
              });
            }, i * 110 + 80);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const total = data.projects.length;

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: 'clamp(4rem, 8vh, 7rem) 0', position: 'relative' }}
    >
      {/* Section header */}
      <div
        style={{
          padding: '0 5vw',
          maxWidth: '1400px',
          margin: '0 auto',
          marginBottom: 'clamp(2.5rem, 5vh, 4rem)',
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className="eyebrow mb-4">Selected Work</div>
        <h2
          className="font-display font-medium text-[#f5f5f2]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
        >
          Things I've built.
        </h2>
      </div>

      {/* The index list */}
      <div>
        {data.projects.map((project, i) => (
          <IndexRow
            key={project.id}
            project={project}
            index={i}
            isExpanded={isMobile ? expandedIndex === i : hoveredIndex === i}
            isDimmed={!isMobile && hoveredIndex !== null && hoveredIndex !== i}
            isRevealed={revealedRows.has(i)}
            isMobile={isMobile}
            onEnter={() => { if (!isMobile) setHoveredIndex(i); }}
            onLeave={() => { if (!isMobile) setHoveredIndex(null); }}
            onTap={() => { if (isMobile) setExpandedIndex(prev => prev === i ? null : i); }}
          />
        ))}

        {/* Closing rule */}
        <div
          style={{
            margin: '0 5vw',
            height: '1px',
            backgroundColor: '#1f1f24',
            opacity: revealedRows.size >= total ? 1 : 0,
            transition: `opacity 0.4s ease ${(total * 0.11) + 0.5}s`,
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
