import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Principles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="container-layout section-padding">
      <div className="eyebrow mb-12">Core Principles</div>
      <div className="grid md:grid-cols-2 border-t border-l border-[#1f1f24]">
        {data.principles.map((principle, i) => (
          <div key={i} className="p-10 border-r border-b border-[#1f1f24] hover:bg-[#111114]/30 transition-colors">
            <h4 className="font-display text-2xl text-[#f5f5f2] mb-4">{principle.title}</h4>
            <p className="text-[#8c8c94] text-sm leading-relaxed max-w-sm">{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}