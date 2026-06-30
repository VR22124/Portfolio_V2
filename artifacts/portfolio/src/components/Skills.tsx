import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

type Skill = (typeof data.skills)[number];

function SkillPill({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);
  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[skill.icon];

  return (
    <div
      className="flex items-center gap-3 px-5 py-3 mx-2 shrink-0 cursor-default rounded-[3px] transition-all duration-300"
      style={{
        background: hovered ? 'rgba(212,255,79,0.06)' : 'rgba(31,31,36,0.5)',
        border: `1px solid ${hovered ? 'rgba(212,255,79,0.2)' : 'rgba(31,31,36,0.8)'}`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {Icon && (
        <span style={{ color: hovered ? '#d4ff4f' : '#4a4a52', transition: 'color 0.25s', display: 'flex' }}>
          <Icon size={18} />
        </span>
      )}
      <span
        className="font-medium text-sm whitespace-nowrap"
        style={{ color: hovered ? '#f5f5f2' : '#8c8c94', transition: 'color 0.25s' }}
      >
        {skill.name}
      </span>
      <span
        className="font-mono text-[10px]"
        style={{ color: hovered ? '#d4ff4f' : '#2e2e36', transition: 'color 0.25s' }}
      >
        {skill.level}%
      </span>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const frontendSkills = data.skills.filter(s =>
    ['Frontend', 'Language', 'Design'].includes(s.category)
  );
  const backendSkills = data.skills.filter(s =>
    ['Backend', 'Database', 'Infra', 'API'].includes(s.category)
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );
      [row1Ref.current, row2Ref.current].forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(row,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Duplicate for seamless loop
  const row1 = [...frontendSkills, ...frontendSkills, ...frontendSkills];
  const row2 = [...backendSkills, ...backendSkills, ...backendSkills];

  return (
    <section id="skills" ref={sectionRef} className="section-padding overflow-hidden">
      <div ref={headerRef} className="container-layout mb-16" style={{ opacity: 0 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Skills & Tools</div>
            <h2 className="font-display font-medium text-[#f5f5f2] text-h1">The toolkit.</h2>
          </div>
          <p className="text-body text-[#8c8c94] max-w-sm md:text-right">
            Picked up over six years of solving real problems in production.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div ref={row1Ref} className="mb-4" style={{ opacity: 0 }}>
        <div className="container-layout mb-3">
          <span className="text-[10px] font-medium tracking-[0.15em] text-[#2e2e36] uppercase">
            Frontend · Language · Design
          </span>
        </div>
        <div className="marquee-outer py-2">
          <div className="marquee-track marquee-ltr">
            {row1.map((skill, i) => <SkillPill key={`r1-${i}`} skill={skill} />)}
          </div>
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div ref={row2Ref} style={{ opacity: 0 }}>
        <div className="container-layout mb-3">
          <span className="text-[10px] font-medium tracking-[0.15em] text-[#2e2e36] uppercase">
            Backend · Database · Infra · API
          </span>
        </div>
        <div className="marquee-outer py-2">
          <div className="marquee-track marquee-rtl">
            {row2.map((skill, i) => <SkillPill key={`r2-${i}`} skill={skill} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
