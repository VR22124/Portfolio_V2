import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function HowIWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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
        gsap.fromTo(lineRef.current, 
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true
            }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="container-layout section-padding">
      <div className="eyebrow mb-16">The Process</div>
      
      <div className="relative">
        <div className="hidden md:block absolute top-12 left-0 right-0 h-[2px] bg-[#1f1f24]">
          <div ref={lineRef} className="h-full bg-[#d4ff4f] w-full origin-left" />
        </div>
        
        <div className="grid md:grid-cols-4 gap-12 md:gap-6 relative z-10">
          {data.howIWork.map((step, i) => (
            <div key={i} className="flex flex-col relative">
              <div className="hidden md:block absolute top-12 left-0 w-3 h-3 bg-[#111114] border-2 border-[#d4ff4f] -translate-y-[5px]" />
              
              <div 
                className="font-display text-5xl font-bold mb-6 text-transparent"
                style={{ WebkitTextStroke: "1px #d4ff4f" }}
              >
                {step.step}
              </div>
              <h4 className="text-lg font-display text-[#f5f5f2] font-medium mb-3 md:mt-12">
                {step.title}
              </h4>
              <p className="text-sm text-[#8c8c94] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}