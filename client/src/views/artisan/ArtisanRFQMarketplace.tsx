import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, Search, Filter, Bell, MapPin, 
  CheckCircle2, FileText, UploadCloud, Bookmark, Check, MessageSquare
} from 'lucide-react';

interface RFQItem {
  id: string;
  brandName: string;
  location: string;
  logoChar: string;
  logoBg: string;
  productName: string;
  description: string;
  image: string;
  deliveryDurationDays: number; // e.g. 45 Days
  qty: number;
  price: number; // Target price per piece
  budget: number;
  submittedCount: number;
  deadlineDate: string; // Expiry date of RFQ (e.g. 28 May 2026)
}

export const ArtisanRFQMarketplace: React.FC = () => {
  const { setCurrentView } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'Sarees', 'Home Decor', 'Textiles', 'Jewellery', 'Handloom'];

  // Main RFQs Data
  const [rfqs, setRfqs] = useState<RFQItem[]>([
    {
      id: 'CUSTOM-2025-0487',
      brandName: 'Heritage Living',
      location: 'Jaipur, Rajasthan',
      logoChar: 'H',
      logoBg: 'bg-[#5c2b12] text-white',
      productName: 'Banarasi Silk Saree – Traditional Zari',
      description: 'We are looking for authentic Banarasi Silk sarees with rich zari weaving and traditional motifs. Vibrant colors preferred.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
      deliveryDurationDays: 45,
      qty: 120,
      price: 12500,
      budget: 1500000,
      submittedCount: 12,
      deadlineDate: '2026-05-28' // 28 May 2026
    },
    {
      id: 'CUSTOM-2025-0462',
      brandName: 'Niraya Designs',
      location: 'Bangalore, Karnataka',
      logoChar: 'N',
      logoBg: 'bg-rose-800 text-white',
      productName: 'Cotton Handloom Saree – Natural Dyes',
      description: 'Seeking handloom cotton sarees with natural dye tones and subtle patterns. Eco-friendly & sustainable production preferred.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
      deliveryDurationDays: 30,
      qty: 200,
      price: 3800,
      budget: 760000,
      submittedCount: 9,
      deadlineDate: '2026-06-15'
    }
  ]);

  // Selected RFQ for bidding (defaults to first item to show the screen layout exactly like the snap)
  const [selectedRfqId, setSelectedRfqId] = useState<string>('CUSTOM-2025-0487');

  // Bid forms state
  const [quoteForms, setQuoteForms] = useState<Record<string, {
    pricePerPiece: string;
    productionStartDate: string;
    quantitySupply: string;
    sampleDeliveryDate: string;
    deliveryDate: string;
    paymentPreference: string;
    notesToBuyer: string;
    agreedToTerms: boolean;
    isSaved: boolean;
  }>>({
    'CUSTOM-2025-0487': {
      pricePerPiece: '',
      productionStartDate: '2026-05-01',
      quantitySupply: '200',
      sampleDeliveryDate: '2026-05-15',
      deliveryDate: '2026-06-10',
      paymentPreference: 'Milestone Payment',
      notesToBuyer: '',
      agreedToTerms: true,
      isSaved: false
    },
    'CUSTOM-2025-0462': {
      pricePerPiece: '',
      productionStartDate: '2026-05-01',
      quantitySupply: '200',
      sampleDeliveryDate: '2026-05-15',
      deliveryDate: '2026-06-10',
      paymentPreference: 'Milestone Payment',
      notesToBuyer: '',
      agreedToTerms: true,
      isSaved: false
    }
  });

  // Successful submission flags
  const [submittedBids, setSubmittedBids] = useState<Record<string, boolean>>({});

  const handleFormChange = (rfqId: string, field: string, value: any) => {
    setQuoteForms(prev => ({
      ...prev,
      [rfqId]: {
        ...prev[rfqId],
        [field]: value
      }
    }));
  };

  const handleSaveRfq = (rfqId: string) => {
    setQuoteForms(prev => ({
      ...prev,
      [rfqId]: {
        ...prev[rfqId],
        isSaved: !prev[rfqId]?.isSaved
      }
    }));
    const isSavedNow = !quoteForms[rfqId]?.isSaved;
    alert(isSavedNow ? "Custom order bookmarked successfully!" : "Custom order removed from saved bookmarks.");
  };

  const handleFormSubmit = (rfq: RFQItem) => {
    const form = quoteForms[rfq.id];
    if (!form) return;

    if (!form.pricePerPiece) {
      alert("Please specify your Price per Piece.");
      return;
    }

    const proposedPrice = parseFloat(form.pricePerPiece);
    if (proposedPrice < rfq.price) {
      alert(`Validation Error:\nHeritage Living's target price is ₹${rfq.price.toLocaleString('en-IN')}/pc. As an artisan, you cannot propose a lower price. You can only propose an equal or higher price.`);
      return;
    }

    if (!form.deliveryDate) {
      alert("Please specify a Delivery Date.");
      return;
    }

    // Date comparison validation (Artisan cannot deliver earlier than the delivery target, only equal or later)
    const proposedTime = new Date(form.deliveryDate).getTime();
    const targetTime = new Date(rfq.deadlineDate).getTime(); // compare against target date
    if (proposedTime < targetTime) {
      alert(`Validation Error:\nHeritage Living's target delivery date is ${new Date(rfq.deadlineDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. You cannot propose a shorter timeline. You can only propose an equal or later delivery date.`);
      return;
    }

    if (!form.agreedToTerms) {
      alert("You must agree to the Custom order terms and conditions.");
      return;
    }

    // Persist bid data for the Brand view
    const bidId = `${rfq.id}-${Date.now()}`;
    const submittedBid = {
      id: bidId,
      rfqId: rfq.id,
      brandName: rfq.brandName,
      productName: rfq.productName,
      comment: form.notesToBuyer || '',
      price: proposedPrice,
      duration: Math.ceil((proposedTime - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const existingBidsRaw = localStorage.getItem('shilpsetu_submitted_bids');
    const existingBids = existingBidsRaw ? JSON.parse(existingBidsRaw) : [];
    existingBids.push(submittedBid);
    localStorage.setItem('shilpsetu_submitted_bids', JSON.stringify(existingBids));

    setSubmittedBids(prev => ({
      ...prev,
      [rfq.id]: true
    }));

    alert(`Quote submitted successfully!\nProposed Price: ₹${proposedPrice.toLocaleString('en-IN')}/pc\nDelivery Date: ${form.deliveryDate}`);
  };

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRfqSpecs = (rfqId: string) => {
    if (rfqId === 'CUSTOM-2025-0487') {
      return {
        material: 'Pure Silk',
        technique: 'Handwoven Banarasi',
        color: 'Maroon & Gold',
        size: '6.3 m (with blouse)',
        description: 'Elegant Banarasi silk saree with traditional zari motifs, intricate border and rich pallu. Authentic handwoven craftsmanship from Varanasi.',
        yarnDetails: 'Pure mulberry silk warp & weft with 5% gold zari thread detailing',
        packaging: 'Premium Saree Box with Silk Paper & Branding Sticker',
        sampleRequired: 'Yes (Request a mock sample before production)',
        sampleQty: '2 pcs',
        sampleDate: '10-07-2025',
        address: 'Heritage Living Warehouse, Sector 5, Bangalore - 560001',
        shippingResponsibility: 'Brand Responsibility (FOB / Ex-works)',
        paymentTerms: '30% Advance, 70% on Quality Check confirmation at Hub'
      };
    } else {
      return {
        material: 'Pure Handloom Cotton',
        technique: 'Natural Dyes Indigo',
        color: 'Indigo Blue',
        size: '6.2 m',
        description: 'Seeking handloom cotton sarees with natural dye tones and subtle patterns. Eco-friendly & sustainable production preferred.',
        yarnDetails: '60s count organic cotton yarn with vegetable Indigo dyes',
        packaging: 'Eco-friendly recycled craft paper envelopes with brand tags',
        sampleRequired: 'Yes (Request a mock sample before production)',
        sampleQty: '1 pc',
        sampleDate: '20-07-2025',
        address: 'Niraya Designs Hub, Jayanagar, Bangalore - 560011',
        shippingResponsibility: 'Artisan Responsibility (CIF to Hub)',
        paymentTerms: '50% Advance, 50% on Delivery'
      };
    }
  };

  return (
    <div className="absolute inset-0 bg-[#FFFDFB] flex flex-col z-10 text-left font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="px-6 py-5 bg-white flex items-center justify-between border-b border-stone-100 shadow-sm shrink-0">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-stone-700" />
        </button>

        <h1 className="text-lg font-black text-stone-850 font-heading">
          Custom Orders
        </h1>

        <button className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center relative shadow-sm hover:bg-stone-50 transition-all">
          <Bell className="w-5 h-5 text-stone-600" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF511A] rounded-full border-2 border-white" />
        </button>
      </div>

      {/* 2. CATEGORY TABS (Horizontal Scroll) */}
      <div className="flex gap-2.5 px-6 py-4 overflow-x-auto no-scrollbar bg-[#FFFDFB] shrink-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                isActive 
                  ? 'bg-[#FF511A] text-white border-[#FF511A] shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & FILTER ROW */}
      <div className="px-6 pb-2 flex gap-3 shrink-0">
        <div className="flex-1 bg-white rounded-2xl px-4 border border-stone-200 shadow-sm flex items-center gap-3 focus-within:border-[#FF511A]">
          <Search className="w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search custom order by product or buyer..."
            className="w-full text-xs font-semibold text-stone-800 placeholder:text-stone-300 focus:outline-none bg-transparent py-3"
          />
        </div>
        <button className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-all">
          <Filter className="w-5 h-5 text-stone-500" />
        </button>
      </div>

      {/* 4. CONTENT / CARDS FEED */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-6 pb-[96px]">
        
        {rfqs
          .filter(rfq => 
            selectedCategory === 'All' || 
            rfq.productName.toLowerCase().includes(selectedCategory.toLowerCase()) || 
            selectedCategory === 'Textiles'
          )
          .filter(rfq => 
            rfq.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rfq.brandName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((rfq) => {
            const form = quoteForms[rfq.id] || {
              pricePerPiece: '',
              productionStartDate: '',
              quantitySupply: '',
              sampleDeliveryDate: '',
              deliveryDate: '',
              paymentPreference: 'Milestone Payment',
              notesToBuyer: '',
              agreedToTerms: false,
              isSaved: false
            };
            
            const isBidSubmitted = submittedBids[rfq.id];

            return (
              <div key={rfq.id} className="flex flex-col gap-4">
                
                {/* RFQ MAIN DETAIL CARD */}
                <div className="bg-white rounded-[32px] border border-stone-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 relative flex flex-col gap-4">
                  
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${rfq.logoBg} flex items-center justify-center font-heading font-black text-base shadow-inner`}>
                        {rfq.logoChar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-stone-850">{rfq.brandName}</h4>
                          <span className="bg-[#E6F7F0] text-[#0E7A53] text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            ✓ Verified
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-bold mt-1 flex flex-col gap-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-300" />
                            <span>{rfq.location}</span>
                          </span>
                          <span className="text-[#FF511A] font-extrabold flex items-center gap-0.5 mt-0.5">
                            ⏰ Deadline: {formatDateLabel(rfq.deadlineDate)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Applied Artisans Badge */}
                    <div className="bg-[#E6F7F0] text-[#0E7A53] px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1">
                      <span>👥</span> {rfq.submittedCount} Artisans Applied
                    </div>
                  </div>

                  {/* RFQ ID */}
                  <div className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Custom ID: <span className="text-[#FF511A]">{rfq.id}</span>
                  </div>

                  {/* Banner Content Block */}
                  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-3 flex gap-4 text-left">
                    <div className="w-[100px] h-[80px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <img src={rfq.image} alt={rfq.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-black text-stone-850 leading-tight">
                        {rfq.productName}
                      </h5>
                      <p className="text-[10px] text-stone-500 font-semibold leading-relaxed mt-1">
                        {rfq.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Parameters Row */}
                  <div className="border-t border-stone-100 pt-4 flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest">Delivery</span>
                        <span className="text-[10px] font-extrabold text-stone-850 mt-1">{rfq.deliveryDurationDays} Days</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest">Qty</span>
                        <span className="text-[10px] font-extrabold text-stone-850 mt-1">{rfq.qty} pcs</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest">Target Price</span>
                        <span className="text-[10px] font-extrabold text-[#FF511A] mt-1">₹{rfq.price.toLocaleString('en-IN')}/pc</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest">Budget</span>
                        <span className="text-[10px] font-extrabold text-stone-850 mt-1">₹{(rfq.budget / 100000).toFixed(1)} Lakh</span>
                      </div>
                    </div>

                    {/* Three Main Action Buttons (Matching Mockup 2) */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <button 
                        onClick={() => setSelectedRfqId(rfq.id)}
                        className={`py-3.5 border rounded-2xl text-xs font-black transition-all text-center ${
                          selectedRfqId === rfq.id 
                            ? 'border-[#FF511A] bg-[#FFF5F2] text-[#FF511A]'
                            : 'border-stone-250 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveRfq(rfq.id)}
                        className={`border rounded-2xl flex items-center justify-center gap-1.5 transition-all font-black text-xs ${
                          form.isSaved 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-[#FF511A] bg-white text-[#FF511A] hover:bg-[#FFF5F2]'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                        <span>{form.isSaved ? 'Saved' : 'Save Custom'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRfqId(rfq.id)}
                        className="bg-[#FF511A] hover:bg-[#E04413] text-white rounded-2xl font-black text-xs flex items-center justify-center transition-all shadow-sm"
                      >
                        Fill Quote
                      </button>
                    </div>
                  </div>

                </div>

                {/* RFQ SPECIFICATION SHEET (Displays when View Details is clicked) */}
                {selectedRfqId === rfq.id && (() => {
                  const specs = getRfqSpecs(rfq.id);
                  return (
                    <div className="bg-[#FFFBF8] rounded-[32px] border border-orange-200/50 p-6 flex flex-col gap-4.5 text-left mb-2 animate-fadeIn">
                      <div className="flex justify-between items-center pb-2.5 border-b border-orange-100">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#FF511A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h4 className="text-sm font-black text-stone-850">Custom Specifications & Requirements</h4>
                        </div>
                        <span className="text-[8.5px] font-black text-[#FF511A] bg-[#FFF0EB] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Active Custom Details
                        </span>
                      </div>

                      {/* 4 Column Properties Grid */}
                      <div className="grid grid-cols-2 gap-4 text-xs font-bold text-stone-700">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Material *</span>
                          <span className="text-[11px] font-black text-stone-800">{specs.material}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Technique *</span>
                          <span className="text-[11px] font-black text-stone-800">{specs.technique}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Color *</span>
                          <span className="text-[11px] font-black text-stone-800">{specs.color}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Size *</span>
                          <span className="text-[11px] font-black text-stone-800">{specs.size}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-3">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Description *</span>
                        <p className="text-[10.5px] font-medium text-stone-650 leading-relaxed bg-white border border-stone-150 p-3 rounded-2xl">
                          {specs.description}
                        </p>
                      </div>

                      {/* Yarn & Packaging details */}
                      <div className="grid grid-cols-1 gap-3 border-t border-stone-100 pt-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Material / Yarn Details *</span>
                          <span className="text-[10px] font-semibold text-[#5c2b12] leading-normal">{specs.yarnDetails}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-t border-stone-50 pt-2.5">
                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Packing / Packaging Details *</span>
                          <span className="text-[10px] font-semibold text-stone-750 leading-normal">{specs.packaging}</span>
                        </div>
                      </div>

                      {/* Sample Requirement specs */}
                      <div className="border-t border-stone-100 pt-3 flex flex-col gap-2">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Sample Required *</span>
                        <p className="text-[10px] font-bold text-stone-600 leading-normal">
                          Request a mock sample before production
                        </p>
                        
                        <div className="flex gap-4 items-center mt-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4.5 h-4.5 rounded-full bg-[#FF511A] text-white flex items-center justify-center text-[9px] font-black">✓</div>
                            <span className="text-[10.5px] font-extrabold text-stone-800">Yes</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-50">
                            <div className="w-4.5 h-4.5 rounded-full border border-stone-300 bg-white flex items-center justify-center text-[9px] font-black text-transparent">✓</div>
                            <span className="text-[10.5px] font-extrabold text-stone-655">No</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2 bg-white/50 border border-stone-150 p-3 rounded-2xl">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8.5px] font-black text-stone-400 uppercase tracking-wider">Sample Quantity Required</span>
                            <span className="text-[10.5px] font-black text-[#FF511A]">{specs.sampleQty}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8.5px] font-black text-stone-400 uppercase tracking-wider">Sample Delivery Date</span>
                            <span className="text-[10.5px] font-black text-stone-850">{specs.sampleDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Technical specifications, Address and Shipping details */}
                      <div className="border-t border-stone-100 pt-3 flex flex-col gap-3">
                        <div className="flex items-center justify-between bg-white border border-stone-150 p-3 rounded-2xl shadow-xs">
                          <div className="flex items-center gap-2">
                            <svg className="w-4.5 h-4.5 text-[#FF511A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="text-[10.5px] font-black text-stone-850">Technical Specifications Pack</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => alert("Downloading Technical Specifications PDF Pack...")}
                            className="text-[9px] font-black text-[#FF511A] bg-[#FFF0EB] px-2.5 py-1.5 rounded-lg uppercase tracking-wider hover:bg-[#FFE0D5]"
                          >
                            Download PDF
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5 bg-stone-50 border border-stone-200 p-3.5 rounded-2xl text-[10px] font-semibold text-stone-700 leading-relaxed">
                          <div className="flex gap-1.5">
                            <span className="text-base leading-none shrink-0">📍</span>
                            <div>
                              <span className="font-black text-stone-800 uppercase tracking-wider text-[8.5px] block mb-0.5">Delivery Address *</span>
                              <span>{specs.address}</span>
                            </div>
                          </div>
                          <div className="border-t border-stone-150 my-2 pt-2 flex flex-col gap-1.5">
                            <div>
                              <span className="font-extrabold text-stone-800">Shipping Responsibility: </span>
                              <span className="font-bold text-stone-600">{specs.shippingResponsibility}</span>
                            </div>
                            <div>
                              <span className="font-extrabold text-stone-800">Payment Terms: </span>
                              <span className="font-bold text-stone-600">{specs.paymentTerms}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* SUBMIT YOUR QUOTE FORM (Displays for the active RFQ item) */}
                {selectedRfqId === rfq.id && (
                  <div className="bg-white rounded-[32px] border border-stone-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 flex flex-col gap-4">
                    
                    {/* Form Title Row */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#FF511A]" />
                        <h4 className="text-sm font-black text-stone-850">Submit Your Quote</h4>
                      </div>
                      <span className="text-[9.5px] font-black text-[#FF511A] flex items-center gap-1 bg-[#FFF5F2] px-2.5 py-1 rounded-lg">
                        ⏰ Deadline: {formatDateLabel(rfq.deadlineDate)}
                      </span>
                    </div>

                    {/* Inputs Grid with Refined Layout, Size & Balanced Spacing */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3.5 text-xs text-left font-bold text-stone-700">
                      
                      {/* Price per Piece */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Price per Piece *</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                          <span className="text-stone-400 text-[10px] font-bold mr-1">₹</span>
                          <input
                            type="text"
                            value={form.pricePerPiece}
                            onChange={(e) => handleFormChange(rfq.id, 'pricePerPiece', e.target.value)}
                            placeholder="e.g. 12,000"
                            className="w-full bg-transparent text-[10px] font-bold text-stone-850 focus:outline-none placeholder:text-stone-300"
                          />
                        </div>
                      </div>

                      {/* Production Start Date */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Production Start Date *</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3 focus-within:border-[#FF511A] focus-within:bg-white transition-all relative">
                          <input
                            type="date"
                            value={form.productionStartDate}
                            onChange={(e) => handleFormChange(rfq.id, 'productionStartDate', e.target.value)}
                            className="w-full bg-transparent text-[10px] font-bold text-stone-855 focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Quantity You Can Supply */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Quantity You Can Supply *</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                          <input
                            type="number"
                            value={form.quantitySupply}
                            onChange={(e) => handleFormChange(rfq.id, 'quantitySupply', e.target.value)}
                            placeholder="e.g. 120"
                            className="w-full bg-transparent text-[10px] font-bold text-stone-850 focus:outline-none placeholder:text-stone-300"
                          />
                        </div>
                      </div>

                      {/* Sample Delivery Date */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Sample Delivery Date</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                          <input
                            type="date"
                            value={form.sampleDeliveryDate}
                            onChange={(e) => handleFormChange(rfq.id, 'sampleDeliveryDate', e.target.value)}
                            className="w-full bg-transparent text-[10px] font-bold text-stone-850 focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Delivery Date */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Delivery Date *</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                          <input
                            type="date"
                            value={form.deliveryDate}
                            onChange={(e) => handleFormChange(rfq.id, 'deliveryDate', e.target.value)}
                            className="w-full bg-transparent text-[10px] font-bold text-stone-850 focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Payment Preference */}
                      <div className="flex flex-col gap-1 text-left">
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Payment Preference *</label>
                        <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                          <select
                            value={form.paymentPreference}
                            onChange={(e) => handleFormChange(rfq.id, 'paymentPreference', e.target.value)}
                            className="w-full bg-transparent text-[10px] font-bold text-stone-850 focus:outline-none cursor-pointer"
                          >
                            <option value="Milestone Payment">Milestone Payment</option>
                            <option value="100% Advance">100% Advance</option>
                            <option value="Wallet Payment">Wallet Payment</option>
                            <option value="Pay After Delivery">Pay After Delivery</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Notes to Buyer */}
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Notes to Buyer (Optional)</label>
                      <textarea
                        value={form.notesToBuyer}
                        onChange={(e) => handleFormChange(rfq.id, 'notesToBuyer', e.target.value)}
                        placeholder="Add any details about pricing, fabric, customization, etc."
                        maxLength={300}
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl p-3 text-[10px] font-semibold text-stone-850 focus:outline-none focus:border-[#FF511A] h-20 resize-none"
                      />
                      <span className="text-[9px] text-stone-400 font-bold block text-right mt-1">{(form.notesToBuyer || '').length}/300</span>
                    </div>

                    {/* Agree terms checkbox matching mockup style */}
                    <div 
                      onClick={() => handleFormChange(rfq.id, 'agreedToTerms', !form.agreedToTerms)}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        form.agreedToTerms ? 'bg-[#FF511A] text-white' : 'border border-stone-300 bg-white'
                      }`}>
                        {form.agreedToTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-[10px] font-bold text-stone-600">
                        I agree to <span className="text-[#FF511A] hover:underline">Custom terms and conditions</span>
                      </span>
                    </div>

                    {/* Highly Balanced Form action buttons row */}
                    <div className="grid grid-cols-[1.2fr_1.5fr_1.3fr] gap-3.5 pt-2">
                      
                      {/* Chat Buyer */}
                      <button
                        type="button"
                        onClick={() => {
                          alert("Opening Chat with Heritage Living Sourcing Team...");
                          setCurrentView('messages');
                        }}
                        className="border border-[#FF511A] text-[#FF511A] hover:bg-[#FFF5F2] rounded-[22px] flex items-center justify-center gap-2 h-14 transition-all font-black text-xs bg-white"
                      >
                        <svg className="w-5 h-5 text-[#FF511A]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Chat Buyer</span>
                      </button>

                      {/* Upload Similar Work */}
                      <button 
                        type="button"
                        onClick={() => alert("Local image picker triggered! Choose work reference photos to submit.")}
                        className="border-2 border-dashed border-[#FF511A]/40 bg-[#FFF5F2] hover:bg-[#FFEAE5] rounded-[22px] flex flex-col items-center justify-center h-14 transition-all text-center text-[10px] text-stone-700 font-bold"
                      >
                        <UploadCloud className="w-4.5 h-4.5 text-[#FF511A] mb-0.5" />
                        <span className="font-extrabold block text-[9.5px]">Upload Similar Work</span>
                        <span className="text-[7.5px] text-stone-400 font-bold leading-none">Tap to upload images</span>
                      </button>

                      {/* Submit Quote */}
                      <button
                        type="button"
                        onClick={() => handleFormSubmit(rfq)}
                        className="bg-[#FF511A] hover:bg-[#E04413] text-white rounded-[22px] font-black text-xs flex items-center justify-center h-14 transition-all shadow-md shadow-[#FF511A]/10 active:scale-98"
                      >
                        Submit Quote
                      </button>
                    </div>

                    {/* Success Submission Feedback Banner */}
                    {isBidSubmitted && (
                      <div className="flex items-center gap-2 justify-center bg-emerald-50 border border-emerald-250 rounded-2xl p-3 text-[10px] font-black text-emerald-800 animate-fadeIn mt-2 shadow-inner">
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Quote Submitted Successfully! Proposing ₹{parseFloat(form.pricePerPiece || '0').toLocaleString('en-IN')}/pc</span>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}

      </div>

    </div>
  );
};
