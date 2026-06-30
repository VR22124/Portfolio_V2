import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const PARTICLE_COUNT = isMobile ? 1200 : 4000;

export default function ParticleField({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const isReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const formations = useMemo(() => {
    const sphere = new Float32Array(PARTICLE_COUNT * 3);
    const helix = new Float32Array(PARTICLE_COUNT * 3);
    const grid = new Float32Array(PARTICLE_COUNT * 3);
    const torus = new Float32Array(PARTICLE_COUNT * 3);
    const side = Math.ceil(Math.cbrt(PARTICLE_COUNT));
    const step = 6 / side;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Sphere — Fibonacci distribution for even coverage
      const phi = Math.acos(1 - 2 * ((i + 0.5) / PARTICLE_COUNT));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      sphere[i3]     = 3.2 * Math.cos(theta) * Math.sin(phi);
      sphere[i3 + 1] = 3.2 * Math.sin(theta) * Math.sin(phi);
      sphere[i3 + 2] = 3.2 * Math.cos(phi);

      // Helix — double helix with 8 turns
      const tH = i / PARTICLE_COUNT;
      const angle = tH * Math.PI * 2 * 8;
      helix[i3]     = 2.5 * Math.cos(angle);
      helix[i3 + 1] = (tH - 0.5) * 8;
      helix[i3 + 2] = 2.5 * Math.sin(angle);

      // Grid — 3D cube
      const gx = (i % side) * step - 3;
      const gy = (Math.floor(i / side) % side) * step - 3;
      const gz = Math.floor(i / (side * side)) * step - 3;
      grid[i3]     = gx;
      grid[i3 + 1] = gy;
      grid[i3 + 2] = gz;

      // Torus
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const R = 2.8, r = 1.1;
      torus[i3]     = (R + r * Math.cos(v)) * Math.cos(u);
      torus[i3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
      torus[i3 + 2] = r * Math.sin(v);
    }

    return { sphere, helix, grid, torus };
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    let p = isReducedMotion ? 0 : scrollProgress.current;
    const smoothstep = (t: number) => t * t * (3 - 2 * t);
    const time = state.clock.elapsedTime;

    const stages = [formations.sphere, formations.helix, formations.grid, formations.torus];
    const stageCount = stages.length - 1;
    const stageProgress = p * stageCount;
    const stageIndex = Math.min(Math.floor(stageProgress), stageCount - 1);
    const localT = smoothstep(stageProgress - stageIndex);
    const shapeA = stages[stageIndex];
    const shapeB = stages[stageIndex + 1];

    // Subtle jitter — barely perceptible, ambient breathing only
    const jitterAmp = 0.001;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const jitterPhase = i * 0.07;
      positions[i3]     = shapeA[i3]     + (shapeB[i3]     - shapeA[i3])     * localT + Math.sin(time * 0.8 + jitterPhase)       * jitterAmp;
      positions[i3 + 1] = shapeA[i3 + 1] + (shapeB[i3 + 1] - shapeA[i3 + 1]) * localT + Math.sin(time * 0.7 + jitterPhase + 1.1) * jitterAmp;
      positions[i3 + 2] = shapeA[i3 + 2] + (shapeB[i3 + 2] - shapeA[i3 + 2]) * localT + Math.sin(time * 0.6 + jitterPhase + 2.2) * jitterAmp;
    }

    pointsRef.current.geometry.attributes.position.array = positions;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow, steady rotation on idle
    pointsRef.current.rotation.y = time * 0.04;
    if (!isReducedMotion) {
      pointsRef.current.rotation.x = p * Math.PI * 0.25;
    }
  });

  // Particle opacity: slightly reduced for text-heavy feel (0.7 instead of 0.85)
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#d4ff4f"
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
      />
    </points>
  );
}
