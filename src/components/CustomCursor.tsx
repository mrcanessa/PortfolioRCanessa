'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Springs suaves para simular la "estela" retrasada
  const springX = useSpring(0, { stiffness: 100, damping: 20, mass: 0.8 });
  const springY = useSpring(0, { stiffness: 100, damping: 20, mass: 0.8 });

  useEffect(() => {
    // Si estamos en un dispositivo táctil (móvil), no mostramos el cursor personalizado
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    setIsVisible(true);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      springX.set(e.clientX - 16); 
      springY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [springX, springY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Estela periférica (Ring) */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          border: '2px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          x: springX,
          y: springY,
          backgroundColor: isHovering ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          scale: isHovering ? 1.5 : 1,
        }}
      />
      {/* Punto central */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
        }}
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
    </>
  );
}
