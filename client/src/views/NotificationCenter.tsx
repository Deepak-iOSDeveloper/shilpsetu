import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, Heart, MessageSquare, Users, Eye, Bookmark,
  ClipboardList, FileCheck, ShoppingBag, CreditCard, Truck,
  Video, Award, Info, Sparkles, Check, Trash2
} from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'activity' | 'business' | 'announcement';
  message: string;
  boldText?: string;
  time: string;
  read: boolean;
  avatarBg?: string;
  avatarChar?: string;
}

export const NotificationCenter: React.FC = () => {
  const { activeRole, currentView, setCurrentView } = useApp();

  // Artisan Seeds
  const artisanNotifs: NotificationItem[] = [
    // 1. Activity (Social Notifications)
    { id: 'notif-act-1', category: 'activity', boldText: 'Ravi Sharma', message: ' liked your Banarasi Saree.', time: '5 mins ago', read: false, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '❤️' },
    { id: 'notif-act-2', category: 'activity', boldText: 'Anita Handloom', message: ' commented on your product: "Beautiful weave, love the gold borders!"', time: '1 hour ago', read: false, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '💬' },
    { id: 'notif-act-3', category: 'activity', boldText: '5 artisans', message: ' started following you today.', time: '4 hours ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '👥' },
    { id: 'notif-act-4', category: 'activity', boldText: 'Your portfolio', message: ' received 120 new views this week.', time: '2 days ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '👁️' },
    { id: 'notif-act-5', category: 'activity', boldText: 'A buyer', message: ' bookmarked your product "Jaipur Cotton Block-Print Saree".', time: '3 days ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '🔖' },

    // 2. Business (Transactional Notifications)
    { id: 'notif-biz-1', category: 'business', boldText: 'New RFQ', message: ' matching your craft is available: "Banarasi Silk Saree (50 pcs)".', time: '10 mins ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '📋' },
    { id: 'notif-biz-2', category: 'business', boldText: 'Your quotation', message: ' has been shortlisted by FabIndia Boutique.', time: '30 mins ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🏆' },
    { id: 'notif-biz-3', category: 'business', boldText: 'New order received', message: ' for ORD-944160 (₹13,00,000).', time: '2 hours ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🛍️' },
    { id: 'notif-biz-4', category: 'business', boldText: 'Payment credited', message: ' to your wallet: ₹22,500 from last settlement.', time: '1 day ago', read: true, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '💰' },
    { id: 'notif-biz-5', category: 'business', boldText: 'Order delivered', message: ' successfully: ORD-2026-1050 to Mumbai Hub.', time: '3 days ago', read: true, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🚚' },

    // 3. Announcements (General Platform / Schemes Notifications)
    { id: 'notif-ann-1', category: 'announcement', boldText: 'Free online workshop:', message: ' "How to Photograph Your Products" starts tomorrow.', time: '1 day ago', read: false, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '📢' },
    { id: 'notif-ann-2', category: 'announcement', boldText: 'New webinar:', message: ' "Sustainable dyeing techniques for organic silk warp".', time: '2 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🎓' },
    { id: 'notif-ann-3', category: 'announcement', boldText: 'Government scheme:', message: ' Mudra Loan credit assistance updates for Handloom clusters.', time: '4 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🏛️' },
    { id: 'notif-ann-4', category: 'announcement', boldText: 'New AI feature:', message: ' VibeMatch Background Studio is now available on Shilp Setu.', time: '5 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🔮' }
  ];

  // Brand Seeds
  const brandNotifs: NotificationItem[] = [
    // 1. Activity (Social / Supplier Updates)
    { id: 'notif-brand-act-1', category: 'activity', boldText: 'Ramesh Kumar', message: ' posted a new update in Community.', time: '12 mins ago', read: false, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '💬' },
    { id: 'notif-brand-act-2', category: 'activity', boldText: 'Kavita Sharma', message: ' uploaded a new craft portfolio: "Chanderi Handloom".', time: '1 hour ago', read: false, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '👁️' },
    { id: 'notif-brand-act-3', category: 'activity', boldText: 'You followed', message: ' a new supplier: "Jaipur Block Prints".', time: '3 hours ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '👥' },
    { id: 'notif-brand-act-4', category: 'activity', boldText: '12 new artisans', message: ' joined Shilp Setu in your preferred region (Varanasi).', time: '1 day ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '👥' },
    { id: 'notif-brand-act-5', category: 'activity', boldText: 'Ramesh Kumar', message: ' updated their artisan bio: "4th generation master weaver...".', time: '2 days ago', read: true, avatarBg: 'bg-rose-100 text-rose-600', avatarChar: '🔖' },

    // 2. Business (Procurement / Sync Notifications)
    { id: 'notif-brand-biz-1', category: 'business', boldText: 'New product added', message: ' by Ramesh Kumar matching your interests: "Maroon Pure Silk Banarasi Saree".', time: '5 mins ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🛍️' },
    { id: 'notif-brand-biz-2', category: 'business', boldText: 'Artisan Ramesh Kumar', message: ' submitted a quote for your RFQ "Banarasi Silk Saree (50 pcs)".', time: '15 mins ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '📋' },
    { id: 'notif-brand-biz-3', category: 'business', boldText: 'Order status updated', message: ' for SS-2505-1023: "Shipped to Hub".', time: '1 hour ago', read: false, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🚚' },
    { id: 'notif-brand-biz-4', category: 'business', boldText: 'Escrow payment locked', message: ' successfully for Order ORD-2026-001: ₹2,50,000.', time: '1 day ago', read: true, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '💰' },
    { id: 'notif-brand-biz-5', category: 'business', boldText: 'Delhi Inspection Hub', message: ' has received your shipment for Order SS-2505-1023.', time: '2 days ago', read: true, avatarBg: 'bg-blue-100 text-blue-600', avatarChar: '🏆' },

    // 3. Announcements (Corporate Sourcing Fair & Compliance)
    { id: 'notif-brand-ann-1', category: 'announcement', boldText: 'Shilp Setu Sourcing Fair 2026:', message: ' Meet 200+ National Awardee artisans in New Delhi next month.', time: '1 day ago', read: false, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '📢' },
    { id: 'notif-brand-ann-2', category: 'announcement', boldText: 'AI Studio updates:', message: ' Model-fit studio now supports 4:5 portrait saree renders.', time: '2 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🔮' },
    { id: 'notif-brand-ann-3', category: 'announcement', boldText: 'Procurement policy update:', message: ' New GST compliance guidelines for handicraft procurement.', time: '3 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🏛️' },
    { id: 'notif-brand-ann-4', category: 'announcement', boldText: 'Webinar invite:', message: ' "Sourcing authentic handloom directly from Madanpura clusters".', time: '5 days ago', read: true, avatarBg: 'bg-purple-100 text-purple-600', avatarChar: '🎓' }
  ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    activeRole === 'BRAND' ? brandNotifs : artisanNotifs
  );

  React.useEffect(() => {
    setNotifications(activeRole === 'BRAND' ? brandNotifs : artisanNotifs);
  }, [activeRole]);

  const [activeTab, setActiveTab] = useState<string>('all');

  // Helper functions
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    alert("All notifications marked as read.");
  };

  const toggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Helper to render matching icon depending on notification content
  const renderNotifIcon = (n: NotificationItem) => {
    if (n.category === 'activity') {
      if (n.avatarChar === '❤️') return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
      if (n.avatarChar === '💬') return <MessageSquare className="w-5 h-5 text-rose-500" />;
      if (n.avatarChar === '👥') return <Users className="w-5 h-5 text-rose-500" />;
      if (n.avatarChar === '👁️') return <Eye className="w-5 h-5 text-rose-500" />;
      return <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />;
    } else if (n.category === 'business') {
      if (n.avatarChar === '📋') return <ClipboardList className="w-5 h-5 text-blue-600" />;
      if (n.avatarChar === '🏆') return <FileCheck className="w-5 h-5 text-blue-600" />;
      if (n.avatarChar === '🛍️') return <ShoppingBag className="w-5 h-5 text-blue-600" />;
      if (n.avatarChar === '💰') return <CreditCard className="w-5 h-5 text-blue-600" />;
      return <Truck className="w-5 h-5 text-blue-600" />;
    } else {
      if (n.avatarChar === '📢') return <Video className="w-5 h-5 text-purple-600" />;
      if (n.avatarChar === '🎓') return <Video className="w-5 h-5 text-purple-600" />;
      if (n.avatarChar === '🏛️') return <Award className="w-5 h-5 text-purple-600" />;
      return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  // Filter items
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute inset-0 bg-[#FFF8F1] flex flex-col z-10 text-left overflow-hidden font-sans">
      
      {/* 1. HEADER */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <div>
            <h2 className="font-heading font-black text-lg text-stone-850">Notifications</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread updates waiting` : 'Your notifications center is clean'}
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* 2. FILTER PILLS */}
      <div className="px-5 py-3.5 bg-white border-b border-stone-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {[
          { key: 'all', label: 'All' },
          { key: 'activity', label: '❤️ Activity' },
          { key: 'business', label: '📦 Business' },
          { key: 'announcement', label: '📢 Announcements' }
        ].map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. NOTIFICATIONS LIST CONTAINER */}
      <div className="p-5 flex-1 overflow-y-auto no-scrollbar pb-[96px] flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <div 
              key={n.id}
              className={`p-4 rounded-3xl border flex gap-3.5 shadow-sm transition-all items-start relative overflow-hidden group shrink-0 ${
                n.read 
                  ? 'bg-white border-stone-150' 
                  : 'bg-white border-primary/20 ring-1 ring-primary/5'
              }`}
            >
              {/* Unread Indicator Bar */}
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}

              {/* Notification icon circle */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                n.category === 'activity' 
                  ? 'bg-rose-50 border border-rose-100/50' 
                  : n.category === 'business'
                    ? 'bg-blue-50 border border-blue-100/50'
                    : 'bg-purple-50 border border-purple-100/50'
              }`}>
                {renderNotifIcon(n)}
              </div>

              {/* Text content details */}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {n.boldText && (
                    <span className="font-black text-stone-900 mr-0.5">{n.boldText}</span>
                  )}
                  {n.message}
                </p>
                <span className="text-[9px] text-stone-400 font-bold block mt-1.5">
                  {n.time}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-stone-400 text-xs font-bold flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-white border border-stone-200 rounded-2xl flex items-center justify-center text-lg">
              ✨
            </div>
            <span>No notifications in this category.</span>
          </div>
        )}
      </div>

    </div>
  );
};
