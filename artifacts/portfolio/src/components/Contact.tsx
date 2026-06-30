import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as SiIcons from 'react-icons/si';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true
        }
      });

      tl.fromTo(headlineRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      )
      .fromTo(subtextRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(emailRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo(footerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.1'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="container-layout section-frame border-t border-[#1f1f24]"
      style={{ paddingTop: '100px', paddingBottom: '48px' }}
    >
      <div className="max-w-3xl mx-auto text-center mb-20">
        <h2
          ref={headlineRef}
          className="font-display font-medium text-[#f5f5f2] mb-5"
          style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          {data.contact.headline}
        </h2>
        <p ref={subtextRef} className="text-[#8c8c94] mb-12 text-body max-w-md mx-auto">
          {data.contact.subtext}
        </p>

        {/* Email — styled like a mini hero headline, the emotional close */}
        <a
          ref={emailRef}
          href={`mailto:${data.contact.email}`}
          className="inline-block font-display font-medium text-[#d4ff4f] hover:text-[#f5f5f2] transition-colors duration-300 break-all leading-tight"
          style={{ fontSize: 'clamp(22px, 3.5vw, 52px)', letterSpacing: '-0.02em' }}
        >
          {data.contact.email}
        </a>
      </div>

      <div
        ref={footerRef}
        className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-[#1f1f24]"
      >
        <div className="flex items-center gap-5">
          {data.contact.socials.map((social, i) => {
            const Icon = (SiIcons as Record<string, React.ComponentType<{ size?: number }>>)[social.icon];
            return (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#4a4a52] hover:text-[#d4ff4f] transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
              >
                {Icon && <Icon size={17} />}
                <span className="hidden md:inline">{social.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-8 text-xs text-[#4a4a52]">
          <span>© {new Date().getFullYear()} {data.meta.name}</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 hover:text-[#f5f5f2] transition-colors duration-200"
          >
            Back to top
            <svg
              width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              className="group-hover:-translate-y-1 transition-transform duration-200"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
