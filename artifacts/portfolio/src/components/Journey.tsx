import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        itemRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 1, y: 0 }); });
        return;
      }

      // Section headline fades in
      gsap.fromTo(sectionRef.current!.querySelector('.section-eyebrow'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // Per-entry stagger — each item triggers when it enters the viewport
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(item,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
              once: true
            }
          }
        );

        // Dot pulses in along with its item
        const dot = dotRefs.current[i];
        if (dot) {
          gsap.fromTo(dot,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1,
              duration: 0.4,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                once: true
              }
            }
          );
        }
      });

      // Vertical line draws down — scrubbed to section scroll progress
      if (lineFillRef.current && lineTrackRef.current) {
        gsap.fromTo(lineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: 1,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="container-layout section-padding section-frame"
    >
      <div className="eyebrow section-eyebrow mb-14" style={{ opacity: 0 }}>The Journey</div>

      <div className="relative max-w-3xl">
        {/* Vertical line track */}
        <div
          ref={lineTrackRef}
          className="absolute left-[11px] md:left-[88px] top-2 bottom-2 w-[1px] bg-[#1f1f24]"
          aria-hidden="true"
        >
          <div
            ref={lineFillRef}
            className="absolute inset-0 bg-[#d4ff4f] origin-top"
            style={{ scaleY: 0 }}
          />
        </div>

        <div className="flex flex-col gap-14">
          {data.journey.map((item, i) => (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className="relative flex flex-col md:flex-row gap-4 md:gap-12 pl-8 md:pl-0"
              style={{ opacity: 0 }}
            >
              {/* Timeline dot */}
              <div
                ref={el => { dotRefs.current[i] = el; }}
                className="absolute left-[-5px] md:left-[82px] top-1 w-[11px] h-[11px] bg-[#08080a] border-2 border-[#d4ff4f] z-10"
                style={{ transform: 'scale(0)', opacity: 0 }}
                aria-hidden="true"
              />

              {/* Year */}
              <div className="md:w-36 shrink-0 pt-0.5">
                <span className="font-mono text-[#d4ff4f] text-sm tracking-wider">{item.year}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <h3 className="font-display text-xl md:text-2xl text-[#f5f5f2] font-medium leading-tight">
                    {item.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs border border-[#1f1f24] text-[#4a4a52] rounded-[2px] tracking-wide">
                    {item.tag}
                  </span>
                </div>
                <p className="text-body text-[#8c8c94] max-w-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
