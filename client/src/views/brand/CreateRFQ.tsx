import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { ChevronLeft, ChevronRight, UploadCloud, CheckCircle2, Search } from 'lucide-react';

const PRODUCT_CATEGORIES = [
  "Sarees",
  "Dupattas & Stoles",
  "Floor Coverings",
  "Kitchen & Dining Linen",
  "Gamchha",
  "Shawls",
  "Dress Materials & Fabrics",
  "Dhotis, Mundus & Lungis",
  "Bedcovers & Bedsheets",
  "Pillow Covers & Cushions",
  "Curtains & Drapes",
  "Wood Craft",
  "Pottery & Ceramics",
  "Metal Craft",
  "Cane & Bamboo",
  "Jute Products",
  "Macramé & Rope",
  "Stone Craft",
  "Leather Craft",
  "Jewellery",
  "Paintings & Wall Art",
  "Toys & Dolls",
  "Handmade Paper",
  "Home Decor",
  "Religious & Spiritual",
  "Gift & Lifestyle",
  "Embroidery & Textile Craft",
  "Glass Craft",
  "Shell Craft",
  "Palm Leaf Craft",
  "Furniture & Utility"
];

const CRAFT_TECHNIQUES = [
  "Banarasi Weaving",
  "Chanderi Weaving",
  "Maheshwari Weaving",
  "Tangaliya Weaving",
  "Patola Weaving",
  "Kanjeevaram Weaving",
  "Jamdani Weaving",
  "Sambalpuri Weaving",
  "Bomkai Weaving",
  "Baluchari Weaving",
  "Paithani Weaving",
  "Pochampally Ikat",
  "Uppada Weaving",
  "Venkatagiri Weaving",
  "Kota Doria",
  "Muga Silk Weaving",
  "Eri Silk Weaving",
  "Tussar Silk Weaving",
  "Bhujodi Weaving",
  "Narayanpet Weaving",
  "Ilkal Weaving",
  "Mysore Silk Weaving",
  "Kala Cotton Weaving",
  "Khadi Weaving",
  "Kalamkari Painting",
  "Ajrakh Dyeing",
  "Pashmina Weaving",
  "Kani Shawl Weaving",
  "Jamawar Weaving",
  "Kullu Shawl Weaving",
  "Double Ikat",
  "Single Ikat",
  "Saharanpur Wood Carving",
  "Channapatna Wood turning",
  "Kondapalli Wood carving",
  "Blue Pottery painting",
  "Terracotta shaping",
  "Dhokra metal casting",
  "Bidriware engraving",
  "Copper embossing",
  "Brass engraving",
  "Cane weaving",
  "Bamboo basketry",
  "Jute braiding",
  "Macrame knotting",
  "Marble Inlay stone craft",
  "Kolhapuri leather craft",
  "Meenakari jewellery",
  "Filigree work",
  "Madhubani painting",
  "Warli painting",
  "Gond painting",
  "Pattachitra painting",
  "Pichwai painting",
  "Handmade paper making",
  "Lippan Art mud work",
  "Glass mosaic art",
  "Applique embroidery"
];

const VISIBILITY_OPTIONS = [
  "Everyone (Visible to all verified artisans)",
  "Individual Artisan",
  "Family Business",
  "Self Help Group (SHG)",
  "Artisan Cluster",
  "Cooperative Society",
  "Proprietorship",
  "Partnership Firm",
  "Private Limited Company",
  "NGO / Trust"
];

const MOCK_GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', label: 'Banarasi Saree Red' },
  { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400', label: 'Silk Zari Pattern' },
  { url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400', label: 'Handloom Warp' },
  { url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400', label: 'Indigo Dyed Fabric' },
  { url: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=400', label: 'Kanjeevaram Pattern' },
  { url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400', label: 'Chanderi Weave' },
  { url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400', label: 'Terracotta Vases' },
  { url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400', label: 'Wood Carved Box' }
];

export const CreateRFQ: React.FC = () => {
  const { createRFQ, setCurrentView } = useApp();

  const [activeStep, setActiveStep] = useState(1);

  // Step 1 States
  const [rfqTitle, setRfqTitle] = useState('Banarasi Silk Saree - BS2611');
  const [category, setCategory] = useState('Sarees');
  const [craftType, setCraftType] = useState('Banarasi Weaving');
  const [productName, setProductName] = useState('Banarasi Silk Saree BS2611');
  const [quantity, setQuantity] = useState(500);
  const [quantityUnit, setQuantityUnit] = useState<'pcs' | 'meters'>('pcs');
  const [targetPrice, setTargetPrice] = useState(2850);
  const [deliveryDeadline, setDeliveryDeadline] = useState('2025-09-30');
  const [expiryDate, setExpiryDate] = useState('2025-06-15');
  const [referenceImages, setReferenceImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400'
  ]);

  // Search/Filter dropdown states
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [craftTypeSearch, setCraftTypeSearch] = useState('');
  const [showCraftTypeDropdown, setShowCraftTypeDropdown] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const craftTypeRef = useRef<HTMLDivElement>(null);

  // Step 2 States
  const [material, setMaterial] = useState('Pure Silk');
  const [technique, setTechnique] = useState('Handwoven Banarasi');
  const [color, setColor] = useState('Maroon & Gold');
  const [size, setSize] = useState('6.3 m (with blouse)');
  const [description, setDescription] = useState('Elegant Banarasi silk saree with traditional zari motifs, intricate border and rich pallu. Authentic handwoven craftsmanship from Varanasi.');
  const [packagingDetails, setPackagingDetails] = useState('Premium Saree Box with Silk Paper & Branding Sticker');
  const [materialDetails, setMaterialDetails] = useState('Pure mulberry silk warp & weft with 5% gold zari thread detailing');
  const [sampleRequired, setSampleRequired] = useState(true);
  const [sampleQuantity, setSampleQuantity] = useState(2);
  const [sampleQuantityUnit, setSampleQuantityUnit] = useState<'pcs' | 'meters'>('pcs');
  const [sampleDate, setSampleDate] = useState('2025-07-10');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('banarasi_floral_saree_specs.pdf');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageGalleryModal, setShowImageGalleryModal] = useState(false);

  // Step 3 States
  const [deliveryAddress, setDeliveryAddress] = useState('Studio Aesthetic, 125, MG Road, Sultanpur, New Delhi - 110030, India');
  const [shippingResponsibility, setShippingResponsibility] = useState<'Supplier' | 'Buyer'>('Supplier');
  const [paymentTerms, setPaymentTerms] = useState('Milestone Payment');

  // Step 4 States (Preview / Settings Page)
  const [rfqVisibility, setRfqVisibility] = useState('Everyone (Visible to all verified artisans)');
  const [allowChat, setAllowChat] = useState(true);
  const [allowCounterOffer, setAllowCounterOffer] = useState(true);
  const [notesToArtisan, setNotesToArtisan] = useState('Please maintain authentic Banarasi weave quality and finish. Share timeline and pricing details. We value long-term partnerships.');

  const steps = ['Basic Details', 'Specifications', 'Payment & Shipping', 'Preview & Publish'];

  // Handle outside clicks to close searchable dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (craftTypeRef.current && !craftTypeRef.current.contains(e.target as Node)) {
        setShowCraftTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleFileUpload = () => {
    setShowUploadModal(true);
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setShowUploadModal(false);
      alert(`Tech Pack "${file.name}" uploaded successfully! File verified (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
    }
  };

  const selectTemplateFile = (fileName: string) => {
    setUploadedFileName(fileName);
    setShowUploadModal(false);
    alert(`Tech Pack "${fileName}" selected successfully!`);
  };

  const handlePublish = () => {
    createRFQ({
      category: category,
      craftType: craftType,
      qty: quantity,
      budget: targetPrice * quantity,
      deliveryDate: deliveryDeadline,
      deadlineDate: expiryDate,
      techPackUrl: uploadedFileName ? '#' : undefined
    });
    alert(`Custom Order Published Live to Indian Artisan Network!\nQuotes will begin arriving for ${productName} on your Custom Orders dashboard.`);
    setCurrentView('rfq-market');
  };

  // Filter lists based on searches
  const filteredCategories = PRODUCT_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredCraftTypes = CRAFT_TECHNIQUES.filter(craft => 
    craft.toLowerCase().includes(craftTypeSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col pb-8 bg-[#FFFBF9]">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setCurrentView('rfq-market')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <h2 className="font-heading font-black text-base text-stone-850">Create Custom Order</h2>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* 4-step horizontal tracker */}
        <div className="flex justify-between items-center relative py-1 px-1 bg-white rounded-3xl p-4 border border-stone-150 shadow-[0_2px_12px_rgba(0,0,0,0.03)] shrink-0">
          {/* Background line */}
          <div className="absolute left-6 right-6 top-[30px] h-0.5 bg-stone-100 z-0" />
          
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const completed = stepNum < activeStep;
            const current = stepNum === activeStep;
            
            return (
              <div key={label} className="flex flex-col items-center gap-1.5 relative z-10">
                <button
                  type="button"
                  onClick={() => setActiveStep(stepNum)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border-2 ${
                    completed
                      ? 'bg-[#FF6B35] border-[#FF6B35] text-white shadow-sm'
                      : current
                        ? 'bg-stone-900 border-stone-900 text-white shadow ring-4 ring-stone-900/10'
                        : 'bg-white border-stone-200 text-stone-400'
                  }`}
                >
                  {completed ? '✓' : stepNum}
                </button>
                <span className={`text-[8px] font-black tracking-tight uppercase ${
                  current ? 'text-stone-900 font-black' : 'text-stone-400'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
          
          {/* Step 1: Basic Details */}
          {activeStep === 1 && (
            <div className="flex flex-col gap-4.5 text-left text-xs font-semibold text-stone-850">
              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Custom Order Title *</label>
                <input
                  type="text"
                  value={rfqTitle}
                  onChange={(e) => setRfqTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                  placeholder="e.g. Banarasi Silk Saree – BS2611"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Searchable / Typeable Product Category */}
                <div className="relative" ref={categoryRef}>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Product Category *</label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span>{category}</span>
                    <span className="text-stone-400 text-[10px]">▼</span>
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto p-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg mb-2">
                        <Search className="w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Search or type custom category..."
                          className="w-full text-xs bg-transparent focus:outline-none font-bold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {categorySearch.trim() !== '' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCategory(categorySearch);
                              setShowCategoryDropdown(false);
                              setCategorySearch('');
                            }}
                            className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold text-[#FF6B35] bg-[#FFF5F1]"
                          >
                            + Use Custom: "{categorySearch}"
                          </button>
                        )}
                        {filteredCategories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setShowCategoryDropdown(false);
                              setCategorySearch('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              category === cat ? 'bg-[#FFF5F1] text-[#FF6B35]' : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                        {filteredCategories.length === 0 && categorySearch.trim() === '' && (
                          <span className="text-[10px] text-stone-400 block text-center py-4 font-bold">No categories found</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Searchable / Typeable Craft Type */}
                <div className="relative" ref={craftTypeRef}>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Craft Type *</label>
                  <button
                    type="button"
                    onClick={() => setShowCraftTypeDropdown(!showCraftTypeDropdown)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none"
                  >
                    <span>{craftType}</span>
                    <span className="text-stone-400 text-[10px]">▼</span>
                  </button>
                  {showCraftTypeDropdown && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto p-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg mb-2">
                        <Search className="w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={craftTypeSearch}
                          onChange={(e) => setCraftTypeSearch(e.target.value)}
                          placeholder="Search or type custom craft..."
                          className="w-full text-xs bg-transparent focus:outline-none font-bold"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {craftTypeSearch.trim() !== '' && (
                          <button
                            type="button"
                            onClick={() => {
                              setCraftType(craftTypeSearch);
                              setShowCraftTypeDropdown(false);
                              setCraftTypeSearch('');
                            }}
                            className="w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold text-[#FF6B35] bg-[#FFF5F1]"
                          >
                            + Use Custom: "{craftTypeSearch}"
                          </button>
                        )}
                        {filteredCraftTypes.map(craft => (
                          <button
                            key={craft}
                            type="button"
                            onClick={() => {
                              setCraftType(craft);
                              setShowCraftTypeDropdown(false);
                              setCraftTypeSearch('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              craftType === craft ? 'bg-[#FFF5F1] text-[#FF6B35]' : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            {craft}
                          </button>
                        ))}
                        {filteredCraftTypes.length === 0 && craftTypeSearch.trim() === '' && (
                          <span className="text-[10px] text-stone-400 block text-center py-4 font-bold">No craft techniques found</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                  placeholder="e.g. Banarasi Silk Saree BS2611"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Quantity Required *</label>
                  <div className="flex bg-stone-50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-[#FF6B35]">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none"
                      min={1}
                    />
                    <select
                      value={quantityUnit}
                      onChange={(e) => {
                        const val = e.target.value as 'pcs' | 'meters';
                        setQuantityUnit(val);
                        // Sync sample unit automatically
                        setSampleQuantityUnit(val);
                      }}
                      className="bg-stone-100 border-l border-stone-200 px-2 text-xs font-bold text-stone-700 focus:outline-none"
                    >
                      <option value="pcs">pcs</option>
                      <option value="meters">meters</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Target Price per Piece *</label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-[#FF6B35]">
                    <span className="text-stone-400 font-bold mr-1 text-xs">₹</span>
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-2">Production Timeline *</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[8px] font-black text-stone-400 uppercase block mb-1">Delivery Deadline</label>
                    <input
                      type="date"
                      value={deliveryDeadline}
                      onChange={(e) => setDeliveryDeadline(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-bold text-stone-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-stone-400 uppercase block mb-1">Custom Order Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs font-bold text-stone-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-2">Reference Images (Optional)</label>
                <div className="flex gap-2">
                  {referenceImages.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 rounded-xl border border-stone-250 overflow-hidden relative group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button 
                        type="button"
                        onClick={() => setReferenceImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setShowImageGalleryModal(true)}
                    className="w-16 h-16 rounded-xl border-2 border-dashed border-stone-300 hover:border-primary flex items-center justify-center text-stone-400 hover:text-primary transition-all text-xl font-bold bg-stone-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specifications */}
          {activeStep === 2 && (
            <div className="flex flex-col gap-4.5 text-left text-xs font-semibold text-stone-850">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Material *</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Pure Silk / Kala Cotton"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Technique *</label>
                  <input
                    type="text"
                    value={technique}
                    onChange={(e) => setTechnique(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Handloom Weaving / Dhokra Casting"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Color *</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Maroon & Gold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Size *</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. 6.3 m (with blouse)"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#FF6B35] h-20 resize-none"
                  maxLength={500}
                />
                <span className="text-[9px] text-stone-400 font-bold block text-right mt-1">{description.length}/500</span>
              </div>

              <div className="flex flex-col gap-3.5 border-t border-stone-100 pt-3">
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Material / Yarn Details *</label>
                  <input
                    type="text"
                    value={materialDetails}
                    onChange={(e) => setMaterialDetails(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Pure mulberry silk warp & weft"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Packing / Packaging Details *</label>
                  <input
                    type="text"
                    value={packagingDetails}
                    onChange={(e) => setPackagingDetails(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                    placeholder="e.g. Premium Saree Box with Silk Paper"
                  />
                </div>

                {/* Sample Required Switch and Conditional Sub-Fields */}
                <div className="bg-stone-50/50 border border-stone-150 rounded-2xl p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-xs font-black text-stone-850 block">Sample Required *</span>
                      <span className="text-[9px] text-stone-500 font-bold block mt-0.5">Request a mock sample before production</span>
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-stone-250">
                      <button
                        type="button"
                        onClick={() => setSampleRequired(true)}
                        className={`px-4 py-1.5 text-xs font-extrabold transition-all ${
                          sampleRequired ? 'bg-[#FF6B35] text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setSampleRequired(false)}
                        className={`px-4 py-1.5 text-xs font-extrabold transition-all ${
                          !sampleRequired ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {sampleRequired && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/50 animate-fadeIn">
                      <div>
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Sample Quantity Required</label>
                        <div className="flex bg-white border border-stone-200 rounded-lg overflow-hidden focus-within:border-[#FF6B35]">
                          <input
                            type="number"
                            value={sampleQuantity}
                            onChange={(e) => setSampleQuantity(parseInt(e.target.value) || 1)}
                            className="w-full bg-transparent px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none"
                            min={1}
                          />
                          <select
                            value={sampleQuantityUnit}
                            onChange={(e) => setSampleQuantityUnit(e.target.value as 'pcs' | 'meters')}
                            className="bg-stone-50 border-l border-stone-200 px-1 text-[10px] font-bold text-stone-600 focus:outline-none"
                          >
                            <option value="pcs">pcs</option>
                            <option value="meters">meters</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-stone-500 uppercase tracking-wider block mb-1">Sample Delivery Date</label>
                        <input
                          type="date"
                          value={sampleDate}
                          onChange={(e) => setSampleDate(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-2">Tech Pack (Optional)</label>
                {uploadedFileName ? (
                  <div className="border border-green-200 bg-green-50/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📄</span>
                      <span className="text-xs font-black text-stone-700 truncate max-w-[200px]">{uploadedFileName}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setUploadedFileName(null)}
                      className="text-[10px] font-bold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    className="w-full py-4 border-2 border-dashed border-stone-300 hover:border-primary rounded-2xl flex flex-col items-center justify-center gap-1.5 text-stone-400 hover:text-primary transition-all bg-stone-50"
                  >
                    <span className="text-xl">📤</span>
                    <span className="text-xs font-extrabold">Upload Tech Pack / Specs</span>
                    <span className="text-[9px] text-stone-400">PDF, ZIP up to 20MB</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Payment & Shipping */}
          {activeStep === 3 && (
            <div className="flex flex-col gap-4.5 text-left text-xs font-semibold text-stone-850">
              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1.5">Delivery Address *</label>
                <div className="bg-stone-50 border border-stone-250 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFEAE0] flex items-center justify-center text-xl shrink-0">📍</div>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none resize-none h-12 leading-relaxed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-2">Shipping Responsibility *</label>
                <div className="flex flex-col gap-2">
                  {[
                    { key: 'Supplier', label: 'Supplier will arrange shipping' },
                    { key: 'Buyer', label: 'Buyer will arrange shipping' }
                  ].map(opt => {
                    const isSelected = shippingResponsibility === opt.key;
                    return (
                      <div
                        key={opt.key}
                        onClick={() => setShippingResponsibility(opt.key as 'Supplier' | 'Buyer')}
                        className={`p-3 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                          isSelected ? 'border-[#FF6B35] bg-[#FFF5F1]' : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#FF6B35] text-[#FF6B35]' : 'border-stone-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
                        </div>
                        <span className="text-xs font-bold text-stone-800">{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-2">Payment Terms *</label>
                <div className="flex flex-col gap-2">
                  {[
                    { key: '100% Advance', label: '100% Advance', desc: 'Full payment before production starts', icon: '💰' },
                    { key: 'Milestone Payment', label: 'Milestone Payment', desc: '30% Advance · 40% Mid Production · 30% After Delivery', icon: '⚖️' },
                    { key: 'Purchase Order Financing', label: 'Purchase Order Financing', desc: 'Financing support through our partner (T&C apply)', icon: '🏛️' },
                    { key: 'Wallet Payment', label: 'Wallet Payment', desc: 'Lock money until delivery', icon: '💼' },
                    { key: 'Pay After Delivery', label: 'Pay After Delivery', desc: 'Large companies & existing relationships', icon: '🚚' },
                    { key: 'Letter of Credit (LC)', label: 'Letter of Credit (LC)', desc: 'For exporters only', icon: '📜' }
                  ].map(opt => {
                    const isSelected = paymentTerms === opt.key;
                    return (
                      <div
                        key={opt.key}
                        onClick={() => setPaymentTerms(opt.key)}
                        className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all relative ${
                          isSelected ? 'border-[#FF6B35] bg-[#FFF5F1] shadow-sm' : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <span className="text-xl shrink-0">{opt.icon}</span>
                          <div>
                            <span className="text-xs font-black text-stone-850 block">{opt.label}</span>
                            <span className="text-[9px] text-stone-500 font-bold block mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#FF6B35] text-[#FF6B35] bg-[#FFF5F1]' : 'border-stone-300'
                        }`}>
                          {isSelected && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview & Publish (Includes Communication & Visibility configurations) */}
          {activeStep === 4 && (
            <div className="flex flex-col gap-5 text-xs font-semibold text-stone-850 text-left">
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-3.5 flex gap-4">
                {/* Product Saree Image Preview */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-150 border border-stone-200 shrink-0">
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400" className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-stone-850 truncate leading-snug">{rfqTitle}</h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px] font-bold text-stone-600">
                    <div>Category: <span className="text-stone-800">{category}</span></div>
                    <div>Craft: <span className="text-stone-800">{craftType}</span></div>
                    <div>Technique: <span className="text-stone-800">{technique}</span></div>
                    <div>Material: <span className="text-stone-800">{material}</span></div>
                    <div className="col-span-2">Color: <span className="text-stone-800">{color}</span></div>
                  </div>
                </div>
              </div>

              {/* Sourcing Parameters Table */}
              <div className="flex flex-col gap-2 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Quantity Required</span>
                  <span className="font-extrabold text-stone-850">{quantity} {quantityUnit}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Target Price per Piece</span>
                  <span className="font-extrabold text-stone-850">₹{targetPrice.toLocaleString('en-IN')} per piece</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Delivery Deadline</span>
                  <span className="font-extrabold text-stone-850">{deliveryDeadline}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Custom Order Expiry Date</span>
                  <span className="font-extrabold text-stone-850">{expiryDate}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Payment Terms</span>
                  <div className="text-right">
                    <span className="font-extrabold text-stone-850 block">{paymentTerms}</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Shipping Responsibility</span>
                  <span className="font-extrabold text-stone-850">{shippingResponsibility === 'Supplier' ? 'Supplier will arrange shipping' : 'Buyer will arrange shipping'}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Packaging Requirements</span>
                  <span className="font-extrabold text-stone-850 truncate max-w-[200px]">{packagingDetails}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2 items-center">
                  <span className="text-stone-500 font-bold">Material / Yarn Details</span>
                  <span className="font-extrabold text-stone-850 truncate max-w-[200px]">{materialDetails}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-bold">Customization Details</span>
                  <span className="font-extrabold text-stone-850">
                    {sampleRequired ? `Sample Required (${sampleQuantity} ${sampleQuantityUnit} by ${sampleDate})` : 'No Sample Required'}
                  </span>
                </div>
              </div>

              {/* 4th Page Settings Details (Merged directly into Preview Page) */}
              <div className="border-t border-stone-200 pt-4 flex flex-col gap-4">
                <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">Communication & Visibility Settings</span>
                
                {/* RFQ Visibility Custom Selector */}
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Custom Order Visibility *</label>
                  <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-[#FF6B35]">
                    <span className="text-stone-600 mr-2 text-xs">🌐</span>
                    <select
                      value={rfqVisibility}
                      onChange={(e) => setRfqVisibility(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-stone-800 focus:outline-none"
                    >
                      {VISIBILITY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Allow Chat */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 border border-stone-200 rounded-2xl text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">💬</span>
                    <div>
                      <span className="text-xs font-black text-stone-850 block">Allow Chat</span>
                      <span className="text-[9px] text-stone-500 font-bold block mt-0.5">Suppliers can message you directly</span>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setAllowChat(!allowChat)}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      allowChat ? 'bg-[#FF6B35]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${
                      allowChat ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Allow Counter Offer */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50/50 border border-stone-200 rounded-2xl text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-lg shrink-0">🏷️</span>
                    <div>
                      <span className="text-xs font-black text-stone-850 block">Allow Counter Offer</span>
                      <span className="text-[9px] text-stone-500 font-bold block mt-0.5">Suppliers can submit counter offers on price & delivery</span>
                    </div>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setAllowCounterOffer(!allowCounterOffer)}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      allowCounterOffer ? 'bg-[#FF6B35]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${
                      allowCounterOffer ? 'left-5.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Notes to Artisan */}
                <div>
                  <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Notes to Artisan (Optional)</label>
                  <textarea
                    value={notesToArtisan}
                    onChange={(e) => setNotesToArtisan(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-[#FF6B35] h-20 resize-none"
                    maxLength={300}
                    placeholder="Provide any additional specifications, cluster preferences, or guidelines..."
                  />
                  <span className="text-[9px] text-stone-400 font-bold block text-right mt-1">{notesToArtisan.length}/300</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer info verification badge */}
        <div className="flex items-center gap-1.5 justify-center text-[#FF6B35] text-[10px] font-extrabold uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Only verified artisans will respond to Custom Orders</span>
        </div>

        {/* Stepper Buttons */}
        <div className="flex gap-3 mt-2">
          {activeStep > 1 && (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="flex-1 py-4 text-xs font-bold text-stone-750 border border-stone-200 bg-white rounded-xl hover:bg-stone-50"
            >
              Back
            </button>
          )}

          {activeStep < 4 ? (
            <Button
              onClick={() => {
                if (activeStep === 1 && referenceImages.length === 0) {
                  alert("Please select at least one reference image from the gallery to proceed.");
                  setShowImageGalleryModal(true);
                  return;
                }
                setActiveStep(activeStep + 1);
              }}
              showArrow={true}
              className="flex-1"
            >
              Next Step
            </Button>
          ) : (
            <div className="flex flex-1 gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Custom order saved as draft successfully!');
                  setCurrentView('rfq-market');
                }}
                className="px-4 py-4 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Save Draft
              </button>
              <Button
                onClick={handlePublish}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white"
              >
                Publish Custom Order
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* Reference Image Gallery Modal */}
      {showImageGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left font-sans animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 flex flex-col gap-4 shadow-xl border border-stone-100">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-heading font-black text-base text-stone-850">Reference Image Gallery</h3>
              <button 
                type="button"
                onClick={() => {
                  if (referenceImages.length === 0) {
                    alert("Please select at least one reference image from the gallery.");
                    return;
                  }
                  setShowImageGalleryModal(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-50 border border-stone-200 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Select reference design images from our curated catalog of Indian handcrafts and textiles to attach to your Custom Order.
            </p>

            <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
              {MOCK_GALLERY_IMAGES.map((item, idx) => {
                const isSelected = referenceImages.includes(item.url);
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (isSelected) {
                        setReferenceImages(prev => prev.filter(img => img !== item.url));
                      } else {
                        setReferenceImages(prev => [...prev, item.url]);
                      }
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative group ${
                      isSelected ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20' : 'border-stone-200 hover:border-[#FF6B35]'
                    }`}
                  >
                    <img src={item.url} className="w-full h-full object-cover" alt={item.label} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[9px] font-black px-1 text-center">{item.label}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF6B35] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Hidden file input for device upload */}
            <input
              type="file"
              id="ref-image-device-file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const result = event.target?.result as string;
                    if (result) {
                      setReferenceImages(prev => [...prev, result]);
                      setShowImageGalleryModal(false);
                      alert("Reference image uploaded successfully from device!");
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <div className="flex gap-2 mt-2">
              <label
                htmlFor="ref-image-device-file"
                className="flex-1 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                Choose image from Device
              </label>
              <button
                type="button"
                onClick={() => {
                  if (referenceImages.length === 0) {
                    alert("Please select at least one reference image from the gallery.");
                    return;
                  }
                  setShowImageGalleryModal(false);
                }}
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs transition-all text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tech Pack Gallery / Template Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left font-sans">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 shadow-xl border border-stone-100">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h3 className="font-heading font-black text-base text-stone-850">Tech Pack Gallery / Templates</h3>
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-stone-50 border border-stone-200 text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Upload a blueprint or pick from our specs file gallery. You can select a local file or select from sample specs.
            </p>

            {/* Real local file picker hidden input */}
            <input 
              type="file" 
              id="tech-pack-file" 
              accept=".pdf,image/*" 
              className="hidden" 
              onChange={onFileSelected} 
            />

            {/* Dash border trigger area */}
            <label 
              htmlFor="tech-pack-file"
              className="h-28 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <UploadCloud className="w-6 h-6 text-[#FF6B35]" />
              <span className="text-xs font-bold text-text-primary">Choose PDF from Device</span>
              <span className="text-[9px] text-stone-500 font-bold">Supports PDF, PNG, JPG up to 25MB</span>
            </label>

            <div className="relative my-1 text-center">
              <hr className="border-stone-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[9px] font-black text-stone-300 uppercase tracking-wider">
                Or Select from Gallery
              </span>
            </div>

            {/* Grid of sample blueprints */}
            <div className="flex flex-col gap-2">
              {[
                { name: 'banarasi_floral_saree_specs.pdf', size: '1.8 MB' },
                { name: 'cotton_dhurrie_geometric_design.pdf', size: '3.2 MB' },
                { name: 'woodcraft_table_blueprints.pdf', size: '4.5 MB' }
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectTemplateFile(tmpl.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-white hover:border-[#FF6B35] hover:bg-[#FFF5F1] text-left transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📄</span>
                    <span className="text-xs font-bold text-stone-700 group-hover:text-primary transition-colors truncate max-w-[200px]">
                      {tmpl.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-stone-400 shrink-0">{tmpl.size}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(false)}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl text-xs transition-all text-center mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
