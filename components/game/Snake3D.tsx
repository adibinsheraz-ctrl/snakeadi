'use client';
import { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

export function Snake3DScene() {
  const meshRef = useRef<THREE.Mesh>(null);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 20; i++) {
      pts.push([Math.sin(i * 0.3) * 3, Math.cos(i * 0.2) * 2, i * 0.5]);
    }
    return pts;
  }, []);

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#a855f7" />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <torusGeometry args={[1.2, 0.3, 16, 32]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#9333ea"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0f172a" roughness={1} metalness={0} />
      </mesh>

      <Environment preset="night" />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
