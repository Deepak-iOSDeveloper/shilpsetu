import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Search, Filter, RefreshCw, MapPin, 
  Heart, MessageSquare, Bookmark, Plus, ChevronRight, 
  Bell, Share2, MoreVertical, LayoutGrid, Award, Image,
  ShoppingBag, Trash2
} from 'lucide-react';

const getDynamicMOQ = (price: number, id: string) => {
  const charCodeSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const base = charCodeSum % 3;
  if (price > 15000) return 2 + (base % 2);  // 2 or 3
  if (price > 8000) return 4 + (base % 2);   // 4 or 5
  if (price > 4000) return 6 + base;        // 6, 7, or 8
  return 10 + base;                         // 10, 11, or 12
};

export const InventorySync: React.FC = () => {
  const { 
    currentView, setCurrentView, products, syncProductToBrand, 
    portfolioPosts, wallets, rechargeWallet, placeDirectOrder, currentUser 
  } = useApp();
  
  // Toggle between: 'synced' (View Synced) and 'explorer' (Sync Now Explorer)
  const [subView, setSubView] = useState<'synced' | 'explorer'>('explorer');

  useEffect(() => {
    if (currentView === 'inventory-sync-viewed') {
      setSubView('synced');
    } else if (currentView === 'inventory-sync') {
      setSubView('explorer');
    }
  }, [currentView]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreTab, setExploreTab] = useState<'products' | 'portfolio' | 'following'>('products');

  // Cart state for Brand Explore page
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);

  // Checkout and Address modal states
  const [checkoutProduct, setCheckoutProduct] = useState<any | null>(null);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'netbanking'>('wallet');
  const [checkoutQty, setCheckoutQty] = useState(0);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Collections state management (for Add to Collection action overlay)
  const [collections, setCollections] = useState([
    { id: 'col-1', label: 'New Arrivals', productCount: 4 },
    { id: 'col-2', label: 'Summer Linen Classics', productCount: 3 },
    { id: 'col-3', label: 'Festive Wear 2026', productCount: 2 },
    { id: 'col-4', label: 'Handloom Heritage Sarees', productCount: 0 }
  ]);
  const [addToColProduct, setAddToColProduct] = useState<any | null>(null);
  const [selectedColIds, setSelectedColIds] = useState<string[]>([]);
  const [newColName, setNewColName] = useState('');
  const [colSuccessMessage, setColSuccessMessage] = useState<string | null>(null);

  // Comments thread state management
  const [newCommentText, setNewCommentText] = useState('');
  const [productComments, setProductComments] = useState<Record<string, any[]>>({
    'exp-1': [
      { id: 1, author: 'Anita Handloom', text: 'Beautiful Kadwa weave! Authentic Varanasi craft.', timestamp: '2h ago', avatarChar: 'A', avatarBg: 'bg-emerald-600' },
      { id: 2, author: 'Saurabh Sourcing', text: 'Quality feels top notch. Checked samples yesterday.', timestamp: '1d ago', avatarChar: 'S', avatarBg: 'bg-indigo-600' }
    ],
    'exp-2': [
      { id: 1, author: 'CraftsVilla India', text: 'Peacock pattern is extremely fine. Love the zari weight.', timestamp: '4h ago', avatarChar: 'C', avatarBg: 'bg-rose-600' }
    ]
  });

  // Instagram double-tap-to-like & follow states
  const [likedItemIds, setLikedItemIds] = useState<string[]>([]);
  const [showHeartPop, setShowHeartPop] = useState<string | null>(null);
  const [expandedCommentProductId, setExpandedCommentProductId] = useState<string | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [followedArtisans, setFollowedArtisans] = useState<string[]>(['Kavita Sharma']);
  const [activeOptionsProductId, setActiveOptionsProductId] = useState<string | null>(null);
  const [hiddenProductIds, setHiddenProductIds] = useState<string[]>([]);
  const [instaPostProduct, setInstaPostProduct] = useState<any | null>(null);

  // Local synced products list state to simulate store linking in real time
  const [syncedIds, setSyncedIds] = useState<string[]>(['p-1', 'p-2']);

  // Artisan profile overlay states
  const [selectedArtisan, setSelectedArtisan] = useState<{
    name: string;
    avatarBg: string;
    avatarChar: string;
    location: string;
    rating: number;
    followers: string;
    productsCount: number;
    bio: string;
    isFollowing: boolean;
  } | null>(null);
  const [artisanProfileTab, setArtisanProfileTab] = useState<'products' | 'gallery'>('products');
  const [previewGalleryItem, setPreviewGalleryItem] = useState<{
    title: string;
    image: string;
    description: string;
    category: string;
  } | null>(null);

  const getArtisanGalleryItems = (name: string) => {
    if (name.includes("Kavita")) {
      return [
        {
          title: "National Craft Award 2024",
          category: "Award",
          image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300",
          description: "Awarded by the Ministry of Textiles for exceptional skill in Kadwa weaving on mulberry silk."
        },
        {
          title: "Handloom Mark Certified",
          category: "Verification",
          image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300",
          description: "Official Handloom Mark Registry certificate validating authenticity of pure handloom products."
        },
        {
          title: "Traditional Jacquard Setup",
          category: "BTS",
          image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=300",
          description: "Setting up the complex card pattern deck on the loom, which defines the floral border details."
        },
        {
          title: "Organic Dye Preparation",
          category: "BTS",
          image: "https://images.unsplash.com/photo-1603006905393-af5c083652ea?w=300",
          description: "Boiling madder root and indigo powders to formulate chemical-free crimson dye."
        }
      ];
    }
    if (name.includes("Rahul")) {
      return [
        {
          title: "GI Authenticity Certificate",
          category: "Verification",
          image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300",
          description: "Geographical Indication Registry document validating authentic Paithani handcrafting."
        },
        {
          title: "Golden Zari Quality Test",
          category: "Verification",
          image: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=300",
          description: "Lab grade authentication verifying the metallic silver and gold threads have 98% pure silver core."
        },
        {
          title: "Weaving Shuttles BTS",
          category: "BTS",
          image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=300",
          description: "Rahul tracing pattern templates on graph paper before feeding instructions to warp strings."
        }
      ];
    }
    return [
      {
        title: "UNESCO Crafts Seal 2021",
        category: "Award",
        image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=300",
        description: "Awarded for keeping block printing methods 100% biodegradable and zero waste."
      },
      {
        title: "BTS Wood carving blocks",
        category: "BTS",
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=300",
        description: "Ramesh wood carving traditional floral patterns on dense teakwood block sets."
      },
      {
        title: "Dye Fixing Sun Drying",
        category: "BTS",
        image: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=300",
        description: "Hanging organically block printed mul cotton sheets to bake under intense sunlight for color fastening."
      }
    ];
  };

  const handleOpenArtisanProfile = (name: string, location: string, avatarBg: string, avatarChar: string) => {
    let bio = "Traditional handloom heritage artisan. Keeping family techniques alive.";
    let rating = 4.8;
    let followers = "1.2K";
    let productsCount = 8;

    if (name.includes("Kavita")) {
      bio = "🌸 Specializing in Kadwa Weave Banarasi silk sarees. National Master Weaver 2024. 100% organic mulberry silk.";
      rating = 4.9;
      followers = "1.8K";
      productsCount = 12;
    } else if (name.includes("Rahul")) {
      bio = "🎨 Paithani Silk Saree Weaver. Creating double pallu heritage masterworks with pure gold zari thread.";
      rating = 4.8;
      followers = "940";
      productsCount = 7;
    } else if (name.includes("Ramesh")) {
      bio = "🌾 Master artisan in block printing and handloom organic cotton fabric. UNESCO crafts seal awardee.";
      rating = 4.7;
      followers = "1.5K";
      productsCount = 10;
    }

    setSelectedArtisan({
      name,
      location,
      avatarBg,
      avatarChar,
      rating,
      followers,
      productsCount,
      bio,
      isFollowing: false
    });
    setArtisanProfileTab('products');
  };

  // Sync state parameters from App routing
  useEffect(() => {
    if (currentView === 'inventory-sync-viewed') {
      setSubView('synced');
    } else {
      setSubView('explorer');
    }
  }, [currentView]);

  const handleSyncToStore = (productId: string, name: string) => {
    const targetId = productId === 'exp-1' ? 'p-1' : (productId === 'exp-2' ? 'p-2' : productId);
    syncProductToBrand(targetId, 'brand-1');
    if (!syncedIds.includes(targetId)) {
      setSyncedIds(prev => [...prev, targetId]);
    }
    setCurrentView('review-product');
  };

  const handleBuyNow = (productItem: any) => {
    setCheckoutProduct(productItem);
    setCheckoutQty(productItem.moq || 6);
    setSelectedAddressIdx(0);
    setPaymentMethod('wallet');
    setCheckoutSuccess(false);
  };

  const handleAddToCart = (productItem: any) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === productItem.id);
      if (exists) {
        alert(`${productItem.name} is already in your cart! Quantity updated.`);
        return prev.map(item => item.id === productItem.id ? { ...item, qty: item.qty + 1 } : item);
      }
      alert(`${productItem.name} added to cart successfully!`);
      return [...prev, { ...productItem, qty: productItem.moq || 6 }];
    });
  };

  const handleOpenComments = (productItem: any) => {
    setExpandedCommentProductId(prev => prev === productItem.id ? null : productItem.id);
    setNewCommentText('');
  };

  const handlePostCommentInline = (productItem: any) => {
    if (!newCommentText.trim()) return;
    const commentId = Date.now();
    const newComment = {
      id: commentId,
      author: currentUser?.name || 'Ananya Goel (You)',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      avatarChar: (currentUser?.name || 'Ananya Goel').substring(0, 1).toUpperCase(),
      avatarBg: 'bg-primary text-white'
    };

    setProductComments(prev => {
      const pId = productItem.id;
      const existing = prev[pId] || Array.from({ length: Math.min(3, productItem.comments || 0) }).map((_, i) => ({
        id: `mock-${i}`,
        author: i === 0 ? 'Kavita Sharma (Artisan)' : i === 1 ? 'Rajesh Kumar (Sourcing)' : 'Sunita Handlooms',
        text: i === 0 ? 'Each weave takes about 3 days to perfect. Happy to answer questions!' : i === 1 ? 'Is the MOQ negotiable for custom colorways?' : 'We ordered 5 batches last week, excellent zari border finish.',
        timestamp: `${i + 1}d ago`,
        avatarChar: i === 0 ? 'K' : i === 1 ? 'R' : 'S',
        avatarBg: i === 0 ? 'bg-purple-600' : i === 1 ? 'bg-indigo-600' : 'bg-rose-600'
      }));
      return {
        ...prev,
        [pId]: [...existing, newComment]
      };
    });

    productItem.comments = (productItem.comments || 0) + 1;
    setNewCommentText('');
  };

  const handleLikeToggle = (productItem: any) => {
    const isAlreadyLiked = likedItemIds.includes(productItem.id);
    if (isAlreadyLiked) {
      setLikedItemIds(prev => prev.filter(id => id !== productItem.id));
      productItem.likes = Math.max(0, productItem.likes - 1);
    } else {
      setLikedItemIds(prev => [...prev, productItem.id]);
      productItem.likes = productItem.likes + 1;
    }
  };

  const handleToggleFollow = (artisanName: string) => {
    const isFollowing = followedArtisans.includes(artisanName);
    if (isFollowing) {
      setFollowedArtisans(prev => prev.filter(name => name !== artisanName));
    } else {
      setFollowedArtisans(prev => [...prev, artisanName]);
    }
  };

  const handleShareProduct = (productItem: any) => {
    const productLink = `${window.location.origin}/product/${productItem.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(productLink)
        .then(() => alert(`Product link copied to clipboard!\n${productLink}`))
        .catch(() => alert(`Share product link: ${productLink}`));
    } else {
      alert(`Share product link: ${productLink}`);
    }
  };

  const handleSharePortfolio = (postId: string) => {
    const postLink = `${window.location.origin}/portfolio/${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postLink)
        .then(() => alert(`Portfolio post link copied to clipboard!\n${postLink}`))
        .catch(() => alert(`Share post link: ${postLink}`));
    } else {
      alert(`Share post link: ${postLink}`);
    }
  };

  const handleDoubleTapLike = (productItem: any) => {
    const isAlreadyLiked = likedItemIds.includes(productItem.id);
    if (!isAlreadyLiked) {
      setLikedItemIds(prev => [...prev, productItem.id]);
      productItem.likes = productItem.likes + 1;
    }
    
    // Trigger Instagram center heart pop overlay
    setShowHeartPop(productItem.id);
    setTimeout(() => {
      setShowHeartPop(null);
    }, 800);
  };

  const handleAddToCollectionClick = (productItem: any) => {
    setAddToColProduct(productItem);
    setSelectedColIds([]);
    setNewColName('');
    setColSuccessMessage(null);
  };

  const handleToggleColSelection = (colId: string) => {
    setSelectedColIds(prev => 
      prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
    );
  };

  const handleCreateCollection = () => {
    if (!newColName.trim()) return;
    const newId = 'col-' + (collections.length + 1);
    const newCol = {
      id: newId,
      label: newColName.trim(),
      productCount: 1
    };
    setCollections(prev => [...prev, newCol]);
    setSelectedColIds(prev => [...prev, newId]);
    setNewColName('');
  };

  const handleConfirmAddToCollection = () => {
    if (selectedColIds.length === 0) {
      alert("Please select at least one collection.");
      return;
    }
    const selectedLabels = collections
      .filter(c => selectedColIds.includes(c.id))
      .map(c => c.label)
      .join(', ');
      
    setColSuccessMessage(`Product added successfully to: ${selectedLabels}!`);
    setTimeout(() => {
      setColSuccessMessage(null);
      setAddToColProduct(null);
      setSelectedColIds([]);
    }, 1500);
  };

  // Mocked products for the Sync Now explorer feed
  const explorerFeedProducts = [
    {
      id: 'exp-1',
      name: 'Banarasi Silk Saree - Kadwa Weave',
      artisanName: 'Kavita Sharma',
      location: 'Varanasi, Uttar Pradesh',
      price: 18500,
      moq: getDynamicMOQ(18500, 'exp-1'),
      likes: 256,
      comments: 32,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
      avatarChar: 'K',
      avatarBg: 'bg-purple-700 text-white',
      craftType: 'Kadwa Weaving',
      material: 'Katan Silk',
      stock: 8,
      description: 'Handwoven pure silk Banarasi Saree, designed with traditional floral borders using standard gold zari threads.'
    },
    {
      id: 'exp-2',
      name: 'Paithani Silk Saree - Peacock Design',
      artisanName: 'Rahul Deshmukh',
      location: 'Paithan, Maharashtra',
      price: 24720,
      moq: getDynamicMOQ(24720, 'exp-2'),
      likes: 182,
      comments: 21,
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600',
      avatarChar: 'R',
      avatarBg: 'bg-rose-700 text-white',
      craftType: 'Paithani Weaving',
      material: 'Pure Silk',
      stock: 5,
      description: 'Authentic handwoven Paithani silk saree featuring signature peacock border design and double pallu.'
    }
  ];

  // Synced products collection (matching the middle screen design)
  const syncedCatalog = products.filter(p => syncedIds.includes(p.id));

  // Search filter
  const filteredSynced = syncedCatalog.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Dynamically map database products (unsynced) into the Brand Explorer Sourcing feed
  const dbUnsyncedExplorer = products
    .filter(p => !syncedIds.includes(p.id))
    .map(p => ({
      id: p.id,
      name: p.name,
      artisanName: 'Ramesh Kumar',
      location: 'Varanasi, Uttar Pradesh',
      price: p.price,
      moq: getDynamicMOQ(p.price, p.id),
      likes: 142,
      comments: 18,
      image: p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600',
      avatarChar: 'R',
      avatarBg: 'bg-primary text-white',
      craftType: p.craftType || p.craft_type || 'Traditional Handloom',
      material: p.material || 'Organic Materials',
      stock: p.stockQty || p.stock || 10,
      description: p.description || 'Authentic handcrafted artisanal product.'
    }));

  const combinedExplorer = [
    ...dbUnsyncedExplorer,
    ...explorerFeedProducts.filter(ep => {
      const targetId = ep.id === 'exp-1' ? 'p-1' : 'p-2';
      return !syncedIds.includes(targetId);
    })
  ];

  const filteredExplorer = combinedExplorer
    .filter(p => !hiddenProductIds.includes(p.id))
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase())
    );



  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFF8F1] z-10 select-none">
      
      {/* ============================================================== */}
      {/* VIEW A: VIEW SYNCED (Middle Screen: already linked catalog) */}
      {/* ============================================================== */}
      {subView === 'synced' ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shadow-sm shrink-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-text-primary" />
              </button>
              <h2 className="font-heading font-extrabold text-lg">View Synced</h2>
            </div>
            
            {/* Quick Toggle pill */}
            <button 
              onClick={() => setSubView('explorer')}
              className="text-xs font-bold text-primary px-3.5 py-1.5 bg-primary/10 rounded-full"
            >
              Sync Now Explorer
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar pb-24">
            {/* Search Input & Filter */}
            <div className="flex gap-2.5">
              <div className="flex-1 bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-2">
                <Search className="w-5 h-5 text-stone-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product, artisan or craft..."
                  className="w-full text-xs font-medium text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
                />
              </div>
              <button className="w-11 h-11 rounded-2xl bg-white border border-stone-150 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-all">
                <Filter className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Synced product cards (long list layout matching mockup) */}
            <div className="flex flex-col gap-3.5">
              {filteredSynced.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setCurrentView('ai-studio')}
                  className="bg-white rounded-3xl border border-primary/5 shadow-sm p-3.5 flex items-center gap-4 cursor-pointer hover:border-primary/20 transition-all group relative"
                >
                  {/* Left thumbnail image */}
                  <div className="w-14 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Middle texts */}
                  <div className="flex-1 min-w-0">
                    {/* Synchronized Ref ID in orange */}
                    <span className="text-[9px] font-black text-primary block uppercase tracking-wider">
                      {idx % 2 === 0 ? 'AURA-2024-0891' : 'NORD-2024-0890'}
                    </span>
                    <h4 className="text-xs font-extrabold text-stone-850 font-heading truncate mt-0.5">
                      {p.name}
                    </h4>
                    <span className="text-[9px] text-text-secondary block mt-0.5 font-bold">
                      SKU: {p.sku}
                    </span>
                    
                    {/* Price tag */}
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-black text-stone-850">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current text-primary fill-none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
                        <path d="M6 3h12M6 8h12M6 13h8.5a4.5 4.5 0 0 0 0-9H6M6 13l9 9" />
                      </svg>
                      <span>₹{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Far-right chevron */}
                  <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors shrink-0" />
                </div>
              ))}

              {filteredSynced.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-primary/5 p-6 flex flex-col items-center gap-2">
                  <RefreshCw className="w-10 h-10 text-stone-300 animate-spin-slow" />
                  <span className="text-xs font-bold text-text-secondary">No synced products found.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (

        // ==============================================================
        // VIEW B: BRAND INVENTORY SYNC NOW (Right Screen: catalog feed)
        // ==============================================================
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-stone-200 flex flex-col gap-4 p-6 pb-4 shadow-sm shrink-0 z-30">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-heading font-black text-2xl text-stone-850 tracking-tight">Shilp Setu</h1>
                <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5 block">
                  Explore Indian Crafts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSubView('synced')}
                  className="text-xs font-bold text-primary px-3.5 py-1.5 bg-primary/10 rounded-full"
                >
                  View Synced ({syncedIds.length})
                </button>
                <button 
                  onClick={() => setShowCartModal(true)}
                  className="w-10 h-10 rounded-2xl bg-white border border-stone-200 flex items-center justify-center relative shadow-sm hover:bg-stone-50 active:scale-95 transition-all"
                  aria-label="Checkout Cart"
                >
                  <ShoppingBag className="w-5 h-5 text-stone-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B35] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Search Input & Filter */}
            <div className="flex gap-2.5 mt-1">
              <div className="flex-1 bg-stone-50 rounded-2xl p-1.5 border border-stone-200 shadow-inner flex items-center gap-2">
                <Search className="w-5 h-5 text-stone-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product, artisan or craft..."
                  className="w-full text-xs font-medium text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
                />
              </div>
              <button className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm hover:bg-stone-50 transition-all">
                <Filter className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Sourcing Explorer Sub-Tabs Selector */}
            <div className="flex gap-2 bg-stone-100 p-1 rounded-2xl shrink-0">
              <button
                onClick={() => setExploreTab('products')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  exploreTab === 'products'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 bg-transparent'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setExploreTab('portfolio')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  exploreTab === 'portfolio'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 bg-transparent'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setExploreTab('following')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
                  exploreTab === 'following'
                    ? 'bg-[#FF6B35] text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 bg-transparent'
                }`}
              >
                Following
              </button>
            </div>
          </div>

          {/* Sourcing catalog feed */}
          <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar pb-24">
            {exploreTab === 'products' ? (
              filteredExplorer.map((item) => {
                const isSynced = syncedIds.some(id => id.includes(item.id) || (item.id === 'exp-1' && syncedIds.includes('p-1')));
                
                return (
                  <Card 
                    key={item.id} 
                    padding="none" 
                    className="bg-white rounded-3xl border border-primary/5 shadow-premium overflow-hidden flex flex-col group shrink-0"
                  >
                    {/* Card Header: Artisan Details */}
                    <div className="p-4 flex justify-between items-center border-b border-stone-50">
                      <div 
                        onClick={() => handleOpenArtisanProfile(item.artisanName, item.location, item.avatarBg, item.avatarChar)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-9 h-9 rounded-full ${item.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-inner ring-2 ring-[#FF6B35]/20 group-hover:ring-[#FF6B35] transition-all`}>
                          {item.avatarChar}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-stone-850 group-hover:text-[#FF6B35] transition-colors">{item.artisanName}</h4>
                          <span className="text-[9px] text-text-secondary font-bold block mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>{item.location}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {followedArtisans.includes(item.artisanName) ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleFollow(item.artisanName); }}
                            className="text-[10px] font-extrabold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 shadow-sm active:scale-95 transition-all"
                          >
                            Following
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleFollow(item.artisanName); }}
                            className="text-[10px] font-extrabold text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35] hover:text-white px-3 py-1.5 rounded-full border border-[#FF6B35]/20 shadow-sm active:scale-95 transition-all"
                          >
                            Follow
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveOptionsProductId(item.id); }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors"
                          title="Options"
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Fixed portrait height wrapper to prevent vertical collapse inside flex containers */}
                    <div 
                      onClick={(e) => {
                        if (e.detail === 2) {
                          handleDoubleTapLike(item);
                        }
                      }}
                      className="w-full aspect-[4/5] shrink-0 bg-stone-100 overflow-hidden relative cursor-pointer select-none"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />

                      {/* Instagram center heart pop animation overlay */}
                      {showHeartPop === item.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 animate-fade">
                          <div className="bg-white/95 backdrop-blur-xs rounded-full p-4.5 shadow-premium animate-bounce">
                            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                          </div>
                        </div>
                      )}
                      
                      {isSynced && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-600 text-white text-[9px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-white/15">
                          <CheckCircleIcon className="w-3.5 h-3.5" />
                          <span>Synced</span>
                        </div>
                      )}

                      {/* Floating Add to Cart bag button overlay (No circle background, large icon with shadow) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        className="absolute bottom-3 right-3 flex items-center justify-center text-white transition-all active:scale-90 hover:scale-108"
                        style={{ filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.55))' }}
                        title="Add to Sourcing Cart"
                      >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          {/* Handle */}
                          <path d="M8 8a4 4 0 0 1 8 0" />
                          {/* Bag body path with gap at bottom-right */}
                          <path d="M5 8h14v5" />
                          <path d="M5 8v10a2 2 0 0 0 2 2h6" />
                          {/* Plus sign in bottom right gap */}
                          <path d="M18 15v6M15 18h6" strokeWidth="2.8" className="text-[#FF6B35]" />
                        </svg>
                      </button>
                    </div>

                    {/* Saree Info block */}
                    <div className="p-4 flex flex-col gap-3">
                      <div>
                        <h3 
                          onClick={() => setExpandedProductId(prev => prev === item.id ? null : item.id)}
                          className="text-sm font-black text-stone-850 font-heading leading-tight hover:text-[#FF6B35] transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <span>{item.name}</span>
                          <span className="text-[10px] text-[#FF6B35]/80 bg-[#FF6B35]/10 px-2 py-0.5 rounded-full shrink-0 font-bold">
                            {expandedProductId === item.id ? 'Hide Details' : 'View Details'}
                          </span>
                        </h3>
                        
                        {expandedProductId === item.id && (
                          <div className="mt-3 p-3.5 bg-orange-50/40 rounded-2xl border border-[#FF6B35]/15 text-[11px] text-stone-750 flex flex-col gap-2.5 transition-all">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
                                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Craft Type</span>
                                <span className="font-extrabold text-stone-850">{item.craftType || 'Traditional Craft'}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
                                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Material</span>
                                <span className="font-extrabold text-stone-850">{item.material || 'Organic Materials'}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
                                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">Stock Available</span>
                                <span className="font-extrabold text-stone-850">{item.stock ? `${item.stock} pieces` : 'In Stock'}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
                                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider">MOQ Requirement</span>
                                <span className="font-extrabold text-stone-850">{item.moq} pcs</span>
                              </div>
                            </div>
                            {item.description && (
                              <div className="bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs">
                                <span className="text-[9px] text-stone-400 block font-bold uppercase tracking-wider font-sans">Description</span>
                                <p className="text-stone-700 leading-relaxed font-semibold mt-1 font-sans">{item.description}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Price, MOQ, and Likes values on a single line */}
                        <div className="flex justify-between items-center mt-3 text-xs font-bold text-stone-800 border-t border-stone-100 pt-3">
                          <div className="flex items-center gap-4">
                            {/* Like Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleLikeToggle(item); }}
                              className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                            >
                              <Heart 
                                className={`w-4.5 h-4.5 transition-colors ${
                                  likedItemIds.includes(item.id) 
                                    ? 'text-red-500 fill-red-500' 
                                    : 'text-stone-500 hover:text-red-500'
                                }`} 
                              />
                              <span className="text-[11px] font-extrabold text-stone-600">{item.likes}</span>
                            </button>

                            {/* Comment Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleOpenComments(item); }}
                              className="flex items-center gap-1.5 hover:text-primary transition-colors"
                              title="Comments"
                            >
                              <MessageSquare className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                              <span className="text-[11px] font-extrabold text-stone-600">{productComments[item.id]?.length || item.comments || 0}</span>
                            </button>

                            {/* Share Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleShareProduct(item); }}
                              className="flex items-center gap-1.5 hover:text-primary transition-colors ml-0.5"
                              title="Share Link"
                            >
                              <Share2 className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                            </button>

                            {/* MOQ */}
                            <div className="flex items-center gap-1.5 text-stone-600">
                              <svg viewBox="0 0 24 24" className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                              </svg>
                              <span className="text-[11px]">MOQ: <span className="text-stone-850 font-black">{item.moq} pcs</span></span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-sm font-black text-[#FF6B35]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      {/* Inline Comments Section (Reddit/Instagram style) */}
                      {expandedCommentProductId === item.id && (
                        <div className="mt-2 border-t border-stone-100 pt-3 flex flex-col gap-3 animate-scaleUp">
                          <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-wider text-left">Comments</h4>
                          
                          {/* Comments List */}
                          <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                            {(() => {
                              const currentComments = productComments[item.id] || [];
                              const displayComments = currentComments.length > 0 
                                ? currentComments 
                                : Array.from({ length: Math.min(3, item.comments || 0) }).map((_, i) => ({
                                    id: `mock-${i}`,
                                    author: i === 0 ? 'Kavita Sharma (Artisan)' : i === 1 ? 'Rajesh Kumar (Sourcing)' : 'Sunita Handlooms',
                                    text: i === 0 ? 'Each weave takes about 3 days to perfect. Happy to answer questions!' : i === 1 ? 'Is the MOQ negotiable for custom colorways?' : 'We ordered 5 batches last week, excellent zari border finish.',
                                    timestamp: `${i + 1}d ago`,
                                    avatarChar: i === 0 ? 'K' : i === 1 ? 'R' : 'S',
                                    avatarBg: i === 0 ? 'bg-purple-600' : i === 1 ? 'bg-indigo-600' : 'bg-rose-600'
                                  }));

                              return displayComments.map(comment => (
                                <div key={comment.id} className="flex gap-2 items-start text-left">
                                  <div className={`w-5.5 h-5.5 rounded-full ${comment.avatarBg || 'bg-stone-200'} shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white`}>
                                    {comment.avatarChar || 'U'}
                                  </div>
                                  <div className="flex-1 bg-stone-50 rounded-xl p-2 border border-stone-150">
                                    <div className="flex justify-between items-center mb-0.5">
                                      <span className="text-[9px] font-black text-stone-850">{comment.author}</span>
                                      <span className="text-[7.5px] text-stone-400 font-bold">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-[9.5px] font-semibold text-stone-600 leading-normal">{comment.text}</p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>

                          {/* Post comment input box */}
                          <div className="flex gap-1.5 pt-1.5 border-t border-stone-100">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newCommentText.trim()) {
                                  handlePostCommentInline(item);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()} // Prevent card navigation
                              className="flex-1 text-[10px] font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1.5 focus:ring-primary focus:bg-white"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePostCommentInline(item);
                              }}
                              disabled={!newCommentText.trim()}
                              className="bg-primary hover:bg-[#E55A25] disabled:bg-stone-300 text-white rounded-xl px-3 text-[10px] font-black active:scale-95 transition-all"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions Row */}
                      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 mt-1">
                        <button
                          onClick={() => handleSyncToStore(item.id, item.name)}
                          className={`flex items-center justify-center gap-1 py-3 rounded-2xl text-[10px] font-extrabold border transition-all ${
                            isSynced 
                              ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-[#FF6B35] hover:bg-[#E55A25] text-white border-[#FF6B35] shadow shadow-orange-500/10 active:scale-98'
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSynced ? '' : 'animate-spin-slow'}`} />
                          <span>Sync to My Store</span>
                        </button>

                        <button
                          onClick={() => handleBuyNow(item)}
                          className="py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] font-extrabold transition-all"
                        >
                          Buy Now
                        </button>

                        <button
                          onClick={() => handleAddToCollectionClick(item)}
                          className="flex items-center justify-center gap-1 py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] font-extrabold transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Collection</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : exploreTab === 'portfolio' ? (
              /* Combined Portfolio Instagram Feed (Single Column) */
              <div className="flex flex-col gap-6 pb-20">
                {portfolioPosts.map((g, idx) => {
                  const postId = g.id || `portfolio-${g.title.toLowerCase().replace(/\s+/g, '-')}`;
                  const isLiked = likedItemIds.includes(postId);
                  
                  const handleDoubleTapPortfolio = () => {
                    if (!isLiked) {
                      setLikedItemIds(prev => [...prev, postId]);
                    }
                    setShowHeartPop(postId);
                    setTimeout(() => {
                      setShowHeartPop(null);
                    }, 900);
                  };

                  return (
                    <Card
                      key={idx}
                      padding="none"
                      className="bg-white rounded-3xl border border-stone-150 overflow-hidden flex flex-col shadow-sm relative"
                    >
                      {/* 1. Post Header */}
                      <div className="p-4 flex items-center justify-between border-b border-stone-50">
                        <div 
                          onClick={() => handleOpenArtisanProfile(g.artisanName, g.location, g.avatarBg, g.avatarChar)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className={`w-9 h-9 rounded-full ${g.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-inner ring-2 ring-[#FF6B35]/15 group-hover:ring-[#FF6B35] transition-all`}>
                            {g.avatarChar}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-stone-850 group-hover:text-[#FF6B35] transition-colors">
                              {g.artisanName}
                            </h4>
                            <span className="text-[9px] text-stone-400 font-bold block mt-0.5">{g.location}</span>
                          </div>
                        </div>
                        
                        <span className="text-[9px] font-black text-[#FF6B35] bg-[#FFF8F1] px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {g.category}
                        </span>
                      </div>

                      {/* 2. Post Image (Double Tap to Like) */}
                      <div 
                        onClick={(e) => {
                          if (e.detail === 2) {
                            handleDoubleTapPortfolio();
                          }
                        }}
                        className="w-full aspect-[4/3] bg-stone-100 overflow-hidden border-b border-stone-50 cursor-pointer relative select-none"
                      >
                        <img src={g.image} alt={g.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
                        
                        {/* Heart pop animation */}
                        {showHeartPop === postId && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 animate-fade">
                            <div className="bg-white/95 backdrop-blur-xs rounded-full p-4.5 shadow-premium animate-bounce">
                              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. Action Buttons Row */}
                      <div className="p-4 pb-2.5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {/* Like Button */}
                          <button 
                            onClick={() => {
                              if (isLiked) {
                                setLikedItemIds(prev => prev.filter(id => id !== postId));
                              } else {
                                setLikedItemIds(prev => [...prev, postId]);
                              }
                            }} 
                            className="hover:text-red-500 transition-colors"
                          >
                            <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-stone-600'}`} />
                          </button>

                          {/* Comment Button */}
                          <button 
                            onClick={() => setExpandedCommentProductId(prev => prev === postId ? null : postId)} 
                            className="hover:text-primary transition-colors"
                          >
                            <MessageSquare className="w-5 h-5 text-stone-600" />
                          </button>

                          {/* Share Button */}
                          <button onClick={() => handleSharePortfolio(postId)} className="hover:text-primary transition-colors">
                            <Share2 className="w-5 h-5 text-stone-600" />
                          </button>
                        </div>
                        
                        <button onClick={() => alert("Post saved to collections!")} className="hover:text-primary transition-colors">
                          <Bookmark className="w-5 h-5 text-stone-600" />
                        </button>
                      </div>

                      {/* 4. Post Caption */}
                      <div className="px-4 pb-4 text-left">
                        <span className="text-xs font-black text-stone-850 block mb-1">{g.title}</span>
                        <p className="text-xs text-stone-600 font-medium leading-relaxed">
                          <span 
                            onClick={() => handleOpenArtisanProfile(g.artisanName, g.location, g.avatarBg, g.avatarChar)}
                            className="font-black text-stone-850 mr-1.5 cursor-pointer hover:text-[#FF6B35]"
                          >
                            @{g.artisanName.toLowerCase().replace(/\s+/g, '_')}
                          </span>
                          {g.description}
                        </p>
                      </div>

                      {/* 5. Inline Comments Section */}
                      {expandedCommentProductId === postId && (
                        <div className="px-4 pb-4 border-t border-stone-100 pt-3 flex flex-col gap-3 text-left bg-stone-50/50">
                          <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Comments</h4>
                          
                          {/* Comments List */}
                          <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                            {(() => {
                              const currentComments = productComments[postId] || [];
                              const displayComments = currentComments.length > 0 
                                ? currentComments 
                                : Array.from({ length: 2 }).map((_, i) => ({
                                    id: `mock-portfolio-${i}`,
                                    author: i === 0 ? 'Anita Handloom' : 'Rajesh Kumar (Sourcing)',
                                    text: i === 0 ? 'This portfolio piece demonstrates incredible skill. Well deserved award.' : 'Very interesting loom setup! Thanks for sharing BTS.',
                                    timestamp: `${i + 1}d ago`,
                                    avatarChar: i === 0 ? 'A' : 'R',
                                    avatarBg: i === 0 ? 'bg-emerald-600' : 'bg-indigo-600'
                                  }));

                              return displayComments.map(comment => (
                                <div key={comment.id} className="flex gap-2 items-start text-left">
                                  <div className={`w-5.5 h-5.5 rounded-full ${comment.avatarBg || 'bg-stone-200'} shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white`}>
                                    {comment.avatarChar || 'U'}
                                  </div>
                                  <div className="flex-1 bg-white rounded-xl p-2 border border-stone-150 shadow-xs">
                                    <div className="flex justify-between items-center mb-0.5">
                                      <span className="text-[9px] font-black text-stone-850">{comment.author}</span>
                                      <span className="text-[7.5px] text-stone-450 font-bold">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-[9.5px] font-semibold text-stone-600 leading-normal">{comment.text}</p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>

                          {/* Post comment input box */}
                          <div className="flex gap-2 pt-2 border-t border-stone-100">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && newCommentText.trim()) {
                                  const newComment = {
                                    id: Date.now(),
                                    author: currentUser?.name || 'Ananya Goel',
                                    text: newCommentText.trim(),
                                    timestamp: 'Just now',
                                    avatarChar: (currentUser?.name || 'A').charAt(0),
                                    avatarBg: 'bg-primary'
                                  };
                                  setProductComments(prev => ({
                                    ...prev,
                                    [postId]: [...(prev[postId] || []), newComment]
                                  }));
                                  setNewCommentText('');
                                }
                              }}
                              className="flex-1 text-[10px] font-bold text-text-primary bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1.5 focus:ring-primary"
                            />
                            <button
                              onClick={() => {
                                if (newCommentText.trim()) {
                                  const newComment = {
                                    id: Date.now(),
                                    author: currentUser?.name || 'Ananya Goel',
                                    text: newCommentText.trim(),
                                    timestamp: 'Just now',
                                    avatarChar: (currentUser?.name || 'A').charAt(0),
                                    avatarBg: 'bg-primary'
                                  };
                                  setProductComments(prev => ({
                                    ...prev,
                                    [postId]: [...(prev[postId] || []), newComment]
                                  }));
                                  setNewCommentText('');
                                }
                              }}
                              className="bg-primary hover:bg-[#E55A25] text-white rounded-xl px-3.5 text-[10px] font-black active:scale-95 transition-all shadow-sm"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              /* Combined Following Feed (Single Column) */
              <div className="flex flex-col gap-6 pb-20">
                {/* Weavers You Follow Horizontal Avatar List */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-3 text-left">Weavers You Follow</span>
                  {followedArtisans.length === 0 ? (
                    <div className="text-left bg-stone-50 border border-stone-150 rounded-2xl p-4.5">
                      <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                        You are not following any weavers yet. Go to their profiles to follow them!
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                      {followedArtisans.map((name) => {
                        const matches = [...filteredExplorer, ...portfolioPosts].find(x => x.artisanName === name);
                        const bg = matches?.avatarBg || 'bg-[#B3562C]';
                        const char = matches?.avatarChar || name.charAt(0);
                        const location = matches?.location || 'India';
                        return (
                          <button
                            key={name}
                            onClick={() => handleOpenArtisanProfile(name, location, bg, char)}
                            className="flex flex-col items-center gap-1 shrink-0 group active:scale-95 transition-all"
                          >
                            <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center font-heading font-black text-lg text-white shadow-sm ring-2 ring-[#FF6B35]/25 group-hover:ring-[#FF6B35] transition-all`}>
                              {char}
                            </div>
                            <span className="text-[9.5px] font-black text-stone-750 truncate w-14 text-center">
                              {name.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Following updates */}
                {followedArtisans.length > 0 && (
                  <div className="flex flex-col gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block text-left">Latest Updates</span>
                    
                    {(() => {
                      const followedProducts = filteredExplorer.filter(item => followedArtisans.includes(item.artisanName));
                      const followedPortfolio = portfolioPosts.filter(g => followedArtisans.includes(g.artisanName));
                      const allFollowedItems: any[] = [];
                      
                      followedProducts.forEach(p => allFollowedItems.push({ type: 'product', data: p }));
                      followedPortfolio.forEach(g => allFollowedItems.push({ type: 'portfolio', data: g }));

                      if (allFollowedItems.length === 0) {
                        return (
                          <div className="text-center py-10 bg-white rounded-3xl border border-stone-150 p-6 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-text-primary">No Posts Yet</span>
                            <span className="text-[10px] text-text-secondary">Followed artisans haven't uploaded any content.</span>
                          </div>
                        );
                      }

                      return allFollowedItems.map((item, idx) => {
                        if (item.type === 'product') {
                          const p = item.data;
                          const isSynced = syncedIds.some(id => id.includes(p.id) || (p.id === 'exp-1' && syncedIds.includes('p-1')));
                          return (
                            <Card 
                              key={`following-prod-${p.id}-${idx}`} 
                              padding="none" 
                              className="bg-white rounded-3xl border border-stone-150 shadow-sm overflow-hidden flex flex-col group text-left"
                            >
                              {/* Header */}
                              <div className="p-4 flex justify-between items-center border-b border-stone-50">
                                <div 
                                  onClick={() => handleOpenArtisanProfile(p.artisanName, p.location, p.avatarBg, p.avatarChar)}
                                  className="flex items-center gap-3 cursor-pointer group"
                                >
                                  <div className={`w-9 h-9 rounded-full ${p.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-inner ring-2 ring-[#FF6B35]/20 group-hover:ring-[#FF6B35] transition-all`}>
                                    {p.avatarChar}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-stone-850 group-hover:text-[#FF6B35] transition-colors">
                                      {p.artisanName}
                                    </h4>
                                    <span className="text-[9px] text-stone-400 font-bold block mt-0.5">{p.location}</span>
                                  </div>
                                </div>
                                
                                <span className="text-[9px] font-black text-[#FF6B35] bg-[#FFF8F1] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Product
                                </span>
                              </div>

                              {/* Product Image */}
                              <div 
                                onClick={(e) => {
                                  if (e.detail === 2) {
                                    handleDoubleTapLike(p);
                                  } else {
                                    setInstaPostProduct(p);
                                  }
                                }}
                                className="w-full aspect-[4/3] bg-stone-50 overflow-hidden relative cursor-pointer"
                              >
                                <img src={p.image || p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                                {isSynced && (
                                  <div className="absolute top-3 left-3 bg-green-500/90 backdrop-blur-xs text-white text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    <span>Synced</span>
                                  </div>
                                )}
                                
                                {showHeartPop === p.id && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 animate-fade">
                                    <div className="bg-white/95 backdrop-blur-xs rounded-full p-4.5 shadow-premium animate-bounce">
                                      <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Info block */}
                              <div className="p-4 flex flex-col gap-3">
                                <h3 className="text-sm font-black text-stone-850 font-heading leading-tight">{p.name}</h3>
                                
                                <div className="flex justify-between items-center mt-3 text-xs font-bold text-stone-850 border-t border-stone-100 pt-3">
                                  <div className="flex justify-between items-center w-full">
                                    <div className="flex items-center gap-4">
                                      <button 
                                        onClick={() => handleLikeToggle(p)}
                                        className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                                      >
                                        <Heart className={`w-4.5 h-4.5 transition-colors ${likedItemIds.includes(p.id) ? 'text-red-500 fill-red-500' : 'text-stone-500 hover:text-red-500'}`} />
                                        <span className="text-[11px] font-extrabold text-stone-600">{p.likes}</span>
                                      </button>

                                      <button 
                                        onClick={() => handleOpenComments(p)}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                      >
                                        <MessageSquare className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                                        <span className="text-[11px] font-extrabold text-stone-600">{productComments[p.id]?.length || p.comments || 0}</span>
                                      </button>

                                      {/* Share Button */}
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleShareProduct(p); }}
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                        title="Share Link"
                                      >
                                        <Share2 className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                                      </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-1.5 text-stone-600">
                                        <span className="text-[11px]">MOQ: <span className="text-stone-850 font-black">{p.moq} pcs</span></span>
                                      </div>
                                      
                                      {/* Save Button */}
                                      <button 
                                        onClick={() => alert("Product saved to collections!")} 
                                        className="hover:text-primary transition-colors cursor-pointer"
                                        title="Save to Collections"
                                      >
                                        <Bookmark className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 5. Inline Comments Section */}
                              {expandedCommentProductId === p.id && (
                                <div className="px-4 pb-4 border-t border-stone-100 pt-3 flex flex-col gap-3 bg-stone-50/50">
                                  <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Comments</h4>
                                  
                                  {/* Comments List */}
                                  <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                                    {(() => {
                                      const currentComments = productComments[p.id] || [];
                                      const displayComments = currentComments.length > 0 
                                        ? currentComments 
                                        : Array.from({ length: 2 }).map((_, i) => ({
                                            id: `mock-following-prod-${i}`,
                                            author: i === 0 ? 'Anita Handloom' : 'Rajesh Kumar (Sourcing)',
                                            text: i === 0 ? 'Each weave takes about 3 days to perfect. Happy to answer questions!' : 'We ordered 5 batches last week, excellent zari border finish.',
                                            timestamp: `${i + 1}d ago`,
                                            avatarChar: i === 0 ? 'A' : 'R',
                                            avatarBg: i === 0 ? 'bg-[#FF6B35]' : 'bg-indigo-600'
                                          }));

                                      return displayComments.map(comment => (
                                        <div key={comment.id} className="flex gap-2 items-start text-left">
                                          <div className={`w-5.5 h-5.5 rounded-full ${comment.avatarBg || 'bg-stone-200'} shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white`}>
                                            {comment.avatarChar || 'U'}
                                          </div>
                                          <div className="flex-1 bg-white rounded-xl p-2 border border-stone-150 shadow-xs">
                                            <div className="flex justify-between items-center mb-0.5">
                                              <span className="text-[9px] font-black text-stone-850">{comment.author}</span>
                                              <span className="text-[7.5px] text-stone-450 font-bold">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-[9.5px] font-semibold text-stone-600 leading-normal">{comment.text}</p>
                                          </div>
                                        </div>
                                      ));
                                    })()}
                                  </div>

                                  {/* Post comment input box */}
                                  <div className="flex gap-2 pt-2 border-t border-stone-100">
                                    <input
                                      type="text"
                                      placeholder="Add a comment..."
                                      value={newCommentText}
                                      onChange={(e) => setNewCommentText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handlePostCommentInline(p);
                                      }}
                                      className="flex-1 text-[10px] font-bold text-text-primary bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1.5 focus:ring-primary"
                                    />
                                    <button
                                      onClick={() => handlePostCommentInline(p)}
                                      className="bg-primary hover:bg-[#E55A25] text-white rounded-xl px-3.5 text-[10px] font-black active:scale-95 transition-all shadow-sm"
                                    >
                                      Post
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        } else {
                          const g = item.data;
                          const postId = g.id || `portfolio-${g.title.toLowerCase().replace(/\s+/g, '-')}`;
                          const isLiked = likedItemIds.includes(postId);
                          return (
                            <Card
                              key={`following-port-${postId}-${idx}`}
                              padding="none"
                              className="bg-white rounded-3xl border border-stone-150 overflow-hidden flex flex-col shadow-sm relative text-left"
                            >
                              {/* Header */}
                              <div className="p-4 flex items-center justify-between border-b border-stone-50">
                                <div 
                                  onClick={() => handleOpenArtisanProfile(g.artisanName, g.location, g.avatarBg, g.avatarChar)}
                                  className="flex items-center gap-3 cursor-pointer group"
                                >
                                  <div className={`w-9 h-9 rounded-full ${g.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-inner ring-2 ring-[#FF6B35]/15 group-hover:ring-[#FF6B35] transition-all`}>
                                    {g.avatarChar}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-black text-stone-850 group-hover:text-[#FF6B35] transition-colors">
                                      {g.artisanName}
                                    </h4>
                                    <span className="text-[9px] text-stone-400 font-bold block mt-0.5">{g.location}</span>
                                  </div>
                                </div>
                                <span className="text-[9px] font-black text-[#FF6B35] bg-[#FFF8F1] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Portfolio
                                </span>
                              </div>

                              {/* Image */}
                              <div 
                                onClick={(e) => {
                                  if (e.detail === 2) {
                                    if (!isLiked) {
                                      setLikedItemIds(prev => [...prev, postId]);
                                    }
                                    setShowHeartPop(postId);
                                    setTimeout(() => setShowHeartPop(null), 900);
                                  }
                                }}
                                className="w-full aspect-[4/3] bg-stone-100 overflow-hidden border-b border-stone-50 cursor-pointer relative select-none"
                              >
                                <img src={g.image} alt={g.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
                                {showHeartPop === postId && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 animate-fade">
                                    <div className="bg-white/95 backdrop-blur-xs rounded-full p-4.5 shadow-premium animate-bounce">
                                      <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action Row */}
                              <div className="p-4 pb-2.5 flex justify-between items-center">
                                <div className="flex justify-between items-center w-full">
                                  <div className="flex items-center gap-4">
                                    <button 
                                      onClick={() => {
                                        if (isLiked) {
                                          setLikedItemIds(prev => prev.filter(id => id !== postId));
                                        } else {
                                          setLikedItemIds(prev => [...prev, postId]);
                                        }
                                      }}
                                      className="hover:text-red-500 transition-colors"
                                    >
                                      <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-stone-600'}`} />
                                    </button>
                                    <button onClick={() => setExpandedCommentProductId(prev => prev === postId ? null : postId)} className="hover:text-primary transition-colors">
                                      <MessageSquare className="w-5 h-5 text-stone-600" />
                                    </button>
                                    
                                    {/* Share Button */}
                                    <button onClick={handleSharePortfolio} className="hover:text-primary transition-colors">
                                      <Share2 className="w-5 h-5 text-stone-600" />
                                    </button>
                                  </div>

                                  {/* Save Button */}
                                  <button onClick={() => alert("Post saved to collections!")} className="hover:text-primary transition-colors cursor-pointer" title="Save to Collections">
                                    <Bookmark className="w-5 h-5 text-stone-600" />
                                  </button>
                                </div>
                              </div>

                              {/* Caption */}
                              <div className="px-4 pb-4 text-left">
                                <span className="text-xs font-black text-stone-850 block mb-1">{g.title}</span>
                                <p className="text-xs text-stone-650 font-medium leading-relaxed">
                                  <span className="font-black text-stone-850 mr-1.5">@{g.artisanName.toLowerCase().replace(/\s+/g, '_')}</span>
                                  {g.description}
                                </p>
                              </div>

                              {/* 5. Inline Comments Section */}
                              {expandedCommentProductId === postId && (
                                <div className="px-4 pb-4 border-t border-stone-100 pt-3 flex flex-col gap-3 text-left bg-stone-50/50">
                                  <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Comments</h4>
                                  
                                  {/* Comments List */}
                                  <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                                    {(() => {
                                      const currentComments = productComments[postId] || [];
                                      const displayComments = currentComments.length > 0 
                                        ? currentComments 
                                        : Array.from({ length: 2 }).map((_, i) => ({
                                            id: `mock-following-port-${i}`,
                                            author: i === 0 ? 'Anita Handloom' : 'Rajesh Kumar (Sourcing)',
                                            text: i === 0 ? 'This portfolio piece demonstrates incredible skill. Well deserved award.' : 'Very interesting loom setup! Thanks for sharing BTS.',
                                            timestamp: `${i + 1}d ago`,
                                            avatarChar: i === 0 ? 'A' : 'R',
                                            avatarBg: i === 0 ? 'bg-emerald-600' : 'bg-indigo-600'
                                          }));

                                      return displayComments.map(comment => (
                                        <div key={comment.id} className="flex gap-2 items-start text-left">
                                          <div className={`w-5.5 h-5.5 rounded-full ${comment.avatarBg || 'bg-stone-200'} shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white`}>
                                            {comment.avatarChar || 'U'}
                                          </div>
                                          <div className="flex-1 bg-white rounded-xl p-2 border border-stone-150 shadow-xs">
                                            <div className="flex justify-between items-center mb-0.5">
                                              <span className="text-[9px] font-black text-stone-850">{comment.author}</span>
                                              <span className="text-[7.5px] text-stone-450 font-bold">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-[9.5px] font-semibold text-stone-600 leading-normal">{comment.text}</p>
                                          </div>
                                        </div>
                                      ));
                                    })()}
                                  </div>

                                  {/* Post comment input box */}
                                  <div className="flex gap-2 pt-2 border-t border-stone-100">
                                    <input
                                      type="text"
                                      placeholder="Add a comment..."
                                      value={newCommentText}
                                      onChange={(e) => setNewCommentText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && newCommentText.trim()) {
                                          const newComment = {
                                            id: Date.now(),
                                            author: currentUser?.name || 'Ananya Goel',
                                            text: newCommentText.trim(),
                                            timestamp: 'Just now',
                                            avatarChar: (currentUser?.name || 'A').charAt(0),
                                            avatarBg: 'bg-primary'
                                          };
                                          setProductComments(prev => ({
                                            ...prev,
                                            [postId]: [...(prev[postId] || []), newComment]
                                          }));
                                          setNewCommentText('');
                                        }
                                      }}
                                      className="flex-1 text-[10px] font-bold text-text-primary bg-white border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1.5 focus:ring-primary"
                                    />
                                    <button
                                      onClick={() => {
                                        if (newCommentText.trim()) {
                                          const newComment = {
                                            id: Date.now(),
                                            author: currentUser?.name || 'Ananya Goel',
                                            text: newCommentText.trim(),
                                            timestamp: 'Just now',
                                            avatarChar: (currentUser?.name || 'A').charAt(0),
                                            avatarBg: 'bg-primary'
                                          };
                                          setProductComments(prev => ({
                                            ...prev,
                                            [postId]: [...(prev[postId] || []), newComment]
                                          }));
                                          setNewCommentText('');
                                        }
                                      }}
                                      className="bg-primary hover:bg-[#E55A25] text-white rounded-xl px-3.5 text-[10px] font-black active:scale-95 transition-all shadow-sm"
                                    >
                                      Post
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        }
                      });
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}



      {/* ============================================================== */}
      {/* ARTISAN INSTAGRAM-STYLE PROFILE VIEW                           */}
      {/* ============================================================== */}
      {selectedArtisan && (
        <div className="absolute inset-0 bg-white z-30 flex flex-col overflow-y-auto pb-[68px] no-scrollbar">
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedArtisan(null)}
                className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
              <span className="font-heading font-black text-xs text-stone-850">
                @{selectedArtisan.name.toLowerCase().replace(/\s+/g, '_')}_weaves
              </span>
            </div>
            <button className="text-stone-400 hover:text-stone-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Top Row: Avatar & Stats */}
            <div className="flex items-center justify-between gap-5">
              {/* Avatar with Story Ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <div className={`w-full h-full rounded-full ${selectedArtisan.avatarBg} flex items-center justify-center font-heading font-black text-2xl shadow-inner`}>
                      {selectedArtisan.avatarChar}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>

              {/* Stats Column Block */}
              <div className="flex-1 flex gap-4 justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-stone-850">{selectedArtisan.productsCount}</span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Products</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-stone-850 flex items-center gap-0.5">
                    <span>{selectedArtisan.rating}</span>
                    <span className="text-amber-500">★</span>
                  </span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Rating</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-stone-850">{selectedArtisan.followers}</span>
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Followers</span>
                </div>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-sm font-black text-stone-850">{selectedArtisan.name}</h3>
              <div className="flex items-center gap-1 text-[10px] text-stone-500 font-bold">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{selectedArtisan.location}</span>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed mt-2 whitespace-pre-line">
                {selectedArtisan.bio}
              </p>
              <div className="flex items-center gap-1.5 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[10px] text-stone-600 font-extrabold">Verified ShilpSetu Partner</span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => setSelectedArtisan(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null)}
                className={`py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  selectedArtisan.isFollowing 
                    ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200' 
                    : 'bg-[#FF6B35] text-white hover:bg-[#E55A25] shadow-md shadow-orange-500/10'
                }`}
              >
                <span>{selectedArtisan.isFollowing ? '✓ Following' : 'Follow'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedArtisan(null);
                  setCurrentView('messages');
                }}
                className="py-3 rounded-2xl text-xs font-black border border-[#FF6B35] text-[#FF6B35] bg-white hover:bg-[#FFF8F1] transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-[#FF6B35]" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Instagram Grid Tabs */}
          <div className="border-t border-stone-100 mt-2 flex shrink-0 bg-white">
            <button
              onClick={() => setArtisanProfileTab('products')}
              className={`flex-1 py-3.5 flex items-center justify-center border-t-2 transition-all ${
                artisanProfileTab === 'products'
                  ? 'border-stone-850 text-stone-850 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              <LayoutGrid className="w-4.5 h-4.5 mr-1.5" />
              <span className="text-xs font-black">Products</span>
            </button>

            <button
              onClick={() => setArtisanProfileTab('gallery')}
              className={`flex-1 py-3.5 flex items-center justify-center border-t-2 transition-all ${
                artisanProfileTab === 'gallery'
                  ? 'border-stone-850 text-stone-850 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              <Image className="w-4.5 h-4.5 mr-1.5" />
              <span className="text-xs font-black">Portfolio</span>
            </button>
          </div>

          {/* Tab Content area */}
          <div className="p-4 bg-stone-50 flex-1">
            {artisanProfileTab === 'products' ? (
              /* Products Grid (3 columns Instagram style) */
              <div className="grid grid-cols-3 gap-2">
                {products
                  .filter(p => {
                    if (selectedArtisan.name.includes("Kavita")) return p.name.includes("Banarasi") || p.name.includes("Katan") || p.name.includes("Silk");
                    if (selectedArtisan.name.includes("Rahul")) return p.name.includes("Paithani") || p.name.includes("Viscose");
                    return p.name.includes("Block") || p.name.includes("Cotton");
                  })
                  .map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        const feedItem = combinedExplorer.find(item => item.id === p.id) || {
                          id: p.id,
                          name: p.name,
                          artisanName: selectedArtisan.name,
                          location: selectedArtisan.location,
                          price: p.price,
                          moq: getDynamicMOQ(p.price, p.id),
                          likes: 142,
                          comments: 18,
                          image: p.images[0],
                          avatarChar: selectedArtisan.avatarChar,
                          avatarBg: selectedArtisan.avatarBg
                        };
                        setInstaPostProduct(feedItem);
                      }}
                      className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-sm relative group"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <span className="text-[9px] text-white font-extrabold truncate">{p.name}</span>
                        <span className="text-[10px] text-orange-300 font-black">₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              /* Gallery Tab (BTS certificates & loom pictures) */
              <div className="grid grid-cols-3 gap-2">
                {getArtisanGalleryItems(selectedArtisan.name).map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const feedItem = {
                        id: `gallery-${selectedArtisan.name}-${idx}`,
                        name: g.title,
                        artisanName: selectedArtisan.name,
                        location: selectedArtisan.location,
                        price: 0,
                        moq: 1,
                        likes: 85,
                        comments: 4,
                        image: g.image,
                        avatarChar: selectedArtisan.avatarChar,
                        avatarBg: selectedArtisan.avatarBg,
                        description: g.description,
                        isGalleryItem: true
                      };
                      setInstaPostProduct(feedItem);
                    }}
                    className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 cursor-pointer shadow-sm relative group"
                  >
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 text-[8px] font-bold">
                      {g.category === 'Award' ? <Award className="w-3 h-3 text-white" /> : <Image className="w-3 h-3 text-white" />}
                    </div>
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[9px] text-white font-black leading-tight truncate">{g.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GALLERY ITEM PREVIEW MODAL */}
      {previewGalleryItem && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[340px] flex flex-col gap-4 animate-scaleUp relative border border-stone-200">
            <button 
              onClick={() => setPreviewGalleryItem(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-850 font-bold"
            >
              ×
            </button>

            <h3 className="font-heading font-black text-sm text-stone-850 pr-6 text-left">{previewGalleryItem.title}</h3>
            
            <div className="w-full h-44 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img src={previewGalleryItem.image} alt={previewGalleryItem.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[9px] font-black text-[#FF6B35] bg-[#FFF8F1] px-2.5 py-0.5 rounded self-start uppercase tracking-wider">
                {previewGalleryItem.category}
              </span>
              <p className="text-xs text-stone-655 font-semibold leading-relaxed mt-2 text-stone-600">
                {previewGalleryItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. DIRECT CHECKOUT MODAL */}
      {checkoutProduct && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[340px] flex flex-col gap-4 animate-scaleUp relative border border-stone-200 text-left">
            {!checkoutSuccess ? (
              <>
                <button 
                  onClick={() => setCheckoutProduct(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-850 font-bold"
                >
                  ×
                </button>

                <h3 className="font-heading font-black text-sm text-stone-850 pr-6">Direct Sourcing Checkout</h3>

                {/* Product Preview Row */}
                <div className="flex gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-150">
                  <div className="w-12 h-15 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                    <img 
                      src={checkoutProduct.image} 
                      alt={checkoutProduct.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-black text-stone-850 truncate">{checkoutProduct.name}</h4>
                    <span className="text-[9.5px] text-stone-500 font-bold block mt-0.5">by {checkoutProduct.artisanName}</span>
                    <span className="text-[10px] text-primary font-extrabold block mt-1">₹{checkoutProduct.price.toLocaleString('en-IN')} / pc</span>
                  </div>
                </div>

                {/* Sourcing Quantity Selector */}
                <div>
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Quantity (MOQ: {checkoutProduct.moq} pcs)</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setCheckoutQty(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center font-bold hover:bg-stone-50 active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-stone-850">{checkoutQty} pcs</span>
                    <button 
                      onClick={() => setCheckoutQty(prev => Math.min(checkoutProduct.moq, prev + 1))}
                      className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center font-bold hover:bg-stone-50 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Address Selector */}
                <div>
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Select Delivery Address</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 0, title: "Delhi Hub (HQ)", value: "14 N-Block Market, Greater Kailash-I, New Delhi - 110048" },
                      { id: 1, title: "Gurugram Warehouse", value: "Plot No. 12, Sector 5, IMT Manesar, Gurugram - 122051" }
                    ].map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddressIdx(addr.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          selectedAddressIdx === addr.id 
                            ? 'bg-primary/5 border-primary text-primary' 
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black">{addr.title}</span>
                          <input 
                            type="radio" 
                            checked={selectedAddressIdx === addr.id}
                            onChange={() => {}}
                            className="w-3 h-3 accent-primary"
                          />
                        </div>
                        <p className="text-[9.5px] font-medium leading-relaxed opacity-80">{addr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Select Payment Method</label>
                  <div className="p-3 rounded-2xl border bg-stone-50 border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💳</span>
                      <div className="text-left">
                        <span className="text-[10px] font-black text-stone-850 block">ShilpSetu Wallet</span>
                        <span className="text-[9px] text-stone-500 font-bold">
                          Balance: ₹{(wallets[currentUser?.uid || 'brand-1']?.balance || 12450).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'wallet'} 
                      onChange={() => {}} 
                      className="w-3.5 h-3.5 accent-primary"
                    />
                  </div>
                </div>

                {/* Order Summary Cost breakdown */}
                {(() => {
                  const subtotal = checkoutProduct.price * checkoutQty;
                  const gst = Math.round(subtotal * 0.12);
                  const total = subtotal + gst;
                  const walletBalance = wallets[currentUser?.uid || 'brand-1']?.balance || 12450;
                  const isInsufficient = walletBalance < total;
                  const missingAmount = total - walletBalance;

                  const handleConfirmPayment = () => {
                    setIsProcessingCheckout(true);
                    
                    if (isInsufficient) {
                      // Automate recharge first
                      rechargeWallet(currentUser?.uid || 'brand-1', missingAmount);
                    }

                    setTimeout(() => {
                      const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
                      const directOrder = {
                        id: newOrderId,
                        buyerId: currentUser?.uid || 'brand-1',
                        buyerName: currentUser?.name || 'Ananya Goel',
                        sellerId: checkoutProduct.artisanName.includes('Kavita') ? 'artisan-1' : 'artisan-2',
                        sellerName: checkoutProduct.artisanName,
                        amount: total,
                        status: 'placed' as const,
                        items: [
                          {
                            productId: checkoutProduct.id,
                            name: checkoutProduct.name,
                            quantity: checkoutQty,
                            price: checkoutProduct.price,
                            image: checkoutProduct.image
                          }
                        ],
                        statusHistory: [
                          { status: 'placed' as const, timestamp: new Date().toISOString() }
                        ],
                        createdAt: new Date().toISOString()
                      };

                      placeDirectOrder(directOrder);
                      setIsProcessingCheckout(false);
                      setCheckoutSuccess(true);
                    }, 1200);
                  };

                  return (
                    <div className="flex flex-col gap-2 pt-2 border-t border-stone-150">
                      <div className="flex justify-between text-[10px] font-bold text-stone-500">
                        <span>Subtotal ({checkoutQty} pcs)</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-stone-500">
                        <span>GST (12%)</span>
                        <span>₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs font-black text-stone-850 pt-1 border-t border-stone-100">
                        <span>Total Sourcing Amount</span>
                        <span className="text-primary font-black">₹{total.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Warnings / Error messaging if insufficient wallet funds */}
                      {isInsufficient && (
                        <div className="p-2.5 bg-red-50 border border-red-200/50 rounded-xl text-[9px] font-bold text-red-600 flex flex-col gap-0.5 mt-2">
                          <span>⚠️ Insufficient Wallet Balance</span>
                          <span>Missing ₹{missingAmount.toLocaleString('en-IN')} of total ₹{total.toLocaleString('en-IN')}.</span>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button
                        onClick={handleConfirmPayment}
                        disabled={isProcessingCheckout}
                        className={`w-full py-3 rounded-2xl text-xs font-black text-white transition-all shadow-xs mt-3 flex items-center justify-center gap-2 ${
                          isProcessingCheckout 
                            ? 'bg-stone-400 cursor-not-allowed' 
                            : isInsufficient 
                              ? 'bg-stone-900 hover:bg-stone-850 active:scale-98' 
                              : 'bg-primary hover:bg-[#E55A25] active:scale-98'
                        }`}
                      >
                        {isProcessingCheckout ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isInsufficient ? (
                          <span>Recharge ₹{missingAmount.toLocaleString('en-IN')} & Pay</span>
                        ) : (
                          <span>Confirm & Pay ₹{total.toLocaleString('en-IN')}</span>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </>
            ) : (
              // Success checkmark screen
              <div className="py-8 flex flex-col items-center text-center gap-4 animate-scaleUp">
                <div className="w-16 h-16 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 text-3xl font-bold animate-pulse">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading font-black text-md text-stone-850">Direct Sourcing Placed!</h3>
                  <p className="text-[10px] text-stone-500 font-bold mt-1.5 leading-relaxed">
                    Escrow security has locked payment. The artisan will start dispatch preparation shortly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCheckoutProduct(null);
                    setCheckoutSuccess(false);
                    setCurrentView('orders');
                  }}
                  className="w-full py-3 bg-stone-900 text-white rounded-2xl text-xs font-black hover:bg-stone-850 active:scale-95 transition-all mt-4"
                >
                  View My Sourcing Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ADD TO COLLECTION MODAL */}
      {addToColProduct && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[340px] flex flex-col gap-4 animate-scaleUp relative border border-stone-200 text-left">
            {!colSuccessMessage ? (
              <>
                <button 
                  onClick={() => setAddToColProduct(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-850 font-bold"
                >
                  ×
                </button>

                <h3 className="font-heading font-black text-sm text-stone-850 pr-6">Add to Collection</h3>
                <p className="text-[10px] text-stone-500 font-bold -mt-2">Select existing collections or create a new one to organize this product.</p>

                {/* Scrollable list of existing collections */}
                <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
                  {collections.map(col => (
                    <div 
                      key={col.id}
                      onClick={() => handleToggleColSelection(col.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedColIds.includes(col.id) 
                          ? 'bg-primary/5 border-primary text-primary font-bold' 
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs">📁</span>
                        <span className="text-[10.5px] font-bold">{col.label}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedColIds.includes(col.id)}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 accent-primary cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Create New Collection input box */}
                <div className="flex flex-col gap-2 pt-2 border-t border-stone-150">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Create New Collection</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Silk Special 2026..."
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      className="flex-1 text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    />
                    <button
                      onClick={handleCreateCollection}
                      className="bg-stone-900 hover:bg-stone-850 text-white rounded-xl px-4 text-xs font-black active:scale-95 transition-all"
                    >
                      Create
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleConfirmAddToCollection}
                  className="w-full py-3 bg-primary hover:bg-[#E55A25] text-white rounded-2xl text-xs font-black shadow-sm active:scale-98 transition-all mt-2"
                >
                  Add to Selected ({selectedColIds.length})
                </button>
              </>
            ) : (
              // Success feedback screen
              <div className="py-8 flex flex-col items-center text-center gap-4 animate-scaleUp">
                <div className="w-16 h-16 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 text-3xl font-bold animate-bounce">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading font-black text-md text-stone-850">Added Successfully!</h3>
                  <p className="text-[10px] text-stone-500 font-bold mt-1.5 leading-relaxed px-4">
                    {colSuccessMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 5. SHOPPING CART MODAL */}
      {showCartModal && (
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[32px] p-5 w-full max-w-[340px] flex flex-col gap-4 animate-scaleUp relative border border-stone-200 text-left max-h-[90%] overflow-y-auto no-scrollbar">
            {!checkoutSuccess ? (
              <>
                <button 
                  onClick={() => setShowCartModal(false)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-850 font-bold"
                >
                  ×
                </button>

                <h3 className="font-heading font-black text-sm text-stone-850 pr-6 flex items-center gap-2">
                  <span>🛒</span>
                  <span>Sourcing Cart ({cartItems.length})</span>
                </h3>

                {cartItems.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                    <span className="text-3xl">🛍️</span>
                    <p className="text-xs font-bold text-stone-400">Your cart is empty.</p>
                    <button 
                      onClick={() => setShowCartModal(false)}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-900 text-white rounded-xl text-[10px] font-black active:scale-95 transition-all mt-2"
                    >
                      Start Sourcing
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <div className="flex flex-col gap-2.5 max-h-44 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-2.5 bg-stone-50 p-2.5 rounded-2xl border border-stone-150 relative group">
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start gap-1 pr-6">
                              <h4 className="text-[10px] font-black text-stone-850 truncate leading-tight">{item.name}</h4>
                              <button 
                                onClick={() => setCartItems(prev => prev.filter(c => c.id !== item.id))}
                                className="absolute top-2 right-2 text-stone-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[9.5px] font-bold text-primary">₹{item.price.toLocaleString('en-IN')} / pc</span>
                              
                              {/* Quantity controls */}
                              <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 p-0.5 shadow-xs scale-90 origin-right">
                                <button 
                                  onClick={() => setCartItems(prev => prev.map(c => c.id === item.id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))}
                                  className="w-5 h-5 flex items-center justify-center font-bold text-stone-500 hover:bg-stone-50 rounded"
                                >
                                  -
                                </button>
                                <span className="text-[9.5px] font-black text-stone-850 px-1">{item.qty}</span>
                                <button 
                                  onClick={() => setCartItems(prev => prev.map(c => c.id === item.id ? { ...c, qty: Math.min(item.moq, c.qty + 1) } : c))}
                                  className="w-5 h-5 flex items-center justify-center font-bold text-stone-500 hover:bg-stone-50 rounded"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address Selector */}
                    <div>
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Select Delivery Address</label>
                      <div className="flex flex-col gap-2">
                        {[
                          { id: 0, title: "Delhi Hub (HQ)", value: "14 N-Block Market, Greater Kailash-I, New Delhi - 110048" },
                          { id: 1, title: "Gurugram Warehouse", value: "Plot No. 12, Sector 5, IMT Manesar, Gurugram - 122051" }
                        ].map(addr => (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressIdx(addr.id)}
                            className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                              selectedAddressIdx === addr.id 
                                ? 'bg-primary/5 border-primary text-primary' 
                                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/50'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[9.5px] font-black">{addr.title}</span>
                              <input 
                                type="radio" 
                                checked={selectedAddressIdx === addr.id}
                                onChange={() => {}}
                                className="w-3 h-3 accent-primary"
                              />
                            </div>
                            <p className="text-[8.5px] font-medium leading-relaxed opacity-80">{addr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Option Selector */}
                    <div>
                      <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-2">Select Payment Method</label>
                      <div className="p-2.5 rounded-2xl border bg-stone-50 border-stone-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">💳</span>
                          <div className="text-left">
                            <span className="text-[9.5px] font-black text-stone-850 block">ShilpSetu Wallet</span>
                            <span className="text-[8.5px] text-stone-500 font-bold">
                              Balance: ₹{(wallets[currentUser?.uid || 'brand-1']?.balance || 12450).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <input 
                          type="radio" 
                          checked={paymentMethod === 'wallet'} 
                          onChange={() => {}} 
                          className="w-3.5 h-3.5 accent-primary"
                        />
                      </div>
                    </div>

                    {/* Summary Calculations */}
                    {(() => {
                      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
                      const gst = Math.round(subtotal * 0.12);
                      const total = subtotal + gst;
                      const walletBalance = wallets[currentUser?.uid || 'brand-1']?.balance || 12450;
                      const isInsufficient = walletBalance < total;
                      const missingAmount = total - walletBalance;

                      const handlePlaceCartOrder = () => {
                        setIsProcessingCheckout(true);
                        
                        if (isInsufficient) {
                          rechargeWallet(currentUser?.uid || 'brand-1', missingAmount);
                        }

                        setTimeout(() => {
                          const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
                          const directOrder = {
                            id: newOrderId,
                            buyerId: currentUser?.uid || 'brand-1',
                            buyerName: currentUser?.name || 'Ananya Goel',
                            sellerId: 'artisan-1',
                            sellerName: 'Shilp Setu Artisans',
                            amount: total,
                            status: 'placed' as const,
                            items: cartItems.map(c => ({
                              productId: c.id,
                              name: c.name,
                              quantity: c.qty,
                              price: c.price,
                              image: c.image
                            })),
                            statusHistory: [
                              { status: 'placed' as const, timestamp: new Date().toISOString() }
                            ],
                            createdAt: new Date().toISOString()
                      };

                      placeDirectOrder(directOrder);
                      setIsProcessingCheckout(false);
                      setCheckoutSuccess(true);
                      setCartItems([]);
                    }, 1200);
                  };

                  return (
                    <div className="flex flex-col gap-2 pt-2 border-t border-stone-150">
                      <div className="flex justify-between text-[9.5px] font-bold text-stone-500">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[9.5px] font-bold text-stone-500">
                        <span>GST (12%)</span>
                        <span>₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-black text-stone-850 pt-1 border-t border-stone-100">
                        <span>Total Sourcing Amount</span>
                        <span className="text-primary font-black">₹{total.toLocaleString('en-IN')}</span>
                      </div>

                      {isInsufficient && (
                        <div className="p-2.5 bg-red-50 border border-red-200/50 rounded-xl text-[9px] font-bold text-red-600 flex flex-col gap-0.5 mt-2">
                          <span>⚠️ Insufficient Wallet Balance</span>
                          <span>Missing ₹{missingAmount.toLocaleString('en-IN')} of total ₹{total.toLocaleString('en-IN')}.</span>
                        </div>
                      )}

                      <button
                        onClick={handlePlaceCartOrder}
                        disabled={isProcessingCheckout}
                        className={`w-full py-3 rounded-2xl text-xs font-black text-white transition-all shadow-xs mt-3 flex items-center justify-center gap-2 ${
                          isProcessingCheckout 
                            ? 'bg-stone-400 cursor-not-allowed' 
                            : isInsufficient 
                              ? 'bg-stone-900 hover:bg-stone-850 active:scale-98' 
                              : 'bg-primary hover:bg-[#E55A25] active:scale-98'
                        }`}
                      >
                        {isProcessingCheckout ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isInsufficient ? (
                          <span>Recharge ₹{missingAmount.toLocaleString('en-IN')} & Settle</span>
                        ) : (
                          <span>Place Sourcing Order (₹{total.toLocaleString('en-IN')})</span>
                        )}
                      </button>
                    </div>
                  );
                })()}
                  </>
                )}
              </>
            ) : (
              <div className="py-8 flex flex-col items-center text-center gap-4 animate-scaleUp">
                <div className="w-16 h-16 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 text-3xl font-bold animate-pulse">
                  ✓
                </div>
                <div>
                  <h3 className="font-heading font-black text-md text-stone-850">Direct Sourcing Order Placed!</h3>
                  <p className="text-[10px] text-stone-500 font-bold mt-1.5 leading-relaxed">
                    Escrow security has locked payment. The artisans have been notified.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCartModal(false);
                    setCheckoutSuccess(false);
                    setCurrentView('orders');
                  }}
                  className="w-full py-3 bg-stone-900 text-white rounded-2xl text-xs font-black hover:bg-stone-850 active:scale-95 transition-all mt-4"
                >
                  View My Sourcing Orders
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* 7. INSTAGRAM POST OPTIONS MODAL */}
      {activeOptionsProductId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-6" style={{ zIndex: 100 }}>
          <div className="bg-white rounded-[32px] w-full max-w-[280px] overflow-hidden flex flex-col animate-scaleUp border border-stone-200 text-center">
            {/* Not Interested Option */}
            <button 
              onClick={() => {
                setHiddenProductIds(prev => [...prev, activeOptionsProductId]);
                setActiveOptionsProductId(null);
                alert("Product hidden. We'll show you fewer products like this.");
              }}
              className="py-4.5 text-sm font-extrabold text-stone-850 hover:bg-stone-50 border-b border-stone-150 transition-colors"
            >
              Not Interested
            </button>

            {/* Report Option */}
            <button 
              onClick={() => {
                const reason = prompt("Why are you reporting this product?\n1. Intellectual Property Violation\n2. Inappropriate Content\n3. Misleading Spec details");
                if (reason !== null) {
                  setActiveOptionsProductId(null);
                  alert("Thank you. This product has been flagged for catalog review.");
                }
              }}
              className="py-4.5 text-sm font-extrabold text-red-500 hover:bg-stone-50 border-b border-stone-150 transition-colors"
            >
              Report Post
            </button>

            {/* Cancel Option */}
            <button 
              onClick={() => setActiveOptionsProductId(null)}
              className="py-4 text-sm font-bold text-stone-400 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* 8. INSTAGRAM POST VIEWER MODAL */}
      {instaPostProduct && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-6" style={{ zIndex: 100 }}>
          <div className="bg-white rounded-[32px] w-full max-w-[350px] overflow-hidden relative shadow-2xl flex flex-col max-h-[90%] animate-scaleUp border border-stone-200">
            {/* Close Button */}
            <button
              onClick={() => setInstaPostProduct(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white z-50 flex items-center justify-center font-bold"
            >
              ×
            </button>

            <div className="overflow-y-auto no-scrollbar flex-1 pb-4">
              {/* Product Card Structure */}
              <div className="flex flex-col bg-white">
                {/* Header: Artisan details */}
                <div className="p-4 flex justify-between items-center border-b border-stone-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${instaPostProduct.avatarBg} flex items-center justify-center font-heading font-black text-sm shrink-0 shadow-inner`}>
                      {instaPostProduct.avatarChar}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-stone-850">{instaPostProduct.artisanName}</h4>
                      <span className="text-[9px] text-text-secondary font-bold block mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{instaPostProduct.location}</span>
                      </span>
                    </div>
                  </div>

                  {followedArtisans.includes(instaPostProduct.artisanName) ? (
                    <button 
                      onClick={() => handleToggleFollow(instaPostProduct.artisanName)}
                      className="text-[10px] font-extrabold text-stone-400 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200 shadow-sm transition-all"
                    >
                      Following
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleFollow(instaPostProduct.artisanName)}
                      className="text-[10px] font-extrabold text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35] hover:text-white px-3 py-1.5 rounded-full border border-[#FF6B35]/20 shadow-sm transition-all"
                    >
                      Follow
                    </button>
                  )}
                </div>

                {/* Post Image with Double Tap Like */}
                <div 
                  onClick={(e) => {
                    if (e.detail === 2) {
                      handleDoubleTapLike(instaPostProduct);
                    }
                  }}
                  className="w-full aspect-[4/5] shrink-0 bg-stone-100 overflow-hidden relative cursor-pointer select-none"
                >
                  <img 
                    src={instaPostProduct.image} 
                    alt={instaPostProduct.name} 
                    className="w-full h-full object-cover"
                  />

                  {/* Heart pop animation */}
                  {showHeartPop === instaPostProduct.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-10 animate-fade">
                      <div className="bg-white/95 backdrop-blur-xs rounded-full p-4.5 shadow-premium animate-bounce">
                        <Heart className="w-10 h-10 text-red-500 fill-red-500" />
                      </div>
                    </div>
                  )}

                  {!instaPostProduct.isGalleryItem && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(instaPostProduct);
                      }}
                      className="absolute bottom-3 right-3 flex items-center justify-center text-white transition-all active:scale-90 hover:scale-108"
                      style={{ filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.55))' }}
                      title="Add to Sourcing Cart"
                    >
                      <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 8a4 4 0 0 1 8 0" />
                        <path d="M5 8h14v5" />
                        <path d="M5 8v10a2 2 0 0 0 2 2h6" />
                        <path d="M18 15v6M15 18h6" strokeWidth="2.8" className="text-[#FF6B35]" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Bottom Details block */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-black text-stone-850 font-heading leading-tight text-left">
                      {instaPostProduct.name}
                    </h3>

                    {instaPostProduct.description && (
                      <p className="text-[10px] font-semibold text-stone-500 text-left mt-2 leading-relaxed">
                        {instaPostProduct.description}
                      </p>
                    )}
                    
                    {/* Price, MOQ, Likes, Comments, Share values on a single line */}
                    <div className="flex justify-between items-center mt-3 text-xs font-bold text-stone-800 border-t border-stone-100 pt-3">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleLikeToggle(instaPostProduct); }}
                          className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                        >
                          <Heart 
                            className={`w-4.5 h-4.5 transition-colors ${
                              likedItemIds.includes(instaPostProduct.id) 
                                ? 'text-red-500 fill-red-500' 
                                : 'text-stone-500 hover:text-red-500'
                            }`} 
                          />
                          <span className="text-[11px] font-extrabold text-stone-600">{instaPostProduct.likes}</span>
                        </button>

                        {/* Comment Button */}
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setExpandedCommentProductId(prev => prev === instaPostProduct.id ? null : instaPostProduct.id); 
                          }}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                          title="Comments"
                        >
                          <MessageSquare className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                          <span className="text-[11px] font-extrabold text-stone-600">{productComments[instaPostProduct.id]?.length || instaPostProduct.comments || 0}</span>
                        </button>

                        {/* Share Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleShareProduct(instaPostProduct); }}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors ml-0.5"
                          title="Share Link"
                        >
                          <Share2 className="w-4.5 h-4.5 text-stone-500 hover:text-primary transition-colors" />
                        </button>

                        {!instaPostProduct.isGalleryItem && (
                          /* MOQ */
                          <div className="flex items-center gap-1.5 text-stone-600">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                              <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
                            </svg>
                            <span className="text-[11px]">MOQ: <span className="text-stone-850 font-black">{instaPostProduct.moq} pcs</span></span>
                          </div>
                        )}
                      </div>

                      {!instaPostProduct.isGalleryItem && (
                        /* Price */
                        <div className="text-sm font-black text-[#FF6B35]">
                          ₹{instaPostProduct.price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Comments Section */}
                  {expandedCommentProductId === instaPostProduct.id && (
                    <div className="mt-2 border-t border-stone-100 pt-3 flex flex-col gap-3 text-left">
                      <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-wider">Comments</h4>
                      
                      {/* Comments List */}
                      <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1 no-scrollbar">
                        {(() => {
                          const currentComments = productComments[instaPostProduct.id] || [];
                          const displayComments = currentComments.length > 0 
                            ? currentComments 
                            : Array.from({ length: Math.min(3, instaPostProduct.comments || 0) }).map((_, i) => ({
                                id: `mock-${i}`,
                                author: i === 0 ? 'Kavita Sharma (Artisan)' : i === 1 ? 'Rajesh Kumar (Sourcing)' : 'Sunita Handlooms',
                                text: i === 0 ? 'Each weave takes about 3 days to perfect. Happy to answer questions!' : i === 1 ? 'Is the MOQ negotiable for custom colorways?' : 'We ordered 5 batches last week, excellent zari border finish.',
                                timestamp: `${i + 1}d ago`,
                                avatarChar: i === 0 ? 'K' : i === 1 ? 'R' : 'S',
                                avatarBg: i === 0 ? 'bg-purple-600' : i === 1 ? 'bg-indigo-600' : 'bg-rose-600'
                              }));

                          return displayComments.map(comment => (
                            <div key={comment.id} className="flex gap-2 items-start text-left">
                              <div className={`w-5.5 h-5.5 rounded-full ${comment.avatarBg || 'bg-stone-200'} shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white`}>
                                {comment.avatarChar || 'U'}
                              </div>
                              <div className="flex-1 bg-stone-50 rounded-xl p-2 border border-stone-150">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="text-[9px] font-black text-stone-850">{comment.author}</span>
                                  <span className="text-[7.5px] text-stone-450 font-bold">{comment.timestamp}</span>
                                </div>
                                <p className="text-[9.5px] font-semibold text-stone-600 leading-normal">{comment.text}</p>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      {/* Post comment input box */}
                      <div className="flex gap-1.5 pt-1.5 border-t border-stone-100">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newCommentText.trim()) {
                              handlePostCommentInline(instaPostProduct);
                            }
                          }}
                          className="flex-1 text-[10px] font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1.5 focus:ring-primary focus:bg-white"
                        />
                        <button
                          onClick={() => handlePostCommentInline(instaPostProduct)}
                          disabled={!newCommentText.trim()}
                          className="bg-primary hover:bg-[#E55A25] disabled:bg-stone-300 text-white rounded-xl px-3 text-[10px] font-black active:scale-95 transition-all"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                  {!instaPostProduct.isGalleryItem && (
                    /* Actions Row */
                    <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 mt-1">
                      <button
                        onClick={() => {
                          const isSynced = syncedIds.some(id => id.includes(instaPostProduct.id) || (instaPostProduct.id === 'exp-1' && syncedIds.includes('p-1')));
                          if (!isSynced) {
                            handleSyncToStore(instaPostProduct.id, instaPostProduct.name);
                            setInstaPostProduct(null);
                          }
                        }}
                        className={`flex items-center justify-center gap-1 py-3 rounded-2xl text-[10px] font-extrabold border transition-all ${
                          syncedIds.some(id => id.includes(instaPostProduct.id) || (instaPostProduct.id === 'exp-1' && syncedIds.includes('p-1'))) 
                            ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-[#FF6B35] hover:bg-[#E55A25] text-white border-[#FF6B35] shadow shadow-orange-500/10 active:scale-98'
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                        <span>Sync to My Store</span>
                      </button>

                      <button
                        onClick={() => {
                          setInstaPostProduct(null);
                          handleBuyNow(instaPostProduct);
                        }}
                        className="py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] font-extrabold transition-all"
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={() => {
                          setInstaPostProduct(null);
                          handleAddToCollectionClick(instaPostProduct);
                        }}
                        className="py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] font-extrabold transition-all"
                      >
                        + Collection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Check badge helper icon
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
