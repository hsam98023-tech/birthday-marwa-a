import React, { useState } from 'react';
import TypewriterText from './TypewriterText';
import { MailOpen, Send, MessageCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  onWhatsApp: (msg: string) => void;
}

const MESSAGE_CONTENT = `Happy Birthday, Marwa.

I hope this new year of your life brings you peace, good health, and moments that make you genuinely smile.
May you find balance in your days, strength in your challenges, and comfort in the people and things that truly matter to you.
I wish you success in everything you’re working toward, clarity in your choices, and calmness whenever life feels heavy.
May your efforts be rewarded, your heart stay light, and your path become clearer with every step you take.
Thank you for the moments that were shared, and I truly hope the days ahead treat you kindly.

Wishing you a year filled with growth, stability, and quiet happiness.`;

const WISHES = [
  "ستكون سنة مليئة بالنجاح لمروى 🌟",
  "أيامك القادمة أجمل مما تتخيلين 💜",
  "السعادة سترافق خطواتك دائماً ✨",
  "كل أحلامك ستتحقق يا جميلة 🌸",
  "ضحكتك ستنير العالم هذا العام 😊",
  "سنة مليئة بالإنجازات العظيمة 🚀",
  "راحة البال ستكون رفيقتك الدائمة 🧘‍♀️"
];

const EnvelopeMessage: React.FC<EnvelopeProps> = ({ onWhatsApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState('');
  const [dailyWish, setDailyWish] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  const handleRevealWish = () => {
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    setDailyWish(randomWish);
    
    // Confetti burst for the wish
    confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#fbbf24']
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto my-12 px-4 perspective-1000"
    >
      {!isOpen ? (
        <motion.button 
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(236, 72, 153, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.2 } 
          }}
          className="liquid-card w-full aspect-video flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group bg-white/5 border-white/20"
        >
          {/* Liquid Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-50"></div>
          
          <motion.div 
            className="p-8 rounded-full bg-pink-500/20 backdrop-blur-md mb-6 shadow-[0_0_40px_rgba(236,72,153,0.3)] border border-pink-500/30"
            whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
          >
             <MailOpen size={64} className="text-pink-400 z-20 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] saturate-150" />
          </motion.div>
          
          <span className="text-3xl font-amiri font-bold text-white z-20 drop-shadow-md">رسالة لـ Marwa</span>
          <span className="text-sm text-pink-200/70 mt-3 z-20 font-tajawal tracking-wider">اضغطي لفتح الرسالة 💌</span>
        </motion.button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="liquid-card p-8 md:p-12 relative border-pink-200/20 bg-pink-900/10"
        >
          <div className="absolute -top-6 -right-6 text-6xl opacity-50 filter blur-[1px] animate-pulse">🌸</div>
          <div className="absolute -bottom-6 -left-6 text-6xl opacity-50 filter blur-[1px] animate-pulse delay-700">🦋</div>
          
          <div className="prose prose-lg max-w-none text-center relative z-10">
             <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200 font-amiri mb-10 drop-shadow-sm">
               Happy Birthday Marwa
             </h2>
             <div className="text-xl md:text-2xl leading-relaxed font-tajawal text-gray-100 font-medium whitespace-pre-line drop-shadow-md">
               <TypewriterText 
                  text={MESSAGE_CONTENT} 
                  speed={25} 
                  startDelay={300} 
                  onComplete={() => setShowSignature(true)}
               />
             </div>
          </div>

          {/* Animated Signature */}
          {showSignature && (
            <div className="mt-8 flex justify-end px-10">
               <div className="relative w-40 h-20">
                 <svg viewBox="0 0 200 100" className="w-full h-full">
                    <motion.path
                        d="M20,60 C40,40 60,80 80,60 C90,50 90,30 80,30 C70,30 70,70 90,70 C110,70 120,40 140,50 C150,55 150,65 140,65 C130,65 160,60 180,50" 
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />
                    <motion.text
                        x="100"
                        y="85"
                        fill="#ec4899"
                        fontSize="14"
                        fontFamily="cursive"
                        textAnchor="middle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ delay: 2, duration: 1 }}
                    >
                        Ismail
                    </motion.text>
                 </svg>
               </div>
            </div>
          )}

          {/* Wish of the Day Section */}
          <div className="mt-4 py-8 border-t border-b border-white/10 flex flex-col items-center">
             {!dailyWish ? (
                <motion.button 
                  onClick={handleRevealWish}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(147, 51, 234, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="liquid-btn px-8 py-3 bg-purple-600/20 border-purple-500/30 text-purple-100 flex items-center gap-3 transition-all"
                >
                    <Sparkles size={20} className="text-yellow-300 animate-spin-slow" />
                    <span className="font-cairo font-bold">افتحي أمنية اليوم</span>
                </motion.button>
             ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                    <p className="text-sm text-purple-300 mb-2 font-tajawal">✨ أمنيتك لهذا العام ✨</p>
                    <p className="text-2xl md:text-3xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 drop-shadow-lg">
                        {dailyWish}
                    </p>
                </motion.div>
             )}
          </div>

          <div className="mt-10 pt-4">
             <h3 className="text-center text-pink-300 font-cairo mb-6 text-lg tracking-wide">أرسلي ردك الآن</h3>
             <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 relative group">
                    <input 
                        type="text" 
                        placeholder="اكتبي رسالتك لـ Ismail..." 
                        className="liquid-input w-full p-5 pl-14 text-right text-lg bg-black/30 border-white/10 transition-all focus:border-pink-500/50"
                        value={whatsappMsg}
                        onChange={(e) => setWhatsappMsg(e.target.value)}
                    />
                    <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400/80 group-focus-within:text-pink-500 transition-colors drop-shadow-sm" size={24} />
                </div>
                <motion.button 
                    onClick={() => onWhatsApp(whatsappMsg)}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(22, 163, 74, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    className="liquid-btn bg-green-600/20 border-green-500/30 text-green-100 px-10 py-5 font-bold text-lg flex items-center justify-center gap-3 group"
                >
                    <span>إرسال للواتساب</span>
                    <Send size={24} className="text-green-400 group-hover:text-green-300 transition-colors saturate-150" />
                </motion.button>
             </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnvelopeMessage;