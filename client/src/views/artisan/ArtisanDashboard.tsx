import React from 'react';
import { useApp } from '../../context/AppContext';

export const ArtisanDashboard: React.FC = () => {
  const { currentUser, setCurrentView } = useApp();

  const [avatar, setAvatar] = React.useState<string>(() => {
    return localStorage.getItem('artisanLogo') || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatar(result);
          localStorage.setItem('artisanLogo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col z-10 font-sans text-left overflow-hidden select-none">
      
      {/* 1. HEADER SECTION WITH BANNER BACKGROUND */}
      <div 
        className="pt-6 px-5 pb-11 relative bg-cover bg-center min-h-[175px] flex flex-col justify-between overflow-hidden shadow-sm shrink-0"
        style={{ backgroundImage: "url('/artisan_banner.png')" }}
      >
        <div className="absolute inset-0 bg-stone-900/5 z-0" />
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            {/* Clickable Avatar Photo with orange border ring */}
            <div 
              onClick={() => setCurrentView('profile')}
              className="w-12 h-12 rounded-full overflow-hidden border-[2.5px] border-[#FF6B35] shadow-sm shrink-0 cursor-pointer hover:scale-102 transition-transform relative group"
              title="Click to view profile"
            >
              <img 
                src={avatar} 
                alt={currentUser?.name ? `${currentUser.name} Avatar` : 'Ramesh Kumar Avatar'} 
                className="w-full h-full object-cover"
              />
              {/* Overlay edit banner */}
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[7.5px] font-black text-white uppercase tracking-wider">Account</span>
              </div>
            </div>

            {/* Hidden avatar file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarUpload} 
            />
            <div>
              <h2 className="text-xl font-black text-stone-900 leading-tight font-heading drop-shadow-sm">
                Hello, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Ramesh'}!
              </h2>
              <span className="text-xs text-stone-700 font-bold block mt-0.5 drop-shadow-xs">
                Good morning ☀
              </span>
            </div>
          </div>          <div className="flex items-center gap-2">
            {/* Messages button with orange dot badge */}
            <button 
              onClick={() => setCurrentView('messages')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#F0E8DC] shadow-sm relative hover:bg-stone-50 transition-all shrink-0 active:scale-95 z-10"
              aria-label="Messages"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF6B35] rounded-full border border-white" />
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setCurrentView('notifications')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#F0E8DC] shadow-sm relative hover:bg-stone-50 transition-all shrink-0 active:scale-95 z-10"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF6B35] rounded-full border border-white" />
            </button>
          </div>
        </div>

        {/* Store Tag Button */}
        <div 
          onClick={() => setCurrentView('storefront')}
          className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-[#E8DDD0] rounded-full px-3.5 py-1.5 mt-4 shadow-sm cursor-pointer hover:bg-stone-50 transition-all select-none self-start relative z-10"
        >
          <div className="w-5 h-5 bg-[#FFF3E8] rounded-md flex items-center justify-center text-xs">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <span className="text-xs font-black text-[#1A1A1A] tracking-tight">
            Launch My Brand Online
          </span>
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#9B9B9B]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* 2. QUICK ACTIONS CARD CONTAINER (WHITE CONTEXT CURVED TOP OVERLAY) */}
      <div className="bg-white rounded-t-[40px] pt-5 px-5 pb-5 shadow-[0_-8px_32px_rgba(0,0,0,0.04)] -mt-6 relative z-10 shrink-0">
        {/* Inner Card enclosing the Quick Actions */}
        <div className="bg-[#FFF8F5]/60 border border-[#F8DDD0]/50 rounded-[28px] p-3.5 shadow-sm">
          {/* QUICK ACTIONS ROW */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Tile 1: Add Product */}
            <div 
              onClick={() => setCurrentView('add-product')}
              className="bg-[#FFF5F1] border border-[#F8DDD0] rounded-[26px] py-4 px-1.5 flex flex-col items-center justify-between h-[135px] cursor-pointer active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(255,107,53,0.15)] hover:shadow-[0_14px_24px_-4px_rgba(255,107,53,0.22)] hover:-translate-y-0.5"
            >
              <div className="w-[58px] h-[58px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full object-contain" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(0, 2)">
                    <path d="M24 6 L38 13 L24 20 L10 13 Z" fill="#FFE2D4" stroke="#FFA37D" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M10 13 L10 28 L24 35 L24 20 Z" fill="#FF8D5C" stroke="#E55925" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M24 20 L24 35 L38 28 L38 13 Z" fill="#FF6B35" stroke="#E55925" strokeWidth="1.2" strokeLinejoin="round" />
                    <circle cx="24" cy="13" r="5" fill="#E55925" />
                    <line x1="22" y1="13" x2="26" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="24" y1="11" x2="24" y2="15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              <span className="text-[10px] font-black text-center text-[#FF6B35] leading-tight mb-1 select-none">Add Product</span>
            </div>

            {/* Tile 2: RFQ Orders */}
            <div 
              onClick={() => setCurrentView('artisan-rfq-market')}
              className="bg-[#F0F4FF] border border-[#D8E2F8] rounded-[26px] py-4 px-1.5 flex flex-col items-center justify-between h-[135px] cursor-pointer active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(66,133,244,0.12)] hover:shadow-[0_14px_24px_-4px_rgba(66,133,244,0.18)] hover:-translate-y-0.5"
            >
              <div className="w-[58px] h-[58px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full object-contain" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(0, 2)">
                    <path d="M24 16 L38 23 L24 30 L10 23 Z" fill="#D2E3FC" stroke="#A8C7FA" strokeWidth="1.2" />
                    <path d="M10 23 L10 33 L24 40 L24 30 Z" fill="#4285F4" stroke="#1A73E8" strokeWidth="1.2" />
                    <path d="M24 30 L24 40 L38 33 L38 23 Z" fill="#1A73E8" stroke="#1557B0" strokeWidth="1.2" />
                    <path d="M24 4 L34 9 L24 14 L14 9 Z" fill="#ADCCF9" stroke="#7BAAF7" strokeWidth="1.2" />
                    <path d="M14 9 L14 19 L24 24 L24 14 Z" fill="#3B78E7" stroke="#1A73E8" strokeWidth="1.2" />
                    <path d="M24 14 L24 24 L34 19 L34 9 Z" fill="#185ABC" stroke="#1557B0" strokeWidth="1.2" />
                  </g>
                </svg>
              </div>
              <span className="text-[10px] font-black text-center text-stone-700 leading-tight mb-1 select-none">Custom Orders</span>
            </div>

            {/* Tile 3: Analytics */}
            <div 
              onClick={() => setCurrentView('analytics')}
              className="bg-[#FFFBEF] border border-[#F5E8C0] rounded-[26px] py-4 px-1.5 flex flex-col items-center justify-between h-[135px] cursor-pointer active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(234,162,0,0.12)] hover:shadow-[0_14px_24px_-4px_rgba(234,162,0,0.18)] hover:-translate-y-0.5"
            >
              <div className="w-[58px] h-[58px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full object-contain" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(0, 4)">
                    <path d="M11 20 L18 16 L25 20 L18 24 Z" fill="#FFE9B8" />
                    <path d="M11 20 L11 32 L18 36 L18 24 Z" fill="#EAA200" />
                    <path d="M18 24 L18 36 L25 32 L25 20 Z" fill="#FFC857" />
                    <path d="M18 13 L25 9 L32 13 L25 17 Z" fill="#FFD5C2" />
                    <path d="M18 13 L18 28 L25 32 L25 17 Z" fill="#CC5520" />
                    <path d="M25 17 L25 32 L32 28 L32 13 Z" fill="#FF6B35" />
                    <path d="M25 6 L32 2 L39 6 L32 10 Z" fill="#FFA57E" />
                    <path d="M25 6 L25 22 L32 26 L32 10 Z" fill="#B23C0E" />
                    <path d="M32 10 L32 26 L39 22 L39 6 Z" fill="#E55925" />
                  </g>
                </svg>
              </div>
              <span className="text-[10px] font-black text-center text-stone-700 leading-tight mb-1 select-none">Analytics</span>
            </div>

            {/* Tile 4: Wallet */}
            <div 
              onClick={() => setCurrentView('balance')}
              className="bg-[#FFF5F0] border border-[#F8DDD0] rounded-[26px] py-4 px-1.5 flex flex-col items-center justify-between h-[135px] cursor-pointer active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(142,79,42,0.12)] hover:shadow-[0_14px_24px_-4px_rgba(142,79,42,0.18)] hover:-translate-y-0.5"
            >
              <div className="w-[58px] h-[58px] flex items-center justify-center shrink-0">
                <svg className="w-full h-full object-contain" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(2, 2)">
                    <path d="M18 10 L28 4 L34 8 L24 14 Z" fill="#A8E8B2" />
                    <path d="M14 13 L24 7 L30 11 L20 17 Z" fill="#34A853" />
                    <path d="M8 18 L26 11 L36 17 L18 24 Z" fill="#C68A64" stroke="#9E5F3B" strokeWidth="1.2" />
                    <path d="M8 18 L8 30 L18 36 L18 24 Z" fill="#8E4F2A" stroke="#6F3B1D" strokeWidth="1.2" />
                    <path d="M18 24 L18 36 L36 29 L36 17 Z" fill="#A45E35" stroke="#8E4F2A" strokeWidth="1.2" />
                    <circle cx="26" cy="23" r="2.5" fill="#FFC857" stroke="#EAA200" strokeWidth="1" />
                  </g>
                </svg>
              </div>
              <span className="text-[10px] font-black text-center text-stone-700 leading-tight mb-1 select-none">Wallet</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT ORDERS & PROMO SECTION (SITS ON ORIGINAL BEIGE BACKGROUND) */}
      <div className="px-5 pt-3 pb-[68px] flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 bg-[#FFF8F1]">

        {/* RECENT ORDERS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[15px] font-bold text-[#1A1A1A]">Recent Orders</span>
            <span onClick={() => setCurrentView('orders')} className="text-xs font-semibold text-[#FF6B35] cursor-pointer hover:underline">View All ↗</span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Order 1: Banarasi Saree */}
            <div onClick={() => setCurrentView('orders')} className="bg-white rounded-xl p-3 flex items-center gap-2.5 border border-[#F5EDE4] hover:bg-[#FAF6F0] transition-colors cursor-pointer select-none">
              <div className="w-[48px] aspect-[4/5] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/saree_blue.png" alt="Banarasi Saree" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-[#1A1A1A] truncate">Banarasi Saree</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">Order ID: SS-2505-1023</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">28 May, 2025 • Qty: 2 pcs</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">Ready to Ship</span>
                <span className="text-sm font-bold text-[#1A1A1A]">₹4,999</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#BDBDBD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

            {/* Order 2: Handblock Fabric */}
            <div onClick={() => setCurrentView('orders')} className="bg-white rounded-xl p-3 flex items-center gap-2.5 border border-[#F5EDE4] hover:bg-[#FAF6F0] transition-colors cursor-pointer select-none">
              <div className="w-[48px] aspect-[4/5] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/saree_green.png" alt="Handblock Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-[#1A1A1A] truncate">Handblock Fabric</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">Order ID: SS-2505-1022</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">28 May, 2025 • Qty: 5 mtr</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#B06000]">Processing</span>
                <span className="text-sm font-bold text-[#1A1A1A]">₹2,350</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#BDBDBD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

            {/* Order 3: Embroidered Dupatta */}
            <div onClick={() => setCurrentView('orders')} className="bg-white rounded-xl p-3 flex items-center gap-2.5 border border-[#F5EDE4] hover:bg-[#FAF6F0] transition-colors cursor-pointer select-none">
              <div className="w-[48px] aspect-[4/5] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/stole_craft.png" alt="Embroidered Dupatta" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-[#1A1A1A] truncate">Embroidered Dupatta</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">Order ID: SS-2505-1021</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">27 May, 2025 • Qty: 1 pc</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">Ready to Ship</span>
                <span className="text-sm font-bold text-[#1A1A1A]">₹1,850</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#BDBDBD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

            {/* Order 4: Handblock Fabric */}
            <div onClick={() => setCurrentView('orders')} className="bg-white rounded-xl p-3 flex items-center gap-2.5 border border-[#F5EDE4] hover:bg-[#FAF6F0] transition-colors cursor-pointer select-none">
              <div className="w-[48px] aspect-[4/5] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/saree_green.png" alt="Handblock Fabric" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-[#1A1A1A] truncate">Handblock Fabric</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">Order ID: SS-2505-1022</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">28 May, 2025 • Qty: 5 mtr</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8E1] text-[#B06000]">Processing</span>
                <span className="text-sm font-bold text-[#1A1A1A]">₹2,350</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#BDBDBD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

            {/* Order 5: Embroidered Dupatta */}
            <div onClick={() => setCurrentView('orders')} className="bg-white rounded-xl p-3 flex items-center gap-2.5 border border-[#F5EDE4] hover:bg-[#FAF6F0] transition-colors cursor-pointer select-none">
              <div className="w-[48px] aspect-[4/5] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/stole_craft.png" alt="Embroidered Dupatta" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-[#1A1A1A] truncate">Embroidered Dupatta</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">Order ID: SS-2505-1021</div>
                <div className="text-[10px] text-[#9B9B9B] mt-0.5">27 May, 2025 • Qty: 1 pc</div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">Ready to Ship</span>
                <span className="text-sm font-bold text-[#1A1A1A]">₹1,850</span>
              </div>
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#BDBDBD] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* AI PROMO CARD */}
        <div className="bg-[#FFF0F3] border-t border-[#FFE0E6] p-4 -mx-5 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] mt-auto shrink-0">
          <div className="flex items-center gap-3">
            {/* Boxy Robot Head Illustration */}
            <div className="w-10 h-10 shrink-0">
              <svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect width="46" height="46" rx="10" fill="#FFF3EB" />
                <rect x="13" y="16" width="20" height="16" rx="4" fill="#FF6B35" opacity="0.15" />
                <rect x="15" y="18" width="16" height="12" rx="3" fill="#FF6B35" opacity="0.25" />
                <rect x="17" y="18" width="12" height="8" rx="2" fill="#fff" />
                <circle cx="20" cy="22" r="2" fill="#FF6B35" />
                <circle cx="26" cy="22" r="2" fill="#FF6B35" />
                <rect x="20" y="26" width="6" height="1.5" rx="0.75" fill="#1A1A1A" opacity="0.3" />
                <rect x="21" y="15" width="4" height="4" rx="1" fill="#FFC857" />
                <circle cx="23" cy="14" r="1.5" fill="#FF6B35" />
                <rect x="11" y="22" width="3" height="5" rx="1.5" fill="#FFC857" opacity="0.6" />
                <rect x="32" y="22" width="3" height="5" rx="1.5" fill="#FFC857" opacity="0.6" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-stone-850">Grow your craft with AI</h4>
              <span className="text-[10px] text-stone-500 font-bold block mt-0.5">Get smart tips to sell more!</span>
            </div>
          </div>

          {/* Sparkles button */}
          <button 
            onClick={() => setCurrentView('add-product')}
            className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow shadow-primary/20 hover:bg-[#E55A25] transition-all active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white text-white" fill="currentColor">
              <path d="M12 3a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm0 14a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4 12a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm14 0a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1zM5.636 5.636a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414L5.636 7.05a1 1 0 0 1 0-1.414zm11.314 11.314a1 1 0 0 1 1.414 0l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414zM7.05 18.364a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0zm11.314-11.314a1 1 0 0 1 0-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414a1 1 0 0 1-1.414 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
