import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, FileText, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';

export const DraftsList: React.FC = () => {
  const { drafts, addProduct, removeDraft, setCurrentView } = useApp();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublishDraft = async (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return;

    if (!draft.name || !draft.category || !draft.craftType || draft.price <= 0 || draft.images.length === 0) {
      alert("This draft is missing required details (name, category, craft, price) before it can be published.");
      return;
    }

    setPublishingId(draftId);
    try {
      const res = await addProduct({
        name: draft.name,
        category: draft.category,
        craftType: draft.craftType,
        material: draft.material,
        price: draft.price,
        stockQty: draft.stockQty,
        weight: draft.weight,
        description: draft.description,
        images: draft.images,
        aiGenerated: false
      });

      if (res.success) {
        removeDraft(draftId);
        alert("Draft published successfully! It's now live in your Products.");
      } else {
        alert("Publish failed: " + res.error);
      }
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#FFFBF9] flex flex-col z-10 text-left">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('add-product')}
            className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center bg-white shadow-sm active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </button>
          <h2 className="font-heading font-black text-base text-stone-850">My Drafts</h2>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar pb-24 flex flex-col gap-4">
        {drafts.length === 0 && (
          <div className="text-center py-12 flex flex-col items-center gap-2 bg-white rounded-3xl border border-stone-150">
            <AlertCircle className="w-10 h-10 text-stone-300" />
            <span className="text-xs font-bold text-stone-500">You have no saved drafts yet.</span>
          </div>
        )}

        {drafts.map(draft => (
          <div
            key={draft.id}
            className="bg-white rounded-3xl border border-stone-150 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 flex gap-3.5"
          >
            <div className="w-16 aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
              {draft.images[0] ? (
                <img src={draft.images[0]} alt={draft.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <FileText className="w-6 h-6" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-stone-800 truncate">{draft.name || 'Untitled Draft'}</h4>
                  <span className="text-[8px] font-black uppercase tracking-wider bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded shrink-0">
                    Draft
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-bold block mt-0.5">
                  {draft.category || 'No category'}{draft.craftType ? ` • ${draft.craftType}` : ''}
                </span>
                <span className="text-[10px] text-[#FF511A] font-black block mt-0.5">
                  {draft.price > 0 ? `₹${draft.price.toLocaleString('en-IN')}` : 'Price not set'}
                </span>
              </div>

              <button
                onClick={() => handlePublishDraft(draft.id)}
                disabled={publishingId === draft.id}
                className={`mt-2 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  publishingId === draft.id
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#FF511A] text-white hover:bg-[#E04413]'
                }`}
              >
                {publishingId === draft.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
