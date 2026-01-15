import React, { useState, useEffect } from 'react';
import { TimeElapsed } from '../types';

const RelationshipTimer: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Dates provided by user:
    // Start: 14/05/2025
    // End: 14/11/2025
    const startDate = new Date('2025-05-14T00:00:00');
    const endDate = new Date('2025-11-14T00:00:00');

    const calculateDuration = () => {
      // Calculate the fixed difference between end and start
      const diff = endDate.getTime() - startDate.getTime();

      // Ensure we don't show negative values if dates are swapped
      const safeDiff = Math.max(0, diff);

      const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((safeDiff / 1000 / 60) % 60);
      const seconds = Math.floor((safeDiff / 1000) % 60);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    calculateDuration();
    // No interval needed since both dates are fixed and relationship has "ended" (sallat)
  }, []);

  return (
    <div className="ios-card p-6 w-full max-w-md mx-auto transform hover:scale-[1.02] transition-transform duration-500">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h3 className="font-cairo text-lg text-white font-bold flex items-center gap-2">
          <span>مدة كلامنا</span>
        </h3>
        <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">14/05 - 14/11/2025</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3 font-cairo">
        {/* Days Widget */}
        <div className="ios-glass-element flex flex-col items-center justify-center p-3 aspect-square">
          <span className="text-2xl md:text-3xl font-bold text-white mb-1">{timeElapsed.days}</span>
          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">يوم</span>
        </div>
        
        {/* Hours Widget */}
        <div className="ios-glass-element flex flex-col items-center justify-center p-3 aspect-square">
          <span className="text-2xl md:text-3xl font-bold text-white mb-1">{timeElapsed.hours}</span>
          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">ساعة</span>
        </div>
        
        {/* Minutes Widget */}
        <div className="ios-glass-element flex flex-col items-center justify-center p-3 aspect-square">
          <span className="text-2xl md:text-3xl font-bold text-white mb-1">{timeElapsed.minutes}</span>
          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">دقيقة</span>
        </div>
        
        {/* Seconds Widget */}
        <div className="ios-glass-element flex flex-col items-center justify-center p-3 aspect-square bg-pink-500/20 border-pink-500/30">
          <span className="text-2xl md:text-3xl font-bold text-pink-200 mb-1">{timeElapsed.seconds}</span>
          <span className="text-[10px] text-pink-200 font-bold uppercase tracking-wider">ثانية</span>
        </div>
      </div>
    </div>
  );
};

export default RelationshipTimer;