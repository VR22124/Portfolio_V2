import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type Project = (typeof data.projects)[number];

function pad(n: number) {
  return String(n + 1).padStart(2, '0');
}

const TOTAL = data.projects.length;

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
  const ruleDelay   = `${index * 0.1}s`;
  const contentDelay = `${index * 0.1 + 0.2}s`;

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={isMobile ? onTap : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0 5vw',
        opacity: isDimmed ? 0.28 : 1,
        transform: isDimmed ? 'scale(0.995)' : 'scale(1)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        cursor: isMobile ? 'pointer' : 'default',
        /* Subtle accent radial glow on hover */
        background: isExpanded
          ? 'radial-gradient(ellipse 60% 100% at 0% 50%, rgba(212,255,79,0.045) 0%, transparent 70%)'
          : 'transparent',
      }}
    >
      {/* Left accent strip */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: '#d4ff4f',
          transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: isExpanded
            ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.35s ease',
          boxShadow: isExpanded ? '0 0 14px 2px rgba(212,255,79,0.4)' : 'none',
        }}
      />

      {/* Watermark numeral — enormous ghost behind content */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '4vw',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display, sans-serif)',
          fontWeight: 800,
          fontSize: 'clamp(90px, 17vw, 240px)',
          lineHeight: 1,
          letterSpacing: '-0.06em',
          color: '#f5f5f2',
          opacity: isExpanded ? 0.055 : 0.028,
          transition: 'opacity 0.4s ease',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        className="font-display"
      >
        {idx}
      </div>

      {/* Content above watermark */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Rule — draws left to right */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: isExpanded
              ? 'linear-gradient(to right, rgba(212,255,79,0.35) 0%, #1f1f24 40%)'
              : '#1f1f24',
            width: isRevealed ? '100%' : '0%',
            transition: `width 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${ruleDelay}, background 0.4s ease`,
          }}
        />

        {/* Main row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.75rem, 2vw, 2.5rem)',
            padding: 'clamp(1.5rem, 2.8vh, 2.25rem) 0',
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(18px)',
            transition: `opacity 0.6s ease ${contentDelay}, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${contentDelay}`,
          }}
        >
          {/* Small index counter */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: 'clamp(11px, 1vw, 14px)',
              fontWeight: 400,
              letterSpacing: '0.08em',
              lineHeight: 1,
              flexShrink: 0,
              width: 'clamp(2rem, 3vw, 4rem)',
              color: isExpanded ? '#d4ff4f' : '#323238',
              textShadow: isExpanded ? '0 0 20px rgba(212,255,79,0.7)' : 'none',
              transition: 'color 0.35s ease, text-shadow 0.35s ease',
              userSelect: 'none',
            }}
          >
            {idx}
          </span>

          {/* Project name + underline */}
          <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'nowrap' }}>
              <h3
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: isExpanded
                    ? 'clamp(22px, 2.8vw, 44px)'
                    : 'clamp(28px, 5vw, 80px)',
                  letterSpacing: isExpanded ? '-0.025em' : '-0.045em',
                  color: '#f5f5f2',
                  lineHeight: 1,
                  margin: 0,
                  transition:
                    'font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1), letter-spacing 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {project.title}
              </h3>

              {/* Featured indicator */}
              {project.featured && !isExpanded && (
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'Menlo, monospace',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#d4ff4f',
                    border: '1px solid rgba(212,255,79,0.3)',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    opacity: isExpanded ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                    whiteSpace: 'nowrap',
                    alignSelf: 'center',
                  }}
                >
                  Featured
                </span>
              )}
            </div>

            {/* Accent underline — draws on hover */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '-3px',
                left: 0,
                height: '1px',
                background: 'linear-gradient(to right, #d4ff4f, rgba(212,255,79,0.3))',
                width: isExpanded ? '100%' : '0%',
                transition: isExpanded
                  ? 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.06s'
                  : 'width 0.3s ease',
              }}
            />
          </div>

          {/* Year — far right, hidden on expand */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '3px',
              opacity: isExpanded ? 0 : 1,
              transform: isExpanded ? 'translateX(6px)' : 'translateX(0)',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
          >
            <span
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '10px',
                color: '#3a3a44',
                letterSpacing: '0.1em',
                userSelect: 'none',
              }}
            >
              {project.year}
            </span>
            <span
              style={{
                fontFamily: 'Menlo, monospace',
                fontSize: '9px',
                color: '#252530',
                letterSpacing: '0.06em',
                userSelect: 'none',
              }}
            >
              {idx} / {pad(TOTAL - 1)}
            </span>
          </div>
        </div>

        {/* Expanded accordion */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              minHeight: 0,
              background: 'rgba(8, 8, 10, 0.78)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderTop: '1px solid rgba(212,255,79,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              margin: '0 -5vw',
              padding: '0 5vw',
            }}
          >
            {/* Thin accent separator */}
            <div
              aria-hidden="true"
              style={{
                height: '1px',
                background: 'linear-gradient(to right, rgba(212,255,79,0.2), transparent 55%)',
                marginBottom: '1.75rem',
                opacity: isExpanded ? 1 : 0,
                transition: 'opacity 0.3s ease 0.1s',
              }}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 2.2fr 1fr',
                gap: isMobile ? '1.5rem' : 'clamp(1.5rem, 3vw, 4rem)',
                paddingBottom: 'clamp(2rem, 4vh, 3rem)',
                paddingLeft: isMobile ? 0 : `calc(clamp(2rem, 3vw, 4rem) + clamp(0.75rem, 2vw, 2.5rem))`,
                alignItems: 'start',
              }}
            >
              {/* Left — subtitle */}
              <div
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transform: isExpanded ? 'translateY(0)' : 'translateY(12px)',
                  transition: isExpanded
                    ? 'opacity 0.45s ease 0.2s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
                    : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Menlo, monospace',
                    fontSize: '10px',
                    color: '#d4ff4f',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    opacity: 0.7,
                  }}
                >
                  About
                </div>
                <p
                  style={{
                    fontFamily: 'Menlo, monospace',
                    fontSize: '12px',
                    color: '#9a9aaa',
                    letterSpacing: '0.04em',
                    lineHeight: 1.65,
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
                  transform: isExpanded ? 'translateY(0)' : 'translateY(12px)',
                  transition: isExpanded
                    ? 'opacity 0.45s ease 0.28s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.28s'
                    : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Menlo, monospace',
                    fontSize: '10px',
                    color: '#d4ff4f',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    opacity: 0.7,
                  }}
                >
                  What it does
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#c0c0cc',
                    lineHeight: 1.85,
                    margin: 0,
                    maxWidth: '520px',
                  }}
                >
                  {project.description}
                </p>
              </div>

              {/* Right — stack + CTA */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  alignItems: isMobile ? 'flex-start' : 'flex-end',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'Menlo, monospace',
                      fontSize: '10px',
                      color: '#d4ff4f',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '0.5rem',
                      opacity: 0.7,
                      textAlign: isMobile ? 'left' : 'right',
                    }}
                  >
                    Stack
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                      justifyContent: isMobile ? 'flex-start' : 'flex-end',
                    }}
                  >
                    {project.tags.map((tag, j) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '10px',
                          color: '#a8a8b8',
                          border: '1px solid #38383f',
                          padding: '3px 9px',
                          borderRadius: '2px',
                          letterSpacing: '0.04em',
                          background: 'rgba(255,255,255,0.04)',
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded ? 'translateY(0)' : 'translateY(8px)',
                          transition: isExpanded
                            ? `opacity 0.35s ease ${0.35 + j * 0.065}s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${0.35 + j * 0.065}s`
                            : 'none',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Project */}
                <a
                  href={project.link}
                  onClick={e => { if (project.link === '#') e.preventDefault(); }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#d4ff4f',
                    textDecoration: 'none',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'Menlo, monospace',
                    opacity: isExpanded ? 1 : 0,
                    transform: isExpanded ? 'translateX(0)' : 'translateX(12px)',
                    transition: isExpanded
                      ? 'opacity 0.35s ease 0.55s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.55s'
                      : 'none',
                    borderBottom: '1px solid rgba(212,255,79,0.3)',
                    paddingBottom: '2px',
                  }}
                >
                  View Project
                  <span aria-hidden="true" style={{ fontSize: '14px', fontFamily: 'inherit' }}>→</span>
                </a>
              </div>
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
            }, i * 120 + 60);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

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
          marginBottom: 'clamp(2.5rem, 5vh, 4.5rem)',
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div className="eyebrow mb-4">Selected Work</div>
          <h2
            className="font-display font-medium text-[#f5f5f2]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em', margin: 0 }}
          >
            Things I've built.
          </h2>
        </div>
        {/* Project count */}
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '11px',
            color: '#3a3a44',
            letterSpacing: '0.1em',
            paddingBottom: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ color: '#252530', fontSize: '18px', letterSpacing: '-0.04em' }}>—</span>
          {String(TOTAL).padStart(2, '0')} Projects
        </div>
      </div>

      {/* The index */}
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
            onTap={() => {
              if (isMobile) setExpandedIndex(prev => prev === i ? null : i);
            }}
          />
        ))}

        {/* Closing rule */}
        <div
          style={{
            margin: '0 5vw',
            height: '1px',
            backgroundColor: '#1f1f24',
            opacity: revealedRows.size >= TOTAL ? 1 : 0,
            transition: `opacity 0.5s ease ${TOTAL * 0.12 + 0.5}s`,
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
