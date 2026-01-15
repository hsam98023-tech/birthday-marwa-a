import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailPoint {
  id: number;
  x: number;
  y: number;
  text: string;
  rotation: number;
  scale: number;
  color: string;
}

const TRAIL_TEXT = "Happy Birthday Marwa 🎉";
const COLORS = [
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#fbbf24', // Amber
  '#34d399', // Emerald
  '#60a5fa', // Blue
  '#f472b6', // Light Pink
];

const TouchTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const lastPointRef = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    const addPoint = (x: number, y: number) => {
      const now = Date.now();
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      const newPoint: TrailPoint = {
        id: now + Math.random(),
        x,
        y,
        text: TRAIL_TEXT,
        rotation: (Math.random() - 0.5) * 15,
        scale: 0.6 + Math.random() * 0.4,
        color: randomColor
      };

      setTrail((prev) => [...prev, newPoint]);

      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== newPoint.id));
      }, 1000);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const y = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      // Throttle creation based on distance to prevent overcrowding
      if (lastPointRef.current) {
        const dx = x - lastPointRef.current.x;
        const dy = y - lastPointRef.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < 45) return;
      }
      lastPointRef.current = { x, y };
      
      addPoint(x, y);
    };

    const handlePress = (e: MouseEvent | TouchEvent) => {
        const x = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const y = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
        
        // Burst effect on press
        for(let i = 0; i < 3; i++) {
           setTimeout(() => {
             addPoint(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40);
           }, i * 50);
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mousedown', handlePress);
    window.addEventListener('touchstart', handlePress);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mousedown', handlePress);
      window.removeEventListener('touchstart', handlePress);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {trail.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, scale: 0.2, x: "-50%", y: "-50%", rotate: point.rotation }}
            animate={{ opacity: 1, scale: point.scale, y: "-150%" }}
            exit={{ opacity: 0, scale: point.scale * 1.2, y: "-200%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-xl md:text-2xl font-bold font-cursive whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ 
              left: point.x, 
              top: point.y,
              color: point.color
            }}
          >
            {point.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TouchTrail;