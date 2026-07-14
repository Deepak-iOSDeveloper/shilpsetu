import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/Card';
import { 
  ChevronLeft, Copy, Globe, RefreshCw, AlertCircle, 
  Settings, CheckCircle, ShieldAlert, ExternalLink 
} from 'lucide-react';

export const StoreIntegration: React.FC = () => {
  const { setCurrentView } = useApp();

  // Settings states
  const [platform, setPlatform] = useState('Shopify');
  const [status, setStatus] = useState<'Connected' | 'Disconnected'>('Connected');
  const [copiedCode, setCopiedCode] = useState(false);

  const storeId = "STORE001";
  const token = "tok_shilp_a8b9c2";
  const apiKey = "pk_live_shilpsetusecret992";
  const version = "v1.2.0";

  const embedCode = `<div id="shilpsetu-store"></div>\n\n<script src="https://widget.shilpsetu.com/widget.js"></script>\n\n<script>\n  ShilpSetu.init({\n    storeId: "STORE001",\n    collection: "festive",\n    theme: "light",\n    layout: "grid",\n    columns: 4\n  });\n</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleReconnect = () => {
    setStatus('Connected');
    alert("Reconnecting widget script... Store connection successfully refreshed!");
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect your external storefront widget? This will stop syncing products to your live website immediately.")) {
      setStatus('Disconnected');
      alert("Storefront widget disconnected successfully.");
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 bg-[#FFF8F1]">
      
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-white shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm animate-press"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h2 className="font-heading font-black text-lg text-stone-850">Store Integration</h2>
            <span className="text-[10px] text-text-secondary font-bold block mt-0.5">
              Manage your external website widget links
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-140px)]">
        
        {/* Connection Status Panel */}
        <Card padding="md" className="bg-white rounded-3xl border border-primary/5 shadow-premium flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-100">
            <span className="text-xs font-black text-stone-850">Widget Connection Status</span>
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
              status === 'Connected'
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-500 border-red-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'Connected' ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
              <span>{status}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-text-secondary font-bold text-[10px] uppercase">Connected Platform</span>
              <div className="flex items-center gap-1.5 font-extrabold text-stone-800 mt-0.5">
                <Globe className="w-4 h-4 text-primary" />
                <span>{platform} Store</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-text-secondary font-bold text-[10px] uppercase">Widget Version</span>
              <span className="font-extrabold text-stone-800 mt-0.5">{version}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-text-secondary font-bold text-[10px] uppercase">Store ID</span>
              <span className="font-mono font-black text-stone-800 mt-0.5">{storeId}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-text-secondary font-bold text-[10px] uppercase">API Status</span>
              <span className="font-extrabold text-green-600 mt-0.5">Live (Key Active)</span>
            </div>
          </div>

          <div className="flex gap-3 border-t border-stone-100 pt-4 mt-1">
            {status === 'Disconnected' ? (
              <button
                onClick={handleReconnect}
                className="flex-1 py-3 bg-[#FF6B35] hover:bg-[#E55A25] text-white text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reconnect Store</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleReconnect}
                  className="flex-1 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reconnect</span>
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="flex-1 py-3 bg-red-50 text-red-500 hover:bg-red-100 text-xs font-black rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </>
            )}
          </div>
        </Card>

        {/* API Credentials Card */}
        <Card padding="md" className="bg-white rounded-3xl border border-primary/5 shadow-premium flex flex-col gap-4">
          <span className="text-xs font-black text-stone-850 border-b border-stone-100 pb-2.5">API & Widget Credentials</span>
          
          <div className="flex flex-col gap-3.5 text-xs">
            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase">Widget Token</span>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex justify-between items-center mt-1">
                <span className="font-mono font-bold text-stone-700">{token}</span>
                <button onClick={() => {
                  navigator.clipboard.writeText(token);
                  alert("Copied Widget Token!");
                }} className="text-primary font-black hover:underline">Copy</button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-text-secondary uppercase">API Key</span>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex justify-between items-center mt-1">
                <span className="font-mono font-bold text-stone-700">{apiKey}</span>
                <button onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  alert("Copied API Key!");
                }} className="text-primary font-black hover:underline">Copy</button>
              </div>
            </div>
          </div>
        </Card>

        {/* Embed Script Code Box */}
        <Card padding="md" className="bg-white rounded-3xl border border-primary/5 shadow-premium flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
            <span className="text-xs font-black text-stone-850">JavaScript Embed Code</span>
            <button 
              onClick={copyToClipboard}
              className="text-primary text-xs font-black flex items-center gap-1 hover:underline"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="bg-stone-900 rounded-2xl p-4 text-left relative overflow-hidden shrink-0">
            <pre className="text-[10.5px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap no-scrollbar">
              {embedCode}
            </pre>
          </div>

          <div className="text-[10px] text-text-secondary bg-orange-50/50 border border-orange-100 p-3.5 rounded-2xl font-bold leading-normal">
            <strong>Pro Tip:</strong> Install this JavaScript code block only one time on your website layout template before the closing <code>&lt;/body&gt;</code> tag. Whenever you publish new products, they will automatically sync to your live collection list.
          </div>
        </Card>

      </div>

    </div>
  );
};
