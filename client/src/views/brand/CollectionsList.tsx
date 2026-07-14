import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Plus, Folder, Eye, EyeOff, Trash2, 
  Edit3, CheckCircle, AlertTriangle, Layers, ChevronDown, ChevronUp
} from 'lucide-react';

export const CollectionsList: React.FC = () => {
  const { setCurrentView, products } = useApp();

  // Mock initial collections in store
  const [collections, setCollections] = useState([
    { id: 'col-1', name: 'new-arrivals', label: 'New Arrivals', visibility: 'Published', widgetStatus: 'active', productCount: 4 },
    { id: 'col-2', name: 'sarees', label: 'Sarees', visibility: 'Published', widgetStatus: 'active', productCount: 3 },
    { id: 'col-3', name: 'festive', label: 'Festive Collection', visibility: 'Published', widgetStatus: 'active', productCount: 2 },
    { id: 'col-4', name: 'handloom', label: 'Handloom Specialties', visibility: 'Draft', widgetStatus: 'inactive', productCount: 0 }
  ]);

  // Mock mapping state for products in collections
  const [mappings, setMappings] = useState([
    { id: 'cp-1', collectionId: 'col-3', productId: 'p-1', status: 'Published' },
    { id: 'cp-2', collectionId: 'col-3', productId: 'p-2', status: 'Published' },
    { id: 'cp-3', collectionId: 'col-2', productId: 'p-1', status: 'Published' },
    { id: 'cp-4', collectionId: 'col-2', productId: 'p-2', status: 'Draft' },
    { id: 'cp-5', collectionId: 'col-2', productId: 'p-3', status: 'Out of Stock' },
    { id: 'cp-6', collectionId: 'col-1', productId: 'p-1', status: 'Published' },
    { id: 'cp-7', collectionId: 'col-1', productId: 'p-2', status: 'Published' },
    { id: 'cp-8', collectionId: 'col-1', productId: 'p-3', status: 'Hidden' },
    { id: 'cp-9', collectionId: 'col-1', productId: 'p-4', status: 'Published' }
  ]);

  const [expandedCol, setExpandedCol] = useState<string | null>('col-3');

  const handleCreateCollection = () => {
    const name = prompt("Enter new collection name:");
    if (name) {
      const newCol = {
        id: 'col-' + (collections.length + 1),
        name: name.toLowerCase().replace(/\s+/g, '-'),
        label: name,
        visibility: 'Published',
        widgetStatus: 'active',
        productCount: 0
      };
      setCollections(prev => [...prev, newCol]);
      alert(`Collection "${name}" created successfully!`);
    }
  };

  const handleUpdateStatus = (mappingId: string, nextStatus: string) => {
    setMappings(prev => prev.map(m => m.id === mappingId ? { ...m, status: nextStatus } : m));
    alert(`Status updated to ${nextStatus.toUpperCase()}`);
  };

  const handleUnsync = (mappingId: string, name: string) => {
    if (window.confirm(`Are you sure you want to unsync "${name}" from this collection? it will no longer display in this collection on your website.`)) {
      setMappings(prev => prev.filter(m => m.id !== mappingId));
      alert("Product unsynced successfully.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Draft':
        return 'bg-stone-50 text-stone-500 border-stone-200';
      case 'Out of Stock':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Hidden':
        return 'bg-red-50 text-red-500 border-red-200';
      default:
        return 'bg-stone-50 text-stone-600';
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFF8F1] pb-16 text-left select-none">
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shadow-sm shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm animate-press"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h2 className="font-heading font-black text-lg text-stone-850">Collections</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Organize and visibility-filter storefront feeds
            </span>
          </div>
        </div>

        {/* Create Collection FAB */}
        <button 
          onClick={handleCreateCollection}
          className="w-8 h-8 rounded-full bg-[#FF6B35] hover:bg-[#E55A25] text-white flex items-center justify-center shadow transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar pb-24">
        
        {/* Collection Lists */}
        <div className="flex flex-col gap-4">
          {collections.map((col) => {
            const isExpanded = expandedCol === col.id;
            const colProducts = mappings
              .filter(m => m.collectionId === col.id)
              .map(m => {
                const prod = products.find(p => p.id === m.productId);
                return prod ? { ...prod, mappingId: m.id, syncStatus: m.status } : null;
              })
              .filter(Boolean);

            return (
              <Card 
                key={col.id} 
                padding="none" 
                className="bg-white rounded-3xl border border-primary/5 shadow-premium overflow-hidden transition-all"
              >
                {/* Collection Summary Row header */}
                <div 
                  onClick={() => setExpandedCol(isExpanded ? null : col.id)}
                  className="p-5 flex justify-between items-center cursor-pointer select-none border-b border-stone-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-primary">
                      <Folder className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 leading-tight">{col.label}</h4>
                      <span className="text-[9px] text-text-secondary font-bold block mt-1 uppercase tracking-wider">
                        {colProducts.length} {colProducts.length === 1 ? 'Product' : 'Products'} • Visibility: {col.visibility}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Widget active status */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                      col.widgetStatus === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-stone-50 text-stone-400 border-stone-100'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${col.widgetStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-stone-400'}`} />
                      <span>{col.widgetStatus === 'active' ? 'Widget Active' : 'Widget Offline'}</span>
                    </span>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </div>
                </div>

                {/* Collapsible products list */}
                {isExpanded && (
                  <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex flex-col gap-3">
                    {colProducts.map((p: any) => (
                      <div 
                        key={p.mappingId} 
                        className="bg-white rounded-2xl p-3 border border-stone-150 flex items-center justify-between gap-3 shadow-sm"
                      >
                        {/* Thumbnail image and basic product info */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-black text-stone-850 truncate">{p.name}</h5>
                            <span className="text-[9px] text-text-secondary block mt-0.5">SKU: {p.sku}</span>
                            
                            {/* Interactive status selector */}
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 text-[8px] font-black rounded border ${getStatusBadge(p.syncStatus)}`}>
                                {p.syncStatus}
                              </span>
                              
                              <select
                                value={p.syncStatus}
                                onChange={(e) => handleUpdateStatus(p.mappingId, e.target.value)}
                                className="text-[8px] font-extrabold bg-stone-100 border border-stone-200 rounded px-1 py-0.5 focus:outline-none"
                              >
                                <option value="Published">Publish</option>
                                <option value="Draft">Draft</option>
                                <option value="Out of Stock">Out of Stock</option>
                                <option value="Hidden">Hide</option>
                              </select>
                            </div>

                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit button */}
                          <button
                            onClick={() => setCurrentView('review-product')}
                            className="w-8 h-8 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 flex items-center justify-center transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Unsync button */}
                          <button
                            onClick={() => handleUnsync(p.mappingId, p.name)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    ))}

                    {colProducts.length === 0 && (
                      <div className="text-center py-8 bg-white border border-dashed border-stone-200 rounded-2xl flex flex-col items-center gap-1 text-stone-400">
                        <Layers className="w-7 h-7" />
                        <span className="text-[10px] font-bold">No products in this collection yet.</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </div>

    </div>
  );
};
