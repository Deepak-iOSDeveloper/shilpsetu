import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { User, Store, ChevronRight, Globe } from 'lucide-react';

export const RoleSelection: React.FC = () => {
const { setActiveRole, setCurrentView, loginWithGoogle } = useApp();
  const [selected, setSelected] = useState<'ARTISAN' | 'BRAND' | null>(null);

  const handleContinue = () => {
    if (selected) {
      setActiveRole(selected);
      setCurrentView('signup-basic');
    } else {
      alert("Please select a role to continue.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 pb-8 bg-[#FFFBF7]">
      {/* Top Section: Logo & Tagline */}
      <div className="flex-grow flex flex-col justify-center items-center py-8">
        {/* Bridge Motif logo */}
        <div className="flex flex-col items-center gap-1">
          <img src="/logo.png" alt="Shilp Setu Logo" className="w-36 h-auto object-contain" />
        </div>

        {/* Mid Section: Role Selection Heading */}
        <div className="text-center mt-12 mb-6">
          <h2 className="text-2xl font-bold font-heading text-stone-850">Choose how you want to continue</h2>
          <p className="text-sm text-text-secondary mt-1">We'll personalize your experience</p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-2">
          {/* Artisan Card */}
          <button
            onClick={() => setSelected('ARTISAN')}
            className={`text-left transition-all duration-300 relative flex flex-col justify-between p-4 rounded-3xl h-52 bg-white border-2 ${
              selected === 'ARTISAN' 
                ? 'border-[#FF6B35] ring-2 ring-orange-500/10 scale-[1.02] shadow-md' 
                : 'border-stone-200/60 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF5F1] flex items-center justify-center text-[#FF6B35]">
                <User className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <ChevronRight className={`w-5 h-5 text-stone-400 ${selected === 'ARTISAN' ? 'text-[#FF6B35]' : ''}`} />
            </div>
            
            {/* Cute Weaver/Artisan SVG Illustration */}
            <div className="my-2 h-16 flex items-center justify-center opacity-85">
              <svg viewBox="0 0 100 80" className="h-full">
                <rect x="25" y="10" width="50" height="60" rx="3" fill="none" stroke="#EAA885" strokeWidth="4" />
                <line x1="35" y1="10" x2="35" y2="70" stroke="#FF6B35" strokeWidth="2" />
                <line x1="45" y1="10" x2="45" y2="70" stroke="#FF6B35" strokeWidth="2" />
                <line x1="55" y1="10" x2="55" y2="70" stroke="#FF6B35" strokeWidth="2" />
                <line x1="65" y1="10" x2="65" y2="70" stroke="#FF6B35" strokeWidth="2" />
                <path d="M20,60 Q50,45 80,60" fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <span className="font-heading font-black text-xs text-stone-850 block">Artisan / Seller</span>
              <span className="text-[9px] text-text-secondary leading-tight block mt-1 font-bold">Sell products, manage inventory, receive orders</span>
            </div>
          </button>

          {/* Brand/Buyer Card */}
          <button
            onClick={() => setSelected('BRAND')}
            className={`text-left transition-all duration-300 relative flex flex-col justify-between p-4 rounded-3xl h-52 bg-white border-2 ${
              selected === 'BRAND' 
                ? 'border-[#FF6B35] ring-2 ring-orange-500/10 scale-[1.02] shadow-md' 
                : 'border-stone-200/60 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                <Store className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <ChevronRight className={`w-5 h-5 text-stone-400 ${selected === 'BRAND' ? 'text-[#FF6B35]' : ''}`} />
            </div>

            {/* Storefront SVG Illustration */}
            <div className="my-2 h-16 flex items-center justify-center opacity-85">
              <svg viewBox="0 0 100 80" className="h-full">
                <path d="M15,35 L85,35 L75,15 L25,15 Z" fill="#2E7D32" />
                <path d="M15,35 L20,42 L25,35 L30,42 L35,35 L40,42 L45,35 L50,42 L55,35 L60,42 L65,35 L70,42 L75,35 L80,42 L85,35" fill="none" stroke="#FFC857" strokeWidth="3" />
                <rect x="25" y="42" width="50" height="28" fill="none" stroke="#2E7D32" strokeWidth="4" />
                <rect x="40" y="52" width="20" height="18" fill="#FFC857" opacity="0.2" />
              </svg>
            </div>

            <div>
              <span className="font-heading font-black text-xs text-stone-850 block">Brand / Buyer</span>
              <span className="text-[9px] text-text-secondary leading-tight block mt-1 font-bold">Source artisans, sync inventory, place custom orders</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Section: Actions & Language Selector */}
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        <Button 
          variant={selected ? 'primary' : 'outline'} 
          onClick={handleContinue}
          showArrow={true}
          disabled={!selected}
          className={!selected ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Continue
        </Button>


        
        <div className="flex flex-col items-center gap-1.5 text-xs font-bold text-[#B3562C]">
          <div className="flex gap-2">
            <span>Already have an account?</span>
            <button 
              onClick={() => {
                setCurrentView('login');
              }}
              className="text-[#FF6B35] font-black hover:underline"
            >
              Login
            </button>
          </div>
        </div>

        {/* Language selector pill */}
        <div className="flex justify-start mt-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#FF6B35]/10 rounded-full text-xs font-bold text-text-primary shadow-sm hover:bg-stone-50">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>English ▾</span>
          </button>
        </div>
      </div>
    </div>
  );
};
