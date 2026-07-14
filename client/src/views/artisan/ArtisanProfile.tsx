import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Bell, User, MapPin, ShieldCheck, 
  Store, CreditCard, Image, Star, Edit3, ChevronRight,
  X, Check, Info, Award, HelpCircle, Layers, Globe
} from 'lucide-react';

// Custom Handloom Weaver graphic SVG inline illustration matching the mockup background
const HandloomWeaverGraphics = () => (
  <svg viewBox="0 0 200 120" className="w-40 h-24 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="20" x2="50" y2="100" stroke="#8A4A28" strokeWidth="3" />
    <line x1="150" y1="20" x2="150" y2="100" stroke="#8A4A28" strokeWidth="3" />
    <line x1="45" y1="40" x2="155" y2="40" stroke="#8A4A28" strokeWidth="3" />
    <line x1="45" y1="80" x2="155" y2="80" stroke="#8A4A28" strokeWidth="4" />
    {Array.from({ length: 15 }).map((_, i) => (
      <line 
        key={i} 
        x1={60 + i * 6} 
        y1="40" 
        x2={60 + i * 6} 
        y2="80" 
        stroke="#EAA380" 
        strokeWidth="1" 
        opacity="0.85" 
      />
    ))}
    <circle cx="140" cy="72" r="10" fill="#9E5B38" />
    <path d="M140 82 Q125 90 120 100 Q145 105 148 100 Z" fill="#9E5B38" />
    <path d="M128 85 Q115 88 105 85" fill="none" stroke="#9E5B38" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const ArtisanProfile: React.FC = () => {
  const { setCurrentView, logout, currentUser, registerUser } = useApp();

  // Active edit section state
  const [activeSection, setActiveSection] = useState<'basic' | 'craft' | 'location' | 'verification' | 'business' | 'payment' | 'portfolio' | null>(null);

  // Profile Avatar Uploader States
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('artisanLogo') || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatar(result);
          localStorage.setItem('artisanLogo', result);
          alert("Profile photo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. Basic Information States
  const [fullName, setFullName] = useState(currentUser?.name || 'Ramesh Kumar');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('15 Aug 1985');
  const [mobile, setMobile] = useState(currentUser?.phone || '+91 9876543210');
  const [email, setEmail] = useState(currentUser?.email || 'ramesh.kumar@shilpsetu.in');
  const [language, setLanguage] = useState('Hindi & Bhojpuri');
  const [education, setEducation] = useState('Graduate');
  const [experience, setExperience] = useState('18 Years');
  const [aadhaarMasked, setAadhaarMasked] = useState('XXXX-XXXX-9012');
  const [gstin, setGstin] = useState('09AAAAA1111A1Z1');

  // 2. Craft Information States
  const [craftCategory, setCraftCategory] = useState('Textiles');
  const [craftSpecialization, setCraftSpecialization] = useState('Banarasi Saree Weaving');
  const [productCategories, setProductCategories] = useState('Kadwa & Cutwork Sarees, Dupattas');
  const [materials, setMaterials] = useState('Pure Katan Silk & Gold Zari Threads');
  const [technique, setTechnique] = useState('Handloom Weaving');
  const [cluster, setCluster] = useState('Madanpura Cluster');
  const [giTag, setGiTag] = useState('Varanasi Banarasi Saree (GI-No. 12)');
  const [capacity, setCapacity] = useState('15 Sarees/month');
  const [moq, setMoq] = useState('5 Sarees');
  const [leadTime, setLeadTime] = useState('30 Days');
  const [customization, setCustomization] = useState('Yes');
  const [handmadeType, setHandmadeType] = useState('Handmade');
  const [awards, setAwards] = useState('State National Handloom Award (2021)');

  // 3. Location States
  const [workshopName, setWorkshopName] = useState('Ramesh Handloom Works');
  const [village, setVillage] = useState('Madanpura');
  const [district, setDistrict] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [pinCode, setPinCode] = useState('221001');
  const [fullAddress, setFullAddress] = useState('B-12/48 Madanpura, Varanasi, UP');
  const [gmaps, setGmaps] = useState('https://maps.google.com/?q=25.3176,82.9739');
  const [geoVerified, setGeoVerified] = useState('YES (Geotag Active)');
  const [nearestCityDist, setNearestCityDist] = useState('2 km from Varanasi Cantonment');
  const [pickupAvail, setPickupAvail] = useState('YES');
  const [pickupCompany, setPickupCompany] = useState('Delhivery Logistics Hub Varanasi');

  // 4. Verification States
  const [vAadhaar, setVAadhaar] = useState(true);
  const [vMobile, setVMobile] = useState(true);
  const [vEmail, setVEmail] = useState(true);
  const [vFace, setVFace] = useState(true);
  const [vWorkshop, setVWorkshop] = useState(true);
  const [vGeo, setVGeo] = useState(true);
  const [vDocumentType, setVDocumentType] = useState('UDYAM Registration'); // Options: GST, MSME, UDYAM, Artisan ID

  // 5. Business Details States
  const [bizName, setBizName] = useState('Ramesh Handloom Works');
  const [bizType, setBizType] = useState('Proprietorship'); // Options: Proprietorship, Partnership, SELF HELP GROUP, NGO
  const [msmeRegNo, setMsmeRegNo] = useState('UDYAM-UP-62-0012345');
  const [bizGst, setBizGst] = useState('09AAAAA1111A1Z1');
  const [bizPan, setBizPan] = useState('ABCDE1234F');
  const [yearEst, setYearEst] = useState('2008');
  const [employees, setEmployees] = useState('8');
  const [artisansCount, setArtisansCount] = useState('5');
  const [bizExport, setBizExport] = useState('Yes (UK & USA boutique partners)');
  const [bizBuyers, setBizBuyers] = useState('Fabindia, Taneira, Aachho, Kalki Fashion');

  // 6. Payment Details States
  const [preferredPayment, setPreferredPayment] = useState('Bank'); // Options: Bank, UPI
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountHolder, setAccountHolder] = useState('Ramesh Kumar');
  const [accountNumber, setAccountNumber] = useState('12345678901');
  const [ifscCode, setIfscCode] = useState('SBIN0000201');
  const [upiId, setUpiId] = useState('ramesh@okaxis');

  // 7. Portfolio States
  const [portfolioProducts, setPortfolioProducts] = useState('12 Active Saree Listings');
  const [brandCollabs, setBrandCollabs] = useState('Fabindia (2023 Collection), Taneira (Tata Craft)');
  const [certificates, setCertificates] = useState('Handloom Mark, Silk Mark, Craft Council India Cert');
  const [socialMedia, setSocialMedia] = useState('instagram.com/ramesh_banarasi_weaves');
  const [websiteUrl, setWebsiteUrl] = useState('rameshweaves.shilpsetu.in');

  // Help & Support States
  const [complaintCategory, setComplaintCategory] = useState('Payment Issue');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [tickets, setTickets] = useState<any[]>([
    {
      id: 'TKT-9081',
      category: 'Delivery Delay',
      title: 'Yarn delivery from Varanasi Hub delayed',
      description: 'The yarn lot ordered on 10th June has not arrived at the cluster pickup point yet.',
      status: 'In Progress',
      date: '12 Jun 2026'
    },
    {
      id: 'TKT-8902',
      category: 'Payment Issue',
      title: 'Bulk order payout verification pending',
      description: 'Completed weavers quota for Fabindia Order #1002. Verification status shows pending.',
      status: 'Resolved',
      date: '04 Jun 2026'
    }
  ]);

  const handleRaiseComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDescription.trim()) {
      alert("Please fill in both the complaint title and description.");
      return;
    }

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: complaintCategory,
      title: complaintTitle.trim(),
      description: complaintDescription.trim(),
      status: 'Pending Review',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setTickets(prev => [newTicket, ...prev]);
    setComplaintTitle('');
    setComplaintDescription('');
    alert("Your complaint has been registered successfully! Ticket ID: " + newTicket.id);
  };

  const handleSave = () => {
    registerUser({
      name: fullName,
      phone: mobile,
      email: email
    });
    setActiveSection(null);
    alert("Profile changes saved successfully and synced with Shilp Setu directory!");
  };

  return (
    <div className="flex-1 flex flex-col pb-24 bg-[#FFFBF7] relative">
      
      {/* 1. HEADER (Orange logo, Varanasi Weaver Graphic backdrop) */}
      <div className="relative overflow-hidden bg-[#FFF5EB] border-b border-[#FF6B35]/10 p-6 flex flex-col gap-6">
        
        {/* Header Navigation bar */}
        <div className="flex justify-between items-center relative z-10">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-10 h-10 rounded-full border border-[#FF6B35]/10 bg-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-800" />
          </button>
          
          <div className="text-center flex flex-col items-center select-none">
            <h1 className="font-heading font-black text-lg text-[#B3562C] leading-none uppercase tracking-wide">
              शिल्प सेतु
            </h1>
            <span className="text-[9px] text-[#B3562C] font-black uppercase tracking-widest mt-1 block">
              SHILP SETU
            </span>
          </div>

          <button 
            onClick={() => setCurrentView('notifications')}
            className="w-10 h-10 rounded-full border border-[#FF6B35]/10 bg-white flex items-center justify-center shadow-sm relative active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5 text-stone-800" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>

        {/* Backdrop graphics positioning */}
        <div className="absolute right-0 bottom-0 pointer-events-none z-0">
          <HandloomWeaverGraphics />
        </div>

        {/* Profile Card Summary */}
        <div className="flex items-center gap-4 relative z-10 pt-2 pb-2">
          {/* Clickable Avatar frame with Edit overlay */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-stone-100 shrink-0 cursor-pointer relative group hover:scale-102 active:scale-98 transition-all"
            title="Click to change profile photo"
          >
            <img 
              src={avatar} 
              alt="Ramesh Kumar Profile" 
              className="w-full h-full object-cover"
            />
            {/* Hover Edit Banner overlay */}
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black text-white uppercase tracking-wider">Edit</span>
            </div>
          </div>

          {/* Hidden avatar file selector */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload} 
          />

          {/* Profile Name info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-black text-lg text-stone-850 truncate leading-tight">
                {fullName}
              </h3>
              <span className="w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="4.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </div>

            <span className="text-xs text-[#B3562C] font-black block mt-0.5 uppercase tracking-wider">
              {craftSpecialization}
            </span>

            {/* Hindi profile tag */}
            <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-500 font-extrabold">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>बनारसी साड़ी बुनकर</span>
            </div>

            {/* Verification tag */}
            <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200/50 text-green-700 text-[9px] font-black px-2.5 py-0.5 rounded-full mt-2.5 shadow-sm uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Shilp Setu Verified Artisan</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. PROFILE LIST ITEMS */}
      <div className="p-4 flex flex-col gap-3.5">
        
        {/* Item 1: Basic Information */}
        <ProfileRow 
          title="Basic Information"
          subtitle={`${gender} • ${dob} • ${experience} Exp • ${mobile}`}
          icon={User}
          onClick={() => setActiveSection('basic')}
        />

        {/* Item 2: Craft Information */}
        <ProfileRow 
          title="Craft Information"
          subtitle={`${craftSpecialization} • ${handmadeType} • MOQ: ${moq}`}
          icon={LayersIcon}
          onClick={() => setActiveSection('craft')}
        />

        {/* Item 3: Location */}
        <ProfileRow 
          title="Location"
          subtitle={`${fullAddress}`}
          icon={MapPin}
          onClick={() => setActiveSection('location')}
        />

        {/* Item 4: Verification */}
        <ProfileRow 
          title="Verification"
          subtitle="Aadhaar, Mobile, Email, Geolocation Verified"
          icon={ShieldCheck}
          badge="Verified"
          onClick={() => setActiveSection('verification')}
        />

        {/* Item 5: Business Details */}
        <ProfileRow 
          title="Business Details"
          subtitle={`${bizName} • ${bizType}`}
          icon={Store}
          onClick={() => setActiveSection('business')}
        />

        {/* Item 6: Payment Details */}
        <ProfileRow 
          title="Payment Details"
          subtitle={`UPI: ${upiId} • ${bankName}`}
          icon={CreditCard}
          onClick={() => setActiveSection('payment')}
        />

        {/* Item 7: Portfolio */}
        <ProfileRow 
          title="Portfolio"
          subtitle={`${portfolioProducts} • Collabs: Taneira`}
          icon={Image}
          previews={[
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100", // Red Saree
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100", // Purple Saree
            "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=100"  // Orange Saree
          ]}
          onClick={() => setActiveSection('portfolio')}
        />

        {/* Item 7.5: Help & Support / Raise a Complaint */}
        <ProfileRow 
          title="Help & Support"
          subtitle="Raise a complaint, ask questions, or contact support"
          icon={HelpCircle}
          onClick={() => setActiveSection('help')}
        />

        {/* Item 8: Trust Score (Circular Gauge) */}
        <Card padding="none" className="bg-white rounded-3xl p-4 border border-primary/5 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3EE] flex items-center justify-center text-[#B3562C] shrink-0">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-black text-stone-850">Trust Score</h4>
              <span className="text-[10px] text-text-secondary block mt-0.5 font-bold leading-tight">
                High Trust Artisan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black text-stone-850 leading-none">4.8 <span className="text-[9px] text-stone-400 font-bold">/5</span></span>
              <div className="flex items-center gap-0.5 mt-1 text-amber-500">
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current opacity-40" />
              </div>
            </div>

            <div className="w-11 h-11 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#E6E6E6" strokeWidth="3" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#4CAF50" strokeWidth="3" strokeDasharray="96, 100" strokeLinecap="round" />
              </svg>
            </div>
            
            <ChevronRight className="w-4 h-4 text-stone-450" />
          </div>
        </Card>

      </div>

      {/* 3. BOTTOM LOGOUT BUTTON */}
      <div className="px-4 mt-2">
        <button
          onClick={() => {
            if (confirm("Are you sure you want to log out of your account?")) {
              logout();
            }
          }}
          className="w-full py-4 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/50 text-xs font-black rounded-3xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span>Log Out Account</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 4. MODALS FOR EACH DETAIL SECTION (View and Edit options) */}
      {/* ============================================================== */}

      {/* Section 1: Basic Information Modal */}
      {activeSection === 'basic' && (
        <ModalWrapper title="Basic Information" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Full Name" value={fullName} onChange={setFullName} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-text-secondary uppercase">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <InputField label="Date of Birth" value={dob} onChange={setDob} />
          </div>

          <InputField label="Mobile Number" value={mobile} onChange={setMobile} />
          <InputField label="Email Address" value={email} onChange={setEmail} />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Preferred Language" value={language} onChange={setLanguage} />
            <InputField label="Education" value={education} onChange={setEducation} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Years of Experience" value={experience} onChange={setExperience} />
            <InputField label="Masked Aadhaar" value={aadhaarMasked} onChange={setAadhaarMasked} />
          </div>
          
          <InputField label="GSTIN (if available)" value={gstin} onChange={setGstin} />
        </ModalWrapper>
      )}

      {/* Section 2: Craft Information Modal */}
      {activeSection === 'craft' && (
        <ModalWrapper title="Craft Information" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Craft Category" value={craftCategory} onChange={setCraftCategory} />
            <InputField label="Craft Specialization" value={craftSpecialization} onChange={setCraftSpecialization} />
          </div>

          <InputField label="Product Categories" value={productCategories} onChange={setProductCategories} />
          <InputField label="Primary Materials Used" value={materials} onChange={setMaterials} />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Weaving/Technique" value={technique} onChange={setTechnique} />
            <InputField label="Cluster Name" value={cluster} onChange={setCluster} />
          </div>

          <InputField label="Geographical Indication (GI) Tag" value={giTag} onChange={setGiTag} />

          <div className="grid grid-cols-3 gap-2">
            <InputField label="Capacity/mo" value={capacity} onChange={setCapacity} />
            <InputField label="MOQ" value={moq} onChange={setMoq} />
            <InputField label="Lead Time" value={leadTime} onChange={setLeadTime} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-text-secondary uppercase">Customization</label>
              <select value={customization} onChange={(e) => setCustomization(e.target.value)} className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-text-secondary uppercase">Handmade Type</label>
              <select value={handmadeType} onChange={(e) => setHandmadeType(e.target.value)} className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <option value="Handmade">Handmade</option>
                <option value="Semi-Handmade">Semi-Handmade</option>
                <option value="Machine Assisted">Machine Assisted</option>
              </select>
            </div>
          </div>

          <InputField label="Awards & Certifications" value={awards} onChange={setAwards} />
        </ModalWrapper>
      )}

      {/* Section 3: Location Modal */}
      {activeSection === 'location' && (
        <ModalWrapper title="Location & Workshop" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Workshop Name" value={workshopName} onChange={setWorkshopName} />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Village" value={village} onChange={setVillage} />
            <InputField label="District" value={district} onChange={setDistrict} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="State" value={state} onChange={setState} />
            <InputField label="PIN Code" value={pinCode} onChange={setPinCode} />
          </div>

          <InputField label="Full Address" value={fullAddress} onChange={setFullAddress} />
          
          <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl flex flex-col gap-1">
            <span className="text-[9px] font-black text-text-secondary uppercase">Google Maps Location Link</span>
            <a href={gmaps} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold underline truncate">
              {gmaps}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-1">
            <InputField label="Geotag Verified" value={geoVerified} onChange={setGeoVerified} />
            <InputField label="Dist to Nearest City" value={nearestCityDist} onChange={setNearestCityDist} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-text-secondary uppercase">Pickup Availability</label>
              <select value={pickupAvail} onChange={(e) => setPickupAvail(e.target.value)} className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <InputField label="Nearby Partner Hub" value={pickupCompany} onChange={setPickupCompany} />
          </div>
        </ModalWrapper>
      )}

      {/* Section 4: Verification Badges Modal */}
      {activeSection === 'verification' && (
        <ModalWrapper title="Verification Status" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <p className="text-[10px] text-text-secondary leading-normal font-bold">
            Verify documentation and badges below. These tags are published on the Brand Explorer portal.
          </p>

          <div className="grid grid-cols-2 gap-3.5 my-2">
            <VerificationToggle label="Aadhaar Verified" checked={vAadhaar} onChange={setVAadhaar} />
            <VerificationToggle label="Mobile Verified" checked={vMobile} onChange={setVMobile} />
            <VerificationToggle label="Email Verified" checked={vEmail} onChange={setVEmail} />
            <VerificationToggle label="Face Verification" checked={vFace} onChange={setVFace} />
            <VerificationToggle label="Workshop Verified" checked={vWorkshop} onChange={setVWorkshop} />
            <VerificationToggle label="Geo-location Verified" checked={vGeo} onChange={setVGeo} />
          </div>

          <div className="flex flex-col gap-1.5 border-t border-stone-100 pt-4 mt-2">
            <label className="text-[9px] font-black text-text-secondary uppercase">Secondary Verification Doc</label>
            <select 
              value={vDocumentType} 
              onChange={(e) => setVDocumentType(e.target.value)} 
              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none w-full"
            >
              <option value="GST Verified">GST Verified</option>
              <option value="MSME Registration">MSME Registration</option>
              <option value="UDYAM Registration">UDYAM Registration</option>
              <option value="Artisan ID Card">Artisan ID Card</option>
            </select>
          </div>
        </ModalWrapper>
      )}

      {/* Section 5: Business Details Modal */}
      {activeSection === 'business' && (
        <ModalWrapper title="Business Details" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Business Name" value={bizName} onChange={setBizName} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-text-secondary uppercase">Business Type</label>
            <select 
              value={bizType} 
              onChange={(e) => setBizType(e.target.value)} 
              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none w-full"
            >
              <option value="Proprietorship">Proprietorship</option>
              <option value="Partnership">Partnership</option>
              <option value="SELF HELP GROUP">SELF HELP GROUP (SHG)</option>
              <option value="NGO">NGO</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="MSME Registration Number" value={msmeRegNo} onChange={setMsmeRegNo} />
            <InputField label="GST Number" value={bizGst} onChange={setBizGst} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <InputField label="PAN Number" value={bizPan} onChange={setBizPan} />
            <InputField label="Year Established" value={yearEst} onChange={setYearEst} />
            <InputField label="Employees Count" value={employees} onChange={setEmployees} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Number of Artisans" value={artisansCount} onChange={setArtisansCount} />
            <InputField label="Monthly Capacity" value={capacity} onChange={setCapacity} />
          </div>

          <InputField label="Export Experience" value={bizExport} onChange={setBizExport} />
          <InputField label="Current Active Buyers" value={bizBuyers} onChange={setBizBuyers} />
          
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-[9px] font-black text-text-secondary uppercase">Workshop & Factory Images</span>
            <div className="flex gap-2.5 mt-1">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm shrink-0">
                <img src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=100" alt="Factory" className="w-full h-full object-cover" />
              </div>
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm shrink-0">
                <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=100" alt="Workshop" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Section 6: Payment Details Modal */}
      {activeSection === 'payment' && (
        <ModalWrapper title="Payment & Bank Details" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-text-secondary uppercase">Preferred Payment Method</label>
            <select 
              value={preferredPayment} 
              onChange={(e) => setPreferredPayment(e.target.value)} 
              className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none w-full"
            >
              <option value="Bank">Bank Account Transfer</option>
              <option value="UPI">UPI ID</option>
            </select>
          </div>

          <InputField label="Bank Name" value={bankName} onChange={setBankName} />
          <InputField label="Account Holder Name" value={accountHolder} onChange={setAccountHolder} />
          <InputField label="Account Number" value={accountNumber} onChange={setAccountNumber} />
          <InputField label="IFSC Code" value={ifscCode} onChange={setIfscCode} />
          <InputField label="UPI ID / VPA" value={upiId} onChange={setUpiId} />
        </ModalWrapper>
      )}

      {/* Section 7: Portfolio Modal */}
      {activeSection === 'portfolio' && (
        <ModalWrapper title="Portfolio & Links" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Active Saree Listings" value={portfolioProducts} onChange={setPortfolioProducts} />
          <InputField label="Brand Collaborations" value={brandCollabs} onChange={setBrandCollabs} />
          <InputField label="Accreditations & Certificates" value={certificates} onChange={setCertificates} />
          
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-stone-800 uppercase">Website & Social Media Links</span>
            </div>
            
            <InputField label="Artisan Subdomain Website" value={websiteUrl} onChange={setWebsiteUrl} />
            <InputField label="Social Media Link" value={socialMedia} onChange={setSocialMedia} />
          </div>
        </ModalWrapper>
      )}

      {/* Section 7.5: Help & Support Modal */}
      {activeSection === 'help' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 border border-primary/5 max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp">
            
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 shrink-0">
              <h3 className="font-heading font-black text-base text-[#B3562C]">Help & Support</h3>
              <button 
                onClick={() => setActiveSection(null)} 
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-95"
              >
                <X className="w-4 h-4 text-stone-650" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 pr-0.5 py-1 text-left">
              {/* Form to raise complaint */}
              <form onSubmit={handleRaiseComplaint} className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Raise a New Complaint</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-secondary uppercase">Issue Category</label>
                  <select 
                    value={complaintCategory} 
                    onChange={(e) => setComplaintCategory(e.target.value)} 
                    className="text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#B3562C] focus:bg-white"
                  >
                    <option value="Payment Issue">💰 Payment / Payout Issue</option>
                    <option value="Delivery Delay">🚚 Logistics & Yarn Delivery Delay</option>
                    <option value="App Bug / Error">📱 App Bug / Technical Error</option>
                    <option value="Supplier Dispute">🤝 Dispute with Brand / Buyer</option>
                    <option value="Other">❓ Other Support Query</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-secondary uppercase">Complaint Title</label>
                  <input
                    type="text"
                    value={complaintTitle}
                    onChange={(e) => setComplaintTitle(e.target.value)}
                    placeholder="Short summary of issue..."
                    className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#B3562C] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-text-secondary uppercase">Detailed Description</label>
                  <textarea
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide details of the problem..."
                    className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#B3562C] focus:bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 bg-[#B3562C] hover:bg-[#A04A26] text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 mt-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </button>
              </form>

              {/* History of complaints */}
              <div className="flex flex-col gap-3 mt-2">
                <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest border-t border-stone-100 pt-4">Complaint History ({tickets.length})</h4>
                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {tickets.map((t) => (
                    <div key={t.id} className="bg-stone-50/50 border border-stone-150 rounded-2xl p-3.5 flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-black text-stone-700">{t.id}</span>
                        <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full border ${
                          t.status === 'Resolved' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : t.status === 'In Progress'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-stone-100 border-stone-250 text-stone-600'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9.5px] font-black text-stone-400 uppercase tracking-wide block">{t.category}</span>
                        <span className="text-xs font-black text-stone-850 mt-0.5 block leading-tight">{t.title}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-medium leading-relaxed mt-0.5">{t.description}</p>
                      <span className="text-[8px] text-stone-400 font-bold block mt-1 text-right">{t.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4 mt-1 shrink-0">
              <button
                onClick={() => setActiveSection(null)}
                className="w-full py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
              >
                Close Support
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

// ==============================================================
// INTERNAL LAYOUT HELPERS
// ==============================================================

// Subcomponent: LayersIcon representing Grid / Craft structure
const LayersIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 17 12 22 22 17" />
    <path d="M2 12 12 17 22 12" />
    <path d="m2 7 10 5 10-5-10-5z" />
  </svg>
);

// Row Helper interface
interface ProfileRowProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  badge?: string;
  previews?: string[];
  onClick?: () => void;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ title, subtitle, icon: Icon, badge, previews, onClick }) => {
  return (
    <Card 
      padding="none" 
      onClick={onClick}
      className="bg-white rounded-3xl p-4 border border-primary/5 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Terracotta/Brown icon square box */}
        <div className="w-10 h-10 rounded-2xl bg-[#FFF3EE] flex items-center justify-center text-[#B3562C] shrink-0">
          <Icon className="w-5.5 h-5.5" />
        </div>

        {/* Text descriptions */}
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-black text-stone-850 leading-none">{title}</h4>
          <span className="text-[10px] text-text-secondary block mt-1.5 font-bold truncate leading-tight">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Right widgets (galleries, checkmarks, chevrons) */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        {badge && (
          <span className="bg-green-50 border border-green-200 text-green-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider">
            {badge}
          </span>
        )}
        
        {previews && (
          <div className="flex items-center gap-1.5">
            {previews.map((src, i) => (
              <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-sm shrink-0">
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <ChevronRight className="w-4 h-4 text-stone-400" />
      </div>
    </Card>
  );
};

// Modal Wrapper Component
interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ title, onClose, onSave, children }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 border border-primary/5 max-h-[90vh] overflow-y-auto no-scrollbar animate-slideUp">
        
        <div className="flex justify-between items-center border-b border-stone-100 pb-3 shrink-0">
          <h3 className="font-heading font-black text-base text-[#B3562C]">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-95"
          >
            <X className="w-4 h-4 text-stone-650" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3.5 pr-0.5 py-1">
          {children}
        </div>

        <div className="flex gap-3 border-t border-stone-100 pt-4 mt-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-[#B3562C] hover:bg-[#A04A26] text-white text-xs font-black rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Input Field Component
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[9px] font-black text-text-secondary uppercase">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
      />
    </div>
  );
};

// Verification Toggle Component
interface VerificationToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const VerificationToggle: React.FC<VerificationToggleProps> = ({ label, checked, onChange }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between select-none ${
        checked 
          ? 'bg-green-50/50 border-green-200 text-green-700' 
          : 'bg-stone-50 border-stone-200 text-stone-400'
      }`}
    >
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      {checked ? (
        <span className="w-4.5 h-4.5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm shrink-0">
          <Check className="w-2.5 h-2.5" strokeWidth={4} />
        </span>
      ) : (
        <span className="w-4.5 h-4.5 rounded-full bg-stone-200 flex items-center justify-center text-stone-400 shrink-0">
          <X className="w-2.5 h-2.5" strokeWidth={4} />
        </span>
      )}
    </div>
  );
};
