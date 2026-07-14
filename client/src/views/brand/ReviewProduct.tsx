import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, HelpCircle, Edit2, Plus, 
  FolderPlus, UploadCloud, CheckCircle2, Copy, Download,
  Globe, Laptop, FileText, CheckCircle, ExternalLink, RefreshCw
} from 'lucide-react';

const getDynamicMOQ = (price: number, id: string) => {
  const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = charCodeSum % 3;
  if (price > 15000) return 2 + (base % 2);
  if (price > 8000) return 4 + (base % 2);
  if (price > 4000) return 6 + base;
  return 10 + base;
};

export const ReviewProduct: React.FC = () => {
  const { products, setCurrentView } = useApp();

  const selectedId = localStorage.getItem('selectedProductId') || 'p-1';
  const product = products.find(p => p.id === selectedId) || products[0] || {
    id: 'p-1',
    name: 'Banarasi Silk Saree – Kadwa Weave',
    price: 8999,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
    craftType: 'Banarasi',
    category: 'Sarees',
    material: 'Pure Katan Silk',
    description: 'Elegant handwoven silk saree.',
    sku: 'BS001'
  };

  // Interactive state fields dynamically initialized
  const [price, setPrice] = useState(product.price);
  const [moq, setMoq] = useState(getDynamicMOQ(product.price, product.id));
  const [length, setLength] = useState(5.5);
  const [width, setWidth] = useState(1.1);

  // Product table detail fields
  const [fabric, setFabric] = useState(product.material || 'Pure Katan Silk');
  const [weave, setWeave] = useState(product.craftType || 'Kadwa Weave');
  const [work, setWork] = useState('Zari Weaving');
  const [color, setColor] = useState(product.name.includes('Blue') ? 'Royal Blue' : (product.name.includes('Indigo') || product.name.includes('Forest') ? 'Indigo / Forest Green' : 'Teal Green'));
  const [occasion, setOccasion] = useState('Festive, Wedding');
  const [care, setCare] = useState('Dry Clean Only');

  // Modal Wizard State
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(2); // Start at Step 2 (Product Summary) as per User Flow doc
  const [selectedCollection, setSelectedCollection] = useState('Sarees');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('Shopify');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const existingCollections = [
    'New Arrivals',
    'Sarees',
    'Handloom',
    'Festive Collection',
    'Home Decor'
  ];

  const handleEditPrice = () => {
    const val = prompt("Enter new price (₹):", price.toString());
    if (val && !isNaN(Number(val))) {
      setPrice(Number(val));
    }
  };

  const handleEditMOQ = () => {
    const val = prompt("Enter new MOQ (pieces):", moq.toString());
    if (val && !isNaN(Number(val))) {
      setMoq(Number(val));
    }
  };

  const handleEditDimensions = () => {
    const l = prompt("Enter length (m):", length.toString());
    const w = prompt("Enter width (m):", width.toString());
    if (l && w && !isNaN(Number(l)) && !isNaN(Number(w))) {
      setLength(Number(l));
      setWidth(Number(w));
    }
  };

  const handleEditDetails = () => {
    const f = prompt("Fabric details:", fabric);
    const wv = prompt("Weave type:", weave);
    const clr = prompt("Color:", color);
    if (f) setFabric(f);
    if (wv) setWeave(wv);
    if (clr) setColor(clr);
  };

  // Saree photo thumbnails (use product images + fallback list)
  const thumbnails = product.images && product.images.length > 0
    ? [...product.images, ...[
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=150',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150'
      ].slice(0, Math.max(0, 4 - product.images.length))]
    : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'];

  const [activeThumb, setActiveThumb] = useState(thumbnails[0]);

  // Widget Embed Code Block Generation
  const slugifiedCollectionName = (newCollectionName || selectedCollection).toLowerCase().replace(/\s+/g, '-');
  const embedCode = `<div id="shilpsetu-store"></div>\n\n<script src="https://widget.shilpsetu.com/widget.js"></script>\n\n<script>\n  ShilpSetu.init({\n    storeId: "STORE001",\n    collection: "${slugifiedCollectionName}",\n    theme: "light",\n    layout: "grid",\n    columns: 4\n  });\n</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Platform Instructions helper
  const getPlatformInstructions = (platform: string) => {
    switch (platform) {
      case 'Shopify':
        return 'Online Store ➔ Themes ➔ Customize ➔ Custom Liquid ➔ Paste Widget Code';
      case 'WordPress':
        return 'Appearance ➔ Widgets ➔ Custom HTML ➔ Paste Widget Code';
      case 'WooCommerce':
        return 'Pages ➔ Add New ➔ Block Editor ➔ Custom HTML Block ➔ Paste Widget Code';
      case 'Wix':
        return 'Site Editor ➔ Add Section ➔ Embed HTML ➔ Paste Widget Code';
      case 'Webflow':
        return 'Add Elements ➔ Advanced ➔ Embed Code ➔ Paste Widget Code';
      case 'Squarespace':
        return 'Page Section ➔ Add Block ➔ Code Block ➔ Paste Widget Code';
      default:
        return 'Open HTML Source file ➔ Paste Code just before the closing </body> tag';
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 bg-[#FFF8F1] relative">
      
      {/* 1. HEADER */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('inventory-sync')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h2 className="font-heading font-black text-lg text-stone-850">Sync Product to Store</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Review, edit and publish product to your store
            </span>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600">
          <HelpCircle className="w-4 h-4" />
          <span>How it works</span>
        </button>
      </div>

      {/* 2. MAIN SCROLL CONTAINER */}
      <div className="p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar max-h-[calc(100vh-210px)]">
        
        {/* Main Product Card Panel */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium flex flex-col gap-4">
          <div className="grid grid-cols-[1.2fr_1fr] gap-4">
            
            {/* Left Column: Saree Image & Gallery */}
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-150 shadow-sm relative">
                <img 
                  src={activeThumb} 
                  alt="Saree preview" 
                  className="w-full h-full object-cover transition-all"
                />
              </div>

              {/* Thumbnail selector row */}
              <div className="grid grid-cols-5 gap-1.5">
                {thumbnails.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveThumb(t)}
                    className={`aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all ${
                      activeThumb === t ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={t} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                
                {/* Add Image card button */}
                <button 
                  onClick={() => alert("Upload custom photos from device gallery")}
                  className="aspect-[4/5] rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 bg-stone-50 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[7px] font-bold mt-1">Add Image</span>
                </button>
              </div>
            </div>

            {/* Right Column: Title, Tags, Price, MOQ details */}
            <div className="flex flex-col justify-start gap-4">
              <div>
                <h3 className="font-heading font-black text-sm text-stone-850 leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-text-secondary">
                  <span>by Ramesh Kumar</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" fill="rgba(255,107,53,0.1)" strokeWidth={3} />
                </div>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[8px] font-black tracking-wide px-2.5 py-1 rounded bg-rose-50 text-rose-600 border border-rose-100/50 uppercase">
                  {product.category}
                </span>
                <span className="text-[8px] font-black tracking-wide px-2.5 py-1 rounded bg-green-50 text-[#2E7D32] border border-green-100/50 uppercase">
                  {product.craftType}
                </span>
                <span className="text-[8px] font-black tracking-wide px-2.5 py-1 rounded bg-purple-50 text-purple-600 border border-purple-100/50 uppercase">
                  {product.material || 'Handloom'}
                </span>
              </div>

              {/* Pricing Edit card */}
              <div className="border-t border-stone-100 pt-3 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-extrabold text-stone-850">
                    ₹{price.toLocaleString('en-IN')}
                  </span>
                  <button 
                    onClick={handleEditPrice}
                    className="text-[10px] font-black text-primary hover:underline flex items-center gap-0.5"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Edit Price</span>
                  </button>
                </div>
              </div>

              {/* MOQ Edit card */}
              <div className="border-t border-stone-100 pt-3">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">MOQ</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-black text-stone-800">{moq} Pieces</span>
                  <button 
                    onClick={handleEditMOQ}
                    className="text-[10px] font-black text-primary hover:underline flex items-center gap-0.5"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Edit MOQ</span>
                  </button>
                </div>
              </div>

              {/* Dimensions Edit card */}
              <div className="border-t border-stone-100 pt-3">
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Dimensions</span>
                <div className="flex justify-between items-start mt-1 gap-1">
                  <span className="text-[10px] font-bold text-stone-700 leading-snug">
                    Length: {length} m<br />Width: {width} m
                  </span>
                  <button 
                    onClick={handleEditDimensions}
                    className="text-[10px] font-black text-primary hover:underline flex items-center gap-0.5 shrink-0"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Product Details Section (Table fields) */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-black text-sm text-stone-850">Product Details</h3>
            <button 
              onClick={handleEditDetails}
              className="text-[10px] font-black text-primary hover:underline flex items-center gap-0.5"
            >
              <Edit2 className="w-2.5 h-2.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="flex flex-col text-xs">
            <div className="flex justify-between py-2.5 border-b border-stone-100/60">
              <span className="font-bold text-text-secondary">Fabric</span>
              <span className="font-black text-stone-800">{fabric}</span>
            </div>
            
            <div className="flex justify-between py-2.5 border-b border-stone-100/60">
              <span className="font-bold text-text-secondary">Weave</span>
              <span className="font-black text-stone-800">{weave}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-stone-100/60">
              <span className="font-bold text-text-secondary">Work</span>
              <span className="font-black text-stone-800">{work}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-stone-100/60">
              <span className="font-bold text-text-secondary">Color</span>
              <span className="font-black text-stone-800">{color}</span>
            </div>

            <div className="flex justify-between py-2.5 border-b border-stone-100/60">
              <span className="font-bold text-text-secondary">Occasion</span>
              <span className="font-black text-stone-800">{occasion}</span>
            </div>

            <div className="flex justify-between py-2.5">
              <span className="font-bold text-text-secondary">Care Instructions</span>
              <span className="font-black text-stone-800">{care}</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons row */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <button 
            onClick={() => {
              setModalStep(2);
              setShowModal(true);
            }}
            className="py-4 rounded-3xl border border-primary text-xs font-black text-primary bg-white flex items-center justify-center gap-2 hover:bg-orange-50/50 shadow-sm active:scale-98 transition-all"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Save to Collection</span>
          </button>

          <button 
            onClick={() => {
              setModalStep(2);
              setShowModal(true);
            }}
            className="py-4 rounded-3xl bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-black text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-98 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Publish to Store</span>
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 6-STEP PUBLISHING WIZARD GLASS MODAL */}
      {/* ============================================================== */}
      {showModal && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white/95 backdrop-blur border border-white/20 w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-left max-h-[85vh] overflow-y-auto no-scrollbar relative animate-scale-up">
            
            {/* Modal Top Header */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-stone-850">Publish Product</h3>
                <span className="text-[10px] text-text-secondary font-bold">Step {modalStep} of 6</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* STEP 2: PRODUCT SUMMARY */}
            {modalStep === 2 && (
              <div className="flex flex-col gap-4">
                <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider block">Product Summary</span>
                
                <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4 flex gap-4">
                  <div className="w-16 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                    <img src={activeThumb} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-stone-850 truncate font-heading">Banarasi Silk Saree – Kadwa Weave</h4>
                    <span className="text-[10px] text-text-secondary block mt-0.5">by Ramesh Kumar</span>
                    <span className="text-[10px] text-stone-500 font-bold block mt-1">Category: Textiles</span>
                    
                    <div className="flex gap-4 mt-2 text-[10px] font-black text-stone-850">
                      <span>Price: ₹{price.toLocaleString('en-IN')}</span>
                      <span>MOQ: {moq} Pcs</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-text-secondary bg-orange-50/50 border border-orange-100 p-3 rounded-xl font-bold leading-normal">
                  Dimensions: Length {length}m • Width {width}m. Syncing this product will integrate it into your external website instantly.
                </div>

                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-text-primary border border-stone-200 bg-white rounded-xl hover:bg-stone-50"
                  >
                    Edit Product
                  </button>
                  <button 
                    onClick={() => setModalStep(3)}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-bold text-white rounded-xl shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CHOOSE COLLECTION */}
            {modalStep === 3 && (
              <div className="flex flex-col gap-4">
                <span className="text-xs font-extrabold text-stone-850 block">Choose Collection</span>
                
                {/* Existing Collections Select scroll */}
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {existingCollections.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setSelectedCollection(col);
                        setNewCollectionName('');
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all flex justify-between items-center ${
                        selectedCollection === col && !newCollectionName
                          ? 'border-[#FF6B35] bg-orange-50/30 text-[#FF6B35]'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                      }`}
                    >
                      <span>{col}</span>
                      {selectedCollection === col && !newCollectionName && (
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Create New Collection input */}
                <div className="border-t border-stone-100 pt-3">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1.5">Or Create New Collection</label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => {
                      setNewCollectionName(e.target.value);
                      setSelectedCollection('');
                    }}
                    placeholder="E.g. Summer Heritage"
                    className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white"
                  />
                </div>

                <div className="flex gap-3 mt-2 border-t border-stone-100 pt-3">
                  <button 
                    onClick={() => setModalStep(2)}
                    className="py-3 px-4 text-xs font-bold text-text-primary border border-stone-200 bg-white rounded-xl hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setModalStep(4)}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-bold text-white rounded-xl shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: GENERATE WIDGET CODE */}
            {modalStep === 4 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-xs font-black">Widget Generated Successfully</span>
                </div>

                <div className="bg-stone-900 rounded-2xl p-4 text-left relative overflow-hidden shrink-0">
                  <pre className="text-[10px] text-green-400 font-mono overflow-x-auto max-h-[140px] whitespace-pre-wrap no-scrollbar">
                    {embedCode}
                  </pre>
                  
                  <button 
                    onClick={copyToClipboard}
                    className="absolute top-3.5 right-3.5 bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white border border-white/10 transition-colors"
                  >
                    {copiedCode ? <span className="text-[8px] font-black text-green-300">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <span className="text-[9px] font-bold text-text-secondary leading-normal block">
                  Installation ID: <span className="text-stone-800 font-black">STORE001</span> | Token: <span className="text-stone-850 font-mono">tok_shilp_a8b9c2</span>
                </span>

                <div className="flex gap-3.5 border-t border-stone-100 pt-3">
                  <button 
                    onClick={() => setModalStep(3)}
                    className="py-3 px-4 text-xs font-bold text-text-primary border border-stone-200 bg-white rounded-xl hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => {
                      alert("Downloading Developer Integration Documentation Guide (PDF)...");
                    }}
                    className="py-3 px-3 text-xs font-bold text-stone-700 border border-stone-200 bg-white rounded-xl hover:bg-stone-50 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Docs</span>
                  </button>
                  <button 
                    onClick={() => setModalStep(5)}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-bold text-white rounded-xl shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: WEBSITE INTEGRATION SCREEN */}
            {modalStep === 5 && (
              <div className="flex flex-col gap-4">
                <span className="text-xs font-extrabold text-stone-850 block">Connect Your Website</span>

                {/* Platforms Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {['Shopify', 'WordPress', 'WooCommerce', 'Wix', 'Webflow', 'Squarespace', 'Custom HTML'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`p-2.5 rounded-xl border text-center text-[10px] font-black transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPlatform === plat
                          ? 'border-[#FF6B35] bg-orange-50/30 text-[#FF6B35]'
                          : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-600'
                      }`}
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span>{plat}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Platform Instructions Panel */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold text-[#FF6B35] uppercase tracking-wider">
                    {selectedPlatform} Installation Instructions
                  </span>
                  <div className="text-[10px] font-bold text-stone-800 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-stone-150">
                    {getPlatformInstructions(selectedPlatform)}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
                  <button onClick={copyToClipboard} className="text-[#FF6B35] hover:underline flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    <span>Copy Widget Code</span>
                  </button>
                  <button onClick={() => alert("Opening Online Documentation...")} className="hover:underline flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Open Documentation</span>
                  </button>
                  <button onClick={() => alert("Support Ticket Created! Our team will contact you.")} className="hover:underline text-stone-800">
                    Need Help?
                  </button>
                </div>

                <div className="flex gap-3 border-t border-stone-100 pt-3 mt-1">
                  <button 
                    onClick={() => setModalStep(4)}
                    className="py-3 px-4 text-xs font-bold text-text-primary border border-stone-200 bg-white rounded-xl hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setModalStep(6)}
                    className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-bold text-white rounded-xl shadow-md"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: SUCCESS SCREEN */}
            {modalStep === 6 && (
              <div className="flex flex-col gap-4 text-center items-center py-3">
                
                {/* Large check animation */}
                <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-500 flex items-center justify-center text-green-500 animate-bounce">
                  <CheckCircle className="w-9 h-9" strokeWidth={3} />
                </div>

                <div>
                  <h3 className="font-heading font-black text-base text-stone-850">Store Connected Successfully</h3>
                  <p className="text-[10px] text-text-secondary mt-1 font-bold">
                    Your products will now appear automatically on your website.
                  </p>
                </div>

                {/* Connection Status Box */}
                <div className="w-full bg-stone-50 border border-stone-150 rounded-2xl p-4 text-left flex flex-col gap-2.5 text-xs font-medium text-text-primary">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-text-secondary">Collection Name:</span>
                    <span className="font-bold text-[#FF6B35]">{newCollectionName || selectedCollection}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-text-secondary">Products Synced:</span>
                    <span className="font-bold">1 Product</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span className="text-text-secondary">Website Platform:</span>
                    <span className="font-bold text-[#FF6B35]">{selectedPlatform}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Store Status:</span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold border border-green-200">
                      <span className="w-1 h-1 bg-green-500 rounded-full" />
                      <span>Connected</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setCurrentView('dashboard');
                    }}
                    className="py-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-bold text-text-primary"
                  >
                    Go to Dashboard
                  </button>

                  <button 
                    onClick={() => setShowLivePreview(true)}
                    className="py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E55A25] text-xs font-bold text-white flex items-center justify-center gap-1 shadow-md shadow-orange-500/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview Store</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STOREFRONT LIVE WIDGET EMBED PREVIEW MODAL */}
      {/* ============================================================== */}
      {showLivePreview && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md z-[60] flex flex-col p-6 items-center justify-center">
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/20 animate-scale-up">
            
            {/* Mock browser bar */}
            <div className="bg-stone-100 px-4 py-3 flex items-center justify-between border-b border-stone-200">
              <div className="flex items-center gap-2 flex-1 max-w-lg">
                {/* Dots */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                {/* URL */}
                <div className="bg-white border border-stone-200 rounded-lg px-3 py-1 text-xs text-stone-500 flex-1 truncate flex items-center gap-1 font-mono">
                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                  <span>https://www.ananyastore.com/collections/{slugifiedCollectionName}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowLivePreview(false);
                  setShowModal(false);
                  setCurrentView('inventory-sync-viewed');
                }}
                className="text-xs font-bold px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl"
              >
                Close Preview
              </button>
            </div>

            {/* Embedded widget page content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white text-left">
              <div className="max-w-3xl mx-auto flex flex-col gap-6">
                
                {/* Header */}
                <div className="border-b border-stone-100 pb-5">
                  <span className="text-[10px] font-black uppercase text-[#FF6B35] tracking-widest">Store Collection</span>
                  <h1 className="font-heading font-black text-3xl mt-1 text-stone-850">
                    {newCollectionName || selectedCollection}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">Handcrafted with heritage. Synced via ShilpSetu.</p>
                </div>

                {/* Simulated Widget grid */}
                <div className="grid grid-cols-4 gap-5">
                  {/* Saree Card 1 (The newly synced item!) */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-3 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all">
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 relative mb-3.5">
                      <img src={activeThumb} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Handmade
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 truncate leading-snug">
                        Banarasi Silk Saree – Kadwa Weave
                      </h4>
                      <span className="text-xs font-black text-[#FF6B35] mt-1 block">₹{price.toLocaleString('en-IN')}</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5 font-bold">MOQ: {moq} Pcs</span>
                    </div>
                  </div>

                  {/* Additional catalog placeholder items for realism */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-3 flex flex-col justify-between group shadow-sm opacity-65">
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-3.5">
                      <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=300" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 truncate">Light Green Silk Viscose Saree</h4>
                      <span className="text-xs font-black text-stone-800 mt-1 block">₹11,500</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5 font-bold">MOQ: 2 Pcs</span>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-3 flex flex-col justify-between group shadow-sm opacity-65">
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-3.5">
                      <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 truncate">Beige Silk Viscose Saree</h4>
                      <span className="text-xs font-black text-stone-800 mt-1 block">₹13,200</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5 font-bold">MOQ: 2 Pcs</span>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-3 flex flex-col justify-between group shadow-sm opacity-65">
                    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-3.5">
                      <img src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 truncate">Handmade Clay Pot</h4>
                      <span className="text-xs font-black text-stone-800 mt-1 block">₹499</span>
                      <span className="text-[9px] text-stone-400 block mt-0.5 font-bold">MOQ: 10 Pcs</span>
                    </div>
                  </div>
                </div>

                {/* Footer brand info */}
                <div className="border-t border-stone-100 pt-8 mt-4 flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  <span>© Ananya Storefront</span>
                  <span className="flex items-center gap-1">
                    <span>Powered by</span>
                    <span className="text-[#FF6B35] font-black">ShilpSetu Widget v1.2</span>
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
