import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import FloatingHearts from "./FloatingHearts";
import { Suspense, forwardRef } from "react";
import * as THREE from "three";

const SphereMesh = forwardRef<THREE.Mesh, { position: [number, number, number]; color: string; size: number }>(
  ({ position, color, size }, ref) => (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.5}
        transparent
        opacity={0.6}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
);
SphereMesh.displayName = "SphereMesh";

const GlowSphere = (props: { position: [number, number, number]; color: string; size: number }) => (
  <Float speed={2} rotationIntensity={0.3} floatIntensity={1.5}>
    <SphereMesh {...props} />
  </Float>
);

const Scene3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="hsl(174, 55%, 70%)" />
      <directionalLight position={[-5, 3, 2]} intensity={0.4} color="hsl(260, 60%, 80%)" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="hsl(330, 60%, 80%)" />

      <Suspense fallback={null}>
        <FloatingHearts />

        {/* Glowing orbs */}
        <GlowSphere position={[-2, 2.5, -3]} color="hsl(174, 55%, 55%)" size={0.2} />
        <GlowSphere position={[2.5, -1.5, -2]} color="hsl(260, 60%, 75%)" size={0.15} />
        <GlowSphere position={[0, 3, -4]} color="hsl(330, 60%, 80%)" size={0.18} />
        <GlowSphere position={[-3, -2, -2]} color="hsl(174, 55%, 65%)" size={0.12} />
        <GlowSphere position={[3.5, 1, -3]} color="hsl(260, 50%, 70%)" size={0.16} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
};

export default Scene3D;
