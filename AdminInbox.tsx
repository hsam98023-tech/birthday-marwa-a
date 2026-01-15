import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, MessageSquare, ArrowLeft, Calendar, User, Lock, LogIn } from 'lucide-react';
import { Message } from '../types';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface AdminInboxProps {
  onExit: () => void;
}

const AdminInbox: React.FC<AdminInboxProps> = ({ onExit }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Messages State
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Only fetch if authenticated (or trigger fetch after login)
    if (isAuthenticated) {
        fetchMessages();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
        // Query "Me" collection, ordered by timestamp descending (latest first)
        const q = query(collection(db, "Me"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedMessages: Message[] = querySnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
                id: docSnapshot.id,
                sender: data.sender || 'Anonymous',
                // Map the Firestore field 'Text' to our local type 'text'
                text: data.Text || '', 
                timestamp: data.timestamp,
                dateStr: data.dateStr || new Date(data.timestamp).toLocaleDateString()
            };
        });
        setMessages(fetchedMessages);
    } catch (error) {
        console.error("Error fetching messages: ", error);
        alert("Failed to load messages from database.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authUsername === '1234' && authPassword === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Access Denied: Invalid Credentials');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "Me", id));
        // Remove from local state to update UI instantly
        setMessages(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete message.");
      }
    }
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-tajawal">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md backdrop-blur-xl shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center border border-pink-500/20">
              <Lock className="text-pink-400" size={32} />
            </div>
          </div>
          <h2 className="text-2xl text-center text-white font-bold mb-6">Admin Access</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500/50"
                  placeholder="Enter username"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-pink-500/50"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {authError && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded">
                {authError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <LogIn size={18} />
              Login
            </button>
            
            <button 
              type="button"
              onClick={onExit}
              className="w-full text-gray-500 text-sm hover:text-white transition-colors py-2"
            >
              Return to Site
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- MESSAGES DASHBOARD ---
  return (
    <div className="min-h-screen bg-gray-900/90 text-white p-6 md:p-10 font-tajawal">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onExit}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="text-pink-400" />
              Messages Dashboard
            </h1>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-black/30 px-3 py-1 rounded-full">
            {isLoading ? 'Loading...' : `${messages.length} messages`}
          </div>
        </div>

        {isLoading ? (
             <div className="flex justify-center py-20">
                 <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <MessageSquare size={48} className="mb-4 text-gray-500" />
            <p>No messages found in database.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <User size={16} className="text-pink-400" />
                           <span className="font-bold text-lg text-pink-100">{msg.sender || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono ml-6">
                           <Calendar size={12} />
                           {msg.dateStr}
                        </div>
                     </div>
                     
                     <button 
                       onClick={() => handleDelete(msg.id)}
                       className="text-gray-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                       title="Delete"
                     >
                        <Trash2 size={18} />
                     </button>
                  </div>
                  
                  <div className="pl-6 border-l-2 border-white/10 ml-1">
                    <p className="text-gray-200 whitespace-pre-line text-lg leading-relaxed font-light">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInbox;