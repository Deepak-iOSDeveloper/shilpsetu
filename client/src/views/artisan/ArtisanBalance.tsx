import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Search, SlidersHorizontal, Download, 
  X, Check, Info, CreditCard, Landmark, Send, ArrowLeft
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  amount: number;
  timestamp: string;
  details: string;
  labelType: string;
  type: string;
}

export const ArtisanBalance: React.FC = () => {
  const { setCurrentView } = useApp();

  // Balance and Withdrawal States
  const [walletBalance, setWalletBalance] = useState(12450);
  const [activeTab, setActiveTab] = useState<'completed' | 'upcoming'>('completed');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'Bank' | 'UPI'>('UPI');
  const [withdrawAmount, setWithdrawAmount] = useState('12450');
  const [upiInput, setUpiInput] = useState('ramesh@okaxis');
  const [bankAccountInput, setBankAccountInput] = useState('12345678901');

  // Dynamic Payment History matching user specifications
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: 'ORD-2026-1050', amount: 22500, timestamp: '30 Jun 2026', details: 'Indie Weaves Co.', labelType: 'Payment Received', type: 'completed' },
    { id: 'ORD-2026-1045', amount: 60000, timestamp: '27 Jun 2026', details: 'Kala Threads', labelType: 'Final Payment', type: 'completed' },
    { id: 'ORD-2026-1038', amount: 15000, timestamp: '24 Jun 2026', details: 'Rangrez Lifestyle', labelType: 'Partial Payment', type: 'completed' },
    { id: 'ORD-2026-1031', amount: 40000, timestamp: '20 Jun 2026', details: 'Craft Heritage', labelType: 'Payment Received', type: 'completed' },
    { id: 'ORD-2026-1025', amount: 7500, timestamp: '16 Jun 2026', details: 'WeaveKart', labelType: 'Advance Payment', type: 'completed' },
    { id: 'ORD-2026-1018', amount: 18000, timestamp: '12 Jun 2026', details: 'LoomCraft Studio', labelType: 'Payment Received', type: 'completed' },
    { id: 'ORD-2026-1012', amount: 50000, timestamp: '09 Jun 2026', details: 'Vastra Culture', labelType: 'Payment Received', type: 'completed' },
    { id: 'ORD-2026-1007', amount: 12500, timestamp: '05 Jun 2026', details: 'Ethnic Threads India', labelType: 'Advance Payment', type: 'completed' },
    { id: 'ORD-2026-1001', amount: 25000, timestamp: '02 Jun 2026', details: 'Heritage Looms Pvt. Ltd.', labelType: 'Payment Received', type: 'completed' }
  ]);

  const upcomingPayments = [
    { id: 'u1', amount: 4500, timestamp: 'Expected: 5 July 2025', details: 'Escrow Lock - Order SS10023', type: 'upcoming' },
    { id: 'u2', amount: 12000, timestamp: 'Expected: 12 July 2025', details: 'Escrow Lock - Order SS10027', type: 'upcoming' }
  ];

  const handleWithdrawSubmit = () => {
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }

    if (amountNum > walletBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    if (withdrawMethod === 'UPI' && !upiInput.trim()) {
      alert("Please enter a valid UPI ID.");
      return;
    }

    if (withdrawMethod === 'Bank' && !bankAccountInput.trim()) {
      alert("Please enter a valid bank account number.");
      return;
    }

    // Deduct balance
    setWalletBalance(prev => prev - amountNum);

    // Append new transaction record to payment history list
    const newTx: PaymentRecord = {
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      amount: amountNum,
      timestamp: 'Just now',
      details: withdrawMethod === 'UPI' ? `${upiInput} • UPI` : `${bankAccountInput.slice(-4)} • Bank Payout`,
      labelType: 'Payout Requested',
      type: 'completed'
    };

    setPayments(prev => [newTx, ...prev]);
    setShowWithdrawModal(false);
    
    alert(`Withdrawal of ₹${amountNum.toLocaleString('en-IN')} requested successfully! Fund settlement takes 2-4 hours.`);
  };

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col z-10 text-left overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-stone-800" />
          </button>
          <div>
            <h2 className="font-heading font-black text-xl text-stone-850">Balance & History</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Monitor earnings and request payouts
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-[96px]">
        
        {/* 2. WALLET BALANCE CARD (Gradient maroon matching mockup screenshot) */}
        <div className="bg-gradient-to-r from-[#63182E] to-[#420A1A] rounded-3xl p-6 text-white flex justify-between items-center shadow-lg border border-red-950/20">
          <div className="flex flex-col gap-1.5 text-left">
            <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest">
              Wallet Balance
            </span>
            <span className="text-3xl font-heading font-black">
              ₹{walletBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => {
              if (walletBalance <= 0) {
                alert("Your wallet balance is ₹0. No funds to withdraw.");
                return;
              }
              setWithdrawAmount(walletBalance.toString());
              setShowWithdrawModal(true);
            }}
            className="px-5 py-2.5 bg-white text-[#63182E] text-xs font-black rounded-xl shadow-md hover:bg-stone-50 transition-all active:scale-95 shrink-0"
          >
            Withdraw
          </button>
        </div>

        {/* 3. PAYMENT HISTORY SECTION */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-black text-sm text-stone-850">Payment History</h3>
            
            <div className="flex items-center gap-2">
              <button className="w-8.5 h-8.5 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                <Search className="w-4 h-4 text-stone-600" />
              </button>
              <button className="w-8.5 h-8.5 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-stone-600" />
              </button>
              <button 
                onClick={() => alert("Downloading payment statement PDF...")}
                className="w-8.5 h-8.5 rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-sm"
              >
                <Download className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Horizontal Tabs: Completed vs Upcoming */}
          <div className="bg-white border-b border-stone-150 p-1 flex">
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-xs font-black text-center border-b-2 transition-all ${
                activeTab === 'completed' 
                  ? 'border-[#FF6B35] text-stone-850' 
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Completed Payments
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-3 text-xs font-black text-center border-b-2 transition-all ${
                activeTab === 'upcoming' 
                  ? 'border-[#FF6B35] text-stone-850' 
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Upcoming Payments
            </button>
          </div>

          {/* Rows List */}
          <div className="flex flex-col gap-3">
            {activeTab === 'completed' ? (
              payments.map((p) => {
                const isWithdrawal = p.labelType === 'Payout Requested' || p.id.startsWith('TX-');
                return (
                  <div 
                    key={p.id} 
                    className="bg-white rounded-2xl p-4 border border-stone-150 flex items-center justify-between shadow-sm select-none"
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className={`text-sm font-black ${isWithdrawal ? 'text-stone-800' : 'text-green-600'}`}>
                        {isWithdrawal ? '-' : '+'}₹{p.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-stone-400 font-extrabold">
                        {p.timestamp}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-stone-850">
                        {p.details}
                      </span>
                      <span className="text-[8.5px] text-[#FF6B35] font-black uppercase tracking-wider">
                        {p.labelType} • {p.id}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              upcomingPayments.map((p) => (
                <div 
                  key={p.id} 
                  className="bg-white rounded-2xl p-4 border border-stone-150 flex items-center justify-between shadow-sm select-none"
                >
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-sm font-black text-amber-600">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-[#FF6B35] font-black uppercase tracking-wider">
                      {p.timestamp}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-extrabold text-stone-600">
                      {p.details}
                    </span>
                    <span className="text-[8px] text-amber-500 font-black bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Escrow Locked
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. WITHDRAW FUND MODAL (Bank vs UPI selectors and input forms) */}
      {/* ============================================================== */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-5 border border-primary/5 animate-slideUp">
            
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-stone-850">Withdraw Funds</h3>
                <span className="text-[10px] text-[#63182E] font-black uppercase tracking-wider mt-0.5">Available: ₹{walletBalance}</span>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)} 
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-95"
              >
                <X className="w-4 h-4 text-stone-650" />
              </button>
            </div>

            {/* Amount input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-text-secondary uppercase">Amount to Withdraw (₹)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full text-sm font-black text-stone-850 bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#63182E] focus:bg-white"
              />
            </div>

            {/* Payment Method Selector Grid */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-text-secondary uppercase">Preferred Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setWithdrawMethod('UPI')}
                  className={`py-3.5 rounded-2xl border font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                    withdrawMethod === 'UPI'
                      ? 'border-[#63182E] bg-[#FFF2EE] text-[#63182E]'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>UPI Payout</span>
                </button>

                <button
                  onClick={() => setWithdrawMethod('Bank')}
                  className={`py-3.5 rounded-2xl border font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                    withdrawMethod === 'Bank'
                      ? 'border-[#63182E] bg-[#FFF2EE] text-[#63182E]'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>Bank Payout</span>
                </button>
              </div>
            </div>

            {/* Conditional Input forms based on Payout selection */}
            {withdrawMethod === 'UPI' ? (
              <div className="flex flex-col gap-1.5 bg-[#FFF2EE]/40 border border-[#FF6B35]/15 p-4 rounded-2xl animate-fadeIn">
                <label className="text-[9px] font-black text-text-secondary uppercase">Enter UPI ID</label>
                <input
                  type="text"
                  value={upiInput}
                  onChange={(e) => setUpiInput(e.target.value)}
                  placeholder="e.g. ramesh@okaxis"
                  className="w-full text-xs font-bold text-text-primary bg-white border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#63182E]"
                />
                <span className="text-[8px] text-stone-400 font-bold block mt-1">
                  UPI payments settle instantly via IMPS network.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 bg-[#FFF2EE]/40 border border-[#FF6B35]/15 p-4 rounded-2xl animate-fadeIn">
                <label className="text-[9px] font-black text-text-secondary uppercase">Enter Bank Account Number</label>
                <input
                  type="text"
                  value={bankAccountInput}
                  onChange={(e) => setBankAccountInput(e.target.value)}
                  placeholder="e.g. 12345678901"
                  className="w-full text-xs font-bold text-text-primary bg-white border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#63182E]"
                />
                <span className="text-[8px] text-stone-400 font-bold block mt-1">
                  Bank payouts settle in 1 business day via NEFT.
                </span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 mt-1.5">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
              >
                Cancel
              </button>
              
              <button
                onClick={handleWithdrawSubmit}
                className="flex-1 py-3.5 bg-[#63182E] hover:bg-[#4E1022] text-white text-xs font-black rounded-2xl shadow-md transition-all"
              >
                Confirm Payout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
