import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, PenLine, User } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const LeaveMessage: React.FC = () => {
  const [sender, setSender] = useState('');
  const [text, setText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !sender.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const dateStr = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Add to Firestore collection "Me"
      // Fields required: Text (string), timestamp.
      // We also save sender and dateStr for the admin UI.
      await addDoc(collection(db, "Me"), {
        sender: sender.trim(),
        Text: text.trim(),
        timestamp: Date.now(),
        dateStr: dateStr
      });

      setIsSent(true);
      setText('');
      setSender('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSent(false), 5000);

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong while sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-16 px-4">
      <div className="liquid-card p-8 border-pink-200/10 bg-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <PenLine className="text-pink-300" size={24} />
          <h3 className="text-2xl font-amiri font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-purple-200">
            Leave a message
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 relative z-10"
            >
              <div className="relative group">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Your Name (اسمك)"
                  disabled={isSubmitting}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pr-12 text-right text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-black/30 transition-all font-tajawal disabled:opacity-50"
                />
              </div>

              <div className="relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write something for the future..."
                  disabled={isSubmitting}
                  className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-right text-gray-100 placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-black/30 transition-all resize-none font-tajawal leading-relaxed disabled:opacity-50"
                />
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(236, 72, 153, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={(!text.trim() || !sender.trim()) || isSubmitting}
                  className={`px-6 py-2 rounded-full border border-pink-500/30 text-pink-100 flex items-center gap-2 transition-all ${(!text.trim() || !sender.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:border-pink-500/60'}`}
                >
                  <span className="font-cairo text-sm">{isSubmitting ? 'Sending...' : 'Send'}</span>
                  <Send size={16} />
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h4 className="text-xl font-amiri font-bold text-green-100 mb-2">Message Received</h4>
              <p className="text-sm text-green-200/60 font-tajawal">Thank you for your words. They have been safely stored.</p>
              
              <button 
                onClick={() => setIsSent(false)}
                className="mt-6 text-xs text-pink-300/60 hover:text-pink-300 transition-colors underline decoration-pink-300/30 underline-offset-4"
              >
                Write another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background Decoration */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LeaveMessage;