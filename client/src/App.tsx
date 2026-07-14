import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';

// Onboarding Views
import { RoleSelection } from './views/onboarding/RoleSelection';
import { SignUpBasic } from './views/onboarding/SignUpBasic';
import { ArtisanOnboarding } from './views/onboarding/ArtisanOnboarding';
import { BrandOnboarding } from './views/onboarding/BrandOnboarding';
import { Login } from './views/onboarding/Login';

// Artisan Views
import { ArtisanDashboard } from './views/artisan/ArtisanDashboard';
import { AddProductAI } from './views/artisan/AddProductAI';
import { ScanSell } from './views/artisan/ScanSell';
import { InventoryList } from './views/artisan/InventoryList';
import { ArtisanOrders } from './views/artisan/ArtisanOrders';
import { Community } from './views/artisan/Community';
import { StorefrontBuilder } from './views/artisan/StorefrontBuilder';
import { ArtisanProfile } from './views/artisan/ArtisanProfile';
import { ArtisanBalance } from './views/artisan/ArtisanBalance';
import { ArtisanRFQMarketplace } from './views/artisan/ArtisanRFQMarketplace';
import { ArtisanAnalytics } from './views/artisan/ArtisanAnalytics';

// Brand Views
import { BrandDashboard } from './views/brand/BrandDashboard';
import { BrandOrders } from './views/brand/BrandOrders';
import { RFQMarketplace } from './views/brand/RFQMarketplace';
import { CreateRFQ } from './views/brand/CreateRFQ';
import { InventorySync } from './views/brand/InventorySync';
import { AIImageStudio } from './views/brand/AIImageStudio';
import { ReviewProduct } from './views/brand/ReviewProduct';
import { StoreIntegration } from './views/brand/StoreIntegration';
import { CollectionsList } from './views/brand/CollectionsList';
import { MessagesView } from './views/brand/MessagesView';
import { BrandProfile } from './views/brand/BrandProfile';
import { BrandBalance } from './views/brand/BrandBalance';
import { NotificationCenter } from './views/NotificationCenter';

const AppContent: React.FC = () => {
  const { activeRole, currentView } = useApp();

  if (currentView === 'signup-basic') {
    return <SignUpBasic />;
  }
  if (currentView === 'login') {
    return <Login />;
  }
  if (!activeRole) {
    return <RoleSelection />;
  }

  // Artisan view routers
  if (activeRole === 'ARTISAN') {
    if (currentView.startsWith('artisan-onboarding')) {
      return <ArtisanOnboarding />;
    }

    switch (currentView) {
      case 'dashboard':
        return <ArtisanDashboard />;
      case 'add-product':
        return <AddProductAI />;
      case 'scan-sell':
        return <ScanSell />;
      case 'inventory':
        return <InventoryList />;
      case 'orders':
        return <ArtisanOrders />;
      case 'community':
        return <Community />;
      case 'storefront':
        return <StorefrontBuilder />;
      case 'profile':
        return <ArtisanProfile />;
      case 'messages':
        return <MessagesView />;
      case 'balance':
        return <ArtisanBalance />;
      case 'artisan-rfq-market':
        return <ArtisanRFQMarketplace />;
      case 'analytics':
        return <ArtisanAnalytics />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <ArtisanDashboard />;
    }
  }

  // Brand view routers
  if (activeRole === 'BRAND') {
    if (currentView.startsWith('brand-onboarding')) {
      return <BrandOnboarding />;
    }

    switch (currentView) {
      case 'dashboard':
        return <BrandDashboard />;
      case 'orders':
        return <BrandOrders />;
      case 'rfq-market':
        return <RFQMarketplace />;
      case 'create-rfq':
        return <CreateRFQ />;
      case 'inventory-sync':
      case 'inventory-sync-viewed':
        return <InventorySync />;
      case 'ai-studio':
        return <AIImageStudio />;
      case 'review-product':
        return <ReviewProduct key={localStorage.getItem('selectedProductId') || 'default'} />;
      case 'store-integration':
        return <StoreIntegration />;
      case 'collections-list':
        return <CollectionsList />;
      case 'messages':
        return <MessagesView />;
      case 'balance':
        return <BrandBalance />;
      case 'profile':
        return <BrandProfile />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <BrandDashboard />;
    }
  }

  return <RoleSelection />;
};

function App() {
  return (
    <AppProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AppProvider>
  );
}

export default App;
