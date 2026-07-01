import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

const PHASES = ['Discover', 'Architect', 'Execute', 'Handover'];
const TOTAL = data.howIWork.length;

interface StepProps {
  step: (typeof data.howIWork)[number];
  phase: string;
  isRevealed: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Step({ step, phase, isRevealed, isHovered, isMobile, onMouseEnter, onMouseLeave }: StepProps) {
  const num = step.step;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        padding: `clamp(3rem, 6vh, 5rem) 5vw`,
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Left accent strip — hover only */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, #d4ff4f, rgba(212,255,79,0.15))',
          boxShadow: isHovered ? '0 0 18px rgba(212,255,79,0.5)' : 'none',
          transform: isHovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
        }}
      />

      {/* Top rule */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: isHovered
            ? 'linear-gradient(to right, #d4ff4f 0%, rgba(212,255,79,0.18) 25%, #1a1a22 60%)'
            : '#1a1a22',
          transform: `scaleX(${isRevealed ? 1 : 0})`,
          transformOrigin: 'left',
          transition: isRevealed
            ? 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease'
            : 'background 0.35s ease',
        }}
      />

      {/* Subtle hover background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 100% at 0% 50%, rgba(212,255,79,0.04) 0%, transparent 70%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Massive watermark numeral */}
      <div
        aria-hidden="true"
        className="font-display"
        style={{
          position: 'absolute',
          right: isMobile ? '-5%' : '2%',
          top: '50%',
          transform: `translateY(-50%) scale(${isRevealed ? 1 : 0.85})`,
          fontWeight: 900,
          fontSize: isMobile ? 'clamp(120px, 40vw, 220px)' : 'clamp(140px, 20vw, 320px)',
          lineHeight: 1,
          letterSpacing: '-0.07em',
          color: isHovered ? '#d4ff4f' : '#f5f5f2',
          opacity: isHovered ? 0.1 : (isRevealed ? 0.07 : 0),
          transition: 'opacity 0.4s ease, color 0.4s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {num}
      </div>

      {/* Content layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'clamp(140px, 18%, 220px) 1fr',
          gap: isMobile ? '1.5rem' : 'clamp(2rem, 4vw, 6rem)',
          alignItems: 'center',
          minHeight: isMobile ? undefined : 'clamp(10rem, 18vh, 16rem)',
        }}
      >
        {/* Left: phase badge + counter */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '1rem' : '0.75rem',
          }}
        >
          {/* Phase badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: 'Menlo, monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: isHovered ? '#d4ff4f' : '#2e2e3a',
              border: `1px solid ${isHovered ? 'rgba(212,255,79,0.35)' : 'rgba(255,255,255,0.05)'}`,
              padding: '4px 8px',
              borderRadius: '2px',
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateX(0)' : 'translateX(-10px)',
              transition: isRevealed
                ? 'opacity 0.45s ease 0.12s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, color 0.35s ease, border-color 0.35s ease'
                : 'color 0.35s ease, border-color 0.35s ease',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: isHovered ? '#d4ff4f' : 'transparent',
                border: isHovered ? 'none' : '1px solid #3a3a44',
                flexShrink: 0,
                transition: 'background 0.35s ease, border-color 0.35s ease',
              }}
            />
            {phase}
          </div>

          {/* Step counter */}
          <div
            style={{
              fontFamily: 'Menlo, monospace',
              fontSize: '11px',
              color: isHovered ? '#d4ff4f' : '#252530',
              letterSpacing: '0.08em',
              opacity: isRevealed ? 1 : 0,
              transition: isRevealed
                ? 'opacity 0.4s ease 0.2s, color 0.35s ease'
                : 'color 0.35s ease',
            }}
          >
            {num} / {String(TOTAL).padStart(2, '0')}
          </div>
        </div>

        {/* Right: title + description */}
        <div>
          <h3
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 56px)',
              letterSpacing: '-0.03em',
              color: '#f5f5f2',
              lineHeight: 1.1,
              margin: '0 0 clamp(0.875rem, 1.5vh, 1.25rem) 0',
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
              transition: isRevealed
                ? 'opacity 0.6s ease 0.28s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.28s'
                : 'none',
            }}
          >
            {step.title}
          </h3>

          {/* Accent underline — hover only */}
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'linear-gradient(to right, rgba(212,255,79,0.4), transparent 65%)',
              width: isHovered ? '55%' : '0%',
              marginBottom: 'clamp(0.875rem, 1.5vh, 1.25rem)',
              transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <p
            style={{
              fontSize: 'clamp(14px, 1.1vw, 16px)',
              color: isHovered ? '#b0b0ba' : '#8c8c94',
              lineHeight: 1.8,
              margin: 0,
              maxWidth: '520px',
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
              transition: isRevealed
                ? 'opacity 0.5s ease 0.45s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, color 0.35s ease'
                : 'color 0.35s ease',
            }}
          >
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      setRevealedSteps(new Set(data.howIWork.map((_, i) => i)));
      return;
    }
    const cleanups: (() => void)[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setRevealedSteps((prev) => { const n = new Set(prev); n.add(i); return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      cleanups.push(() => obs.disconnect());
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  const headerWords = 'How I work.'.split(' ');

  return (
    <section
      ref={sectionRef}
      id="how-i-work"
      style={{ padding: 'clamp(5rem, 10vh, 9rem) 0', position: 'relative' }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0 5vw',
          marginBottom: 'clamp(3.5rem, 7vh, 6rem)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
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
              marginBottom: '1.25rem',
              opacity: headerVisible ? 0.85 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            Process
          </div>
          <h2
            className="font-display"
            aria-label="How I work."
            style={{
              fontWeight: 500,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#f5f5f2',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.3em',
              margin: 0,
            }}
          >
            {headerWords.map((word, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  opacity: headerVisible ? 1 : 0,
                  transform: headerVisible ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.6s ease ${0.08 + i * 0.13}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.08 + i * 0.13}s`,
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Progress dots — track revealed steps */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingBottom: '0.25rem',
            opacity: headerVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.4s',
          }}
        >
          {data.howIWork.map((_, i) => {
            const isHov = hoveredIndex === i;
            const isRev = revealedSteps.has(i);
            return (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  width: isHov ? '22px' : (isRev ? '10px' : '6px'),
                  height: '6px',
                  borderRadius: '3px',
                  background: isHov ? '#d4ff4f' : (isRev ? '#3a3a44' : '#1e1e28'),
                  boxShadow: isHov ? '0 0 10px rgba(212,255,79,0.7)' : 'none',
                  transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease, box-shadow 0.35s ease',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div>
        {data.howIWork.map((step, i) => (
          <div key={i} ref={(el) => { stepRefs.current[i] = el; }}>
            <Step
              step={step}
              phase={PHASES[i]}
              isRevealed={revealedSteps.has(i)}
              isHovered={!isMobile && hoveredIndex === i}
              isMobile={isMobile}
              onMouseEnter={() => { if (!isMobile) setHoveredIndex(i); }}
              onMouseLeave={() => { if (!isMobile) setHoveredIndex(null); }}
            />
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{
            margin: '0 5vw',
            height: '1px',
            backgroundColor: '#1a1a22',
            opacity: revealedSteps.size >= TOTAL ? 1 : 0,
            transition: 'opacity 0.6s ease 0.5s',
          }}
        />
      </div>
    </section>
  );
}
