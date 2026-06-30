import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section ref={containerRef} className="container-layout section-padding">
      <div className="max-w-4xl mx-auto" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="relative min-h-[200px]">
          {data.testimonials.map((test, i) => (
            <div 
              key={i} 
              className={`absolute top-0 left-0 w-full transition-all duration-700 ${i === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
              <div className="text-[#d4ff4f] font-display text-8xl leading-none opacity-50 mb-4">"</div>
              <p className="font-display text-2xl md:text-4xl text-[#f5f5f2] mb-8 leading-tight">
                {test.quote}
              </p>
              <div>
                <div className="text-sm font-medium text-[#f5f5f2]">{test.author}</div>
                <div className="text-sm text-[#4a4a52]">{test.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-12">
          {data.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-[2px] transition-all duration-300 ${i === activeIndex ? 'w-12 bg-[#d4ff4f]' : 'w-6 bg-[#1f1f24] hover:bg-[#4a4a52]'}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}