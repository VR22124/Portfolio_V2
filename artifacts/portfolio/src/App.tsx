import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import ParticleField from './components/ParticleField';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Journey from './components/Journey';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import HowIWork from './components/HowIWork';
import Principles from './components/Principles';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

let _webglCached: boolean | null = null;
function isWebGLAvailable(): boolean {
  if (_webglCached !== null) return _webglCached;
  try {
    const canvas = document.createElement('canvas');
    const ctx = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    _webglCached = !!ctx;
    if (ctx) {
      const ext = ctx.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    }
  } catch {
    _webglCached = false;
  }
  return _webglCached ?? false;
}

function CSSParticleFallback() {
  const particlesData = useRef<Array<React.CSSProperties>>([]);
  if (particlesData.current.length === 0) {
    particlesData.current = Array.from({ length: 80 }, () => ({
      left: `${(Math.random() * 100).toFixed(1)}%`,
      top: `${(Math.random() * 100).toFixed(1)}%`,
      animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
      animationDuration: `${(5 + Math.random() * 9).toFixed(2)}s`,
      width: `${(1 + Math.random() * 2).toFixed(1)}px`,
      height: `${(1 + Math.random() * 2).toFixed(1)}px`,
      opacity: parseFloat((0.15 + Math.random() * 0.4).toFixed(2)),
    }));
  }
  return (
    <div className="css-particle-fallback" aria-hidden="true">
      {particlesData.current.map((style, i) => (
        <span key={i} className="css-particle" style={style} />
      ))}
    </div>
  );
}

function App() {
  const scrollProgress = useRef(0);
  const [loading, setLoading] = useState(true);
  const [webglSupported] = useState<boolean>(() => isWebGLAvailable());
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Always start at the top — disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: isMobile ? true : 1.3,
      onUpdate: (self) => {
        scrollProgress.current = isReducedMotion ? 0 : self.progress;
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Particle canvas — shifted right so formation sits at ~60-65% horizontal */}
      <div
        className="fixed inset-0 z-0 pointer-events-none vignette-overlay"
        style={!isMobile ? { left: '18%', width: '100%' } : undefined}
        aria-hidden="true"
      >
        {webglSupported ? (
          <Canvas camera={{ position: [0, 0, 8], fov: 55 }}>
            <ParticleField scrollProgress={scrollProgress} />
          </Canvas>
        ) : (
          <CSSParticleFallback />
        )}
      </div>

      <div className="relative z-10 w-full">
        <Nav />
        <main>
          <Hero started={!loading} />
          <Journey />
          <Experience />
          <Skills />
          <Projects />
          <HowIWork />
          <Principles />
          <Testimonials />
        </main>
        <Contact />
      </div>
    </>
  );
}

export default App;
