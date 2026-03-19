'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Float } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* =============================================
   PARTICLE FIELD — Dual Layer System
   ============================================= */
function ParticleField({ count = 5000, radius = 4 }: { count?: number; radius?: number }) {
    const ref = useRef<THREE.Points>(null!);
    const time = useRef(0);

    const [positions, colors, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const palette = [
            new THREE.Color('#8b5cf6'), // Violet
            new THREE.Color('#6366f1'), // Indigo
            new THREE.Color('#a78bfa'), // Light violet
            new THREE.Color('#818cf8'), // Light indigo
            new THREE.Color('#c084fc'), // Purple
            new THREE.Color('#22d3ee'), // Cyan accent
        ];

        for (let i = 0; i < count; i++) {
            // Spherical + gaussian distribution for organic feel
            const r = radius * (0.5 + Math.random() * 0.8);
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Color from palette with randomized blend
            const baseColor = palette[Math.floor(Math.random() * palette.length)];
            const mixColor = palette[Math.floor(Math.random() * palette.length)];
            const mixed = baseColor.clone().lerp(mixColor, Math.random() * 0.5);

            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;

            // Varied sizes for depth
            sizes[i] = Math.random() * 0.015 + 0.003;
        }

        return [positions, colors, sizes];
    }, [count, radius]);

    useFrame((state, delta) => {
        if (!ref.current) return;
        time.current += delta;
        ref.current.rotation.y += delta * 0.03;
        ref.current.rotation.x += delta * 0.01;

        // Gentle breathing scale
        const breathe = 1 + Math.sin(time.current * 0.3) * 0.02;
        ref.current.scale.setScalar(breathe);
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                transparent
                vertexColors
                size={0.018}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </points>
    );
}

/* =============================================
   AMBIENT DUST — Subtle background particles
   ============================================= */
function AmbientDust() {
    const ref = useRef<THREE.Points>(null!);

    const positions = useMemo(() => {
        const count = 1500;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.005;
            ref.current.rotation.x += delta * 0.003;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <PointMaterial
                transparent
                color="#6366f1"
                size={0.005}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.3}
            />
        </points>
    );
}

/* =============================================
   MOUSE RIG — Smooth camera follow
   ============================================= */
function MouseRig() {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3(0, 0, 5));

    useFrame((state) => {
        const x = state.mouse.x * 0.4;
        const y = state.mouse.y * 0.3;
        target.current.set(x, y, 5);
        camera.position.lerp(target.current, 0.03);
        camera.lookAt(0, 0, 0);
    });

    return null;
}

/* =============================================
   SCENE — Main export
   ============================================= */
export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.3} />
                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
                    <ParticleField count={5000} radius={3.5} />
                </Float>
                <AmbientDust />
                <MouseRig />
            </Canvas>
        </div>
    );
}
