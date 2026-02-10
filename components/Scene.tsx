'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

/* Rotating Starfield */
function Stars() {
    const ref = useRef<any>();
    const [sphere] = useState(() =>
        random.inSphere(new Float32Array(8001), { radius: 1.8 })
    );

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 12;
            ref.current.rotation.y -= delta / 18;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#7c3aed"
                    size={0.0015}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

/* Glowing Wireframe Icosahedron */
function GlowingSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.05;
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.08;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={0.8}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial
                wireframe
                color="#7c3aed"
                transparent
                opacity={0.06}
            />
        </mesh>
    );
}

/* Secondary Ring */
function FloatingRing() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
            meshRef.current.rotation.z = clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <torusGeometry args={[1.2, 0.003, 16, 100]} />
            <meshBasicMaterial color="#7c3aed" transparent opacity={0.15} />
        </mesh>
    );
}

export default function Scene() {
    return (
        <div className="absolute inset-0 bg-[#030303]">
            <Canvas camera={{ position: [0, 0, 1.8], fov: 60 }} dpr={[1, 2]}>
                <Stars />
                <GlowingSphere />
                <FloatingRing />
            </Canvas>
        </div>
    );
}
