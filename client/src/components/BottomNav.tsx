import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, Scan, ShoppingBag, Package, Store, 
  RefreshCw, ClipboardList, User as UserIcon, Compass, Users 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeRole, currentView, setCurrentView } = useApp();

  if (!activeRole) return null;
  if (currentView.includes('onboarding') || currentView === 'login') return null;

  if (activeRole === 'ARTISAN') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E8DC] h-[68px] pt-0 px-2 pb-2 z-40 max-w-[480px] mx-auto shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-full px-2 relative">
          
          {/* Tab 1: Home */}
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none ${
              currentView === 'dashboard' ? 'text-[#FF6B35]' : 'text-[#BDBDBD]'
            }`}
          >
            <Home className="w-[22px] h-[22px]" strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
            <span className="text-[9px] mt-1 font-bold font-sans">Home</span>
          </button>

          {/* Tab 2: Community */}
          <button 
            onClick={() => setCurrentView('community')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none ${
              currentView === 'community' ? 'text-[#FF6B35]' : 'text-[#BDBDBD]'
            }`}
          >
            <Users className="w-[22px] h-[22px]" strokeWidth={currentView === 'community' ? 2.5 : 2} />
            <span className="text-[9px] mt-1 font-bold font-sans whitespace-nowrap">Community</span>
          </button>

          {/* Tab 3: Sell & Scan (Raised Center FAB) */}
          <div className="flex-1 flex flex-col items-center justify-end pb-1 relative h-full select-none">
            <button 
              onClick={() => setCurrentView('scan-sell')}
              className="w-14 h-14 rounded-full bg-[#FF6B35] flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-all absolute -top-7 active:scale-95 border-4 border-white"
            >
              <Scan className="w-[24px] h-[24px] text-white" strokeWidth={2.5} />
            </button>
            <span className={`text-[9px] font-bold font-sans ${
              currentView === 'scan-sell' ? 'text-[#FF6B35]' : 'text-[#BDBDBD]'
            }`}>
              Sell & Scan
            </span>
          </div>

          {/* Tab 4: Orders */}
          <button 
            onClick={() => setCurrentView('orders')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none ${
              currentView.startsWith('orders') ? 'text-[#FF6B35]' : 'text-[#BDBDBD]'
            }`}
          >
            <ShoppingBag className="w-[22px] h-[22px]" strokeWidth={currentView.startsWith('orders') ? 2.5 : 2} />
            <span className="text-[9px] mt-1 font-bold font-sans">Orders</span>
          </button>

          {/* Tab 5: Products */}
          <button 
            onClick={() => setCurrentView('inventory')}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none ${
              currentView === 'inventory' ? 'text-[#FF6B35]' : 'text-[#BDBDBD]'
            }`}
          >
            <Package className="w-[22px] h-[22px]" strokeWidth={currentView === 'inventory' ? 2.5 : 2} />
            <span className="text-[9px] mt-1 font-bold font-sans">Products</span>
          </button>

        </div>
      </div>
    );
  }

  // BRAND bottom nav with raised central FAB for RFQ
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary/5 pb-safe-bottom z-40 max-w-[480px] mx-auto shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="flex justify-around items-center h-16 px-2 relative">
        {/* Tab 1: Home */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center"
        >
          <Home 
            className={`w-6 h-6 ${currentView === 'dashboard' ? 'text-primary' : 'text-text-secondary'}`}
            strokeWidth={currentView === 'dashboard' ? 2.5 : 2}
            fill={currentView === 'dashboard' ? 'rgba(255, 107, 53, 0.1)' : 'none'}
          />
          <span className={`text-[10px] mt-1 font-bold ${currentView === 'dashboard' ? 'text-primary' : 'text-text-secondary'}`}>
            Home
          </span>
        </button>

        {/* Tab 2: Sync */}
        <button
          onClick={() => setCurrentView('inventory-sync')}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center"
        >
          <Compass 
            className={`w-6 h-6 ${currentView.startsWith('inventory-sync') ? 'text-primary' : 'text-text-secondary'}`}
            strokeWidth={currentView.startsWith('inventory-sync') ? 2.5 : 2}
            fill={currentView.startsWith('inventory-sync') ? 'rgba(255, 107, 53, 0.1)' : 'none'}
          />
          <span className={`text-[10px] mt-1 font-bold ${currentView.startsWith('inventory-sync') ? 'text-primary' : 'text-text-secondary'}`}>
            Explore
          </span>
        </button>

        {/* Raised central FAB: RFQ */}
        <div className="flex-1 flex justify-center -mt-8 relative z-50">
          <button
            onClick={() => setCurrentView('rfq-market')}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105 bg-primary text-white"
          >
            <ClipboardList className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab 4: Orders */}
        <button
          onClick={() => setCurrentView('orders')}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center"
        >
          <ShoppingBag 
            className={`w-6 h-6 ${currentView === 'orders' ? 'text-primary' : 'text-text-secondary'}`}
            strokeWidth={currentView === 'orders' ? 2.5 : 2}
            fill={currentView === 'orders' ? 'rgba(255, 107, 53, 0.1)' : 'none'}
          />
          <span className={`text-[10px] mt-1 font-bold ${currentView === 'orders' ? 'text-primary' : 'text-text-secondary'}`}>
            Orders
          </span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => setCurrentView('profile')}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center"
        >
          <UserIcon 
            className={`w-6 h-6 ${currentView === 'profile' ? 'text-primary' : 'text-text-secondary'}`}
            strokeWidth={currentView === 'profile' ? 2.5 : 2}
            fill={currentView === 'profile' ? 'rgba(255, 107, 53, 0.1)' : 'none'}
          />
          <span className={`text-[10px] mt-1 font-bold ${currentView === 'profile' ? 'text-primary' : 'text-text-secondary'}`}>
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};
