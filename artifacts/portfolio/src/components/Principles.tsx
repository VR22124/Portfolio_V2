import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Principles() {
  const sectionRef = useRef<HTMLElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);

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
        cellRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 1 }); });
        return;
      }

      cellRefs.current.forEach((cell, i) => {
        if (!cell) return;
        gsap.fromTo(cell,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.65,
            ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              once: true
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container-layout section-padding section-frame"
    >
      <div className="eyebrow section-eyebrow mb-14" style={{ opacity: 0 }}>Core Principles</div>

      {/* 2×2 grid, hairline borders only — no card backgrounds, particles bleed through */}
      <div className="grid md:grid-cols-2 border-t border-l border-[#1f1f24] max-w-4xl">
        {data.principles.map((p, i) => (
          <div
            key={i}
            ref={el => { cellRefs.current[i] = el; }}
            className="p-10 border-r border-b border-[#1f1f24] hover:bg-[#111114]/20 transition-colors duration-500 cursor-default"
            style={{ opacity: 0 }}
          >
            <h4 className="font-display text-xl md:text-2xl text-[#f5f5f2] font-medium mb-4 leading-snug">
              {p.title}
            </h4>
            <p className="text-[#8c8c94] text-sm leading-relaxed max-w-sm">
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
