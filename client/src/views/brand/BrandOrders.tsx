import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { StatusPill } from '../../components/StatusPill';
import { 
  ChevronLeft, Search, Filter, RefreshCw, 
  MapPin, CheckCircle, Clock, AlertTriangle 
} from 'lucide-react';

export const BrandOrders: React.FC = () => {
  const { orders, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'RFQ'>('customer');
  const [search, setSearch] = useState('');

  const filteredOrders = orders
    .filter(o => o.type === activeTab)
    .filter(o => 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      o.items[0]?.name.toLowerCase().includes(search.toLowerCase())
    );

  // Status steps mapping
  const pipelineSteps = [
    { id: 'placed', label: 'Placed' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped_to_hub', label: 'Hub' },
    { id: 'qc_branding', label: 'QC & Tag' },
    { id: 'dispatched', label: 'Dispatch' },
    { id: 'delivered', label: 'Delivered' }
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#FFFBF9] pb-16 text-left select-none">
      {/* Frozen Header & Tabs */}
      <div className="bg-white shadow-sm border-b border-stone-150 shrink-0 z-30">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <h2 className="font-heading font-extrabold text-lg">Procurement Pipeline</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'customer' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Catalog Orders
          </button>
          <button
            onClick={() => setActiveTab('RFQ')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 text-center transition-all ${
              activeTab === 'RFQ' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Custom Bulk Orders
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Search bar & filter */}
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-2xl p-1.5 border border-primary/5 shadow-premium flex items-center gap-2">
            <Search className="w-5 h-5 text-stone-400 ml-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, artisan or product..."
              className="w-full text-xs font-medium text-text-primary placeholder:text-stone-300 focus:outline-none bg-transparent py-1.5"
            />
          </div>
          
          <button 
            onClick={() => alert("Filter options")}
            className="w-11 h-11 rounded-2xl bg-white border border-stone-150 flex items-center justify-center text-text-primary hover:bg-stone-50 transition-all shadow-sm"
          >
            <Filter className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex flex-col gap-4">
          {filteredOrders.map(order => {
            const currentIdx = pipelineSteps.findIndex(s => s.id === order.status);
            
            return (
              <Card 
                key={order.id} 
                padding="md"
                className="border border-primary/5 hover:border-primary/20 flex flex-col gap-4"
              >
                {/* Header detail */}
                <div className="flex justify-between items-start gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img src={order.items[0]?.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase bg-stone-100 text-text-secondary px-1.5 py-0.5 rounded">
                        {order.id}
                      </span>
                      <h4 className="text-xs font-bold text-text-primary mt-1 truncate max-w-[180px]">
                        {order.items[0]?.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <StatusPill status={order.status} />
                    <span className="text-[10px] font-bold text-text-primary">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Artisan mini profile */}
                <div className="flex items-center gap-2 border-t border-stone-100 pt-3 text-[10px] font-bold text-text-secondary">
                  <div className="w-5 h-5 rounded-full bg-secondary/15 flex items-center justify-center font-extrabold text-[10px] text-primary">
                    {order.sellerName.substring(0, 1).toUpperCase()}
                  </div>
                  <span>{order.sellerName}</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{order.sellerLocation}</span>
                  </div>
                </div>

                {/* Expected delivery */}
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Expected Delivery: <span className="text-text-primary">{order.deliveryDate}</span></span>
                </div>

                {/* 6-step progress pipeline */}
                <div className="flex justify-between items-center relative py-1 mt-1">
                  {/* Background progress line */}
                  <div className="absolute left-2.5 right-2.5 top-[15px] h-0.5 bg-stone-200 z-0" />
                  
                  {/* Foreground progress line */}
                  <div 
                    className="absolute left-2.5 top-[15px] h-0.5 bg-primary z-0 transition-all duration-300"
                    style={{ width: `${(currentIdx / (pipelineSteps.length - 1)) * 96}%` }}
                  />

                  {pipelineSteps.map((step, idx) => {
                    const completed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const future = idx > currentIdx;

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-1 relative z-10">
                        {/* Circular pipeline node */}
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all border-2 ${
                            completed 
                              ? 'bg-primary border-primary text-white'
                              : isCurrent
                                ? 'bg-white border-primary text-primary pulse-stage ring-4 ring-primary/10'
                                : 'bg-white border-stone-200 text-stone-400'
                          }`}
                        >
                          {completed ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[8px] font-extrabold tracking-tight ${
                          isCurrent ? 'text-primary' : 'text-text-secondary'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Request change button */}
                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => {
                      const note = prompt("Enter modifications requested for this batch (e.g., custom tagging change):");
                      if (note) alert("Change request sent to artisan cluster coordinator.");
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold text-text-secondary hover:text-primary bg-white border border-stone-200 hover:border-primary/20 px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
                    <span>Request Change</span>
                  </button>
                </div>

              </Card>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center gap-2">
              <AlertTriangle className="w-10 h-10 text-stone-300" />
              <span className="text-xs font-bold text-text-secondary">No orders found matching search.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
