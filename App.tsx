import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Lock, User, Volume2, VolumeX, SkipForward, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartBackground from './components/HeartBackground';
import Cake from './components/Cake';
import EnvelopeMessage from './components/EnvelopeMessage';
import TouchTrail from './components/TouchTrail';
import LeaveMessage from './components/LeaveMessage';
import AdminInbox from './components/AdminInbox';
import { AppStage } from './types';

// Playlist Logic: Reliable placeholder songs from Pixabay
const PLAYLIST = [
  "https://cdn.pixabay.com/download/audio/2022/02/07/audio_1204066601.mp3?filename=piano-moment-113552.mp3",
  "https://cdn.pixabay.com/download/audio/2022/10/05/audio_6861212c75.mp3?filename=best-time-112194.mp3"
];

// Cheering Sound Effect
const CHEER_SOUND = "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b2c6a056.mp3?filename=people-cheering-8798.mp3"; 

// Animation Variants
const pageVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.5, ease: "easeInOut" } }
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0 0 25px rgba(236,72,153,0.5)" },
  tap: { scale: 0.95 }
};

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LOGIN);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const cheerRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Countdown State (Starts at 3)
  const [countdown, setCountdown] = useState(3);

  // Celebration State
  const [candlesLit, setCandlesLit] = useState(true);
  const [showSurpriseMessage, setShowSurpriseMessage] = useState(false);
  
  const targetPhone = "212679107509";

  // --- AUDIO HANDLING ---
  const handleSongEnd = () => {
    // This handler will only trigger if loop is false (multi-song playlist)
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.warn("Audio source failed or not supported");
    // Optionally try next song or stop playing to prevent loop
    // For now we just log it. The updated URLs should prevent this.
  };

  // Effect to play audio when index changes (playlist logic)
  useEffect(() => {
    if (isPlaying && audioRef.current) {
        // Only reload src if it changed to avoid interrupting loop
        // Check if src contains the playlist item (handling potential absolute/relative URL differences)
        const currentSrc = audioRef.current.src;
        const targetSrc = PLAYLIST[currentSongIndex];
        
        // Simple check to see if we need to update the source
        if (!currentSrc.includes(targetSrc.split('?')[0])) {
            audioRef.current.src = targetSrc;
            audioRef.current.play().catch(e => console.error("Playlist transition error:", e));
        } else if (audioRef.current.paused) {
             audioRef.current.play().catch(e => console.error("Resume error:", e));
        }
    }
  }, [currentSongIndex, isPlaying]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(err => console.error("Play error:", err));
    }
  };

  const attemptPlay = () => {
    if (audioRef.current) {
        // Ensure source is set
        if (!audioRef.current.src || !audioRef.current.src.includes(PLAYLIST[currentSongIndex].split('?')[0])) {
             audioRef.current.src = PLAYLIST[currentSongIndex];
        }
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
          .then(() => {
              setIsPlaying(true);
              setIsMuted(false);
          })
          .catch((e) => {
              console.log("Autoplay blocked:", e);
          });
        }
    }
  };

  // --- LOGIN LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.toLowerCase().trim();
    const cleanUser = username.toLowerCase().trim();
    
    // Updated password to 'ismail'
    if (cleanUser === 'marwa' && cleanPassword === 'ismail') {
      // 1. Start Audio Immediately
      attemptPlay();

      // 2. Change Stage
      setStage(AppStage.COUNTDOWN);
      setError('');
    } else {
      setError('معلومات الدخول غير صحيحة، حاولي مرة أخرى يا جميلتي');
    }
  };

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (stage === AppStage.COUNTDOWN) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage(AppStage.CELEBRATION);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  // --- CELEBRATION LOGIC ---
  const handleBlowCandles = () => {
    // 1. Extinguish candles immediately
    setCandlesLit(false);

    // 2. Play Cheer Sound
    if (cheerRef.current) {
      cheerRef.current.volume = 0.6;
      cheerRef.current.play().catch(e => console.log("Cheer sound blocked", e));
    }
    
    // 3. Fire Intense Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    // Side Cannons
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#a855f7', '#fbbf24']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#a855f7', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // 4. Wait 1.5s for smoke effect, then show the message
    setTimeout(() => {
        setShowSurpriseMessage(true);
    }, 1500);
  };

  const handleWhatsappSend = (msg: string) => {
    const text = msg.trim() ? msg : "عيد ميلاد سعيد! 💗";
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Shared Music Button Component for cleaner code
  const MusicButton = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-col items-center gap-4"
    >
        <motion.button 
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={toggleAudio}
            className={`px-6 py-3 rounded-full liquid-icon-container text-white transition-transform group flex items-center gap-3 mx-auto ${isPlaying ? 'animate-beat' : ''}`}
        >
            {isPlaying ? (
              <>
                <Volume2 size={20} className="text-pink-400 group-hover:text-pink-300 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" /> 
                <span className="text-sm font-cairo text-pink-100">إيقاف الموسيقى</span>
              </>
            ) : (
              <>
                <VolumeX size={20} className="text-pink-600 group-hover:text-pink-500 transition-colors drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                <span className="text-sm font-cairo text-pink-200">تشغيل الموسيقى</span>
              </>
            )}
        </motion.button>

        <motion.button 
            variants={buttonVariants}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap="tap"
            onClick={handleNextSong}
            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white transition-all flex items-center gap-2"
        >
            <SkipForward size={16} className="text-purple-300" />
            <span className="text-xs font-cairo text-purple-200">تغيير الأغنية</span>
        </motion.button>
    </motion.div>
  );

  // If in Admin Mode, render AdminInbox exclusively
  if (stage === AppStage.ADMIN) {
    return (
      <AdminInbox onExit={() => {
        setStage(AppStage.LOGIN);
      }} />
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden text-gray-100 selection:bg-pink-500 selection:text-white">
      <TouchTrail />
      <HeartBackground />

      {/* Playlist Audio Element */}
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentSongIndex]} 
        onEnded={handleSongEnd}
        onError={handleAudioError}
        loop={PLAYLIST.length === 1} // Automatically loop if it's a single song
        hidden 
      />

      {/* Cheer Audio Element */}
      <audio ref={cheerRef} src={CHEER_SOUND} hidden onError={() => console.warn("Cheer sound failed")} />

      {/* Audio Visualizer (Bottom) */}
      {isPlaying && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center gap-1.5 pb-6 pointer-events-none opacity-80">
          <div className="visualizer-bar" style={{ animationDelay: '0s', height: '15px', animationDuration: '0.6s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.1s', height: '25px', animationDuration: '0.8s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.2s', height: '35px', animationDuration: '0.5s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.3s', height: '20px', animationDuration: '0.7s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.4s', height: '30px', animationDuration: '0.6s' }}></div>
          <div className="visualizer-bar" style={{ animationDelay: '0.5s', height: '10px', animationDuration: '0.9s' }}></div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {/* --- STAGE 1: LOGIN --- */}
        {stage === AppStage.LOGIN && (
          <motion.div 
            key="login"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 flex items-center justify-center min-h-screen px-4"
          >
            <div className="liquid-card p-10 w-full max-w-sm">
              <div className="text-center mb-10">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 liquid-icon-container mx-auto flex items-center justify-center mb-6 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                >
                  <Heart fill="#db2777" className="text-pink-600 w-12 h-12 filter drop-shadow-lg saturate-150" />
                </motion.div>
                <h1 className="font-cairo text-3xl font-bold text-white mb-2 drop-shadow-md">Welcome Marwa</h1>
                <p className="text-pink-200/80 text-sm font-tajawal">سجلي الدخول لرؤية مفاجأتك</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-5">
                  <div className="relative group">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-500/70 group-focus-within:text-pink-400 transition-colors">
                      <User size={22} />
                    </div>
                    <input
                      type="text"
                      placeholder="اسم الأميرة (Marwa)"
                      className="liquid-input w-full pr-14 pl-6 py-5 text-right placeholder-gray-400 text-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-500/70 group-focus-within:text-pink-400 transition-colors">
                      <Lock size={22} />
                    </div>
                    <input
                      type="password"
                      placeholder="كلمة السر"
                      className="liquid-input w-full pr-14 pl-6 py-5 text-right placeholder-gray-400 text-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-300 text-sm text-center bg-red-500/20 py-3 rounded-xl border border-red-500/20"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="liquid-btn liquid-btn-primary w-full py-5 text-xl mt-4"
                >
                  فتح البوابة
                </motion.button>
              </form>

              {/* Admin Access Button */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                 <button 
                    onClick={() => setStage(AppStage.ADMIN)}
                    className="text-xs text-white/20 hover:text-white/80 transition-colors flex items-center gap-1.5"
                 >
                    <ShieldCheck size={12} />
                    <span>مسؤول النظام</span>
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- STAGE 2: COUNTDOWN --- */}
        {stage === AppStage.COUNTDOWN && (
          <motion.div 
            key="countdown"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center justify-center min-h-screen z-10 relative px-4"
          >
            <div className="liquid-card p-8 md:p-14 text-center w-full max-w-3xl border-white/20">
              <p className="text-2xl text-pink-200 mb-10 font-cairo drop-shadow-lg">المفاجأة تبدأ بعد...</p>
              
              <div className="grid grid-cols-4 gap-4 md:gap-6 font-mono text-white mb-8">
                  <div className="liquid-icon-container flex flex-col items-center p-4 justify-center aspect-square">
                      <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">00</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest">Days</span>
                  </div>
                  <div className="liquid-icon-container flex flex-col items-center p-4 justify-center aspect-square">
                      <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">00</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest">Hours</span>
                  </div>
                  <div className="liquid-icon-container flex flex-col items-center p-4 justify-center aspect-square">
                      <span className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">00</span>
                      <span className="text-[10px] text-gray-400 uppercase mt-2 tracking-widest">Mins</span>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="liquid-icon-container flex flex-col items-center p-4 justify-center aspect-square border-pink-500/30 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.15)]"
                  >
                      <span className="text-4xl md:text-6xl font-bold text-pink-300">
                        {countdown.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-pink-300 uppercase mt-2 tracking-widest">Secs</span>
                  </motion.div>
              </div>

              {/* Music Button for Countdown */}
              <MusicButton />
            </div>
          </motion.div>
        )}

        {/* --- STAGE 3: CELEBRATION --- */}
        {stage === AppStage.CELEBRATION && (
          <motion.div 
            key="celebration"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            className="min-h-screen pb-32"
          >
            <div className="max-w-4xl mx-auto px-4 pt-10">
              
              {/* Cake Section - Show only if we haven't transitioned to surprise message yet */}
              <motion.div 
                className={`transition-opacity duration-1000 ${showSurpriseMessage ? 'opacity-0 hidden' : 'opacity-100'}`}
              >
                <Cake isLit={candlesLit} onBlow={handleBlowCandles} />
                
                {/* Music Button for Cake Stage */}
                <div className="mt-12 flex justify-center">
                    <MusicButton />
                </div>
              </motion.div>

              {/* Content after candles are blown and delay has passed */}
              {showSurpriseMessage && (
                <div className="space-y-12">
                  
                  {/* 1. Big Envelope Message */}
                  <EnvelopeMessage onWhatsApp={handleWhatsappSend} />

                  {/* 2. Leave a Message Section (New) */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <LeaveMessage />
                  </motion.div>

                  {/* Music Button Under Message */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex justify-center mt-8 mb-4"
                  >
                      <MusicButton />
                  </motion.div>

                  {/* Footer with Apple Liquid Glass Frame */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-full flex justify-center mt-12 pb-10"
                  >
                    <div className="px-10 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_25px_rgba(236,72,153,0.15)] flex items-center justify-center transform hover:scale-105 transition-all duration-500">
                      <span className="text-pink-200/90 text-xs md:text-sm font-cairo font-semibold tracking-widest uppercase flex items-center gap-2">
                        <span className="text-lg">✨</span> Created by Ismail for Marwa <span className="text-lg">✨</span>
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;