import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Search, Lock, CreditCard, 
  ArrowUpRight, ArrowDownLeft, CheckCircle2, X 
} from 'lucide-react';

export const BrandBalance: React.FC = () => {
  const { wallets, rechargeWallet, setCurrentView } = useApp();
  const brandWallet = wallets['brand-1'] || { balance: 0, reservedAmount: 0, transactions: [] };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Recharge modal states
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('10000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle mock recharge submission
  const handleRecharge = () => {
    const amt = parseFloat(rechargeAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount to recharge.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      rechargeWallet('brand-1', amt);
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowRechargeModal(false);
      }, 1500);
    }, 1200);
  };

  // Helper to format date into Paytm-style (e.g., "20 Jun 2026, 03:30 PM")
  const formatTxDate = (dateStr: string) => {
    // If date format is just YYYY-MM-DD
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      return `${day} ${months[monthIdx]} ${year}, 02:30 PM`;
    }
    return dateStr;
  };

  // Helper to get initials for circular icon
  const getInitials = (desc: string) => {
    if (desc.toLowerCase().includes('recharge') || desc.toLowerCase().includes('added')) return 'W';
    if (desc.toLowerCase().includes('ramesh')) return 'RK';
    if (desc.toLowerCase().includes('naaz')) return 'NB';
    const words = desc.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return desc.slice(0, 2).toUpperCase();
  };

  // Filter transactions
  const filteredTx = (brandWallet.transactions || [])
    .filter(tx => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = tx.description.toLowerCase().includes(query) || 
                            tx.id.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
      if (activeFilter === 'Payments') return tx.type === 'debit';
      if (activeFilter === 'Added Money') return tx.type === 'credit';
      return true;
    });

  return (
    <div className={`absolute inset-0 bg-[#FFF8F1] flex flex-col text-left overflow-hidden font-sans ${showRechargeModal ? 'z-50' : 'z-10'}`}>
      
      {/* 1. HEADER */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <div>
            <h2 className="font-heading font-black text-lg text-stone-850">Wallet & Payments</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Escrow history and balance statements
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN SCROLLABLE CONTAINER */}
      <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-[96px]">
        
        {/* WALLET BALANCE CARD (Plum to Orange gradient matching reference exactly, without Razorpay Safeguard text) */}
        <div className="bg-gradient-to-r from-[#5f0f24] to-[#d64527] rounded-3xl p-6 text-white flex flex-col shadow-lg border border-red-950/20 shrink-0 relative overflow-hidden">
          {/* Top Info section */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-rose-200 uppercase tracking-widest">
                Wallet Balance
              </span>
              <span className="text-[30px] font-black tracking-tight leading-none">
                ₹{brandWallet.balance.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex flex-col items-end gap-1 text-right">
              <span className="text-[9px] font-black text-rose-200 uppercase tracking-widest">
                Reserved (Escrow)
              </span>
              <div className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-rose-200" strokeWidth={2.8} />
                <span className="text-lg font-black">
                  ₹{brandWallet.reservedAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/15 my-4 w-full"></div>

          {/* Bottom Action Row (No Razorpay safeguards text, only Recharge button on right) */}
          <div className="flex justify-between items-center w-full">
            <div>
              {/* Left side empty as per user instruction: remove safeguard text */}
            </div>
            
            <button 
              onClick={() => setShowRechargeModal(true)}
              className="bg-white hover:bg-stone-50 text-stone-900 font-black text-[11px] px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all select-none self-end"
            >
              <CreditCard className="w-3.5 h-3.5 text-stone-900" />
              <span>Recharge</span>
            </button>
          </div>
        </div>

        {/* 3. PAYTM-INSPIRED TRANSACTION HISTORY SECTION */}
        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-black text-sm text-stone-850">Payment History</h3>
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Statement Details</span>
          </div>

          {/* Paytm-style Search Bar */}
          <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-sm flex items-center gap-2">
            <Search className="w-5 h-5 text-stone-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reference, order ID..."
              className="w-full text-xs font-bold text-stone-800 placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
            />
          </div>

          {/* Paytm-style Horizontal tab filters */}
          <div className="flex gap-2 py-0.5 overflow-x-auto no-scrollbar shrink-0">
            {['All', 'Payments', 'Added Money'].map(tab => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${
                    isActive 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Paytm-inspired Transactions list */}
          <div className="bg-white rounded-3xl border border-stone-150 overflow-hidden shadow-xs flex flex-col">
            {filteredTx.length > 0 ? (
              filteredTx.map((tx, idx) => {
                const isDebit = tx.type === 'debit';
                const initials = getInitials(tx.description);
                const formattedDate = formatTxDate(tx.date);

                return (
                  <div 
                    key={tx.id} 
                    className="p-4 flex justify-between items-center border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors"
                  >
                    {/* Left: circular icon with initials */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-inner text-xs font-black ${
                        isDebit 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                          : 'bg-green-50 text-green-700 border border-green-100/50'
                      }`}>
                        {initials}
                      </div>
                      
                      <div className="text-left min-w-0 flex-1">
                        <h4 className="text-xs font-black text-stone-900 truncate leading-snug">
                          {tx.description}
                        </h4>
                        <span className="text-[9.5px] text-stone-400 font-bold block mt-1.5">
                          {formattedDate}
                        </span>
                        <span className="text-[8.5px] text-stone-400 font-bold font-mono mt-0.5 block">
                          Ref No: {tx.id}
                        </span>
                      </div>
                    </div>

                    {/* Right: amount & status */}
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                      <span className={`text-[13px] font-black ${isDebit ? 'text-stone-900' : 'text-green-600'}`}>
                        {isDebit ? '-' : '+'} ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[8.5px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-wider">
                        Success
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 bg-stone-50 border border-stone-200 rounded-full flex items-center justify-center text-stone-300">
                  ⚡
                </div>
                <span>No transactions match your search filter.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {showRechargeModal && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-4 pb-8">
          <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 border border-stone-200 animate-slideUp">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 shrink-0">
              <h3 className="font-heading font-black text-base text-stone-850">Recharge Wallet</h3>
              <button 
                onClick={() => setShowRechargeModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* Simulated payment loading state */}
            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <svg className="animate-spin h-8 w-8 text-[#FF6B35]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-xs font-bold text-stone-600">Processing secure payment...</span>
              </div>
            ) : showSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-green-600 animate-scaleUp">
                <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2.5} />
                <span className="text-xs font-black">Money Added Successfully!</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1 w-full text-left">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Amount to Add (₹)</label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl h-12 px-3.5 focus-within:border-[#FF6B35] focus-within:bg-white transition-all">
                    <span className="text-stone-400 font-bold mr-1 text-sm">₹</span>
                    <input
                      type="number"
                      value={rechargeAmount}
                      onChange={(e) => setRechargeAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-transparent text-sm font-black text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preset quick actions */}
                <div className="grid grid-cols-4 gap-2">
                  {['2000', '5000', '10000', '25000'].map(val => (
                    <button
                      key={val}
                      onClick={() => setRechargeAmount(val)}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${
                        rechargeAmount === val
                          ? 'border-[#FF6B35] bg-[#FFF5F1] text-[#FF6B35]'
                          : 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50'
                      }`}
                    >
                      +₹{parseInt(val).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setShowRechargeModal(false)}
                    className="flex-1 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRecharge}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-2xl shadow-md transition-all"
                  >
                    Pay & Recharge
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
