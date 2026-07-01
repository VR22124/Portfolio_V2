import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type JourneyItem = (typeof data.journey)[number];

function MilestoneContent({
  item,
  align,
  isRevealed,
  isActive,
}: {
  item: JourneyItem;
  align: 'left' | 'right';
  isRevealed: boolean;
  isActive: boolean;
}) {
  const toRight = align === 'right';
  return (
    <div
      style={{
        textAlign: toRight ? 'right' : 'left',
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? 'translateX(0) translateY(0)'
          : toRight
            ? 'translateX(-28px)'
            : 'translateX(28px)',
        filter: isRevealed ? 'blur(0px)' : 'blur(6px)',
        transition: 'opacity 0.75s ease, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s ease',
      }}
    >
      <div
        style={{
          fontFamily: 'Menlo, monospace',
          fontSize: '10px',
          letterSpacing: '0.16em',
          color: '#d4ff4f',
          marginBottom: '0.5rem',
          opacity: 0.9,
        }}
      >
        {item.year}
      </div>

      <div
        aria-hidden="true"
        className="font-display"
        style={{
          fontSize: 'clamp(52px, 7vw, 88px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#d4ff4f',
          opacity: isActive ? 0.24 : 0.12,
          lineHeight: 1,
          marginBottom: '-0.12em',
          userSelect: 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        {item.year}
      </div>

      <div style={{ display: 'flex', marginBottom: '0.75rem', justifyContent: toRight ? 'flex-end' : 'flex-start' }}>
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'Menlo, monospace',
            letterSpacing: '0.12em',
            color: '#d4ff4f',
            textTransform: 'uppercase',
            padding: '3px 8px',
            border: '1px solid rgba(212,255,79,0.2)',
            borderRadius: '2px',
          }}
        >
          {item.tag}
        </span>
      </div>

      <h3
        className="font-display"
        style={{
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: isActive ? '#f5f5f2' : '#c8c8c4',
          marginBottom: '0.625rem',
          transition: 'color 0.4s ease',
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontSize: 'clamp(13px, 1vw, 15px)',
          color: '#8c8c94',
          lineHeight: 1.8,
          maxWidth: 280,
          marginLeft: toRight ? 'auto' : undefined,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [spineVisible, setSpineVisible] = useState(false);
  const [revealedRows, setRevealedRows] = useState<Set<number>>(new Set());
  const [activeRow, setActiveRow] = useState<number>(-1);
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
    const el = timelineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setSpineVisible(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedRows(new Set(data.journey.map((_, i) => i)));
      setActiveRow(0);
      return;
    }

    const cleanups: (() => void)[] = [];

    rowRefs.current.forEach((el, i) => {
      if (!el) return;

      const revealObs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedRows((prev) => { const n = new Set(prev); n.add(i); return n; });
            revealObs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
      );
      revealObs.observe(el);
      cleanups.push(() => revealObs.disconnect());

      const activeObs = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) setActiveRow(i); },
        { threshold: 0.4 }
      );
      activeObs.observe(el);
      cleanups.push(() => activeObs.disconnect());
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="container-layout section-padding">

      {/* Header */}
      <div
        style={{
          marginBottom: 'clamp(3rem, 6vh, 6rem)',
          maxWidth: '520px',
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
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
          The Journey
        </div>
        <p style={{ fontSize: 'clamp(14px, 1.1vw, 16px)', color: '#8c8c94', lineHeight: 1.8, margin: 0 }}>
          Six years from first commit to independent practice — every step a sharper understanding of what building actually means.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} style={{ position: 'relative' }}>

        {/* Desktop centre spine */}
        <div
          className="absolute hidden md:block"
          aria-hidden="true"
          style={{ left: '50%', top: 0, bottom: 0, width: 1, transform: 'translateX(-50%)', background: '#1f1f24' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, #d4ff4f, rgba(212,255,79,0.3))',
              transform: spineVisible ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top center',
              transition: 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          />
        </div>

        {/* Mobile left spine */}
        <div
          className="absolute md:hidden"
          aria-hidden="true"
          style={{ left: 0, top: 0, bottom: 0, width: 1, background: '#1f1f24' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, #d4ff4f, rgba(212,255,79,0.3))',
              transform: spineVisible ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top center',
              transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          />
        </div>

        {data.journey.map((item, i) => {
          const isLeft = i % 2 === 0;
          const isRevealed = revealedRows.has(i);
          const isActive = activeRow === i;
          const isDotActive = activeRow >= i;

          return (
            <div
              key={i}
              ref={(el) => { rowRefs.current[i] = el; }}
              style={{ position: 'relative', paddingBottom: i < data.journey.length - 1 ? 'clamp(56px, 8vh, 100px)' : 0 }}
            >
              {/* Desktop bilateral layout */}
              <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr 56px 1fr' }}>

                {/* Left slot */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '3rem' }}>
                  {isLeft && (
                    <div style={{ maxWidth: 300, width: '100%' }}>
                      <MilestoneContent item={item} align="right" isRevealed={isRevealed} isActive={isActive} />
                    </div>
                  )}
                </div>

                {/* Centre — dot */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 12 }}>
                  {/* Connector line */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: 17,
                      height: 1,
                      width: 64,
                      background: '#2e2e36',
                      ...(isLeft
                        ? { right: 'calc(50% + 5px)', transformOrigin: 'right center' }
                        : { left: 'calc(50% + 5px)', transformOrigin: 'left center' }),
                      transform: isRevealed ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.5s ease 0.3s',
                    }}
                  />

                  {/* Dot */}
                  <div
                    aria-hidden="true"
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: '#08080a',
                      border: `2px solid ${isActive ? '#d4ff4f' : (isDotActive ? '#8a9c3a' : '#2e2e36')}`,
                      boxShadow: isActive ? '0 0 0 5px rgba(212,255,79,0.12), 0 0 0 10px rgba(212,255,79,0.05)' : 'none',
                      position: 'relative',
                      zIndex: 2,
                      flexShrink: 0,
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? 'scale(1)' : 'scale(0)',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s, opacity 0.3s ease 0.25s, border-color 0.4s ease, box-shadow 0.4s ease',
                    }}
                  />
                </div>

                {/* Right slot */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '3rem' }}>
                  {!isLeft && (
                    <div style={{ maxWidth: 300, width: '100%' }}>
                      <MilestoneContent item={item} align="left" isRevealed={isRevealed} isActive={isActive} />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile single-column layout */}
              <div className="md:hidden" style={{ paddingLeft: '2rem', position: 'relative' }}>
                {/* Mobile dot */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: -5,
                    top: 18,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#08080a',
                    border: `2px solid ${isActive ? '#d4ff4f' : (isDotActive ? '#8a9c3a' : '#2e2e36')}`,
                    boxShadow: isActive ? '0 0 0 4px rgba(212,255,79,0.1)' : 'none',
                    zIndex: 2,
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'scale(1)' : 'scale(0)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s, opacity 0.3s ease 0.15s, border-color 0.4s ease, box-shadow 0.4s ease',
                  }}
                />

                <div
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(18px)',
                    filter: isRevealed ? 'blur(0px)' : 'blur(4px)',
                    transition: 'opacity 0.65s ease 0.12s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, filter 0.65s ease 0.12s',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Menlo, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.16em',
                      color: '#d4ff4f',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {item.year}
                  </div>

                  <div
                    aria-hidden="true"
                    className="font-display"
                    style={{
                      fontSize: 'clamp(44px, 10vw, 60px)',
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: '#d4ff4f',
                      opacity: 0.15,
                      lineHeight: 1,
                      marginBottom: '-0.05em',
                      userSelect: 'none',
                    }}
                  >
                    {item.year}
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '9px',
                      fontFamily: 'Menlo, monospace',
                      letterSpacing: '0.12em',
                      color: '#d4ff4f',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: '1px solid rgba(212,255,79,0.2)',
                      borderRadius: '2px',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.tag}
                  </span>

                  <h3
                    className="font-display"
                    style={{
                      fontSize: 'clamp(17px, 4.5vw, 22px)',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: '#f5f5f2',
                      marginBottom: '0.5rem',
                      display: 'block',
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: '#8c8c94', lineHeight: 1.8, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
