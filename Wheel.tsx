import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Violet
  '#EC4899'  // Pink
];

const Wheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [canSpin, setCanSpin] = useState(true);

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    setCanSpin(false);

    // Random rotation: at least 3 full spins (1080) + random segment
    const newRotation = rotation + 1080 + Math.random() * 360;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Trigger confetti on stop
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: COLORS
      });

      // Cooldown 0.7s
      setTimeout(() => {
        setCanSpin(true);
      }, 700);
    }, 3000); // 3 seconds spin duration
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 animate-fade-in">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Arrow Indicator */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-10">
           <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-white drop-shadow-lg"></div>
        </div>

        {/* The Wheel */}
        <motion.div
          className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "circOut" }}
          onClick={handleSpin}
          style={{ cursor: canSpin ? 'pointer' : 'default' }}
        >
          {COLORS.map((color, index) => (
            <div
              key={index}
              className="absolute w-full h-full top-0 left-0"
              style={{
                backgroundColor: color,
                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)', // Quarter slice
                transform: `rotate(${index * 45}deg)`,
                transformOrigin: '50% 50%'
              }}
            >
            </div>
          ))}
          {/* Use Conic Gradient for perfect 8 slices visual */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
                background: `conic-gradient(
                    ${COLORS[0]} 0deg 45deg,
                    ${COLORS[1]} 45deg 90deg,
                    ${COLORS[2]} 90deg 135deg,
                    ${COLORS[3]} 135deg 180deg,
                    ${COLORS[4]} 180deg 225deg,
                    ${COLORS[5]} 225deg 270deg,
                    ${COLORS[6]} 270deg 315deg,
                    ${COLORS[7]} 315deg 360deg
                )`
            }}
          />
          
          {/* Inner Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-inner flex items-center justify-center z-10">
             <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-300"></div>
          </div>
        </motion.div>
      </div>

      <button 
        onClick={handleSpin}
        disabled={!canSpin}
        className={`mt-8 px-8 py-3 rounded-full font-bold text-lg transition-all ${
            canSpin 
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 active:scale-95' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isSpinning ? 'جاري الدوران...' : 'لف العجلة 🎲'}
      </button>
      
      {!canSpin && !isSpinning && (
          <p className="text-xs text-gray-400 mt-2 animate-pulse">انتظري قليلاً...</p>
      )}
    </div>
  );
};

export default Wheel;