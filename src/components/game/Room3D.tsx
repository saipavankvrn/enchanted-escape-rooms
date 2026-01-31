import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center, Environment, MeshTransmissionMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface Room3DProps {
  level: number;
  isActive: boolean;
}

const levelColors = [
  '#00ffff', // Level 1 - Cyan
  '#a855f7', // Level 2 - Purple
  '#ec4899', // Level 3 - Pink
  '#22c55e', // Level 4 - Green
  '#f59e0b', // Level 5 - Amber
];

const GlowingOrb = ({ color, position, scale = 1 }: { color: string; position: [number, number, number]; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight position={position} color={color} intensity={3} distance={10} />
    </Float>
  );
};

const FloatingRing = ({ color, radius, speed }: { color: string; radius: number; speed: number }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * speed;
      ringRef.current.rotation.z = state.clock.elapsedTime * speed * 0.5;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

const LevelSymbol = ({ level, color }: { level: number; color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const symbols = useMemo(() => {
    const shapes: JSX.Element[] = [];
    for (let i = 0; i < level; i++) {
      const angle = (i / level) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;
      shapes.push(
        <mesh key={i} position={[x, 0, z]}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
          />
        </mesh>
      );
    }
    return shapes;
  }, [level, color]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {symbols}
      <FloatingRing color={color} radius={3} speed={0.3} />
      <FloatingRing color={color} radius={2.5} speed={-0.2} />
    </group>
  );
};

const RoomScene = ({ level, isActive }: Room3DProps) => {
  const color = levelColors[level - 1];

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
      
      {isActive && (
        <>
          <GlowingOrb color={color} position={[0, 2, 0]} scale={0.8} />
          <LevelSymbol level={level} color={color} />
          
          {/* Floor grid effect */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20, 20, 20]} />
            <meshStandardMaterial
              color={color}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        </>
      )}
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      <Environment preset="night" />
    </>
  );
};

const Room3D = ({ level, isActive }: Room3DProps) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <RoomScene level={level} isActive={isActive} />
      </Canvas>
    </div>
  );
};

export default Room3D;
