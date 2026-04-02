'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// ------------------------------------------
// THE LIQUID CYBER-BRAIN (Core)
// ------------------------------------------
function LiquidCore() {
    const sphereRef = useRef<THREE.Mesh>(null!);
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.y = time * 0.15;
            sphereRef.current.rotation.z = time * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
            {/* Outer morphing liquid shell */}
            <mesh ref={sphereRef} scale={1.8}>
                <icosahedronGeometry args={[1, 128]} />
                <MeshDistortMaterial 
                    color="#06B6D4" 
                    emissive="#0a0a14" 
                    roughness={0.1} 
                    metalness={0.9} 
                    distort={0.45} 
                    speed={2.5} 
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    wireframe={false}
                />
            </mesh>
            
            {/* Wireframe inner skeleton connecting the core */}
            <mesh scale={1.75}>
                <icosahedronGeometry args={[1, 16]} />
                <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.5} wireframe />
            </mesh>
            
            {/* True solid dark center to prevent full transparency bleed */}
            <mesh scale={1.3}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#050510" roughness={0.8} />
            </mesh>
        </Float>
    );
}

// ------------------------------------------
// QUANTUM RINGS (Orbitals)
// ------------------------------------------
function QuantumRings() {
    const groupRef = useRef<THREE.Group>(null!);
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.x = time * 0.05 + 0.5;
            groupRef.current.rotation.y = time * 0.1;
            
            // Ultra-smooth parallax tied to mouse
            const targetX = state.mouse.y * 0.25;
            const targetY = state.mouse.x * 0.25;
            groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.02;
            groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={1} rotationIntensity={0.5}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3.2, 0.008, 16, 128]} />
                    <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={3} />
                </mesh>
                <mesh rotation={[-Math.PI / 2.2, 0.2, 0]} scale={1.1}>
                    <torusGeometry args={[3.6, 0.006, 16, 128]} />
                    <meshStandardMaterial color="#F472B6" emissive="#F472B6" emissiveIntensity={2.5} />
                </mesh>
                <mesh rotation={[-Math.PI / 1.8, -0.2, 0]} scale={1.2}>
                    <torusGeometry args={[4.2, 0.015, 16, 128]} />
                    <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={4} />
                </mesh>
                
                {/* Micro outer track */}
                <mesh rotation={[-Math.PI / 1.9, 0.1, 0.1]} scale={1.35}>
                    <torusGeometry args={[4.5, 0.003, 16, 128]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
                </mesh>
            </Float>
        </group>
    );
}

// ------------------------------------------
// DATA PARTICLES & NEBULA
// ------------------------------------------
function DeepSpace() {
    return (
        <>
            <Stars radius={100} depth={50} count={8000} factor={5} saturation={1} fade speed={0.5} />
            <Sparkles count={500} scale={18} size={2.5} speed={0.2} opacity={0.5} color="#7C3AED" />
            <Sparkles count={400} scale={14} size={3.5} speed={0.5} opacity={0.8} color="#06B6D4" />
            <Sparkles count={150} scale={10} size={5} speed={0.8} opacity={1} color="#F472B6" />
        </>
    );
}

// ------------------------------------------
// MAIN SCENE WRAPPER
// ------------------------------------------
export default function Scene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-[#020205]">
            <Canvas
                camera={{ position: [0, 0, 8.5], fov: 45 }}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#020205']} />
                <fog attach="fog" args={['#020205', 3, 20]} />
                
                {/* Advanced Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={2} color="#06B6D4" />
                <pointLight position={[-10, -10, -5]} intensity={1.5} color="#7C3AED" />
                <pointLight position={[0, 0, 0]} intensity={1} color="#F472B6" distance={15} />
                
                <DeepSpace />
                <LiquidCore />
                <QuantumRings />
                
                {/* Environment reflections make the metalness pop heavily */}
                <Environment preset="city" />
            </Canvas>
            
            {/* Cinematic Dark Vignette & Edge Blurs */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020205_110%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-transparent to-[#020205] pointer-events-none opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020205] via-transparent to-[#020205] pointer-events-none opacity-40" />
        </div>
    );
}
