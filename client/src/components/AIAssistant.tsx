import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Mic, MicOff, Send, X, Minimize2, Maximize2, 
  Volume2, VolumeX, Globe, AlertCircle, Check, Loader2, Camera
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  speechPlayed?: boolean;
}

export const AIAssistant: React.FC = () => {
  const { 
    currentView, setCurrentView, addProduct, aiAutofillData, setAiAutofillData,
    products, wallets, orders, notifications, currentUser
  } = useApp();

  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Namaste! Main aapka AI assistant hoon. Kaise madad karu? (Namaste! I am your AI assistant. How can I help you today?)',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [language, setLanguage] = useState<'hi' | 'en' | 'mr'>('hi'); // Hindi, English, Marathi
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, expanded, minimized]);

  // Setup Web Speech API Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  // Handle Voice Output (Text to Speech)
  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;

    // Clean text of emojis and helper codes
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');

    window.speechSynthesis.cancel(); // Stop current playing speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    
    // Choose appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(language));
    if (voice) {
      utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser. Please use Chrome/Safari.");
        return;
      }
      // Set correct language dynamically before starting
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Process Response after brief delay
    setTimeout(() => {
      processCommand(query);
    }, 800);
  };

  // Simulating Product Image Detection
  const handleImageAnalysisMock = () => {
    setIsAnalyzingImage(true);
    // Mimics taking picture of a Banarasi Saree
    setTimeout(() => {
      setIsAnalyzingImage(false);
      const aiReply = "Aapke photo se maine ek traditional 'Red Katan Silk Banarasi Saree' detect ki hai. Kya main iski details form mein fill karu? (I detected a 'Red Katan Silk Banarasi Saree' from your photo. Should I fill the details in the form?)";
      setMessages(prev => [...prev, {
        id: 'msg-reply-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date()
      }]);
      speakText(aiReply);

      // Save pre-computed auto-fill data to trigger autofill
      setAiAutofillData({
        name: 'Royal Red Pure Katan Silk Banarasi Saree',
        category: 'Textiles',
        craftType: 'Banarasi Handloom Weaving',
        material: '100% Pure Katan Silk & Zari',
        price: 18500,
        stockQty: 8,
        weight: 750,
        description: 'Authentic handwoven royal red pure katan silk saree featuring intricate floral jaal motifs and an antique gold zari border. Crafted by master weavers in Varanasi.'
      });
    }, 1500);
  };

  // Intent Parsing & Command Router
  const processCommand = async (query: string) => {
    const text = query.toLowerCase();
    let replyText = "";
    
    // 1. Navigation intents
    if (text.includes('go to') || text.includes('open') || text.includes('kholo') || text.includes('screen')) {
      if (text.includes('inventory') || text.includes('stock') || text.includes('maal') || text.includes('product')) {
        setCurrentView('inventory');
        replyText = language === 'hi' 
          ? "Maine aapka Inventory page khol diya hai." 
          : "Opened your Inventory screen.";
      } else if (text.includes('add product') || text.includes('naya product') || text.includes('joch')) {
        setCurrentView('add-product');
        replyText = language === 'hi' 
          ? "Naya product add karne ki screen khol di gayi hai." 
          : "Opened the Add Product screen.";
      } else if (text.includes('orders') || text.includes('order')) {
        setCurrentView('orders');
        replyText = language === 'hi' 
          ? "Maine aapke Sourcing aur Retail Orders ki list khol di hai." 
          : "Opened your Orders tab.";
      } else if (text.includes('community') || text.includes('feed') || text.includes('post')) {
        setCurrentView('community');
        replyText = language === 'hi' 
          ? "ShilpSetu Community feed pe aapka swagat hai!" 
          : "Welcome to the ShilpSetu Community feed!";
      } else if (text.includes('dashboard') || text.includes('home') || text.includes('main')) {
        setCurrentView('dashboard');
        replyText = language === 'hi' 
          ? "Maine aapka Home Dashboard khol diya hai." 
          : "Navigated to your Home Dashboard.";
      } else if (text.includes('store') || text.includes('website') || text.includes('storefront')) {
        setCurrentView('storefront');
        replyText = language === 'hi' 
          ? "Aapka Online Storefront Builder khol diya gaya hai." 
          : "Navigated to your Online Storefront Builder.";
      } else if (text.includes('balance') || text.includes('money') || text.includes('wallet') || text.includes('paise') || text.includes('earning') || text.includes('कमाई')) {
        setCurrentView('balance');
        replyText = language === 'hi' 
          ? "Maine aapka Wallet aur Earnings screen khol diya hai." 
          : "Opened your Wallet & Earnings ledger screen.";
      } else if (text.includes('scan') || text.includes('billing') || text.includes('invoice') || text.includes('receipt') || text.includes('bill')) {
        setCurrentView('scan-sell');
        replyText = language === 'hi'
          ? "Maine aapka Scan & Sell screen khol diya hai jahan aap bills aur billing history dekh sakte hain."
          : "Opened your Scan & Sell screen where you can manage bills and check billing history.";
      } else {
        replyText = "Kripya sahi page ka naam bataiye, jaise: Inventory, Add Product, Scan & Sell, Wallet ya Orders. (Please specify a page like Inventory, Add Product, Scan & Sell, Wallet, or Orders.)";
      }
    } 
    // 2. Autofill & Product description generator intent
    else if (text.includes('generate') || text.includes('create') || text.includes('autofill') || text.includes('saree') || text.includes('pottery') || text.includes('toy')) {
      if (text.includes('banarasi') || text.includes('silk') || text.includes('saree')) {
        setCurrentView('add-product');
        setAiAutofillData({
          name: 'Classic Banarasi Silk Saree',
          category: 'Textiles',
          craftType: 'Kadwa Handwoven',
          material: 'Pure Silk & Tested Zari',
          price: 12500,
          stockQty: 10,
          weight: 700,
          description: 'A gorgeous handwoven pure silk Banarasi Saree, designed with traditional floral borders using standard gold zari threads.'
        });
        replyText = "Maine Banarasi Silk Saree ki details fill kar di hain. Form check kijiye! (I have generated and filled the Banarasi Silk Saree details. Check the form!)";
      } else if (text.includes('pottery') || text.includes('vase') || text.includes('clay')) {
        setCurrentView('add-product');
        setAiAutofillData({
          name: 'Jaipur Blue Pottery Flower Vase',
          category: 'Pottery',
          craftType: 'Blue Pottery Handpaint',
          material: 'Quartz, Clay & Glass Glaze',
          price: 1450,
          stockQty: 25,
          weight: 900,
          description: 'Authentic hand-painted glazed quartz ceramic flower vase with classic floral motifs in Jaipur cobalt blue dye.'
        });
        replyText = "Jaipur Blue Pottery Vase ki details fill ho chuki hain! (Jaipur Blue Pottery details populated!)";
      } else if (text.includes('toy') || text.includes('wooden') || text.includes('kondapalli')) {
        setCurrentView('add-product');
        setAiAutofillData({
          name: 'Kondapalli Traditional Wooden Toys Set',
          category: 'Home Decor',
          craftType: 'Wood Carving & Natural Paint',
          material: 'Soft Tella Poniki Wood',
          price: 850,
          stockQty: 30,
          weight: 400,
          description: 'Beautiful set of hand-carved traditional wooden toys. Coloured with organic, non-toxic vegetable oil dyes.'
        });
        replyText = "Kondapalli Toys ki details form mein fill ho chuki hain. (Kondapalli Toys details populated.)";
      } else {
        replyText = "Kripya kis craft ko banana hai woh specify karein, jaise Banarasi Saree ya Blue Pottery. (Please specify a craft like Banarasi Saree or Blue Pottery to auto-generate.)";
      }
    } 
    // 3. Question / Answer intents
    else if (text.includes('balance') || text.includes('wallet') || text.includes('paisa') || text.includes('कमाई')) {
      const balance = wallets['artisan-1']?.balance || 0;
      replyText = `Aapka current wallet balance ₹${balance.toLocaleString('en-IN')} hai. (Your wallet balance is ₹${balance.toLocaleString('en-IN')})`;
    } else if (text.includes('order') || text.includes('sourcing') || text.includes('ग्राहक')) {
      const pendingCount = orders.filter(o => o.status !== 'delivered').length;
      replyText = `Aapke paas abhi ${pendingCount} active orders hain jo dispatch karne baki hain. (You have ${pendingCount} active orders waiting for dispatch.)`;
    } else if (text.includes('supabase') || text.includes('save') || text.includes('save product') || text.includes('list')) {
      // Direct mock upload trigger to Supabase
      addProduct({
        name: 'AI Generated Silk Saree',
        category: 'Textiles',
        craftType: 'Handloom Weaving',
        material: 'Pure Silk',
        price: 8999,
        stockQty: 10,
        weight: 600,
        description: 'AI Generated organic silk handloom product saved safely inside Supabase database.',
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600']
      });
      replyText = "Maine is product details ko Supabase database mein safely list kar diya hai! (Successfully listed this product in the Supabase database!)";
    } 
    // 4. Fallback greetings / conversational (Gemini Powered)
    else {
      try {
        const res = await fetch("http://localhost:5000/api/ai/chat", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            language: language,
            role: currentUser?.role || 'ARTISAN'
          })
        });
        if (res.ok) {
          const data = await res.json();
          replyText = data.reply;
        } else {
          throw new Error();
        }
      } catch (e) {
        replyText = language === 'hi' 
          ? "Samajh gaya! Aap product photo click kar sakte hain, naya craft generate karne bol sakte hain, ya orders check karne bol sakte hain." 
          : "Understood! You can upload a photo for detection, ask me to generate craft descriptions, or command me to open files/pages.";
      }
    }

    // Add AI Response
    setMessages(prev => [...prev, {
      id: 'msg-reply-' + Date.now(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date()
    }]);

    // Speak aloud
    speakText(replyText);
  };

  return (
    <div className="absolute bottom-20 right-4 z-40 flex flex-col items-end">
      
      {/* 1. EXPANDED CHAT PANEL */}
      {expanded && !minimized && (
        <div className="w-[340px] h-[460px] bg-white/95 backdrop-blur-md rounded-[32px] border border-orange-200/50 shadow-2xl flex flex-col overflow-hidden mb-3 animate-slideUp text-left">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#FF6B35] to-[#B3562C] text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#FF6B35]" />
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight leading-tight">ShilpSetu AI Sahayak</h3>
                <span className="text-[9px] opacity-80 font-bold block mt-0.5 uppercase tracking-wider">Artisan Mode (Online)</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setMinimized(true)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all cursor-pointer"
                title="Minimize"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setExpanded(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex justify-between items-center shrink-0 text-[10px] text-stone-550 font-bold">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent font-black text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English (US/IN)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
            
            <button 
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`flex items-center gap-1 hover:text-stone-800 transition-all cursor-pointer ${speechEnabled ? 'text-[#FF6B35]' : 'text-stone-400'}`}
              title={speechEnabled ? "Mute Voice Output" : "Enable Voice Output"}
            >
              {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{speechEnabled ? "Voice On" : "Mute"}</span>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3.5 bg-[#FFFBF8]/30">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col max-w-[80%] ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div className={`p-3.5 rounded-2xl text-[11px] leading-relaxed font-medium shadow-sm ${
                  m.sender === 'user' 
                    ? 'bg-[#FF6B35] text-white rounded-tr-xs rounded-br-2xl' 
                    : 'bg-white text-stone-800 border border-stone-150 rounded-tl-xs rounded-bl-2xl'
                }`}>
                  {m.text}
                </div>
                <span className="text-[8px] text-stone-400 mt-1 font-bold">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isAnalyzingImage && (
              <div className="self-start max-w-[80%] flex items-center gap-2 bg-white border border-stone-150 p-3.5 rounded-2xl shadow-sm text-[11px] font-bold text-stone-600">
                <Loader2 className="w-4 h-4 text-[#FF6B35] animate-spin" />
                <span>AI Photo details analyze kar raha hai...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helper Prompts */}
          <div className="px-3 py-2 bg-white border-t border-stone-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button 
              onClick={() => handleSendMessage("Go to Add Product")}
              className="text-[9px] font-black text-stone-650 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-stone-100 cursor-pointer"
            >
              🚀 Go to Add Product
            </button>
            <button 
              onClick={() => handleSendMessage("Go to Scan & Sell")}
              className="text-[9px] font-black text-stone-650 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-stone-100 cursor-pointer"
            >
              📊 Scan & Sell
            </button>
            <button 
              onClick={() => handleSendMessage("Go to Inventory")}
              className="text-[9px] font-black text-stone-650 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-stone-100 cursor-pointer"
            >
              📦 My Products
            </button>
            <button 
              onClick={() => handleSendMessage("Go to Orders")}
              className="text-[9px] font-black text-stone-650 bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-stone-100 cursor-pointer"
            >
              🛍️ Check Orders
            </button>
            <button 
              onClick={() => handleSendMessage("Go to Wallet")}
              className="text-[9px] font-black text-stone-650 bg-[#FFF3EB] border border-[#FFE2D4] px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:bg-[#FFE2D4] cursor-pointer"
            >
              💰 Wallet & Earnings
            </button>
          </div>

          {/* Input field */}
          <div className="p-3 bg-white border-t border-stone-100 flex gap-2 items-center shrink-0">
            {/* Visual Detect Trigger */}
            <button
              onClick={handleImageAnalysisMock}
              className="w-10 h-10 rounded-xl bg-[#FFF0EB] hover:bg-[#FFE2D4] flex items-center justify-center text-[#FF6B35] transition-all cursor-pointer shadow-xs shrink-0"
              title="Detect craft from photo"
            >
              <Camera className="w-4.5 h-4.5" />
            </button>

            {/* Voice Mic Trigger */}
            <button
              onClick={toggleListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-[#FFF0EB] text-[#FF6B35] hover:bg-[#FFE2D4]'
              }`}
              title={isListening ? "Listening... Click to stop" : "Speak (Hindi/English)"}
            >
              {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Sunn raha hoon..." : "Ask me anything..."}
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#FF6B35] text-stone-800"
            />
            
            <button
              onClick={() => handleSendMessage()}
              className="w-10 h-10 rounded-xl bg-[#FF6B35] text-white hover:bg-[#E55A25] flex items-center justify-center transition-all shadow-md shadow-orange-500/10 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 2. MINIMIZED FLOATING BUBBLE */}
      {minimized && expanded && (
        <div 
          onClick={() => setMinimized(false)}
          className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 cursor-pointer mb-3 hover:bg-stone-800 transition-all select-none animate-slideUp text-white"
        >
          <Sparkles className="w-4.5 h-4.5 text-[#FF6B35] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider">Sahayak active</span>
          <Maximize2 className="w-3.5 h-3.5 text-stone-400 ml-1" />
        </div>
      )}

      {/* 3. CORE FLOATING ACTION BUTTON */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#B3562C] hover:from-[#E55A25] hover:to-[#9E4924] text-white flex items-center justify-center shadow-xl shadow-orange-500/20 active:scale-95 transition-all relative cursor-pointer ring-4 ring-white"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-5.5 h-5.5 text-white animate-spin-slow" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border border-white text-[8px] text-white items-center justify-center font-bold">1</span>
          </span>
        </button>
      )}

    </div>
  );
};
