import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { StatusPill } from '../../components/StatusPill';
import { 
  ChevronLeft, Package, Search, Plus, 
  Upload, ChevronRight, AlertCircle, Edit3, Save, X, Camera
} from 'lucide-react';
import { Product } from '../../types';

export const InventoryList: React.FC = () => {
  const { products, updateProductStock, updateProduct, setCurrentView } = useApp();
  const [search, setSearch] = useState('');

  // Selected product states for detail & edit views
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStockQty, setEditStockQty] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('');
  const [editCraftType, setEditCraftType] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.craftType.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockClick = (id: string, currentQty: number) => {
    const nextStr = prompt(`Update stock quantity:`, String(currentQty));
    if (nextStr !== null) {
      const nextQty = parseInt(nextStr);
      if (!isNaN(nextQty)) {
        updateProductStock(id, nextQty);
        // Sync active selection stock if viewing details
        if (selectedProduct && selectedProduct.id === id) {
          setSelectedProduct(prev => prev ? { ...prev, stockQty: nextQty } : null);
        }
      }
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStockQty(product.stockQty);
    setEditCategory(product.category);
    setEditCraftType(product.craftType);
    setEditSku(product.sku);
    setEditDescription(product.description || '');
    setEditImage(product.images[0] || '');
  };

  const handleSaveProduct = () => {
    if (!editName.trim()) {
      alert("Product Name cannot be empty.");
      return;
    }
    if (!editSku.trim()) {
      alert("SKU cannot be empty.");
      return;
    }
    if (editPrice <= 0) {
      alert("Price must be greater than zero.");
      return;
    }

    updateProduct(selectedProduct!.id, {
      name: editName,
      price: editPrice,
      stockQty: editStockQty,
      category: editCategory,
      craftType: editCraftType,
      sku: editSku,
      description: editDescription,
      images: [editImage]
    });

    // Update active selected product with edited fields
    setSelectedProduct(prev => prev ? {
      ...prev,
      name: editName,
      price: editPrice,
      stockQty: editStockQty,
      category: editCategory,
      craftType: editCraftType,
      sku: editSku,
      description: editDescription,
      images: [editImage]
    } : null);

    setIsEditing(false);
    alert("Product details updated successfully!");
  };

  // ==========================================
  // RENDER EDIT VIEW
  // ==========================================
  if (selectedProduct && isEditing) {
    return (
      <div className="absolute inset-0 bg-[#FFFBF9] flex flex-col z-10 text-left">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
            <h2 className="font-heading font-black text-base text-stone-850">Edit Product Details</h2>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="p-6 flex-1 overflow-y-auto max-w-md mx-auto w-full no-scrollbar pb-24">
          
          {/* Product Image Edit Option */}
          <div className="flex flex-col gap-1.5 items-center mb-2">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block self-start">Product Image *</span>
            <div className="relative w-24 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 group shadow-sm">
              <img 
                src={editImage || 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400'} 
                alt="Product edit thumbnail" 
                className="w-full h-full object-cover" 
              />
              {/* Hidden File Input */}
              <input
                type="file"
                id="product-edit-image-file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const result = event.target?.result as string;
                      if (result) {
                        setEditImage(result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label 
                htmlFor="product-edit-image-file"
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold gap-1"
              >
                <Camera className="w-5 h-5 text-white" />
                <span>Change Image</span>
              </label>
            </div>
            <label 
              htmlFor="product-edit-image-file"
              className="text-[10px] font-bold text-[#FF511A] hover:underline cursor-pointer"
            >
              Choose new image...
            </label>
          </div>
          
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Product Name *</label>
            <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Product Name"
                className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
              />
            </div>
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">SKU *</label>
            <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
              <input
                type="text"
                value={editSku}
                onChange={(e) => setEditSku(e.target.value)}
                placeholder="SKU Code"
                className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Price (₹) *</label>
              <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                <span className="text-stone-400 text-xs font-bold mr-1">₹</span>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Stock Quantity *</label>
              <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                <input
                  type="number"
                  value={editStockQty}
                  onChange={(e) => setEditStockQty(parseInt(e.target.value) || 0)}
                  placeholder="Stock"
                  className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Craft Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Category *</label>
              <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Craft Type *</label>
              <div className="flex items-center bg-stone-50/50 border border-stone-200 rounded-2xl h-11 px-3.5 focus-within:border-[#FF511A] focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={editCraftType}
                  onChange={(e) => setEditCraftType(e.target.value)}
                  placeholder="Craft Type"
                  className="w-full bg-transparent text-[11px] font-bold text-stone-850 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Provide a product description details..."
              className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl p-3 text-[11px] font-semibold text-stone-850 focus:outline-none focus:border-[#FF511A] h-28 resize-none"
              maxLength={400}
            />
          </div>

          <div className="flex gap-3 pt-3 mb-8">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3.5 text-xs font-black text-stone-750 border border-stone-200 bg-white rounded-2xl hover:bg-stone-50 transition-all text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProduct}
              className="flex-1 py-3.5 bg-[#FF511A] hover:bg-[#E04413] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF511A]/10 active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER DETAIL VIEW
  // ==========================================
  if (selectedProduct && !isEditing) {
    return (
      <div className="absolute inset-0 bg-[#FFFBF9] flex flex-col z-10 text-left">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-stone-700" />
            </button>
            <h2 className="font-heading font-black text-base text-stone-850">Product Details</h2>
          </div>
        </div>

        {/* Scrollable details block */}
        <div className="p-6 flex-1 overflow-y-auto max-w-md mx-auto w-full no-scrollbar pb-24">
          
          {/* Main image banner */}
          <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-stone-100 border border-stone-200 shadow-md">
            <img 
              src={selectedProduct.images[0]} 
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details specs */}
          <div className="bg-white border border-stone-150 rounded-[28px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-3.5">
            <div className="flex justify-between items-start gap-3">
              <h3 className="font-heading font-black text-base text-stone-850 leading-snug">{selectedProduct.name}</h3>
              <StatusPill status={selectedProduct.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-3.5 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">SKU Code</span>
                <span className="font-extrabold text-stone-800">{selectedProduct.sku}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Price</span>
                <span className="font-extrabold text-[#FF511A]">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Category</span>
                <span className="font-extrabold text-stone-800">{selectedProduct.category}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Craft Type</span>
                <span className="font-extrabold text-stone-800">{selectedProduct.craftType}</span>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-3.5 flex items-center justify-between">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">Stock Status</span>
              <button
                onClick={() => handleStockClick(selectedProduct.id, selectedProduct.stockQty)}
                className="flex items-center gap-1.5 bg-[#FFF5F2] hover:bg-[#FFEAE5] px-3 py-1.5 rounded-xl text-[10px] font-black text-[#FF511A] transition-all border border-[#FF511A]/20"
              >
                <Package className="w-3.5 h-3.5 text-[#FF511A]" />
                <span>Qty: {selectedProduct.stockQty} pcs (Edit)</span>
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Description</span>
            <div className="bg-white border border-stone-150 rounded-[24px] p-4 text-xs text-stone-600 font-semibold leading-relaxed shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              {selectedProduct.description || "No description provided for this product."}
            </div>
          </div>

          {/* Edit Button at the end */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-2 mb-8 py-4 bg-[#FF511A] hover:bg-[#E04413] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF511A]/10 active:scale-98"
          >
            <Edit3 className="w-4.5 h-4.5" />
            <span>Edit Product</span>
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // DEFAULT PRODUCT LIST VIEW
  // ==========================================
  return (
    <div className="absolute inset-0 bg-[#FFFBF9] flex flex-col z-10 text-left">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <h2 className="font-heading font-black text-base text-stone-850">My Products</h2>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar pb-[148px] flex flex-col gap-5">
        {/* Search bar */}
        <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-sm flex items-center gap-2">
          <Search className="w-5 h-5 text-stone-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU or craft type..."
            className="w-full text-xs font-medium text-stone-800 placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
          />
        </div>

        {/* Products Row Checklist */}
        <div className="flex flex-col gap-3">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => handleOpenProduct(product)}
              className="cursor-pointer active:scale-[0.99] transition-all"
            >
              <Card 
                padding="sm"
                className="flex items-center gap-3 border border-stone-150 hover:border-stone-250 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              >
                {/* Product Photo */}
                <div className="w-14 aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="text-xs font-bold text-stone-800 truncate">{product.name}</h4>
                    <StatusPill status={product.status} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1 font-bold">
                    <span>SKU: {product.sku}</span>
                    <span className="text-[#FF511A] font-black">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {/* Stock editor pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening details
                      handleStockClick(product.id, product.stockQty);
                    }}
                    className="mt-1.5 flex items-center gap-1.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 px-2 py-1 rounded-lg text-[9px] font-bold text-stone-500 transition-all"
                  >
                    <Package className="w-3.5 h-3.5 text-stone-400" />
                    <span>Stock: <span className="text-[#FF511A] font-black">{product.stockQty} pcs</span> (Tap to edit)</span>
                  </button>
                </div>

                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </Card>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center gap-2 bg-white rounded-3xl border border-stone-150">
              <AlertCircle className="w-10 h-10 text-stone-300" />
              <span className="text-xs font-bold text-stone-500">No products found matching your search.</span>
            </div>
          )}
        </div>

        {/* CSV Bulk Upload CTA */}
        <div className="absolute bottom-[68px] left-0 right-0 z-40 bg-[#FFFBF9]/95 backdrop-blur-xs px-6 py-4 border-t border-stone-150/60 grid grid-cols-2 gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setCurrentView('add-product')}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl border border-stone-350 text-xs font-black text-stone-750 bg-white hover:bg-stone-50 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => {
              alert("CSV Bulk Upload simulated: Selected mock CSV file, parsed and added 12 products.");
            }}
            className="flex items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-[#FF511A] text-white text-xs font-black hover:bg-[#E04413] transition-all shadow-md shadow-[#FF511A]/10"
          >
            <Upload className="w-4 h-4" />
            <span>Add Bulk Product</span>
          </button>
        </div>

      </div>
    </div>
  );
};
