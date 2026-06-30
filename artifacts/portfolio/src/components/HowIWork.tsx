import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!.querySelector('.hiw-header'),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );

      // Scroll-scrubbed connecting line
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: 'left center', ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 50%',
              end: 'bottom 60%',
              scrub: 1,
            }
          }
        );
      }

      if (!isReducedMotion) {
        stepRefs.current.forEach((step, i) => {
          if (!step) return;
          const numEl = step.querySelector('.step-num');
          const contentEl = step.querySelector('.step-content');

          if (numEl) {
            gsap.fromTo(numEl,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.1,
                scrollTrigger: { trigger: step, start: 'top 82%', once: true } }
            );
          }
          if (contentEl) {
            gsap.fromTo(contentEl,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: i * 0.1 + 0.12,
                scrollTrigger: { trigger: step, start: 'top 82%', once: true } }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container-layout section-padding">
      <div className="hiw-header mb-20" style={{ opacity: 0 }}>
        <div className="eyebrow mb-4">Process</div>
        <h2 className="font-display font-medium text-[#f5f5f2] text-h1">How I work.</h2>
      </div>

      {/* Steps — horizontal on desktop */}
      <div className="relative">
        {/* Connecting line — scrub animated */}
        <div className="hidden md:block absolute top-[30px] left-12 right-12 h-[1px] bg-[#1f1f24]" aria-hidden="true">
          <div ref={lineRef} className="absolute inset-0 bg-[#d4ff4f] origin-left" style={{ scaleX: 0 }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {data.howIWork.map((step, i) => (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el; }}
              className="flex flex-col"
            >
              {/* Outlined numeral — large, decorative */}
              <div className="step-num mb-6" style={{ opacity: 0 }}>
                <div
                  className="font-display font-bold leading-none"
                  style={{
                    fontSize: 'clamp(48px, 5vw, 64px)',
                    letterSpacing: '-0.04em',
                    WebkitTextStroke: '1px rgba(212,255,79,0.3)',
                    color: 'transparent',
                  }}
                  aria-hidden="true"
                >
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <div className="step-content" style={{ opacity: 0 }}>
                <h3 className="font-display font-medium text-[#f5f5f2] mb-3"
                    style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                  {step.title}
                </h3>
                <p className="text-[#8c8c94]" style={{ fontSize: '15px', lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
