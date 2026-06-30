import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
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
    <section id="skills" ref={containerRef} className="container-layout section-padding">
      <div className="eyebrow mb-12">Technical Arsenal</div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.skills.map((skill, i) => {
          const Icon = (SiIcons as any)[skill.icon];
          return (
            <div key={i} className="group p-6 border border-[#1f1f24] bg-[#111114]/40 backdrop-blur-sm rounded-[2px] transition-all hover:border-[#2e2e36] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                {Icon && <Icon size={24} className="text-[#8c8c94] group-hover:text-[#d4ff4f] transition-colors duration-300" />}
                <span className="text-xs font-mono text-[#4a4a52]">{skill.category}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-[#f5f5f2] mb-3">{skill.name}</div>
                <div className="w-full h-1 bg-[#1f1f24] rounded-none overflow-hidden">
                  <div 
                    className="h-full bg-[#4a4a52] group-hover:bg-[#d4ff4f] transition-all duration-500" 
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}