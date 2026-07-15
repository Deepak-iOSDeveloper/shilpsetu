import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { 
  ChevronLeft, Search, Filter, ClipboardList, 
  Plus, Star, MapPin, X, Check, HelpCircle 
} from 'lucide-react';

export const RFQMarketplace: React.FC = () => {
  const { rfqs, acceptQuote, declineQuote, setCurrentView } = useApp();
  const [selectedRfqId, setSelectedRfqId] = useState<string>('custom-1');
  const [search, setSearch] = useState('');

  const activeRfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];

  const handleAccept = (artisanId: string) => {
    if (confirm("Accept this quotation? This will reserve the total amount from your wallet and lock it in Escrow until delivery is verified.")) {
      acceptQuote(activeRfq.id, artisanId);
    }
  };

  const handleDecline = (artisanId: string) => {
    if (confirm("Decline this quotation?")) {
      declineQuote(activeRfq.id, artisanId);
    }
  };

  // Filter quotes based on search
  const filteredQuotes = activeRfq
    ? activeRfq.quotes.filter(q => 
        q.artisanName.toLowerCase().includes(search.toLowerCase()) ||
        q.artisanLocation.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFFBF9] pb-16 text-left select-none">
      {/* Header Block (Frozen) */}
      <div className="bg-white border-b border-stone-200 flex flex-col gap-4 p-6 pb-4 shadow-sm shrink-0 z-30">
        {/* Row 1: Title Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <h2 className="font-heading font-extrabold text-lg">Custom Orders</h2>
          </div>
        </div>

        {/* Row 2: Horizontal scroll of RFQ shortcut cards */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pt-1 pb-2 px-1 -mx-1 shrink-0">
          {/* + Create RFQ Card */}
          <button
            onClick={() => setCurrentView('create-rfq')}
            className="w-28 h-24 rounded-2xl border-2 border-dashed border-primary/30 bg-primary-light/50 flex flex-col items-center justify-center gap-1.5 shrink-0 hover:bg-primary-light transition-all shadow-xs"
          >
            <Plus className="w-5 h-5 text-primary" strokeWidth={2.5} />
            <span className="text-[9px] font-extrabold text-primary uppercase">Create Custom</span>
          </button>

          {/* List existing RFQs */}
          {rfqs.map(rfq => (
            <button
              key={rfq.id}
              onClick={() => setSelectedRfqId(rfq.id)}
              className={`w-32 h-24 rounded-2xl border text-left p-3.5 flex flex-col justify-between shrink-0 transition-all shadow-xs ${
                selectedRfqId === rfq.id
                  ? 'border-primary bg-primary-light ring-1 ring-primary/20'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <span className="text-[9px] font-extrabold text-text-secondary uppercase">{rfq.id}</span>
              <div>
                <span className="text-xs font-bold text-text-primary block truncate">{rfq.craftType}</span>
                <span className="text-[9px] text-text-secondary font-bold block mt-0.5">{rfq.qty} pcs • {rfq.status.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Row 3: Search Bar & Filter button */}
        {activeRfq && (
          <div className="flex gap-2">
            <div className="flex-1 bg-stone-50 rounded-2xl p-1.5 border border-stone-200 flex items-center gap-2">
              <Search className="w-5 h-5 text-stone-400 ml-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search artisans by name or location..."
                className="w-full text-xs font-medium text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
              />
            </div>
            
            <button className="w-11 h-11 rounded-2xl bg-white border border-stone-150 flex items-center justify-center hover:bg-stone-50 transition-all shadow-sm">
              <Filter className="w-5 h-5 text-stone-500" />
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content section */}
      <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#FFFBF9]">
        {activeRfq ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-heading font-extrabold text-base text-text-primary">
                {filteredQuotes.filter(q => q.status === 'pending').length} Artisan bids responded
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {filteredQuotes.map(quote => (
                  <Card 
                    key={quote.artisanId}
                    padding="md"
                    className={`border relative flex flex-col gap-3.5 transition-all ${
                      quote.status === 'accepted' 
                        ? 'border-accent bg-accent-light/10' 
                        : quote.status === 'declined'
                          ? 'opacity-40 border-stone-150'
                          : 'border-primary/5'
                    }`}
                  >
                    {/* Top: Avatar & Name */}
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img src={quote.artisanAvatar} alt={quote.artisanName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-text-primary truncate">{quote.artisanName}</span>
                          <span className="text-[9px] font-extrabold text-white bg-accent px-1.5 py-0.5 rounded-full uppercase tracking-tight">Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5 font-medium">
                          <div className="flex items-center text-secondary-dark font-bold">
                            <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                            <span>{quote.artisanRating}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{quote.artisanLocation}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-extrabold uppercase text-text-secondary block">Quoted Bid</span>
                        <span className="text-sm font-extrabold text-primary">₹{quote.price}/pc</span>
                      </div>
                    </div>

                    {/* Mid Details */}
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-text-secondary bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                      <div>
                        <span>Estimated Timeline:</span>
                        <span className="text-text-primary block mt-0.5">{quote.days} days</span>
                      </div>
                      <div>
                        <span>Total order cost:</span>
                        <span className="text-text-primary block mt-0.5">₹{(quote.price * activeRfq.qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Bottom: Action buttons or status indicator */}
                    {quote.status === 'pending' ? (
                      <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                        <button
                          onClick={() => alert("Simulated chat session opened with artisan.")}
                          className="text-[10px] font-bold text-primary hover:underline"
                        >
                          Make Offer / Chat
                        </button>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecline(quote.artisanId)}
                            className="flex items-center gap-1 border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                          
                          <button
                            onClick={() => handleAccept(quote.artisanId)}
                            className="flex items-center gap-1 bg-accent text-white hover:bg-accent-dark px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-stone-100 pt-2 text-center text-xs font-bold capitalize text-text-secondary">
                        Quotation status: <span className={quote.status === 'accepted' ? 'text-accent' : 'text-red-500'}>{quote.status}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-2">
            <ClipboardList className="w-12 h-12 text-stone-300" />
            <h3 className="font-heading font-bold text-text-primary text-base">No Custom Orders published</h3>
            <span className="text-xs text-text-secondary mt-0.5">Tap below to create one and request custom bids.</span>
          </div>
        )}
      </div>

      {/* Sticky Bottom button */}
      <div className="fixed bottom-16 left-0 right-0 max-w-[480px] mx-auto p-4 z-30">
        <Button 
          onClick={() => setCurrentView('create-rfq')}
          className="shadow-lg"
        >
          <span className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            <span>Create Custom Order</span>
          </span>
        </Button>
      </div>

    </div>
  );
};
