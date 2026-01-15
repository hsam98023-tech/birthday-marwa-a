import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Lock, User, Volume2, VolumeX, SkipForward, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// تم تصحيح المسارات هنا لتناسب ترتيب ملفاتك في GitHub
import HeartBackground from './HeartBackground';
import Cake from './Cake';
import EnvelopeMessage from './EnvelopeMessage';
import TouchTrail from './TouchTrail';
import LeaveMessage from './LeaveMessage';
import AdminInbox from './AdminInbox';
import { AppStage } from './types';

// Playlist Logic
const PLAYLIST = [
  "https://cdn.pixabay.com/audio/2022/02/07/audio_1204066601.mp3?filename=piano-moment-113552.mp3",
  "https://cdn.pixabay.com/audio/2022/10/05/audio_6861212c75.mp3?filename=best-time-112194.mp3"
];

const CHEER_SOUND = "https://cdn.pixabay.com/audio/2021/08/04/audio_12b2c6a056.mp3?filename=people-cheering-8798.mp3"; 

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const cheerRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [candlesLit, setCandlesLit] = useState(true);
  const [showSurpriseMessage, setShowSurpriseMessage] = useState(false);
  
  const targetPhone = "212679107509";

  const handleSongEnd = () => {
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length;
    setCurrentSongIndex(nextIndex);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
        const currentSrc = audioRef.current.src;
        const targetSrc = PLAYLIST[currentSongIndex];
        if (!currentSrc.includes(targetSrc.split('?')[0])) {
            audioRef.current.src = targetSrc;
            audioRef.current.play().catch(e => console.error(e));
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
      }).catch(err => console.error(err));
    }
  };

  const attemptPlay = () => {
    if (audioRef.current) {
        if (!audioRef.current.src || !audioRef.current.src.includes(PLAYLIST[currentSongIndex].split('?')[0])) {
             audioRef.current.src = PLAYLIST[currentSongIndex];
        }
        audioRef.current.play().then(() => {
              setIsPlaying(true);
              setIsMuted(false);
        }).catch(e => console.log(e));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.toLowerCase().trim();
    const cleanUser = username.toLowerCase().trim();
    if (cleanUser === 'marwa' && cleanPassword === 'ismail') {
      attemptPlay();
      setStage(AppStage.COUNTDOWN);
      setError('');
    } else {
      setError('معلومات الدخول غير صحيحة، حاولي مرة أخرى يا جميلتي');
    }
  };

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

  const handleBlowCandles = () => {
    setCandlesLit(false);
    if (cheerRef.current) {
      cheerRef.current.volume = 0.6;
      cheerRef.current.play().catch(e => console.log(e));
    }
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShowSurpriseMessage(true), 1500);
  };

  const handleWhatsappSend = (msg: string) => {
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg || "عيد ميلاد سعيد! 💗")}`;
    window.open(url, '_blank');
  };

  const MusicButton = () => (
    <div className="flex flex-col items-center gap-4">
        <button onClick={toggleAudio} className="px-6 py-3 rounded-full bg-pink-600 text-white flex items-center gap-3">
            {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>{isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}</span>
        </button>
        <button onClick={handleNextSong} className="text-xs text-pink-300">تغيير الأغنية</button>
    </div>
  );

  if (stage === AppStage.ADMIN) return <AdminInbox onExit={() => setStage(AppStage.LOGIN)} />;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black">
      <TouchTrail />
      <HeartBackground />
      <audio ref={audioRef} onEnded={handleSongEnd} />
      <audio ref={cheerRef} src={CHEER_SOUND} />

      <AnimatePresence mode="wait">
        {stage === AppStage.LOGIN && (
          <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl w-full max-w-sm text-center">
              <Heart className="text-pink-600 w-12 h-12 mx-auto mb-6" fill="currentColor" />
              <h1 className="text-2xl font-bold mb-6">Welcome Marwa</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Marwa" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-right" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="كلمة السر" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-right" value={password} onChange={e => setPassword(e.target.value)} />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button type="submit" className="w-full py-4 bg-pink-600 rounded-xl font-bold">فتح البوابة</button>
              </form>
              <button onClick={() => setStage(AppStage.ADMIN)} className="mt-6 text-xs opacity-20">مسؤول النظام</button>
            </div>
          </motion.div>
        )}

        {stage === AppStage.COUNTDOWN && (
          <motion.div key="countdown" variants={pageVariants} initial="initial" animate="animate" className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-4xl font-bold mb-8 text-pink-500">{countdown}</h2>
            <MusicButton />
          </motion.div>
        )}

        {stage === AppStage.CELEBRATION && (
          <motion.div key="celebration" variants={pageVariants} initial="initial" animate="animate" className="pt-10 px-4">
            {!showSurpriseMessage ? (
              <div className="text-center">
                <Cake isLit={candlesLit} onBlow={handleBlowCandles} />
                <div className="mt-10"><MusicButton /></div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-10">
                <EnvelopeMessage onWhatsApp={handleWhatsappSend} />
                <LeaveMessage />
                <div className="pb-10"><MusicButton /></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
