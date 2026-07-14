import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Search, Calendar, Globe, AlertCircle, 
  ChevronRight, Check, X, ShieldAlert, ShoppingBag, 
  CheckCircle, Package, Truck, Info, Settings
} from 'lucide-react';

// Custom Pot silhouette icon for Processing
const PotIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l1.5 5h-15z" />
    <path d="M4.5 8c0 5 3 10 7.5 13 4.5-3 7.5-8 7.5-13h-15z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export const ArtisanOrders: React.FC = () => {
  const { orders, updateOrderStatus, setCurrentView } = useApp();
  
  // Tab: Direct Retail vs RFQ Bulk Orders
  const [activeTab, setActiveTab] = useState<'Direct Retail' | 'RFQ Bulk Orders'>('Direct Retail');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('placed');

  // Status edit modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('placed');
  const [awbTrackingId, setAwbTrackingId] = useState('');

  // Map tab value to backend data model key
  const dataTabKey = activeTab === 'Direct Retail' ? 'customer' : 'RFQ';

  // Get dynamic counts for the grid cards
  const getCount = (status: string) => {
    return orders.filter(o => o.type === dataTabKey && o.status === status).length;
  };

  // Filter orders matching tab, active status grid filter, and search query
  const filteredOrders = orders
    .filter(o => o.type === dataTabKey)
    .filter(o => o.status === selectedStatusFilter)
    .filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.items && o.items[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const openStatusChange = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAwbTrackingId(order.awb || '');
    setShowStatusModal(true);
  };

  const handleSaveStatus = () => {
    if (!selectedOrder) return;

    const statusOrder = ['placed', 'processing', 'shipped_to_hub', 'delivered'];
    const currentIndex = statusOrder.indexOf(selectedOrder.status);
    const newIndex = statusOrder.indexOf(newStatus);
    
    if (newIndex < currentIndex) {
      alert("Error: Order status cannot transition backward.");
      return;
    }

    if (selectedOrder.status === 'delivered') {
      alert("Error: Delivered orders are locked and cannot be changed.");
      return;
    }

    if (newStatus === 'shipped_to_hub' && !awbTrackingId.trim()) {
      alert("Please enter a valid AWB / Tracking ID to mark this order as Ready to Ship.");
      return;
    }

    // Update status in global AppState
    updateOrderStatus(selectedOrder.id, newStatus);
    
    // Attach AWB tracking to the mock order in local scope
    selectedOrder.awb = awbTrackingId;
    
    setShowStatusModal(false);
    setSelectedOrder(null);
    alert(`Order #${selectedOrder.id} status successfully updated to ${newStatus.toUpperCase()}`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'processing':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'shipped_to_hub':
        return 'bg-green-50 text-[#2E7D32] border border-[#2E7D32]/20';
      case 'delivered':
        return 'bg-stone-50 text-stone-600 border border-stone-200';
      default:
        return 'bg-stone-50 text-stone-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'placed': return 'New Order';
      case 'processing': return 'Processing';
      case 'shipped_to_hub': return 'Ready to Ship';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 bg-[#FFF8F1]">
      
      {/* 1. HEADER (Title & back navigation button) */}
      <div className="p-6 pb-4 bg-white border-b border-primary/5 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm hover:bg-stone-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h2 className="font-heading font-black text-xl text-stone-850">Orders</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Manage your orders with ease
            </span>
          </div>
        </div>

        {/* Horizontal Capsules Tab Selector (Direct Retail vs RFQ Bulk Orders) */}
        <div className="bg-[#FFF5F1] p-1.5 rounded-2xl flex border border-primary/5 shadow-inner">
          <button
            onClick={() => setActiveTab('Direct Retail')}
            className={`flex-1 py-2.5 text-xs font-black text-center rounded-xl transition-all ${
              activeTab === 'Direct Retail'
                ? 'bg-white text-primary shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Direct Retail
          </button>
          <button
            onClick={() => setActiveTab('RFQ Bulk Orders')}
            className={`flex-1 py-2.5 text-xs font-black text-center rounded-xl transition-all ${
              activeTab === 'RFQ Bulk Orders'
                ? 'bg-white text-primary shadow'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            RFQ Bulk Orders
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer or Product..."
            className="w-full text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. HORIZONTAL STATUS GRID CARDS (4 Column layout matching mockup exactly) */}
      <div className="p-4 grid grid-cols-4 gap-2.5 shrink-0">
        
        {/* Status card 1: New Orders */}
        <button
          onClick={() => setSelectedStatusFilter('placed')}
          className={`rounded-3xl p-3 text-center flex flex-col items-center justify-center min-h-[75px] border transition-all ${
            selectedStatusFilter === 'placed'
              ? 'border-orange-500 bg-[#FFF5EE] scale-102 shadow-sm'
              : 'border-primary/5 bg-[#FFF8F3] hover:border-orange-200'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-[9px] font-black text-stone-600 mt-2 block">New Orders</span>
        </button>

        {/* Status card 2: Processing */}
        <button
          onClick={() => setSelectedStatusFilter('processing')}
          className={`rounded-3xl p-3 text-center flex flex-col items-center justify-center min-h-[75px] border transition-all ${
            selectedStatusFilter === 'processing'
              ? 'border-amber-600 bg-[#FFFCE8] scale-102 shadow-sm'
              : 'border-primary/5 bg-[#FFFDF2] hover:border-amber-200'
          }`}
        >
          <div className="relative">
            <PotIcon className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-[9px] font-black text-stone-600 mt-2 block">Processing</span>
        </button>

        {/* Status card 3: Ready to Ship */}
        <button
          onClick={() => setSelectedStatusFilter('shipped_to_hub')}
          className={`rounded-3xl p-3 text-center flex flex-col items-center justify-center min-h-[75px] border transition-all ${
            selectedStatusFilter === 'shipped_to_hub'
              ? 'border-green-600 bg-[#F1FAF0] scale-102 shadow-sm'
              : 'border-primary/5 bg-[#F8FDF7] hover:border-green-200'
          }`}
        >
          <div className="relative">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-[9px] font-black text-stone-600 mt-2 block">Ready to Ship</span>
        </button>

        {/* Status card 4: Shipped to Hub */}
        <button
          onClick={() => setSelectedStatusFilter('delivered')}
          className={`rounded-3xl p-3 text-center flex flex-col items-center justify-center min-h-[75px] border transition-all ${
            selectedStatusFilter === 'delivered'
              ? 'border-blue-600 bg-[#F0F4FA] scale-102 shadow-sm'
              : 'border-primary/5 bg-[#F6F9FD] hover:border-blue-200'
          }`}
        >
          <div className="relative">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-[9px] font-black text-stone-600 mt-2 block">Shipped to Hub</span>
        </button>

      </div>

      {/* 3. ORDER CARDS SCROLL FEED */}
      <div className="px-4 flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[calc(100vh-325px)]">
        {filteredOrders.map((order) => {
          const item = order.items && order.items[0];
          
          return (
            <Card 
              key={order.id} 
              padding="none" 
              className="bg-white rounded-3xl border border-primary/5 shadow-premium flex flex-col overflow-hidden hover:border-primary/20 transition-all select-none"
            >
              <div className="p-4 flex gap-4">
                {/* Left side: Product Image */}
                <div className="w-16 aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img 
                    src={item?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'} 
                    alt={item?.name || 'Banarasi Saree'} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Right side: details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-[10px] font-black text-[#B3562C] truncate">
                      Order ID: {order.id}
                    </span>
                    
                    <div className="flex items-center gap-1 text-[9px] text-text-secondary font-bold shrink-0 bg-stone-50 border border-stone-200/50 px-2 py-0.5 rounded">
                      <Globe className="w-3 h-3 text-stone-400" />
                      <span>Brand Website</span>
                    </div>
                  </div>

                  <h3 className="text-xs font-black text-stone-850 leading-tight mt-1 truncate">
                    {item?.name || 'Banarasi Saree'}
                  </h3>

                  <span className="text-[10px] text-text-secondary font-bold block mt-1 leading-none">
                    Qty: {order.qty} pieces
                  </span>

                  <div className="flex justify-between items-center mt-2.5">
                    <div className="flex items-center gap-1.5 text-[9px] text-text-secondary font-extrabold">
                      <Calendar className="w-3.5 h-3.5 text-stone-450" />
                      <span>Delivery: {order.deliveryDate}</span>
                    </div>

                    {/* Status Badge clickable to open status change modal */}
                    {order.status === 'delivered' ? (
                      <div
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm ${getStatusBadgeStyle(order.status)}`}
                      >
                        <span>{getStatusLabel(order.status)}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openStatusChange(order)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all active:scale-95 shadow-sm ${getStatusBadgeStyle(order.status)}`}
                      >
                        <span>{getStatusLabel(order.status)}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* AWB Tracker badge if present */}
              {order.awb && (
                <div className="mx-4 mb-4 mt-1 bg-green-50 border border-green-200 text-green-700 p-2.5 rounded-xl text-[10px] font-black flex items-center justify-between">
                  <span>AWB TRACKING ID: <span className="font-mono">{order.awb}</span></span>
                  <span className="text-[9px] text-green-500 uppercase tracking-widest font-extrabold">Active</span>
                </div>
              )}
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-primary/5 p-6 flex flex-col items-center gap-2.5">
            <Info className="w-12 h-12 text-stone-300 animate-pulse" />
            <div>
              <h4 className="text-xs font-black text-text-primary">No Orders Found</h4>
              <p className="text-[10px] text-text-secondary mt-1">No orders currently match this status filter.</p>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. DYNAMIC STATUS & AWB INPUT MODAL */}
      {/* ============================================================== */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl rounded-b-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col gap-5 border border-primary/5 animate-slideUp">
            
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-base text-stone-850">Update Order Status</h3>
                <span className="text-[10px] text-text-secondary font-bold block mt-0.5">Order ID: {selectedOrder.id}</span>
              </div>
              <button 
                onClick={() => setShowStatusModal(false)} 
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 active:scale-95"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            {/* Selector Field */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-secondary uppercase">Select Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="text-xs font-bold text-text-primary bg-stone-50 border border-stone-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary w-full"
              >
                <option value="placed" disabled={['placed', 'processing', 'shipped_to_hub', 'delivered'].indexOf(selectedOrder.status) > 0}>New Order (Placed)</option>
                <option value="processing" disabled={['placed', 'processing', 'shipped_to_hub', 'delivered'].indexOf(selectedOrder.status) > 1}>Processing</option>
                <option value="shipped_to_hub" disabled={['placed', 'processing', 'shipped_to_hub', 'delivered'].indexOf(selectedOrder.status) > 2}>Ready to Ship</option>
                <option value="delivered" disabled={['placed', 'processing', 'shipped_to_hub', 'delivered'].indexOf(selectedOrder.status) > 3}>Delivered</option>
              </select>
            </div>

            {/* Conditional AWB Input for Ready to Ship (shipped_to_hub in backend) */}
            {newStatus === 'shipped_to_hub' && (
              <div className="flex flex-col gap-2 bg-orange-50/50 border border-orange-100 p-4 rounded-2xl animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#B3562C] uppercase mb-1">
                  <Truck className="w-4 h-4" />
                  <span>Shipment Details Required</span>
                </div>
                
                <label className="text-[9px] font-black text-text-secondary uppercase">AWB // TRACKING ID</label>
                <input
                  type="text"
                  value={awbTrackingId}
                  onChange={(e) => setAwbTrackingId(e.target.value)}
                  placeholder="e.g. AWB-992014820IN"
                  className="w-full text-xs font-bold text-text-primary bg-white border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                
                <span className="text-[8px] text-text-secondary font-bold block mt-1 leading-normal">
                  <strong>Important:</strong> Entering the tracking ID automatically alerts Shilp Setu logistics hub to expect delivery block scans.
                </span>
              </div>
            )}

            {/* Save CTA */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-3.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl transition-all"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveStatus}
                className="flex-1 py-3.5 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-2xl shadow-md transition-all"
              >
                Update Status
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
