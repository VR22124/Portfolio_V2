import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

/** Single digit column — rolls from 0 to `value` on trigger */
function DigitColumn({ value, triggered, delay = 0 }: {
  value: number;
  triggered: boolean;
  delay?: number;
}) {
  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        height: '1em',
        verticalAlign: 'top',
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: triggered ? `translateY(-${value * 10}%)` : 'translateY(0)',
          transition: triggered
            ? `transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`
            : 'none',
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <span key={d} style={{ display: 'block', flexShrink: 0, height: '1em', lineHeight: 1 }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

const TOTAL = data.howIWork.length;
const HEADER_WORDS = 'How I work.'.split(' ');

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* mobile breakpoint */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* header observer */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setHeaderVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* per-step observers */
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setRevealedSteps(new Set(data.howIWork.map((_, i) => i)));
      setActiveStep(0);
      return;
    }

    const cleanups: (() => void)[] = [];

    stepRefs.current.forEach((el, i) => {
      if (!el) return;

      /* reveal — fires once */
      const revealObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setRevealedSteps(prev => { const n = new Set(prev); n.add(i); return n; });
          revealObs.disconnect();
        }
      }, { threshold: 0.18 });
      revealObs.observe(el);
      cleanups.push(() => revealObs.disconnect());

      /* active — transfers glow as scroll moves */
      const activeObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setActiveStep(i);
      }, { threshold: 0.5 });
      activeObs.observe(el);
      cleanups.push(() => activeObs.disconnect());
    });

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-i-work"
      style={{ padding: 'clamp(5rem, 10vh, 9rem) 0', position: 'relative' }}
    >
      {/* ── Section header ─────────────────────────────────── */}
      <div style={{ padding: '0 5vw', marginBottom: 'clamp(4rem, 8vh, 7rem)' }}>
        {/* Eyebrow */}
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

        {/* Word-split headline */}
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
          {HEADER_WORDS.map((word, i) => (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: 'inline-block',
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease ${0.08 + i * 0.13}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.08 + i * 0.13}s`,
              }}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* ── Steps ──────────────────────────────────────────── */}
      <div style={{ position: 'relative' }}>

        {/* Static dashed full-height connector */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 'calc(5vw - 0.5px)',
            top: '2rem',
            bottom: '2rem',
            width: '1px',
            borderLeft: '1px dashed #1a1a22',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Accent progress line — grows as steps are revealed */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 'calc(5vw - 0.5px)',
            top: '2rem',
            width: '1px',
            height: `${(revealedSteps.size / TOTAL) * 100}%`,
            background:
              'linear-gradient(to bottom, rgba(212,255,79,0.55) 0%, rgba(212,255,79,0.08) 100%)',
            transition: 'height 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {data.howIWork.map((step, i) => {
          const isRevealed = revealedSteps.has(i);
          const isActive = activeStep === i;
          const d1 = parseInt(step.step[0]); // tens — always 0
          const d2 = parseInt(step.step[1]); // units — 1..4

          return (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el; }}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '0 5vw',
                marginBottom: i < TOTAL - 1 ? 'clamp(3rem, 7vh, 6rem)' : 0,
              }}
            >
              {/* Horizontal rule — draws across */}
              <div
                aria-hidden="true"
                style={{
                  height: '1px',
                  marginLeft: 'clamp(1.5rem, 2vw, 3rem)',
                  width: isRevealed ? '100%' : '0%',
                  background: isActive
                    ? 'linear-gradient(to right, rgba(212,255,79,0.4), #1f1f24 35%)'
                    : '#1f1f24',
                  transition: isRevealed
                    ? 'width 0.9s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease'
                    : 'background 0.5s ease',
                }}
              />

              {/* Content: number | title | description */}
              <div
                style={{
                  display: isMobile ? 'flex' : 'grid',
                  flexDirection: isMobile ? 'column' : undefined,
                  gridTemplateColumns: isMobile
                    ? undefined
                    : 'clamp(72px, 9vw, 140px) 1fr 1.1fr',
                  gap: isMobile ? '1rem' : 'clamp(2rem, 4.5vw, 6rem)',
                  alignItems: 'start',
                  paddingTop: 'clamp(1.5rem, 3vh, 2.25rem)',
                  marginLeft: 'clamp(1.5rem, 2vw, 3rem)',
                }}
              >
                {/* ── Left: step number (odometer) ── */}
                <div>
                  {/* "step" label */}
                  <div
                    style={{
                      fontFamily: 'Menlo, monospace',
                      fontSize: '9px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: isActive ? 'rgba(212,255,79,0.55)' : '#252530',
                      marginBottom: '0.25rem',
                      opacity: isRevealed ? 1 : 0,
                      transition: 'opacity 0.4s ease 0.05s, color 0.45s ease',
                    }}
                  >
                    step
                  </div>

                  {/* Odometer number wrapper (opacity + lift reveal) */}
                  <div
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? 'translateY(0)' : 'translateY(14px)',
                      transition: isRevealed
                        ? 'opacity 0.5s ease 0.05s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s'
                        : 'none',
                    }}
                  >
                    {/* color/glow ring */}
                    <div
                      style={{
                        fontFamily: 'Menlo, monospace',
                        fontWeight: 200,
                        fontSize: isMobile
                          ? 'clamp(52px, 14vw, 88px)'
                          : 'clamp(56px, 9vw, 136px)',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: isActive ? '#d4ff4f' : '#1e1e28',
                        textShadow: isActive
                          ? '0 0 32px rgba(212,255,79,0.5)'
                          : 'none',
                        transition: 'color 0.5s ease, text-shadow 0.5s ease',
                        userSelect: 'none',
                      }}
                    >
                      <DigitColumn value={d1} triggered={isRevealed} delay={0} />
                      <DigitColumn value={d2} triggered={isRevealed} delay={0.1} />
                    </div>
                  </div>
                </div>

                {/* ── Center: title ── */}
                <div
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateX(0)' : 'translateX(-22px)',
                    transition: isRevealed
                      ? 'opacity 0.55s ease 0.22s, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.22s'
                      : 'none',
                    paddingTop: isMobile ? 0 : '0.6rem',
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      fontWeight: 600,
                      fontSize: 'clamp(18px, 2vw, 30px)',
                      letterSpacing: '-0.02em',
                      color: '#f5f5f2',
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {step.title}
                  </h3>
                </div>

                {/* ── Right: description ── */}
                <div
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
                    transition: isRevealed
                      ? 'opacity 0.5s ease 0.4s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
                      : 'none',
                    paddingTop: isMobile ? 0 : '0.65rem',
                  }}
                >
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#8c8c94',
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Closing rule */}
        <div
          aria-hidden="true"
          style={{
            margin: `clamp(3rem, 6vh, 5rem) 5vw 0`,
            marginLeft: 'calc(5vw + clamp(1.5rem, 2vw, 3rem))',
            height: '1px',
            backgroundColor: '#1f1f24',
            opacity: revealedSteps.size >= TOTAL ? 1 : 0,
            transition: 'opacity 0.5s ease 0.5s',
          }}
        />
      </div>
    </section>
  );
}
