import { useState, useEffect } from 'react';
import data from '../data.json';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Work', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Journey', href: '#journey' }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[#08080a]/80 backdrop-blur-md border-b border-[#1f1f24]/50 py-4' : 'py-6'}`}>
      <div className="container-layout flex items-center justify-between">
        <div className="font-display font-bold text-xl tracking-tight">
          {data.meta.name}
        </div>
        
        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-[#8c8c94] hover:text-[#f5f5f2] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="text-sm font-medium bg-[#d4ff4f] text-[#08080a] px-5 py-2.5 rounded-[2px] hover:bg-[#8a9c3a] transition-colors">
            Let's Talk
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-[#f5f5f2]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#111114] border-b border-[#1f1f24] py-4 px-6 flex flex-col gap-4">
          {links.map(link => (
            <a key={link.label} href={link.href} className="text-base font-medium text-[#f5f5f2] block py-2 border-b border-[#1f1f24]/50" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contact" className="text-base font-medium text-[#d4ff4f] block py-2" onClick={() => setMobileMenuOpen(false)}>
            Let's Talk
          </a>
        </div>
      )}
    </nav>
  );
}