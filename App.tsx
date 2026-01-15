import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Lock, User, Volume2, VolumeX, SkipForward, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// المسارات الصحيحة مباشرة
import HeartBackground from './HeartBackground';
import Cake from './Cake';
import EnvelopeMessage from './EnvelopeMessage';
import TouchTrail from './TouchTrail';
import LeaveMessage from './LeaveMessage';
import AdminInbox from './AdminInbox';
import { AppStage } from './types';

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

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LOGIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const cheerRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [candlesLit, setCandlesLit] = useState(true);
  const [showSurpriseMessage, setShowSurpriseMessage] = useState(false);
  const targetPhone = "212679107509";

  const handleNextSong = () => setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase().trim() === 'marwa' && password.toLowerCase().trim() === 'ismail') {
      setStage(AppStage.COUNTDOWN);
    } else {
      setError('معلومات الدخول غير صحيحة');
    }
  };

  useEffect(() => {
    if (stage === AppStage.COUNTDOWN && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === AppStage.COUNTDOWN && countdown === 0) {
      setStage(AppStage.CELEBRATION);
    }
  }, [stage, countdown]);

  const handleBlowCandles = () => {
    setCandlesLit(false);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShowSurpriseMessage(true), 1500);
  };

  if (stage === AppStage.ADMIN) return <AdminInbox onExit={() => setStage(AppStage.LOGIN)} />;

  return (
    <div className="min-h-screen relative bg-black text-white">
      <TouchTrail />
      <HeartBackground />
      <AnimatePresence mode="wait">
        {stage === AppStage.LOGIN && (
          <motion.div key="login" variants={pageVariants} initial="initial" animate="animate" className="flex items-center justify-center min-h-screen">
            <div className="bg-white/10 p-10 rounded-3xl text-center">
              <Heart className="text-pink-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Welcome Marwa</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="text" placeholder="Marwa" className="w-full p-3 bg-white/5 rounded" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="كلمة السر" className="w-full p-3 bg-white/5 rounded" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className="w-full py-3 bg-pink-600 rounded font-bold">دخول</button>
              </form>
            </div>
          </motion.div>
        )}
        {stage === AppStage.COUNTDOWN && (
          <motion.div key="count" className="flex items-center justify-center min-h-screen text-6xl font-bold text-pink-500">{countdown}</motion.div>
        )}
        {stage === AppStage.CELEBRATION && (
          <motion.div key="cel" className="p-10 text-center">
            {!showSurpriseMessage ? <Cake isLit={candlesLit} onBlow={handleBlowCandles} /> : <div className="space-y-10"><EnvelopeMessage onWhatsApp={() => {}} /><LeaveMessage /></div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default App;
