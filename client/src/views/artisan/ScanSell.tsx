import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Scan, Sparkles, Check, CheckCircle2, 
  Keyboard, Receipt, Printer, X, Loader2, Plus, Minus, 
  User, MapPin, Phone, Trash2, Edit2, Search 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../supabase/supabaseClient';

interface BillingItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  sku: string;
}

export const ScanSell: React.FC = () => {
  const { triggerAIScanMatch, products, setCurrentView } = useApp();

  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [scanning, setScanning] = useState(false);
  const [selectedItems, setSelectedItems] = useState<BillingItem[]>([]);
  
  // Selection Screen mode toggles
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  // Custom selling price (can be overridden, defaults to subtotal)
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  // Invoice bill simulation state
  const [showBill, setShowBill] = useState(false);
  const [billNumber, setBillNumber] = useState('');

  // Download Bills States
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [durationOption, setDurationOption] = useState('1week'); // '1week' | '1month' | 'custom'
  const [startDate, setStartDate] = useState('2026-07-07');
  const [endDate, setEndDate] = useState('2026-07-14');
  const [downloadCategory, setDownloadCategory] = useState('All Products');

  // Billing History States
  const [showHistory, setShowHistory] = useState(false);
  const [billingHistory, setBillingHistory] = useState<any[]>([
    {
      billNumber: 'INV-2026-8910',
      customerName: 'Meenakshi Iyer',
      contactNumber: '9845012345',
      totalAmount: 14999,
      date: '13 Jul 2026',
      items: [
        {
          id: 'prod-1',
          name: 'Blue Pure Silk Organza Kadwa Banarasi Saree',
          price: 14999,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200',
          sku: 'BS001'
        }
      ]
    },
    {
      billNumber: 'INV-2026-7843',
      customerName: 'Aishwarya Sen',
      contactNumber: '9900112233',
      totalAmount: 8149,
      date: '08 Jul 2026',
      items: [
        {
          id: 'prod-2',
          name: 'Jaipur Cotton Block-Print Saree',
          price: 2450,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200',
          sku: 'BS-BLO-003'
        },
        {
          id: 'prod-3',
          name: 'Light Green Silk Viscose Cutwork Banarasi Saree',
          price: 5699,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200',
          sku: 'BS002'
        }
      ]
    }
  ]);

  // Handle camera file upload / gallery select
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    try {
      // Simulate real file upload/analysis to our Gemini Vision endpoint
      const formData = new FormData();
      formData.append('image', file);

      // Check if backend is active, fallback to simulation
      let matchedProduct = products[0];
      try {
        const res = await fetch('http://localhost:5000/api/products/analyze-image', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          // Find matching item in catalog
          matchedProduct = products.find(p => p.sku === data.sku || p.name.includes(data.name)) || products[0];
        }
      } catch (err) {
        console.warn("Express server offline, using local match rules");
      }

      // Add to billing cart
      setSelectedItems(prev => {
        const existing = prev.find(item => item.id === matchedProduct.id);
        if (existing) {
          return prev.map(item => item.id === matchedProduct.id ? { ...item, qty: item.qty + 1 } : item);
        } else {
          return [...prev, {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
            qty: 1,
            image: matchedProduct.images[0],
            sku: matchedProduct.sku
          }];
        }
      });

      alert(`Matched "${matchedProduct.name}" (SKU: ${matchedProduct.sku}) and added to Billing Cart.`);
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleDownloadBills = () => {
    alert(`Downloading billing report [Category: ${downloadCategory}] (${durationOption === 'custom' ? `${startDate} to ${endDate}` : durationOption})... Success.`);
    setShowDownloadModal(false);
  };

  const handleGenerateBill = () => {
    if (selectedItems.length === 0) {
      alert("Please select or scan at least one product for billing.");
      return;
    }
    const billNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    setBillNumber(billNum);
    setShowBill(true);
  };

  const updateItemQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      setSelectedItems(prev => prev.filter(item => item.id !== id));
    } else {
      setSelectedItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const finalPrice = customPrice !== null ? customPrice : subtotal;

  // Search filtered products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle selection on product list
  const toggleProductSelection = (product: any) => {
    setSelectedItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          image: product.images[0],
          sku: product.sku
        }];
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col pb-8 bg-[#FFF8F1]">
      
      {/* 1. SELECTION SEARCH OVERLAY */}
      {isSelectionMode ? (
        <div className="absolute inset-0 bg-[#FFF8F1] z-40 flex flex-col pb-[148px] overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSelectionMode(false)}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
              <h2 className="font-heading font-black text-base text-stone-850">Select Products</h2>
            </div>
            <button 
              onClick={() => setIsSelectionMode(false)}
              className="text-xs font-black text-[#FF511A] px-4 py-2 bg-[#FFF0EC] rounded-full hover:bg-[#FFE0D9] transition-all"
            >
              Done ({selectedItems.length})
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-5 overflow-hidden">
            <div className="flex flex-col gap-2 shrink-0">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, category or SKU..."
                className="w-full text-xs font-bold text-stone-800 bg-white border border-stone-200 rounded-2xl p-3 focus:outline-none focus:ring-1 focus:ring-[#FF511A]"
              />
            </div>

            {/* Vertical list of product cards scrolling vertically */}
            <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-6 flex-1 scrollbar-thin">
              {filteredProducts.map((p) => {
                const isSelected = selectedItems.some(item => item.id === p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProductSelection(p)}
                    className={`bg-white rounded-[24px] p-3.5 border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isSelected ? 'border-[#FF511A] bg-[#FFF5F2]' : 'border-stone-150 hover:bg-stone-50 shadow-sm'
                    }`}
                  >
                    {/* Left side: photo & details */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-12 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <h4 className="text-xs font-black text-stone-850 truncate leading-snug">{p.name}</h4>
                        <span className="text-[10px] text-stone-500 block mt-1.5 font-bold">SKU: {p.sku}</span>
                      </div>
                    </div>

                    {/* Right side: status pill & price */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-3">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded whitespace-nowrap ${
                        p.status === 'inStock' ? 'bg-[#EAF7EC] text-[#2E7D32]' : 'bg-[#FFF6E5] text-primary'
                      }`}>
                        {p.status === 'inStock' ? 'In Stock' : 'Low Stock'}
                      </span>
                      <span className="text-xs font-black text-[#FF511A]">₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frozen / Pinned Bottom Button panel */}
          <div className="p-4 bg-white border-t border-stone-100 absolute bottom-[68px] left-0 right-0 z-40">
            <button
              onClick={() => {
                if (selectedItems.length > 0) {
                  setIsSelectionMode(false);
                }
              }}
              disabled={selectedItems.length === 0}
              className={`w-full py-4 rounded-3xl text-sm font-black text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                selectedItems.length === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                  : 'bg-[#FF511A] hover:bg-[#E04413] shadow-orange-500/10 active:scale-98'
              }`}
            >
              <span>Proceed to Billing Details ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'})</span>
            </button>
          </div>
        </div>
      ) : (
        
        // 2. MAIN SCAN & SELL VIEWS
        <div className="flex-1 flex flex-col">
          {/* Hidden File Input for real camera/gallery triggers */}
          <input 
            type="file" 
            ref={cameraInputRef} 
            onChange={handleCameraFileSelected} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm animate-press"
              >
                <ChevronLeft className="w-5 h-5 text-text-primary" />
              </button>
              <h2 className="font-heading font-extrabold text-lg">Scan & Sell</h2>
            </div>
            
            {/* Billing History Button */}
            <button 
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/10 bg-[#FFF5F2] hover:bg-[#FFEAE4] text-[10px] font-black text-[#FF6B35] uppercase tracking-wider transition-all select-none animate-press"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Billing History</span>
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-140px)]">
            
            {/* Live Camera Box (Exactly matching left screen image design) */}
            <div 
              onClick={handleCameraClick}
              className="relative w-full h-48 rounded-3xl overflow-hidden bg-stone-900 border border-primary/10 shadow-lg flex flex-col items-center justify-center text-white cursor-pointer hover:border-primary/30 transition-colors"
            >
              {scanning ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                  <span className="text-xs font-bold tracking-wider text-orange-200">AI Scanner Matching...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2.5 z-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-secondary border border-white/20 animate-pulse">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-extrabold block">Start Live Camera Scan</span>
                    <span className="text-[10px] text-orange-200 block mt-0.5">Focus photo on barcode or fabric</span>
                  </div>
                </div>
              )}

              {/* Red Live Camera Indicator Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-[9px] font-extrabold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 bg-[#FF6B35] rounded-full animate-ping" />
                <span>Live Camera</span>
              </div>

              {/* Green Scanline Overlay */}
              <div className="scan-line" />
            </div>

            {/* Quick Action Buttons (Under the camera preview) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsSelectionMode(true)}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-stone-200 bg-white text-xs font-bold text-text-primary hover:bg-stone-50 shadow-sm transition-all"
              >
                <Keyboard className="w-4 h-4 text-stone-400" />
                <span>Enter Product ID</span>
              </button>
              
              <button
                onClick={handleCameraClick}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-stone-200 bg-white text-xs font-bold text-text-primary hover:bg-stone-50 shadow-sm transition-all"
              >
                <Scan className="w-4 h-4 text-stone-400" />
                <span>Scan QR/Barcode</span>
              </button>
            </div>

            {/* --- STATE A: Cart is empty (Display vertical scroll inventory - Left Screen) --- */}
            {selectedItems.length === 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-stone-855">Products Inventory</span>
                  <button 
                    onClick={() => setIsSelectionMode(true)}
                    className="text-xs font-bold text-[#D36B3B] hover:underline"
                  >
                    View All &gt;
                  </button>
                </div>

                {/* Vertical scroll list of product cards */}
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1.5 scrollbar-thin">
                  {products.map((p) => {
                    const isSelected = selectedItems.some(item => item.id === p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductSelection(p)}
                        className={`cursor-pointer border rounded-2xl p-3 flex items-center gap-3 transition-all ${
                          isSelected ? 'border-[#FF511A] bg-[#FFF5F2]' : 'border-stone-150 bg-white hover:bg-stone-50'
                        }`}
                      >
                        {/* Image */}
                        <div className="w-10 aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="text-xs font-bold text-stone-800 truncate leading-snug">{p.name}</h4>
                            <span className={`px-2 py-0.5 text-[8px] font-black rounded whitespace-nowrap ${
                              p.status === 'inStock' ? 'bg-green-50 text-[#2E7D32]' : 'bg-[#FFF6E5] text-primary'
                            }`}>
                              {p.status === 'inStock' ? 'In Stock' : 'Low Stock'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1 font-bold">
                            <span>SKU: {p.sku}</span>
                            <span className="text-[#FF511A] font-black">₹{p.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (

              // --- STATE B: Cart has items (Display Billing Cart card - Right Screen) ---
              <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <h3 className="font-heading font-extrabold text-sm text-text-primary">Billing Cart</h3>
                  <button 
                    onClick={() => setSelectedItems([])}
                    className="text-[11px] font-extrabold text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items list */}
                <div className="flex flex-col gap-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                      
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-text-primary truncate">{item.name}</h4>
                          <span className="text-[10px] text-text-secondary block mt-0.5">SKU: {item.sku}</span>
                          <span className="text-[10px] text-[#FF6B35] font-extrabold block">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 shrink-0">
                        {/* Gray pill stepper */}
                        <div className="flex items-center bg-stone-100 border border-stone-200 rounded-full px-2 py-1 justify-between w-24">
                          <button
                            onClick={() => updateItemQty(item.id, item.qty - 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-200 text-stone-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-extrabold text-stone-850">{item.qty}</span>
                          <button
                            onClick={() => updateItemQty(item.id, item.qty + 1)}
                            className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-stone-200 text-stone-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {/* Add Another Product link */}
                        <button 
                          onClick={() => setIsSelectionMode(true)}
                          className="text-[9px] font-bold text-text-secondary hover:underline"
                        >
                          Add Another Product
                        </button>
                      </div>

                      {/* Pink trash delete button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center shrink-0 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Customer Details stacked inputs (Right Screen) */}
                <div className="border-t border-stone-100 pt-4 flex flex-col gap-3">
                  <span className="text-xs font-extrabold text-stone-700">Customer Details (Optional)</span>
                  
                  {/* Name Item */}
                  <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary shrink-0">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] text-text-secondary font-bold block uppercase tracking-wider">Customer Name (optional)</span>
                        <input 
                          type="text" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full text-xs font-black text-stone-800 bg-transparent focus:outline-none placeholder:text-stone-350"
                        />
                      </div>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                  </div>

                  {/* Address Item */}
                  <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] text-text-secondary font-bold block uppercase tracking-wider">Customer Address (optional)</span>
                        <input 
                          type="text" 
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="e.g. 12, MG Road, Jaipur, Rajasthan - 302001"
                          className="w-full text-xs font-black text-stone-800 bg-transparent focus:outline-none placeholder:text-stone-350"
                        />
                      </div>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                  </div>

                  {/* Selling Price override Item */}
                  <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary shrink-0 font-bold text-sm">
                        ₹
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] text-text-secondary font-bold block uppercase tracking-wider">Selling Price</span>
                        <input 
                          type="number" 
                          value={customPrice !== null ? customPrice : subtotal}
                          onChange={(e) => setCustomPrice(parseInt(e.target.value) || null)}
                          className="w-full text-xs font-black text-stone-800 bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                  </div>

                  {/* Contact Number Item */}
                  <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-orange-100/50 flex items-center justify-center text-primary shrink-0">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] text-text-secondary font-bold block uppercase tracking-wider">Contact Number</span>
                        <input 
                          type="text" 
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          placeholder="e.g. 9993336660"
                          className="w-full text-xs font-black text-stone-800 bg-transparent focus:outline-none placeholder:text-stone-350"
                        />
                      </div>
                    </div>
                    <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Bill Bottom CTA (Orange receipt action button) */}
            <div className="mt-4">
              <button 
                onClick={handleGenerateBill}
                disabled={selectedItems.length === 0}
                className={`w-full py-4 rounded-3xl text-sm font-black text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  selectedItems.length === 0
                    ? 'bg-[#FF6B35]/65 cursor-not-allowed shadow-none'
                    : 'bg-[#FF6B35] hover:bg-[#E55A25] active:scale-98 shadow-orange-500/10'
                }`}
              >
                <Receipt className="w-5 h-5 text-white" />
                <span>Generate Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-PRODUCT BILL RECEIPT DIALOG MODAL */}
      {showBill && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-primary/5 flex flex-col gap-4 text-left max-h-[85vh] overflow-y-auto no-scrollbar">
            
            {/* Receipt Header */}
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-text-primary">Receipt Generated</h3>
                <span className="text-[10px] text-text-secondary font-bold">{billNumber}</span>
              </div>
              <button 
                onClick={() => setShowBill(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice parameters */}
            <div className="text-xs flex flex-col gap-3 font-medium text-text-primary">
              <div className="flex justify-between">
                <span className="text-text-secondary">Vendor:</span>
                <span className="font-bold">Ramesh Crafts</span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Customer:</span>
                  <span className="font-bold">{customerName} {customerAddress ? `(${customerAddress})` : ''}</span>
                </div>
              )}
              {contactNumber && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Contact:</span>
                  <span className="font-bold">{contactNumber}</span>
                </div>
              )}
              <div className="border-t border-dashed border-stone-200 my-1"></div>
              
              {/* Product items loop */}
              <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="w-8 aspect-[4/5] rounded overflow-hidden shrink-0 border border-stone-100">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[11px] block truncate text-stone-850">{item.name}</span>
                      <span className="text-[10px] text-text-secondary block">SKU: {item.sku}</span>
                      <span className="text-[10px] text-text-secondary font-medium">
                        {item.qty} x ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-extrabold text-[11px] text-stone-800">
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-stone-200 my-1"></div>
              
              <div className="flex justify-between text-sm">
                <span className="font-heading font-bold">Total Amount:</span>
                <span className="font-heading font-extrabold text-primary">₹{finalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Mock QR code for Razorpay UPI */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 text-center mt-1">
              <div className="w-24 h-24 bg-white border border-stone-200 rounded-lg p-1.5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="30" height="30" fill="#1A1A1A" />
                  <rect x="5" y="5" width="20" height="20" fill="#FFFFFF" />
                  <rect x="70" y="0" width="30" height="30" fill="#1A1A1A" />
                  <rect x="75" y="5" width="20" height="20" fill="#FFFFFF" />
                  <rect x="0" y="70" width="30" height="30" fill="#1A1A1A" />
                  <rect x="5" y="75" width="20" height="20" fill="#FFFFFF" />
                  <rect x="40" y="40" width="20" height="20" fill="#1A1A1A" />
                  <rect x="75" y="75" width="25" height="25" fill="#1A1A1A" />
                </svg>
              </div>
              <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest mt-1">Scan to Pay via UPI</span>
            </div>

            {/* Print receipt / finalize bill */}
            <button
              onClick={() => {
                const newBillRecord = {
                  billNumber,
                  customerName: customerName.trim() || 'Walk-in Customer',
                  contactNumber: contactNumber.trim() || 'N/A',
                  totalAmount: finalPrice,
                  date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  items: [...selectedItems]
                };
                setBillingHistory(prev => [newBillRecord, ...prev]);

                // Supabase DB Sync for Scan Sell Billing
                if (isSupabaseConfigured()) {
                  try {
                    supabase.auth.getUser().then(({ data: { user } }) => {
                      const artisanUuid = user ? user.id : '00000000-0000-0000-0000-000000000000';

                      supabase.from('bills').insert({
                        artisan_id: artisanUuid,
                        customer_name: newBillRecord.customerName,
                        customer_phone: newBillRecord.contactNumber,
                        items: newBillRecord.items,
                        total_amount: newBillRecord.totalAmount,
                        payment_method: 'upi'
                      }).then(({ error }) => {
                        if (error) {
                          console.error("Supabase Scan & Sell billing sync failed:", error.message, error.details);
                        } else {
                          console.log("ShilpSetu: Billing transaction synchronized to Supabase!");
                        }
                      });
                    });
                  } catch (err) {
                    console.error("Supabase billing sync exception:", err);
                  }
                }

                alert(`Printing bill receipt (${billNumber}) for ₹${finalPrice.toLocaleString('en-IN')}... Done.`);
                setShowBill(false);
                setSelectedItems([]);
                setCustomerName('');
                setCustomerAddress('');
                setContactNumber('');
                setCustomPrice(null);
              }}
              className="w-full flex items-center justify-center gap-2 bg-stone-850 hover:bg-stone-900 text-white py-3.5 rounded-xl text-xs font-bold shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt / Invoice</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. BILLING HISTORY FULL PAGE SCREEN */}
      {showHistory && (
        <div className="absolute inset-0 bg-[#FFF8F1] z-40 flex flex-col overflow-hidden pb-8">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowHistory(false)}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all active:scale-95 animate-press"
              >
                <ChevronLeft className="w-5 h-5 text-text-primary" />
              </button>
              <div className="text-left">
                <h3 className="font-heading font-black text-base text-stone-850">Billing History</h3>
                <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wider block mt-0.5">POS Transaction Records</span>
              </div>
            </div>

            {/* Download Bills Button */}
            <button 
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#FF6B35]/20 bg-[#FFF5F2] hover:bg-[#FFEAE4] text-[9px] font-black text-[#FF6B35] uppercase tracking-wider transition-all select-none animate-press"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Download Bills</span>
            </button>
          </div>

          {/* Scrollable list of past bills */}
          <div className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">
            {billingHistory.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center gap-2.5">
                <Receipt className="w-12 h-12 text-stone-300" />
                <span className="text-xs font-bold text-stone-450">No transactions recorded yet</span>
              </div>
            ) : (
              billingHistory.map((bill) => (
                <div key={bill.billNumber} className="bg-white border border-stone-150 rounded-[24px] p-5 flex flex-col gap-4 shadow-sm hover:border-[#FF6B35]/25 transition-all text-left">
                  {/* Bill number & date */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-stone-850">{bill.billNumber}</span>
                    <span className="text-[10px] font-black text-stone-400">{bill.date}</span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                    <div>
                      <span className="text-[8px] font-black text-stone-400 uppercase block tracking-wider mb-0.5">Customer</span>
                      <span className="text-stone-750 font-black">{bill.customerName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-black text-stone-400 uppercase block tracking-wider mb-0.5">Phone</span>
                      <span className="text-stone-750 font-black">{bill.contactNumber}</span>
                    </div>
                  </div>

                  {/* Purchased products preview */}
                  <div className="flex flex-col gap-3">
                    {bill.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-stone-650">
                        <div className="w-9 aspect-[4/5] rounded-xl overflow-hidden shrink-0 border border-stone-150 bg-stone-50">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-extrabold text-stone-850 truncate block leading-snug">{item.name}</span>
                          <span className="text-[10px] text-stone-400 font-bold block mt-1">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-stone-150 pt-3 flex justify-between items-center mt-1">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Total Received</span>
                    <span className="text-sm font-heading font-black text-[#FF6B35]">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. DOWNLOAD BILLS POPUP DIALOG MODAL */}
      {showDownloadModal && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-primary/5 flex flex-col gap-4 text-left animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-stone-150 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-[#FF6B35]">Download Bills</h3>
                <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wider block mt-0.5">Select Date Range</span>
              </div>
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-850 hover:bg-stone-200 transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Duration options selection */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Duration</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDurationOption('1week')}
                    className={`py-2 px-3 text-[10px] font-black rounded-xl border text-center transition-all ${
                      durationOption === '1week'
                        ? 'bg-[#FFF5F2] border-[#FF6B35] text-[#FF6B35]'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    1 Week
                  </button>
                  <button
                    onClick={() => setDurationOption('1month')}
                    className={`py-2 px-3 text-[10px] font-black rounded-xl border text-center transition-all ${
                      durationOption === '1month'
                        ? 'bg-[#FFF5F2] border-[#FF6B35] text-[#FF6B35]'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    1 Month
                  </button>
                  <button
                    onClick={() => setDurationOption('custom')}
                    className={`py-2 px-3 text-[10px] font-black rounded-xl border text-center transition-all ${
                      durationOption === 'custom'
                        ? 'bg-[#FFF5F2] border-[#FF6B35] text-[#FF6B35]'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Custom Date
                  </button>
                </div>
              </div>

              {/* Custom Date Picker Inputs */}
              {durationOption === 'custom' && (
                <div className="grid grid-cols-2 gap-3.5 mt-1 bg-stone-50/50 p-3 rounded-2xl border border-stone-150 animate-slideDown">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[8px] font-black text-stone-400 uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-[10px] font-bold text-stone-750 bg-white border border-stone-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[8px] font-black text-stone-400 uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-[10px] font-bold text-stone-750 bg-white border border-stone-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                    />
                  </div>
                </div>
              )}
              {/* Product Category Select Option */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Product Category</label>
                <select
                  value={downloadCategory}
                  onChange={(e) => setDownloadCategory(e.target.value)}
                  className="w-full text-[11px] font-bold text-stone-750 bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] focus:bg-white transition-all"
                >
                  <option value="All Products">✨ All Products</option>
                  <option value="Saree">👘 Saree</option>
                  <option value="Fabric">🧵 Fabric</option>
                  <option value="Stole">🧣 Stole</option>
                </select>
              </div>
            </div>

            {/* Actions - Download Button (NOT BLACK, but brand orange) */}
            <div className="flex gap-3 mt-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadBills}
                className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>Download</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
