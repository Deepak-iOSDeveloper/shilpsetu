import React from 'react';

export type PillStatus = 
  | 'placed' | 'processing' | 'shipped_to_hub' | 'qc_branding' | 'dispatched' | 'delivered'
  | 'inStock' | 'lowStock' | 'outOfStock' | 'verified' | 'pending' | 'unverified';

interface StatusPillProps {
  status: PillStatus;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStatusDetails = (): { text: string; bg: string; textCol: string } => {
    switch (status) {
      // Order status
      case 'placed':
        return { text: 'New Order', bg: 'bg-primary-light', textCol: 'text-primary' };
      case 'processing':
        return { text: 'Processing', bg: 'bg-blue-50', textCol: 'text-blue-600' };
      case 'shipped_to_hub':
        return { text: 'Shipped to Hub', bg: 'bg-purple-50', textCol: 'text-purple-600' };
      case 'qc_branding':
        return { text: 'QC & Branding', bg: 'bg-secondary-light', textCol: 'text-secondary-dark' };
      case 'dispatched':
        return { text: 'Dispatched', bg: 'bg-orange-50', textCol: 'text-orange-600' };
      case 'delivered':
        return { text: 'Delivered', bg: 'bg-accent-light', textCol: 'text-accent' };
      
      // Stock status
      case 'inStock':
        return { text: 'In Stock', bg: 'bg-accent-light', textCol: 'text-accent' };
      case 'lowStock':
        return { text: 'Low Stock', bg: 'bg-secondary-light', textCol: 'text-secondary-dark' };
      case 'outOfStock':
        return { text: 'Out of Stock', bg: 'bg-red-50', textCol: 'text-red-600' };
      
      // Verification status
      case 'verified':
        return { text: 'Verified ✓', bg: 'bg-accent-light', textCol: 'text-accent' };
      case 'pending':
        return { text: 'Pending Verification', bg: 'bg-secondary-light', textCol: 'text-secondary-dark' };
      case 'unverified':
      default:
        return { text: 'Unverified', bg: 'bg-gray-100', textCol: 'text-gray-600' };
    }
  };

  const { text, bg, textCol } = getStatusDetails();

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap shrink-0 ${bg} ${textCol}`}>
      {text}
    </span>
  );
};
