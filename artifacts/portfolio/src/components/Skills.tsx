import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

type Skill = (typeof data.skills)[number];

// Vertical scatter offsets — baked in so layout is stable and intentionally imperfect
const SCATTER_Y = [0, 36, -20, 28, 44, -10, 32, -24, 16, 40, -16, 22];

// Each icon gets its own float speed, delay, and amplitude
const FLOAT: { dur: string; del: string; amp: number }[] = [
  { dur: '4.3s', del: '0.0s', amp: 7  },
  { dur: '5.9s', del: '0.7s', amp: 9  },
  { dur: '3.8s', del: '1.3s', amp: 6  },
  { dur: '6.2s', del: '0.4s', amp: 8  },
  { dur: '4.6s', del: '1.1s', amp: 10 },
  { dur: '5.5s', del: '0.9s', amp: 7  },
  { dur: '3.7s', del: '1.7s', amp: 9  },
  { dur: '6.0s', del: '0.2s', amp: 6  },
  { dur: '4.8s', del: '1.5s', amp: 8  },
  { dur: '5.1s', del: '0.6s', amp: 10 },
  { dur: '3.9s', del: '1.2s', amp: 7  },
  { dur: '6.6s', del: '0.8s', amp: 9  },
];

function SkillNode({
  skill,
  index,
  hoveredIdx,
  onHover,
  onLeave,
}: {
  skill: Skill;
  index: number;
  hoveredIdx: number | null;
  onHover: (i: number) => void;
  onLeave: () => void;
}) {
  const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[skill.icon];
  const isHovered = hoveredIdx === index;
  const isDimmed = hoveredIdx !== null && !isHovered;
  const f = FLOAT[index];

  return (
    <div
      className="skill-node"
      style={{ marginTop: SCATTER_Y[index] }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={onLeave}
    >
      {/* Float wrapper — CSS animation lives here, isolated from GSAP's scroll-in */}
      <div
        className="skill-node-float"
        style={{
          '--float-dur': f.dur,
          '--float-del': f.del,
          '--float-amp': `${f.amp}px`,
        } as React.CSSProperties}
      >
        <div
          className="skill-node-icon"
          style={{
            opacity: isDimmed ? 0.15 : 1,
            transform: isHovered ? 'scale(1.22)' : 'scale(1)',
            color: isHovered ? '#d4ff4f' : '#4a4a52',
            filter: isHovered ? 'drop-shadow(0 0 14px rgba(212,255,79,0.55))' : 'none',
            transition: 'opacity 0.35s ease, transform 0.3s ease, color 0.3s ease, filter 0.3s ease',
          }}
        >
          {Icon && <Icon size={36} />}
        </div>
      </div>

      <span
        className="skill-node-label"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0px)' : 'translateY(5px)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        {skill.name}
      </span>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const nodeWrappers = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fades in first
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        }
      );

      // Nodes materialise one by one — fade + tiny upward drift, no bounce
      gsap.fromTo(
        nodeWrappers.current.filter(Boolean),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
          stagger: 0.07,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="section-padding">
      {/* Header */}
      <div ref={headerRef} className="container-layout mb-20" style={{ opacity: 0 }}>
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

      {/* Constellation */}
      <div className="container-layout">
        <div className="skills-constellation">
          {data.skills.map((skill, i) => (
            <div
              key={skill.name}
              ref={el => { nodeWrappers.current[i] = el; }}
              style={{ opacity: 0 }}
            >
              <SkillNode
                skill={skill}
                index={i}
                hoveredIdx={hoveredIdx}
                onHover={setHoveredIdx}
                onLeave={() => setHoveredIdx(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
