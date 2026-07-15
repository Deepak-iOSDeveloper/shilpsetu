import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, Search, SlidersHorizontal, Check, 
  CheckCircle2, ChevronRight, X, ArrowLeft, MessageSquare 
} from 'lucide-react';

// Custom Paper Airplane SVG matching reference icon exactly
const PaperAirplaneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 45 L85 15 L55 85 L44 56 Z" stroke="#4A4A4A" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M44 56 L65 35" stroke="#0066FF" strokeWidth="9" strokeLinecap="round" />
  </svg>
);

interface ChatMessage {
  id: string;
  sender: 'artisan' | 'brand';
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  // Brand Mode labels
  artisanName: string;
  artisanLocation: string;
  // Artisan Mode labels
  brandName: string;
  brandSubtitle: string;
  
  avatarChar: string;
  avatarBg: string;
  tagline: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  unread: boolean;
  messages: ChatMessage[];
  archived: boolean;
}

export const MessagesView: React.FC = () => {
  const { activeRole, setCurrentView } = useApp();
  const isArtisan = activeRole === 'ARTISAN';

  // Toggle subView: 'threads' (mockup thread list) or 'chat' (active bubble screen)
  const [subView, setSubView] = useState<'threads' | 'chat'>('threads');
  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial threads mapped to RFQ negotiations from the mockup screenshot list
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      artisanName: 'Ramesh Kumar',
      artisanLocation: 'Varanasi, UP',
      brandName: 'Taneira',
      brandSubtitle: 'A TATA Product',
      avatarChar: 'RK',
      avatarBg: 'bg-[#6A0DAD] text-white', // Purple
      tagline: 'Custom-1 • Kadwa Banarasi Weaving (100 PCS)',
      lastMessage: 'I can deliver the Kadwa sarees in 45 days as requested.',
      time: '10:30 AM',
      unreadCount: 2,
      unread: true,
      archived: false,
      messages: [
        { id: 'm1', sender: 'brand', text: 'Hi, we saw your quote on the Kadwa Banarasi Custom Order. Can you deliver by August 15th?', timestamp: 'Yesterday' },
        { id: 'm2', sender: 'artisan', text: 'Namaste, yes. I can deliver the Kadwa sarees in 45 days as requested. The gold zari borders will be hand-woven.', timestamp: '10:30 AM' }
      ]
    },
    {
      id: 'thread-2',
      artisanName: 'Naresh Patel',
      artisanLocation: 'Bhuj, Gujarat',
      brandName: 'Fabindia',
      brandSubtitle: 'Celebrate India',
      avatarChar: 'NP',
      avatarBg: 'bg-[#C23B22] text-white', // Red
      tagline: 'Custom-1 • Bhuj Organic Dyes',
      lastMessage: 'Will use organic Bhuj dyes for the traditional print blocks.',
      time: 'Yesterday',
      unreadCount: 1,
      unread: true,
      archived: false,
      messages: [
        { id: 'm3', sender: 'brand', text: 'Hello, what organic dyes will be used on this order?', timestamp: 'Yesterday' },
        { id: 'm4', sender: 'artisan', text: 'Will use organic Bhuj dyes for the traditional print blocks. It takes around 50 days to dry and cure.', timestamp: 'Yesterday' }
      ]
    },
    {
      id: 'thread-3',
      artisanName: 'Sunita Kumari',
      artisanLocation: 'Chanderi, MP',
      brandName: 'Aachho',
      brandSubtitle: 'Ethnic. Authentic. You.',
      avatarChar: 'SK',
      avatarBg: 'bg-[#008080] text-white', // Teal
      tagline: 'Custom-2 • Chanderi Silk Saree (50 PCS)',
      lastMessage: 'The chanderi dupattas have delicate gold cutwork details.',
      time: 'Yesterday',
      unreadCount: 1,
      unread: true,
      archived: false,
      messages: [
        { id: 'm5', sender: 'brand', text: 'Sunita, how heavy is the gold thread work on the dupattas?', timestamp: '2 days ago' },
        { id: 'm6', sender: 'artisan', text: 'The chanderi dupattas have delicate gold cutwork details. Weave weight is under 400g.', timestamp: 'Yesterday' }
      ]
    },
    {
      id: 'thread-4',
      artisanName: 'Ajay Verma',
      artisanLocation: 'Jaipur, Rajasthan',
      brandName: 'Anouk Weaves',
      brandSubtitle: 'Modern Traditional',
      avatarChar: 'AV',
      avatarBg: 'bg-[#D2691E] text-white', // Brownish Orange
      tagline: 'Custom-3 • Hand Block Printed Fabric',
      lastMessage: 'Vegetable block printing is ready. Checking color fastness now.',
      time: '2 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm7', sender: 'brand', text: 'Ajay, is the block print batch fully cured?', timestamp: '3 days ago' },
        { id: 'm8', sender: 'artisan', text: 'Vegetable block printing is ready. Checking color fastness now.', timestamp: '2 days ago' }
      ]
    },
    {
      id: 'thread-5',
      artisanName: 'Priya Sharma',
      artisanLocation: 'Ludhiana, Punjab',
      brandName: 'Sabyasachi Heritage',
      brandSubtitle: 'Heritage luxury',
      avatarChar: 'PS',
      avatarBg: 'bg-[#4169E1] text-white', // Royal Blue
      tagline: 'Custom-2 • Pure Linen Fabric',
      lastMessage: 'Organic flax linen is source-verified. Looms are active.',
      time: '2 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm9', sender: 'brand', text: 'Hi Priya, can you send the flax certificate?', timestamp: '3 days ago' },
        { id: 'm10', sender: 'artisan', text: 'Organic flax linen is source-verified. Looms are active.', timestamp: '2 days ago' }
      ]
    },
    {
      id: 'thread-6',
      artisanName: 'Meena Gupta',
      artisanLocation: 'Indore, MP',
      brandName: 'Kalki Fashion',
      brandSubtitle: 'Celebrate Craftsmanship',
      avatarChar: 'MG',
      avatarBg: 'bg-[#9370DB] text-white', // Light Purple
      tagline: 'Custom-4 • Maheshwari Saree (75 PCS)',
      lastMessage: 'Silk borders are double-wefted for extra sheen.',
      time: '3 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm11', sender: 'brand', text: 'Meena, did you finish the double-weft borders?', timestamp: '4 days ago' },
        { id: 'm12', sender: 'artisan', text: 'Silk borders are double-wefted for extra sheen. Samples are dispatched.', timestamp: '3 days ago' }
      ]
    },
    {
      id: 'thread-7',
      artisanName: 'Arif Khan',
      artisanLocation: 'Kashipur, Uttarakhand',
      brandName: 'Ritu Kumar Design',
      brandSubtitle: 'Artisanal Wear',
      avatarChar: 'AK',
      avatarBg: 'bg-[#1E5631] text-white', // Forest Green
      tagline: 'Custom-3 • Indigo Dyed Fabric',
      lastMessage: 'Looms are prepped for 200 meters of raw indigo fabric.',
      time: '3 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm13', sender: 'brand', text: 'Hi Arif, are the indigo vats fully active?', timestamp: '4 days ago' },
        { id: 'm14', sender: 'artisan', text: 'Looms are prepped for 200 meters of raw indigo fabric. Vat fermentation is successful.', timestamp: '3 days ago' }
      ]
    },
    {
      id: 'thread-8',
      artisanName: 'Vijay Singh',
      artisanLocation: 'Srinagar, Kashmir',
      brandName: 'Ananya Boutique',
      brandSubtitle: 'Premium Sourcing',
      avatarChar: 'VS',
      avatarBg: 'bg-[#DB7093] text-white', // Pale Red Violet
      tagline: 'Custom-1 • Pashmina Stole (30 PCS)',
      lastMessage: 'Kashmir pashmina wool spinning is complete. Hand-embroidery started.',
      time: '4 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm15', sender: 'brand', text: 'Vijay, did the spinning begin?', timestamp: '5 days ago' },
        { id: 'm16', sender: 'artisan', text: 'Kashmir pashmina wool spinning is complete. Hand-embroidery started.', timestamp: '4 days ago' }
      ]
    },
    {
      id: 'thread-9',
      artisanName: 'Harish Bhatt',
      artisanLocation: 'Almora, Uttarakhand',
      brandName: 'Nesta Jute Crafts',
      brandSubtitle: 'Eco Traditional',
      avatarChar: 'HB',
      avatarBg: 'bg-[#8B5A2B] text-white', // Brown
      tagline: 'Custom-2 • Jute Bags (200 PCS)',
      lastMessage: 'Braided jute handles are reinforced with double stitches.',
      time: '5 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm17', sender: 'brand', text: 'Harish, please reinforce the handles.', timestamp: '6 days ago' },
        { id: 'm18', sender: 'artisan', text: 'Braided jute handles are reinforced with double stitches.', timestamp: '5 days ago' }
      ]
    },
    {
      id: 'thread-10',
      artisanName: 'Lata Devi',
      artisanLocation: 'Madhubani, Bihar',
      brandName: 'Vriti Textiles',
      brandSubtitle: 'Sourcing Hub',
      avatarChar: 'LD',
      avatarBg: 'bg-[#008B8B] text-white', // Dark Cyan
      tagline: 'Custom-4 • Hand Embroidered Dupatta',
      lastMessage: 'Madhubani border borders are painted using natural colors.',
      time: '5 days ago',
      unreadCount: 0,
      unread: false,
      archived: false,
      messages: [
        { id: 'm19', sender: 'brand', text: 'Lata, how are the border painting colors made?', timestamp: '6 days ago' },
        { id: 'm20', sender: 'artisan', text: 'Madhubani border borders are painted using natural colors from leaves and flowers.', timestamp: '5 days ago' }
      ]
    }
  ]);

  // Dynamic integration of submitted RFQ comments into chat threads
  useEffect(() => {
    const rawBids = localStorage.getItem('shilpsetu_submitted_bids');
    if (!rawBids) return;

    try {
      const bids = JSON.parse(rawBids);
      if (!Array.isArray(bids)) return;

      setThreads(prevThreads => {
        let updatedThreads = [...prevThreads];

        bids.forEach(bid => {
          const msgId = `bid-msg-${bid.id}`;
          const hasMsg = updatedThreads.some(t => t.messages.some(m => m.id === msgId));
          if (hasMsg) return; // Prevent duplicates

          const threadIndex = updatedThreads.findIndex(
            t => t.brandName.toLowerCase() === bid.brandName.toLowerCase()
          );

          const newMsg: ChatMessage = {
            id: msgId,
            sender: 'artisan',
            text: `Proposed Offer: ₹${bid.price.toLocaleString('en-IN')}/pc • Delivery in ${bid.duration} days. Note: ${bid.comment || 'No comment added.'}`,
            timestamp: bid.timestamp || 'Just now'
          };

          if (threadIndex !== -1) {
            const thread = updatedThreads[threadIndex];
            updatedThreads[threadIndex] = {
              ...thread,
              lastMessage: newMsg.text,
              time: newMsg.timestamp,
              unread: true,
              unreadCount: thread.unreadCount + 1,
              messages: [...thread.messages, newMsg]
            };
          } else {
            const newThreadId = `thread-custom-${bid.id}`;
            const newThread: ChatThread = {
              id: newThreadId,
              artisanName: 'Ramesh Kumar',
              artisanLocation: 'Varanasi, UP',
              brandName: bid.brandName,
              brandSubtitle: 'Buyer Brand',
              avatarChar: bid.brandName.substring(0, 2).toUpperCase(),
              avatarBg: 'bg-[#FF6B35] text-white',
              tagline: `Custom • ${bid.productName}`,
              lastMessage: newMsg.text,
              time: newMsg.timestamp,
              unreadCount: 1,
              unread: true,
              archived: false,
              messages: [
                { id: `bid-brand-msg-${bid.id}`, sender: 'brand', text: `Regarding Custom Order for ${bid.productName}: We look forward to your offer.`, timestamp: 'Yesterday' },
                newMsg
              ]
            };
            updatedThreads = [newThread, ...updatedThreads];
          }
        });

        return updatedThreads;
      });
    } catch (err) {
      console.error('Error parsing submitted bids from localStorage', err);
    }
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId);
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, unread: false, unreadCount: 0 } : t));
    setSubView('chat');
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: isArtisan ? 'artisan' : 'brand',
      text: inputText,
      timestamp: 'Just now'
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: inputText,
          time: 'Just now',
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));

    setInputText('');

    // Simulated response from other party after 1.2s
    setTimeout(() => {
      const brandReplies = [
        "Sounds good. Please proceed with fabric samples.",
        "We are ready to release the escrow payment upon confirmation.",
        "Can you send over photos of the first batch?",
        "Okay, let's proceed with the agreed wholesale price."
      ];
      const artisanReplies = [
        "Namaste. I will update the loom schedules and confirm delivery.",
        "The thread spinning is complete. Handloom setup is ready.",
        "Sure, I will send pictures of the border weave shortly.",
        "Okay. Escrow contract has been updated."
      ];
      const randomReply = isArtisan 
        ? brandReplies[Math.floor(Math.random() * brandReplies.length)]
        : artisanReplies[Math.floor(Math.random() * artisanReplies.length)];

      const replyMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        sender: isArtisan ? 'brand' : 'artisan',
        text: randomReply,
        timestamp: 'Just now'
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: randomReply,
            time: 'Just now',
            messages: [...t.messages, replyMsg]
          };
        }
        return t;
      }));
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (subView === 'chat') {
      scrollToBottom();
    }
  }, [activeThread?.messages, subView]);

  // Tab counters
  const unreadTotal = threads.filter(t => t.unread).length;

  // Filters threads by Tab & Search Query
  const filteredThreads = threads
    .filter(t => {
      if (activeTab === 'unread') return t.unread;
      if (activeTab === 'archived') return t.archived;
      return !t.archived;
    })
    .filter(t => {
      const searchTarget = isArtisan ? t.brandName : t.artisanName;
      return searchTarget.toLowerCase().includes(searchQuery.toLowerCase()) || 
             t.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="flex-1 flex flex-col pb-20 bg-[#FFF8F1] relative">
      
      {/* ============================================================== */}
      {/* THREADS LIST VIEW (Mockup Screen Layout) */}
      {/* ============================================================== */}
      {subView === 'threads' ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 bg-white border-b border-primary/5 flex flex-col gap-4 sticky top-0 z-30 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm animate-press"
                >
                  <ChevronLeft className="w-5 h-5 text-text-primary" />
                </button>
                <div>
                  <h2 className="font-heading font-black text-xl text-stone-850">Messages</h2>
                  <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
                    Negotiate and comment on Custom bulk orders
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm hover:bg-stone-50">
                  <Search className="w-5 h-5 text-stone-600" />
                </button>
                <button className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center relative shadow-sm hover:bg-stone-50">
                  <SlidersHorizontal className="w-5 h-5 text-stone-600" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF6B35] border border-white text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>

            {/* Horizontal Capsule Tab selector (All, Unread, Archived) */}
            <div className="bg-[#FFF5F1] p-1 rounded-2xl flex border border-primary/5 shadow-inner">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 text-xs font-bold text-center rounded-xl transition-all ${
                  activeTab === 'all' 
                    ? 'bg-white text-primary shadow' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`flex-1 py-2 text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'unread' 
                    ? 'bg-white text-primary shadow' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>Unread</span>
                {unreadTotal > 0 && (
                  <span className="bg-[#FF6B35] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    {unreadTotal}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`flex-1 py-2 text-xs font-bold text-center rounded-xl transition-all ${
                  activeTab === 'archived' 
                    ? 'bg-white text-primary shadow' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          {/* List Scroll Feed */}
          <div className="p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar max-h-[calc(100vh-220px)]">
            {filteredThreads.map((thread) => {
              const displayTitle = isArtisan ? thread.brandName : thread.artisanName;
              const displaySubtitle = isArtisan ? thread.brandSubtitle : thread.artisanLocation;
              
              // Only thread-1, thread-2, thread-6 have verified checkmarks in mockup
              const isVerified = ['thread-1', 'thread-2', 'thread-6'].includes(thread.id);
              
              return (
                <div
                  key={thread.id}
                  onClick={() => handleThreadSelect(thread.id)}
                  className="bg-white rounded-3xl p-4 border border-primary/5 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Circle Avatar bubble */}
                    <div className={`w-11 h-11 rounded-full ${thread.avatarBg} flex items-center justify-center font-heading font-black text-xs shrink-0 shadow-inner`}>
                      {thread.avatarChar}
                    </div>

                    {/* Middle Texts */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-stone-850 truncate">{displayTitle}</span>
                        {isVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                            <Check className="w-2.5 h-2.5" strokeWidth={4} />
                          </span>
                        )}
                      </div>
                      
                      <span className="text-[10px] text-text-secondary block mt-0.5 leading-none">
                        {displaySubtitle}
                      </span>
                      
                      {/* Orange/Red tagline matching mockup exactly */}
                      <span className={`text-[9px] font-black block mt-1.5 ${
                        ['thread-1', 'thread-3', 'thread-6', 'thread-8'].includes(thread.id)
                          ? 'text-[#FF6B35]'
                          : 'text-text-secondary'
                      }`}>
                        {thread.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Right Meta details (badge & time) */}
                  <div className="flex flex-col items-end justify-between ml-3 h-12 shrink-0">
                    <span className="text-[9px] font-bold text-stone-400">
                      {thread.time}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {thread.unreadCount > 0 && (
                        <span className="w-4.5 h-4.5 bg-[#FF6B35] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm">
                          {thread.unreadCount}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredThreads.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-primary/5 p-6 flex flex-col items-center gap-3">
                <MessageSquare className="w-12 h-12 text-stone-300 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-text-primary">No Messages</h4>
                  <p className="text-[10px] text-text-secondary mt-1">No chats match this category filter.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (

        // ==============================================================
        // CHAT WINDOW SCREEN (Real-time bubbles)
        // ==============================================================
        <div className="flex-1 flex flex-col h-[calc(100vh-100px)]">
          {/* Header */}
          <div className="p-4 border-b border-stone-150 flex items-center justify-between bg-white shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSubView('threads')}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50"
              >
                <ArrowLeft className="w-5 h-5 text-stone-700" />
              </button>
              
              <div className={`w-9 h-9 rounded-full ${activeThread.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-sm`}>
                {activeThread.avatarChar}
              </div>
              
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-stone-850 leading-tight">
                    {isArtisan ? activeThread.brandName : activeThread.artisanName}
                  </h4>
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <Check className="w-2 h-2" strokeWidth={4} />
                  </span>
                </div>
                <span className="text-[8px] font-black text-[#FF6B35] mt-0.5 block uppercase tracking-wider">
                  {activeThread.tagline}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setSubView('threads')}
              className="text-[10px] font-extrabold text-stone-400 hover:text-stone-700 uppercase"
            >
              Exit
            </button>
          </div>

          {/* Chat Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-3 bg-[#FCFAF7]/20">
            {activeThread.messages.map((m) => {
              const isOwner = isArtisan ? (m.sender === 'artisan') : (m.sender === 'brand');
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[85%] ${
                    isOwner ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div className={`rounded-2xl p-3 text-xs leading-normal font-medium ${
                    isOwner 
                      ? 'bg-[#FF6B35] text-white rounded-tr-none shadow-sm shadow-orange-500/10' 
                      : 'bg-stone-100 text-stone-800 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[7.5px] text-stone-400 mt-1 font-bold">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat inputs footer */}
          <div className="p-3 border-t border-stone-150 flex items-center gap-2 bg-white shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Text a comment / offer...`}
              className="flex-1 text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
            />
            
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 rounded-full bg-[#FF6B35] hover:bg-[#E55A25] text-white flex items-center justify-center shadow-md shadow-orange-500/10 transition-colors shrink-0"
            >
              <PaperAirplaneIcon className="w-5 h-5 filter invert brightness-200" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
