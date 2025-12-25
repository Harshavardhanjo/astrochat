import { Message } from '../types';

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: any;
  isOnline: boolean;
  category: 'astrologer' | 'support';
  // Profile Data
  experience?: string;
  specialties?: string[];
  languages?: string[];
  bio?: string;
  rating?: number;
  reviewCount?: number;
  visible?: boolean;
  tags?: string[]; // Category tags for quick identification
}

export const markChatAsVisible = (id: string) => {
    const chat = CHATS.find(c => c.id === id);
    if (chat) {
        chat.visible = true;
    }
};

export const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Astrologer Vikram',
    lastMessage: 'Session is ending in 2 minutes.',
    time: '1:39 PM',
    unread: 0,
    avatar: require('../assets/images/astrologer_profile.png'),
    isOnline: true,
    category: 'astrologer',
    experience: '15+ Years',
    specialties: ['Vedic Astrology', 'Prashna Kundali', 'Face Reading'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    bio: "I help people navigate life's challenges using ancient Vedic wisdom. My goal is to provide clarity and practical remedies for career, relationship, and health issues.",
    rating: 4.9,
    reviewCount: 1234,
    tags: ['Lifestyle', 'Relationships']
  },
  {
    id: '2',
    name: 'Astrologer Priya',
    lastMessage: 'Your Mars transit looks favorable.',
    time: 'Yesterday',
    unread: 2,
    avatar: require('../assets/images/astrologer_priya.png'),
    isOnline: false,
    category: 'astrologer',
    experience: '8 Years',
    specialties: ['KP Astrology', 'Career Counseling', 'Financial Growth'],
    languages: ['English', 'Marathi'],
    bio: "Specializing in career and financial growth through KP Astrology. I provide precise timing for job changes and investment opportunities.",
    rating: 4.7,
    reviewCount: 856,
    tags: ['Finance', 'Career']
  },
  {
    id: '3',
    name: 'Customer Support',
    lastMessage: 'How can we help you today?',
    time: 'Monday',
    unread: 0,
    avatar: null,
    isOnline: true,
    category: 'support',
    experience: 'Always Here',
    specialties: ['Billing', 'Technical Support', 'Refunds'],
    languages: ['English'],
    bio: "We are here to help you with any technical issues or billing inquiries. Available 24/7.",
    rating: 5.0,
    reviewCount: 9999
  },
  {
    id: '4',
    name: 'Astro Aisha',
    lastMessage: 'Love is in the stars for you.',
    time: 'Just now',
    unread: 0,
    avatar: require('../assets/images/astro_aisha.png'), 
    isOnline: true,
    category: 'astrologer',
    experience: '5 Years',
    specialties: ['Love & Relationships', 'Match Making', 'Heartbreak Recovery'],
    languages: ['English', 'Hindi', 'Punjabi'],
    bio: "Specializing in matters of the heart. I analyze Venus and Mars positions to guide you toward harmonious relationships.",
    rating: 4.8,
    reviewCount: 450,
    visible: false,
    tags: ['Relationships', 'Love']
  },
  {
    id: '5',
    name: 'Guru Dev',
    lastMessage: 'Align your career with the cosmos.',
    time: 'Just now',
    unread: 0,
    avatar: null,
    isOnline: true,
    category: 'astrologer',
    experience: '20+ Years',
    specialties: ['Career Growth', 'Business Strategy', 'Financial Success'],
    languages: ['English', 'Sanskrit'],
    bio: "Expert in 10th House analysis. I help professionals and entrepreneurs unlock their true potential.",
    rating: 4.9,
    reviewCount: 2100,
    visible: false,
    tags: ['Finance', 'Career']
  },
  {
    id: '6',
    name: 'Yogi Arjun',
    lastMessage: 'Balance your mind, body, and soul.',
    time: 'Just now',
    unread: 0,
    avatar: null,
    isOnline: false,
    category: 'astrologer',
    experience: '12 Years',
    specialties: ['Medical Astrology', 'Mental Wellness', 'Chakra Balancing'],
    languages: ['English', 'Hindi', 'Tamil'],
    bio: "Combining Ayurveda with Astrology to promote holistic well-being.",
    rating: 4.7,
    reviewCount: 890,
    visible: false,
    tags: ['Lifestyle', 'Health']
  }
];

export const CHAT_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: "1",
      sender: "system",
      text: "Your session with Astrologer Vikram has started.",
      timestamp: 1734681480000,
      type: "event"
    },
    {
      id: "2",
      sender: "user",
      text: "Namaste. I am feeling very anxious about my current job. Can you look at my chart?",
      timestamp: 1734681600000,
      type: "text"
    },
    {
      id: "3",
      sender: "ai_astrologer",
      text: "Namaste! I am analyzing your birth details. Currently, you are running through Shani Mahadasha. This often brings pressure but builds resilience.",
      timestamp: 1734681660000,
      type: "ai",
      hasFeedback: true,
      feedbackType: "liked"
    },
    {
      id: "4",
      sender: "human_astrologer",
      text: "I see the same. Look at your 6th house; Saturn is transiting there. This is why you feel the workload is heavy.",
      timestamp: 1734681720000,
      type: "human"
    },
    {
      id: "5",
      sender: "user",
      text: "Is there any remedy for this? I find it hard to focus.",
      timestamp: 1734681780000,
      type: "text",
      replyTo: "4"
    },
    {
      id: "6",
      sender: "ai_astrologer",
      text: "I suggest chanting the Shani Mantra 108 times on Saturdays. Would you like the specific mantra text?",
      timestamp: 1734681840000,
      type: "ai",
      hasFeedback: false
    }
  ],
  '2': [
    {
        id: "201",
        sender: "system",
        text: "Your session with Astrologer Priya has started.",
        timestamp: 1734600000000,
        type: "event"
    },
    {
        id: "202",
        sender: "ai_astrologer",
        text: "Hello! I noticed you are interested in career growth. Shall I analyze your 10th house?",
        timestamp: 1734600060000,
        type: "ai",
        hasFeedback: false
    },
    {
        id: "203",
        sender: "user",
        text: "Yes please. I am looking for a promotion.",
        timestamp: 1734600120000,
        type: "text"
    },
    {
        id: "204",
        sender: "human_astrologer",
        text: "Your Mars transit looks favorable for leadership roles. Expect good news within 45 days.",
        timestamp: 1734600180000,
        type: "human"
    }
  ],
  '3': [
    {
        id: "301",
        sender: "system",
        text: "Support chat started.",
        timestamp: 1734500000000,
        type: "event"
    },
    {
        id: "302",
        sender: "user",
        text: "I was charged twice for my last session.",
        timestamp: 1734500060000,
        type: "text"
    },
    {
        id: "303",
        sender: "human_astrologer",
        text: "Apologies for the inconvenience. Let me check the transaction details. How can we help you today beyond this?",
        timestamp: 1734500120000,
        type: "human" // Reusing human type for support
    }
  ]
};
