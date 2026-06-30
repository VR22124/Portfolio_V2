import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

// Rich per-project gradient covers — dark but distinctive, driven by index
const PROJECT_PALETTES = [
  // Ledger — deep teal-to-midnight
  'linear-gradient(135deg, #0d1f2d 0%, #091520 40%, #08080a 100%)',
  // Fieldnote — slate-green twilight
  'linear-gradient(135deg, #0e1a14 0%, #0a1510 40%, #08080a 100%)',
  // Arc — deep purple-charcoal
  'linear-gradient(135deg, #14101f 0%, #0f0c18 40%, #08080a 100%)',
  // Pulse — dark amber-to-black
  'linear-gradient(135deg, #1a1008 0%, #120c06 40%, #08080a 100%)',
];

const ACCENT_STOPS = [
  'rgba(15, 60, 80, 0.35)',    // teal
  'rgba(20, 55, 35, 0.35)',    // forest
  'rgba(40, 25, 75, 0.35)',    // indigo
  'rgba(75, 40, 10, 0.35)',    // amber
];

function FeaturedCard({ project, index }: { project: typeof data.projects[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cardRef.current || isReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true }
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const bg = PROJECT_PALETTES[index % PROJECT_PALETTES.length];
  const accentStop = ACCENT_STOPS[index % ACCENT_STOPS.length];

  return (
    <a
      ref={cardRef}
      href={project.link}
      className="group block relative border border-[#1f1f24] rounded-[2px] overflow-hidden hover:border-[#2e2e36] transition-border duration-500"
      style={{ opacity: 0 }}
    >
      {/* Cover image area */}
      <div className="aspect-video md:aspect-[21/9] w-full overflow-hidden relative bg-[#0d0d10]">
        {/* Rich gradient base */}
        <div
          className="absolute inset-0 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          style={{ background: bg }}
        />

        {/* Accent radial glow — suggests depth */}
        <div
          className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentStop} 0%, transparent 60%)` }}
        />

        {/* Project initial — large, barely visible, adds depth */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span
            className="font-display font-bold text-[#f5f5f2] select-none"
            style={{
              fontSize: 'clamp(100px, 18vw, 240px)',
              opacity: 0.04,
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            {project.title[0]}
          </span>
        </div>

        {/* Bottom gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent" />

        {/* Content overlaid at bottom */}
        <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-3xl md:text-5xl font-display font-medium text-[#f5f5f2] leading-none">
                {project.title}
              </h3>
              <svg
                className="w-5 h-5 text-[#d4ff4f] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-base text-[#8c8c94] mb-1.5">{project.subtitle}</p>
            <p className="text-sm text-[#4a4a52] leading-relaxed max-w-lg">{project.description}</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <span className="font-mono text-sm text-[#4a4a52]">{project.year}</span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs border border-[#2e2e36]/60 text-[#8c8c94] rounded-[2px]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const featured = data.projects.filter(p => p.featured);
  const other = data.projects.filter(p => !p.featured);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!.querySelector('.section-eyebrow'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      if (moreRef.current) {
        gsap.fromTo(moreRef.current.querySelectorAll('.more-card'),
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
            scrollTrigger: { trigger: moreRef.current, start: 'top 85%', once: true }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="container-layout section-padding"
      style={{ minHeight: '180vh' }}
    >
      <div className="eyebrow section-eyebrow mb-12" style={{ opacity: 0 }}>Selected Work</div>

      {/* Featured — each takes generous height, allowed to span 2 viewport heights total */}
      <div className="flex flex-col gap-10 mb-20">
        {featured.map((project, i) => (
          <FeaturedCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* More Work — compact 3-col grid */}
      <div ref={moreRef}>
        <div className="eyebrow mb-8" style={{ opacity: 0 }}>More Work</div>
        <div className="grid md:grid-cols-3 gap-4">
          {other.map((project, i) => (
            <a
              key={project.id}
              href={project.link}
              className="more-card group p-6 border border-[#1f1f24] bg-[#111114]/40 hover:bg-[#111114] hover:border-[#2e2e36] rounded-[2px] transition-all duration-300 flex flex-col"
              style={{ opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-display text-[#f5f5f2] group-hover:text-[#d4ff4f] transition-colors duration-200">
                  {project.title}
                </h4>
                <span className="font-mono text-xs text-[#4a4a52] shrink-0 ml-3 mt-0.5">{project.year}</span>
              </div>
              <p className="text-sm text-[#8c8c94] mb-5 flex-1 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs text-[#4a4a52] border border-[#1f1f24] px-2 py-0.5 rounded-[2px]">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
