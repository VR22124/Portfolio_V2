import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import data from '../data.json';

const STATUS_MESSAGES = [
  'INITIALIZING SYSTEM',
  'LOADING ASSETS',
  'MAPPING PARTICLE FIELD',
  'CALIBRATING TIMELINE',
  'SYSTEM READY',
];

const RING_R = 58;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const [cornersVisible, setCornersVisible] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolio-loaded');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasLoaded || isReducedMotion) {
      onComplete();
      return;
    }

    // Initialize ring
    if (ringRef.current) {
      ringRef.current.style.strokeDasharray = String(CIRCUMFERENCE);
      ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE);
    }

    // Entrance sequence
    const tl = gsap.timeline();
    tl.call(() => setCornersVisible(true))
      .fromTo(monogramRef.current,
        { opacity: 0, scale: 0.85, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        0.2
      )
      .fromTo(statusRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.5
      );

    const DURATION = 2400;
    const startTime = performance.now();
    let raf: number;
    let lastStatusIdx = -1;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const p = Math.floor(eased * 100);

      // Ring progress
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - eased));
      }
      // Progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${p}%`;
      }
      // Number
      if (progressNumRef.current) {
        progressNumRef.current.textContent = String(p).padStart(2, '0');
      }

      // Status message flip
      const sIdx = Math.min(
        Math.floor(eased * STATUS_MESSAGES.length),
        STATUS_MESSAGES.length - 1
      );
      if (sIdx !== lastStatusIdx && statusRef.current) {
        lastStatusIdx = sIdx;
        const el = statusRef.current;
        gsap.to(el, {
          opacity: 0, y: -6, duration: 0.12,
          onComplete: () => {
            el.textContent = STATUS_MESSAGES[sIdx];
            gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.18 });
          }
        });
      }

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Brief pause at 100%, then curtain-slide upward to reveal site
        setTimeout(() => {
          // Ring glows, then entire overlay slides up
          gsap.timeline()
            .to(ringRef.current, { stroke: '#ffffff', duration: 0.25, ease: 'power2.in' })
            .to(containerRef.current, {
              yPercent: -105,
              duration: 0.95,
              ease: 'expo.inOut',
              onComplete: () => {
                sessionStorage.setItem('portfolio-loaded', 'true');
                onComplete();
              }
            }, '-=0.1');
        }, 380);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080a]"
    >
      {/* Corner brackets */}
      <div className={`loader-corners-visible-wrapper ${cornersVisible ? 'loader-corners-visible' : ''}`}
           style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="loader-corner loader-corner-tl" />
        <div className="loader-corner loader-corner-tr" />
        <div className="loader-corner loader-corner-bl" />
        <div className="loader-corner loader-corner-br" />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center gap-8 select-none">
        {/* SVG ring + Monogram */}
        <div
          ref={monogramRef}
          className="relative"
          style={{ width: '140px', height: '140px', opacity: 0 }}
        >
          <svg
            width="140" height="140"
            viewBox="0 0 140 140"
            style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="70" cy="70" r={RING_R}
              fill="none"
              stroke="rgba(212,255,79,0.12)"
              strokeWidth="1"
            />
            <circle
              ref={ringRef}
              cx="70" cy="70" r={RING_R}
              fill="none"
              stroke="#d4ff4f"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-display font-bold text-[#d4ff4f] tracking-tight"
            style={{ fontSize: '38px', lineHeight: 1 }}
          >
            {data.meta.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-4 w-52">
          <div className="w-full h-[1px] bg-[#1f1f24] overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-[#d4ff4f]"
              style={{ width: '0%', transition: 'width 0.05s linear' }}
            />
          </div>
          <div className="w-full flex justify-between items-center">
            <div
              ref={statusRef}
              className="text-[10px] font-medium tracking-[0.15em] text-[#4a4a52] uppercase"
            >
              {STATUS_MESSAGES[0]}
            </div>
            <div className="font-mono text-[#d4ff4f] text-xs tabular-nums">
              <span ref={progressNumRef}>00</span>
              <span className="text-[#4a4a52]">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom name */}
      <div className="absolute bottom-10 text-[10px] font-medium tracking-[0.2em] text-[#2a2a30] uppercase">
        {data.meta.name} — {data.meta.role}
      </div>
    </div>
  );
}
