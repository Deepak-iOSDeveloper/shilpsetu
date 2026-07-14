import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, ChevronRight, Sparkles, User, Image, 
  Layers, Crop, LayoutGrid, Loader2, ArrowRight 
} from 'lucide-react';

export const AIImageStudio: React.FC = () => {
  const { triggerAIImageStudio, products, setCurrentView } = useApp();

  const product = products[0]; // mock target product: Banarasi Silk Saree

  const [photoUrl, setPhotoUrl] = useState<string>(product.images[0]);
  const [originalPhoto] = useState<string>(product.images[0]);
  const [activeTab, setActiveTab] = useState<'enhanced' | 'original'>('enhanced');
  const [stylizing, setStylizing] = useState(false);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);

  const styleOptions = [
    { id: 'Model Shot', label: 'AI Model Shoot', desc: 'Drape this fabric on a photorealistic digital model', icon: User, theme: 'primary' as const },
    { id: 'Lifestyle Shot', label: 'Lifestyle Shot', desc: 'Place item in a staged boutique scene', icon: Image, theme: 'secondary' as const },
    { id: 'White Background', label: 'Remove Background', desc: 'Isolate product on a catalog-clean studio background', icon: Crop, theme: 'accent' as const },
    { id: 'Catalog', label: 'Generate Banner', desc: 'Create landscape promotional banners for store sales', icon: LayoutGrid, theme: 'blue' as const }
  ];

  const handleStyleSelect = async (styleId: string) => {
    setActiveStyle(styleId);
    setStylizing(true);
    try {
      const enhancedUrl = await triggerAIImageStudio(product.id, styleId);
      setPhotoUrl(enhancedUrl);
      setActiveTab('enhanced');
    } catch (e) {
      console.error(e);
    } finally {
      setStylizing(false);
    }
  };

  const handleSave = () => {
    alert("Enhanced product images saved to catalog collection!");
    setCurrentView('review-product');
  };

  return (
    <div className="flex-1 flex flex-col pb-8">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('inventory-sync')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <h2 className="font-heading font-extrabold text-lg">AI Image Studio</h2>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6">
        
        {/* Dynamic before/after photo preview frame */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-stone-50 border border-primary/5 shadow-premium">
          <img 
            src={activeTab === 'enhanced' ? photoUrl : originalPhoto} 
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {stylizing && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              <span className="text-xs font-bold tracking-wider">AI Studio Regenerating...</span>
            </div>
          )}

          {/* Toggle pill */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-1 rounded-full border border-stone-200 flex shadow-lg">
            <button
              onClick={() => setActiveTab('original')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-bold text-center transition-all ${
                activeTab === 'original' ? 'bg-stone-850 text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Original Source
            </button>
            <button
              onClick={() => setActiveTab('enhanced')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-bold text-center transition-all ${
                activeTab === 'enhanced' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              AI-Enhanced Preview
            </button>
          </div>
        </div>

        {/* Action Rows */}
        <div className="bg-white rounded-3xl p-5 border border-primary/5 shadow-premium flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
            <span className="text-xs font-bold text-text-primary uppercase tracking-wide">Enhancement Layer Studio</span>
          </div>

          <div className="flex flex-col gap-1">
            {styleOptions.map(option => {
              const Icon = option.icon;
              const isSelected = activeStyle === option.id;

              // Color tints
              const colors = {
                primary: 'bg-primary/10 text-primary',
                secondary: 'bg-secondary/15 text-secondary-dark',
                accent: 'bg-accent/10 text-accent',
                blue: 'bg-blue-500/10 text-blue-600'
              };
              
              const tint = colors[option.theme] || colors.primary;

              return (
                <button
                  key={option.id}
                  onClick={() => handleStyleSelect(option.id)}
                  className={`flex items-center justify-between p-3.5 hover:bg-stone-50 transition-all rounded-2xl border ${
                    isSelected ? 'border-primary bg-primary-light' : 'border-transparent'
                  }`}
                >
                  <div className="flex gap-3 items-center text-left">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
                      <Icon className="w-4.5 h-4.5" strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-text-primary block">{option.label}</span>
                      <span className="text-[9px] text-text-secondary leading-normal block mt-0.5 max-w-[220px]">{option.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer product metadata card */}
        <Card padding="sm" className="border border-stone-150 flex items-center gap-3 bg-stone-50">
          <img src={originalPhoto} className="w-12 h-12 rounded-xl object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-extrabold text-text-primary truncate">{product.name}</h4>
            <span className="text-[10px] text-text-secondary">Vendor: Ramesh Kumar (Varanasi, UP)</span>
          </div>
        </Card>

        {/* Save button */}
        <Button onClick={handleSave}>
          <span className="flex items-center gap-2">
            <span>Save Image & Continue</span>
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>

      </div>
    </div>
  );
};
