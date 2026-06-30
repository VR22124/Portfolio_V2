import { useState, useEffect, useRef, useCallback } from 'react';
import data from '../data.json';

// ── Milestone map ─────────────────────────────────────────────────────────────
const MILESTONES = [
  { id: 'top',        label: 'Origin',     sub: 'Home'       },
  { id: 'journey',    label: 'Path',       sub: 'Journey'    },
  { id: 'skills',     label: 'Craft',      sub: 'Skills'     },
  { id: 'work',       label: 'Chronicles', sub: 'Projects'   },
  { id: 'experience', label: 'Tenure',     sub: 'Experience' },
  { id: 'contact',    label: 'Signal',     sub: 'Contact'    },
];

// ── Colors (exact portfolio tokens) ──────────────────────────────────────────
const C = {
  accent:    '#d4ff4f',
  accentDim: '#8a9c3a',
  bg:        '#08080a',
  elevated:  '#111114',
  textPrimary:   '#f5f5f2',
  textSecondary: '#8c8c94',
  textTertiary:  '#4a4a52',
  border:    '#1f1f24',
  borderBright: '#2e2e36',
};

function scrollToSection(id: string) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getActiveIndex(): number {
  const ids = MILESTONES.map(m => m.id);
  let active = 0;
  for (let i = 1; i < ids.length; i++) {
    const el = document.getElementById(ids[i]);
    if (el) {
      const top = el.getBoundingClientRect().top;
      if (top <= 100) active = i;
    }
  }
  return active;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ label, sub, visible }: { label: string; sub: string; visible: boolean }) {
  return (
    <div
      style={{
        position:   'absolute',
        bottom:     'calc(100% + 10px)',
        left:       '50%',
        transform:  `translateX(-50%) translateY(${visible ? 0 : 6}px)`,
        opacity:    visible ? 1 : 0,
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex:     100,
      }}
    >
      <div style={{
        background:   C.elevated,
        border:       `1px solid ${C.borderBright}`,
        borderRadius: 4,
        padding:      '5px 10px',
        display:      'flex',
        flexDirection: 'column',
        alignItems:   'center',
        gap:          1,
      }}>
        <span style={{ color: C.textPrimary, fontSize: 11, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ color: C.textTertiary, fontSize: 10, fontWeight: 400, fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {sub}
        </span>
      </div>
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        bottom:   -4,
        left:     '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width:    7, height: 7,
        background: C.elevated,
        border:     `1px solid ${C.borderBright}`,
        borderTop:  'none',
        borderLeft: 'none',
      }} />
    </div>
  );
}

// ── Node dot ──────────────────────────────────────────────────────────────────
function Node({
  milestone, isActive, isPast, onClick,
}: {
  milestone: typeof MILESTONES[0];
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const dotSize   = isActive ? 9 : hovered ? 7 : 5;
  const dotColor  = isActive ? C.accent : isPast ? C.accentDim : C.borderBright;
  const glowSize  = isActive ? '0 0 8px 2px rgba(212,255,79,0.55)' : hovered ? '0 0 5px 1px rgba(212,255,79,0.22)' : 'none';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:   'relative',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width:  22,
        height: 22,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
        zIndex: 2,
      }}
      aria-label={milestone.sub}
    >
      {/* Outer ring on active */}
      {isActive && (
        <div style={{
          position:     'absolute',
          width:        18,
          height:       18,
          borderRadius: '50%',
          border:       `1px solid rgba(212,255,79,0.30)`,
          animation:    'journey-ring-pulse 2.4s ease-in-out infinite',
        }} />
      )}

      {/* Core dot */}
      <div style={{
        width:        dotSize,
        height:       dotSize,
        borderRadius: '50%',
        background:   dotColor,
        boxShadow:    glowSize,
        transition:   'width 0.25s ease, height 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
      }} />

      <Tooltip label={milestone.label} sub={milestone.sub} visible={hovered} />
    </button>
  );
}

// ── Mobile drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({
  open, activeIdx, onClose,
}: {
  open: boolean;
  activeIdx: number;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:   'fixed',
          inset:      0,
          background: 'rgba(8,8,10,0.7)',
          zIndex:     90,
          opacity:    open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position:   'fixed',
        top:        0,
        left:       0,
        bottom:     0,
        width:      '72vw',
        maxWidth:   280,
        background: C.elevated,
        borderRight: `1px solid ${C.borderBright}`,
        zIndex:     91,
        transform:  open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.32s cubic-bezier(0.32,0,0.16,1)',
        display:    'flex',
        flexDirection: 'column',
        padding:    '80px 32px 40px',
      }}>
        {/* Title */}
        <div style={{ marginBottom: 36 }}>
          <span style={{ color: C.textTertiary, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
            Navigation
          </span>
        </div>

        {/* Vertical timeline */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Vertical track */}
          <div style={{
            position:   'absolute',
            left:       10,
            top:        10,
            bottom:     10,
            width:      1,
            background: C.border,
          }} />
          {/* Filled portion */}
          <div style={{
            position:   'absolute',
            left:       10,
            top:        10,
            width:      1,
            height:     `calc(${(activeIdx / (MILESTONES.length - 1)) * 100}% - 10px)`,
            background: `linear-gradient(to bottom, ${C.accent}, ${C.accentDim})`,
            transition: 'height 0.6s cubic-bezier(0.4,0,0.2,1)',
          }} />

          {MILESTONES.map((m, i) => {
            const isActive = i === activeIdx;
            const isPast   = i < activeIdx;
            return (
              <button
                key={m.id}
                onClick={() => { scrollToSection(m.id); onClose(); }}
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        20,
                  padding:    '14px 0',
                  background: 'transparent',
                  border:     'none',
                  cursor:     'pointer',
                  textAlign:  'left',
                  position:   'relative',
                }}
              >
                {/* Dot */}
                <div style={{
                  width:        isActive ? 9 : 5,
                  height:       isActive ? 9 : 5,
                  borderRadius: '50%',
                  background:   isActive ? C.accent : isPast ? C.accentDim : C.borderBright,
                  flexShrink:   0,
                  marginLeft:   isActive ? 6.5 : 8.5,
                  boxShadow:    isActive ? `0 0 8px 2px rgba(212,255,79,0.5)` : 'none',
                  transition:   'all 0.3s ease',
                  zIndex:       1,
                }} />

                {/* Labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{
                    color:       isActive ? C.accent : isPast ? C.textSecondary : C.textTertiary,
                    fontSize:    13,
                    fontWeight:  isActive ? 700 : 500,
                    fontFamily:  'Space Grotesk, sans-serif',
                    letterSpacing: '0.03em',
                    transition:  'color 0.3s ease',
                  }}>
                    {m.label}
                  </span>
                  <span style={{
                    color:      C.textTertiary,
                    fontSize:   10,
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {m.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href="#contact"
            onClick={onClose}
            style={{
              display:      'block',
              textAlign:    'center',
              padding:      '12px 20px',
              background:   C.accent,
              color:        C.bg,
              borderRadius: 999,
              fontSize:     13,
              fontWeight:   700,
              fontFamily:   'Space Grotesk, sans-serif',
              textDecoration: 'none',
            }}
          >
            Let's Talk
          </a>
        </div>
      </div>
    </>
  );
}

// ── Main Nav ──────────────────────────────────────────────────────────────────
export default function Nav() {
  const [scrolled,    setScrolled]    = useState(false);
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const fillPct = activeIdx / (MILESTONES.length - 1);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 60);

    // Scroll progress bar
    if (progressRef.current) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current.style.width = max > 0 ? `${Math.min((y / max) * 100, 100)}%` : '0%';
    }

    setActiveIdx(getActiveIndex());
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile drawer on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes journey-ring-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%       { opacity: 0.2; transform: scale(1.5); }
        }
      `}</style>

      {/* Scroll progress bar */}
      <div ref={progressRef} className="scroll-progress-bar" aria-hidden="true" />

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} activeIdx={activeIdx} onClose={() => setMobileOpen(false)} />

      {/* ── Fixed nav bar ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position:   'fixed',
          top:        0,
          left:       0,
          right:      0,
          zIndex:     40,
          padding:    '14px 0',
          background: scrolled ? 'rgba(8,8,10,0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: scrolled ? `1px solid rgba(255,255,255,0.05)` : '1px solid transparent',
          transition:  'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div className="container-layout" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* ── Left: Monogram ──────────────────────────────────────────── */}
          <button
            onClick={() => scrollToSection('top')}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         10,
              background:  'transparent',
              border:      'none',
              cursor:      'pointer',
              padding:     0,
              flexShrink:  0,
            }}
            aria-label="Scroll to top"
          >
            <div style={{
              width:      36, height: 36,
              background: C.accent,
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily:    'Space Grotesk, sans-serif',
                fontWeight:    700,
                color:         C.bg,
                fontSize:      13,
                letterSpacing: '-0.02em',
                lineHeight:    1,
              }}>
                {data.meta.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          </button>

          {/* ── Center: Journey timeline (desktop) ──────────────────────── */}
          <div
            style={{
              flex:         1,
              display:      'none',
              alignItems:   'center',
              position:     'relative',
              padding:      '0 8px',
            }}
            className="journey-timeline-desktop"
          >
            {/* Base track line */}
            <div style={{
              position:   'absolute',
              left:       11,
              right:      11,
              top:        '50%',
              height:     1,
              background: C.border,
              transform:  'translateY(-50%)',
              zIndex:     0,
            }} />

            {/* Filled / traveled portion */}
            <div style={{
              position:   'absolute',
              left:       11,
              top:        '50%',
              height:     1,
              width:      `calc(${fillPct * 100}% - 22px + 11px)`,
              background: `linear-gradient(to right, ${C.accent}, ${C.accentDim})`,
              transform:  'translateY(-50%)',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex:     1,
              boxShadow:  fillPct > 0 ? `0 0 6px 1px rgba(212,255,79,0.35)` : 'none',
            }} />

            {/* Nodes row */}
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              width:          '100%',
              position:       'relative',
              zIndex:         2,
            }}>
              {MILESTONES.map((m, i) => (
                <Node
                  key={m.id}
                  milestone={m}
                  isActive={i === activeIdx}
                  isPast={i < activeIdx}
                  onClick={() => scrollToSection(m.id)}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Availability + CTA (desktop) ─────────────────────── */}
          <div
            style={{ display: 'none', alignItems: 'center', gap: 16, flexShrink: 0 }}
            className="journey-right-desktop"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: '#4ade80',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ color: C.textSecondary, fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                Available
              </span>
            </div>
            <a
              href="#contact"
              style={{
                fontSize:     13,
                fontWeight:   700,
                fontFamily:   'Space Grotesk, sans-serif',
                background:   C.accent,
                color:        C.bg,
                padding:      '9px 20px',
                borderRadius: 999,
                textDecoration: 'none',
                transition:   'background 0.2s ease',
                whiteSpace:   'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c8f03d')}
              onMouseLeave={e => (e.currentTarget.style.background = C.accent)}
            >
              Let's Talk
            </a>
          </div>

          {/* ── Mobile: hamburger ───────────────────────────────────────── */}
          <div style={{ marginLeft: 'auto', display: 'flex' }} className="journey-mobile-menu">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                width:      36, height: 36,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border:     'none',
                cursor:     'pointer',
                color:      C.textPrimary,
                padding:    0,
              }}
              aria-label="Toggle navigation"
            >
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                {mobileOpen
                  ? <><path d="M1 1L17 11"/><path d="M17 1L1 11"/></>
                  : <><line x1="0" y1="1" x2="18" y2="1"/><line x1="4" y1="6" x2="18" y2="6"/><line x1="8" y1="11" x2="18" y2="11"/></>
                }
              </svg>
            </button>
          </div>

        </div>
      </nav>

      {/* ── Responsive show/hide via CSS ────────────────────────────────── */}
      <style>{`
        @media (min-width: 768px) {
          .journey-timeline-desktop { display: flex !important; }
          .journey-right-desktop    { display: flex !important; }
          .journey-mobile-menu      { display: none !important; }
        }
        @media (max-width: 767px) {
          .journey-timeline-desktop { display: none !important; }
          .journey-right-desktop    { display: none !important; }
          .journey-mobile-menu      { display: flex !important; }
        }
      `}</style>
    </>
  );
}
