import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '../data.json';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Work',       href: '#projects' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Journey',    href: '#journey' },
  { label: 'Experience', href: '#experience' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Scroll progress + active section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Scroll progress bar
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min((scrollTop / maxScroll) * 100, 100)}%`;
      }

      // Active section detection
      const sections = ['projects', 'skills', 'journey', 'experience'];
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Move sliding indicator to active link
  useEffect(() => {
    const activeIdx = NAV_LINKS.findIndex(l => l.href === `#${activeSection}`);
    if (activeIdx === -1 || !indicatorRef.current) return;
    const linkEl = linkRefs.current[activeIdx];
    if (!linkEl) return;
    const navEl = linkEl.closest('.nav-pill-bg') as HTMLElement;
    if (!navEl) return;
    const navRect = navEl.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    gsap.to(indicatorRef.current, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    });
  }, [activeSection]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scroll-progress-bar"
        aria-hidden="true"
      />

      <nav ref={navRef} className="fixed top-0 left-0 w-full z-40 py-4">
        <div className="container-layout flex items-center justify-between gap-4">

          {/* Logo / Monogram */}
          <a
            href="#"
            className="group flex items-center gap-3 shrink-0"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="w-9 h-9 bg-[#d4ff4f] flex items-center justify-center">
              <span className="font-display font-bold text-[#08080a] text-sm leading-none tracking-tight">
                {data.meta.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="hidden md:block font-display font-medium text-[#f5f5f2] text-sm tracking-tight opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
              {data.meta.name}
            </span>
          </a>

          {/* Center floating pill — desktop */}
          <div className={`hidden md:flex relative items-center nav-pill-bg px-1.5 py-1.5 gap-0.5 ${scrolled ? 'scrolled' : ''}`}>
            {/* Sliding active indicator */}
            <span
              ref={indicatorRef}
              className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] bg-[#ffffff0d] rounded-full pointer-events-none"
              style={{ width: 0, opacity: 0 }}
              aria-hidden="true"
            />
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                ref={el => { linkRefs.current[i] = el; }}
                href={link.href}
                className={`relative z-10 px-4 py-2 text-[13px] font-medium rounded-full transition-colors duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#f5f5f2]'
                    : 'text-[#8c8c94] hover:text-[#f5f5f2]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: availability + CTA */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8c8c94]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              Available
            </div>
            <a
              href="#contact"
              className="text-[13px] font-medium bg-[#d4ff4f] text-[#08080a] px-5 py-2.5 rounded-full hover:bg-[#c8f03d] transition-colors"
            >
              Let's Talk
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-[#f5f5f2]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              {mobileOpen
                ? <><path d="M1 1L17 11"/><path d="M17 1L1 11"/></>
                : <><line x1="0" y1="1" x2="18" y2="1"/><line x1="4" y1="6" x2="18" y2="6"/><line x1="8" y1="11" x2="18" y2="11"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="container-layout pt-4 pb-6 flex flex-col gap-1 border-t border-[#1f1f24] mt-4">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="py-3 text-sm font-medium text-[#8c8c94] hover:text-[#f5f5f2] transition-colors border-b border-[#1f1f24]/40"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-3 py-3 text-sm font-medium text-[#d4ff4f] hover:text-[#f5f5f2] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Let's Talk →
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
