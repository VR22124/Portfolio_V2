import React, { useEffect, useRef, useState } from 'react';

type Point = { x: number; y: number };

export default function AwakeningLoader({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const cx = w / 2;
    const cy = h / 2;

    let animationFrameId: number;
    const startTime = performance.now();

    // Configuration
    const timeline = {
      darkness: 200,
      birthEnd: 1000,
      linesEnd: 2200,
      nodesEnd: 2500,
      implosionEnd: 3200,
      textMorphEnd: 4200,
      holdEnd: 4800,
      shatterEnd: 5800
    };

    // Easing functions
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
    const easeInExpo = (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

    // Generate Nodes
    const numNodes = 25;
    const nodes: { x: number, y: number, distance: number, angle: number }[] = [];
    const maxDist = Math.min(w, h) * 0.45;

    for (let i = 0; i < numNodes; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * maxDist;
      nodes.push({
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        distance,
        angle
      });
    }

    nodes.sort((a, b) => a.distance - b.distance);

    // Text target particles
    let textParticles: { x: number, y: number, originX: number, originY: number, vx: number, vy: number }[] = [];
    let textGenerated = false;

    const generateTextParticles = () => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      const oCtx = offCanvas.getContext('2d')!;
      
      oCtx.fillStyle = 'white';
      oCtx.font = '600 80px Cinzel';
      oCtx.textAlign = 'center';
      oCtx.textBaseline = 'middle';
      oCtx.fillText('ALEX CHEN', cx, cy);

      const imgData = oCtx.getImageData(0, 0, w, h).data;
      const particles = [];

      for (let y = 0; y < h; y += 4) {
        for (let x = 0; x < w; x += 4) {
          const i = (y * w + x) * 4;
          if (imgData[i + 3] > 128) {
            particles.push({
              x: cx, // start at center
              y: cy,
              originX: x + (Math.random() - 0.5) * 2,
              originY: y + (Math.random() - 0.5) * 2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 1) * 10 - 2 // upward bias
            });
          }
        }
      }
      return particles;
    };

    const render = (now: number) => {
      const elapsed = now - startTime;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, w, h);

      if (elapsed < timeline.darkness) {
        // Darkness
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.save();

      const glowColor = 'rgba(0, 255, 255, 0.8)';
      const coreColor = 'rgba(255, 255, 255, 1)';

      if (elapsed < timeline.birthEnd) {
        // Birth Pulse
        const t = (elapsed - timeline.darkness) / (timeline.birthEnd - timeline.darkness);
        const p = Math.sin(t * Math.PI); // pulse
        const size = 2 + p * 4;
        
        ctx.shadowBlur = 20 * p;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.fill();

      } else if (elapsed < timeline.linesEnd) {
        // Lines Growing
        const t = (elapsed - timeline.birthEnd) / (timeline.linesEnd - timeline.birthEnd);
        const eased = easeInOutCubic(t);

        ctx.shadowBlur = 10;
        ctx.shadowColor = glowColor;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        nodes.forEach(node => {
          const currentDist = node.distance * eased;
          const px = cx + Math.cos(node.angle) * currentDist;
          const py = cy + Math.sin(node.angle) * currentDist;
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
        });
        ctx.stroke();

        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

      } else if (elapsed < timeline.nodesEnd) {
        // Node flash
        const t = (elapsed - timeline.linesEnd) / (timeline.nodesEnd - timeline.linesEnd);
        const flash = Math.sin(t * Math.PI);

        ctx.shadowBlur = 10 + 20 * flash;
        ctx.shadowColor = glowColor;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        nodes.forEach(node => {
          ctx.moveTo(cx, cy);
          ctx.lineTo(node.x, node.y);
        });
        ctx.stroke();

        nodes.forEach(node => {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + 0.5 * flash})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 + 2 * flash, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (elapsed < timeline.implosionEnd) {
        // Implosion
        const t = (elapsed - timeline.nodesEnd) / (timeline.implosionEnd - timeline.nodesEnd);
        const eased = easeInExpo(t);

        ctx.shadowBlur = 10;
        ctx.shadowColor = glowColor;
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        nodes.forEach(node => {
          const currentDist = node.distance * (1 - eased);
          const px = cx + Math.cos(node.angle) * currentDist;
          const py = cy + Math.sin(node.angle) * currentDist;
          ctx.moveTo(cx, cy);
          ctx.lineTo(px, py);
        });
        ctx.stroke();

      } else if (elapsed < timeline.textMorphEnd) {
        // Morph to text
        if (!textGenerated) {
          textParticles = generateTextParticles();
          textGenerated = true;
        }

        const t = (elapsed - timeline.implosionEnd) / (timeline.textMorphEnd - timeline.implosionEnd);
        const eased = easeOutQuint(t);

        ctx.shadowBlur = 5;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = `rgba(200, 255, 255, ${eased})`;

        textParticles.forEach(p => {
          const px = p.x + (p.originX - p.x) * eased;
          const py = p.y + (p.originY - p.y) * eased;
          ctx.fillRect(px, py, 1.5, 1.5);
        });

      } else if (elapsed < timeline.holdEnd) {
        // Hold Text
        ctx.shadowBlur = 10;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = 'rgba(200, 255, 255, 1)';

        textParticles.forEach(p => {
          ctx.fillRect(p.originX, p.originY, 1.5, 1.5);
        });

      } else if (elapsed < timeline.shatterEnd) {
        // Shatter
        const t = (elapsed - timeline.holdEnd) / (timeline.shatterEnd - timeline.holdEnd);
        const opacity = 1 - easeInExpo(t);

        ctx.shadowBlur = 5 * opacity;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = `rgba(200, 255, 255, ${opacity})`;

        textParticles.forEach(p => {
          p.originX += p.vx * t * 2;
          p.originY += p.vy * t * 2 + (t * 5); // Gravity/upward bias
          ctx.fillRect(p.originX, p.originY, 1.5, 1.5);
        });

        if (t > 0.8 && !isFading) {
          setIsFading(true);
        }

      } else {
        // Done
        onComplete();
        return;
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        data-testid="canvas-loader"
      />
    </div>
  );
}
