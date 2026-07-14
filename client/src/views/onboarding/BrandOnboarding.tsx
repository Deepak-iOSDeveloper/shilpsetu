import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, Award, Globe, ShieldCheck, 
  CheckCircle2, CreditCard, Sparkles, User, Store, Phone, Mail, Building, FileText, MapPin, X, Plus
} from 'lucide-react';

// Custom Banner SVG 1: Boutique Manager at Desk
const BannerBoutiqueDeskSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hanger Rack with Apparel */}
    <rect x="250" y="30" width="4" height="100" fill="#7C7C7C" />
    <rect x="330" y="30" width="4" height="100" fill="#7C7C7C" />
    <line x1="245" y1="40" x2="335" y2="40" stroke="#7C7C7C" strokeWidth="4" strokeLinecap="round" />
    {/* Hanging Clothes */}
    <rect x="260" y="44" width="16" height="60" rx="3" fill="#D36B3B" />
    <rect x="282" y="44" width="18" height="65" rx="3" fill="#B22222" />
    <rect x="306" y="44" width="15" height="55" rx="3" fill="#2E7D32" />

    {/* Mannequin with Saree */}
    <ellipse cx="90" cy="132" rx="15" ry="4" fill="#8B4513" />
    <line x1="90" y1="80" x2="90" y2="132" stroke="#8B4513" strokeWidth="3" />
    <path d="M90 55 C80 65, 75 95, 78 120 H102 C105 95, 100 65, 90 55 Z" fill="#D36B3B" />
    <path d="M78 80 C88 80, 95 62, 102 78" stroke="#FFD700" strokeWidth="3.5" fill="none" />

    {/* Desk with Laptop */}
    <rect x="120" y="90" width="110" height="35" rx="2" fill="#8B5A2B" />
    <line x1="130" y1="125" x2="130" y2="145" stroke="#8B5A2B" strokeWidth="4" />
    <line x1="220" y1="125" x2="220" y2="145" stroke="#8B5A2B" strokeWidth="4" />
    {/* Laptop */}
    <rect x="155" y="72" width="40" height="18" rx="1.5" fill="#AEAEAE" />
    <line x1="150" y1="90" x2="200" y2="90" stroke="#7C7C7C" strokeWidth="2.5" strokeLinecap="round" />

    {/* Designer / Manager Sitting */}
    <circle cx="175" cy="46" r="11" fill="#F3B38B" />
    <path d="M175 57 C160 62, 150 78, 150 90 H200 C200 78, 190 62, 175 57 Z" fill="#1C1816" />
    
    {/* Boutique Text Signboard */}
    <rect x="135" y="100" width="80" height="16" rx="3" fill="#FFF2EE" stroke="#FF6B35" strokeWidth="1" />
    <text x="175" y="111" fill="#FF6B35" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">BOUTIQUE</text>
  </svg>
);

// Custom Banner SVG 2: Boutique Shopfront
const BannerBoutiqueShopSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Isometric Shop Ground */}
    <path d="M60 130 L200 90 L340 130 L200 155 Z" fill="#EAD8C3" />

    {/* Shop Building Frontage */}
    <path d="M110 50 L200 20 L290 50 V115 L200 145 L110 115 Z" fill="#E8D2B4" stroke="#C4A484" strokeWidth="2" />
    {/* Front facade walls */}
    <path d="M200 20 L290 50 V115 L200 145 Z" fill="#D2B48C" />

    {/* Awning (Boutique Canopy) */}
    <path d="M100 65 L200 35 L300 65 L200 85 Z" fill="#B22222" />
    <path d="M100 65 L110 75 L120 65 L130 75 L140 65 L150 75 L160 65 L170 75 L180 65 L190 75 L200 65 L210 75 L220 65 L230 75 L240 65 L250 75 L260 65 L270 75 L280 65 L290 75 L300 65" fill="none" stroke="#FFD700" strokeWidth="2.5" />

    {/* Door */}
    <path d="M185 102 V132 L200 137 L215 132 V102 Z" fill="#8B4513" />
    <circle cx="210" cy="118" r="1.5" fill="#FFD700" />

    {/* Display Windows */}
    <path d="M130 85 V110 L165 120 V95 Z" fill="#FFFFFF" opacity="0.3" stroke="#8B4513" strokeWidth="1.5" />
    <path d="M235 95 V120 L270 110 V85 Z" fill="#FFFFFF" opacity="0.3" stroke="#8B4513" strokeWidth="1.5" />

    {/* Planter pots */}
    <circle cx="120" cy="122" r="5" fill="#CD853F" />
    <circle cx="280" cy="122" r="5" fill="#CD853F" />
  </svg>
);

// Custom Banner SVG 3: Textile rolls and clay pot displaying craft sourcing
const BannerSourcingInterestsSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wooden display stand */}
    <rect x="80" y="110" width="240" height="20" rx="3" fill="#8B4513" />

    {/* Stacked textile rolls */}
    {/* Roll 1 (Red Banarasi) */}
    <rect x="100" y="80" width="80" height="30" rx="4" fill="#B22222" />
    <ellipse cx="180" cy="95" rx="6" ry="15" fill="#FFD700" />
    <path d="M100 95 H165" stroke="#FFD700" strokeWidth="2" strokeDasharray="3,3" />

    {/* Roll 2 (Green Ikat) */}
    <rect x="110" y="55" width="80" height="28" rx="4" fill="#2E7D32" />
    <ellipse cx="190" cy="69" rx="5" ry="14" fill="#8FBC8F" />
    <path d="M110 69 H175" stroke="#FFC857" strokeWidth="1.5" />

    {/* Roll 3 (Yellow Bandhani) */}
    <rect x="120" y="30" width="70" height="26" rx="4" fill="#FFC72C" />
    <ellipse cx="190" cy="43" rx="4" ry="13" fill="#D36B3B" />

    {/* Earthen Clay Pot in center */}
    <path d="M215 110 C210 90, 218 75, 230 75 C242 75, 250 90, 245 110 Z" fill="#CD853F" stroke="#8B4513" strokeWidth="1.5" />
    <ellipse cx="230" cy="75" rx="10" ry="3" fill="#8B4513" />
    <path d="M218 95 Q230 102 242 95" fill="none" stroke="#FFD700" strokeWidth="2" />

    {/* Small handloom miniature on the right */}
    <rect x="270" y="45" width="6" height="65" fill="#8B4513" />
    <rect x="315" y="45" width="6" height="65" fill="#8B4513" />
    <line x1="268" y1="55" x2="322" y2="55" stroke="#8B4513" strokeWidth="3" />
    <line x1="268" y1="95" x2="322" y2="95" stroke="#8B4513" strokeWidth="4" />
    {/* Colorful warp threads */}
    {Array.from({ length: 8 }).map((_, i) => (
      <line key={i} x1={279 + i * 5} y1="55" x2={279 + i * 5} y2="95" stroke="#FF6B35" strokeWidth="1.5" opacity="0.8" />
    ))}
  </svg>
);

export const BrandOnboarding: React.FC = () => {
  const { registerUser, setCurrentView } = useApp();

  const [step, setStep] = useState(1);

  // ==========================================
  // STEP 1 FIELDS (Basic Info)
  // ==========================================
  const [brandName, setBrandName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validatePhone = (val: string) => {
    if (!val.trim()) {
      setPhoneError('');
      return;
    }
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 10) {
      setPhoneError('Invalid number (must be 10 digits)');
    } else {
      setPhoneError('');
    }
  };

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      setEmailError('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError('Invalid email');
    } else {
      setEmailError('');
    }
  };

  // ==========================================
  // STEP 2 FIELDS (Business Details)
  // ==========================================
  const [businessType, setBusinessType] = useState('Select business type');
  const [gstNumber, setGstNumber] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Select state');

  // ==========================================
  // STEP 3 FIELDS (Business Interests)
  // ==========================================
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [catSearchText, setCatSearchText] = useState('');

  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [showCraftDropdown, setShowCraftDropdown] = useState(false);
  const [craftSearchText, setCraftSearchText] = useState('');

  const [sourcingPref, setSourcingPref] = useState<'Ready' | 'Made-to-Order' | 'Both'>('Both');
  const [avgOrderSize, setAvgOrderSize] = useState('Select range');

  // Mapping of Product Categories to specific Craft Types
  const onboardingCategoryCrafts: Record<string, string[]> = {
    'Dupattas & Stoles': [
      'Cotton Dupattas', 'Silk Dupattas', 'Chanderi Dupattas', 'Banarasi Dupattas', 
      'Ajrakh Dupattas', 'Kalamkari Dupattas', 'Ikat Dupattas', 'Bandhani Dupattas', 
      'Stoles', 'Shawls'
    ],
    'Floor Coverings': [
      'Rugs & Durries', 'Coasters', 'Mats'
    ],
    'Kitchen & Dining Linen': [
      'Table Decor', 'Decorative Trays', 'Coasters', 'Kitchen Accessories'
    ],
    'Gamchha': [
      'Cotton Gamchha', 'Khadi Gamchha'
    ],
    'Shawls': [
      'Pashmina Shawls', 'Woolen Shawls', 'Kashmiri Shawls'
    ],
    'Dress Materials & Fabrics': [
      'Cotton Fabric', 'Silk Fabric', 'Linen Fabric', 'Khadi Fabric', 'Chanderi Fabric', 
      'Banarasi Fabric', 'Tangaliya Fabric', 'Ikat Fabric', 'Ajrakh Fabric', 'Kalamkari Fabric', 
      'Printed Fabric', 'Embroidered Fabric', 'Dress Material'
    ],
    'Dhotis, Mundus & Lungis': [
      'Traditional Dhotis', 'Kerala Mundu', 'Cotton Lungis'
    ],
    'Bedcovers & Bedsheets': [
      'Cotton Bedcovers', 'Silk Bedcovers', 'Embroidered Bedsheets'
    ],
    'Pillow Covers & Cushions': [
      'Cushion Covers', 'Pillow Cases'
    ],
    'Curtains & Drapes': [
      'Cotton Curtains', 'Linen Curtains'
    ],
    'Wood Craft': [
      'Furniture', 'Toys', 'Wall Panels', 'Wall Decor', 'Mirror Frames', 'Jewelry Boxes', 
      'Storage Boxes', 'Serving Trays', 'Bowls', 'Coasters', 'Sculptures', 'Key Holders', 
      'Kitchen Accessories'
    ],
    'Pottery & Ceramics': [
      'Diyas', 'Planters', 'Flower Pots', 'Vases', 'Sculptures', 'Wall Plates', 
      'Decorative Tiles', 'Table Decor', 'Candle Holders', 'Kitchenware'
    ],
    'Metal Craft': [
      'Brass Vases', 'Dhokra Figurines', 'Bidriware', 'Candle Holders', 'Diyas', 
      'Bells', 'Copper Bottles', 'Copper Tumblers', 'Decorative Bowls', 'Trays', 'Wall Decor'
    ],
    'Cane & Bamboo': [
      'Baskets', 'Furniture', 'Mats', 'Decor'
    ],
    'Jute Products': [
      'Jute Bags', 'Jute Rugs', 'Jute Wall Hangings'
    ],
    'Macramé & Rope': [
      'Wall Hangings', 'Planters', 'Decor'
    ],
    'Stone Craft': [
      'Sculptures', 'Jali Work', 'Decor'
    ],
    'Leather Craft': [
      'Wallets', 'Bags', 'Footwear'
    ],
    'Jewellery': [
      'Earrings', 'Necklaces', 'Pendants', 'Bangles', 'Bracelets', 'Rings', 'Anklets', 
      'Nose Pins', 'Brooches', 'Hair Accessories', 'Jewellery Sets'
    ],
    'Paintings & Wall Art': [
      'Madhubani', 'Warli', 'Gond', 'Pattachitra', 'Kalamkari Art', 'Pichwai', 'Phad', 
      'Miniature Paintings', 'Lippan Art', 'Canvas Art', 'Wall Frames'
    ],
    'Toys & Dolls': [
      'Wooden Toys', 'Channapatna Toys', 'Kondapalli Toys', 'Cloth Dolls', 'Puppets', 
      'Educational Toys', 'Decorative Toys', 'Soft Toys'
    ],
    'Handmade Paper': [
      'Diaries', 'Gift Boxes', 'Paper Bags'
    ],
    'Home Decor': [
      'Wall Hangings', 'Wall Art', 'Wall Panels', 'Mirrors', 'Photo Frames', 'Clocks', 
      'Candle Holders', 'Diyas', 'Lanterns', 'Vases', 'Planters', 'Decorative Bowls', 
      'Decorative Trays', 'Sculptures', 'Figurines', 'Incense Holders', 'Table Decor', 
      'Cushion Covers', 'Throws', 'Rugs & Durries'
    ],
    'Religious & Spiritual': [
      'Diyas', 'Idols', 'Incense Holders', 'Bells'
    ],
    'Gift & Lifestyle': [
      'Jewelry Boxes', 'Trays', 'Candle Holders', 'Diaries'
    ],
    'Embroidery & Textile Craft': [
      'Chikankari', 'Kantha', 'Phulkari', 'Zardosi'
    ],
    'Glass Craft': [
      'Bangles', 'Lanterns', 'Vases'
    ],
    'Shell Craft': [
      'Jewellery', 'Wall Art', 'Decor'
    ],
    'Palm Leaf Craft': [
      'Baskets', 'Wall Art', 'Mats'
    ],
    'Furniture & Utility': [
      'Chairs', 'Stools', 'Coffee Tables', 'Side Tables', 'Benches', 'Cabinets', 'Shelves', 
      'TV Units', 'Console Tables', 'Storage Units'
    ],
    'Saree': [
      'Banarasi Saree', 'Chanderi Saree', 'Maheshwari Saree', 'Paithani Saree', 
      'Kanjeevaram Saree', 'Jamdani Saree', 'Bhagalpur Silk Saree', 'Silk Saree', 
      'Handloom Saree', 'Printed Saree', 'Cotton Saree'
    ]
  };

  const categoriesList = Object.keys(onboardingCategoryCrafts);

  const businessTypesList = [
    'Retailer', 'Wholesaler', 'D2C Brand', 'Exporter', 'Boutique Owner', 'Buying House', 'Designer Brand', 'Other'
  ];

  const statesList = [
    'Delhi', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Rajasthan', 'Madhya Pradesh'
  ];

  const orderSizeRangesList = [
    '₹50K - ₹2L', '₹2L - ₹5L', '₹5L - ₹10L', '₹10L+'
  ];

  const handleGetOtp = () => {
    if (!phone.trim() || phoneError) {
      alert("Please enter a valid 10-digit mobile number first.");
      return;
    }
    setOtpSent(true);
    alert(`Mock OTP sent to ${phone} successfully! (Code: 5678)`);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!brandName.trim()) {
        alert("Please enter your brand name.");
        return;
      }
      if (!contactPerson.trim()) {
        alert("Please enter contact person name.");
        return;
      }
      if (!phone.trim() || phoneError) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (email && emailError) {
        alert("Please enter a valid email address.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (businessType === 'Select business type') {
        alert("Please select your business type.");
        return;
      }
      if (!address.trim()) {
        alert("Please enter your business street address.");
        return;
      }
      if (!city.trim()) {
        alert("Please enter your city.");
        return;
      }
      if (stateName === 'Select state') {
        alert("Please select your state.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 1) {
      setCurrentView('role-selection');
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    if (selectedCats.length === 0) {
      alert("Please select at least one product category.");
      return;
    }
    if (selectedCrafts.length === 0) {
      alert("Please select at least one craft type.");
      return;
    }
    if (avgOrderSize === 'Select range') {
      alert("Please select your average order size.");
      return;
    }

    const finalBrandData = {
      uid: 'brand-' + Date.now(),
      brandName: brandName,
      contactPerson,
      phone,
      email: email || undefined,
      businessType,
      gst: gstNumber || undefined,
      websiteUrl: websiteUrl || undefined,
      address: {
        street: address,
        city,
        state: stateName
      },
      categories: selectedCats,
      craftInterests: selectedCrafts,
      preference: sourcingPref,
      avgOrderSize
    };

    registerUser(finalBrandData);
    alert(`Welcome to Shilp Setu, ${brandName}! Your corporate sourcing hub is setup.`);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFFBF7] min-h-screen">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevStep}
          className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-sm hover:bg-stone-50 transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-stone-850" />
        </button>
        
        {/* Step indicator horizontal dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                step >= num 
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]' 
                  : 'bg-white text-stone-400 border-stone-200'
              }`}>
                {step > num ? '✓' : num}
              </span>
              {num !== 3 && <div className="w-6 border-t border-stone-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1: Basic Information */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <BannerBoutiqueDeskSVG />
            
            <div className="text-left mt-2">
              <h2 className="text-2xl font-bold font-heading text-stone-850 leading-tight">Welcome to <span className="text-[#FF6B35]">Shilp Setu</span></h2>
              <span className="text-[10px] text-text-secondary font-bold block mt-1 uppercase tracking-wider">
                India's Artisan Marketplace for Brands like Yours
              </span>
            </div>

            {/* Inputs Form */}
            <div className="flex flex-col gap-4">
              
              {/* Brand Name */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <Store className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* Contact Person */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <User className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Enter contact person name"
                  className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* Phone + Get OTP */}
              <div className="flex flex-col">
                <div className="bg-white rounded-2xl p-3 pl-4 border border-stone-200/60 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-grow">
                    <Phone className="w-5 h-5 text-stone-400 shrink-0" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhone(val);
                        validatePhone(val);
                      }}
                      placeholder="Enter mobile number"
                      className="w-full text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                    />
                  </div>
                  <button
                    onClick={handleGetOtp}
                    className="px-4 py-2 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-[10px] font-black rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
                  >
                    {otpSent ? 'Resend' : 'Get OTP'}
                  </button>
                </div>
                {phoneError && (
                  <span className="text-[10px] font-extrabold text-red-500 text-left mt-1.5 ml-2">
                    {phoneError}
                  </span>
                )}
              </div>

              {/* Email (Optional) */}
              <div className="flex flex-col">
                <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      validateEmail(val);
                    }}
                    placeholder="Enter email address (optional)"
                    className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                  />
                </div>
                {emailError && (
                  <span className="text-[10px] font-extrabold text-red-500 text-left mt-1.5 ml-2">
                    {emailError}
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleNextStep}
              className="w-full py-4 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all active:scale-98"
            >
              <span>Continue</span>
              <span className="font-bold">→</span>
            </button>
            <span className="text-[9.5px] font-bold text-stone-400 text-center flex items-center justify-center gap-1">
              <span>🔐</span> Your data is safe with us
            </span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: Business Details */}
      {/* ============================================================== */}
      {step === 2 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[75vh]">
            <BannerBoutiqueShopSVG />

            <div className="text-left mt-1">
              <h2 className="text-xl font-bold font-heading text-stone-850 leading-tight">Business Details</h2>
              <span className="text-[10px] text-text-secondary font-bold block mt-0.5 uppercase tracking-wider">
                Help us know more about your business
              </span>
            </div>

            {/* Inputs Form */}
            <div className="flex flex-col gap-3.5">
              
              {/* Business Type dropdown */}
              <div className="bg-white rounded-2xl p-3.5 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <Store className="w-5 h-5 text-stone-400 shrink-0" />
                <div className="flex-grow text-left">
                  <label className="text-[8px] font-black text-text-secondary uppercase tracking-wider block">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full text-xs font-bold text-text-primary bg-transparent focus:outline-none cursor-pointer mt-0.5"
                  >
                    <option value="Select business type" disabled>Select business type</option>
                    {businessTypesList.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GST Number */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <FileText className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  placeholder="Enter GST number (optional)"
                  className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* Website URL */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <Globe className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Website URL (optional)"
                  className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* Business Address */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <MapPin className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter complete address"
                  className="flex-grow text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                />
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full text-xs font-bold text-text-primary focus:outline-none placeholder:text-stone-300 bg-transparent"
                  />
                </div>

                <div className="bg-white rounded-2xl p-3 pl-4 border border-stone-200/60 shadow-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                  <select
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs font-bold text-text-primary bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="Select state" disabled>Select state</option>
                    {statesList.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 mt-8 shrink-0">
            <button
              onClick={handlePrevStep}
              className="flex-1 py-4 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-3xl transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="flex-1 py-4 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Continue</span>
              <span className="font-bold">→</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: Business Interests */}
      {/* ============================================================== */}
      {step === 3 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[75vh]">
            <BannerSourcingInterestsSVG />

            <div className="text-left mt-1">
              <h2 className="text-xl font-bold font-heading text-stone-850 leading-tight">Business Interests</h2>
              <span className="text-[10px] text-text-secondary font-bold block mt-0.5 uppercase tracking-wider">
                Tell us what you love to source
              </span>
            </div>

            {/* Product Category Custom Searchable Dropdown */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm text-left flex flex-col gap-2 relative">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">Product Category *</label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowCatDropdown(!showCatDropdown);
                    setShowCraftDropdown(false);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className={selectedCats[0] ? 'text-stone-900' : 'text-stone-400'}>
                    {selectedCats[0] || 'Select Category'}
                  </span>
                  <span className="text-stone-400 text-[10px]">▼</span>
                </button>

                {showCatDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1.5">
                    {/* Search Field */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <input
                        type="text"
                        value={catSearchText}
                        onChange={(e) => setCatSearchText(e.target.value)}
                        placeholder="Search category..."
                        className="w-full text-xs bg-transparent focus:outline-none font-bold"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {/* List */}
                    <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5">
                      {categoriesList
                        .filter(cat => cat.toLowerCase().includes(catSearchText.toLowerCase()))
                        .map(cat => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => {
                              setSelectedCats([cat]);
                              setSelectedCrafts([]);
                              setShowCatDropdown(false);
                              setCatSearchText('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              selectedCats[0] === cat
                                ? 'bg-orange-50 text-[#FF6B35]'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))
                      }
                      {categoriesList.filter(cat => cat.toLowerCase().includes(catSearchText.toLowerCase())).length === 0 && (
                        <span className="text-[10px] text-stone-450 font-bold text-center py-2">No categories match your search</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Craft Type Custom Searchable Dropdown */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm text-left flex flex-col gap-2 relative">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">Craft Type *</label>
              
              <div className="relative">
                <button
                  type="button"
                  disabled={!selectedCats[0]}
                  onClick={() => {
                    setShowCraftDropdown(!showCraftDropdown);
                    setShowCatDropdown(false);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className={selectedCrafts[0] ? 'text-stone-900' : 'text-stone-400'}>
                    {!selectedCats[0] ? 'Select Category first' : (selectedCrafts[0] || 'Select Craft Type')}
                  </span>
                  <span className="text-stone-400 text-[10px]">▼</span>
                </button>

                {showCraftDropdown && selectedCats[0] && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1.5">
                    {/* Search Field */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg shrink-0">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      <input
                        type="text"
                        value={craftSearchText}
                        onChange={(e) => setCraftSearchText(e.target.value)}
                        placeholder="Search craft type..."
                        className="w-full text-xs bg-transparent focus:outline-none font-bold"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {/* List */}
                    <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5">
                      {(onboardingCategoryCrafts[selectedCats[0]] || ['Others'])
                        .filter(craft => craft.toLowerCase().includes(craftSearchText.toLowerCase()))
                        .map(craft => (
                          <button
                            type="button"
                            key={craft}
                            onClick={() => {
                              setSelectedCrafts([craft]);
                              setShowCraftDropdown(false);
                              setCraftSearchText('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              selectedCrafts[0] === craft
                                ? 'bg-green-50 text-green-700'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {craft}
                          </button>
                        ))
                      }
                      {(onboardingCategoryCrafts[selectedCats[0]] || ['Others']).filter(craft => craft.toLowerCase().includes(craftSearchText.toLowerCase())).length === 0 && (
                        <span className="text-[10px] text-stone-450 font-bold text-center py-2">No craft types match your search</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sourcing Preference (Ready / Made-to-order / Both) */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm text-left flex flex-col gap-2.5">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">Sourcing Preference</label>
              
              <div className="grid grid-cols-3 gap-2">
                {(['Ready', 'Made-to-Order', 'Both'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSourcingPref(opt)}
                    className={`py-3.5 rounded-xl border text-[10px] font-black transition-all ${
                      sourcingPref === opt
                        ? 'border-[#FF6B35] bg-[#FFF2EE] text-[#FF6B35]'
                        : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {opt === 'Ready' ? 'Ready Stock' : opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Average Order Size */}
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/60 shadow-sm flex items-center justify-between text-left">
              <div className="flex-grow">
                <label className="text-[8px] font-black text-text-secondary uppercase tracking-wider block">Average Order Size</label>
                <select
                  value={avgOrderSize}
                  onChange={(e) => setAvgOrderSize(e.target.value)}
                  className="w-full text-xs font-bold text-text-primary bg-transparent focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="Select range" disabled>Select range</option>
                  {orderSizeRangesList.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex gap-3 mt-8 shrink-0">
            <button
              onClick={handlePrevStep}
              className="flex-1 py-4 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-3xl transition-all"
            >
              Back
            </button>
            <button
              onClick={handleFinalSubmit}
              className="flex-1 py-4 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Continue</span>
              <span className="font-bold">✓</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
