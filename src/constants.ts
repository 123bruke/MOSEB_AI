import { 
  Home, 
  PlusSquare, 
  MessageCircle, 
  User, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  FlaskConical, 
  Globe, 
  Cpu, 
  Palette, 
  Music,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Settings,
  Clock,
  Layout,
  Keyboard,
  Camera,
  Moon,
  Sun,
  Search,
  Play,
  Flag,
  RotateCcw,
  Bot
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'cs', name: 'Computer Science', icon: Cpu },
  { id: 'med', name: 'Medicine', icon: FlaskConical },
  { id: 'eng', name: 'Engineering', icon: GraduationCap },
  { id: 'biz', name: 'Business', icon: Briefcase },
  { id: 'arts', name: 'Arts', icon: Palette },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'edu', name: 'Education', icon: BookOpen },
];

export const TIMEZONES = [
  { name: "New York", zone: "America/New_York" },
  { name: "London", zone: "Europe/London" },
  { name: "Tokyo", zone: "Asia/Tokyo" },
  { name: "Paris", zone: "Europe/Paris" },
  { name: "Dubai", zone: "Asia/Dubai" },
  { name: "Singapore", zone: "Asia/Singapore" },
  { name: "Sydney", zone: "Australia/Sydney" },
  { name: "Berlin", zone: "Europe/Berlin" },
  { name: "Moscow", zone: "Europe/Moscow" },
  { name: "Mumbai", zone: "Asia/Kolkata" },
  { name: "Shanghai", zone: "Asia/Shanghai" },
  { name: "Seoul", zone: "Asia/Seoul" },
  { name: "Cairo", zone: "Africa/Cairo" },
  { name: "Lagos", zone: "Africa/Lagos" },
  { name: "Nairobi", zone: "Africa/Nairobi" },
  { name: "Johannesburg", zone: "Africa/Johannesburg" },
  { name: "Sao Paulo", zone: "America/Sao_Paulo" },
  { name: "Mexico City", zone: "America/Mexico_City" },
  { name: "Toronto", zone: "America/Toronto" },
  { name: "Los Angeles", zone: "America/Los_Angeles" },
  { name: "Chicago", zone: "America/Chicago" },
  { name: "Houston", zone: "America/Houston" },
  { name: "Phoenix", zone: "America/Phoenix" },
  { name: "Philadelphia", zone: "America/Philadelphia" },
  { name: "San Antonio", zone: "America/San_Antonio" },
  { name: "San Diego", zone: "America/San_Diego" },
  { name: "Dallas", zone: "America/Dallas" },
  { name: "San Jose", zone: "America/San_Jose" },
  { name: "Austin", zone: "America/Austin" },
  { name: "Jacksonville", zone: "America/Jacksonville" }
];

export const COLORS = [
  "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", 
  "#ff00ff", "#00ffff", "#ffa500", "#800080", "#008000",
  "#ffc0cb", "#a52a2a", "#808080", "#000000", "#ffd700",
  "#4b0082", "#f0e68c", "#e6e6fa", "#add8e6", "#90ee90"
];

export const ANIMATIONS = [
  { id: 'none', name: 'None' },
  { id: 'hover', name: 'Hover Based' },
  { id: 'fire', name: 'Fire' },
  { id: 'water', name: 'Water' },
  { id: 'cloud', name: 'Cloud' }
];

export const MOCK_POSTS = [
  // Computer Science
  { id: 101, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Intro to Python', category: 'Computer Science' },
  { id: 102, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/rfscVS0vtbw', description: 'Learn Algorithms', category: 'Computer Science' },
  { id: 103, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/8hly31xKli0', description: 'Data Structures', category: 'Computer Science' },
  { id: 104, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/vLnPwxZdW4Y', description: 'C++ Tutorial', category: 'Computer Science' },
  { id: 105, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/PkZNo7MFNFg', description: 'JavaScript Basics', category: 'Computer Science' },
  
  // Medicine
  { id: 201, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/f_f5W91SogM', description: 'Human Anatomy', category: 'Medicine' },
  { id: 202, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'CRISPR Explained', category: 'Medicine' },
  { id: 203, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/vo4pMVb0z6M', description: 'Neuroscience', category: 'Medicine' },
  { id: 204, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/7Vp_t8r2y7A', description: 'Medical Ethics', category: 'Medicine' },
  { id: 205, userId: 'system', type: 'video', content: 'https://www.youtube.com/embed/X9999999999', description: 'Surgery Basics', category: 'Medicine' },

  // Shorts (TikTok Style)
  { id: 901, userId: 'system', type: 'short', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', description: 'Quick Study Tip #1', category: 'Education' },
  { id: 902, userId: 'system', type: 'short', content: 'https://www.youtube.com/embed/9bZkp7q19f0', description: 'Science Fact #1', category: 'Education' },
  { id: 903, userId: 'system', type: 'short', content: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Code Hack #1', category: 'Education' },
];
