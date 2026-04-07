'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CursorSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  // Spring physics for ultra-smooth trailing
  const springX = useSpring(-1000, { stiffness: 50, damping: 20 });
  const springY = useSpring(-1000, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      springX.set(e.clientX);
      springY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [springX, springY]);

  return (
    <>
      {/* Intense Core Glow (Snaps perfectly to mouse) */}
      <div 
        className="pointer-events-none fixed inset-0 z-[100] mix-blend-color-dodge transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
        }}
      />
      
      {/* Delayed trailing glow (Physics based) */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full bg-cyan-400/30 blur-md z-[101] mix-blend-screen"
        style={{
          x: springX,
          y: springY
        }}
      />
    </>
  );
}
