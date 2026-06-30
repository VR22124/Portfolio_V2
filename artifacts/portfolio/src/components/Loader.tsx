import { useEffect, useRef, useState } from 'react';
import data from '../data.json';

type Node = { x: number; y: number; distance: number; angle: number };
type TextParticle = { x: number; y: number; originX: number; originY: number; vx: number; vy: number };

const OWNER_NAME = data.meta.name.toUpperCase();

// Portfolio palette
const BG       = '#08080a';
const ACCENT   = '#d4ff4f';       // portfolio lime accent
const ACCENT_A = 'rgba(212,255,79,';  // for alpha usage
const WHITE    = '#f5f5f2';       // text-primary
const FONT     = '700 80px "Space Grotesk", sans-serif';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolio-loaded');
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasLoaded || isReducedMotion) { onComplete(); return; }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width  = w;
    canvas.height = h;
    let cx = w / 2;
    let cy = h / 2;

    let rafId: number;
    const t0 = performance.now();

    // ── Timeline (ms) ─────────────────────────────────────────────────────────
    const T = {
      dark:     200,
      birth:   1100,
      lines:   2500,
      nodes:   2850,
      implode: 3700,
      morph:   4800,
      hold:    5400,
      shatter: 6600,
    };

    // ── Easing ────────────────────────────────────────────────────────────────
    const io3 = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const oQ5 = (t: number) => 1 - Math.pow(1-t, 5);
    const iExp= (t: number) => t === 0 ? 0 : Math.pow(2, 10*t-10);

    // ── Constellation nodes ───────────────────────────────────────────────────
    const buildNodes = (): Node[] => {
      const list: Node[] = [];
      const maxD = Math.min(w, h) * 0.42;
      const count = 22;
      for (let i = 0; i < count; i++) {
        const angle    = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 70 + Math.random() * maxD;
        list.push({ x: cx + Math.cos(angle)*distance, y: cy + Math.sin(angle)*distance, distance, angle });
      }
      for (let i = 0; i < 8; i++) {
        const angle    = Math.random() * Math.PI * 2;
        const distance = 90 + Math.random() * maxD * 0.85;
        list.push({ x: cx + Math.cos(angle)*distance, y: cy + Math.sin(angle)*distance, distance, angle });
      }
      return list.sort((a, b) => a.distance - b.distance);
    };

    let nodes: Node[] = buildNodes();

    // ── Text particle generation (offscreen canvas) ───────────────────────────
    let textParticles: TextParticle[] = [];
    let textReady = false;
    let fadeStarted = false;

    const buildTextParticles = (): TextParticle[] => {
      const off = document.createElement('canvas');
      off.width = w; off.height = h;
      const oc = off.getContext('2d')!;
      const fs = Math.min(w * 0.085, 88);
      oc.fillStyle = WHITE;
      oc.font = `700 ${fs}px "Space Grotesk", sans-serif`;
      oc.textAlign    = 'center';
      oc.textBaseline = 'middle';
      oc.fillText(OWNER_NAME, cx, cy);
      const px = oc.getImageData(0, 0, w, h).data;
      const list: TextParticle[] = [];
      const step = Math.max(3, Math.floor(w / 340));
      for (let py = 0; py < h; py += step) {
        for (let bx = 0; bx < w; bx += step) {
          if (px[(py * w + bx) * 4 + 3] > 128) {
            list.push({
              x: cx, y: cy,
              originX: bx + (Math.random()-0.5)*step,
              originY: py + (Math.random()-0.5)*step,
              vx: (Math.random()-0.5)*8,
              vy: -(2 + Math.random()*6),
            });
          }
        }
      }
      return list;
    };

    // ── Cross-links (circuit look) ─────────────────────────────────────────────
    const crossThresh = Math.min(w, h) * 0.22;
    const crossPairs: [Node, Node][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx*dx+dy*dy) < crossThresh) crossPairs.push([nodes[i], nodes[j]]);
      }
    }

    // ── Draw helpers ──────────────────────────────────────────────────────────
    const glow = (blur: number, color = ACCENT) => { ctx.shadowBlur = blur; ctx.shadowColor = color; };
    const noGlow = () => { ctx.shadowBlur = 0; };

    // ── Main render loop ───────────────────────────────────────────────────────
    const render = (now: number) => {
      const e = now - t0;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      ctx.save();

      // ── Darkness ─────────────────────────────────────────────────────────────
      if (e < T.dark) { ctx.restore(); rafId = requestAnimationFrame(render); return; }

      // ── Birth pulse ───────────────────────────────────────────────────────────
      if (e < T.birth) {
        const t  = (e - T.dark) / (T.birth - T.dark);
        const p  = Math.sin(t * Math.PI);
        const sz = 2 + p * 5;
        glow(35 * p + 5);
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(cx, cy, sz, 0, Math.PI*2); ctx.fill();
        noGlow();
        ctx.strokeStyle = ACCENT_A + (p * 0.35) + ')';
        ctx.lineWidth   = 1;
        ctx.beginPath(); ctx.arc(cx, cy, sz * 3 + 12*p, 0, Math.PI*2); ctx.stroke();
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Lines drawing ─────────────────────────────────────────────────────────
      if (e < T.lines) {
        const t = (e - T.birth) / (T.lines - T.birth);
        ctx.lineWidth = 0.8;
        nodes.forEach((nd, i) => {
          const delay = (i / nodes.length) * 0.38;
          const lt    = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
          const dist  = nd.distance * io3(lt);
          const px    = cx + Math.cos(nd.angle) * dist;
          const py    = cy + Math.sin(nd.angle) * dist;
          const grad  = ctx.createLinearGradient(cx, cy, px, py);
          grad.addColorStop(0, ACCENT_A + '0.95)');
          grad.addColorStop(1, ACCENT_A + '0.25)');
          ctx.strokeStyle = grad;
          glow(10);
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
        });
        if (t > 0.65) {
          noGlow();
          ctx.strokeStyle = ACCENT_A + '0.08)';
          ctx.lineWidth = 0.5;
          crossPairs.forEach(([a, b]) => {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          });
        }
        glow(22);
        ctx.fillStyle = WHITE;
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Node flash ────────────────────────────────────────────────────────────
      if (e < T.nodes) {
        const t     = (e - T.lines) / (T.nodes - T.lines);
        const flash = Math.sin(t * Math.PI);
        ctx.lineWidth   = 0.8;
        ctx.strokeStyle = ACCENT_A + '0.85)';
        glow(8 + 20 * flash);
        ctx.beginPath();
        nodes.forEach(nd => { ctx.moveTo(cx, cy); ctx.lineTo(nd.x, nd.y); });
        ctx.stroke();
        noGlow();
        ctx.strokeStyle = ACCENT_A + '0.08)';
        ctx.lineWidth = 0.5;
        crossPairs.forEach(([a, b]) => {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        });
        nodes.forEach(nd => {
          glow(24 * flash);
          ctx.fillStyle = ACCENT_A + (0.5 + 0.5*flash) + ')';
          ctx.beginPath(); ctx.arc(nd.x, nd.y, 2 + 3*flash, 0, Math.PI*2); ctx.fill();
        });
        glow(28);
        ctx.fillStyle = WHITE;
        ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Implosion ─────────────────────────────────────────────────────────────
      if (e < T.implode) {
        const t     = (e - T.nodes) / (T.implode - T.nodes);
        const ease  = iExp(t);
        ctx.lineWidth   = 0.8;
        ctx.strokeStyle = ACCENT_A + (1-t*0.3) + ')';
        glow(8 * (1 - t));
        ctx.beginPath();
        nodes.forEach(nd => {
          const dist = nd.distance * (1 - ease);
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(nd.angle)*dist, cy + Math.sin(nd.angle)*dist);
        });
        ctx.stroke();
        glow(30 * ease);
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(cx, cy, 2 + ease*8, 0, Math.PI*2); ctx.fill();
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Text morph ────────────────────────────────────────────────────────────
      if (e < T.morph) {
        if (!textReady) { textParticles = buildTextParticles(); textReady = true; }
        const t    = (e - T.implode) / (T.morph - T.implode);
        const ease = oQ5(t);
        glow(8 * ease, ACCENT);
        ctx.fillStyle = ACCENT_A + ease + ')';
        textParticles.forEach(p => {
          const px = cx + (p.originX - cx) * ease;
          const py = cy + (p.originY - cy) * ease;
          ctx.fillRect(px, py, 1.5, 1.5);
        });
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Hold ──────────────────────────────────────────────────────────────────
      if (e < T.hold) {
        glow(10, ACCENT);
        ctx.fillStyle = ACCENT;
        textParticles.forEach(p => ctx.fillRect(p.originX, p.originY, 1.5, 1.5));
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Shatter ───────────────────────────────────────────────────────────────
      if (e < T.shatter) {
        const t   = (e - T.hold) / (T.shatter - T.hold);
        const op  = 1 - iExp(t);
        glow(6 * op, ACCENT);
        ctx.fillStyle = ACCENT_A + op + ')';
        textParticles.forEach(p => {
          p.originX += p.vx * t * 2.5;
          p.originY += p.vy * t * 2.5 + t * 4;
          ctx.fillRect(p.originX, p.originY, 1.5, 1.5);
        });
        if (t > 0.75 && !fadeStarted) {
          fadeStarted = true;
          setOverlayOpacity(0);
        }
        ctx.restore(); rafId = requestAnimationFrame(render); return;
      }

      // ── Done ──────────────────────────────────────────────────────────────────
      ctx.restore();
      sessionStorage.setItem('portfolio-loaded', 'true');
      onComplete();
    };

    rafId = requestAnimationFrame(render);

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      cx = w/2; cy = h/2;
      canvas.width = w; canvas.height = h;
      nodes = buildNodes();
      textReady = false;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{
        background: BG,
        opacity: overlayOpacity,
        transition: overlayOpacity === 0 ? 'opacity 1s ease-out' : 'none',
        pointerEvents: overlayOpacity === 0 ? 'none' : 'auto',
      }}
      data-testid="awakening-loader"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
