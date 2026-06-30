import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

type Skill = typeof data.skills[number];

const CATEGORY_ORDER = ['Frontend', 'Backend', 'Language', 'Database', 'API', 'Infra', 'Design'];

function groupSkills(skills: Skill[]) {
  const map: Record<string, Skill[]> = {};
  skills.forEach(s => {
    if (!map[s.category]) map[s.category] = [];
    map[s.category].push(s);
  });
  return CATEGORY_ORDER
    .filter(cat => map[cat])
    .map(cat => ({ category: cat, skills: map[cat] }));
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cardRef.current || !barRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance — stagger by index
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.55,
          delay: index * 0.045,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
            once: true
          }
        }
      );

      if (isReducedMotion) {
        gsap.set(barRef.current, { width: `${skill.level}%`, backgroundColor: '#4a4a52' });
        return;
      }

      // Bar fills from 0 on first scroll-into-view
      gsap.fromTo(barRef.current,
        { width: '0%' },
        {
          width: `${skill.level}%`,
          duration: 1,
          delay: index * 0.04 + 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
            once: true
          }
        }
      );
    });

    return () => ctx.revert();
  }, [index, skill.level]);

  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[skill.icon];

  return (
    <div
      ref={cardRef}
      className="group relative p-5 border border-[#1f1f24] bg-[#111114]/50 backdrop-blur-sm rounded-[2px] transition-all duration-300 hover:border-[#2e2e36] hover:bg-[#111114] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] cursor-default"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-[#4a4a52] group-hover:text-[inherit] transition-all duration-300" style={{ filter: 'grayscale(1) opacity(0.55)' }}
          onMouseEnter={e => (e.currentTarget.style.filter = 'none')}
          onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(1) opacity(0.55)')}
        >
          {Icon ? <Icon size={22} /> : <span className="text-xs">{skill.name[0]}</span>}
        </div>
        <span className="text-[10px] font-mono text-[#4a4a52] tracking-wider uppercase">
          {skill.level}%
        </span>
      </div>

      <div className="text-sm font-medium text-[#f5f5f2] mb-3 group-hover:text-[#f5f5f2]">
        {skill.name}
      </div>

      <div className="skill-bar">
        <div
          ref={barRef}
          className="skill-bar-fill group-hover:bg-[#d4ff4f] transition-colors duration-300"
          style={{ width: 0 }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const grouped = groupSkills(data.skills);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!.querySelector('.section-eyebrow'),
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
      gsap.fromTo(sectionRef.current!.querySelectorAll('.category-label'),
        { opacity: 0 },
        {
          opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="container-layout section-padding section-frame"
    >
      <div className="eyebrow section-eyebrow mb-14" style={{ opacity: 0 }}>Technical Arsenal</div>

      <div className="flex flex-col gap-10">
        {grouped.map(({ category, skills }) => (
          <div key={category}>
            <div
              className="category-label text-[11px] font-mono text-[#4a4a52] uppercase tracking-[0.18em] mb-4 flex items-center gap-3"
              style={{ opacity: 0 }}
            >
              <span>{category}</span>
              <span className="flex-1 h-[1px] bg-[#1f1f24]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {skills.map((skill, i) => (
                <SkillCard key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
