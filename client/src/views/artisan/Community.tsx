import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, MessageSquare, Heart, Share2, Bookmark, 
  Plus, X, Camera, MapPin, Send, MoreVertical, Image, 
  Award, Globe, Bell, Store
} from 'lucide-react';

export const Community: React.FC = () => {
  const { portfolioPosts, addPortfolioPost, currentUser, setCurrentView, logout, deletePortfolioPost } = useApp();

  // Bio Editing & Dropdown menu states
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [activePostMenuIndex, setActivePostMenuIndex] = useState<number | null>(null);

  // Instagram-style Likes & Comments States
  const [followedArtisans, setFollowedArtisans] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});
  const [showHeartPop, setShowHeartPop] = useState<Record<number, boolean>>({});
  const [lastTap, setLastTap] = useState<number>(0);
  
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [postComments, setPostComments] = useState<Record<number, Array<{author: string, text: string, time: string}>>>({
    0: [
      { author: 'Ananya Goel', text: 'This looks absolutely stunning! Great work, Kavita! 😍', time: '2h ago' },
      { author: 'Fabindia Sourcing', text: 'Incredible texture and pattern. Please DM us details.', time: '1h ago' }
    ],
    1: [
      { author: 'Ramesh Kumar', text: 'A beautifully balanced sculpture. Excellent detailing!', time: '4h ago' }
    ]
  });

  const handleLikeToggle = (idx: number) => {
    const isLiked = !likedPosts[idx];
    setLikedPosts(prev => ({ ...prev, [idx]: isLiked }));
    
    if (isLiked) {
      // Trigger heart popup animation
      setShowHeartPop(prev => ({ ...prev, [idx]: true }));
      setTimeout(() => {
        setShowHeartPop(prev => ({ ...prev, [idx]: false }));
      }, 700);
    }
  };

  const handleAddComment = (idx: number) => {
    const text = commentInputs[idx]?.trim();
    if (!text) return;

    const newComment = {
      author: currentUser?.name || 'Ramesh Kumar',
      text: text,
      time: 'Just now'
    };

    setPostComments(prev => ({
      ...prev,
      [idx]: [...(prev[idx] || []), newComment]
    }));
    setCommentInputs(prev => ({ ...prev, [idx]: '' }));
  };

  // Create Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('BTS');
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Profile overlay states (for visiting another artisan's profile)
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
  const [previewGalleryItem, setPreviewGalleryItem] = useState<any | null>(null);

  // Mock preset images for quick selection if they don't upload
  const PRESET_IMAGES = [
    { name: "Weaving Shuttle", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500" },
    { name: "Organic Dye Vat", url: "https://images.unsplash.com/photo-1603006905393-af5c083652ea?w=500" },
    { name: "Block Print Teak Wood", url: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=500" },
    { name: "Master Weaving Loom", url: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=500" }
  ];

  const handleOpenArtisanProfile = (name: string, location: string, avatarBg: string, avatarChar: string) => {
    setSelectedArtisan({
      name,
      avatarBg,
      avatarChar,
      location,
      rating: 4.8,
      followers: '2.4K',
      productsCount: 14,
      bio: `Award-winning master artisan in traditional crafts. Specializing in pure cotton prints, natural dyes, and historical weaving patterns passed down through generations in ${location.split(',')[0]}.`,
      isFollowing: false
    });
  };

  const handleOpenMyProfile = () => {
    setSelectedArtisan({
      name: currentUser?.name || "Ramesh Kumar",
      avatarBg: "bg-primary text-white",
      avatarChar: currentUser?.name ? currentUser.name.charAt(0) : "R",
      location: "Varanasi, Uttar Pradesh",
      rating: 4.7,
      followers: '1.5K',
      productsCount: 10,
      bio: "Master artisan in block printing and handloom organic cotton fabric. UNESCO crafts seal awardee.",
      isFollowing: false
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setPostImage(url);
  };

  const handleSharePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) {
      alert("Please add a title for your post.");
      return;
    }
    if (!postDescription.trim()) {
      alert("Please add a description.");
      return;
    }

    const finalImage = postImage || PRESET_IMAGES[0].url;

    addPortfolioPost({
      artisanName: currentUser?.name || "Ramesh Kumar",
      avatarBg: "bg-primary text-white",
      avatarChar: currentUser?.name ? currentUser.name.charAt(0) : "R",
      location: "Varanasi, Uttar Pradesh",
      title: postTitle,
      category: postCategory,
      image: finalImage,
      description: postDescription
    });

    // Reset Form
    setPostTitle('');
    setPostCategory('BTS');
    setPostDescription('');
    setPostImage('');
    setImagePreviewUrl(null);
    setShowCreateModal(false);

    alert("Shared successfully to the ShilpSetu Community feed!");
  };

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col z-10 text-left overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex flex-col gap-3 sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading font-black text-2xl text-stone-850 tracking-tight">Community</h1>
            <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-0.5 block">
              Artisan Guild & Portfolios
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Post Button */}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 bg-[#FF6B35] rounded-full shadow hover:bg-[#E55A25] transition-all"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Post</span>
            </button>

            {/* Account Profile Button */}
            <button 
              onClick={handleOpenMyProfile}
              className="w-9 h-9 rounded-full border-[2.2px] border-[#FF6B35] overflow-hidden flex items-center justify-center relative shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer bg-stone-100"
              aria-label="My Profile"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" 
                alt="My Profile"
                className="w-full h-full object-cover" 
              />
            </button>

            {/* Messages Button */}
            <button 
              onClick={() => setCurrentView('messages')}
              className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center relative shadow-sm hover:bg-stone-100 transition-all shrink-0 active:scale-95"
              aria-label="Messages"
            >
              <MessageSquare className="w-5 h-5 text-stone-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF6B35] rounded-full border border-white" />
            </button>

            <button className="w-10 h-10 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center relative shadow-sm hover:bg-stone-100">
              <Bell className="w-5 h-5 text-stone-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. INSTAGRAM FEED SECTION */}
      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-[100px] flex flex-col gap-6">
        {portfolioPosts.map((g, idx) => (
          <Card
            key={idx}
            padding="none"
            className="bg-white rounded-3xl border border-stone-150 overflow-hidden flex flex-col shadow-sm shrink-0"
          >
            {/* Post Header */}
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
              
              <div className="flex items-center gap-2">
                {g.artisanName !== (currentUser?.name || "Ramesh Kumar") && (
                  <button
                    onClick={() => {
                      const name = g.artisanName;
                      setFollowedArtisans(prev => ({ ...prev, [name]: !prev[name] }));
                    }}
                    className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider active:scale-95 transition-all shadow-sm ${
                      followedArtisans[g.artisanName]
                        ? 'bg-stone-100 text-stone-500 border border-stone-250'
                        : 'bg-[#FF6B35] text-white hover:bg-[#E55A25]'
                    }`}
                  >
                    {followedArtisans[g.artisanName] ? 'Following' : 'Follow'}
                  </button>
                )}

                {g.artisanName === (currentUser?.name || "Ramesh Kumar") && (
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePostMenuIndex(activePostMenuIndex === idx ? null : idx);
                      }}
                      className="w-7 h-7 rounded-full hover:bg-stone-50 flex items-center justify-center text-stone-500 hover:text-stone-850 transition-all shrink-0 active:scale-95 cursor-pointer"
                      aria-label="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {activePostMenuIndex === idx && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setActivePostMenuIndex(null)}
                        />
                        <div className="absolute right-0 mt-1 bg-white border border-stone-200 rounded-2xl shadow-lg py-1.5 w-28 z-50 animate-fadeIn">
                          <button
                            onClick={() => {
                              setActivePostMenuIndex(null);
                              if (confirm(`Are you sure you want to delete this post: "${g.title}"?`)) {
                                deletePortfolioPost(g.title);
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-black text-red-650 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            Delete Post
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post Image Container (Double-tap to like) */}
            <div 
              onClick={(e) => {
                const now = Date.now();
                const DOUBLE_PRESS_DELAY = 300;
                if (now - lastTap < DOUBLE_PRESS_DELAY) {
                  handleLikeToggle(idx);
                }
                setLastTap(now);
              }}
              className="w-full aspect-[4/3] bg-stone-100 overflow-hidden border-b border-stone-50 cursor-pointer relative select-none"
            >
              <img src={g.image} alt={g.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
              
              {/* Animated Big Heart Pop */}
              {showHeartPop[idx] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 animate-fadeIn">
                  <div className="animate-heart-pop bg-white/20 p-5 rounded-full backdrop-blur-xs shadow-lg">
                    <Heart className="w-14 h-14 text-white fill-white drop-shadow-md" />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="p-4 pb-2.5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleLikeToggle(idx)} 
                  className={`hover:scale-110 active:scale-95 transition-all ${likedPosts[idx] ? 'text-red-500' : 'text-stone-600 hover:text-red-550'}`}
                >
                  <Heart className={`w-5 h-5 ${likedPosts[idx] ? 'fill-current text-red-500' : ''}`} />
                </button>
                <button 
                  onClick={() => setExpandedComments(prev => ({ ...prev, [idx]: !prev[idx] }))} 
                  className="hover:scale-110 active:scale-95 transition-all text-stone-600 hover:text-primary"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }} 
                  className="hover:scale-110 active:scale-95 transition-all text-stone-600 hover:text-primary"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => alert("Post saved to collections!")} 
                className="hover:scale-110 active:scale-95 transition-all text-stone-600 hover:text-primary"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>

            {/* Post Caption */}
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

            {/* Instagram-style Comment Section (below caption) */}
            {expandedComments[idx] && (
              <div className="border-t border-stone-100 bg-[#FFFBF8] p-4 flex flex-col gap-3 animate-fadeIn">
                {/* Comment list */}
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto no-scrollbar">
                  {(postComments[idx] || []).length > 0 ? (
                    (postComments[idx] || []).map((cmt, cIdx) => (
                      <div key={cIdx} className="text-[11px] leading-relaxed flex items-start gap-1.5">
                        <span className="font-black text-stone-800 shrink-0">@{cmt.author.toLowerCase().replace(/\s+/g, '_')}:</span>
                        <span className="text-stone-650 flex-1">{cmt.text}</span>
                        <span className="text-[8px] text-stone-450 font-bold shrink-0 mt-0.5">{cmt.time}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-stone-400 font-bold block py-1">No comments yet. Be the first to comment!</span>
                  )}
                </div>

                {/* Add comment input */}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[idx] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ ...prev, [idx]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(idx);
                    }}
                    className="flex-1 bg-white border border-stone-200 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-stone-800 focus:outline-none focus:border-[#FF6B35]/40"
                  />
                  <button 
                    onClick={() => handleAddComment(idx)}
                    className="w-7 h-7 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shadow hover:bg-[#E55A25] transition-all cursor-pointer shrink-0"
                    title="Send"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* 3. CREATE POST MODAL DIALOG */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF8F1] w-full max-w-sm rounded-[36px] overflow-hidden border border-stone-200 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-stone-150 bg-white">
              <h3 className="font-heading font-black text-base text-stone-850">Create Community Post</h3>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center bg-white hover:bg-stone-50"
              >
                <X className="w-4.5 h-4.5 text-stone-600" />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <form onSubmit={handleSharePost} className="p-5 overflow-y-auto no-scrollbar flex flex-col gap-4 text-left">
              {/* Image Uploader */}
              <div>
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider block mb-2">Upload Photo / Video</label>
                
                {imagePreviewUrl ? (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-100 group">
                    <img src={imagePreviewUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => { setImagePreviewUrl(null); setPostImage(''); }}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {/* File Dropzone */}
                    <div 
                      onClick={() => document.getElementById('community-file-uploader')?.click()}
                      className="w-full h-32 border-2 border-dashed border-[#FF6B35]/30 bg-white rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FF6B35]/5 transition-all"
                    >
                      <Camera className="w-8 h-8 text-[#FF6B35]" />
                      <span className="text-[10px] font-bold text-stone-600">Select Image from Device</span>
                      <input 
                        type="file" 
                        id="community-file-uploader" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </div>

                    {/* Presets Grid */}
                    <div>
                      <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Or Choose from craft templates:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {PRESET_IMAGES.map((p, pIdx) => (
                          <div 
                            key={pIdx} 
                            onClick={() => { setPostImage(p.url); setImagePreviewUrl(p.url); }}
                            className={`h-11 rounded-lg overflow-hidden border cursor-pointer ${postImage === p.url ? 'border-primary ring-2 ring-primary/20' : 'border-stone-250'}`}
                          >
                            <img src={p.url} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-inner flex items-center gap-2">
                <div className="w-10 h-10 bg-[#FFF5F1] rounded-xl flex items-center justify-center text-[#FF6B35] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-2">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Post Title</label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. Master Weaver Loom Setup"
                    className="w-full text-xs font-bold text-stone-800 placeholder:text-stone-300 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-inner flex items-center gap-2">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1 pr-2">
                  <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Post Category</label>
                  <select 
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full text-xs font-bold text-stone-800 focus:outline-none bg-transparent"
                  >
                    <option value="BTS">Behind The Scenes (BTS)</option>
                    <option value="Award">Awards & Achievements</option>
                    <option value="Verification">Certifications & Seals</option>
                  </select>
                </div>
              </div>

              {/* Description Caption */}
              <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-inner">
                <label className="text-[9px] font-black text-stone-400 uppercase tracking-wider block mb-1">Caption / Description</label>
                <textarea
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  placeholder="Share the story behind this craft technique, materials used, or details of this milestone..."
                  rows={3}
                  className="w-full text-xs font-medium text-stone-850 placeholder:text-stone-300 focus:outline-none bg-transparent resize-none leading-relaxed"
                />
              </div>

              {/* Submit Action */}
              <button 
                type="submit"
                className="w-full h-12 rounded-2xl bg-[#FF6B35] text-white text-xs font-black shadow-md hover:bg-[#E55A25] flex items-center justify-center gap-2 mt-2"
              >
                <Send className="w-4.5 h-4.5" />
                <span>Share to Community</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. VISITING ANOTHER ARTISAN'S INSTAGRAM PROFILE OVERLAY */}
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
            <div className="text-left mt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-stone-850 leading-tight">{selectedArtisan.name}</h3>
                {selectedArtisan.name === (currentUser?.name || "Ramesh Kumar") && !isEditingBio && (
                  <button 
                    onClick={() => {
                      setIsEditingBio(true);
                      setEditedBio(selectedArtisan.bio);
                    }}
                    className="text-[9px] font-black text-[#FF6B35] uppercase hover:underline cursor-pointer"
                  >
                    Edit Bio
                  </button>
                )}
              </div>
              <span className="text-[10px] text-stone-400 font-bold block mt-0.5">Master Craftsperson • National Award Winner</span>
              
              {isEditingBio ? (
                <div className="mt-2 flex flex-col gap-2">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full text-[11px] font-medium text-stone-600 leading-relaxed bg-white border border-[#FF6B35]/30 p-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-3 py-1 bg-stone-100 border border-stone-200 text-stone-650 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArtisan(prev => prev ? { ...prev, bio: editedBio } : null);
                        setIsEditingBio(false);
                      }}
                      className="px-3 py-1 bg-[#FF6B35] text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-medium text-stone-600 leading-relaxed mt-2 bg-stone-50 border border-stone-150 p-3 rounded-2xl">
                  {selectedArtisan.bio}
                </p>
              )}
              
              {/* Verified Partner Badge banner */}
              <div className="bg-[#FFFBF7] border border-[#FF6B35]/25 rounded-2xl p-3 flex items-center gap-2.5 mt-2.5 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#FF6B35] shrink-0">
                  <Award className="w-3.5 h-3.5" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-black text-stone-800">
                  Verified ShilpSetu Partner
                </span>
              </div>
            </div>

            {/* Action Buttons: Follow & Message (Only show for other artisans, hide for self) */}
            {selectedArtisan.name !== (currentUser?.name || "Ramesh Kumar") && (
              <div className="flex gap-2.5 mt-1">
                <button 
                  onClick={() => {
                    setSelectedArtisan(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null);
                  }}
                  className={`flex-1 py-3 rounded-2xl text-[11px] font-black transition-all ${
                    selectedArtisan.isFollowing 
                      ? 'bg-stone-100 text-stone-550 border border-stone-200' 
                      : 'bg-[#FF6B35] text-white hover:bg-[#E55A25] shadow shadow-orange-500/10'
                  }`}
                >
                  {selectedArtisan.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('messages');
                    setSelectedArtisan(null);
                  }}
                  className="flex-1 py-3 rounded-2xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-[11px] font-black transition-all"
                >
                  Message
                </button>
              </div>
            )}

            {/* Tab switch bar */}
            <div className="flex border-b border-stone-100 mt-4">
              <button
                onClick={() => setArtisanProfileTab('products')}
                className={`flex-1 py-3.5 flex items-center justify-center border-t-2 transition-all ${
                  artisanProfileTab === 'products'
                    ? 'border-stone-850 text-stone-850 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                <Store className="w-4.5 h-4.5 mr-1.5" />
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

            {/* Tab Content Display */}
            <div className="mt-4">
              {artisanProfileTab === 'products' ? (
                /* Products grid (3 columns) */
                <div className="grid grid-cols-3 gap-1.5">
                  {(selectedArtisan.name === "Ramesh Kumar" || selectedArtisan.name === currentUser?.name
                    ? [
                        { img: "/saree_blue.png", price: "₹4,999" },
                        { img: "/saree_green.png", price: "₹2,350" },
                        { img: "/stole_craft.png", price: "₹1,850" },
                        { img: "/saree_purple.png", price: "₹5,699" }
                      ]
                    : [
                        { img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200", price: "₹14,999" },
                        { img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200", price: "₹5,699" },
                        { img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200", price: "₹7,124" },
                        { img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200", price: "₹5,699" },
                        { img: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=200", price: "₹5,699" },
                        { img: "https://images.unsplash.com/photo-1603006905393-af5c083652ea?w=200", price: "₹2,450" }
                      ]
                  ).map((p, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="aspect-[4/5] bg-stone-100 border border-stone-50 overflow-hidden relative cursor-pointer group"
                      onClick={() => alert(`Opening product details: MRP ${p.price}`)}
                    >
                      <img src={p.img} alt="Artisan Product" className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.price}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Gallery & BTS grid (3 columns) */
                <div className="grid grid-cols-3 gap-1.5">
                  {portfolioPosts
                    .filter(g => g.artisanName === selectedArtisan.name)
                    .map((g, gIdx) => (
                      <div 
                        key={gIdx}
                        onClick={() => setPreviewGalleryItem(g)}
                        className="aspect-square bg-stone-100 border border-stone-50 overflow-hidden relative cursor-pointer group"
                      >
                        <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                        <div className="absolute top-1 right-1 bg-black/50 text-white text-[7px] px-1 rounded-sm uppercase tracking-wider font-extrabold scale-90">
                          {g.category}
                        </div>
                      </div>
                    ))}
                  {portfolioPosts.filter(g => g.artisanName === selectedArtisan.name).length === 0 && (
                    <div className="col-span-3 text-center py-8 text-stone-400 text-xs font-bold">
                      No portfolio items uploaded yet.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. PORTFOLIO ITEM DETAILED VIEW MODAL */}
      {previewGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-5">
          <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-sm border border-stone-200 shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black bg-stone-100 text-text-secondary px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {previewGalleryItem.category}
                </span>
                <span className="text-[10px] text-stone-400 font-bold">Verified Craft Post</span>
              </div>
              <button 
                onClick={() => setPreviewGalleryItem(null)}
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 bg-white"
              >
                <X className="w-4.5 h-4.5 text-stone-600" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="w-full aspect-[4/3] bg-stone-100 overflow-hidden relative">
              <img src={previewGalleryItem.image} alt={previewGalleryItem.title} className="w-full h-full object-cover" />
            </div>

            {/* Modal Body */}
            <div className="p-5 text-left flex flex-col gap-2">
              <h4 className="text-sm font-black text-stone-850 leading-tight">{previewGalleryItem.title}</h4>
              
              <div className="flex items-center gap-2 mt-1 shrink-0">
                <div className={`w-6 h-6 rounded-full ${previewGalleryItem.avatarBg} flex items-center justify-center font-heading font-black text-[9px]`}>
                  {previewGalleryItem.avatarChar}
                </div>
                <span className="text-[10px] font-black text-stone-700">@{previewGalleryItem.artisanName.toLowerCase().replace(/\s+/g, '_')}</span>
                <span className="text-[10px] text-stone-400">• {previewGalleryItem.location}</span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mt-2 p-3 bg-stone-50 border border-stone-150 rounded-2xl font-medium">
                {previewGalleryItem.description}
              </p>

              {previewGalleryItem.artisanName === (currentUser?.name || "Ramesh Kumar") && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this post?")) {
                      deletePortfolioPost(previewGalleryItem.title);
                      setPreviewGalleryItem(null);
                    }
                  }}
                  className="mt-2 w-full py-2.5 bg-red-50 text-red-655 border border-red-200 hover:bg-red-100/50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs select-none"
                >
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Post</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
