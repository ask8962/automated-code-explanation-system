'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* =============================================
   STARS (Deep Space)
   ============================================= */
function Starfield() {
    const pointsRef = useRef<THREE.Points>(null!);
    const count = 3000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

            // Make stars subtle blue/white
            const isBlue = Math.random() > 0.5;
            colors[i * 3] = isBlue ? 0.4 : 0.8;
            colors[i * 3 + 1] = isBlue ? 0.6 : 0.8;
            colors[i * 3 + 2] = isBlue ? 1.0 : 0.9;
        }
        return [positions, colors];
    }, []);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.01;
            pointsRef.current.rotation.x += delta * 0.005;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
            </bufferGeometry>
            {/* Draw circular points using a custom shader trick or soft material */}
            <pointsMaterial size={0.05} vertexColors transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
}

/* =============================================
   THE CORE (The "Sun")
   ============================================= */
function OrbitalCore() {
    const coreRef = useRef<THREE.Mesh>(null!);
    const wireRef = useRef<THREE.Mesh>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (coreRef.current && wireRef.current && glowRef.current) {
            coreRef.current.rotation.y = time * 0.2;
            wireRef.current.rotation.y = time * -0.1;
            wireRef.current.rotation.x = time * 0.05;

            // Pulsing glow
            const scale = 1.05 + Math.sin(time * 3) * 0.02;
            glowRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group>
            {/* Dark, solid inner core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshBasicMaterial color="#050510" />
            </mesh>

            {/* Glowing neon wireframe overlay */}
            <mesh ref={wireRef}>
                <sphereGeometry args={[2.01, 24, 24]} />
                <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>

            {/* Expansive, soft outer glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[2.2, 32, 32]} />
                <meshBasicMaterial color="#6366f1" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh scale={1.5}>
                <sphereGeometry args={[2.2, 32, 32]} />
                <meshBasicMaterial color="#4f46e5" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

/* =============================================
   RING & PLANET (The Orbits)
   ============================================= */
function OrbitalRing({ radius, tiltX, tiltZ, speed, planetSize, color }: { radius: number, tiltX: number, tiltZ: number, speed: number, planetSize: number, color: string }) {
    const ringRef = useRef<THREE.Group>(null!);
    const planetRef = useRef<THREE.Mesh>(null!);
    
    // Create the smooth ring line
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        return pts;
    }, [radius]);
    
    const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    useFrame((state, delta) => {
        if (ringRef.current) {
            // Spin the entire ring to move the planet
            ringRef.current.rotation.y += delta * speed;
        }
    });

    return (
        <group rotation={[tiltX, 0, tiltZ]}>
            {/* The visible Track */}
            <line>
                <bufferGeometry attach="geometry" {...geometry} />
                <lineBasicMaterial color={color} transparent opacity={0.25} blending={THREE.AdditiveBlending} />
            </line>
            
            {/* The rotating container moving the planet */}
            <group ref={ringRef}>
                {/* The Planet Node */}
                <mesh position={[radius, 0, 0]} ref={planetRef}>
                    <sphereGeometry args={[planetSize, 16, 16]} />
                    <meshBasicMaterial color={color} />
                    
                    {/* Planet Glow */}
                    <mesh scale={2.5}>
                        <sphereGeometry args={[planetSize, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                    <mesh scale={5.0}>
                        <sphereGeometry args={[planetSize, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                </mesh>
            </group>
        </group>
    );
}

/* =============================================
   INTERACTIVE MAIN SYSTEM
   ============================================= */
function SolarSystem() {
    const systemRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        // Entire system floats and tilts gracefully based on time and mouse
        const time = state.clock.getElapsedTime();
        if (systemRef.current) {
            // Gentle idle float
            systemRef.current.position.y = Math.sin(time * 0.5) * 0.2;
            systemRef.current.rotation.x = Math.sin(time * 0.3) * 0.05 + 0.2; // Base tilt
            systemRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;

            // Interactive mouse tilt (parallax)
            const targetX = state.mouse.y * 0.2;
            const targetY = state.mouse.x * 0.2;
            
            systemRef.current.rotation.x += (targetX - systemRef.current.rotation.x) * 0.05;
            systemRef.current.rotation.y += (targetY - systemRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group ref={systemRef}>
            <OrbitalCore />
            
            {/* Elegant, overlapping abstract orbits. Neon Cyberpunk Colors */}
            <OrbitalRing radius={4} tiltX={0.1} tiltZ={-0.2} speed={0.8} planetSize={0.06} color="#06b6d4" /> {/* Cyan */}
            <OrbitalRing radius={6} tiltX={-0.2} tiltZ={0.1} speed={0.5} planetSize={0.08} color="#ec4899" /> {/* Pink */}
            <OrbitalRing radius={8} tiltX={0.05} tiltZ={0.3} speed={0.3} planetSize={0.10} color="#8b5cf6" /> {/* Violet */}
            <OrbitalRing radius={11} tiltX={-0.15} tiltZ={-0.1} speed={0.2} planetSize={0.12} color="#3b82f6" /> {/* Blue */}
            <OrbitalRing radius={14} tiltX={0.25} tiltZ={0.05} speed={0.1} planetSize={0.09} color="#f43f5e" /> {/* Rose */}
        </group>
    );
}

/* =============================================
   SCENE WRAPPER
   ============================================= */
export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-[#020008]">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 45 }}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
            >
                {/* Deep fog to blend the edges of the rings and stars */}
                <fog attach="fog" args={['#020008', 10, 40]} />
                
                <Starfield />
                <SolarSystem />
            </Canvas>
            
            {/* Overlay Gradient to blend with the UI */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#020008]/80 via-transparent to-[#020008]/80 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020008] via-transparent to-[#020008] pointer-events-none" />
        </div>
    );
}
