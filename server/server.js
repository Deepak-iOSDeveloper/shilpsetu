import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Google Gemini Client & Multer
const upload = multer({ storage: multer.memoryStorage() });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY' });

const ProductAutoFillSchema = {
  type: Type.OBJECT,
  properties: {
    name: { 
      type: Type.STRING, 
      description: "Descriptive product title (e.g. 'Blue Pure Silk Organza Kadwa Banarasi Saree')" 
    },
    category: { 
      type: Type.STRING, 
      description: "Market category (e.g. Textiles, Pottery, Home Decor, Apparel)" 
    },
    craftType: { 
      type: Type.STRING, 
      description: "Indian regional craft technique (e.g. Banarasi Weaving, Block Printing, Terracotta)" 
    },
    material: { 
      type: Type.STRING, 
      description: "Base material (e.g. Katan Silk, Organic Cotton, Earthen Clay)" 
    },
    price: { 
      type: Type.INTEGER, 
      description: "Estimated fair retail value in Indian Rupees (₹) based on craftsmanship details visible" 
    },
    weight: { 
      type: Type.INTEGER, 
      description: "Estimated weight in grams" 
    },
    description: { 
      type: Type.STRING, 
      description: "Rich, evocative marketing description detailing weave type, historic craft origins, and style." 
    }
  },
  required: ["name", "category", "craftType", "material", "price", "weight", "description"]
};

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database template file if not exists
const initialDBState = {
  products: [
    {
      id: 'p-0',
      ownerId: 'artisan-1',
      name: 'Jaipur Cotton Block-Print Saree',
      category: 'Textiles',
      craftType: 'Block Printing',
      material: 'Organic Mul Cotton',
      price: 2450,
      stockQty: 15,
      weight: 450,
      description: 'Elegant hand block-printed cotton saree featuring floral indigo patterns. Made using organic vegetable dyes in Jaipur.',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
      sku: 'BS-BLO-003',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-1',
      ownerId: 'artisan-1',
      name: 'Blue Pure Silk Organza Kadwa Banarasi Saree',
      category: 'Textiles',
      craftType: 'Kadwa Handwoven',
      material: 'Pure Silk Organza',
      price: 14999,
      stockQty: 12,
      weight: 650,
      description: 'Traditional royal blue pure silk organza saree, handwoven using the antique Kadwa technique. Features tested gold zari and unstitched blouse (0.8 m). Origin: Banaras, UP.',
      images: ['/saree_blue.png'],
      sku: 'BS001',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-2',
      ownerId: 'artisan-1',
      name: 'Light Green Silk Viscose Cutwork Banarasi Saree',
      category: 'Textiles',
      craftType: 'Cutwork',
      material: 'Silk Viscose',
      price: 5699,
      stockQty: 18,
      weight: 700,
      description: 'Charming light green Banaras saree with exquisite viscose cutwork. Soft drape, tested zari work with unstitched blouse (0.8 m).',
      images: ['/saree_green.png'],
      sku: 'BS002',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-3',
      ownerId: 'artisan-1',
      name: 'Light Green Silk Viscose Cutwork Banarasi Saree',
      category: 'Textiles',
      craftType: 'Cutwork',
      material: 'Silk Viscose',
      price: 7124,
      stockQty: 10,
      weight: 700,
      description: 'Exquisite light green Banaras saree with detailed viscose cutwork, tested zari borders, and premium finish. Comes with unstitched blouse (0.8 m).',
      images: ['/saree_green.png'],
      sku: 'BS003',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-4',
      ownerId: 'artisan-1',
      name: 'Orange Silk Viscose Cutwork Banarasi Saree',
      category: 'Textiles',
      craftType: 'Cutwork',
      material: 'Silk Viscose',
      price: 5699,
      stockQty: 20,
      weight: 700,
      description: 'Vibrant orange Banaras saree featuring premium silk viscose cutwork design. Tested zari borders, perfect for traditional events.',
      images: ['/saree_orange.png'],
      sku: 'BS004',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-5',
      ownerId: 'artisan-1',
      name: 'Black Silk Viscose Kadwa Banarasi Saree',
      category: 'Textiles',
      craftType: 'Kadwa',
      material: 'Silk Viscose',
      price: 5699,
      stockQty: 15,
      weight: 720,
      description: 'Elegant black silk viscose saree crafted using the traditional Kadwa weaving method. Beautiful tested zari details, comes with unstitched blouse (0.8 m).',
      images: ['/saree_black.png'],
      sku: 'BS005',
      status: 'inStock',
      aiGenerated: false
    },
    {
      id: 'p-6',
      ownerId: 'artisan-1',
      name: 'Beige Silk Viscose Kadwa Banarasi Saree',
      category: 'Textiles',
      craftType: 'Kadwa',
      material: 'Silk Viscose',
      price: 5699,
      stockQty: 9,
      weight: 720,
      description: 'Classic beige silk viscose saree crafted in traditional Kadwa style. Exquisite tested zari borders, perfect for weddings and festive wear.',
      images: ['/saree_beige.png'],
      sku: 'BS006',
      status: 'inStock',
      aiGenerated: false
    }
  ],
  rfqs: [
    {
      id: 'rfq-1',
      brandId: 'brand-1',
      brandName: 'FabIndia',
      category: 'Textiles',
      craftType: 'Kadwa Banarasi Weaving',
      qty: 100,
      budget: 1320000,
      deliveryDate: '2026-08-15',
      status: 'open',
      quotes: [
        {
          artisanId: 'artisan-1',
          artisanName: 'Ramesh Kumar',
          artisanLocation: 'Varanasi, UP',
          artisanRating: 4.8,
          price: 13000,
          days: 45,
          status: 'pending'
        },
        {
          artisanId: 'artisan-2',
          artisanName: 'Naresh Patel',
          artisanLocation: 'Bhuj, Gujarat',
          artisanRating: 4.6,
          price: 12800,
          days: 50,
          status: 'pending'
        }
      ]
    },
    {
      id: 'rfq-2',
      brandId: 'brand-1',
      brandName: 'Anouk Crafts',
      category: 'Textiles',
      craftType: 'Cutwork Banarasi Weaving',
      qty: 150,
      budget: 1920000,
      deliveryDate: '2026-08-30',
      status: 'open',
      quotes: [
        {
          artisanId: 'artisan-1',
          artisanName: 'Ramesh Kumar',
          artisanLocation: 'Varanasi, UP',
          artisanRating: 4.8,
          price: 12500,
          days: 40,
          status: 'pending'
        }
      ]
    }
  ],
  orders: [
    {
      id: 'ORD-2026-001',
      buyerId: 'brand-1',
      buyerName: 'FabIndia Boutique',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-1',
          name: 'Blue Pure Silk Organza Kadwa Banarasi Saree',
          price: 14999,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'
        }
      ],
      qty: 1,
      amount: 14999,
      status: 'processing',
      statusHistory: [{ status: 'placed', timestamp: new Date().toISOString() }],
      deliveryDate: '2026-06-28',
      type: 'customer',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ORD-2026-002',
      buyerId: 'brand-2',
      buyerName: 'Crafts India',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-2',
          name: 'Light Green Silk Viscose Cutwork Banaras Saree',
          price: 11500,
          qty: 2,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150'
        }
      ],
      qty: 2,
      amount: 23000,
      status: 'delivered',
      statusHistory: [
        { status: 'placed', timestamp: new Date().toISOString() },
        { status: 'processing', timestamp: new Date().toISOString() },
        { status: 'delivered', timestamp: new Date().toISOString() }
      ],
      deliveryDate: '2026-06-20',
      type: 'customer',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ORD-2505-1024',
      buyerId: 'brand-1',
      buyerName: 'FabIndia Boutique',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-10',
          name: 'Vibrant Blue Pure Organza Silk Banarasi Saree',
          price: 48000,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'
        }
      ],
      qty: 1,
      amount: 48000,
      status: 'placed',
      statusHistory: [
        {
          status: 'placed',
          timestamp: '2026-06-29T10:00:00Z'
        }
      ],
      deliveryDate: '2026-07-15',
      type: 'customer',
      createdAt: '2026-06-29T10:00:00Z'
    },
    {
      id: 'ORD-2505-1025',
      buyerId: 'brand-1',
      buyerName: 'Anouk Crafts',
      sellerId: 'artisan-2',
      sellerName: 'Naresh Patel',
      sellerLocation: 'Bhuj, Gujarat',
      items: [
        {
          productId: 'p-12',
          name: 'Chanderi Handwoven Zari Motif Saree',
          price: 16500,
          qty: 1,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150'
        }
      ],
      qty: 1,
      amount: 16500,
      status: 'processing',
      statusHistory: [
        {
          status: 'placed',
          timestamp: '2026-06-28T11:00:00Z'
        },
        {
          status: 'processing',
          timestamp: '2026-06-28T16:00:00Z'
        }
      ],
      deliveryDate: '2026-07-20',
      type: 'customer',
      createdAt: '2026-06-28T11:00:00Z'
    },
    {
      id: 'ORD-2505-1026',
      buyerId: 'brand-1',
      buyerName: 'FabIndia',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-1',
          name: 'Banarasi Silk Saree - Kadwa Weave (Bulk)',
          price: 13000,
          qty: 100,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150'
        }
      ],
      qty: 100,
      amount: 1300000,
      status: 'qc_branding',
      statusHistory: [
        {
          status: 'placed',
          timestamp: '2026-06-10T09:00:00Z'
        },
        {
          status: 'processing',
          timestamp: '2026-06-12T10:00:00Z'
        },
        {
          status: 'shipped_to_hub',
          timestamp: '2026-06-25T14:00:00Z'
        },
        {
          status: 'qc_branding',
          timestamp: '2026-06-28T11:30:00Z'
        }
      ],
      deliveryDate: '2026-07-25',
      type: 'RFQ',
      createdAt: '2026-06-10T09:00:00Z'
    },
    {
      id: 'ORD-2505-1027',
      buyerId: 'brand-1',
      buyerName: 'Anouk Crafts',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-2',
          name: 'Light Green Silk Viscose Cutwork Banaras Saree (Bulk)',
          price: 12500,
          qty: 150,
          image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=150'
        }
      ],
      qty: 150,
      amount: 1875000,
      status: 'dispatched',
      statusHistory: [
        {
          status: 'placed',
          timestamp: '2026-05-15T09:00:00Z'
        },
        {
          status: 'processing',
          timestamp: '2026-05-18T10:00:00Z'
        },
        {
          status: 'shipped_to_hub',
          timestamp: '2026-06-10T14:00:00Z'
        },
        {
          status: 'qc_branding',
          timestamp: '2026-06-15T11:30:00Z'
        },
        {
          status: 'dispatched',
          timestamp: '2026-06-28T09:00:00Z'
        }
      ],
      deliveryDate: '2026-07-05',
      type: 'RFQ',
      createdAt: '2026-05-15T09:00:00Z'
    },
    {
      id: 'ORD-2505-1028',
      buyerId: 'brand-2',
      buyerName: 'New Brand Ltd',
      sellerId: 'artisan-2',
      sellerName: 'Naresh Patel',
      sellerLocation: 'Bhuj, Gujarat',
      items: [
        {
          productId: 'p-13',
          name: 'Chanderi Silk Buti Saree (Festive Collection Bulk)',
          price: 9500,
          qty: 50,
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=150'
        }
      ],
      qty: 50,
      amount: 475000,
      status: 'delivered',
      statusHistory: [
        {
          status: 'placed',
          timestamp: '2026-05-01T09:00:00Z'
        },
        {
          status: 'processing',
          timestamp: '2026-05-05T10:00:00Z'
        },
        {
          status: 'shipped_to_hub',
          timestamp: '2026-05-20T14:00:00Z'
        },
        {
          status: 'qc_branding',
          timestamp: '2026-05-25T11:30:00Z'
        },
        {
          status: 'dispatched',
          timestamp: '2026-05-28T09:00:00Z'
        },
        {
          status: 'delivered',
          timestamp: '2026-06-10T16:00:00Z'
        }
      ],
      deliveryDate: '2026-06-10',
      type: 'RFQ',
      createdAt: '2026-05-01T09:00:00Z'
    },
    {
      id: 'RFQ-2026-001',
      buyerId: 'brand-heritage',
      buyerName: 'Heritage Looms Pvt. Ltd.',
      buyerSubtitle: 'Ananya Sharma | +91 98765 43210',
      buyerLogo: 'H',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-1',
          name: 'Banarasi Silk Saree (Bulk RFQ)',
          price: 5000,
          qty: 50,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150',
          description: 'Specs: Pure Banarasi weaving with zari border. Terms: 50% Advance, 50% Before Dispatch. Dest: Mumbai, MH.'
        }
      ],
      qty: 50,
      amount: 250000,
      status: 'placed',
      statusHistory: [{ status: 'placed', timestamp: '2026-06-30T10:00:00Z' }],
      deliveryDate: 'Within 30 Days',
      type: 'RFQ',
      createdAt: '2026-06-30T10:00:00Z'
    },
    {
      id: 'RFQ-2026-002',
      buyerId: 'brand-ethnic',
      buyerName: 'Ethnic Threads India',
      buyerSubtitle: 'Rahul Mehta | +91 99887 66554',
      buyerLogo: 'E',
      sellerId: 'artisan-1',
      sellerName: 'Ramesh Kumar',
      sellerLocation: 'Varanasi, UP',
      items: [
        {
          productId: 'p-1',
          name: 'Banarasi Silk Saree (Bulk RFQ)',
          price: 5000,
          qty: 50,
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150',
          description: 'Specs: Handwoven Banarasi silk with gold zari pallu. Terms: 30% Advance, 70% After Quality Inspection. Dest: Bengaluru, KA.'
        }
      ],
      qty: 50,
      amount: 250000,
      status: 'processing',
      statusHistory: [
        { status: 'placed', timestamp: '2026-06-29T09:00:00Z' },
        { status: 'processing', timestamp: '2026-06-29T14:00:00Z' }
      ],
      deliveryDate: 'Within 25 Days',
      type: 'RFQ',
      createdAt: '2026-06-29T09:00:00Z'
    }
  ],
  wallets: {
    'artisan-1': { balance: 14500, reservedAmount: 4000, transactions: [] },
    'brand-1': { balance: 12450, reservedAmount: 3200, transactions: [] }
  },
  stores: [
    {
      id: 'STORE001',
      brandId: 'brand-1',
      storeToken: 'tok_shilp_a8b9c2',
      apiKey: 'pk_live_shilpsetusecret992',
      connectedPlatform: 'Shopify',
      connectionStatus: 'Connected',
      widgetVersion: 'v1.2.0'
    }
  ],
  collections: [
    {
      id: 'col-1',
      storeId: 'STORE001',
      name: 'new-arrivals',
      label: 'New Arrivals',
      visibility: 'Published',
      widgetStatus: 'active'
    },
    {
      id: 'col-2',
      storeId: 'STORE001',
      name: 'sarees',
      label: 'Sarees',
      visibility: 'Published',
      widgetStatus: 'active'
    },
    {
      id: 'col-3',
      storeId: 'STORE001',
      name: 'festive',
      label: 'Festive Collection',
      visibility: 'Published',
      widgetStatus: 'active'
    }
  ],
  collectionProducts: [
    {
      id: 'cp-1',
      collectionId: 'col-3',
      productId: 'p-1',
      status: 'Published'
    },
    {
      id: 'cp-2',
      collectionId: 'col-3',
      productId: 'p-2',
      status: 'Published'
    },
    {
      id: 'cp-3',
      collectionId: 'col-2',
      productId: 'p-1',
      status: 'Published'
    },
    {
      id: 'cp-4',
      collectionId: 'col-2',
      productId: 'p-2',
      status: 'Published'
    }
  ]
};

const getDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDBState, null, 2));
    return initialDBState;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return initialDBState;
  }
};

const saveDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- API ROUTES ---

// Root index page
app.get('/', (req, res) => {
  res.send('<h1>ShilpSetu B2B API Server</h1><p>The backend is active. Try querying endpoints like:</p><ul><li>Health Status: <a href="/api/health">/api/health</a></li><li>Product catalog: <a href="/api/products">/api/products</a></li><li>RFQ listings: <a href="/api/rfqs">/api/rfqs</a></li><li>Orders history: <a href="/api/orders">/api/orders</a></li></ul>');
});

// Serve storefront widget.js client library
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'widget.js'));
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Products routes
app.get('/api/products', (req, res) => {
  const db = getDB();
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const db = getDB();
  const newProduct = {
    ...req.body,
    id: 'p-' + (db.products.length + 1)
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const db = getDB();
  const beforeCount = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === beforeCount) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveDB(db);
  res.status(204).end();
});

// RFQs routes
app.get('/api/rfqs', (req, res) => {
  const db = getDB();
  res.json(db.rfqs);
});

app.post('/api/rfqs', (req, res) => {
  const db = getDB();
  const newRfq = {
    ...req.body,
    id: 'rfq-' + (db.rfqs.length + 1),
    status: 'open',
    quotes: []
  };
  db.rfqs.unshift(newRfq);
  saveDB(db);
  res.status(201).json(newRfq);
});

// Orders routes
app.get('/api/orders', (req, res) => {
  const db = getDB();
  res.json(db.orders);
});

app.post('/api/orders', (req, res) => {
  const db = getDB();
  const newOrder = {
    ...req.body,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    status: 'placed',
    statusHistory: [{ status: 'placed', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };
  db.orders.unshift(newOrder);
  saveDB(db);
  res.status(201).json(newOrder);
});

// AI Real Vision Analyze Saree / Crafts Image Endpoint
app.post('/api/products/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      console.warn("GEMINI_API_KEY env is not configured. Returning fallback mock suggestion.");
      const mockSuggestions = [
        {
          name: 'Blue Pure Silk Organza Kadwa Banarasi Saree',
          category: 'Textiles',
          craftType: 'Organza Banarasi Weaving',
          material: 'Pure Organza Silk',
          price: 14999,
          weight: 750,
          description: 'Traditional pure silk organza saree crafted using the antique Kadwa weaving technique. Featuring elegant blue tones and heavy golden zari borders.'
        },
        {
          name: 'Traditional Jaipur Blue Pottery Floral Vase',
          category: 'Pottery',
          craftType: 'Blue Pottery',
          material: 'Quartz Clay & Glass Powder',
          price: 1850,
          weight: 1200,
          description: 'Beautiful hand-painted Jaipur Blue Pottery flower vase with traditional cobalt blue floral motifs. Finished with a shiny glass glaze, wood-fired.'
        },
        {
          name: 'Lucknowi Chikankari Georgette Fabric',
          category: 'Fabric',
          craftType: 'Chikankari Hand-Embroidery',
          material: 'Georgette Cotton',
          price: 3200,
          weight: 400,
          description: 'Elegant georgette fabric featuring intricate Lucknowi shadow-work hand-embroidery. Perfect for designing custom ethnic apparel.'
        },
        {
          name: 'Kashmiri Pure Pashmina Hand-Woven Stole',
          category: 'Stole',
          craftType: 'Pashmina Weaving',
          material: 'Chyangra Cashmere Wool',
          price: 8500,
          weight: 150,
          description: 'Ultra-soft, lightweight hand-woven pashmina stole from Srinagar, Kashmir. Features fine diamond weave texture and delicate hand-fringed borders.'
        },
        {
          name: 'Bidriware Silver-Inlaid Decorative Plate',
          category: 'Home Decor',
          craftType: 'Bidriware Hand-Metal Engraving',
          material: 'Zinc-Copper Alloy & Pure Silver',
          price: 4999,
          weight: 950,
          description: 'Historic Bidriware metal plate from Bidar, Karnataka. Features a jet-black finish engraved with delicate pure silver wire inlay patterns.'
        },
        {
          name: 'Earthen Wood-Fired Terracotta Cooking Pot',
          category: 'Pottery',
          craftType: 'Terracotta Handcraft',
          material: 'Natural River Clay',
          price: 650,
          weight: 1500,
          description: 'Traditional earthen pot hand-thrown on the wheel and wood-fired in rural kilns. Completely organic, ideal for slow-cooking ethnic dishes.'
        }
      ];
      // Simulate delay for natural user experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json(mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)]);
    }

    // Convert file buffer to base64 object for Gemini API
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      }
    };

    const prompt = `You are a museum curator and textile appraiser specializing in Indian handicrafts. 
    Analyze this product photo. Identify the craft technique, materials, estimated weight, and craft lineage.
    Recommend a fair retail selling price in Indian Rupees (₹). Write a rich buyer-facing description.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseSchema: ProductAutoFillSchema,
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error) {
    console.error("AI Analysis failed. Exact error from Gemini SDK:", error);
    res.status(500).json({ error: "Failed to analyze product image." });
  }
});

// AI Autocomplete endpoint
app.post('/api/ai/autofill', (req, res) => {
  // Mock vision response
  const suggestions = [
    {
      name: 'Jaipur Cotton Block-Print Saree',
      category: 'Textiles',
      craftType: 'Block Printing',
      material: 'Organic Mul Cotton',
      price: 2450,
      weight: 450,
      description: 'Elegant hand block-printed cotton saree featuring floral indigo patterns. Made using organic vegetable dyes in Jaipur.'
    },
    {
      name: 'Traditional Terracotta Vase',
      category: 'Pottery',
      craftType: 'Terracotta Handcraft',
      material: 'Earthen Clay',
      price: 950,
      weight: 1800,
      description: 'Hand-shaped clay flower vase featuring tribal etching details. Porous traditional terracotta, baked in organic wood-fired kilns.'
    }
  ];
  setTimeout(() => {
    res.json(suggestions[Math.floor(Math.random() * suggestions.length)]);
  }, 1000);
});

// AI Chatbot assistant endpoint (Gemini Powered)
app.post('/api/ai/chat', async (req, res) => {
  const { message, language, role } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      throw new Error("Mock key active, skipping real Gemini chatbot response");
    }

    const systemPrompt = `You are "ShilpSetu AI Sahayak", a helpful, friendly AI assistant inside the Shilp Setu application. 
    Shilp Setu is a B2B platform connecting Indian artisans with boutique brands.
    The current user is logged in as a ${role || 'ARTISAN'}.

    CRITICAL APPLICATION NAVIGATION SCHEMA (DO NOT HALLUCINATE OTHER SECTIONS):
    1. Wallet & Earnings: To check balance, income, or earnings, the user must navigate to the 'Wallet' section (also called 'Balance' tab) on the bottom navigation bar. There is NO 'My Account', 'Payments', or 'My Earnings' section.
    2. Billing & POS: To generate a bill, invoice, or check billing history, the user must go to the 'Scan & Sell' section in the bottom bar, select products, enter customer details (name/phone), and tap the orange 'Generate Bill' button.
    3. Orders: To track active orders, shipping, or B2B deliveries, go to the 'Orders' tab in the bottom bar.
    4. Products & Inventory: To manage stock, edit metadata, or add new items, go to the 'Products' (or 'Inventory') tab.

    Respond in the requested language: ${language === 'hi' ? 'Hindi (written in Devanagari or Hinglish depending on user style)' : language === 'mr' ? 'Marathi' : 'English'}.
    Answer the user query clearly, concisely, and supportively. Keep your answer under 3 sentences. Be extremely direct and accurate about these app sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n\nUser query: " + message }] }
      ]
    });

    const reply = response.text || "Samajh gaya!";
    res.json({ reply });
  } catch (error) {
    console.error("AI Chat call failed or mock key active. Serving smart fallback response:", error.message);
    
    const msg = (message || '').toLowerCase();
    let reply = "";

    if (language === 'hi') {
      if (msg.includes('कमाई') || msg.includes('earning') || msg.includes('income') || msg.includes('पैसे') || msg.includes('राजस्व')) {
        reply = "अपनी कुल कमाई (Earnings) देखने के लिए स्क्रीन पर नीचे दिए गए 'Wallet' सेक्शन पर जाएँ। वहाँ आप अपना कुल बैलेंस, पेंडिंग पेमेंट और ट्रांजैक्शन हिस्ट्री देख सकते हैं।";
      } else if (msg.includes('स्कैन') || msg.includes('scan') || msg.includes('कैमरा') || msg.includes('फोटो') || msg.includes('photo')) {
        reply = "प्रोडक्ट स्कैन करने के लिए आप नीचे बाएँ कोने में कैमरा बटन दबाएँ और फ़ोटो खींचें। हमारी AI उसकी शिल्प कला, सामग्री और सही कीमत का आकलन तुरंत कर देगी।";
      } else if (msg.includes('बिल') || msg.includes('bill') || msg.includes('रसीद') || msg.includes('invoice')) {
        reply = "बिल बनाने के लिए: 1. नीचे बार में 'Scan & Sell' सेक्शन पर जाएँ। 2. उत्पाद चुनें या स्कैन करें। 3. ग्राहक का नाम और नंबर भरें। 4. नीचे नारंगी रंग का 'Generate Bill' बटन दबाएँ।";
      } else if (msg.includes('वॉलेट') || msg.includes('wallet') || msg.includes('बैलेंस') || msg.includes('रिचार्ज')) {
        reply = "अपने वॉलेट बैलेंस को देखने या रिचार्ज करने के लिए प्रोफाइल मेनू के 'Wallet' विकल्प पर जाएँ। आप Razorpay द्वारा सुरक्षित रूप से पैसे जोड़ सकते हैं।";
      } else if (msg.includes('ऑर्डर') || msg.includes('order') || msg.includes('डिलीवरी') || msg.includes('delivery')) {
        reply = "आप अपने सभी एक्टिव ऑर्डर और उनकी डिलीवरी स्टेटस देखने के लिए नीचे दिए गए 'Orders' टैब पर जा सकते हैं। वहाँ प्रत्येक ऑर्डर का विस्तृत विवरण मौजूद है।";
      } else if (msg.includes('मदद') || msg.includes('help') || msg.includes('सहायता')) {
        reply = "मैं आपकी पूरी सहायता करूँगा! आप मुझसे उत्पाद जोड़ने, बिल बनाने, कमाई देखने, पेमेंट ट्रैक करने या भारतीय हस्तशिल्प के बारे में कुछ भी पूछ सकते हैं।";
      } else {
        reply = "नमस्ते! मैं आपका शिल्पसेतु सहायक हूँ। आप मुझसे नया प्रोडक्ट अपलोड करने, बिल बनाने, कमाई देखने या ऑर्डर ट्रैक करने की विधि पूछ सकते हैं।";
      }
    } else if (language === 'mr') {
      if (msg.includes('कमाई') || msg.includes('earning') || msg.includes('उत्पन्न')) {
        reply = "तुमची एकूण कमाई पाहण्यासाठी स्क्रीनच्या तळाशी असलेल्या 'Wallet' विभागावर जा. तिथे तुम्हाला तुमचे बॅलन्स आणि व्यवहार इतिहास दिसेल.";
      } else if (msg.includes('स्कॅन') || msg.includes('scan') || msg.includes('कॅमेरा') || msg.includes('फोटो')) {
        reply = "उत्पादन स्कॅन करण्यासाठी खाली डाव्या कोपर्यात कॅमेरा बटण दाबा आणि फोटो घ्या. आमचे AI त्याच्या कलाकुसर आणि वाजवी किंमतीचे विश्लेषण करेल.";
      } else if (msg.includes('बिल') || msg.includes('bill') || msg.includes('पावती')) {
        reply = "नवीन बिल तयार करण्यासाठी: 1. 'Scan & Sell' विभागात जा. 2. उत्पादन निवडा. 3. ग्राहकाचे नाव-फोन नंबर टाका. 4. खालील 'Generate Bill' दाबा.";
      } else {
        reply = "नमस्कार! मी तुमचा शिल्पसेतु सहाय्यक आहे. आपण मला नवीन उत्पादन अपलोड करणे किंवा बिल तयार करण्याबद्दल विचारू शकता.";
      }
    } else {
      // English / Default
      if (msg.includes('earning') || msg.includes('income') || msg.includes('revenue') || msg.includes('sales')) {
        reply = "To check your earnings, navigate to the 'Wallet' section at the bottom navigation bar. There you can see your current balance, pending payments, and transaction history.";
      } else if (msg.includes('scan') || msg.includes('camera') || msg.includes('photo') || msg.includes('upload')) {
        reply = "To scan a product, tap the camera icon in the bottom-left corner of the input area and snap a photo. Our AI will analyze its craft type, material, and recommend a fair price.";
      } else if (msg.includes('bill') || msg.includes('invoice') || msg.includes('receipt') || msg.includes('print')) {
        reply = "To generate a bill: 1. Go to the 'Scan & Sell' section in the bottom bar. 2. Select or scan a product. 3. Input client details. 4. Tap the orange 'Generate Bill' button at the bottom.";
      } else if (msg.includes('wallet') || msg.includes('money') || msg.includes('recharge') || msg.includes('balance')) {
        reply = "To check your wallet balance or add credits, navigate to your Profile menu and select the Wallet tab. Recharges are secured by Razorpay.";
      } else if (msg.includes('order') || msg.includes('delivery') || msg.includes('track')) {
        reply = "You can track all active orders, delivery updates, and logistics hub status under the 'Orders' tab in the bottom navigation bar.";
      } else if (msg.includes('help') || msg.includes('support') || msg.includes('how to')) {
        reply = "I am here to support you! You can ask me how to list items, generate POS invoices, track order delivery, or check your earnings under the Wallet section.";
      } else {
        reply = "Hello! I am your ShilpSetu AI assistant. Ask me how to add products, generate retail bills, check earnings, or track B2B order statuses.";
      }
    }
    
    res.json({ reply });
  }
});

// AI Image Generation Studio (Imagen 3)
app.post('/api/ai/image-studio', async (req, res) => {
  const { productId, style, metadata } = req.body;

  const productName = metadata?.name || 'Handcrafted Indian Saree';
  const productMaterial = metadata?.material || 'Silk';
  const productCategory = metadata?.category || 'Apparel';

  // Construct a descriptive prompt for Imagen 3
  const finalPrompt = `Professional product photography of a ${productName} made of ${productMaterial}, category ${productCategory}. Style instruction: ${style}. Clean studio lighting, 8k resolution, highly detailed texture.`;

  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      throw new Error("Mock key active, skipping real Imagen generation");
    }

    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: finalPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });

    if (response && response.generatedImages && response.generatedImages[0]) {
      const base64Image = response.generatedImages[0].image.imageBytes;
      return res.json({ url: `data:image/jpeg;base64,${base64Image}` });
    }

    throw new Error("No image generated by SDK");
  } catch (error) {
    console.warn("Imagen generation failed or API key not available, using dynamic fallback:", error.message);
    
    // Curated high-fidelity fallback selector based on name & style
    const styleLower = style.toLowerCase();
    const nameLower = productName.toLowerCase();
    
    let imageUrl = 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600'; // Default fallback
    
    // Determine if it is a saree / textiles product (either from product name or prompt keywords)
    const isSareeProduct = nameLower.includes('saree') || nameLower.includes('banarasi') || nameLower.includes('chanderi') || styleLower.includes('saree') || styleLower.includes('garment') || styleLower.includes('traditional indian fashion') || styleLower.includes('apparel');
    
    if (isSareeProduct) {
      if (styleLower.includes('model') || styleLower.includes('wearing')) {
        imageUrl = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600'; 
      } else if (styleLower.includes('white') || styleLower.includes('background') || styleLower.includes('#ffffff')) {
        imageUrl = 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600'; 
      } else if (styleLower.includes('lifestyle') || styleLower.includes('courtyard')) {
        imageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'; 
      } else if (styleLower.includes('catalog') || styleLower.includes('lookbook')) {
        imageUrl = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'; 
      } else if (styleLower.includes('luxury') || styleLower.includes('designer') || styleLower.includes('marble')) {
        imageUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'; 
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600';
      }
    } else if (nameLower.includes('pot') || nameLower.includes('clay') || nameLower.includes('terracotta') || styleLower.includes('pot') || styleLower.includes('clay') || styleLower.includes('terracotta')) {
      if (styleLower.includes('lifestyle')) {
        imageUrl = 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600';
      }
    }
    
    // Simulate natural AI studio network latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    res.json({ url: imageUrl });
  }
});

// --- BRAND WIDGET & INTEGRATION ENDPOINTS ---

// 1. Get Brand store connection settings
app.get('/api/brand/:brandId/store', (req, res) => {
  const db = getDB();
  const store = db.stores.find(s => s.brandId === req.params.brandId);
  if (!store) {
    return res.status(404).json({ error: "Store connection not found." });
  }
  res.json(store);
});

// 2. Setup/initialize store connection for a brand (first time or re-setup)
app.post('/api/brand/:brandId/store/setup', (req, res) => {
  const db = getDB();
  let store = db.stores.find(s => s.brandId === req.params.brandId);
  
  if (!store) {
    store = {
      id: 'STORE001',
      brandId: req.params.brandId,
      storeToken: 'tok_shilp_a8b9c2',
      apiKey: 'pk_live_shilpsetusecret992',
      connectedPlatform: req.body.platform || 'Shopify',
      connectionStatus: 'Connected',
      widgetVersion: 'v1.2.0'
    };
    db.stores.push(store);
    saveDB(db);
  }
  res.json(store);
});

// 3. Reconnect / status update
app.post('/api/brand/:brandId/store/status', (req, res) => {
  const db = getDB();
  const storeIndex = db.stores.findIndex(s => s.brandId === req.params.brandId);
  if (storeIndex === -1) {
    return res.status(404).json({ error: "Store not found." });
  }
  db.stores[storeIndex] = {
    ...db.stores[storeIndex],
    connectionStatus: req.body.connectionStatus || 'Connected',
    connectedPlatform: req.body.connectedPlatform || db.stores[storeIndex].connectedPlatform
  };
  saveDB(db);
  res.json(db.stores[storeIndex]);
});

// 4. Get collections for a brand store
app.get('/api/brand/:brandId/collections', (req, res) => {
  const db = getDB();
  const store = db.stores.find(s => s.brandId === req.params.brandId);
  if (!store) {
    return res.json([]);
  }
  const collections = db.collections.filter(c => c.storeId === store.id);
  res.json(collections);
});

// 5. Create a collection
app.post('/api/brand/:brandId/collections', (req, res) => {
  const db = getDB();
  const store = db.stores.find(s => s.brandId === req.params.brandId);
  if (!store) {
    return res.status(404).json({ error: "Store not initialized." });
  }
  const newCol = {
    id: 'col-' + (db.collections.length + 1),
    storeId: store.id,
    name: req.body.name.toLowerCase().replace(/\s+/g, '-'),
    label: req.body.name,
    visibility: 'Published',
    widgetStatus: 'active'
  };
  db.collections.push(newCol);
  saveDB(db);
  res.status(201).json(newCol);
});

// 6. Sync product to collection
app.post('/api/brand/:brandId/collections/sync-product', (req, res) => {
  const db = getDB();
  const { productId, collectionName, status } = req.body;
  const store = db.stores.find(s => s.brandId === req.params.brandId);
  if (!store) {
    return res.status(404).json({ error: "Store not found." });
  }

  // Find or create collection
  let collection = db.collections.find(c => c.storeId === store.id && c.name === collectionName.toLowerCase().replace(/\s+/g, '-'));
  if (!collection) {
    collection = {
      id: 'col-' + (db.collections.length + 1),
      storeId: store.id,
      name: collectionName.toLowerCase().replace(/\s+/g, '-'),
      label: collectionName,
      visibility: 'Published',
      widgetStatus: 'active'
    };
    db.collections.push(collection);
  }

  // Check if mapping already exists
  let mapping = db.collectionProducts.find(cp => cp.collectionId === collection.id && cp.productId === productId);
  if (!mapping) {
    mapping = {
      id: 'cp-' + (db.collectionProducts.length + 1),
      collectionId: collection.id,
      productId: productId,
      status: status || 'Published'
    };
    db.collectionProducts.push(mapping);
  } else {
    mapping.status = status || mapping.status;
  }
  saveDB(db);
  res.json({ success: true, collection, mapping });
});

// 7. Get products inside collection (Public API for Widget embed)
app.get('/api/store/:storeId/collections/:collection', (req, res) => {
  const db = getDB();
  const collectionName = req.params.collection.toLowerCase();
  
  // Find collection in store
  const collection = db.collections.find(c => c.storeId === req.params.storeId && c.name === collectionName);
  if (!collection) {
    return res.json([]);
  }

  // Find mapped products
  const mappings = db.collectionProducts.filter(cp => cp.collectionId === collection.id && cp.status !== 'Hidden');
  
  // Fetch detailed product info
  const results = mappings.map(m => {
    const prod = db.products.find(p => p.id === m.productId);
    if (!prod) return null;
    return {
      id: prod.id,
      title: prod.name,
      price: prod.price,
      images: prod.images,
      inventory: prod.stockQty,
      moq: prod.moq || 2,
      sku: prod.sku,
      status: prod.stockQty <= 0 ? 'Out of Stock' : m.status
    };
  }).filter(Boolean);

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`ShilpSetu Mock Server running on http://localhost:${PORT}`);
});
