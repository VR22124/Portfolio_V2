import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

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

      if (!isReducedMotion) {
        countersRef.current.forEach((counter, i) => {
          if (!counter) return;
          const targetValue = parseInt(data.stats[i].value, 10);
          gsap.fromTo(counter,
            { innerHTML: 0 },
            {
              innerHTML: targetValue,
              duration: 1.2,
              ease: 'power2.out',
              snap: { innerHTML: 1 },
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                once: true
              }
            }
          );
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="container-layout py-16 border-t border-b border-[#1f1f24] bg-[#08080a]/50 backdrop-blur-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {data.stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <div className="font-display text-4xl md:text-5xl font-bold text-[#d4ff4f] mb-2 flex items-baseline">
              <span ref={el => countersRef.current[i] = el}>{stat.value}</span>
              <span>{stat.suffix}</span>
            </div>
            <div className="text-sm text-[#8c8c94] font-medium tracking-wide uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}