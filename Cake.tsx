import React, { useState, useEffect } from 'react';
import { Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface CakeProps {
  isLit: boolean;
  onBlow: () => void;
}

const Cake: React.FC<CakeProps> = ({ isLit, onBlow }) => {
  const [showSmoke, setShowSmoke] = useState(false);

  useEffect(() => {
    if (!isLit) {
      setShowSmoke(true);
      const timer = setTimeout(() => setShowSmoke(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLit]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-10 relative z-10"
    >
      
      {/* Cake Container - Significantly lowered (mt-60) for better composition */}
      <div className="relative mt-60 mb-20 transform scale-110 md:scale-125 hover:scale-[1.05] transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)">
        
        {/* Plate - Liquid Glass Style */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-80 h-16 bg-white/5 backdrop-blur-2xl rounded-[50%] shadow-[0_25px_70px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/10 z-0">
           {/* Reflection */}
           <div className="absolute top-2 left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-[50%] filter blur-md"></div>
        </div>

        {/* Cake Base Layer - Pink/Purple Mirror Glaze */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-28 bg-gradient-to-r from-pink-900 via-purple-900 to-pink-900 rounded-b-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-b border-white/10 z-10 flex items-end justify-center overflow-hidden">
             {/* Glossy shine overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60"></div>
             {/* Highlight */}
             <div className="absolute top-4 left-4 w-10 h-16 bg-white/10 rounded-full blur-xl transform -rotate-45"></div>
        </div>
        
        {/* Top of Base Layer */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-64 h-12 bg-gradient-to-r from-pink-800 to-purple-800 rounded-[50%] z-10 shadow-inner"></div>

        {/* Top Layer - Slightly smaller */}
        <div className="absolute bottom-26 left-1/2 -translate-x-1/2 w-52 h-20 bg-gradient-to-r from-pink-800 via-purple-800 to-pink-800 rounded-b-3xl shadow-lg z-20 flex items-end justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50"></div>
        </div>

        {/* Top Surface of Top Layer - The Lid */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-52 h-10 bg-gradient-to-r from-pink-700 to-purple-700 rounded-[50%] z-20 shadow-[inset_0_5px_10px_rgba(0,0,0,0.2)] border-t border-white/10 flex items-center justify-center overflow-hidden">
            {/* Surface sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent"></div>
        </div>

        {/* Drips (Liquid Effect) */}
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-52 h-10 z-20 pointer-events-none">
            <div className="absolute top-2 left-4 w-4 h-12 bg-pink-700/80 rounded-full shadow-md backdrop-blur-sm"></div>
            <div className="absolute top-3 left-14 w-3 h-8 bg-pink-700/80 rounded-full shadow-md backdrop-blur-sm"></div>
            <div className="absolute top-2 right-10 w-5 h-10 bg-purple-700/80 rounded-full shadow-md backdrop-blur-sm"></div>
        </div>

        {/* Number 71 Candles - Lowered from 9.5rem to 8.8rem */}
        <div className="absolute bottom-[8.8rem] left-1/2 -translate-x-1/2 z-30 flex gap-4 items-end">
           {/* Number 7 */}
           <div className="relative group w-12 flex justify-center">
              {/* Flame - Lowered from -top-12 to -top-10 */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 transition-all duration-700 ${isLit ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="w-5 h-10 bg-gradient-to-t from-orange-500 via-yellow-200 to-white rounded-[50%] animate-[flicker_0.8s_infinite_alternate] shadow-[0_0_30px_rgba(255,165,0,0.8)] origin-bottom"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              
              {/* Smoke - Lowered from -top-20 to -top-18 */}
              {showSmoke && (
                  <div className="absolute -top-18 left-1/2 -translate-x-1/2 w-3 h-20 bg-gray-400/30 blur-md rounded-full animate-[slideUp_2.5s_ease-out_forwards]"></div>
              )}

              {/* The Number 7 */}
              <div className="relative text-9xl font-bold font-cairo leading-none transform -rotate-6 transition-all duration-300 group-hover:-rotate-3">
                <span className="absolute inset-0 text-pink-500 blur-md opacity-50">7</span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>7</span>
              </div>
              
              {/* Wick */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-black/30"></div>
           </div>

           {/* Number 1 */}
           <div className="relative group w-12 flex justify-center">
              {/* Flame - Lowered from -top-10 to -top-8 */}
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${isLit ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                  <div className="w-5 h-10 bg-gradient-to-t from-orange-500 via-yellow-200 to-white rounded-[50%] animate-[flicker_0.9s_infinite_alternate_reverse] shadow-[0_0_30px_rgba(255,165,0,0.8)] origin-bottom"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              </div>

               {/* Smoke - Lowered from -top-20 to -top-18 */}
               {showSmoke && (
                  <div className="absolute -top-18 left-1/2 -translate-x-1/2 w-3 h-20 bg-gray-400/30 blur-md rounded-full animate-[slideUp_2.5s_ease-out_forwards] delay-100"></div>
              )}

              {/* The Number 1 */}
              <div className="relative text-9xl font-bold font-cairo leading-none transform rotate-3 transition-all duration-300 group-hover:rotate-0">
                <span className="absolute inset-0 text-pink-500 blur-md opacity-50">1</span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>1</span>
              </div>

              {/* Wick */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-black/30"></div>
           </div>
        </div>

      </div>

      <div className="mt-16 h-24 flex items-center justify-center relative z-40">
        {isLit ? (
          <motion.button 
            onClick={onBlow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(236, 72, 153, 0.4)", "0 0 40px rgba(236, 72, 153, 0.8)", "0 0 20px rgba(236, 72, 153, 0.4)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="liquid-btn liquid-btn-primary px-12 py-5 font-bold text-xl flex items-center gap-4 active:scale-95 transition-all"
          >
            <span>إطفاء الشموع</span>
            <Wind className="animate-bounce" size={24} />
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-cairo text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-pink-300 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)] text-center leading-tight"
          >
            🎉 كل عام وأنتِ بخير 🎉
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Cake;