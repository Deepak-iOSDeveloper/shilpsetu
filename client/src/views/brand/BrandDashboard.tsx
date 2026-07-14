import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { IconTile } from '../../components/IconTile';
import { 
  Bell, Lock, CreditCard, ChevronRight, Sparkles, 
  RefreshCw, ClipboardList, ShoppingBag, Store, FolderOpen, Globe, Layers, Settings, MessageSquare, Wallet
} from 'lucide-react';

export const BrandDashboard: React.FC = () => {
  const { 
    currentUser, brandProfile, wallets, orders, rfqs, 
    setCurrentView, rechargeWallet, notifications 
  } = useApp();

  const [logo, setLogo] = React.useState<string | null>(() => {
    return localStorage.getItem('brandLogo') || null;
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setLogo(result);
          localStorage.setItem('brandLogo', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const brandWallet = wallets[currentUser?.uid || 'brand-1'] || { balance: 0, reservedAmount: 0 };
  const unreadNotifs = notifications.filter(n => !n.read && n.uid === currentUser?.uid);

  // Stats counters
  const syncedInventoryCount = 2; // mock
  const activeRfqsCount = rfqs.length;
  const openOrdersCount = orders.filter(o => o.status !== 'delivered').length;
  const savedSuppliersCount = 6; // mock

  // Featured Crafts lists
  const featuredCrafts = [
    { name: 'Banarasi Saree', image: '/banarasi_saree_craft.png' },
    { name: 'Maheshwari Saree', image: '/maheshwari_craft.png' },
    { name: 'Jamdani Saree', image: '/jamdani_saree_craft.png' },
    { name: 'Bhagalpur Silk Saree', image: '/bhagalpur_silk_saree_craft.png' },
  ];

  const recentOrder = orders[0];

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col z-10 font-sans text-left overflow-hidden select-none">
      {/* Header */}
      <div 
        className="p-6 pb-10 flex flex-col relative bg-cover overflow-hidden border-b border-[#F0E8DC] shadow-xs shrink-0"
        style={{ backgroundImage: "url('/brand_banner.png')", backgroundPosition: "center 35%" }}
      >
        <div className="flex justify-between items-center relative z-10">
          {/* Left Side: Profile Info (Avatar + Name/Sub) */}
          <div className="flex items-center gap-3">
            {/* Clickable round white profile icon for logo upload */}
            <div 
              onClick={() => setCurrentView('profile')}
              className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-stone-850 shrink-0 shadow-sm cursor-pointer overflow-hidden group relative hover:scale-102 transition-all active:scale-98"
              title="Click to view brand profile"
            >
              {logo ? (
                <img src={logo} alt="Brand Logo" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-7 h-7 text-stone-700 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              )}
              {/* Overlay edit banner */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-black text-white uppercase tracking-wider">Account</span>
              </div>
            </div>
            
            {/* Hidden logo file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              className="hidden" 
              onChange={handleLogoUpload} 
            />

            <div>
              <h2 className="text-xl font-black text-stone-900 leading-tight">
                {brandProfile?.brandName || currentUser?.name || 'Ananya Goel'}
              </h2>
              <span className="text-[11px] text-stone-600 font-bold block mt-0.5">
                Welcom to Shilp Setu
              </span>
            </div>
          </div>

          {/* Right Side: Message + Notification Bell */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentView('messages')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center relative hover:bg-stone-50 transition-all animate-press"
            >
              <MessageSquare className="w-5 h-5 text-stone-700" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF511A] rounded-full border border-white" />
            </button>

            <button 
              onClick={() => setCurrentView('notifications')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center relative hover:bg-stone-50 transition-all"
            >
              <Bell className="w-5 h-5 text-stone-700" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF511A] rounded-full border border-white" />
            </button>
          </div>
        </div>
        
        {/* Website Setup Button Pill */}
        <div 
          onClick={() => setCurrentView('store-integration')}
          className="inline-flex items-center gap-1.5 bg-stone-900/10 backdrop-blur-xs border border-stone-850/20 rounded-full px-3.5 py-1.5 mt-4 shadow-xs cursor-pointer hover:bg-stone-900/20 transition-all select-none self-start relative z-10"
        >
          <Globe className="w-[15px] h-[15px] text-stone-700" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-stone-850 tracking-tight">
            Website Setup (Shopify, Woocom & Others)
          </span>
        </div>
      </div>

      {/* 2. FROZEN MAIN SECTION (Non-scrollable container) */}
      <div className="px-5 pt-7 flex flex-col gap-6 bg-[#FFF8F1] rounded-t-[40px] -mt-6 relative z-10 shadow-[0_-8px_32px_rgba(0,0,0,0.03)] border-t border-white/40 shrink-0">
        
        {/* QUICK ACTIONS SECTION */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-3 text-left">Quick Actions</span>
          <div className="grid grid-cols-4 gap-2">
            
            {/* Tile 1: View Synced */}
            <button 
              onClick={() => setCurrentView('inventory-sync-viewed')}
              className="bg-white border border-stone-150 rounded-2xl p-2 text-center flex flex-col items-center justify-between h-[115px] hover:border-primary/20 transition-all shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-100/75 flex items-center justify-center text-[#FF6B35]">
                <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black text-stone-900 mt-1 block">{syncedInventoryCount}</span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider leading-none mb-1">View Synced</span>
            </button>

            {/* Tile 2: Active RFQs */}
            <button 
              onClick={() => setCurrentView('rfq-market')}
              className="bg-white border border-stone-150 rounded-2xl p-2 text-center flex flex-col items-center justify-between h-[115px] hover:border-primary/20 transition-all shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100/75 flex items-center justify-center text-amber-600">
                <ClipboardList className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black text-stone-900 mt-1 block">{activeRfqsCount}</span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider leading-none mb-1">Active Custom</span>
            </button>

            {/* Tile 3: Collections */}
            <button 
              onClick={() => setCurrentView('collections-list')}
              className="bg-white border border-stone-150 rounded-2xl p-2 text-center flex flex-col items-center justify-between h-[115px] hover:border-primary/20 transition-all shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100/75 flex items-center justify-center text-blue-600">
                <FolderOpen className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black text-stone-900 mt-1 block">5</span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider leading-none mb-1">Collections</span>
            </button>

            {/* Tile 4: Wallet */}
            <button 
              onClick={() => setCurrentView('balance')}
              className="bg-white border border-stone-150 rounded-2xl p-2 text-center flex flex-col items-center justify-between h-[115px] hover:border-primary/20 transition-all shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100/75 flex items-center justify-center text-emerald-600">
                <Wallet className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-black text-stone-900 mt-1 block">₹{brandWallet.balance.toLocaleString('en-IN')}</span>
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider leading-none mb-1">Wallet</span>
            </button>

          </div>
        </div>

        {/* Featured Indian Crafts */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-heading font-black text-base text-stone-900">Featured Indian Crafts</h3>
            <button 
              onClick={() => setCurrentView('inventory-sync')}
              className="text-xs font-bold text-[#FF511A] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-1">
            {featuredCrafts.map((craft, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentView('inventory-sync')}
                className="flex flex-col items-start text-left shrink-0 w-28 group"
              >
                <div className="w-24 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200 group-hover:shadow-md transition-all relative">
                  <img src={craft.image} alt={craft.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <span className="text-xs font-bold text-stone-850 mt-1.5 truncate w-full">{craft.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SCROLLABLE RECENT SOURCING ORDERS CONTAINER */}
      <div className="px-5 pt-5 pb-[86px] flex-1 overflow-y-auto no-scrollbar bg-[#FFF8F1] flex flex-col gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-stone-450 block mb-3 text-left">Recent Sourcing Orders</span>
          
          <div className="flex flex-col gap-3">
            {/* Order Card 1 */}
            <div 
              onClick={() => setCurrentView('orders')}
              className="bg-white rounded-3xl p-4 border border-[#F0E8DC] hover:border-primary/25 cursor-pointer shadow-xs flex items-center gap-3.5 select-none"
            >
              <div className="w-16 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/saree_purple.png" alt="Kadwa Banarasi" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-extrabold text-stone-900 truncate">Kadwa Banarasi Weaving (Textiles)</div>
                <div className="text-[10px] font-black text-stone-400 mt-1 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded inline-block">ORD-944160</div>
                <div className="text-[11px] text-stone-500 font-bold mt-2">Expected: 2026-08-22</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-sm font-black text-stone-900">₹13,00,000</span>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF511A] tracking-wider uppercase">Placed</span>
              </div>
            </div>

            {/* Order Card 2 */}
            <div 
              onClick={() => setCurrentView('orders')}
              className="bg-white rounded-3xl p-4 border border-[#F0E8DC] hover:border-primary/25 cursor-pointer shadow-xs flex items-center gap-3.5 select-none"
            >
              <div className="w-16 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                <img src="/pashmina_craft.png" alt="Chikankari Kurta" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-extrabold text-stone-900 truncate">Pashmina Woolen Shawls</div>
                <div className="text-[10px] font-black text-stone-400 mt-1 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded inline-block">ORD-944158</div>
                <div className="text-[11px] text-stone-500 font-bold mt-2">Expected: 2026-08-15</div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-sm font-black text-stone-900">₹4,50,000</span>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 tracking-wider uppercase">Processing</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Internal icon mini components
const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const PaperAirplaneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 45 L85 15 L55 85 L44 56 Z" stroke="#4A4A4A" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M44 56 L65 35" stroke="#0066FF" strokeWidth="9" strokeLinecap="round" />
  </svg>
);
