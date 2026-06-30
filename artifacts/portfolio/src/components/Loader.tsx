import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type Node = { x: number; y: number; distance: number; angle: number };
type TextParticle = { x: number; y: number; originX: number; originY: number; vx: number; vy: number };

const OWNER_NAME = data.meta.name.toUpperCase();

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolio-loaded');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasLoaded || isReducedMotion) {
      onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let cx = w / 2;
    let cy = h / 2;

    let animationFrameId: number;
    const startTime = performance.now();

    const timeline = {
      darkness:     200,
      birthEnd:    1000,
      linesEnd:    2400,
      nodesEnd:    2750,
      implosionEnd:3500,
      textMorphEnd:4600,
      holdEnd:     5200,
      shatterEnd:  6400,
    };

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
    const easeInExpo   = (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

    // --- Build constellation nodes ---
    const buildNodes = (): Node[] => {
      const list: Node[] = [];
      const maxDist = Math.min(w, h) * 0.42;
      const count = 22;
      for (let i = 0; i < count; i++) {
        const angle    = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 60 + Math.random() * maxDist;
        list.push({ x: cx + Math.cos(angle) * distance, y: cy + Math.sin(angle) * distance, distance, angle });
      }
      // extra random scattered nodes
      for (let i = 0; i < 8; i++) {
        const angle    = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * maxDist * 0.9;
        list.push({ x: cx + Math.cos(angle) * distance, y: cy + Math.sin(angle) * distance, distance, angle });
      }
      list.sort((a, b) => a.distance - b.distance);
      return list;
    };

    let nodes: Node[] = buildNodes();

    // --- Generate text pixels ---
    let textParticles: TextParticle[] = [];
    let textGenerated = false;
    let fadeOutStarted = false;

    const generateTextParticles = (): TextParticle[] => {
      const off = document.createElement('canvas');
      off.width  = w;
      off.height = h;
      const oCtx = off.getContext('2d')!;
      const fontSize = Math.min(w * 0.09, 90);
      oCtx.fillStyle    = 'white';
      oCtx.font         = `600 ${fontSize}px Cinzel, serif`;
      oCtx.textAlign    = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillText(OWNER_NAME, cx, cy);

      const imgData = oCtx.getImageData(0, 0, w, h).data;
      const list: TextParticle[] = [];

      const step = Math.max(3, Math.floor(w / 320));
      for (let py = 0; py < h; py += step) {
        for (let px = 0; px < w; px += step) {
          const idx = (py * w + px) * 4;
          if (imgData[idx + 3] > 128) {
            list.push({
              x:       cx,
              y:       cy,
              originX: px + (Math.random() - 0.5) * step,
              originY: py + (Math.random() - 0.5) * step,
              vx:      (Math.random() - 0.5) * 8,
              vy:      -(2 + Math.random() * 6),
            });
          }
        }
      }
      return list;
    };

    const drawGlow = (color: string, blur: number) => {
      ctx.shadowBlur  = blur;
      ctx.shadowColor = color;
    };

    const GLOW  = 'rgba(0, 220, 255, 0.9)';
    const WHITE = 'rgba(255, 255, 255, 1)';
    const TEXT_COLOR = 'rgba(180, 245, 255, 1)';

    const render = (now: number) => {
      const elapsed = now - startTime;

      // Full black background each frame
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      ctx.save();

      // ── Phase 1: Darkness ──────────────────────────────────────────────────
      if (elapsed < timeline.darkness) {
        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 2: Birth pulse ───────────────────────────────────────────────
      if (elapsed < timeline.birthEnd) {
        const t  = (elapsed - timeline.darkness) / (timeline.birthEnd - timeline.darkness);
        const p  = Math.sin(t * Math.PI);
        const sz = 2 + p * 5;
        drawGlow(GLOW, 30 * p + 5);
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(cx, cy, sz, 0, Math.PI * 2);
        ctx.fill();

        // outer ring
        ctx.strokeStyle = `rgba(0, 220, 255, ${p * 0.5})`;
        ctx.lineWidth   = 1;
        ctx.shadowBlur  = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, sz * 3 + 10 * p, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 3: Fiber-optic lines draw ────────────────────────────────────
      if (elapsed < timeline.linesEnd) {
        const t     = (elapsed - timeline.birthEnd) / (timeline.linesEnd - timeline.birthEnd);
        const eased = easeInOutCubic(t);

        // draw lines
        ctx.lineWidth = 0.8;
        nodes.forEach((node, i) => {
          const delay = i / nodes.length * 0.4;
          const lt    = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
          const dist  = node.distance * easeInOutCubic(lt);
          const px    = cx + Math.cos(node.angle) * dist;
          const py    = cy + Math.sin(node.angle) * dist;

          const grad = ctx.createLinearGradient(cx, cy, px, py);
          grad.addColorStop(0, 'rgba(0, 220, 255, 0.9)');
          grad.addColorStop(1, 'rgba(0, 180, 255, 0.3)');
          ctx.strokeStyle = grad;
          drawGlow(GLOW, 8);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
          ctx.stroke();
        });

        // cross lines between nearby nodes (circuit look)
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.12)';
        ctx.lineWidth   = 0.5;
        ctx.shadowBlur  = 0;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const ni = nodes[i], nj = nodes[j];
            const dx = ni.x - nj.x, dy = ni.y - nj.y;
            const dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < Math.min(w, h) * 0.22 && eased > 0.6) {
              ctx.beginPath();
              ctx.moveTo(ni.x, ni.y);
              ctx.lineTo(nj.x, nj.y);
              ctx.stroke();
            }
          }
        }

        // center core
        drawGlow(GLOW, 20);
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 4: Nodes flash & lock ────────────────────────────────────────
      if (elapsed < timeline.nodesEnd) {
        const t     = (elapsed - timeline.linesEnd) / (timeline.nodesEnd - timeline.linesEnd);
        const flash = Math.sin(t * Math.PI);

        // full constellation
        ctx.lineWidth   = 0.8;
        ctx.strokeStyle = GLOW;
        drawGlow(GLOW, 8 + 16 * flash);
        ctx.beginPath();
        nodes.forEach(node => {
          ctx.moveTo(cx, cy);
          ctx.lineTo(node.x, node.y);
        });
        ctx.stroke();

        // cross lines
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.12)';
        ctx.lineWidth   = 0.5;
        ctx.shadowBlur  = 0;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const ni = nodes[i], nj = nodes[j];
            const dx = ni.x - nj.x, dy = ni.y - nj.y;
            const dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < Math.min(w, h) * 0.22) {
              ctx.beginPath();
              ctx.moveTo(ni.x, ni.y);
              ctx.lineTo(nj.x, nj.y);
              ctx.stroke();
            }
          }
        }

        // nodes
        nodes.forEach(node => {
          drawGlow(GLOW, 20 * flash);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + 0.5 * flash})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 + 3 * flash, 0, Math.PI * 2);
          ctx.fill();
        });

        // center
        drawGlow(GLOW, 25);
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 5: Implosion ─────────────────────────────────────────────────
      if (elapsed < timeline.implosionEnd) {
        const t     = (elapsed - timeline.nodesEnd) / (timeline.implosionEnd - timeline.nodesEnd);
        const eased = easeInExpo(t);

        ctx.lineWidth   = 0.8;
        ctx.strokeStyle = GLOW;
        drawGlow(GLOW, 10 * (1 - t));

        ctx.beginPath();
        nodes.forEach(node => {
          const dist = node.distance * (1 - eased);
          const px   = cx + Math.cos(node.angle) * dist;
          const py   = cy + Math.sin(node.angle) * dist;
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
        });
        ctx.stroke();

        // shrinking center burst
        const burst = (1 - eased) * 30;
        drawGlow(GLOW, burst);
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.arc(cx, cy, 2 + eased * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 6: Text crystallization ──────────────────────────────────────
      if (elapsed < timeline.textMorphEnd) {
        if (!textGenerated) {
          textParticles = generateTextParticles();
          textGenerated = true;
        }

        const t     = (elapsed - timeline.implosionEnd) / (timeline.textMorphEnd - timeline.implosionEnd);
        const eased = easeOutQuint(t);

        drawGlow(GLOW, 6 * eased);
        ctx.fillStyle = `rgba(180, 245, 255, ${eased})`;

        textParticles.forEach(p => {
          const px = cx + (p.originX - cx) * eased;
          const py = cy + (p.originY - cy) * eased;
          ctx.fillRect(px, py, 1.5, 1.5);
        });

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 7: Hold ──────────────────────────────────────────────────────
      if (elapsed < timeline.holdEnd) {
        drawGlow(GLOW, 8);
        ctx.fillStyle = TEXT_COLOR;
        textParticles.forEach(p => {
          ctx.fillRect(p.originX, p.originY, 1.5, 1.5);
        });

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Phase 8: Shatter ───────────────────────────────────────────────────
      if (elapsed < timeline.shatterEnd) {
        const t       = (elapsed - timeline.holdEnd) / (timeline.shatterEnd - timeline.holdEnd);
        const opacity = 1 - easeInExpo(t);

        drawGlow(GLOW, 5 * opacity);
        ctx.fillStyle = `rgba(180, 245, 255, ${opacity})`;

        textParticles.forEach(p => {
          p.originX += p.vx * t * 2.5;
          p.originY += p.vy * t * 2.5 + t * 4;
          ctx.fillRect(p.originX, p.originY, 1.5, 1.5);
        });

        // Begin fading canvas at 80%
        if (t > 0.78 && !fadeOutStarted) {
          fadeOutStarted = true;
          setOpacity(0);
        }

        ctx.restore();
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // ── Done ───────────────────────────────────────────────────────────────
      ctx.restore();
      sessionStorage.setItem('portfolio-loaded', 'true');
      onComplete();
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      w  = window.innerWidth;
      h  = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
      canvas.width  = w;
      canvas.height = h;
      nodes = buildNodes();
      textGenerated = false;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      style={{
        opacity,
        transition: opacity === 0 ? 'opacity 1s ease-out' : 'none',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        data-testid="canvas-awakening-loader"
      />
    </div>
  );
}
