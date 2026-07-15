import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, Search, Bell, Star, ChevronRight, Calendar, 
  Briefcase, TrendingUp, Trophy, MessageSquare, Brain, Eye, 
  ShoppingBag, CheckCircle2, XCircle
} from 'lucide-react';

export const ArtisanAnalytics: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [activeTab, setActiveTab] = useState<'snapshot' | 'trend' | 'sellers' | 'rfq' | 'insight'>('snapshot');
  const [trendType, setTrendType] = useState<'revenue' | 'orders'>('revenue');
  const [trendRange, setTrendRange] = useState<'week' | 'month'>('week');

  // Refs for smooth scroll target areas
  const snapshotRef = useRef<HTMLDivElement>(null);
  const trendRef = useRef<HTMLDivElement>(null);
  const sellersRef = useRef<HTMLDivElement>(null);
  const rfqRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (tab: 'snapshot' | 'trend' | 'sellers' | 'rfq' | 'insight', ref: React.RefObject<HTMLDivElement | null>) => {
    setActiveTab(tab);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // SVG Chart Mock Data coordinates
  const revenuePointsWeek = "50,150 100,120 150,90 200,110 250,50 300,30 350,60";
  const revenuePointsMonth = "30,160 80,140 130,110 180,125 230,80 280,60 330,45 380,30";
  const ordersPointsWeek = "50,140 100,100 150,130 200,90 250,70 300,40 350,55";
  const ordersPointsMonth = "30,150 80,130 130,100 180,110 230,95 280,75 330,50 380,40";

  const getChartPoints = () => {
    if (trendType === 'revenue') {
      return trendRange === 'week' ? revenuePointsWeek : revenuePointsMonth;
    } else {
      return trendRange === 'week' ? ordersPointsWeek : ordersPointsMonth;
    }
  };

  const getChartPath = () => {
    const points = getChartPoints().split(' ');
    let path = `M ${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i]}`;
    }
    return path;
  };

  const getChartFillPath = () => {
    const pointsStr = getChartPoints();
    const points = pointsStr.split(' ');
    const firstX = points[0].split(',')[0];
    const lastX = points[points.length - 1].split(',')[0];
    return `M ${firstX},180 L ${pointsStr} L ${lastX},180 Z`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFFBF8] min-h-dvh relative font-sans text-left pb-20 select-none">
      
      {/* 1. TOP HEADER */}
      <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between shadow-sm sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-50 border border-stone-200 text-stone-600 active:scale-95 transition-all"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-stone-850 font-heading">
            Analytics
          </h1>
        </div>

        {/* Icons removed per user request */}
        <div className="w-9 h-9"></div>
      </div>

      {/* 2. DATE FILTER PILLS */}
      <div className="px-4 py-3 bg-white/70 backdrop-blur-sm sticky top-[68px] z-20 flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-100 shrink-0">
        <button
          onClick={() => setActiveDateFilter('today')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
            activeDateFilter === 'today' 
              ? 'bg-[#FF6B35] text-white shadow shadow-orange-500/20' 
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveDateFilter('week')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
            activeDateFilter === 'week' 
              ? 'bg-[#FF6B35] text-white shadow shadow-orange-500/20' 
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setActiveDateFilter('month')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
            activeDateFilter === 'month' 
              ? 'bg-[#FF6B35] text-white shadow shadow-orange-500/20' 
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setActiveDateFilter('custom')}
          className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            activeDateFilter === 'custom' 
              ? 'bg-[#FF6B35] text-white shadow shadow-orange-500/20' 
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <span>Custom</span>
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. MAIN TABBED PERSPECTIVE WRAPPER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT VERTICAL SIDEBAR NAVIGATION */}
        <div className="w-20 bg-white border-r border-stone-100 flex flex-col gap-3.5 py-4 px-2 select-none shrink-0">
          
          {/* Tab 1: Snapshot */}
          <div 
            onClick={() => scrollToSection('snapshot', snapshotRef)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer transition-all border ${
              activeTab === 'snapshot' 
                ? 'bg-[#FFF6F2] border-[#FFE2D4] text-[#FF6B35]' 
                : 'border-transparent text-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'snapshot' ? 'bg-[#FF6B35]/10' : 'bg-stone-50'}`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-center leading-tight">Snapshot</span>
          </div>

          {/* Tab 2: Sales Trend */}
          <div 
            onClick={() => scrollToSection('trend', trendRef)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer transition-all border ${
              activeTab === 'trend' 
                ? 'bg-[#FFF6F2] border-[#FFE2D4] text-[#FF6B35]' 
                : 'border-transparent text-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'trend' ? 'bg-[#FF6B35]/10' : 'bg-stone-50'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-center leading-tight">Sales Trend</span>
          </div>

          {/* Tab 3: Best Sellers */}
          <div 
            onClick={() => scrollToSection('sellers', sellersRef)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer transition-all border ${
              activeTab === 'sellers' 
                ? 'bg-[#FFF6F2] border-[#FFE2D4] text-[#FF6B35]' 
                : 'border-transparent text-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'sellers' ? 'bg-[#FF6B35]/10' : 'bg-stone-50'}`}>
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-center leading-tight">Best Sellers</span>
          </div>

          {/* Tab 4: RFQ Activity */}
          <div 
            onClick={() => scrollToSection('rfq', rfqRef)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer transition-all border ${
              activeTab === 'rfq' 
                ? 'bg-[#FFF6F2] border-[#FFE2D4] text-[#FF6B35]' 
                : 'border-transparent text-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'rfq' ? 'bg-[#FF6B35]/10' : 'bg-stone-50'}`}>
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-center leading-tight">Custom Activity</span>
          </div>

          {/* Tab 5: AI Insight */}
          <div 
            onClick={() => scrollToSection('insight', insightRef)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl cursor-pointer transition-all border ${
              activeTab === 'insight' 
                ? 'bg-[#FFF6F2] border-[#FFE2D4] text-[#FF6B35]' 
                : 'border-transparent text-stone-400 hover:bg-stone-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeTab === 'insight' ? 'bg-[#FF6B35]/10' : 'bg-stone-50'}`}>
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black tracking-tight text-center leading-tight">AI Insight</span>
          </div>

        </div>

        {/* RIGHT DASHBOARD CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6 no-scrollbar pb-16">
          
          {/* SECTION 1: SNAPSHOT */}
          <div ref={snapshotRef} className="scroll-mt-36 flex flex-col gap-3">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider text-left pl-1">
              Performance Snapshot
            </h3>

            {/* Snapshot Stat Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: Revenue Earned */}
              <div className="bg-white border border-stone-200 rounded-3xl p-3.5 flex flex-col gap-2 shadow-sm text-left relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <span className="text-[10px] text-stone-505 font-extrabold leading-tight">Revenue Earned</span>
                </div>
                <div className="mt-1">
                  <span className="text-base font-black text-[#FF6B35]">₹45,200</span>
                  <span className="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <span>↑ 12.4%</span>
                    <span className="text-stone-400 font-bold">vs yesterday</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Orders Received */}
              <div className="bg-white border border-stone-200 rounded-3xl p-3.5 flex flex-col gap-2 shadow-sm text-left relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <span className="text-[10px] text-stone-500 font-extrabold leading-tight">Orders Received</span>
                </div>
                <div className="mt-1">
                  <span className="text-base font-black text-stone-800">127</span>
                  <span className="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <span>↑ 8.7%</span>
                    <span className="text-stone-400 font-bold">vs yesterday</span>
                  </span>
                </div>
              </div>

              {/* Card 3: Product Views */}
              <div className="bg-white border border-stone-200 rounded-3xl p-3.5 flex flex-col gap-2 shadow-sm text-left relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Eye className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <span className="text-[10px] text-stone-505 font-extrabold leading-tight">Product Views</span>
                </div>
                <div className="mt-1">
                  <span className="text-base font-black text-stone-800">3,482</span>
                  <span className="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <span>↑ 15.3%</span>
                    <span className="text-stone-400 font-bold">vs yesterday</span>
                  </span>
                </div>
              </div>

              {/* Card 4: Avg Rating */}
              <div className="bg-white border border-stone-200 rounded-3xl p-3.5 flex flex-col gap-2 shadow-sm text-left relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Star className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <span className="text-[10px] text-stone-500 font-extrabold leading-tight">Avg Rating</span>
                </div>
                <div className="mt-1">
                  <span className="text-base font-black text-stone-850 flex items-center gap-1">
                    <span>4.8</span>
                    <span className="text-[#FF6B35] text-xs">★</span>
                  </span>
                  <span className="text-[9px] text-green-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <span>↑ 0.2</span>
                    <span className="text-stone-400 font-bold">vs yesterday</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: SALES TREND */}
          <div ref={trendRef} className="scroll-mt-36 flex flex-col gap-3">
            <div className="flex justify-between items-center pl-1">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider">
                Sales Trend
              </h3>
              
              {/* Range Switcher */}
              <select 
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value as 'week' | 'month')}
                className="text-[10px] font-extrabold text-stone-600 bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Line Chart Panel card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm text-left flex flex-col gap-3">
              
              {/* Toggle Buttons: Revenue / Orders */}
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <button
                    onClick={() => setTrendType('revenue')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                      trendType === 'revenue' 
                        ? 'bg-[#FF6B35] text-white shadow-sm shadow-orange-500/10' 
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    Revenue
                  </button>
                  <button
                    onClick={() => setTrendType('orders')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                      trendType === 'orders' 
                        ? 'bg-[#FF6B35] text-white shadow-sm shadow-orange-500/10' 
                        : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    Orders
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 font-bold">
                  {trendType === 'revenue' ? 'Revenue (₹)' : 'Volume (Orders)'}
                </span>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="w-full h-[200px] border-b border-stone-100 relative mt-2">
                
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-2.5 pointer-events-none opacity-40">
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                  <div className="border-b border-dashed border-stone-200 w-full"></div>
                </div>

                {/* Y-axis metrics */}
                <div className="absolute left-1 top-1 bottom-1 flex flex-col justify-between text-[8px] font-bold text-stone-400 pointer-events-none select-none z-10">
                  <span>{trendType === 'revenue' ? '40K' : '40'}</span>
                  <span>{trendType === 'revenue' ? '30K' : '30'}</span>
                  <span>{trendType === 'revenue' ? '20K' : '20'}</span>
                  <span>{trendType === 'revenue' ? '10K' : '10'}</span>
                  <span>0</span>
                </div>

                {/* Chart SVG */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Fill under Curve */}
                  <path 
                    d={getChartFillPath()} 
                    fill="url(#orangeGrad)" 
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Line Curve Path */}
                  <path 
                    d={getChartPath()} 
                    fill="none" 
                    stroke="#FF6B35" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Node Circle Markers */}
                  {getChartPoints().split(' ').map((pt, idx) => {
                    const [cx, cy] = pt.split(',');
                    return (
                      <circle 
                        key={idx}
                        cx={cx} 
                        cy={cy} 
                        r="5" 
                        fill="white" 
                        stroke="#FF6B35" 
                        strokeWidth="3.5"
                        className="transition-all duration-500 ease-in-out cursor-pointer hover:r-7"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* X-axis Days Labels */}
              <div className="flex justify-between px-2 text-[9px] font-bold text-stone-400 select-none">
                {trendRange === 'week' ? (
                  <>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </>
                ) : (
                  <>
                    <span>Wk 1</span>
                    <span>Wk 2</span>
                    <span>Wk 3</span>
                    <span>Wk 4</span>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* SECTION 3: BEST SELLERS */}
          <div ref={sellersRef} className="scroll-mt-36 flex flex-col gap-3">
            <div className="flex justify-between items-center pl-1">
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider">
                Best Sellers (Top 3)
              </h3>
              <button className="text-xs font-extrabold text-[#FF6B35] hover:underline">
                View All
              </button>
            </div>

            {/* Product Sellers Feed list */}
            <div className="bg-white border border-stone-200 rounded-3xl p-1.5 shadow-sm text-left flex flex-col gap-1">
              {/* Product Item 1 */}
              <div className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-2xl transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150" 
                  alt="Banarasi Saree" 
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-stone-800 font-heading truncate">Banarasi Saree</h4>
                  <span className="text-[10px] text-stone-400 font-bold block mt-0.5">Units Sold: 62</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[8px] text-stone-400 font-bold block">Revenue</span>
                    <span className="text-xs font-extrabold text-[#FF6B35]">₹18,600</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </div>
              </div>

              {/* Product Item 2 */}
              <div className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-2xl transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150" 
                  alt="Terracotta Diya Set" 
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-stone-800 font-heading truncate">Terracotta Diya Set</h4>
                  <span className="text-[10px] text-stone-400 font-bold block mt-0.5">Units Sold: 48</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[8px] text-stone-400 font-bold block">Revenue</span>
                    <span className="text-xs font-extrabold text-[#FF6B35]">₹6,720</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </div>
              </div>

              {/* Product Item 3 */}
              <div className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-2xl transition-all cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=150" 
                  alt="Hand Painted Pot" 
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-stone-850 font-heading truncate">Hand Painted Pot</h4>
                  <span className="text-[10px] text-stone-400 font-bold block mt-0.5">Units Sold: 33</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[8px] text-stone-400 font-bold block">Revenue</span>
                    <span className="text-xs font-extrabold text-[#FF6B35]">₹4,290</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: RFQ ACTIVITY */}
          <div ref={rfqRef} className="scroll-mt-36 flex flex-col gap-3">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider text-left pl-1">
              Custom Order Activity Feed
            </h3>

            {/* RFQ stats grid cards */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm text-left flex flex-col gap-4">
              
              {/* Activity metrics */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="flex items-center gap-2.5 p-2 bg-stone-50/50 rounded-2xl border border-stone-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider block">Custom Orders Received</span>
                    <span className="text-sm font-black text-stone-800">24</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-stone-50/50 rounded-2xl border border-stone-100">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4.5 h-4.5 text-[#FF6B35]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider block">Quotes Sent</span>
                    <span className="text-sm font-black text-stone-800">18</span>
                  </div>
                </div>
              </div>

              {/* Progress conversion bar */}
              <div>
                <div className="flex justify-between items-center text-[9px] font-bold text-stone-400 mb-1">
                  <span>Quotes Conversion Rate</span>
                  <span className="text-[#FF6B35] font-black">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden flex">
                  <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Won vs Lost block */}
              <div className="border-t border-stone-100 pt-3 flex justify-around text-center">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Bids Won</span>
                    <span className="text-xs font-black text-stone-805">12 Won</span>
                  </div>
                </div>

                <div className="h-6 w-px bg-stone-200"></div>

                <div className="flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] text-stone-400 font-bold uppercase tracking-wider">Bids Lost</span>
                    <span className="text-xs font-black text-stone-805">6 Lost</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 5: AI INSIGHT */}
          <div ref={insightRef} className="scroll-mt-36 flex flex-col gap-3">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider text-left pl-1">
              AI Insight
            </h3>

            {/* Business insight speech card */}
            <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFECE2] border border-[#FFD9C6] rounded-3xl p-4 shadow-sm text-left flex gap-3.5 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#FFA67E] flex items-center justify-center shrink-0 shadow-md">
                <Brain className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-stone-800 font-heading">AI Business Advisor</h4>
                <p className="text-[10px] text-stone-600 font-medium leading-relaxed mt-1">
                  "Your Banarasi Sarees are seeing 15% higher search volume this week. We recommend listing 2 more color options and keeping MOQ at 5 to capture the wedding season demand."
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
