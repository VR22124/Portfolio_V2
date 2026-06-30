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
      gsap.fromTo(sectionRef.current!.querySelector('.section-eyebrow'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      if (isReducedMotion) {
        stepRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 1, y: 0 }); });
        return;
      }

      // Steps stagger in
      stepRefs.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(step,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true
            }
          }
        );
      });

      // Connecting line fills left-to-right scrubbed to scroll
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              end: 'bottom 55%',
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
      ref={sectionRef}
      className="container-layout section-padding section-frame"
    >
      <div className="eyebrow section-eyebrow mb-16" style={{ opacity: 0 }}>The Process</div>

      <div className="relative">
        {/* Connecting horizontal line — desktop only */}
        <div className="hidden md:block absolute top-[42px] left-0 right-0 h-[1px] bg-[#1f1f24]">
          <div ref={lineRef} className="h-full bg-[#d4ff4f] w-full origin-left" style={{ transform: 'scaleX(0)' }} />
        </div>

        <div className="grid md:grid-cols-4 gap-10 md:gap-6 relative z-10">
          {data.howIWork.map((step, i) => (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el; }}
              className="flex flex-col relative"
              style={{ opacity: 0 }}
            >
              {/* Dot on the line */}
              <div className="hidden md:block absolute top-[36px] left-0 w-3 h-3 bg-[#08080a] border-2 border-[#d4ff4f]" aria-hidden="true" />

              {/* Step number — outlined lime */}
              <div
                className="font-display text-6xl font-bold mb-8 md:mb-0 text-transparent select-none"
                style={{ WebkitTextStroke: '1px #d4ff4f', lineHeight: 1 }}
              >
                {step.step}
              </div>

              <div className="md:mt-14">
                <h4 className="text-lg font-display text-[#f5f5f2] font-medium mb-3 leading-snug">
                  {step.title}
                </h4>
                <p className="text-sm text-[#8c8c94] leading-relaxed">
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
