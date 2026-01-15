import React, { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  
  // Use a reliable default URL instead of a local file to avoid errors
  const [audioSrc, setAudioSrc] = useState("https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2730e64.mp3?filename=piano-moment-113552.mp3");

  // Use a generic placeholder that fits the aesthetic or the real album art if available
  const albumArtUrl = "https://upload.wikimedia.org/wikipedia/en/a/aa/Billie_Eilish_-_Hit_Me_Hard_and_Soft.png";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Playback failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.warn("Audio source failed loading. Switching to fallback.");
    // Switch to a fallback audio URL that is likely to work for demonstration
    if (audioSrc !== "https://cdn.pixabay.com/download/audio/2023/06/27/audio_82570f8073.mp3?filename=relaxed-vlog-155734.mp3") {
       setAudioSrc("https://cdn.pixabay.com/download/audio/2023/06/27/audio_82570f8073.mp3?filename=relaxed-vlog-155734.mp3"); 
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-80 z-50 animate-slide-up">
      <audio 
        ref={audioRef} 
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
        loop
      />
      
      {/* IOS Style Glass Card */}
      <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden group hover:bg-black/70 transition-colors">
        
        {/* Main Content */}
        <div className="flex items-center gap-4 relative z-10">
          
          {/* Album Art */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border border-white/5">
            <img 
              src={albumArtUrl} 
              alt="Birds of a Feather" 
              className="w-full h-full object-cover"
              onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1493225079528-9b1837d70f69?q=80&w=200&auto=format&fit=crop";
              }}
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-cairo font-bold text-white text-base truncate leading-tight">
              BIRDS OF A FEATHER
            </h3>
            <p className="font-cairo text-gray-400 text-xs truncate">
              Billie Eilish
            </p>
          </div>

          {/* Heart Control */}
          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center focus:outline-none"
          >
            <motion.div
              animate={isPlaying ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.2, 
                ease: "easeInOut",
                repeatType: "loop"
              }}
            >
              <Heart 
                size={28} 
                fill={isPlaying ? "#db2777" : "transparent"} 
                stroke={isPlaying ? "#db2777" : "white"} 
                strokeWidth={2}
                className="filter drop-shadow-[0_0_8px_rgba(236,72,153,0.6)] saturate-150"
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all" onClick={handleSeek}>
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
        
        {/* Background Glow */}
        {isPlaying && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-500/10 blur-3xl rounded-full -z-0 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;