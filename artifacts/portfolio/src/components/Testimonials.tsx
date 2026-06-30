import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive(i => (i + 1) % data.testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  // Entrance animation when section first comes into view
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Quote change animation — quote mark first, then text, then author
  useEffect(() => {
    if (!quoteRef.current) return;
    const q = quoteRef.current;
    const quoteMark = q.querySelector('.quote-mark');
    const quoteText = q.querySelector('.quote-text');
    const quoteAuthor = q.querySelector('.quote-author');

    gsap.timeline()
      .to([quoteMark, quoteText, quoteAuthor], { opacity: 0, y: -8, duration: 0.2, stagger: 0.04 })
      .set(q, {})
      .to(quoteMark, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }, 0.25)
      .to(quoteText, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.38)
      .to(quoteAuthor, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.52);
  }, [active]);

  const t = data.testimonials[active];

  return (
    <section
      ref={sectionRef}
      className="container-layout section-padding border-t border-[#1f1f24]"
      style={{ opacity: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="eyebrow mb-16">What others say</div>

      <div ref={quoteRef} className="max-w-3xl">
        {/* Decorative quote mark */}
        <div
          className="quote-mark font-display font-bold text-[#d4ff4f] mb-6 leading-none select-none"
          style={{ fontSize: '80px', lineHeight: 1, opacity: 0 }}
          aria-hidden="true"
        >
          "
        </div>

        {/* Quote text */}
        <blockquote
          className="quote-text font-display font-medium text-[#f5f5f2] mb-10"
          style={{ fontSize: 'clamp(20px, 2.8vw, 34px)', letterSpacing: '-0.02em', lineHeight: 1.3, opacity: 0 }}
        >
          {t.quote}
        </blockquote>

        {/* Author */}
        <div className="quote-author flex flex-col gap-1" style={{ opacity: 0 }}>
          <span className="text-sm font-medium text-[#f5f5f2]">{t.author}</span>
          <span className="text-xs text-[#4a4a52] tracking-wide">{t.role}</span>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center gap-3 mt-14">
        {data.testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); }}
            className="transition-all duration-300"
            style={{
              width: active === i ? '28px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: active === i ? '#d4ff4f' : '#2e2e36',
            }}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
