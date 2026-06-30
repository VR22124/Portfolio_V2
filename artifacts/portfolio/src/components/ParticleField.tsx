import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1200 : 4000;

export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const { sphere, helix, grid, torus } = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const helix = new Float32Array(particleCount * 3);
    const grid = new Float32Array(particleCount * 3);
    const torus = new Float32Array(particleCount * 3);

    const side = Math.ceil(Math.cbrt(particleCount));
    const step = 6 / side;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Sphere
      const phi = Math.acos(1 - 2 * ((i + 0.5) / particleCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      sphere[i3] = 3.2 * Math.cos(theta) * Math.sin(phi);
      sphere[i3 + 1] = 3.2 * Math.sin(theta) * Math.sin(phi);
      sphere[i3 + 2] = 3.2 * Math.cos(phi);

      // Helix
      const tHelix = i / particleCount;
      const angle = tHelix * Math.PI * 2 * 8;
      helix[i3] = 2.5 * Math.cos(angle);
      helix[i3 + 1] = (tHelix - 0.5) * 8;
      helix[i3 + 2] = 2.5 * Math.sin(angle);

      // Grid
      const gx = (i % side) * step - 3;
      const gy = (Math.floor(i / side) % side) * step - 3;
      const gz = Math.floor(i / (side * side)) * step - 3;
      grid[i3] = gx;
      grid[i3 + 1] = gy;
      grid[i3 + 2] = gz;

      // Torus
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 2.8;
      const r = 1.1;
      torus[i3] = (R + r * Math.cos(v)) * Math.cos(u);
      torus[i3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      torus[i3 + 2] = r * Math.sin(v);
    }
    return { sphere, helix, grid, torus };
  }, []);

  const positions = useMemo(() => new Float32Array(particleCount * 3), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    let p = scrollProgress.current;
    if (isReducedMotion) p = 0;

    const ease = (t: number) => t * t * (3 - 2 * t);
    
    let shapeA = sphere, shapeB = sphere, morph = 0;

    if (p < 0.333) {
      shapeA = sphere; shapeB = helix;
      morph = ease(p / 0.333);
    } else if (p < 0.666) {
      shapeA = helix; shapeB = grid;
      morph = ease((p - 0.333) / 0.333);
    } else {
      shapeA = grid; shapeB = torus;
      morph = ease((p - 0.666) / 0.334);
    }

    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      let targetX = shapeA[i3] + (shapeB[i3] - shapeA[i3]) * morph;
      let targetY = shapeA[i3+1] + (shapeB[i3+1] - shapeA[i3+1]) * morph;
      let targetZ = shapeA[i3+2] + (shapeB[i3+2] - shapeA[i3+2]) * morph;

      targetX += Math.sin(time + i * 0.1) * 0.002;
      targetY += Math.sin(time + i * 0.1) * 0.002;
      targetZ += Math.sin(time + i * 0.1) * 0.002;

      positions[i3] = targetX;
      positions[i3+1] = targetY;
      positions[i3+2] = targetZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (isReducedMotion) {
      pointsRef.current.rotation.y = time * 0.05;
    } else {
      pointsRef.current.rotation.y = time * 0.1 + p * Math.PI;
      pointsRef.current.rotation.x = p * Math.PI * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#d4ff4f"
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}