import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

const FULL_LINE = data.hero.headlineLine1;
const GLITCH_VARIANTS = [
  'I bu!ld th!ng$',
  'I bu1ld th1n9$',
  'I b\u00FCild th\u00EEng$',
];

/* ── Cycling typewriter for line 2 ─────────────────────────── */
function TypewriterText({ phrases, started }: { phrases: string[]; started: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const tick = useCallback(() => {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      setDisplayed(prev => prev.slice(0, -1));
      timeoutRef.current = setTimeout(tick, 42);
      if (displayed.length <= 1) {
        setIsDeleting(false);
        setPhraseIdx(i => (i + 1) % phrases.length);
      }
    } else {
      const next = current.slice(0, displayed.length + 1);
      setDisplayed(next);
      if (next === current) {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 1900);
      } else {
        timeoutRef.current = setTimeout(tick, 80);
      }
    }
  }, [phrases, phraseIdx, isDeleting, displayed]);

  useEffect(() => {
    if (!started) return;
    timeoutRef.current = setTimeout(tick, 180);
    return () => clearTimeout(timeoutRef.current);
  }, [tick, started]);

  if (!started) return <span style={{ color: 'transparent' }}>&#8203;</span>;

  return (
    <span>
      {displayed}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '3px',
          height: '0.82em',
          background: '#d4ff4f',
          marginLeft: '3px',
          verticalAlign: 'text-bottom',
          borderRadius: '1px',
          animation: 'heroCursorBlink 1.1s step-start infinite',
        }}
      />
    </span>
  );
}

/* ── Main Hero ──────────────────────────────────────────────── */
type Phase = 'idle' | 'typing' | 'glitch' | 'done';

export default function Hero({ started = false }: { started?: boolean }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const chevronRef  = useRef<HTMLDivElement>(null);

  const [typedLine1, setTypedLine1] = useState('');
  const [phase, setPhase]           = useState<Phase>('idle');
  const [glitchIdx, setGlitchIdx]   = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [showContent, setShowContent] = useState(false); // eyebrow / subtext / CTAs

  /* ── Sequential typing → glitch → done ──────────────────── */
  useEffect(() => {
    let cancelled = false;

    const startDelay = setTimeout(() => {
      if (cancelled) return;
      setPhase('typing');
      setShowCursor(true);

      let charIdx = 0;

      const typeNext = () => {
        if (cancelled) return;
        if (charIdx < FULL_LINE.length) {
          setTypedLine1(FULL_LINE.slice(0, charIdx + 1));
          charIdx++;
          const jitter = 55 + Math.random() * 45;
          setTimeout(typeNext, jitter);
        } else {
          // Done typing → brief pause → glitch
          setTimeout(() => {
            if (cancelled) return;
            setPhase('glitch');

            let frame = 0;
            const glitchInterval = setInterval(() => {
              frame++;
              setGlitchIdx(f => (f + 1) % GLITCH_VARIANTS.length);
              if (frame >= 6) {
                clearInterval(glitchInterval);
                if (!cancelled) {
                  setPhase('done');
                  setTypedLine1(FULL_LINE);
                  setTimeout(() => { if (!cancelled) setShowCursor(false); }, 300);
                  setTimeout(() => { if (!cancelled) setShowContent(true); }, 120);
                }
              }
            }, 55);
          }, 380);
        }
      };

      typeNext();
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
    };
  }, []);

  /* ── Chevron scroll fade (GSAP scrub only) ───────────────── */
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=200',
      scrub: true,
      onUpdate: (self) => {
        if (chevronRef.current) {
          chevronRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 5));
        }
      },
    });
    return () => trigger.kill();
  }, []);

  const displayLine1 = phase === 'glitch' ? GLITCH_VARIANTS[glitchIdx] : typedLine1;
  const line1Color   = phase === 'glitch' ? '#ff4455' : '#f5f5f2';

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center pt-28 pb-16"
    >
      <div className="hero-text-scrim" aria-hidden="true" />

      <div className="container-layout w-full relative z-10">
        <div className="max-w-[680px]">

          {/* Eyebrow */}
          <div
            className="eyebrow mb-8"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {data.hero.eyebrow}
          </div>

          {/* Headline */}
          <h1
            className="font-display font-medium leading-[0.93] tracking-[-0.03em] mb-2"
            style={{ fontSize: 'var(--text-hero)' }}
          >
            {/* Line 1 — typewriter + glitch */}
            <span
              className="block"
              style={{
                color: line1Color,
                transition: phase === 'glitch' ? 'none' : 'color 0.3s ease',
                filter: phase === 'glitch' ? 'blur(0.5px)' : 'none',
                animation: phase === 'glitch' ? 'heroGlitchShake 55ms linear infinite' : 'none',
                minHeight: '1em',
                display: 'flex',
                alignItems: 'center',
                gap: 0,
              }}
            >
              {displayLine1 || '\u00A0'}
              {showCursor && phase !== 'glitch' && (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    width: '3px',
                    height: '0.82em',
                    background: '#d4ff4f',
                    marginLeft: '4px',
                    verticalAlign: 'text-bottom',
                    borderRadius: '1px',
                    animation: 'heroCursorBlink 0.7s step-start infinite',
                  }}
                />
              )}
            </span>

            {/* Line 2 — cycling typewriter, starts after glitch settles */}
            <span
              className="block text-[#d4ff4f]"
              style={{
                opacity: phase === 'done' ? 1 : 0,
                transition: 'opacity 0.4s ease 0.1s',
              }}
            >
              <TypewriterText phrases={data.hero.typewriterPhrases} started={phase === 'done'} />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="text-body text-[#8c8c94] max-w-[460px] mt-8 mb-12"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease 0.15s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}
          >
            {data.hero.subtext}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.6s ease 0.28s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.28s',
            }}
          >
            <a
              href={data.hero.ctaPrimary.target}
              className="bg-[#d4ff4f] text-[#08080a] px-8 py-4 font-medium text-sm rounded-[2px] hover:bg-[#c8f03d] transition-colors inline-block"
            >
              {data.hero.ctaPrimary.label}
            </a>
            <a
              href={data.hero.ctaSecondary.target}
              className="border border-[#2e2e36] text-[#f5f5f2] px-8 py-4 font-medium text-sm rounded-[2px] hover:border-[#4a4a52] transition-colors inline-block"
            >
              {data.hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4a4a52] pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#4a4a52]" />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </div>
    </section>
  );
}
