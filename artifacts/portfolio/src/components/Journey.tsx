import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );

      if (!isReducedMotion && lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true
          }
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="container-layout section-padding">
      <div className="eyebrow mb-12">The Journey</div>
      <div ref={containerRef} className="relative max-w-3xl pl-8 md:pl-0">
        
        {/* Timeline line */}
        <div className="absolute left-[11px] md:left-[80px] top-4 bottom-0 w-[2px]">
          <svg width="2" height="100%" preserveAspectRatio="none" className="absolute inset-0">
            <line x1="1" y1="0" x2="1" y2="100%" stroke="#1f1f24" strokeWidth="2" />
            <line ref={lineRef} x1="1" y1="0" x2="1" y2="100%" stroke="#d4ff4f" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex flex-col gap-16">
          {data.journey.map((item, i) => (
            <div key={i} className="relative flex flex-col md:flex-row gap-6 md:gap-16">
              <div className="absolute left-[-37px] md:left-[-6px] top-1.5 w-3 h-3 rounded-none bg-[#111114] border-2 border-[#d4ff4f] z-10" />
              <div className="md:w-32 pt-1 font-mono text-[#d4ff4f] text-sm shrink-0">
                {item.year}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="font-display text-xl md:text-2xl text-[#f5f5f2] font-medium">{item.title}</h3>
                  <span className="px-2.5 py-1 text-xs border border-[#1f1f24] text-[#8c8c94] rounded-[2px]">{item.tag}</span>
                </div>
                <p className="text-body text-[#8c8c94]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}