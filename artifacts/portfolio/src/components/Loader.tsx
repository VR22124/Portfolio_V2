import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import data from '../data.json';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasLoaded = sessionStorage.getItem('portfolio-loaded');

    if (hasLoaded || isReducedMotion) {
      onComplete();
      return;
    }

    let currentProgress = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // easeOutExpo
      const easeT = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      currentProgress = Math.floor(easeT * 100);
      
      setProgress(currentProgress);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            sessionStorage.setItem('portfolio-loaded', 'true');
            onComplete();
          }
        });
      }
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080a] text-[#f5f5f2]">
      <div className="w-64">
        <div className="flex justify-between items-end mb-4">
          <div className="font-display font-medium tracking-[0.12em] text-[#d4ff4f]">
            {data.meta.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-[13px] tracking-[0.12em] text-[#4a4a52] uppercase">
            {data.meta.loadingLabel} {progress}%
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#1f1f24] overflow-hidden">
          <div 
            className="h-full bg-[#d4ff4f] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}