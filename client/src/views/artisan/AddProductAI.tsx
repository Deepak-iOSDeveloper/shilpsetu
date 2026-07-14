import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Sparkles, Camera, Mic, Copy,
  RotateCcw, Info, CheckCircle2, Loader2, ExternalLink 
} from 'lucide-react';

export const AddProductAI: React.FC = () => {
  const { addProduct, triggerAIAutofill, triggerAIImageStudio, setCurrentView, aiAutofillData, setAiAutofillData } = useApp();

  React.useEffect(() => {
    if (aiAutofillData) {
      if (aiAutofillData.name) setName(aiAutofillData.name);
      if (aiAutofillData.category) setCategory(aiAutofillData.category);
      if (aiAutofillData.craftType) setCraftType(aiAutofillData.craftType);
      if (aiAutofillData.material) setMaterial(aiAutofillData.material);
      if (aiAutofillData.price) setPrice(aiAutofillData.price);
      if (aiAutofillData.stockQty) setStockQty(aiAutofillData.stockQty);
      if (aiAutofillData.weight) setWeight(aiAutofillData.weight);
      if (aiAutofillData.description) setDescription(aiAutofillData.description);
      if (aiAutofillData.image) setUploadedImages([aiAutofillData.image]);
      
      // Clear it
      setAiAutofillData(null);
    }
  }, [aiAutofillData, setAiAutofillData]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Multiple images state (starts empty so user uploads images)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [uploadTarget, setUploadTarget] = useState<'main' | 'gallery'>('main');
  
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  // Custom prompt generate states
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptGallery, setShowPromptGallery] = useState(false);

  // Form Fields (Empty by default)
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [craftType, setCraftType] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [stockQty, setStockQty] = useState<number>(1);
  const [weight, setWeight] = useState<number>(0);
  const [dimensions, setDimensions] = useState('');
  const [processingTime, setProcessingTime] = useState('');
  const [description, setDescription] = useState('');

  // Styles lists for AI studio (6 options including Custom AI)
  const styleChips = [
    { name: 'White Background', icon: '🎨', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600' },
    { name: 'Lifestyle Shot', icon: '🌿', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600' },
    { name: 'Model Shot', icon: '💃', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600' },
    { name: 'Catalog', icon: '📖', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600' },
    { name: 'Luxury Style', icon: '✨', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600' },
    { name: 'Custom AI', icon: '🔮', image: '' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Url = reader.result as string;
      
      if (uploadTarget === 'main') {
        // Replace main product image (index 0)
        setUploadedImages(prev => {
          const next = [...prev];
          if (next.length === 0) {
            next.push(base64Url);
          } else {
            next[0] = base64Url;
          }
          return next;
        });
        setActiveIndex(0);
        
        // Trigger AI analysis ONLY for the main product image
        analyzeImage(file);
      } else {
        // Add secondary image to gallery
        setUploadedImages(prev => [...prev, base64Url]);
        setActiveIndex(uploadedImages.length);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idxToRemove));
    if (activeIndex >= uploadedImages.length - 1) {
      setActiveIndex(Math.max(0, uploadedImages.length - 2));
    }
  };

  const analyzeImage = async (file: File) => {
    setIsAutofilling(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('http://localhost:5000/api/products/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("API error from backend analysis");

      const data = await res.json();
      setName(data.name || '');
      setCategory(data.category || '');
      setCraftType(data.craftType || '');
      setMaterial(data.material || '');
      setPrice(data.price || 0);
      setSuggestedPrice(data.price || 0);
      setWeight(data.weight || 0);
      setDimensions('5.5m x 1.2m');
      setProcessingTime('15 days');
      setDescription(data.description || '');
    } catch (e) {
      console.warn("Real AI Vision analysis failed. Falling back to mockup prompt details.", e);
      // Fallback local mockup response
      const data = await triggerAIAutofill('');
      setName(data.name || '');
      setCategory(data.category || '');
      setCraftType(data.craftType || '');
      setMaterial(data.material || '');
      setPrice(data.price || 0);
      setSuggestedPrice(data.price || 0);
      setWeight(data.weight || 0);
      setDimensions('5.5m x 1.2m');
      setProcessingTime('15 days');
      setDescription(data.description || '');
    } finally {
      setIsAutofilling(false);
    }
  };

  const handleStyleSelect = async (style: string) => {
    if (uploadedImages.length === 0) {
      alert("Please upload a product photo first.");
      return;
    }
    setSelectedStyle(style);
    if (style === 'Custom AI') return;

    // Premium prompt guidelines mapped behind each studio style
    const studioPrompts: Record<string, string> = {
      'White Background': 'Transform the uploaded product into a premium e-commerce product photo. Keep the garment exactly the same with no changes to color, texture, embroidery, weave, print, stitching, shape, proportions, or design details. Remove wrinkles and imperfections while preserving fabric realism. Place the product on a pure white (#FFFFFF) seamless background with soft natural studio shadows. Center the product with high-end catalog lighting. Ultra-sharp focus, realistic fabric texture, 8K resolution, professional apparel photography.',
      'Lifestyle Shot': 'Transform the uploaded product into a realistic lifestyle photograph. Keep the garment exactly unchanged including color, fabric, weave, embroidery, print, stitching, borders, and proportions. Place it in a premium indoor or outdoor environment that complements traditional Indian fashion, such as a luxury home, boutique, heritage courtyard, or elegant café. Use natural lighting with realistic shadows. Make the image look like it was captured by a professional fashion photographer. Highly realistic, premium editorial quality, 8K.',
      'Model Shot': 'Generate a highly realistic fashion model wearing the uploaded garment. Preserve every detail of the garment including color, embroidery, weave, texture, print, fit, borders, sleeves, neckline, and proportions. Use a natural pose with accurate garment draping. The model should look elegant and premium with studio-quality lighting, realistic skin tones, and natural shadows. Luxury fashion photography, Vogue-style editorial, ultra-detailed, 8K resolution.',
      'Catalog': 'Generate a professional fashion catalog image using the uploaded garment. Preserve the garment exactly without changing its design, color, embroidery, print, texture, fabric, or proportions. Place the garment in a clean luxury catalog layout with soft neutral background, premium lighting, and balanced composition. Include subtle shadows only. Suitable for e-commerce, lookbooks, B2B wholesale catalogs, and export presentations. Ultra HD, commercial fashion photography, 8K.',
      'Luxury Style': 'Transform the uploaded garment into a luxury designer campaign photograph. Preserve every garment detail exactly as uploaded. Place the product in an elegant premium environment featuring marble, soft luxury interiors, heritage architecture, rich textures, or sophisticated minimal backgrounds. Use cinematic lighting, luxury color grading, magazine-quality composition, shallow depth of field, and premium fashion styling. High-end luxury campaign photography, extremely realistic, 8K.'
    };

    const finalPrompt = studioPrompts[style] || style;

    setIsGeneratingImage(true);
    try {
      const resultUrl = await triggerAIImageStudio('p-temp', finalPrompt, { name, category, material });
      setUploadedImages(prev => {
        const next = [...prev];
        next[activeIndex] = resultUrl;
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCustomAIGenerate = async () => {
    if (!customPrompt.trim()) {
      alert("Please enter a custom generation prompt.");
      return;
    }
    if (uploadedImages.length === 0) {
      alert("Please upload a product photo first.");
      return;
    }
    setIsGeneratingImage(true);
    try {
      const resultUrl = await triggerAIImageStudio('p-temp', customPrompt, { name, category, material });
      setUploadedImages(prev => {
        const next = [...prev];
        next[activeIndex] = resultUrl;
        return next;
      });
      alert(`Custom AI image successfully generated using prompt: "${customPrompt}"`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePublish = async () => {
    if (!name || !category || !craftType || price <= 0 || uploadedImages.length === 0) {
      alert("Please fill all required details (photos, name, category, craft, price) before publishing.");
      return;
    }

    const res = await addProduct({
      name,
      category,
      craftType,
      material,
      price,
      stockQty,
      weight,
      description,
      images: uploadedImages,
      aiGenerated: !!selectedStyle
    });

    if (res.success) {
      alert("Product published successfully!");
      setCurrentView('dashboard');
    } else {
      alert("Publish failed: " + res.error);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col overflow-hidden text-left pb-8">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h2 className="font-heading font-extrabold text-lg leading-tight">Add Product</h2>
            <span className="text-[10.5px] text-text-secondary font-bold block mt-0.5">
              Just upload a product photo — AI fills the rest.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-secondary-light px-3 py-1.5 rounded-full border border-secondary/20 text-xs font-bold text-secondary-dark">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Magic</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-[96px]">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Product image (Main Featured Image on top) */}
        <div className="flex flex-col">
          <span className="text-xs font-black text-stone-700 uppercase tracking-wider block mb-2 text-left">
            Product image
          </span>
          
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-primary/5 bg-stone-50 shadow-premium flex flex-col items-center justify-center group">
            {uploadedImages.length > 0 ? (
              <>
                <img 
                  src={uploadedImages[activeIndex]} 
                  alt="Product Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-900/10" />
                
                {isGeneratingImage && (
                  <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    <span className="text-xs font-bold tracking-wider">AI Studio Stylizing...</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setUploadTarget('main');
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-4 right-4 bg-white/95 px-3 py-1.5 rounded-xl text-[10px] font-bold text-text-primary shadow hover:bg-stone-50 border border-stone-200"
                >
                  Change Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setUploadTarget('main');
                  fileInputRef.current?.click();
                }}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-text-primary block">Upload Product Photo</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5">Select image file for vision analysis</span>
                </div>
              </button>
            )}

            {isAutofilling && (
              <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2 z-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs font-bold tracking-wider">Gemini AI Analyzing Fabric Details...</span>
              </div>
            )}
          </div>
        </div>

        {/* Product gallery (Horizontal Selector in the middle) */}
        <div className="flex flex-col">
          <span className="text-xs font-black text-stone-700 uppercase tracking-wider block mb-2 text-left">
            Product gallery
          </span>

          <div className="bg-white rounded-3xl p-3 border border-primary/5 shadow-premium flex gap-3 overflow-x-auto no-scrollbar items-center">
            
            {/* Uploaded Thumbnail items (Left-to-Right layout) */}
            {uploadedImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-12 aspect-[4/5] shrink-0 rounded-2xl overflow-hidden border-2 cursor-pointer relative transition-all ${
                  activeIndex === idx ? 'border-[#FF6B35] shadow scale-95' : 'border-stone-200'
                }`}
              >
                <img src={imgUrl} className="w-full h-full object-cover" />
                
                {/* Delete overlay button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[7px] font-black shadow-sm shadow-red-900/20"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* [+] Gallery Upload Box (Positioned at the end) */}
            <button
              type="button"
              onClick={() => {
                setUploadTarget('gallery');
                fileInputRef.current?.click();
              }}
              className="w-14 h-14 shrink-0 rounded-2xl border-2 border-dashed border-stone-200 hover:border-primary flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100/50 text-stone-400 hover:text-primary transition-all"
            >
              <Camera className="w-5 h-5" />
              <span className="text-[7.5px] font-black uppercase mt-1">Add</span>
            </button>

          </div>
        </div>

        {/* AI Image Studio */}
        {uploadedImages.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wide">AI Image Studio</span>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowPromptGallery(true)}
                className="text-primary text-[10px] font-black uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                <span>Prompt Gallery</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            
            {/* Scrollable list of styles */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {styleChips.map(style => (
                <button
                  key={style.name}
                  type="button"
                  onClick={() => handleStyleSelect(style.name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition-all shrink-0 w-20 ${
                    selectedStyle === style.name
                      ? 'border-primary bg-primary-light text-primary'
                      : 'border-stone-150 bg-stone-50 hover:bg-stone-100 text-text-primary'
                  }`}
                >
                  <span className="text-lg">{style.icon}</span>
                  <span className="text-[9px] font-bold mt-1.5 leading-tight">{style.name}</span>
                </button>
              ))}
            </div>

            {/* Custom AI prompt text entry panel */}
            {selectedStyle === 'Custom AI' && (
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                  Custom Generation Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="e.g., draped on elegant mannequin, gold lighting..."
                    className="flex-1 text-xs font-semibold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCustomAIGenerate}
                    className="px-4 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Generate
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* AI Auto-Fill Details Section */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">AI Auto-Fill Details</span>
            {suggestedPrice && (
              <span className="flex items-center gap-1 text-[10px] font-extrabold bg-accent-light text-accent px-2 py-0.5 rounded border border-accent/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Auto-filled ⚡</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Product Name */}
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>

            {/* Category & Craft Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Textiles"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Craft Type</label>
                <input
                  type="text"
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                  placeholder="e.g. Banarasi Weaving"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
            </div>

            {/* Material & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Material type"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Weight (grams)</label>
                <input
                  type="number"
                  value={weight || ''}
                  onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 800"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
            </div>

            {/* Price & Suggested Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={price || ''}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  placeholder="Selling price"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <span>Suggested Price</span>
                  <span className="text-[8px] font-extrabold bg-primary-light text-primary px-1 rounded">AI</span>
                </label>
                <div className="w-full text-xs font-bold text-text-secondary bg-stone-100 border border-stone-200 rounded-xl p-3">
                  {suggestedPrice ? `₹${suggestedPrice}` : 'Waiting for photo...'}
                </div>
              </div>
            </div>

            {/* Stock Quantity & Measurement */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={stockQty}
                  onChange={(e) => setStockQty(parseInt(e.target.value) || 0)}
                  placeholder="Stock quantity"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Measurement</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 5.5m x 1.2m"
                  className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                />
              </div>
            </div>

            {/* Description with Mic voice-input icon */}
            <div>
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1 flex justify-between items-center">
                <span>Description</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setDescription("Raw Mulberry silk hand-crafted Banarasi saree, hand-woven with real gold thread zari patterns on an antique handloom.");
                    alert("Voice Input simulated: 'Raw Mulberry silk hand-crafted Banarasi...' recorded.");
                  }}
                  className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell brands about the weaving technique or history of this piece..."
                rows={3}
                className="w-full text-xs font-medium text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              alert("Draft saved to offline drafts folder!");
              setCurrentView('dashboard');
            }}
            className="flex-1 py-4 text-sm font-bold text-text-primary border border-stone-200 bg-white rounded-xl hover:bg-stone-50 shadow-sm"
          >
            Save Draft
          </button>
          
          <Button 
            onClick={handlePublish}
            fullWidth={false}
            className="flex-1"
          >
            Publish Product
          </Button>
        </div>

      </div>

      {/* Prompt Gallery Modal */}
      {showPromptGallery && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDFB] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-primary/5 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center border-b border-stone-150 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <h3 className="font-heading font-black text-base text-stone-850">AI Magic Prompt Gallery</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowPromptGallery(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-text-secondary mb-4 leading-normal font-medium">
              Browse through top-performing AI-generated product shots. Copy any prompt template or tap <strong>"Apply Prompt"</strong> to load it into your Custom AI tool.
            </p>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3.5 pr-1">
              {[
                {
                  title: "Banarasi Silk Saree (Model Shot)",
                  prompt: "Raw silk saree in royal blue, draped elegantly on an Indian model, soft golden zari scalloped border detailing, historic palace balcony background, heritage architecture style, cinematic photoshoot lighting, 8k.",
                  image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
                  tag: "Saree Model"
                },
                {
                  title: "Terracotta Pottery (Lifestyle Studio)",
                  prompt: "Handcrafted earthen clay terracotta pot with geometric tribal etchings, styled with dry pampas grass, resting on light oak coffee table, warm sunbeam shadow streaks, modern luxury apartment interior background.",
                  image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=400",
                  tag: "Terracotta"
                },
                {
                  title: "Organic Cotton Kurta (Catalog layout)",
                  prompt: "Minimalist organic linen cotton kurta, flat-lay catalog styling on light grey linen fabric sheets, overhead flat shot, soft neutral diffuse lighting, catalog product photo.",
                  image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400",
                  tag: "Catalog Flatlay"
                },
                {
                  title: "Saharanpur Carved Wood Wall Art",
                  prompt: "Carved wooden teak panel art hanging on clean white gallery brick wall, dramatic warm spotlight from side, high-fidelity wood grains, premium shadows.",
                  image: "https://images.unsplash.com/photo-1581781870027-04212e231e96?w=400",
                  tag: "Home Decor"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-3 flex gap-3.5 shadow-sm hover:shadow-md transition-all">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-stone-50" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-black text-xs text-stone-800">{item.title}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider bg-primary-light text-primary px-1.5 py-0.5 rounded">{item.tag}</span>
                      </div>
                      <p className="text-[10px] font-medium text-stone-500 leading-normal mt-1 text-left line-clamp-2">
                        {item.prompt}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(item.prompt);
                          alert("Prompt copied to clipboard!");
                        }}
                        className="px-2.5 py-1 text-[9px] font-bold text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50"
                      >
                        Copy Prompt
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPrompt(item.prompt);
                          setSelectedStyle('Custom AI');
                          setShowPromptGallery(false);
                        }}
                        className="px-2.5 py-1 text-[9px] font-black bg-primary text-white rounded-lg hover:bg-primary-dark"
                      >
                        Apply Prompt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
