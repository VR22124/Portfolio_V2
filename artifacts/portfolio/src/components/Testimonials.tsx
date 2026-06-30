import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % data.testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      ref={sectionRef}
      className="container-layout section-padding section-frame"
      style={{ opacity: 0 }}
    >
      <div
        className="max-w-3xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Big lime quote mark */}
        <div
          className="font-display font-bold text-[#d4ff4f] select-none mb-4 leading-none"
          style={{ fontSize: 'clamp(64px, 10vw, 120px)', opacity: 0.4 }}
          aria-hidden="true"
        >
          &ldquo;
        </div>

        {/* Quote carousel */}
        <div className="relative" style={{ minHeight: 'clamp(120px, 20vw, 200px)' }}>
          {data.testimonials.map((t, i) => (
            <div
              key={i}
              className="absolute top-0 left-0 w-full transition-all duration-600"
              style={{
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'translateY(0)' : 'translateY(12px)',
                pointerEvents: i === active ? 'auto' : 'none',
                transitionDuration: '500ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <p className="font-display text-2xl md:text-3xl text-[#f5f5f2] leading-snug mb-7">
                {t.quote}
              </p>
              <div>
                <div className="text-sm font-medium text-[#f5f5f2]">{t.author}</div>
                <div className="text-xs text-[#4a4a52] mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2.5 mt-10">
          {data.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="h-[2px] rounded-none transition-all duration-400"
              style={{
                width: i === active ? 40 : 20,
                background: i === active ? '#d4ff4f' : '#1f1f24',
              }}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
