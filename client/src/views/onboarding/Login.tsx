import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { ChevronLeft, Phone, Mail, Sparkles, CheckCircle2, User, Store, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../supabase/supabaseClient';

export const Login: React.FC = () => {
  const { setActiveRole, setCurrentView, registerUser, loginWithEmail } = useApp();
  const [role, setRole] = useState<'ARTISAN' | 'BRAND'>('ARTISAN');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [brandName, setBrandName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      alert("Please enter your Email address.");
      return;
    }
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      await loginWithEmail(loginInput, password, role);
    } catch (err: any) {
      alert("Error logging in: " + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFFBF7] relative select-none">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 textile-pattern-divider opacity-10" />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentView('role-selection')}
            className="w-10 h-10 rounded-full border border-[#FF6B35]/10 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <span className="text-xs font-bold text-[#FF6B35]">LOGIN</span>
        </div>

        <div className="mt-8 mb-8 text-left">
          <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">Welcome Back</h2>
          <p className="text-sm text-[#6B6B6B] mt-1.5">Enter your details to sign in to your workspace</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl mb-6 border border-stone-200/50">
          <button
            onClick={() => setRole('ARTISAN')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'ARTISAN' 
                ? 'bg-white text-[#FF6B35] shadow-sm font-black' 
                : 'text-stone-500 hover:text-stone-850'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>🌾 Artisan / Seller</span>
          </button>
          <button
            onClick={() => setRole('BRAND')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'BRAND' 
                ? 'bg-white text-green-700 shadow-sm font-black' 
                : 'text-stone-500 hover:text-stone-850'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🛍 Brand / Buyer</span>
          </button>
        </div>

        {/* Input field card */}
        {/* Input field card */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email field */}
          <div className="bg-white rounded-2xl p-2 border border-[#FF6B35]/5 shadow-premium flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-orange-50 text-[#FF6B35]">
              <Mail className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pr-3 text-left">
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">Email Address *</label>
              <input
                type="email"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="name@brand.com"
                className="w-full text-sm font-bold text-[#1A1A1A] placeholder:text-stone-300 focus:outline-none bg-transparent mt-0.5"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="bg-white rounded-2xl p-2 border border-[#FF6B35]/5 shadow-premium flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#FF6B35]/15 text-[#FF6B35]">
              <Lock className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div className="flex-1 pr-3 text-left">
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm font-bold text-[#1A1A1A] placeholder:text-stone-300 focus:outline-none bg-transparent mt-0.5"
                required
              />
            </div>
          </div>

          <Button 
            variant="primary" 
            type="submit"
            className="w-full py-4 rounded-3xl mt-4 font-black"
          >
            Login
          </Button>
        </form>
      </div>

      {/* Sign Up Link */}
      <div className="text-xs font-bold text-[#B3562C] mt-6 flex justify-center gap-1.5">
        <span>Don't have an account?</span>
        <button 
          onClick={() => setCurrentView('role-selection')}
          className="text-[#FF6B35] font-black hover:underline"
        >
          Sign Up
        </button>
      </div>

    </div>
  );
};
