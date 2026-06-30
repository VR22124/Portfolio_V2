import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
        }
      );

      if (!isReducedMotion) {
        countersRef.current.forEach((counter, i) => {
          if (!counter) return;
          const target = parseInt(data.stats[i].value, 10);
          gsap.fromTo({ val: 0 },
            { val: 0 },
            {
              val: target,
              duration: 1.4,
              ease: 'power2.out',
              delay: i * 0.1,
              onUpdate: function() {
                if (counter) counter.textContent = String(Math.round((this as any).targets()[0].val));
              },
              scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true }
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-b border-[#1f1f24] bg-[#08080a]/60 backdrop-blur-sm py-14"
      style={{ opacity: 0 }}
    >
      <div className="container-layout">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {data.stats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <div className="font-display text-5xl md:text-6xl font-bold text-[#d4ff4f] mb-2 flex items-baseline leading-none">
                <span ref={el => { countersRef.current[i] = el; }}>{stat.value}</span>
                <span className="text-2xl ml-0.5">{stat.suffix}</span>
              </div>
              <div className="text-xs text-[#8c8c94] font-medium tracking-[0.12em] uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
