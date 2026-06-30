import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

type JourneyItem = (typeof data.journey)[number];

function MilestoneContent({ item, align }: { item: JourneyItem; align: 'left' | 'right' }) {
  const toRight = align === 'right';
  return (
    <div style={{ textAlign: toRight ? 'right' : 'left' }}>
      {/* Ghost year — large, barely visible */}
      <div
        className="font-display font-bold leading-none select-none"
        style={{
          fontSize: 'clamp(52px, 7vw, 88px)',
          letterSpacing: '-0.04em',
          color: '#d4ff4f',
          opacity: 0.08,
          lineHeight: 1,
          marginBottom: '-0.1em',
        }}
        aria-hidden="true"
      >
        {item.year}
      </div>

      {/* Tag */}
      <div className={`flex mb-3 ${toRight ? 'justify-end' : 'justify-start'}`}>
        <span className="text-[10px] font-medium tracking-[0.12em] text-[#d4ff4f] uppercase px-2.5 py-1 border border-[#d4ff4f]/20 rounded-[2px]">
          {item.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display text-[#f5f5f2] font-medium mb-3"
        style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', letterSpacing: '-0.02em' }}
      >
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="text-body text-[#8c8c94] leading-relaxed"
        style={{ maxWidth: 300, marginLeft: toRight ? 'auto' : undefined }}
      >
        {item.description}
      </p>
    </div>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // Section header
      gsap.fromTo(
        sectionRef.current!.querySelector('.chronicle-header'),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      // Spine draws scrubbed to scroll progress
      if (spineFillRef.current && timelineRef.current) {
        gsap.fromTo(spineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 58%',
              end: 'bottom 58%',
              scrub: 1.5,
            },
          }
        );
      }

      if (isReducedMotion) {
        [...desktopContentRefs.current, ...mobileContentRefs.current].forEach(el => {
          if (el) el.style.opacity = '1';
        });
        dotRefs.current.forEach(d => {
          if (d) { d.style.opacity = '1'; d.style.transform = 'scale(1)'; }
        });
        connectorRefs.current.forEach(c => {
          if (c) c.style.transform = 'scaleX(1)';
        });
        return;
      }

      data.journey.forEach((_, i) => {
        const row = rowRefs.current[i];
        const desktopContent = desktopContentRefs.current[i];
        const mobileContent = mobileContentRefs.current[i];
        const dot = dotRefs.current[i];
        const connector = connectorRefs.current[i];
        const isLeft = i % 2 === 0;

        if (!row) return;

        const contentEl = isMobile ? mobileContent : desktopContent;

        // Content slides in from its side (desktop) or fades up (mobile)
        if (contentEl) {
          gsap.fromTo(contentEl,
            {
              opacity: 0,
              x: isMobile ? 0 : (isLeft ? -44 : 44),
              y: isMobile ? 20 : 0,
              filter: 'blur(5px)',
            },
            {
              opacity: 1, x: 0, y: 0, filter: 'blur(0px)',
              duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 84%', once: true },
            }
          );
        }

        // Dot pops in
        if (dot) {
          gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)', delay: 0.25,
              scrollTrigger: { trigger: row, start: 'top 84%', once: true },
            }
          );
        }

        // Connector draws toward spine
        if (connector && !isMobile) {
          gsap.fromTo(connector,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 0.55, ease: 'power2.inOut', delay: 0.35,
              scrollTrigger: { trigger: row, start: 'top 84%', once: true },
            }
          );
        }

        // Active / past / future dot state while scrolling
        ScrollTrigger.create({
          trigger: row,
          start: 'top 52%',
          end: 'bottom 52%',
          onEnter: () => {
            if (!dot) return;
            gsap.to(dot, { borderColor: '#d4ff4f', boxShadow: '0 0 0 5px rgba(212,255,79,0.12), 0 0 0 10px rgba(212,255,79,0.05)', duration: 0.35 });
            dotRefs.current.forEach((d, j) => {
              if (!d || j === i) return;
              gsap.to(d, { borderColor: j < i ? '#8a9c3a' : '#2e2e36', boxShadow: 'none', duration: 0.35 });
            });
          },
          onLeave: () => {
            if (dot) gsap.to(dot, { borderColor: '#8a9c3a', boxShadow: 'none', duration: 0.3 });
          },
          onEnterBack: () => {
            if (!dot) return;
            gsap.to(dot, { borderColor: '#d4ff4f', boxShadow: '0 0 0 5px rgba(212,255,79,0.12), 0 0 0 10px rgba(212,255,79,0.05)', duration: 0.35 });
            dotRefs.current.forEach((d, j) => {
              if (!d || j === i) return;
              gsap.to(d, { borderColor: j < i ? '#8a9c3a' : '#2e2e36', boxShadow: 'none', duration: 0.35 });
            });
          },
          onLeaveBack: () => {
            if (dot) gsap.to(dot, { borderColor: '#2e2e36', boxShadow: 'none', duration: 0.3 });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="container-layout section-padding">

      {/* Header */}
      <div className="chronicle-header mb-24 max-w-lg" style={{ opacity: 0 }}>
        <div className="eyebrow mb-5">The Journey</div>
        <p className="text-[#8c8c94] text-body leading-relaxed">
          Six years from first commit to independent practice — every step a sharper understanding of what building actually means.
        </p>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative">

        {/* ── Desktop spine (vertical center line) ── */}
        <div
          className="absolute hidden md:block"
          aria-hidden="true"
          style={{ left: '50%', top: 0, bottom: 0, width: 1, transform: 'translateX(-50%)', background: '#1f1f24' }}
        >
          <div
            ref={spineFillRef}
            className="absolute inset-0"
            style={{ background: '#d4ff4f', transform: 'scaleY(0)', transformOrigin: 'top center' }}
          />
        </div>

        {/* ── Mobile spine (left edge) ── */}
        <div
          className="absolute md:hidden"
          aria-hidden="true"
          style={{ left: 0, top: 0, bottom: 0, width: 1, background: '#1f1f24' }}
        />

        {data.journey.map((item, i) => {
          const isLeft = i % 2 === 0;

          return (
            <div
              key={i}
              ref={el => { rowRefs.current[i] = el; }}
              className="relative"
              style={{ paddingBottom: i < data.journey.length - 1 ? 100 : 0 }}
            >
              {/* ── Desktop bilateral layout ── */}
              <div className="hidden md:grid" style={{ gridTemplateColumns: '1fr 56px 1fr' }}>

                {/* Left slot */}
                <div className="flex justify-end pr-12">
                  {isLeft && (
                    <div
                      ref={el => { desktopContentRefs.current[i] = el; }}
                      className="max-w-[300px]"
                      style={{ opacity: 0 }}
                    >
                      <MilestoneContent item={item} align="right" />
                    </div>
                  )}
                </div>

                {/* Center — dot + connector */}
                <div className="relative flex items-start justify-center" style={{ paddingTop: 12 }}>
                  {/* Connector — left side */}
                  {isLeft && (
                    <div
                      ref={el => { connectorRefs.current[i] = el; }}
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        right: 'calc(50% + 5px)',
                        top: 17,
                        height: 1,
                        width: 72,
                        background: '#2e2e36',
                        transformOrigin: 'right center',
                        transform: 'scaleX(0)',
                      }}
                    />
                  )}

                  {/* Connector — right side */}
                  {!isLeft && (
                    <div
                      ref={el => { connectorRefs.current[i] = el; }}
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: 'calc(50% + 5px)',
                        top: 17,
                        height: 1,
                        width: 72,
                        background: '#2e2e36',
                        transformOrigin: 'left center',
                        transform: 'scaleX(0)',
                      }}
                    />
                  )}

                  {/* Dot */}
                  <div
                    ref={el => { dotRefs.current[i] = el; }}
                    aria-hidden="true"
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: '#08080a',
                      border: '2px solid #2e2e36',
                      position: 'relative',
                      zIndex: 2,
                      flexShrink: 0,
                      transform: 'scale(0)',
                      opacity: 0,
                      transition: 'box-shadow 0.35s ease',
                    }}
                  />
                </div>

                {/* Right slot */}
                <div className="flex justify-start pl-12">
                  {!isLeft && (
                    <div
                      ref={el => { desktopContentRefs.current[i] = el; }}
                      className="max-w-[300px]"
                      style={{ opacity: 0 }}
                    >
                      <MilestoneContent item={item} align="left" />
                    </div>
                  )}
                </div>
              </div>

              {/* ── Mobile single-column layout ── */}
              <div className="md:hidden pl-8 relative">
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
                    border: '2px solid #2e2e36',
                    zIndex: 2,
                  }}
                />

                <div
                  ref={el => { mobileContentRefs.current[i] = el; }}
                  style={{ opacity: 0 }}
                >
                  {/* Ghost year */}
                  <div
                    className="font-display font-bold leading-none select-none"
                    style={{
                      fontSize: 'clamp(44px, 10vw, 60px)',
                      letterSpacing: '-0.04em',
                      color: '#d4ff4f',
                      opacity: 0.1,
                      lineHeight: 1,
                      marginBottom: '-0.05em',
                    }}
                    aria-hidden="true"
                  >
                    {item.year}
                  </div>
                  <span className="text-[10px] font-medium tracking-[0.12em] text-[#d4ff4f] uppercase px-2.5 py-1 border border-[#d4ff4f]/20 rounded-[2px] inline-block mb-3">
                    {item.tag}
                  </span>
                  <h3
                    className="font-display text-[#f5f5f2] font-medium mb-3"
                    style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', letterSpacing: '-0.02em' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-body text-[#8c8c94] leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
