import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useSpring } from 'motion/react';
import { 
  Home as HomeIcon, 
  PlusSquare, 
  MessageCircle, 
  User, 
  MoreHorizontal,
  Settings,
  Clock,
  Layout as LayoutIcon,
  Keyboard,
  Camera,
  Moon,
  Sun,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Send,
  Search as SearchIcon,
  Play,
  Flag,
  RotateCcw,
  Bot,
  X,
  CheckCircle2,
  Loader2,
  UserPlus,
  ChevronRight,
  Plus,
  Sparkles,
  Phone,
  Mail,
  Pencil,
  Video,
  MapPin,
  Globe,
  ExternalLink,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Gemini Client Initialization
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
import { CATEGORIES, TIMEZONES, COLORS, ANIMATIONS } from './constants';

// --- Types ---
type Tab = 'home' | 'search' | 'shorts' | 'chat' | 'account';
type Theme = 'light' | 'dark';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  university: string;
  universityId: string;
  skill: string;
  avatar: string;
  theme: Theme;
  fontColor: string;
  animation: string;
  timezone: string;
}

// --- Components ---

const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-4 gap-4 p-4 h-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.img 
              key={i}
              src={`https://picsum.photos/seed/dance${i}/400/600`}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
              className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all"
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-9xl font-black text-white mb-2 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
          M
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-bold text-blue-500 tracking-[0.8em] uppercase ml-4"
        >
          moseb
        </motion.div>
        
        <div className="mt-12 flex gap-2">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-blue-600"
          />
          <motion.div 
            animate={{ 
              scale: [1.5, 1, 1.5],
              rotate: [360, 0],
              borderRadius: ["50%", "20%", "50%"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 bg-purple-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

const AI_BOTS = [
  { id: 'bot-eth', name: 'Ethiopian AI', username: 'ethiopian_bot', avatar: 'https://flagcdn.com/w320/et.png', lang: 'Amharic', prompt: 'You are an Ethiopian AI. You ONLY speak Amharic. Use Amharic script and emojis. Be very friendly and cultural.' },
  { id: 'bot-en', name: 'English AI', username: 'english_bot', avatar: 'https://flagcdn.com/w320/gb.png', lang: 'English', prompt: 'You are an English AI. You ONLY speak English. Use professional and friendly English.' },
  { id: 'bot-ru', name: 'Russian AI', username: 'russian_bot', avatar: 'https://flagcdn.com/w320/ru.png', lang: 'Russian', prompt: 'You are a Russian AI. You ONLY speak Russian. Use Cyrillic script.' },
  { id: 'bot-fr', name: 'French AI', username: 'french_bot', avatar: 'https://flagcdn.com/w320/fr.png', lang: 'French', prompt: 'You are a French AI. You ONLY speak French.' },
  { id: 'bot-ar', name: 'Arabic AI', username: 'arabic_bot', avatar: 'https://flagcdn.com/w320/sa.png', lang: 'Arabic', prompt: 'You are an Arabic AI. You ONLY speak Arabic. Use Arabic script.' },
];

const UploadModal = ({ isOpen, onClose, onPost, user, theme }: { isOpen: boolean, onClose: () => void, onPost: () => void, user: any, theme: Theme }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoUrl) return;
    setIsUploading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: 'video',
          content: videoUrl,
          description,
          category: 'Coding',
          tags: tags.split(',').map(t => t.trim().replace('#', '')),
          country,
          university,
          location
        })
      });
      if (res.ok) {
        onPost();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-2xl glass-dark rounded-[3rem] p-8 space-y-6 relative"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full"><X /></button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-blue-600 rounded-2xl">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Post Video</h2>
                <p className="text-sm opacity-60">Share your educational content with the world</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Video URL</label>
                <input 
                  placeholder="Paste video URL (YouTube/Vimeo/Direct)..." 
                  className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Description</label>
                <textarea 
                  placeholder="What is this video about?" 
                  className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Tags</label>
                  <input 
                    placeholder="#coding, #ai" 
                    className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Location</label>
                  <input 
                    placeholder="City, Place" 
                    className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">Country</label>
                  <input 
                    placeholder="Country Name" 
                    className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2">University</label>
                  <input 
                    placeholder="University Name" 
                    className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 focus:border-blue-500 outline-none transition-all"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleUpload}
                disabled={isUploading || !videoUrl}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? <Loader2 className="animate-spin" /> : <><Send className="w-5 h-5" /> Post Successfully</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InteractiveBackground = ({ theme, animation }: { theme: Theme, animation: string }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div 
        style={{ x: springX, y: springY }}
        className={`absolute inset-[-10%] opacity-30 blur-3xl transition-colors duration-1000 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black' 
            : 'bg-gradient-to-br from-blue-100 via-purple-100 to-white'
        }`}
      />
      {animation === 'cloud' && (
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clouds.png')] opacity-20 animate-pulse" />
      )}
      <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40' : 'bg-white/40'}`} />
    </div>
  );
};

const Post = ({ post, theme, user }: { post: any, theme: Theme, user: UserData, key?: React.Key }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');

  const handleInteraction = async (type: string) => {
    if (type === 'like') setLiked(!liked);
    await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, postId: post.id, type, comment: type === 'comment' ? comment : null })
    });
    if (type === 'comment') setComment('');
  };

  const openInApp = (url: string) => {
    // In a real app, this would use an in-app browser or modal
    window.location.href = url;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-6 rounded-3xl overflow-hidden hover-shadow-glow ${theme === 'dark' ? 'glass-dark' : 'glass'} border border-white/10`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold">
            {post.category?.[0]}
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.category}</h3>
            <div className="flex items-center gap-1 opacity-60 text-[10px]">
              <Globe className="w-3 h-3" />
              <span>{post.country || 'Global'} • {post.university || 'EduSocial'}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreHorizontal className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
        </button>
      </div>

      <div className="relative aspect-video bg-black/20">
        {post.type === 'image' || post.type === 'multi-image' ? (
          post.type === 'multi-image' ? (
            <ShortsImageCarousel images={JSON.parse(post.content)} />
          ) : (
            <img 
              src={post.content} 
              alt={post.description} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          post.content.includes('youtube.com') || post.content.includes('vimeo.com') ? (
            <iframe 
              src={post.content} 
              className="w-full h-full" 
              allowFullScreen 
              title="Video player"
            />
          ) : (
            <video 
              src={post.content} 
              controls 
              className="w-full h-full object-cover"
            />
          )
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => handleInteraction('like')} className={`flex items-center gap-1 transition-all ${liked ? 'text-red-500 scale-110' : ''}`}>
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className=""><MessageSquare className="w-6 h-6" /></button>
            <button onClick={() => handleInteraction('share')}><Share2 className="w-6 h-6" /></button>
            <button onClick={() => handleInteraction('repost')}><RotateCcw className="w-6 h-6" /></button>
          </div>
          {post.location && (
            <button 
              onClick={() => openInApp(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Map</span>
            </button>
          )}
        </div>
        <p className="text-sm mb-2">{post.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags && JSON.parse(post.tags).map((tag: string) => (
            <span key={tag} className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 bg-transparent border-b border-white/10 py-1 text-sm focus:outline-none"
          />
          {comment && <button onClick={() => handleInteraction('comment')} className="text-blue-500 font-semibold text-sm">Post</button>}
        </div>
      </div>
    </motion.div>
  );
};

const ShortsImageCarousel = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img 
          key={index}
          src={images[index]}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${index === i ? 'bg-white w-4' : 'bg-white/30'}`}
          />
        ))}
      </div>
      <button 
        onClick={() => setIndex((index + 1) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 backdrop-blur-md rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

const ShortsFeed = ({ theme, user }: { theme: Theme, user: UserData }) => {
  const [shorts, setShorts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/posts?type=short').then(res => res.json()).then(setShorts);
  }, []);

  if (shorts.length === 0) return <div className="flex items-center justify-center h-full">Loading Shorts...</div>;

  return (
    <div className="h-[calc(100vh-120px)] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {shorts.map((short, idx) => (
        <div key={short.id} className="h-full w-full snap-start relative bg-black">
          {short.type === 'multi-image' ? (
            <ShortsImageCarousel images={JSON.parse(short.content)} />
          ) : short.type === 'image' ? (
            <img 
              src={short.content} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <iframe 
              src={`${short.content}?autoplay=1&mute=0&controls=0&loop=1`} 
              className="w-full h-full object-cover" 
              allow="autoplay"
            />
          )}
          <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full"><Heart className="w-8 h-8 text-white" /></div>
              <span className="text-xs font-bold">Like</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full"><MessageSquare className="w-8 h-8 text-white" /></div>
              <span className="text-xs font-bold">Comment</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-full"><Share2 className="w-8 h-8 text-white" /></div>
              <span className="text-xs font-bold">Share</span>
            </button>
          </div>
          <div className="absolute left-4 bottom-24 max-w-[70%]">
            <h3 className="font-bold text-lg">@EduSocial_Shorts</h3>
            <p className="text-sm opacity-80">{short.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatSection = ({ user, theme, onSelectBot }: { user: UserData, theme: Theme, onSelectBot: (bot: any) => void }) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', username: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [user.id]);

  const fetchContacts = async () => {
    const res = await fetch(`/api/contacts/${user.id}`);
    const data = await res.json();
    setContacts(data);
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newContact, userId: user.id })
    });
    setNewContact({ name: '', username: '', email: '', phone: '' });
    setShowAdd(false);
    fetchContacts();
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
        >
          <UserPlus className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddContact} className="glass p-6 rounded-[2.5rem] space-y-4 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Add New Contact</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input required placeholder="e.g. John Doe" className="w-full bg-white/5 p-3 pl-10 rounded-xl border border-white/10 focus:border-blue-500 outline-none text-sm" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 ml-2">Username</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input required placeholder="e.g. johndoe" className="w-full bg-white/5 p-3 pl-10 rounded-xl border border-white/10 focus:border-blue-500 outline-none text-sm" value={newContact.username} onChange={e => setNewContact({...newContact, username: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 ml-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input required type="email" placeholder="email@example.com" className="w-full bg-white/5 p-3 pl-10 rounded-xl border border-white/10 focus:border-blue-500 outline-none text-sm" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold opacity-40 ml-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input required placeholder="+1 234 567 890" className="w-full bg-white/5 p-3 pl-10 rounded-xl border border-white/10 focus:border-blue-500 outline-none text-sm" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
                  </div>
                </div>
              </div>
              <button disabled={loading} className="w-full py-4 bg-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <><Plus className="w-5 h-5" /> Add Person</>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* AI Bots Section */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-4">AI Language Assistants</p>
          {AI_BOTS.map((bot) => (
            <motion.div 
              key={bot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectBot(bot);
              }}
              className="flex items-center gap-4 p-4 glass rounded-[2rem] border border-blue-500/10 hover:border-blue-500/30 cursor-pointer group transition-all"
            >
              <div className="relative">
                <img src={bot.avatar} className="w-14 h-14 rounded-full border-2 border-blue-500/20 object-cover" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-black">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold group-hover:text-blue-400 transition-colors">{bot.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 rounded-full text-blue-400 font-bold uppercase">{bot.lang}</span>
                </div>
                <p className="text-xs opacity-60">AI Assistant • Online</p>
              </div>
              <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-4">Recent Conversations</p>
        {contacts.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <p>No contacts yet. Add someone to start chatting!</p>
          </div>
        ) : (
          contacts.map((contact, i) => (
            <motion.div 
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 glass rounded-[2rem] hover:bg-white/10 cursor-pointer group transition-all"
            >
              <div className="relative">
                <img src={contact.avatar} className="w-14 h-14 rounded-full border-2 border-blue-500/20 p-0.5" referrerPolicy="no-referrer" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold group-hover:text-blue-400 transition-colors">{contact.name}</h4>
                <p className="text-xs opacity-60">@{contact.username}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2 bg-blue-500/10 rounded-full hover:bg-blue-500/20 text-blue-500"><Phone className="w-4 h-4" /></button>
                <button className="p-2 bg-purple-500/10 rounded-full hover:bg-purple-500/20 text-purple-500"><Video className="w-4 h-4" /></button>
              </div>
              <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

const SignupForm = ({ onSignup, onSkip }: { onSignup: (user: UserData) => void, onSkip: () => void }) => {
  const [form, setForm] = useState({
    name: '', username: '', email: '', phone: '', country: '', university: '', universityId: '', skill: '', avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Client-side Gemini Face Validation
      if (form.avatar) {
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            { text: "Is there a clear human face in this image? Answer only 'yes' or 'no'." },
            { inlineData: { mimeType: "image/jpeg", data: form.avatar.split(',')[1] } }
          ]
        });
        if (!result.text.toLowerCase().includes('yes')) {
          setError("Please upload a clear photo of yourself (human face required).");
          setLoading(false);
          return;
        }
      }

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) onSignup(data);
      else setError(data.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 overflow-hidden relative">
      {/* Cinematic Backlight */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cinematic-bg top-1/2 left-1/2" />
        {/* Bright White Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/10 blur-[120px] rounded-full" />
        {/* Animated Red and Black Cinematic Lights */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [-100, 100, -100],
            y: [-50, 50, -50]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [100, -100, 100],
            y: [50, -50, 50]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-black blur-[150px] rounded-full" 
        />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark p-8 rounded-[2.5rem] w-full max-w-md border border-white/10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Join EduSocial</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <Camera className="w-8 h-8 opacity-40" />}
              </div>
              <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
            </label>
          </div>
          <input required placeholder="Full Name" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Username" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, username: e.target.value})} />
          <input required type="email" placeholder="Email" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, email: e.target.value})} />
          <input required placeholder="Phone Number" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, phone: e.target.value})} />
          <input required placeholder="Country" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, country: e.target.value})} />
          <input required placeholder="University" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, university: e.target.value})} />
          <input required placeholder="University ID" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, universityId: e.target.value})} />
          <input required placeholder="Primary Skill" className="w-full bg-white/5 p-3 rounded-xl border border-white/10" onChange={e => setForm({...form, skill: e.target.value})} />
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <button disabled={loading} className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
          
          <button 
            type="button"
            onClick={onSkip}
            className="w-full py-3 bg-white/5 rounded-2xl font-medium hover:bg-white/10 transition-all text-white/60 text-sm"
          >
            Skip for now
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [theme, setTheme] = useState<Theme>('dark');
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'accounts' | 'photos' | 'internet'>('accounts');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showBot, setShowBot] = useState(false);
  const [botMessages, setBotMessages] = useState<{role: string, text: string, time: string}[]>([]);
  const [botInput, setBotInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, activeCategory]);

  const fetchPosts = async () => {
    const cat = activeCategory === 'all' ? '' : activeCategory;
    const res = await fetch(`/api/posts?category=${cat}`);
    const data = await res.json();
    setPosts(data);
  };

  const openInApp = (url: string) => {
    if (!url) return;
    window.location.href = url;
  };

  const handleSearch = async (q: string, modeOverride?: any) => {
    const mode = modeOverride || searchMode;
    setSearchQuery(q);
    if (q.length > 2) {
      if (mode === 'internet') {
        // Use Gemini Search Grounding for "Internet" mode
        try {
          const result = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: `Search for ${q}. Provide a very concise summary (one short sentence) and exactly 4 relevant high-quality image URLs if possible. Format the images as a list of URLs.` }] }],
            config: {
              tools: [{ googleSearch: {} }]
            }
          });
          
          setSearchResults([{
            id: 'web-1',
            type: 'web',
            text: result.text,
            sources: result.candidates?.[0]?.groundingMetadata?.groundingChunks || []
          }]);
        } catch (e) {
          console.error(e);
        }
      } else {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, mode })
        });
        const data = await res.json();
        setSearchResults(data.results);
      }
      
      // Client-side Gemini Recommendations
      try {
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Give 3 short educational search recommendations (just the phrases, one per line) for: ${q}`
        });
        const recs = result.text.split('\n').filter(l => l.trim()).slice(0, 3);
        setRecommendations(recs);
      } catch (e) {
        console.error("Gemini rec error", e);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleBotChat = async () => {
    if (!botInput) return;
    const msg = botInput;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setBotInput('');
    setBotMessages(prev => [...prev, { role: 'user', text: msg, time }]);
    setIsBotTyping(true);
    
    try {
      const botPrompt = selectedBot ? selectedBot.prompt : `You are Moseb AI, a helpful, humanized 3D dancing robot assistant for EduSocial. 
        Always use emojis relevant to the topic. 
        Be friendly and encouraging.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `${botPrompt} Help the user with: ${msg}` }] }]
      });
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setBotMessages(prev => [...prev, { role: 'bot', text: result.text, time: botTime }]);
    } catch (error: any) {
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setBotMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble thinking right now. 🤖", time: botTime }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const updateProfile = async (updates: Partial<UserData>) => {
    if (!user) return;
    const newUser = { ...user, ...updates };
    setUser(newUser);
    await fetch(`/api/user/${user.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > lastScrollY && latest > 100) setShowNav(false);
      else setShowNav(true);
      setLastScrollY(latest);
    });
  }, [scrollY, lastScrollY]);

  const handleSkip = () => {
    setUser({
      id: 'guest-' + Math.random().toString(36).substr(2, 5),
      name: 'Guest Explorer',
      username: 'guest',
      email: '',
      phone: '',
      country: 'Global',
      university: 'EduSocial Open Campus',
      universityId: 'GUEST',
      skill: 'Learning',
      avatar: 'https://picsum.photos/seed/guest/200/200',
      theme: 'dark',
      fontColor: '#ffffff',
      animation: 'none',
      timezone: 'UTC'
    });
  };

  if (appLoading) return <LoadingScreen />;
  if (!user) return <SignupForm onSignup={setUser} onSkip={handleSkip} />;

  const animationClass = user.animation === 'fire' ? 'anim-fire' : user.animation === 'water' ? 'anim-water' : user.animation === 'cloud' ? 'anim-cloud' : '';

  return (
    <div className={`min-h-screen font-sans selection:bg-blue-500/30 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} ${animationClass}`} style={{ color: user.fontColor }}>
      <InteractiveBackground theme={theme} animation={user.animation} />

      <main className={`pb-20 pt-4 px-4 max-w-2xl mx-auto ${user.animation === 'hover' ? 'hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]' : ''}`}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 mb-6 sticky top-0 z-10">
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl transition-all ${activeCategory === cat.name ? 'bg-blue-600' : theme === 'dark' ? 'glass hover:bg-white/20' : 'bg-gray-100'}`}
                  >
                    <cat.icon className="w-6 h-6 icon-3d" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{cat.name}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                {posts.map((post) => <Post key={post.id} post={post} theme={theme} user={user} />)}
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                {(['accounts', 'photos', 'internet'] as const).map(mode => (
                  <button 
                    key={mode}
                    onClick={() => {
                      setSearchMode(mode);
                      if (searchQuery) handleSearch(searchQuery, mode);
                    }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${searchMode === mode ? 'bg-blue-600 text-white' : 'hover:bg-white/5 opacity-60'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                <input 
                  autoFocus
                  placeholder={searchMode === 'accounts' ? "Search users..." : searchMode === 'photos' ? "Search #hashtags or descriptions..." : "Search the internet with AI..."} 
                  className="w-full bg-white/5 p-4 pl-12 rounded-2xl border border-white/10 focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
              {recommendations.length > 0 && (
                <div className="p-4 glass rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">AI Suggestions</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.map((rec, i) => (
                      <button key={i} onClick={() => handleSearch(rec)} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-all">{rec}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {searchResults.map(res => (
                  res.type === 'web' ? (
                    <div key={res.id} className="p-6 glass rounded-[2rem] space-y-4">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Web Result</span>
                      </div>
                      <p className="text-sm leading-relaxed opacity-80">{res.text}</p>
                      
                      {/* Extract and display image links from result text if any */}
                      {res.text.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi) && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          {res.text.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif)/gi).slice(0, 4).map((img: string, i: number) => (
                            <img key={i} src={img} className="w-full aspect-square object-cover rounded-xl border border-white/10" referrerPolicy="no-referrer" />
                          ))}
                        </div>
                      )}

                      {res.sources && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-[10px] font-bold uppercase opacity-40 mb-2">Sources</p>
                          <div className="flex flex-wrap gap-2">
                            {res.sources.map((src: any, i: number) => (
                              <button key={i} onClick={() => openInApp(src.web?.uri)} className="flex items-center gap-1 text-[10px] text-blue-400 hover:underline">
                                <ExternalLink className="w-3 h-3" /> {src.web?.title || 'Source'}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : res.type === 'image' || res.type === 'multi-image' ? (
                    <Post key={res.id} post={res} theme={theme} user={user} />
                  ) : (
                    <div key={res.id} className="flex items-center gap-4 p-4 glass rounded-2xl group hover:bg-white/5 transition-all">
                      <img src={res.avatar} className="w-12 h-12 rounded-full border-2 border-blue-500/20" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold">{res.name}</h4>
                        <p className="text-xs opacity-60">@{res.username} • {res.university}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-all" />
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'shorts' && <ShortsFeed theme={theme} user={user} />}

          {activeTab === 'chat' && <ChatSection user={user} theme={theme} onSelectBot={(bot) => {
            setSelectedBot(bot);
            setShowBot(true);
          }} />}

          {activeTab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-xl">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">EduSocial Pro</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Powered by Gemini API</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-white/10">
                    {theme === 'dark' ? <Sun /> : <Moon />}
                  </button>
                  <div className="relative group">
                    <button className="p-2 rounded-full hover:bg-white/10"><MoreHorizontal /></button>
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50 ${theme === 'dark' ? 'glass-dark' : 'bg-white shadow-xl border border-gray-100'}`}>
                      <div className="p-2 border-b border-white/10 mb-2">
                        <h4 className="text-[10px] font-bold uppercase opacity-40">Time Settings</h4>
                        <div className="grid grid-cols-2 gap-1 mt-2 max-h-40 overflow-y-auto no-scrollbar">
                          {TIMEZONES.map(tz => (
                            <button key={tz.zone} onClick={() => updateProfile({ timezone: tz.zone })} className={`text-[10px] p-1 rounded hover:bg-white/10 truncate ${user.timezone === tz.zone ? 'text-blue-500' : ''}`}>{tz.name}</button>
                          ))}
                        </div>
                      </div>
                      <div className="p-2 border-b border-white/10 mb-2">
                        <h4 className="text-[10px] font-bold uppercase opacity-40">Keyboard & Font</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {COLORS.map(c => <button key={c} onClick={() => updateProfile({ fontColor: c })} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />)}
                        </div>
                        <div className="mt-3 space-y-1">
                          {ANIMATIONS.map(a => <button key={a.id} onClick={() => updateProfile({ animation: a.id })} className={`w-full text-left text-[10px] p-1 rounded hover:bg-white/10 ${user.animation === a.id ? 'text-blue-500' : ''}`}>{a.name}</button>)}
                        </div>
                      </div>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-sm"><LayoutIcon className="w-4 h-4" /> Post Story</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-[2.5rem] mb-8 text-center relative overflow-hidden group">
                <div className="relative inline-block mb-6">
                  <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-blue-500/30 p-1" referrerPolicy="no-referrer" />
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    className="absolute bottom-0 right-0 p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full text-white shadow-xl border-2 border-white/20"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                </div>
                <h3 className="text-2xl font-bold mb-1">{user.name}</h3>
                <p className="text-blue-500 font-medium mb-6">@{user.username}</p>
                
                <div className="grid grid-cols-2 gap-4 text-left mb-6">
                  <div className="p-4 glass rounded-2xl">
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Skill</p>
                    <p className="text-sm font-medium">{user.skill}</p>
                  </div>
                  <div className="p-4 glass rounded-2xl">
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">University</p>
                    <p className="text-sm font-medium truncate">{user.university}</p>
                  </div>
                  <div className="p-4 glass rounded-2xl">
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Phone</p>
                    <p className="text-sm font-medium">{user.phone || 'Not set'}</p>
                  </div>
                  <div className="p-4 glass rounded-2xl">
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Country</p>
                    <p className="text-sm font-medium">{user.country}</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-8">
                  <button className="flex flex-col items-center gap-2 p-4 glass rounded-3xl hover:bg-blue-500/10 transition-all group">
                    <Phone className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Call</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 glass rounded-3xl hover:bg-purple-500/10 transition-all group">
                    <Video className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Video</span>
                  </button>
                </div>
                
                {/* Moseb AI Trigger */}
                <button onClick={() => setShowBot(true)} className="flex items-center gap-3 px-8 py-4 bg-blue-600 rounded-full hover:bg-blue-700 mx-auto transition-all group shadow-lg shadow-blue-500/20">
                  <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Bot className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="font-bold text-white">Chat with Moseb AI</span>
                </button>
              </div>

              {/* Video Upload Section */}
              <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <PlusSquare className="w-6 h-6 text-blue-500" />
                  <h3 className="text-xl font-bold">Post New Video</h3>
                </div>
                <div className="space-y-4">
                  <div className="w-full h-40 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer">
                    <Video className="w-8 h-8 opacity-40" />
                    <p className="text-xs font-bold opacity-40 uppercase tracking-widest">Upload Video File</p>
                  </div>
                  <input placeholder="Content Description..." className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Tags (e.g. #cs, #edu)" className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
                    <input placeholder="Section (e.g. Coding)" className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Country" className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
                    <input placeholder="University" className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 outline-none focus:border-blue-500" />
                  </div>
                  <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Post Video</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <UploadModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
        onPost={fetchPosts}
        user={user}
        theme={theme}
      />

      {/* Moseb AI Modal */}
      <AnimatePresence>
        {showBot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="glass-dark w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh]">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600/20 to-purple-600/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-xl">
                    {selectedBot ? <img src={selectedBot.avatar} className="w-6 h-6 rounded-full" /> : <Bot className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedBot ? selectedBot.name : 'Moseb AI'}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Active Now</p>
                  </div>
                </div>
                <button onClick={() => { setShowBot(false); setSelectedBot(null); }} className="p-2 hover:bg-white/10 rounded-full transition-all"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <div className="flex justify-center mb-4">
                  <div className="px-4 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-40">Today</div>
                </div>
                {botMessages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/10 border border-white/5'}`}>
                      <p className="text-sm leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[8px] font-bold uppercase opacity-30 mt-1 px-2">{m.time}</span>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex flex-col items-start">
                    <div className="bg-white/10 p-4 rounded-2xl flex gap-1 border border-white/5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-white/10 flex gap-2 bg-black/20">
                <input 
                  placeholder="Ask Moseb anything..." 
                  className="flex-1 bg-white/5 p-4 rounded-2xl focus:outline-none focus:ring-2 ring-blue-500/20 transition-all"
                  value={botInput}
                  onChange={e => setBotInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleBotChat()}
                />
                <button onClick={handleBotChat} className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"><Send className="w-5 h-5" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.nav 
        animate={{ y: showNav ? 0 : 100 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md"
      >
        <div className={`flex items-center justify-around p-2 rounded-[2rem] shadow-2xl ${theme === 'dark' ? 'glass-dark' : 'bg-white/80 backdrop-blur-xl border border-gray-200'}`}>
          <NavButton icon={HomeIcon} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} theme={theme} />
          <NavButton icon={SearchIcon} label="Search" active={activeTab === 'search'} onClick={() => setActiveTab('search')} theme={theme} />
          
          <button 
            onClick={() => setShowUpload(true)}
            className="p-4 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/30 hover:scale-110 active:scale-95 transition-all -translate-y-4 border-4 border-black"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>

          <NavButton icon={Play} label="Shorts" active={activeTab === 'shorts'} onClick={() => setActiveTab('shorts')} theme={theme} />
          <NavButton icon={MessageCircle} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} theme={theme} />
          <NavButton icon={User} label="Account" active={activeTab === 'account'} onClick={() => setActiveTab('account')} theme={theme} />
        </div>
      </motion.nav>
    </div>
  );
}

const NavButton = ({ icon: Icon, label, active, onClick, theme }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center p-2 group"
    >
      <Icon className={`w-6 h-6 transition-all duration-300 icon-3d ${active ? 'text-blue-500 scale-110' : theme === 'dark' ? 'text-white/60' : 'text-gray-400'}`} />
      <AnimatePresence>
        {isHovered && (
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={`absolute -top-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && <motion.div layoutId="activeTab" className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-full" />}
    </button>
  );
};
