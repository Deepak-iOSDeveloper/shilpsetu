import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Bell, User, MapPin, ShieldCheck, 
  Store, CreditCard, Image, Star, Edit3, ChevronRight,
  X, Check, Info, Award, HelpCircle, Layers, Globe,
  BarChart3, ShieldAlert, SlidersHorizontal, Settings,
  LogOut, MessageSquare
} from 'lucide-react';

export const BrandProfile: React.FC = () => {
  const { setCurrentView, brandProfile, registerUser } = useApp();

  // Active modal section state
  const [activeSection, setActiveSection] = useState<'profile' | 'stores' | 'analytics' | 'preferences' | 'security' | 'integrations' | 'support' | null>(null);

  // ==========================================
  // SEED STATES
  // ==========================================

  // 1. Brand Profile
  const [brandLogo, setBrandLogo] = useState<string | null>(() => {
    return localStorage.getItem('brandLogo') || null;
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setBrandLogo(result);
          localStorage.setItem('brandLogo', result);
          alert("Brand logo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [brandName, setBrandName] = useState(brandProfile?.brandName || 'FabIndia Boutique');
  const [companyName, setCompanyName] = useState(brandProfile?.brandName ? `${brandProfile.brandName} Ltd` : 'FabIndia Overseas Pvt. Ltd.');
  const [brandDesc, setBrandDesc] = useState('Celebrate Indian handloom textiles and organic cotton crafts.');
  const [website, setWebsite] = useState(brandProfile?.websiteUrl || 'www.fabindia.com');
  const [industry, setIndustry] = useState('Apparel & Fashion Retail');
  const [brandCat, setBrandCat] = useState('Fashion, Home Decor, Accessories');
  const [yearEst, setYearEst] = useState('1960');
  // Contact Details
  const [contactPerson, setContactPerson] = useState(brandProfile?.contactPerson || 'Ananya Goel');
  const [designation, setDesignation] = useState('Head of Sourcing');
  const [email, setEmail] = useState('ananya.goel@fabindia.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [altPhone, setAltPhone] = useState('+91 9988776655');
  const [whatsapp, setWhatsapp] = useState('+91 9876543210');
  // Business Address
  const [regAddress, setRegAddress] = useState('14 N-Block Market, Greater Kailash-I, New Delhi - 110048');
  const [whAddress, setWhAddress] = useState('Plot No. 12, Sector 5, IMT Manesar, Gurugram, Haryana - 122051');
  const [billingAddress, setBillingAddress] = useState('14 N-Block Market, GK-I, Delhi - 110048');
  const [shippingAddress, setShippingAddress] = useState('Plot No. 12, Sector 5, IMT Manesar, Gurugram - 122051');
  const [gstState, setGstState] = useState('Delhi (07AAAAA1111A1Z1)');

  // 2. Connected Stores & Wallet
  const [walletBal, setWalletBal] = useState(124500);
  const [escrowBal, setEscrowBal] = useState(40000);
  const [pendingPayments, setPendingPayments] = useState(15000);
  const [totalSpend, setTotalSpend] = useState(485000);

  // 3. Preferences
  const [prefCraft, setPrefCraft] = useState('Banarasi Weaving, Bhuj Dyes');
  const [prefState, setPrefState] = useState('Uttar Pradesh, Gujarat, Madhya Pradesh');
  const [prefMoq, setPrefMoq] = useState('10 - 50 pieces');
  const [prefPrice, setPrefPrice] = useState('₹5,000 - ₹25,000');
  const [prefLeadTime, setPrefLeadTime] = useState('15 - 45 Days');

  // 4. Security
  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [apiKey, setApiKey] = useState('pk_live_shilpsetusecret992');

  const handleSave = () => {
    registerUser({
      brandName: brandName,
      contactPerson: contactPerson,
      categories: brandCat.split(',').map(c => c.trim()),
      websiteUrl: website
    });
    setActiveSection(null);
    alert("Brand profile configuration successfully updated!");
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFFBF7] pb-16 text-left select-none">
      
      {/* 1. HEADER (Logo and brand basic details) */}
      <div className="relative overflow-hidden bg-white border-b border-[#FF6B35]/10 p-6 flex flex-col gap-6 shadow-sm shrink-0 z-30">
        <div className="flex justify-between items-center relative z-10">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-850" />
          </button>
          
          <div className="text-center flex flex-col items-center">
            <h1 className="font-heading font-black text-lg text-[#B3562C] leading-none uppercase tracking-wide">
              Shilp Setu
            </h1>
            <span className="text-[8px] text-text-secondary font-bold uppercase tracking-widest mt-1 block">
              Brand Account Hub
            </span>
          </div>

          <button 
            onClick={() => setCurrentView('notifications')}
            className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center shadow-sm relative active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5 text-stone-850" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="flex items-center gap-4 relative z-10 pt-2 pb-2">
          {/* Clickable Avatar frame with Edit overlay */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full overflow-hidden border border-stone-250 bg-[#B3562C] flex items-center justify-center font-heading font-black text-3xl text-white shadow shrink-0 cursor-pointer relative group hover:scale-102 active:scale-98 transition-all"
            title="Click to change logo image"
          >
            {brandLogo ? (
              <img src={brandLogo} alt="Brand Logo" className="w-full h-full object-cover" />
            ) : (
              <span>{brandName.charAt(0)}</span>
            )}
            {/* Hover Edit overlay banner */}
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] font-black text-white uppercase tracking-wider">Edit</span>
            </div>
          </div>

          {/* Hidden uploader input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleLogoUpload} 
          />

          {/* Profile Name info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-black text-lg text-stone-850 truncate leading-tight">
                {brandName}
              </h3>
              <span className="w-4.5 h-4.5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="4.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </div>

            <span className="text-xs text-text-secondary font-bold block mt-0.5">
              {companyName}
            </span>

            {/* Verification tag */}
            <div className="inline-flex items-center gap-1 bg-green-50 border border-green-200/50 text-green-700 text-[9px] font-black px-2.5 py-0.5 rounded-full mt-2.5 shadow-sm uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Corporate Sourcing</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BRAND PROFILE LIST OPTIONS */}
      <div className="p-4 flex flex-col gap-3.5 flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* Item 1: Brand Profile */}
        <ProfileRow 
          title="Brand Profile"
          subtitle="Corporate profile, Contact details & Address list"
          icon={User}
          onClick={() => setActiveSection('profile')}
        />

        {/* Item 2: Connected Stores & Wallet */}
        <ProfileRow 
          title="Connected Stores & Wallet"
          subtitle={`Wallet: ₹${walletBal.toLocaleString()} • Escrow: ₹${escrowBal.toLocaleString()}`}
          icon={CreditCard}
          onClick={() => setActiveSection('stores')}
        />

        {/* Item 3: Sourcing Analytics */}
        <ProfileRow 
          title="Sourcing Analytics"
          subtitle="Spend overview, category performance & charts"
          icon={BarChart3}
          onClick={() => setActiveSection('analytics')}
        />

        {/* Item 4: Sourcing Preferences */}
        <ProfileRow 
          title="Sourcing Preferences"
          subtitle="Preferred crafts, MOQ ranges & Lead times"
          icon={SlidersHorizontal}
          onClick={() => setActiveSection('preferences')}
        />

        {/* Item 5: Security */}
        <ProfileRow 
          title="Security & Keys"
          subtitle="2FA, Login logs & Secret API Keys"
          icon={ShieldAlert}
          onClick={() => setActiveSection('security')}
        />

        {/* Item 6: Integrations */}
        <ProfileRow 
          title="Integrations & Tools"
          subtitle="Shopify, WooCommerce, Shiprocket, Tally"
          icon={Globe}
          onClick={() => setActiveSection('integrations')}
        />

        {/* Item 7: Help & Support */}
        <ProfileRow 
          title="Help & Support"
          subtitle="Chat support, ticketing, & FAQ guides"
          icon={HelpCircle}
          onClick={() => setActiveSection('support')}
        />

      </div>

      {/* 3. LOG OUT BUTTON */}
      <div className="px-4 mt-2 mb-6">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to log out of Shilp Setu?")) {
              setCurrentView('dashboard');
              alert("Logged out successfully.");
            }
          }}
          className="w-full py-4 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-black rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Log Out Account</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 4. MODALS FOR EACH DETAIL SECTION (View and Edit options) */}
      {/* ============================================================== */}

      {/* Section 1: Brand Profile Modal */}
      {activeSection === 'profile' && (
        <ModalWrapper title="Brand Profile" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Brand Name" value={brandName} onChange={setBrandName} />
          <InputField label="Company Name" value={companyName} onChange={setCompanyName} />
          <InputField label="Brand Description" value={brandDesc} onChange={setBrandDesc} />
          <InputField label="Website" value={website} onChange={setWebsite} />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Industry" value={industry} onChange={setIndustry} />
            <InputField label="Brand Category" value={brandCat} onChange={setBrandCat} />
          </div>
          
          <InputField label="Year Established" value={yearEst} onChange={setYearEst} />

          <div className="border-t border-stone-100 pt-3.5 mt-2">
            <span className="text-[10px] font-black text-stone-800 uppercase block mb-3">Contact Details</span>
            <InputField label="Contact Person" value={contactPerson} onChange={setContactPerson} />
            <InputField label="Designation" value={designation} onChange={setDesignation} />
            <InputField label="Email Address" value={email} onChange={setEmail} />
            <InputField label="Phone Number" value={phone} onChange={setPhone} />
            <InputField label="WhatsApp Details" value={whatsapp} onChange={setWhatsapp} />
          </div>

          <div className="border-t border-stone-100 pt-3.5 mt-2">
            <span className="text-[10px] font-black text-stone-800 uppercase block mb-3">Addresses</span>
            <InputField label="Registered Address" value={regAddress} onChange={setRegAddress} />
            <InputField label="Warehouse Address" value={whAddress} onChange={setWhAddress} />
            <InputField label="Billing Address" value={billingAddress} onChange={setBillingAddress} />
            <InputField label="Shipping Address" value={shippingAddress} onChange={setShippingAddress} />
            <InputField label="GST State & No" value={gstState} onChange={setGstState} />
          </div>
        </ModalWrapper>
      )}

      {/* Section 2: Connected Stores & Wallet Modal */}
      {activeSection === 'stores' && (
        <ModalWrapper title="Connected Stores & Wallet" onClose={() => setActiveSection(null)} onSave={handleSave}>
          
          <div className="bg-[#FFF3EE] border border-[#FF6B35]/15 p-4 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-xs font-black text-stone-800 uppercase">Wallet Balances</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase">Wallet Balance</span>
                <span className="text-base font-black text-stone-800 block mt-0.5">₹{walletBal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase">Escrow Locked</span>
                <span className="text-base font-black text-primary block mt-0.5">₹{escrowBal.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left border-t border-[#FF6B35]/10 pt-2.5 mt-1">
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase">Pending Payments</span>
                <span className="text-sm font-black text-stone-700 block mt-0.5">₹{pendingPayments.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-stone-500 uppercase">Total Sourced Spend</span>
                <span className="text-sm font-black text-stone-700 block mt-0.5">₹{totalSpend.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3.5 mt-2">
            <span className="text-[10px] font-black text-stone-800 uppercase block mb-3">Invoices & Logs</span>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => alert("Downloading GST Invoices...")} className="p-3 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl text-xs font-bold text-stone-700 text-left flex justify-between items-center">
                <span>GST Tax Invoices</span>
                <span className="text-[9px] text-[#B3562C] font-black uppercase">Download All</span>
              </button>
              
              <button onClick={() => alert("Opening payment log...")} className="p-3 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl text-xs font-bold text-stone-700 text-left flex justify-between items-center">
                <span>Payment History logs</span>
                <span className="text-[9px] text-[#B3562C] font-black uppercase">View</span>
              </button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Section 3: Sourcing Analytics Modal */}
      {activeSection === 'analytics' && (
        <ModalWrapper title="Sourcing Analytics" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col gap-3">
            <span className="text-[10px] font-black text-stone-850 uppercase">Overview Statistics</span>
            <div className="grid grid-cols-2 gap-3.5 text-xs text-left">
              <div>
                <span className="text-stone-400 font-bold">Total Orders</span>
                <span className="font-mono font-black text-stone-800 block mt-0.5">48 Active</span>
              </div>
              <div>
                <span className="text-stone-400 font-bold">Synced Products</span>
                <span className="font-mono font-black text-stone-800 block mt-0.5">26 Listings</span>
              </div>
              <div>
                <span className="text-stone-400 font-bold">Custom Orders Created</span>
                <span className="font-mono font-black text-stone-800 block mt-0.5">8 Sourcing</span>
              </div>
              <div>
                <span className="text-stone-400 font-bold">Total Spent</span>
                <span className="font-mono font-black text-stone-800 block mt-0.5">₹4,85,000</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col gap-3 mt-1 text-left">
            <span className="text-[10px] font-black text-stone-850 uppercase">Procurement Insights</span>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-stone-200/50">
                <span className="text-stone-400 font-bold">Best Selling Category</span>
                <span className="font-black text-stone-750">Banarasi Sarees</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/50">
                <span className="text-stone-400 font-bold">Best Artisan</span>
                <span className="font-black text-stone-750">Ramesh Kumar (4.8★)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-stone-200/50">
                <span className="text-stone-400 font-bold">Procurement Cost/Mo</span>
                <span className="font-black text-stone-750">₹85,000 Avg</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-400 font-bold">Average Lead Time</span>
                <span className="font-black text-stone-750">30 Days</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-950 rounded-2xl p-4 text-left relative overflow-hidden shrink-0 mt-1">
            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest block mb-2">Monthly Orders chart</span>
            <div className="flex items-end justify-between gap-1 h-20 pt-2">
              <div className="w-5 bg-green-500 rounded-t h-[20%] text-[8px] text-center text-white" />
              <div className="w-5 bg-green-500 rounded-t h-[40%] text-[8px] text-center text-white" />
              <div className="w-5 bg-green-500 rounded-t h-[55%] text-[8px] text-center text-white" />
              <div className="w-5 bg-green-500 rounded-t h-[80%] text-[8px] text-center text-white" />
              <div className="w-5 bg-green-500 rounded-t h-[65%] text-[8px] text-center text-white" />
              <div className="w-5 bg-green-400 rounded-t h-[95%] text-[8px] text-center text-white" />
            </div>
            <div className="flex justify-between text-[7px] text-stone-500 font-mono mt-1 uppercase">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Section 4: Sourcing Preferences Modal */}
      {activeSection === 'preferences' && (
        <ModalWrapper title="Sourcing Preferences" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <InputField label="Preferred Crafts" value={prefCraft} onChange={setPrefCraft} />
          <InputField label="Preferred States" value={prefState} onChange={setPrefState} />
          <InputField label="MOQ Filter Range" value={prefMoq} onChange={setPrefMoq} />
          <InputField label="Price Filter Range" value={prefPrice} onChange={setPrefPrice} />
          <InputField label="Lead Time Range" value={prefLeadTime} onChange={setPrefLeadTime} />
        </ModalWrapper>
      )}

      {/* Section 5: Security Modal */}
      {activeSection === 'security' && (
        <ModalWrapper title="Security & API Credentials" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col gap-2">
            <span className="text-[10px] font-black text-stone-850 uppercase">Secret API Key</span>
            <div className="flex justify-between items-center bg-white border border-stone-200 rounded-xl p-2.5 mt-0.5">
              <span className="font-mono font-bold text-stone-600 text-[10px] truncate max-w-[200px]">{apiKey}</span>
              <button onClick={() => {
                navigator.clipboard.writeText(apiKey);
                alert("Copied Key!");
              }} className="text-primary text-[10px] font-black uppercase hover:underline">Copy</button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-stone-50 border border-stone-200 rounded-2xl mt-1">
            <span className="text-xs font-bold text-stone-700">Two-Factor Authentication</span>
            <button 
              onClick={() => setTfaEnabled(!tfaEnabled)}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-wider transition-colors ${
                tfaEnabled ? 'bg-green-50 text-green-600 border-green-200' : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
            >
              {tfaEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <button onClick={() => alert("Triggering Change password flow...")} className="p-4 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-2xl text-xs font-black text-stone-700 text-left flex justify-between items-center">
            <span>Change Account Password</span>
            <ChevronRight className="w-4 h-4 text-stone-450" />
          </button>
        </ModalWrapper>
      )}

      {/* Section 6: Integrations Modal */}
      {activeSection === 'integrations' && (
        <ModalWrapper title="Integrations & Tools" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <p className="text-[10px] text-text-secondary leading-normal font-bold">
            Connect your Shilp Setu account with e-commerce, courier and bookkeeping software tools.
          </p>

          <div className="flex flex-col gap-2.5 mt-2">
            <IntegrationRow name="Shopify" connected={true} />
            <IntegrationRow name="WooCommerce" connected={false} />
            <IntegrationRow name="WordPress" connected={false} />
            <IntegrationRow name="Shiprocket" connected={true} />
            <IntegrationRow name="Razorpay" connected={true} />
            <IntegrationRow name="Tally" connected={false} />
            <IntegrationRow name="Zoho Books" connected={false} />
          </div>
        </ModalWrapper>
      )}

      {/* Section 7: Help & Support Modal */}
      {activeSection === 'support' && (
        <ModalWrapper title="Help & Support Desk" onClose={() => setActiveSection(null)} onSave={handleSave}>
          <div className="flex flex-col gap-3">
            
            <a href="tel:+919876543210" className="p-4 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-2xl text-xs font-black text-stone-700 text-left flex justify-between items-center">
              <span>Visit Sourcing Help Center</span>
              <Globe className="w-4 h-4 text-stone-400" />
            </a>

            <button onClick={() => setCurrentView('messages')} className="p-4 bg-[#FFF2EE] border border-[#FF6B35]/15 hover:bg-[#FFF5F1] rounded-2xl text-xs font-black text-[#B3562C] text-left flex justify-between items-center">
              <span>Open Chat Support (Online)</span>
              <MessageSquare className="w-4 h-4 text-[#B3562C]" />
            </button>

            <button onClick={() => alert("Creating ticket form...")} className="p-4 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-2xl text-xs font-black text-stone-700 text-left flex justify-between items-center">
              <span>Raise Support Ticket</span>
              <Award className="w-4 h-4 text-stone-400" />
            </button>
            
          </div>
        </ModalWrapper>
      )}

    </div>
  );
};

// Row helper subcomponent
interface ProfileRowProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  onClick?: () => void;
}

const ProfileRow: React.FC<ProfileRowProps> = ({ title, subtitle, icon: Icon, onClick }) => {
  return (
    <Card 
      padding="none" 
      onClick={onClick}
      className="bg-white rounded-3xl p-4 border border-primary/5 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-2xl bg-[#FFF3EE] flex items-center justify-center text-[#B3562C] shrink-0">
          <Icon className="w-5.5 h-5.5" />
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h4 className="text-xs font-black text-stone-850 leading-none">{title}</h4>
          <span className="text-[10px] text-text-secondary block mt-1.5 font-bold truncate leading-tight">
            {subtitle}
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 ml-3" />
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
    <div className="flex flex-col gap-1.5 w-full text-left">
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

// Integration Row helper
const IntegrationRow: React.FC<{ name: string; connected: boolean }> = ({ name, connected }) => {
  return (
    <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
      <span className="text-xs font-black text-stone-700">{name} Integration</span>
      
      <button 
        onClick={() => alert(`${name} connection setup simulated.`)}
        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border tracking-wider transition-colors ${
          connected ? 'bg-green-50 text-green-600 border-green-200' : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
};
