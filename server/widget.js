// =====================================================================
// SHILP SETU EMBEDDABLE STOREFRONT WIDGET SCRIPT
// Resolves database collections and injects premium grids on external websites
// =====================================================================

(function() {
  // Global Namespace Object
  const ShilpSetu = {
    init: function(config) {
      const containerId = config.containerId || 'shilpsetu-store';
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Shilp Setu Widget Error: Container with ID "${containerId}" not found.`);
        return;
      }

      // Set target endpoints (default local Express server, fallback customizable)
      const storeId = config.storeId || 'STORE001';
      const collection = config.collection || 'festive';
      const apiUrl = config.apiUrl || `http://localhost:5000/api/store/${storeId}/collections/${collection}`;

      // Set up wrapper styles
      container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      container.style.color = '#1c1917';
      container.style.margin = '20px 0';
      container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
          <div style="display: inline-block; width: 24px; height: 24px; border: 3px solid #FF6B35; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
          <p style="font-size: 12px; font-weight: bold; color: #78716c; margin-top: 10px;">Loading Shilp Setu Catalog...</p>
        </div>
        <style>
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      `;

      // Fetch Collection Products from live DB
      fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
          if (!products || products.length === 0) {
            container.innerHTML = `
              <div style="text-align: center; padding: 40px; border: 1px dashed #e7e5e4; border-radius: 24px; background: #fffcf9;">
                <p style="font-size: 14px; font-weight: bold; color: #b3562c; margin: 0;">No synced products visible in this collection.</p>
                <p style="font-size: 11px; color: #a8a29e; margin-top: 6px;">Sync listings from your Shilp Setu dashboard to publish them here.</p>
              </div>
            `;
            return;
          }

          // Build HTML Grid
          let html = `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; width: 100%;">
          `;

          products.forEach(p => {
            const image = p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400';
            const price = Number(p.price).toLocaleString('en-IN');
            
            html += `
              <div class="shilpsetu-product-card" style="background: #ffffff; border: 1px solid #f5f5f4; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(28, 25, 22, 0.03); transition: all 0.3s ease; text-align: left; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="width: 100%; height: 200px; overflow: hidden; background: #fdfaf7; position: relative;">
                    <img src="${image}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <span style="position: absolute; top: 12px; left: 12px; background: #fff8f1; border: 1px solid #ff6b35/20; color: #b3562c; font-size: 9px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
                      Handcrafted
                    </span>
                  </div>
                  
                  <div style="padding: 16px;">
                    <h3 style="font-size: 13px; font-weight: 800; color: #1c1917; margin: 0; line-height: 1.4; height: 38px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                      ${p.title}
                    </h3>
                    <p style="font-size: 10px; color: #78716c; font-weight: 700; margin: 6px 0 0 0;">SKU: ${p.sku}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
                      <span style="font-size: 16px; font-weight: 900; color: #b3562c;">₹${price}</span>
                      <span style="font-size: 9px; font-weight: 700; color: #78716c; background: #f5f5f4; padding: 2px 8px; border-radius: 4px;">
                        MOQ: ${p.moq || 5} pcs
                      </span>
                    </div>
                  </div>
                </div>

                <div style="padding: 0 16px 16px 16px;">
                  <button 
                    onclick="window.ShilpSetu.openInquiryModal('${p.title}', '${p.sku}', '${price}', '${p.moq || 5}')"
                    style="width: 100%; py: 10px; background: #ff6b35; color: #ffffff; border: none; font-size: 11px; font-weight: bold; border-radius: 12px; padding: 10px 0; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 4px rgba(255, 107, 53, 0.15);"
                  >
                    Procure / Request MOQ
                  </button>
                </div>
              </div>
            `;
          });

          html += `
            </div>
            
            <!-- Floating Modal Container -->
            <div id="shilpsetu-inquiry-modal" style="display: none; position: fixed; inset: 0; background: rgba(28, 25, 22, 0.6); backdrop-filter: blur(4px); z-index: 99999; align-items: center; justify-content: center; padding: 16px;">
              <div style="background: #ffffff; width: 100%; max-width: 360px; padding: 24px; border-radius: 28px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid rgba(28,25,22,0.05); text-align: center; position: relative;">
                <button onclick="window.ShilpSetu.closeInquiryModal()" style="position: absolute; top: 16px; right: 16px; width: 28px; height: 28px; border-radius: 50%; background: #f5f5f4; border: none; font-size: 14px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #78716c;">✕</button>
                
                <h3 style="font-size: 16px; font-weight: 800; color: #b3562c; margin: 0 0 8px 0;">Procurement Inquiry</h3>
                <p id="inquiry-prod-title" style="font-size: 12px; font-weight: 700; color: #1c1917; margin: 0;"></p>
                <p id="inquiry-prod-sku" style="font-size: 10px; color: #78716c; margin: 4px 0 16px 0;"></p>

                <div style="text-align: left; display: flex; flex-direction: column; gap: 12px;">
                  <div>
                    <label style="font-size: 9px; font-weight: 800; color: #78716c; text-transform: uppercase;">Inquiry Quantity</label>
                    <input id="inquiry-qty" type="number" style="width: 100%; border: 1px solid #e7e5e4; padding: 10px; border-radius: 10px; font-size: 12px; font-weight: bold; margin-top: 4px;" />
                  </div>
                  <div>
                    <label style="font-size: 9px; font-weight: 800; color: #78716c; text-transform: uppercase;">Corporate Sourcing Email</label>
                    <input id="inquiry-email" type="email" placeholder="purchasing@mybrand.com" style="width: 100%; border: 1px solid #e7e5e4; padding: 10px; border-radius: 10px; font-size: 12px; margin-top: 4px;" />
                  </div>
                </div>

                <button 
                  onclick="window.ShilpSetu.submitInquiry()"
                  style="width: 100%; margin-top: 20px; background: #ff6b35; color: #ffffff; border: none; font-size: 12px; font-weight: bold; padding: 12px 0; border-radius: 14px; cursor: pointer;"
                >
                  Submit Procurement Quote
                </button>
              </div>
            </div>
          `;

          container.innerHTML = html;
        })
        .catch(err => {
          console.error("Shilp Setu Sourcing Widget Fetch failed:", err);
          container.innerHTML = `
            <div style="text-align: center; padding: 20px; border: 1px solid #fecdd3; border-radius: 16px; background: #fff5f5; color: #e11d48; font-size: 11px; font-weight: bold;">
              Failed to connect with Shilp Setu API. Ensure the Express server is running on port 5000.
            </div>
          `;
        });
    },

    openInquiryModal: function(title, sku, price, moq) {
      document.getElementById('inquiry-prod-title').innerText = title;
      document.getElementById('inquiry-prod-sku').innerText = `SKU: ${sku} • Price: ₹${price}`;
      document.getElementById('inquiry-qty').value = moq;
      document.getElementById('inquiry-qty').min = moq;
      document.getElementById('shilpsetu-inquiry-modal').style.display = 'flex';
    },

    closeInquiryModal: function() {
      document.getElementById('shilpsetu-inquiry-modal').style.display = 'none';
    },

    submitInquiry: function() {
      const qty = document.getElementById('inquiry-qty').value;
      const email = document.getElementById('inquiry-email').value;
      if (!email) {
        alert("Please enter your corporate sourcing email.");
        return;
      }
      alert(`Procurement request submitted! Our Master Artisan will reach out to you at ${email} shortly.`);
      this.closeInquiryModal();
    }
  };

  // Attach to window namespace
  window.ShilpSetu = ShilpSetu;
})();
