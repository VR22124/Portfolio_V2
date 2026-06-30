import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
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
    <section id="contact" ref={containerRef} className="container-layout pt-32 pb-12 text-center border-t border-[#1f1f24]">
      <div className="max-w-3xl mx-auto mb-24">
        <h2 className="text-h2 font-display text-[#f5f5f2] font-medium mb-4">{data.contact.headline}</h2>
        <p className="text-[#8c8c94] mb-12">{data.contact.subtext}</p>
        
        <a 
          href={`mailto:${data.contact.email}`}
          className="inline-block text-4xl md:text-6xl font-display font-medium text-[#d4ff4f] hover:text-[#f5f5f2] transition-colors duration-300 break-all"
        >
          {data.contact.email}
        </a>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-[#1f1f24]">
        <div className="flex items-center gap-6">
          {data.contact.socials.map((social, i) => {
            const Icon = (SiIcons as any)[social.icon];
            return (
              <a 
                key={i} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#8c8c94] hover:text-[#d4ff4f] transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {Icon && <Icon size={18} />}
                <span className="hidden md:inline">{social.label}</span>
              </a>
            );
          })}
        </div>
        
        <div className="flex items-center gap-8 text-sm text-[#4a4a52]">
          <div>© {new Date().getFullYear()} {data.meta.name}. All rights reserved.</div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:text-[#f5f5f2] transition-colors group"
          >
            Back to top
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-y-1 transition-transform">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}