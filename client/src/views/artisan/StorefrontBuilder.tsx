import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Camera, Check, Store, Globe, 
  Share2, Eye, ShieldCheck, Rocket, ShoppingBag, 
  BarChart3, RefreshCcw 
} from 'lucide-react';

export const StorefrontBuilder: React.FC = () => {
  const { products, setCurrentView } = useApp();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const [published, setPublished] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brandName, setBrandName] = useState('Ramesh Handlooms');
  const [selectedTheme, setSelectedTheme] = useState('Handloom');
  const [featuredProducts, setFeaturedProducts] = useState<string[]>(['p-1', 'p-2']);
  const [aboutBrand, setAboutBrand] = useState('Authentic handloom silk weavers from Varanasi, crafting pure Katan and Organza sarees for three generations.');

  const themes = [
    { name: 'Classic', colorBg: 'bg-amber-100', colorBorder: 'border-amber-600', textCol: 'text-amber-800' },
    { name: 'Luxury', colorBg: 'bg-stone-900', colorBorder: 'border-stone-950', textCol: 'text-stone-300' },
    { name: 'Handloom', colorBg: 'bg-orange-100', colorBorder: 'border-primary', textCol: 'text-primary' },
    { name: 'Modern', colorBg: 'bg-blue-100', colorBorder: 'border-blue-600', textCol: 'text-blue-800' }
  ];

  const toggleFeaturedProduct = (id: string) => {
    if (featuredProducts.includes(id)) {
      setFeaturedProducts(featuredProducts.filter(x => x !== id));
    } else {
      setFeaturedProducts([...featuredProducts, id]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoUrl(url);
    setLogoUploaded(true);
  };

  const handlePublish = () => {
    if (!brandName.trim()) {
      alert("Please enter a brand name.");
      return;
    }
    setPublished(true);
    alert("Storefront Published Live!\nYour custom brand page is now visible to D2C buyers.");
  };

  // ==================== RENDERING LIVE PREVIEW STOREFRONT ====================
  if (published) {
    const selectedThemeDetails = themes.find(t => t.name === selectedTheme) || themes[2];
    
    return (
      <div className="flex-1 flex flex-col pb-8">
        {/* Live Header */}
        <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPublished(false)}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <h2 className="font-heading font-extrabold text-lg">My Live Brand</h2>
          </div>
          
          <button
            onClick={() => setPublished(false)}
            className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full text-xs font-bold text-text-secondary transition-all"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Edit Store</span>
          </button>
        </div>

        {/* Live Store Banner & Info */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Quick Stats Header Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 border border-stone-150 shadow-sm text-center">
              <span className="text-[9px] font-extrabold text-text-secondary uppercase block">Total Sales</span>
              <span className="text-base font-extrabold text-accent mt-0.5 block">₹33,500</span>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-stone-150 shadow-sm text-center">
              <span className="text-[9px] font-extrabold text-text-secondary uppercase block">Active Products</span>
              <span className="text-base font-extrabold text-text-primary mt-0.5 block">{featuredProducts.length} listings</span>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-stone-150 shadow-sm text-center">
              <span className="text-[9px] font-extrabold text-text-secondary uppercase block">Theme Mode</span>
              <span className="text-base font-extrabold text-primary mt-0.5 block">{selectedTheme}</span>
            </div>
          </div>

          {/* Main Store Profile Card */}
          <Card padding="md" className="flex flex-col gap-4 border border-primary/5">
            <div className="flex gap-4 items-center">
              {/* Logo preview */}
              {logoUrl ? (
                <div className="w-16 h-16 rounded-full overflow-hidden border border-secondary shrink-0 bg-white">
                  <img src={logoUrl} alt="Storefront Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center border border-secondary text-primary font-heading font-extrabold text-2xl shrink-0">
                  {brandName.substring(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-heading font-extrabold text-lg text-text-primary">{brandName}</h3>
                  <ShieldCheck className="w-4.5 h-4.5 text-accent" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-accent font-bold mt-0.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>shilpsetu.in/{brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed border-t border-stone-100 pt-3">
              {aboutBrand}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <button 
                onClick={() => alert("Redirecting to storefront site...")}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-primary text-xs font-bold text-primary hover:bg-primary-light transition-all bg-white"
              >
                <Eye className="w-4 h-4" />
                <span>Visit Store</span>
              </button>

              <button 
                onClick={() => alert("Link copied to clipboard!")}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-text-primary hover:bg-stone-50 transition-all bg-white"
              >
                <Share2 className="w-4 h-4 text-stone-400" />
                <span>Share Store</span>
              </button>
            </div>
          </Card>

          {/* Featured items showcase */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">Featured Shop Collections</h4>
            <div className="grid grid-cols-2 gap-3">
              {products
                .filter(p => featuredProducts.includes(p.id))
                .map(product => (
                  <Card key={product.id} padding="none" className="overflow-hidden border border-primary/5 flex flex-col justify-between">
                    <div className="w-full aspect-[4/3] bg-stone-100 relative">
                      <img src={product.images[0]} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase bg-black/60 text-white px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h5 className="text-xs font-bold text-text-primary truncate">{product.name}</h5>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[10px] text-text-secondary font-bold">₹{product.price.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] font-extrabold text-accent">Active</span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==================== RENDERING STOREFRONT BUILDER FORM ====================
  return (
    <div className="flex-1 flex flex-col pb-8">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <h2 className="font-heading font-extrabold text-lg">Create Your Brand</h2>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Step 1: Upload Logo */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium text-center flex flex-col items-center">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-3 text-left w-full">1. Brand Logo</span>
          
          <input 
            type="file" 
            ref={logoInputRef} 
            onChange={handleLogoUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {logoUploaded && logoUrl ? (
            <div 
              className="relative group cursor-pointer" 
              onClick={() => logoInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-white flex items-center justify-center overflow-hidden shadow">
                <img src={logoUrl} alt="Uploaded Logo Preview" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full border border-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-primary transition-all shadow-sm"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}
          <span className="text-[10px] text-text-secondary font-bold mt-2">Upload round logo or brand initial badge</span>
        </div>

        {/* Step 2: Brand Name */}
        <div className="bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-3">
          <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Store className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1 pr-3">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">2. Brand / Storefront Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Ramesh Handlooms"
              className="w-full text-sm font-bold text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Step 3: Featured Products Checklist */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-3">3. Select Products to Feature</span>
          <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1 no-scrollbar">
            {products.map(p => {
              const selected = featuredProducts.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleFeaturedProduct(p.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all ${
                    selected ? 'border-primary bg-primary-light' : 'border-stone-150 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => {}} // handled by click
                    className="accent-primary w-4 h-4 shrink-0"
                  />
                  <img src={p.images[0]} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-text-primary block truncate">{p.name}</span>
                    <span className="text-[10px] text-text-secondary">₹{p.price.toLocaleString('en-IN')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Themes */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-3">4. Choose Brand Theme</span>
          <div className="grid grid-cols-4 gap-2">
            {themes.map(theme => {
              const isSelected = selectedTheme === theme.name;
              return (
                <button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme.name)}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all h-18 ${
                    isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary-light' : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg shadow-sm ${theme.colorBg} shrink-0`} />
                  <span className="text-[10px] font-bold mt-1 text-text-primary">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: About Brand */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">5. About Brand / Storefront</label>
          <textarea
            value={aboutBrand}
            onChange={(e) => setAboutBrand(e.target.value)}
            placeholder="Introduce your craft heritage or Cooperative society history to brand buyers..."
            rows={3}
            className="w-full text-xs font-medium text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
          />
        </div>

        {/* Action Button */}
        <Button onClick={handlePublish}>
          <span className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            <span>Publish Brand Storefront</span>
          </span>
        </Button>

      </div>
    </div>
  );
};
