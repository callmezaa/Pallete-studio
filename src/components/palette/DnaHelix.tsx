"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { usePaletteStore } from "@/store/palette-store";
import { getHelixData3D } from "@/lib/dna";
import type { ExtractedColor } from "@/types";
import type { Point3D } from "@/lib/dna";

interface DnaHelixProps {
  exportRef: React.MutableRefObject<(() => Promise<string | null>) | null>;
  onHover: (hex: string | null) => void;
}

function Backbone({ points, colors, totalHeight }: {
  points: Point3D[];
  colors: ExtractedColor[];
  totalHeight: number;
}) {
  const geometry = useMemo(() => {
    const pts = points.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 80, 0.14, 8, false);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    const c0 = new THREE.Color();
    const c1 = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = THREE.MathUtils.clamp((y + totalHeight / 2) / totalHeight, 0, 1);
      const idx = t * (colors.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, colors.length - 1);
      const f = idx - i0;
      c0.set(colors[i0].hex);
      c1.set(colors[i1].hex);
      c0.lerp(c1, f);
      cols[i * 3] = c0.r;
      cols[i * 3 + 1] = c0.g;
      cols[i * 3 + 2] = c0.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    return geo;
  }, [points, colors, totalHeight]);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        vertexColors
        roughness={0.15}
        metalness={0.4}
        emissiveIntensity={0.2}
        clearcoat={0.1}
      />
    </mesh>
  );
}

function Rung({ leftX, rightX, leftZ, rightZ, y, thickness, hex }: {
  leftX: number; rightX: number; leftZ: number; rightZ: number;
  y: number; thickness: number; hex: string;
}) {
  const from = new THREE.Vector3(leftX, y, leftZ);
  const to = new THREE.Vector3(rightX, y, rightZ);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const length = from.distanceTo(to);
  const dir = new THREE.Vector3().copy(to).sub(from).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), dir,
  );

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[thickness * 0.5, thickness * 0.5, length, 8]} />
      <meshPhysicalMaterial
        color={hex}
        roughness={0.2}
        metalness={0.2}
        emissive={hex}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function Node({ x, y, z, hex, onHover }: {
  x: number; y: number; z: number;
  hex: string;
  onHover: (hex: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current && hovered) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
    return () => { document.body.style.cursor = "default"; };
  }, [hovered]);

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(hex); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      <sphereGeometry args={[0.3, 20, 20]} />
      <meshPhysicalMaterial
        color={hex}
        emissive={hex}
        emissiveIntensity={hovered ? 1.0 : 0.35}
        roughness={0.05}
        metalness={0.5}
        clearcoat={0.2}
      />
    </mesh>
  );
}

function GroundRing() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.8, 0]}>
      <ringGeometry args={[1.5, 3.5, 64]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.04}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function AmbientParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 4;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneInner({ onReady, onHover, reduced }: {
  onReady: (caps: { gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera }) => void;
  onHover: (hex: string | null) => void;
  reduced: boolean;
}) {
  const colors = usePaletteStore((s) => s.colors);
  const { gl, scene, camera } = useThree();
  const controlsRef = useRef<any>(null);
  const data = useMemo(() => getHelixData3D({ colors, amplitude: 2.5, depth: 2 }), [colors]);
  const totalHeight = 10;

  useEffect(() => {
    onReady({ gl, scene, camera });
  }, [gl, scene, camera, onReady]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        autoRotate={!reduced}
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.06}
        minDistance={5}
        maxDistance={30}
      />

      {/* Ambient */}
      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#6366f1", "#1a1a2e", 0.4]} />

      {/* Key light — warm, from upper-right */}
      <pointLight position={[8, 6, 4]} intensity={0.8} color="#ffeedd" />
      {/* Fill light — cool, from lower-left */}
      <pointLight position={[-6, -4, 6]} intensity={0.4} color="#6688ff" />
      {/* Rim light — from behind */}
      <pointLight position={[0, 2, -10]} intensity={0.6} color="#ffffff" />

      <GroundRing />
      <AmbientParticles />

      <Float speed={reduced ? 0 : 0.4} floatIntensity={reduced ? 0 : 1.5} rotationIntensity={reduced ? 0 : 0.15}>
        <Backbone points={data.leftPoints} colors={colors} totalHeight={totalHeight} />
        <Backbone points={data.rightPoints} colors={colors} totalHeight={totalHeight} />

        {data.bars.map((bar, i) => (
          <Rung key={`bar-${i}`} {...bar} />
        ))}

        {data.bars.map((bar, i) => (
          <Node key={`nl-${i}`} x={bar.leftX} y={bar.y} z={bar.leftZ} hex={bar.hex} onHover={onHover} />
        ))}
        {data.bars.map((bar, i) => (
          <Node key={`nr-${i}`} x={bar.rightX} y={bar.y} z={bar.rightZ} hex={bar.hex} onHover={onHover} />
        ))}
      </Float>

      {!reduced && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.08} luminanceStrength={0.35} radius={0.6} />
        </EffectComposer>
      )}
    </>
  );
}

export function DnaHelix({ exportRef, onHover }: DnaHelixProps) {
  const captureRef = useRef<{ gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera } | null>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleReady = useCallback(
    (caps: { gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera }) => {
      captureRef.current = caps;
      exportRef.current = () =>
        new Promise<string | null>((resolve) => {
          const c = captureRef.current;
          if (!c) { resolve(null); return; }
          requestAnimationFrame(() => {
            resolve(c.gl.domElement.toDataURL("image/png"));
          });
        });
    },
    [exportRef],
  );

  return (
    <Canvas
      camera={{ position: [3, 1.5, 11], fov: 38 }}
      gl={{ alpha: true, preserveDrawingBuffer: true }}
      style={{ width: "100%", height: "100%" }}
      aria-label="3D DNA helix visualization of color palette"
    >
      <SceneInner onReady={handleReady} onHover={onHover} reduced={reduced} />
    </Canvas>
  );
}
