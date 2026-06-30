import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
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

  const featured = data.projects.filter(p => p.featured);
  const other = data.projects.filter(p => !p.featured);

  return (
    <section id="projects" ref={containerRef} className="container-layout section-padding">
      <div className="eyebrow mb-12">Selected Work</div>
      
      <div className="flex flex-col gap-12 mb-24">
        {featured.map((project, i) => (
          <a key={i} href={project.link} className="group block relative border border-[#1f1f24] rounded-[2px] overflow-hidden bg-[#111114]">
            <div className="aspect-video md:aspect-[21/9] w-full overflow-hidden relative">
              {/* CSS placeholder image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#18181c] to-[#08080a] group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                <span className="font-display text-8xl font-bold text-[#1f1f24]/30">{project.title[0]}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-3xl md:text-5xl font-display font-medium text-[#f5f5f2]">{project.title}</h3>
                    <svg className="w-6 h-6 text-[#d4ff4f] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <p className="text-lg text-[#8c8c94] mb-2">{project.subtitle}</p>
                  <p className="text-sm text-[#4a4a52]">{project.description}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                  <span className="font-mono text-sm text-[#4a4a52]">{project.year}</span>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs border border-[#1f1f24] text-[#8c8c94] rounded-[2px]">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="eyebrow mb-8">More Work</div>
      <div className="grid md:grid-cols-3 gap-6">
        {other.map((project, i) => (
          <a key={i} href={project.link} className="group p-6 border border-[#1f1f24] bg-[#111114]/40 hover:bg-[#18181c] rounded-[2px] transition-colors flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-display text-[#f5f5f2] group-hover:text-[#d4ff4f] transition-colors">{project.title}</h4>
              <span className="font-mono text-xs text-[#4a4a52]">{project.year}</span>
            </div>
            <p className="text-sm text-[#8c8c94] mb-6 flex-1">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map(tag => (
                <span key={tag} className="text-xs text-[#4a4a52]">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}