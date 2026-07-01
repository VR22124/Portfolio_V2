import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type Exp = (typeof data.experience)[number];

function SplitText({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <span role="text" aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            opacity: isActive ? 1 : 0,
            filter: isActive ? 'blur(0px)' : 'blur(14px)',
            transform: isActive ? 'translateX(0px) translateY(0px)' : 'translateX(-30px) translateY(4px)',
            transition: isActive
              ? `opacity 0.65s ease ${i * 0.038}s, filter 0.65s ease ${i * 0.038}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.038}s`
              : 'opacity 0.2s ease, filter 0.2s ease, transform 0.2s ease',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function Typewriter({
  text,
  isActive,
  delay = 0,
}: {
  text: string;
  isActive: boolean;
  delay?: number;
}) {
  const [shown, setShown] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itvRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (itvRef.current) clearInterval(itvRef.current);

    if (!isActive) {
      setShown('');
      return;
    }

    let idx = 0;
    timerRef.current = setTimeout(() => {
      itvRef.current = setInterval(() => {
        idx++;
        setShown(text.slice(0, idx));
        if (idx >= text.length && itvRef.current) clearInterval(itvRef.current);
      }, 34);
    }, delay * 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (itvRef.current) clearInterval(itvRef.current);
    };
  }, [isActive, text, delay]);

  const done = shown.length >= text.length;

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '2px',
          height: '0.85em',
          background: '#d4ff4f',
          marginLeft: '1px',
          verticalAlign: 'text-bottom',
          opacity: done ? 0 : 1,
          transition: done ? 'opacity 0.4s ease 0.6s' : 'none',
        }}
      />
    </span>
  );
}

function DesktopChapter({ exp, isActive }: { exp: Exp; isActive: boolean }) {
  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingRight: '8rem' }}>
      <h3
        className="font-display font-bold leading-none"
        style={{
          fontSize: 'clamp(56px, 9vw, 130px)',
          letterSpacing: '-0.035em',
          color: '#f5f5f2',
          marginBottom: '1.75rem',
          lineHeight: 0.92,
        }}
      >
        <SplitText text={exp.company} isActive={isActive} />
      </h3>

      <div
        aria-hidden="true"
        style={{
          height: '1px',
          backgroundColor: '#f5f5f2',
          opacity: isActive ? 0.14 : 0,
          width: isActive ? '100%' : '0%',
          transition: isActive
            ? 'width 1.05s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 0.45s ease 0.2s'
            : 'opacity 0.2s ease',
          marginBottom: '2.5rem',
        }}
      />

      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            color: '#d4ff4f',
            fontWeight: 600,
            fontSize: 'clamp(14px, 1.4vw, 20px)',
            letterSpacing: '0.01em',
            marginBottom: '0.45rem',
            minHeight: '1.6em',
          }}
        >
          <Typewriter text={exp.role} isActive={isActive} delay={0.5} />
        </div>
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#4a4a52',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: isActive ? 1 : 0,
            transition: isActive ? 'opacity 0.5s ease 1.05s' : 'opacity 0.15s ease',
          }}
        >
          {exp.period}
        </div>
      </div>

      <p
        style={{
          color: '#8c8c94',
          fontSize: 'clamp(14px, 1.15vw, 17px)',
          lineHeight: 1.85,
          maxWidth: '520px',
          marginBottom: '2.5rem',
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0)' : 'translateY(22px)',
          transition: isActive
            ? 'opacity 0.65s ease 0.88s, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.88s'
            : 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        {exp.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem 2rem' }}>
        {exp.highlights.map((hl, j) => (
          <div
            key={j}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '13px',
              color: '#8c8c94',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
              transition: isActive
                ? `opacity 0.45s ease ${1.0 + j * 0.09}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${1.0 + j * 0.09}s`
                : 'opacity 0.15s ease, transform 0.15s ease',
            }}
          >
            <span style={{ color: '#d4ff4f', fontSize: '10px', lineHeight: 1, flexShrink: 0 }}>→</span>
            {hl}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileChapter({ exp, isActive }: { exp: Exp; isActive: boolean }) {
  return (
    <div>
      <h3
        className="font-display font-bold leading-none text-[#f5f5f2]"
        style={{
          fontSize: 'clamp(38px, 12vw, 58px)',
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
        }}
      >
        {exp.company}
      </h3>
      <div
        style={{ height: '1px', backgroundColor: '#f5f5f2', opacity: 0.1, marginBottom: '1.25rem' }}
      />
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ color: '#d4ff4f', fontWeight: 600, fontSize: '14px', marginBottom: '0.3rem' }}>
          {exp.role}
        </div>
        <div
          style={{
            fontFamily: 'Menlo, monospace',
            fontSize: '10px',
            color: '#4a4a52',
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
          }}
        >
          {exp.period}
        </div>
      </div>
      <p style={{ color: '#8c8c94', fontSize: '14px', lineHeight: 1.8, marginBottom: '1.5rem' }}>
        {exp.description}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {exp.highlights.map((hl, j) => (
          <div
            key={j}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '13px',
              color: '#8c8c94',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateX(0)' : 'translateX(-14px)',
              transition: `opacity 0.4s ease ${j * 0.08}s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${j * 0.08}s`,
            }}
          >
            <span style={{ color: '#d4ff4f', fontSize: '10px', flexShrink: 0 }}>→</span>
            {hl}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const [activeChapter, setActiveChapter] = useState<number>(-1);
  const [enteredChapters, setEnteredChapters] = useState<Set<number>>(new Set());
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
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
      setEnteredChapters(new Set(data.experience.map((_, i) => i)));
      setActiveChapter(0);
      return;
    }

    const observers: IntersectionObserver[] = [];

    wrapperRefs.current.forEach((el, i) => {
      if (!el) return;

      const threshold = isMobile ? 0.18 : 0.4;

      const obs = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveChapter(i);
              setEnteredChapters(prev => {
                if (prev.has(i)) return prev;
                const next = new Set(prev);
                next.add(i);
                return next;
              });
            }
          });
        },
        { threshold }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [isMobile]);

  return (
    <section id="experience" className="relative">
      {/* ── Right-edge vertical chapter indicator (desktop only) ── */}
      <div
        aria-hidden="true"
        className="hidden lg:flex"
        style={{
          position: 'fixed',
          right: '2.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 30,
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
        }}
      >
        {data.experience.map((_, i) => {
          const isAct = activeChapter === i;
          const isPast = i < activeChapter;
          return (
            <div
              key={i}
              style={{
                height: '2px',
                width: isAct ? '28px' : '8px',
                borderRadius: '1px',
                backgroundColor: isAct ? '#d4ff4f' : isPast ? '#3a3a44' : '#1c1c22',
                boxShadow: isAct ? '0 0 10px 2px rgba(212,255,79,0.5)' : 'none',
                transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          );
        })}
      </div>

      {/* ── Mobile top progress bar ── */}
      <div
        aria-hidden="true"
        className="md:hidden flex gap-1.5 px-6 pt-6 pb-2"
      >
        {data.experience.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '2px',
              borderRadius: '1px',
              backgroundColor: i <= activeChapter ? '#d4ff4f' : '#1c1c22',
              transition: 'background-color 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* ── Section header ── */}
      <div
        style={{
          padding: 'clamp(4rem, 8vh, 7rem) 5vw clamp(2.5rem, 4vh, 4rem)',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <div className="eyebrow mb-4">Experience</div>
        <h2
          className="font-display font-medium text-[#f5f5f2]"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
        >
          Where I've worked.
        </h2>
      </div>

      {/* ── Chapters ── */}
      {data.experience.map((exp, i) => {
        const isActive = enteredChapters.has(i);

        if (isMobile) {
          return (
            <div
              key={i}
              ref={el => { wrapperRefs.current[i] = el; }}
              style={{
                padding: '3.5rem 5vw',
                borderTop: '1px solid #1f1f24',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(36px)',
                transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <MobileChapter exp={exp} isActive={isActive} />
            </div>
          );
        }

        return (
          <div
            key={i}
            ref={el => { wrapperRefs.current[i] = el; }}
            style={{ minHeight: '100vh', position: 'relative' }}
          >
            <div
              style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '0 5vw',
              }}
            >
              <DesktopChapter exp={exp} isActive={isActive} />
            </div>
          </div>
        );
      })}

      <div style={{ height: '5rem' }} />
    </section>
  );
}
