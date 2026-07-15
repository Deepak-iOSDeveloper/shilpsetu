import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft, Camera, Shield, Users, Layers,
  MapPin, CheckCircle2, Phone, Mail, User, Plus, Minus, X, Loader2, AlertCircle
} from 'lucide-react';

// Custom Banner SVG 1: Female Weaver at Handloom
const BannerWeaverSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Frame Loom */}
    <rect x="180" y="30" width="8" height="110" rx="3" fill="#8B4F30" />
    <rect x="300" y="30" width="8" height="110" rx="3" fill="#8B4F30" />
    <line x1="175" y1="50" x2="310" y2="50" stroke="#8B4F30" strokeWidth="5" strokeLinecap="round" />
    <line x1="175" y1="120" x2="310" y2="120" stroke="#8B4F30" strokeWidth="6" strokeLinecap="round" />
    {/* Threads Grid */}
    {Array.from({ length: 18 }).map((_, i) => (
      <line 
        key={i} 
        x1={195 + i * 6} 
        y1="50" 
        x2={195 + i * 6} 
        y2="120" 
        stroke="#EAA885" 
        strokeWidth="1.5" 
        opacity="0.8" 
      />
    ))}
    {/* Gold Zari highlight thread being woven */}
    <path d="M195 85 C240 82, 270 90, 310 85" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
    <circle cx="280" cy="85" r="5" fill="#FFC72C" />

    {/* Female Weaver Figure */}
    <circle cx="120" cy="65" r="18" fill="#F3B38B" />
    {/* Traditional Hair Bun */}
    <circle cx="100" cy="62" r="8" fill="#2E2420" />
    {/* Traditional Indian Saree Draping */}
    <path d="M120 83 C95 90, 80 120, 80 140 H160 C160 115, 145 90, 120 83 Z" fill="#D36B3B" />
    <path d="M105 92 Q120 95 135 83" fill="none" stroke="#FFD700" strokeWidth="4" />
    {/* Arms outstretched to loom */}
    <path d="M135 78 C155 78, 175 83, 190 85" fill="none" stroke="#F3B38B" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M130 83 C150 85, 170 90, 185 92" fill="none" stroke="#F3B38B" strokeWidth="4" strokeLinecap="round" />
    
    {/* Ornamental Background Mandala */}
    <circle cx="340" cy="50" r="25" stroke="#FCEAD6" strokeWidth="2" strokeDasharray="3,3" />
    <circle cx="340" cy="50" r="15" stroke="#FCEAD6" strokeWidth="1.5" />
  </svg>
);

// Custom Banner SVG 2: Male Potter shaping clay pot on wheel
const BannerPotterSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Potter wheel base */}
    <ellipse cx="200" cy="125" rx="55" ry="12" fill="#7C7C7C" />
    <ellipse cx="200" cy="120" rx="55" ry="10" fill="#AEAEAE" stroke="#D2D2D2" strokeWidth="1.5" />
    
    {/* Clay Pot being shaped */}
    <path d="M185 120 C182 95, 188 80, 200 80 C212 80, 218 95, 215 120 Z" fill="#A05A2C" />
    <ellipse cx="200" cy="80" rx="10" ry="3.5" fill="#8B4513" />

    {/* Male Potter Figure */}
    {/* Traditional Turban */}
    <path d="M212 36 Q220 22 232 25 Q245 28 240 38 Z" fill="#FFFFFF" />
    <circle cx="228" cy="48" r="14" fill="#E8A070" />
    {/* Mustache */}
    <path d="M222 55 Q228 58 234 55" fill="none" stroke="#251C1A" strokeWidth="3" strokeLinecap="round" />
    {/* Shoulders */}
    <path d="M228 62 C205 68, 195 90, 195 110 H270 C270 90, 255 68, 228 62 Z" fill="#E06838" />
    {/* Arms holding the clay pot */}
    <path d="M210 75 Q195 80 188 92" fill="none" stroke="#E8A070" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M246 75 Q225 80 212 92" fill="none" stroke="#E8A070" strokeWidth="4.5" strokeLinecap="round" />

    {/* Earthen pots surrounding */}
    <circle cx="310" cy="115" r="15" fill="#CD853F" />
    <ellipse cx="310" cy="100" rx="6" ry="2" fill="#8B4513" />
    <circle cx="90" cy="118" r="18" fill="#CD853F" />
    <ellipse cx="90" cy="100" rx="7" ry="2.5" fill="#8B4513" />
  </svg>
);

// Custom Banner SVG 3: Traditional Mud Cottage Workshop with large red Maps Pin
const BannerWorkshopSVG = () => (
  <svg viewBox="0 0 400 160" className="w-full h-36 bg-[#FDF8F3] rounded-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ground */}
    <rect x="0" y="120" width="400" height="40" fill="#E8D5C4" />

    {/* Mud cottage */}
    <rect x="140" y="55" width="120" height="65" rx="4" fill="#D2B48C" stroke="#C49B74" strokeWidth="2" />
    {/* Tiled Slanted Roof */}
    <path d="M125 58 L200 20 L275 58 Z" fill="#B22222" stroke="#8B0000" strokeWidth="2" />
    {/* Wooden Door */}
    <rect x="185" y="80" width="30" height="40" fill="#8B4513" rx="2" />
    <circle cx="210" cy="100" r="2.5" fill="#FFD700" />
    {/* Windows */}
    <rect x="155" y="75" width="20" height="20" fill="#FFFFFF" stroke="#8B4513" strokeWidth="1.5" />
    <rect x="225" y="75" width="20" height="20" fill="#FFFFFF" stroke="#8B4513" strokeWidth="1.5" />

    {/* Green Trees background */}
    <circle cx="110" cy="70" r="30" fill="#2E7D32" opacity="0.85" />
    <circle cx="290" cy="70" r="25" fill="#2E7D32" opacity="0.85" />
    
    {/* Clay pots in front of the workshop */}
    <circle cx="280" cy="130" r="8" fill="#A05A2C" />
    <circle cx="292" cy="132" r="6" fill="#A05A2C" />

    {/* Large Red Geo-tag Location Pin overlay on the right */}
    <g transform="translate(325, 45)">
      {/* Pin Shadow */}
      <ellipse cx="0" cy="45" rx="8" ry="3.5" fill="black" opacity="0.15" />
      {/* Pin Shape */}
      <path d="M0 0 C-15 0 -22 15 -22 25 C-22 38 0 45 0 45 C 0 45 22 38 22 25 C22 15 15 0 0 0 Z" fill="#D32F2F" />
      <circle cx="0" cy="20" r="8" fill="#FFFFFF" />
    </g>
  </svg>
);

export const ArtisanOnboarding: React.FC = () => {
  const { registerUser, setCurrentView } = useApp();

  const [step, setStep] = useState(1);

  // ==========================================
  // STEP 1 FIELDS (Basic Information)
  // ==========================================
  const [fullName, setFullName] = useState('');
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
  // STEP 2 FIELDS (Artisan Identity)
  // ==========================================
  const [idSource, setIdSource] = useState('Select ID source');
  const [frontIdUploaded, setFrontIdUploaded] = useState(false);
  const [backIdUploaded, setBackIdUploaded] = useState(false);
  const [frontIdUrl, setFrontIdUrl] = useState<string | null>(null);
  const [backIdUrl, setBackIdUrl] = useState<string | null>(null);
  
  const idFileInputRef = React.useRef<HTMLInputElement>(null);
  const [idUploadSide, setIdUploadSide] = useState<'front' | 'back'>('front');

  const handleIdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    if (idUploadSide === 'front') {
      setFrontIdUrl(fileUrl);
      setFrontIdUploaded(true);
    } else {
      setBackIdUrl(fileUrl);
      setBackIdUploaded(true);
    }
  };
  
  // Selected industry toggle
  const [onboardingIndustry, setOnboardingIndustry] = useState<'Handloom' | 'Handicraft'>('Handloom');

  // Categories (Multi-select up to 5)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [catSearchText, setCatSearchText] = useState('');

  // Craft Types (Autocomplete search list - max 2)
  const [selectedCraftTypes, setSelectedCraftTypes] = useState<string[]>([]);
  const [showCraftDropdown, setShowCraftDropdown] = useState(false);
  const [craftSearchText, setCraftSearchText] = useState('');

  const [modernCollab, setModernCollab] = useState(false); // Toggle Designer Collaboration

  // ==========================================
  // STEP 3 FIELDS (Business Details)
  // ==========================================
  const [locationVerified, setLocationVerified] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<string | null>(null);
  const [verifiedLat, setVerifiedLat] = useState<number | null>(null);
  const [verifiedLng, setVerifiedLng] = useState<number | null>(null);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState('Individual Artisan');
  const [teamSize, setTeamSize] = useState(1);
  const [monthlyProduction, setMonthlyProduction] = useState('100');
  const [productionUnit, setProductionUnit] = useState('pcs'); // pcs, meters, kg, sets

  // Structured Handloom Categories & Technique mappings
  const artisanHandloomCategories: Record<string, string[]> = {
    'Sarees': [
      'Banarasi Saree', 'Chanderi Saree', 'Maheshwari Saree', 'Paithani Saree', 'Kanjeevaram Saree', 
      'Patola Saree', 'Sambalpuri Saree', 'Pochampally Ikat Saree', 'Jamdani Saree', 'Tangaliya Saree', 
      'Kota Doria Saree', 'Bhagalpur Silk Saree', 'Baluchari Saree', 'Bomkai Saree', 'Uppada Saree', 
      'Venkatagiri Saree', 'Narayanpet Saree', 'Ilkal Saree', 'Mangalagiri Saree', 'Chettinad Saree', 
      'Tussar Silk Saree', 'Muga Silk Saree', 'Eri Silk Saree', 'Khadi Saree', 'Linen Saree', 'Cotton Saree'
    ],
    'Dupattas & Stoles': [
      'Cotton Dupatta', 'Silk Dupatta', 'Chanderi Dupatta', 'Banarasi Dupatta', 'Tangaliya Dupatta', 
      'Ikat Dupatta', 'Ajrakh Dupatta', 'Kalamkari Dupatta', 'Bandhani Dupatta', 'Jamdani Dupatta', 
      'Maheshwari Dupatta', 'Khadi Dupatta', 'Cotton Stole', 'Silk Stole', 'Linen Stole', 'Wool Stole', 
      'Pashmina Stole'
    ],
    'Shawls': [
      'Pashmina Shawl', 'Kani Shawl', 'Jamawar Shawl', 'Kullu Shawl', 'Bhujodi Shawl', 
      'Eri Silk Shawl', 'Muga Silk Shawl', 'Wool Shawl', 'Cotton Shawl', 'Linen Shawl'
    ],
    'Dress Materials & Fabrics': [
      'Unstitched Dress Material', 'Suit Sets', 'Kurta Sets', 'Fabric Rolls', 'Fabric Bundles', 
      'Cotton Dress Material', 'Silk Dress Material', 'Linen Dress Material', 'Khadi Dress Material', 
      'Tangaliya Fabric', 'Banarasi Fabric', 'Chanderi Fabric', 'Maheshwari Fabric', 'Ikat Fabric', 
      'Ajrakh Fabric', 'Kalamkari Fabric'
    ],
    'Kurta Fabrics': [
      'Cotton Kurta Fabric', 'Khadi Kurta Fabric', 'Linen Kurta Fabric', 'Silk Kurta Fabric', 
      'Ikat Kurta Fabric', 'Tangaliya Kurta Fabric', 'Chanderi Kurta Fabric', 'Handwoven Kurta Fabric'
    ],
    'Blouse Fabrics': [
      'Banarasi Blouse Fabric', 'Chanderi Blouse Fabric', 'Maheshwari Blouse Fabric', 'Silk Blouse Fabric', 
      'Cotton Blouse Fabric', 'Ikat Blouse Fabric', 'Brocade Blouse Fabric', 'Embroidered Blouse Fabric'
    ],
    'Dhotis': [
      'Cotton Dhoti', 'Silk Dhoti', 'Khadi Dhoti', 'Temple Dhoti', 'Border Dhoti', 'Traditional Dhoti'
    ],
    'Mundus & Lungis': [
      'Kerala Mundu', 'Kasavu Mundu', 'Cotton Lungi', 'Checked Lungi', 'Handwoven Lungi', 'Traditional Mundu'
    ],
    'Gamchha': [
      'Cotton Gamchha', 'Handwoven Gamchha', 'Checked Gamchha', 'Traditional Gamchha', 'Printed Gamchha'
    ],
    'Bedcovers & Bedsheets': [
      'Single Bedsheet', 'Double Bedsheet', 'Bedcover', 'Quilt Cover', 'Dohar', 
      'Handloom Bedsheet', 'Printed Bedsheet', 'Embroidered Bedcover'
    ],
    'Pillow Covers & Cushions': [
      'Pillow Covers', 'Cushion Covers', 'Decorative Cushions', 'Floor Cushions', 'Bolster Covers'
    ],
    'Curtains & Drapes': [
      'Door Curtains', 'Window Curtains', 'Sheer Curtains', 'Blackout Curtains', 'Printed Curtains', 'Handwoven Drapes'
    ],
    'Floor Coverings': [
      'Durries', 'Rugs', 'Carpets', 'Floor Mats', 'Prayer Mats', 'Cotton Rugs', 'Jute Rugs', 'Wool Rugs'
    ],
    'Kitchen & Dining Linen': [
      'Tablecloths', 'Table Runners', 'Placemats', 'Cloth Napkins', 'Tea Towels', 'Kitchen Towels', 
      'Aprons', 'Oven Mitts', 'Pot Holders', 'Coasters'
    ],
    'Home Furnishing': [
      'Sofa Covers', 'Cushion Covers', 'Pillow Covers', 'Curtains', 'Bedcovers', 'Bedsheets', 
      'Throws', 'Quilts', 'Table Linen', 'Decorative Textiles'
    ],
    'Fabrics': [
      'Cotton Fabric', 'Silk Fabric', 'Linen Fabric', 'Khadi Fabric', 'Wool Fabric', 'Organic Cotton Fabric', 
      'Handwoven Fabric', 'Ikat Fabric', 'Tangaliya Fabric', 'Banarasi Fabric', 'Chanderi Fabric', 
      'Maheshwari Fabric', 'Kalamkari Fabric', 'Ajrakh Fabric', 'Muslin Fabric'
    ],
    'Accessories': [
      'Potli Bags', 'Tote Bags', 'Fabric Pouches', 'Wallets', 'Belts', 'Scarves', 'Stoles', 
      'Headbands', 'Hair Bands', 'Hair Accessories', 'Phone Sleeves', 'Laptop Sleeves', 'Passport Covers', 'Coin Pouches'
    ]
  };

  // Structured Handicraft Categories & Technique mappings
  const artisanHandicraftCategories: Record<string, string[]> = {
    'Wood Craft': [
      'Wooden Furniture', 'Coffee Tables', 'Side Tables', 'Stools', 'Chairs', 'Shelves', 
      'Cabinets', 'Wall Panels', 'Wall Screens', 'Wall Art', 'Mirror Frames', 'Photo Frames', 
      'Jewellery Boxes', 'Storage Boxes', 'Serving Trays', 'Bowls', 'Coasters', 'Candle Holders', 
      'Key Holders', 'Tissue Boxes', 'Pen Stands', 'Wooden Toys', 'Sculptures & Figurines', 
      'Kitchen Accessories', 'Decorative Masks'
    ],
    'Pottery & Ceramics': [
      'Planters', 'Flower Pots', 'Vases', 'Bowls', 'Plates', 'Cups & Mugs', 'Tea Sets', 
      'Dinner Sets', 'Platters', 'Storage Jars', 'Water Pots', 'Diyas', 'Candle Holders', 
      'Incense Holders', 'Wall Plates', 'Decorative Tiles', 'Sculptures', 'Table Decor'
    ],
    'Metal Craft': [
      'Brass Vases', 'Copper Bottles', 'Copper Tumblers', 'Brass Bowls', 'Trays', 
      'Candle Holders', 'Diyas', 'Lamps', 'Bells', 'Urli Bowls', 'Dhokra Figurines', 
      'Bidriware Boxes', 'Decorative Plates', 'Wall Decor', 'Pooja Items', 'Cutlery', 'Sculptures'
    ],
    'Cane & Bamboo': [
      'Chairs', 'Tables', 'Stools', 'Storage Baskets', 'Laundry Baskets', 'Fruit Baskets', 
      'Trays', 'Mats', 'Rugs', 'Window Blinds', 'Tote Bags', 'Plant Holders', 'Lampshades', 
      'Wall Decor', 'Shelves'
    ],
    'Jute Products': [
      'Tote Bags', 'Shopping Bags', 'Laptop Bags', 'Storage Baskets', 'Rugs', 'Door Mats', 
      'Planters', 'Table Mats', 'Table Runners', 'Gift Bags', 'Coasters', 'Wall Hangings'
    ],
    'Macramé & Rope': [
      'Wall Hangings', 'Plant Hangers', 'Mirrors', 'Shelves', 'Cushion Covers', 'Curtains', 
      'Bags', 'Coasters', 'Keychains', 'Table Decor', 'Dream Catchers'
    ],
    'Stone Craft': [
      'Marble Inlay', 'Coasters', 'Sculptures', 'Figurines', 'Candle Holders', 'Pen Holders', 
      'Decorative Plates', 'Lamps', 'Planters', 'Mortar & Pestle', 'Soap Dispensers'
    ],
    'Leather Craft': [
      'Wallets', 'Belts', 'Handbags', 'Sling Bags', 'Laptop Bags', 'Backpacks', 'Travel Bags', 
      'Journals', 'Diaries', 'Passport Covers', 'Card Holders', 'Keychains', 'Juttis', 'Mojaris'
    ],
    'Jewellery': [
      'Earrings', 'Necklaces', 'Pendants', 'Bangles', 'Bracelets', 'Rings', 'Anklets', 
      'Nose Pins', 'Brooches', 'Hair Accessories', 'Jewellery Sets', 'Beaded Jewellery'
    ],
    'Paintings & Wall Art': [
      'Madhubani Paintings', 'Warli Paintings', 'Gond Paintings', 'Pattachitra', 'Kalamkari Art', 
      'Pichwai Paintings', 'Phad Paintings', 'Miniature Paintings', 'Lippan Art', 'Canvas Paintings', 
      'Wall Frames', 'Murals'
    ],
    'Toys & Dolls': [
      'Wooden Toys', 'Channapatna Toys', 'Kondapalli Toys', 'Cloth Dolls', 'Puppets', 
      'Soft Toys', 'Educational Toys', 'Decorative Dolls', 'Pull-Along Toys'
    ],
    'Handmade Paper': [
      'Journals', 'Diaries', 'Notebooks', 'Greeting Cards', 'Gift Boxes', 'Gift Bags', 
      'Photo Albums', 'Stationery', 'Calendars', 'Bookmarks'
    ],
    'Home Decor': [
      'Wall Decor', 'Mirrors', 'Clocks', 'Vases', 'Planters', 'Decorative Bowls', 
      'Decorative Trays', 'Sculptures', 'Candle Holders', 'Lanterns', 'Cushion Covers', 
      'Table Decor', 'Incense Holders'
    ],
    'Religious & Spiritual': [
      'Diyas', 'Pooja Thali', 'Idols', 'Temple Decor', 'Incense Holders', 'Bells', 
      'Sacred Lamps', 'Prayer Accessories', 'Wall Hangings', 'Spiritual Gifts'
    ],
    'Gift & Lifestyle': [
      'Corporate Gifts', 'Wedding Gifts', 'Festive Gifts', 'Souvenirs', 'Gift Hampers', 
      'Gift Boxes', 'Return Gifts', 'Personalized Gifts', 'Eco-Friendly Gifts'
    ],
    'Embroidery & Textile Craft': [
      'Cushion Covers', 'Pillow Covers', 'Quilts', 'Wall Hangings', 'Table Runners', 
      'Bed Covers', 'Textile Panels', 'Embroidered Bags', 'Decorative Fabrics', 'Patchwork Items'
    ],
    'Glass Craft': [
      'Glass Vases', 'Decorative Bottles', 'Mosaic Art', 'Stained Glass', 'Mirrors', 
      'Lamps', 'Candle Holders', 'Bowls', 'Wall Art'
    ],
    'Shell Craft': [
      'Wind Chimes', 'Mirrors', 'Wall Decor', 'Jewellery', 'Decorative Frames', 'Lamps', 
      'Coasters', 'Decorative Bowls', 'Keychains'
    ],
    'Palm Leaf Craft': [
      'Baskets', 'Mats', 'Fans', 'Storage Boxes', 'Hats', 'Decorative Items', 'Trays', 
      'Wall Hangings', 'Gift Boxes'
    ],
    'Furniture & Utility': [
      'Coffee Tables', 'Dining Tables', 'Side Tables', 'Chairs', 'Benches', 'Stools', 
      'Cabinets', 'Shelves', 'TV Units', 'Console Tables', 'Bookshelves', 'Shoe Racks', 
      'Storage Units', 'Folding Furniture', 'Utility Trolleys'
    ]
  };

  const categoriesList = onboardingIndustry === 'Handloom' 
    ? Object.keys(artisanHandloomCategories) 
    : Object.keys(artisanHandicraftCategories);

  const idSourcesList = [
    'Artisan Card', 'Aadhaar Card', 'Udyam Registration', 'Handicraft Card', 'Handloom ID', 'GI Registered Artisan'
  ];

  const businessTypesList = [
    'Individual Artisan', 'Family Business', 'Self Help Group (SHG)', 'Artisan Cluster', 
    'Cooperative Society', 'Proprietorship', 'Partnership Firm', 'Private Limited Company', 'NGO / Trust'
  ];



  const handleGetOtp = () => {
    if (!phone.trim() || phoneError) {
      alert("Please enter a valid 10-digit mobile number first.");
      return;
    }
    setOtpSent(true);
    alert(`Mock OTP sent successfully to ${phone}! (Use code: 1234)`);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        alert("Please enter your full name.");
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
      if (idSource === 'Select ID source') {
        alert("Please select your ID source documentation.");
        return;
      }
      if (!frontIdUploaded || !backIdUploaded) {
        alert(`Please upload both Front and Back images of your selected ${idSource} to proceed.`);
        return;
      }
      if (selectedCategories.length === 0) {
        alert("Please select at least one product category.");
        return;
      }
      if (selectedCraftTypes.length === 0) {
        alert("Please select at least one craft technique.");
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

  const handleVerifyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser. Please enable location access or try a different browser.");
      return;
    }

    setLocationError(null);
    setIsVerifyingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const latStr = latitude >= 0 ? `${latitude.toFixed(4)}° N` : `${Math.abs(latitude).toFixed(4)}° S`;
        const lngStr = longitude >= 0 ? `${longitude.toFixed(4)}° E` : `${Math.abs(longitude).toFixed(4)}° W`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (!res.ok) throw new Error("Reverse geocoding request failed");
          const data = await res.json();
          const addr = data.address || {};
          const locality = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
          const state = addr.state || '';
          const resolvedAddress = data.display_name || [locality, state].filter(Boolean).join(', ') || 'Location verified';

          setVerifiedLat(latitude);
          setVerifiedLng(longitude);
          setVerifiedAddress([locality, state].filter(Boolean).join(', ') || resolvedAddress);
          setGpsCoordinates(`${latStr}, ${lngStr}`);
          setLocationVerified(true);
        } catch (err) {
          // GPS succeeded but reverse geocoding failed — still accept the real
          // coordinates, just without a resolved address label.
          setVerifiedLat(latitude);
          setVerifiedLng(longitude);
          setVerifiedAddress(null);
          setGpsCoordinates(`${latStr}, ${lngStr}`);
          setLocationVerified(true);
        } finally {
          setIsVerifyingLocation(false);
        }
      },
      (error) => {
        setIsVerifyingLocation(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location access denied. Please allow location permission in your browser settings and try again."
            : "Could not detect your location. Please check your device's location settings and try again."
        );
      }
    );
  };

  const handleFinalOnboardingSubmit = () => {
    if (!locationVerified || verifiedLat === null || verifiedLng === null) {
      alert("Please verify your physical location to complete onboarding.");
      return;
    }

    const finalArtisanData = {
      uid: 'artisan-' + Date.now(),
      name: fullName,
      phone: phone,
      email: email || undefined,
      idType: idSource,
      idStatus: 'verified' as const,
      craftCategories: selectedCategories,
      craftTypes: selectedCraftTypes,
      businessType,
      teamSize,
      monthlyProduction: parseInt(monthlyProduction) || 100,
      monthlyProductionUnit: productionUnit,
      location: { lat: verifiedLat, lng: verifiedLng, address: verifiedAddress || `${gpsCoordinates}` }
    };

    // Register user inside global AppState
    registerUser(finalArtisanData);
    alert(`Welcome to Shilp Setu, ${fullName}! Your artisan profile is verified.`);
    setCurrentView('dashboard');
  };



  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FFFBF7] min-h-dvh">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevStep}
          className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-stone-850" />
        </button>
        
        {/* Step indicator horizontal dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                step === num 
                  ? 'bg-[#FF6B35] text-white border-[#FF6B35]' 
                  : 'bg-white text-stone-400 border-stone-200'
              }`}>
                {num}
              </span>
              {num !== 3 && <div className="w-6 border-t border-stone-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* STEP 1: Let's get started (Basic info) */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <BannerWeaverSVG />
            
            <div className="text-left mt-2">
              <h2 className="text-2xl font-bold font-heading text-stone-850 leading-tight">Let's get started</h2>
              <span className="text-[10px] text-text-secondary font-bold block mt-1 uppercase tracking-wider">
                Enter your basic contact credentials
              </span>
            </div>

            {/* Inputs Form */}
            <div className="flex flex-col gap-4">
              
              {/* Full Name */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center gap-3">
                <User className="w-5 h-5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
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
                      placeholder="Mobile Number"
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
                    placeholder="Email (optional *)"
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
          <button
            onClick={handleNextStep}
            className="w-full py-4 mt-8 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all active:scale-98"
          >
            <span>Next</span>
            <span className="font-bold">→</span>
          </button>
        </div>
      )}
      {/* ============================================================== */}
      {/* STEP 2: Artisan Identity & Crafts */}
      {/* ============================================================== */}
      {step === 2 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-5 overflow-y-auto no-scrollbar max-h-[82vh] pb-6">
            
            {/* Header Title Block */}
            <div className="text-left mt-1">
              <h2 className="text-2xl font-black font-heading text-stone-850 leading-tight">Artisan Identity</h2>
              <span className="text-[10px] text-text-secondary font-extrabold block mt-1.5 uppercase tracking-wider">
                SELECT YOUR ID DOCUMENTATION AND CRAFT TECHNIQUE SPECIALIZATION
              </span>
            </div>

            {/* Card 1: ID Documentation Upload */}
            <div className="bg-white rounded-3xl p-4 border border-primary/5 shadow-premium flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">Select ID Source</label>
                <select
                  value={idSource}
                  onChange={(e) => {
                    setIdSource(e.target.value);
                    setFrontIdUploaded(false);
                    setBackIdUploaded(false);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 font-bold text-text-primary text-xs focus:outline-none"
                >
                  <option value="Select ID source" disabled>Select ID Source</option>
                  {idSourcesList.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Front and Back Upload blocks (shown only when ID is selected) */}
              {idSource !== 'Select ID source' && (
                <div className="flex flex-col gap-2 border-t border-stone-100 pt-3 animate-fadeIn">
                  <label className="text-[9px] font-black text-[#FF6B35] uppercase tracking-wider block">Upload ID Document (Required)</label>
                  
                  {/* Hidden ID input trigger */}
                  <input
                    type="file"
                    ref={idFileInputRef}
                    onChange={handleIdFileUpload}
                    className="hidden"
                    accept="image/*"
                  />

                  <div className="grid grid-cols-2 gap-3.5 mt-1">
                    
                    {/* Front upload */}
                    {frontIdUploaded ? (
                      <div className="border border-green-200 bg-green-50/10 rounded-2xl overflow-hidden p-1.5 flex flex-col items-center justify-center text-center gap-1 h-24 relative group">
                        {frontIdUrl ? (
                          <img src={frontIdUrl} className="w-full h-full object-cover rounded-xl" alt="Front ID" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600 animate-fadeIn" />
                        )}
                        <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <span className="text-[8px] text-white font-extrabold uppercase">Front Uploaded</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setFrontIdUploaded(false);
                              setFrontIdUrl(null);
                            }} 
                            className="text-[8px] text-white font-bold bg-red-600 px-2 py-0.8 rounded hover:bg-red-700 shadow"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIdUploadSide('front');
                          setTimeout(() => idFileInputRef.current?.click(), 50);
                        }}
                        className="border border-dashed border-stone-300 bg-stone-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-stone-100/50 h-24 transition-all"
                      >
                        <Camera className="w-5 h-5 text-stone-400" />
                        <span className="text-[9.5px] font-black text-stone-600">Front Side</span>
                      </button>
                    )}

                    {/* Back upload */}
                    {backIdUploaded ? (
                      <div className="border border-green-200 bg-green-50/10 rounded-2xl overflow-hidden p-1.5 flex flex-col items-center justify-center text-center gap-1 h-24 relative group">
                        {backIdUrl ? (
                          <img src={backIdUrl} className="w-full h-full object-cover rounded-xl" alt="Back ID" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600 animate-fadeIn" />
                        )}
                        <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <span className="text-[8px] text-white font-extrabold uppercase">Back Uploaded</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setBackIdUploaded(false);
                              setBackIdUrl(null);
                            }} 
                            className="text-[8px] text-white font-bold bg-red-600 px-2 py-0.8 rounded hover:bg-red-700 shadow"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIdUploadSide('back');
                          setTimeout(() => idFileInputRef.current?.click(), 50);
                        }}
                        className="border border-dashed border-stone-300 bg-stone-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 hover:bg-stone-100/50 h-24 transition-all"
                      >
                        <Camera className="w-5 h-5 text-stone-400" />
                        <span className="text-[9.5px] font-black text-stone-600">Back Side</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Product Details - Select Industry */}
            <div className="bg-white rounded-3xl p-4 border border-primary/5 shadow-premium flex flex-col gap-3 text-left">
              <div>
                <h4 className="text-xs font-black text-stone-850 font-heading">Product Details</h4>
                <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block mt-2">Select Industry</label>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Handloom Selection Card */}
                <div
                  onClick={() => {
                    setOnboardingIndustry('Handloom');
                    setSelectedCategories([]);
                    setSelectedCraftTypes([]);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 relative ${
                    onboardingIndustry === 'Handloom'
                      ? 'border-primary bg-primary-light/20'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    onboardingIndustry === 'Handloom' ? 'bg-primary text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2.5">
                      <path d="M12 22V10M4 6V2h16v4M4 14V6h16v8M8 6v16M16 6v16" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-[11px] font-black text-stone-850 block">Handloom</span>
                  </div>
                  {onboardingIndustry === 'Handloom' && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center text-[7.5px] font-black shadow-sm">
                      ✓
                    </div>
                  )}
                </div>

                {/* Handicraft Selection Card */}
                <div
                  onClick={() => {
                    setOnboardingIndustry('Handicraft');
                    setSelectedCategories([]);
                    setSelectedCraftTypes([]);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 relative ${
                    onboardingIndustry === 'Handicraft'
                      ? 'border-primary bg-primary-light/20'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    onboardingIndustry === 'Handicraft' ? 'bg-primary text-white' : 'bg-stone-200 text-stone-500'
                  }`}>
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="2.5">
                      <path d="M6 3h12M8 3v4c0 1.5 1 2 2 3.5v7.5a3 3 0 0 1-6 0V11M14 10.5c1-1.5 2-2 2-3.5V3M10 18h4M8 21h8" />
                    </svg>
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-[11px] font-black text-stone-850 block">Handicraft</span>
                  </div>
                  {onboardingIndustry === 'Handicraft' && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center text-[7.5px] font-black shadow-sm">
                      ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Product Category Custom Searchable Dropdown */}
            <div className="bg-white rounded-3xl p-4 border border-primary/5 shadow-premium text-left flex flex-col gap-2 relative">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest block leading-tight">Product Category *</label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowCatDropdown(!showCatDropdown);
                    setShowCraftDropdown(false);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className={selectedCategories[0] ? 'text-stone-900' : 'text-stone-400'}>
                    {selectedCategories[0] || 'Select Category'}
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
                    <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5 animate-fadeIn">
                      {categoriesList
                        .filter(cat => cat.toLowerCase().includes(catSearchText.toLowerCase()))
                        .map(cat => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => {
                              setSelectedCategories([cat]);
                              setSelectedCraftTypes([]);
                              setShowCatDropdown(false);
                              setCatSearchText('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              selectedCategories[0] === cat
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
            <div className="bg-white rounded-3xl p-4 border border-primary/5 shadow-premium text-left flex flex-col gap-2 relative">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-widest block leading-tight">Craft Type *</label>
              
              <div className="relative">
                <button
                  type="button"
                  disabled={!selectedCategories[0]}
                  onClick={() => {
                    setShowCraftDropdown(!showCraftDropdown);
                    setShowCatDropdown(false);
                  }}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-3 text-xs font-bold text-stone-850 text-left flex justify-between items-center focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className={selectedCraftTypes[0] ? 'text-stone-900' : 'text-stone-400'}>
                    {!selectedCategories[0] ? 'Select Category first' : (selectedCraftTypes[0] || 'Select Craft Type')}
                  </span>
                  <span className="text-stone-400 text-[10px]">▼</span>
                </button>

                {showCraftDropdown && selectedCategories[0] && (
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
                    <div className="overflow-y-auto max-h-40 flex flex-col gap-0.5 animate-fadeIn">
                      {((onboardingIndustry === 'Handloom' ? artisanHandloomCategories : artisanHandicraftCategories)[selectedCategories[0]] || ['Others'])
                        .filter(craft => craft.toLowerCase().includes(craftSearchText.toLowerCase()))
                        .map(craft => (
                          <button
                            type="button"
                            key={craft}
                            onClick={() => {
                              setSelectedCraftTypes([craft]);
                              setShowCraftDropdown(false);
                              setCraftSearchText('');
                            }}
                            className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors font-bold ${
                              selectedCraftTypes[0] === craft
                                ? 'bg-green-50 text-green-700'
                                : 'text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {craft}
                          </button>
                        ))
                      }
                      {((onboardingIndustry === 'Handloom' ? artisanHandloomCategories : artisanHandicraftCategories)[selectedCategories[0]] || ['Others']).filter(craft => craft.toLowerCase().includes(craftSearchText.toLowerCase())).length === 0 && (
                        <span className="text-[10px] text-stone-450 font-bold text-center py-2">No craft types match your search</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contemporary / Designer Collaboration Toggle */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex items-center justify-between text-left">
              <div>
                <span className="text-xs font-black text-stone-850 block">Contemporary Design / Collaborations</span>
                <span className="text-[9px] text-text-secondary block mt-0.5">Check if you practice Modern Fusion Crafts or Designer Collaborations</span>
              </div>
              <button
                type="button"
                onClick={() => setModernCollab(!modernCollab)}
                className={`w-11 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                  modernCollab ? 'bg-primary' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-5.5 h-5.5 rounded-full shadow transform transition-transform duration-200 ${
                    modernCollab ? 'translate-x-4.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Action Footer */}
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-4 mt-4 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all active:scale-98"
          >
            <span>Next</span>
            <span className="font-bold">→</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: Business Details */}
      {/* ============================================================== */}
      {step === 3 && (
        <div className="flex-grow flex flex-col justify-between">
          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[75vh]">
            <BannerWorkshopSVG />

            <div className="text-left mt-1">
              <h2 className="text-xl font-bold font-heading text-stone-850 leading-tight">Business Details</h2>
              <span className="text-[9px] text-text-secondary font-bold block mt-0.5 uppercase tracking-wider">
                Verify your physical location and log production values
              </span>
            </div>

            {/* Geotagged Location Verification Box */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-sm text-center">
              <span className="text-[9px] font-black text-text-secondary uppercase tracking-wider block mb-3 text-left">Location Verification</span>
              
              {locationVerified ? (
                <div className="relative w-full p-4 rounded-2xl border border-green-200 bg-green-50/10 flex flex-col items-center justify-center gap-2.5 animate-fadeIn">
                  <MapPin className="w-7 h-7 text-green-600 animate-bounce" />
                  <div className="text-center">
                    <span className="text-xs font-black text-green-800 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span>Location Verified ✓</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-extrabold block mt-1.5">
                      GPS: {gpsCoordinates}
                    </span>
                    {verifiedAddress && (
                      <span className="text-[9px] text-stone-400 font-bold block mt-0.5 max-w-[260px]">
                        {verifiedAddress}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationVerified(false);
                      setGpsCoordinates(null);
                      setVerifiedLat(null);
                      setVerifiedLng(null);
                      setVerifiedAddress(null);
                    }}
                    className="text-[9px] text-stone-500 font-extrabold hover:underline"
                  >
                    Reset & Re-verify
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isVerifyingLocation}
                  onClick={handleVerifyLocation}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 flex flex-col items-center justify-center gap-2 group transition-all disabled:opacity-70"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    {isVerifyingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-850 block">
                      {isVerifyingLocation ? 'Detecting your location...' : 'Tap to Verify Location'}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Required for geo-location verification</span>
                  </div>
                </button>
              )}

              {locationError && (
                <div className="mt-3 flex items-start gap-1.5 text-left bg-red-50 border border-red-200 rounded-xl p-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-bold text-red-600">{locationError}</span>
                </div>
              )}

              {!locationVerified && !locationError && (
                <div className="flex items-center justify-center gap-1.5 mt-3 text-green-600 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>GPS Verification Available</span>
                </div>
              )}
            </div>

            {/* Business Type dropdown */}
            <div className="bg-white rounded-2xl p-3 border border-stone-200/60 shadow-sm flex flex-col gap-2 text-left">
              <label className="text-[9px] font-black text-text-secondary uppercase tracking-wider block">Business Type</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-3.5 font-bold text-text-primary text-xs focus:outline-none"
              >
                {businessTypesList.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Team Size stepper */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex justify-between items-center text-left">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-stone-400" />
                <span className="text-xs font-black text-stone-850">Team size</span>
              </div>

              <div className="flex items-center gap-3.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
                <button 
                  onClick={() => setTeamSize(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-stone-600 border border-stone-200 shadow-sm active:scale-90"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                
                <span className="text-sm font-black text-stone-800 w-4 text-center">{teamSize}</span>
                
                <button 
                  onClick={() => setTeamSize(prev => prev + 1)}
                  className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-stone-600 border border-stone-200 shadow-sm active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Monthly Production */}
            <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-sm flex justify-between items-center text-left">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-stone-400" />
                <span className="text-xs font-black text-stone-850">Monthly production</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={monthlyProduction}
                  onChange={(e) => setMonthlyProduction(e.target.value)}
                  className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-center text-xs font-black text-stone-800 focus:outline-none"
                  min={1}
                />
                
                <select
                  value={productionUnit}
                  onChange={(e) => setProductionUnit(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-xs font-black text-primary focus:outline-none"
                >
                  <option value="pcs">pcs</option>
                  <option value="meters">meters</option>
                  <option value="kg">kg</option>
                  <option value="sets">sets</option>
                </select>
              </div>
            </div>

          </div>

          {/* Submit Action */}
          <button
            onClick={handleFinalOnboardingSubmit}
            className="w-full py-4 mt-8 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 transition-all active:scale-98"
          >
            <span>Submit Onboarding</span>
            <span className="font-bold">✓</span>
          </button>
        </div>
      )}

    </div>
  );
};
