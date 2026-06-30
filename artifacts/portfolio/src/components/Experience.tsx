import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
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
      <div className="eyebrow mb-12">Experience</div>
      <div className="flex flex-col gap-6 max-w-4xl">
        {data.experience.map((exp, i) => (
          <div key={i} className={`p-8 md:p-12 border border-[#1f1f24] bg-[#111114]/50 backdrop-blur-sm rounded-[2px] transition-colors hover:border-[#2e2e36] ${i % 2 !== 0 ? 'md:ml-12' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-display text-[#f5f5f2] font-medium mb-1">{exp.role}</h3>
                <div className="text-[#8c8c94] font-medium">{exp.company}</div>
              </div>
              <div className="text-sm font-mono text-[#4a4a52]">{exp.period}</div>
            </div>
            
            <p className="text-[#8c8c94] mb-8 max-w-2xl">{exp.description}</p>
            
            <ul className="grid md:grid-cols-2 gap-3">
              {exp.highlights.map((highlight, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-[#8c8c94]">
                  <svg className="w-4 h-4 text-[#d4ff4f] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}