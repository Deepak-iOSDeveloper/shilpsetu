import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from './BottomNav';
import { AIAssistant } from './AIAssistant';
import { 
  UserCheck, RefreshCw, AlertCircle, ShoppingBag, 
  MessageSquare, PlusCircle, CheckCircle, Database 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { 
    activeRole, setActiveRole, currentView, setCurrentView,
    wallets, products, orders, rfqs, rechargeWallet, addNotification,
    updateOrderStatus, submitQuote
  } = useApp();

  const [showConsole, setShowConsole] = useState(true);

  // Helper mock actions
  const triggerMockOrder = () => {
    // Generate new order notification
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    addNotification(
      'artisan-1', 
      'order', 
      `Alert! New customer order ${orderId} received for 1 Wooden Wall Hanging Panel from CraftsVilla.`
    );
    alert(`Mock Order Triggered!\nNotification sent to Artisan dashboard.`);
  };

  const triggerMockQuote = () => {
    // Submit a mock quote to rfq-1
    const bidPrice = Math.floor(250 + Math.random() * 50);
    submitQuote('rfq-1', {
      artisanId: 'artisan-' + Date.now(),
      artisanName: 'Karan Singh',
      artisanAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      artisanLocation: 'Jaipur, Rajasthan',
      artisanRating: 4.7,
      price: bidPrice,
      days: 18
    });
    alert(`Mock Quote Triggered!\nNew bid of ₹${bidPrice}/pc added to RFQ-1.`);
  };

  const triggerOrderStatusChange = () => {
    // Cycle the first active order status
    const activeOrder = orders.find(o => o.status !== 'delivered');
    if (activeOrder) {
      const statuses: any[] = ['placed', 'processing', 'shipped_to_hub', 'qc_branding', 'dispatched', 'delivered'];
      const currentIdx = statuses.indexOf(activeOrder.status);
      const nextStatus = statuses[(currentIdx + 1) % statuses.length];
      updateOrderStatus(activeOrder.id, nextStatus);
      alert(`Order ${activeOrder.id} status updated to: ${nextStatus.toUpperCase()}`);
    } else {
      alert("No active orders found to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row justify-center items-stretch font-body">
      
      {/* Dev Dashboard Panel (Desktop Only) */}
      {showConsole && (
        <div className="hidden lg:flex w-80 bg-white border-r border-stone-200 p-6 flex-col justify-between shrink-0 overflow-y-auto max-h-screen sticky top-0">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-heading font-extrabold text-xl">
                <Database className="w-6 h-6 text-primary" />
                <span>ShilpSetu DevConsole</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Prototype switcher & state injection tools. Use these to navigate and test screens quickly.
              </p>
            </div>

            {/* Role Switcher */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Toggle Active Perspective</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveRole('ARTISAN')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    activeRole === 'ARTISAN' 
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-stone-50 border-stone-200 text-text-primary hover:bg-stone-100'
                  }`}
                >
                  🌾 Artisan Mode
                </button>
                <button
                  onClick={() => setActiveRole('BRAND')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    activeRole === 'BRAND' 
                      ? 'bg-accent text-white border-accent shadow-sm' 
                      : 'bg-stone-50 border-stone-200 text-text-primary hover:bg-stone-100'
                  }`}
                >
                  🛍 Brand Mode
                </button>
              </div>
              <button
                onClick={() => setActiveRole(null)}
                className={`w-full py-2 rounded-xl text-xs font-bold border transition-all ${
                  activeRole === null 
                    ? 'bg-stone-800 text-white border-stone-800 shadow-sm' 
                    : 'bg-stone-50 border-stone-200 text-text-primary hover:bg-stone-100'
                }`}
              >
                🚪 Splash / Selection Screen
              </button>
            </div>

            {/* Quick Navigation Shortcut */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Jump to View</span>
              <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto p-1 border border-stone-100 rounded-lg">
                {activeRole === 'ARTISAN' ? (
                  <>
                    {['dashboard', 'add-product', 'scan-sell', 'inventory', 'orders', 'community', 'profile'].map(v => (
                      <button
                        key={v}
                        onClick={() => setCurrentView(v)}
                        className={`text-[10px] px-2 py-1 rounded font-bold capitalize ${
                          currentView === v ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-text-secondary hover:bg-stone-200'
                        }`}
                      >
                        {v === 'community' ? 'Community' : v.replace('-', ' ')}
                      </button>
                    ))}
                  </>
                ) : activeRole === 'BRAND' ? (
                  <>
                    {['dashboard', 'inventory-sync', 'rfq-market', 'create-rfq', 'orders', 'profile', 'ai-studio'].map(v => (
                      <button
                        key={v}
                        onClick={() => setCurrentView(v)}
                        className={`text-[10px] px-2 py-1 rounded font-bold capitalize ${
                          currentView === v ? 'bg-accent/10 text-accent' : 'bg-stone-100 text-text-secondary hover:bg-stone-200'
                        }`}
                      >
                        {v.replace('-', ' ')}
                      </button>
                    ))}
                  </>
                ) : (
                  <span className="text-[10px] text-text-secondary p-1">Choose a role first to view screens.</span>
                )}
              </div>
            </div>

            {/* Simulated Backend State Injection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Mock API Injections</span>
              
              <button
                onClick={triggerMockOrder}
                className="flex items-center gap-2 text-left w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-text-primary transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-primary shrink-0" />
                <span>Simulate Artisan Customer Order</span>
              </button>

              <button
                onClick={triggerMockQuote}
                className="flex items-center gap-2 text-left w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-text-primary transition-all"
              >
                <MessageSquare className="w-4 h-4 text-secondary-dark shrink-0" />
                <span>Simulate Brand RFQ Bid</span>
              </button>

              <button
                onClick={triggerOrderStatusChange}
                className="flex items-center gap-2 text-left w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-text-primary transition-all"
              >
                <RefreshCw className="w-4 h-4 text-accent shrink-0 animate-spin-slow" />
                <span>Cycle Order Status History</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-150 flex flex-col gap-2 text-xs">
              <span className="font-bold text-text-primary">Current DB Counters</span>
              <div className="flex justify-between text-text-secondary">
                <span>Products Listed:</span>
                <span className="font-bold text-text-primary">{products.length}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Active RFQs:</span>
                <span className="font-bold text-text-primary">{rfqs.length}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Total Orders:</span>
                <span className="font-bold text-text-primary">{orders.length}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Artisan Wallet Balance:</span>
                <span className="font-bold text-accent">₹{wallets['artisan-1']?.balance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Brand Wallet Balance:</span>
                <span className="font-bold text-primary">₹{wallets['brand-1']?.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-text-secondary border-t border-stone-200 pt-4 flex flex-col gap-1">
            <div>Logged in: <span className="font-bold">{activeRole === 'ARTISAN' ? 'Ramesh Kumar (Artisan)' : activeRole === 'BRAND' ? 'Ananya Goel (Brand)' : 'None'}</span></div>
            <div>Time context: <span className="font-bold">2026-06-21</span></div>
            <div>System: <span className="font-bold">Gemini-Antigravity</span></div>
          </div>
        </div>
      )}

      {/* Floating dev toggle on smaller screen layouts (or for hiding/showing panel) */}
      <button
        onClick={() => setShowConsole(!showConsole)}
        className="hidden lg:flex fixed top-4 right-4 bg-stone-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg hover:bg-stone-700 transition-all z-50 items-center gap-1.5"
      >
        <Database className="w-3.5 h-3.5" />
        <span>{showConsole ? 'Hide Console' : 'Show Console'}</span>
      </button>

      {/* Main Mobile App Frame */}
      <main className="w-full max-w-[480px] bg-brandbg min-h-screen relative flex flex-col shadow-2xl overflow-hidden pb-16">
        {/* Render children views */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {children}
        </div>
        
        {activeRole === 'ARTISAN' && <AIAssistant />}
        
        {/* Navigation Bar */}
        <BottomNav />
      </main>
      
    </div>
  );
};
