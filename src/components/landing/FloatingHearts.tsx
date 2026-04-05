import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const HeartShape = () => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3);
    s.bezierCurveTo(0, 0.6, -0.5, 0.8, -0.5, 0.5);
    s.bezierCurveTo(-0.5, 0.2, 0, 0.1, 0, -0.3);
    s.bezierCurveTo(0, 0.1, 0.5, 0.2, 0.5, 0.5);
    s.bezierCurveTo(0.5, 0.8, 0, 0.6, 0, 0.3);
    return s;
  }, []);

  const geometry = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
  }, [shape]);

  return geometry;
};

interface HeartProps {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  rotationOffset: number;
}

const Heart = ({ position, color, scale, speed, rotationOffset }: HeartProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const geometry = HeartShape();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * speed * 0.5 + rotationOffset;
    ref.current.rotation.z = Math.sin(t * speed * 0.3) * 0.2;
    ref.current.position.y = position[1] + Math.sin(t * speed + rotationOffset) * 0.3;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={position} scale={scale}>
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.3}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

const FloatingHearts = () => {
  const hearts = useMemo(
    () => [
      { position: [-2.5, 1.5, -1] as [number, number, number], color: "hsl(174, 55%, 45%)", scale: 0.5, speed: 0.8, rotationOffset: 0 },
      { position: [2.8, 0.5, -2] as [number, number, number], color: "hsl(260, 60%, 75%)", scale: 0.4, speed: 1.0, rotationOffset: 1.5 },
      { position: [-1.5, -0.8, -1.5] as [number, number, number], color: "hsl(330, 60%, 75%)", scale: 0.35, speed: 0.6, rotationOffset: 3 },
      { position: [1.5, 2, -0.5] as [number, number, number], color: "hsl(174, 55%, 60%)", scale: 0.3, speed: 1.2, rotationOffset: 4.5 },
      { position: [-3, -1.5, -2.5] as [number, number, number], color: "hsl(260, 50%, 65%)", scale: 0.45, speed: 0.7, rotationOffset: 2 },
      { position: [3, -1, -1] as [number, number, number], color: "hsl(330, 50%, 80%)", scale: 0.25, speed: 0.9, rotationOffset: 5 },
      { position: [0.5, -2, -3] as [number, number, number], color: "hsl(174, 45%, 55%)", scale: 0.38, speed: 0.5, rotationOffset: 1 },
    ],
    []
  );

  return (
    <>
      {hearts.map((h, i) => (
        <Heart key={i} {...h} />
      ))}
    </>
  );
};

export default FloatingHearts;
