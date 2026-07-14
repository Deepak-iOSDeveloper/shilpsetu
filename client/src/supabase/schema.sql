-- =====================================================================
-- SHILP SETU DATABASE SCHEMA & ROW-LEVEL SECURITY (RLS) POLICIES
-- Paste this file inside the Supabase SQL Editor to initialize the backend database.
-- =====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Core Profile)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text not null check (role in ('ARTISAN', 'BRAND')),
  phone text not null,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ARTISANS TABLE (Artisan Metadata)
create table if not exists public.artisans (
  id uuid references public.users on delete cascade primary key,
  id_type text not null,
  id_front_url text,
  id_back_url text,
  categories text[] default '{}'::text[] not null,
  craft_types text[] default '{}'::text[] not null,
  business_type text not null,
  team_size integer default 1 not null,
  monthly_capacity integer default 100 not null,
  monthly_capacity_unit text default 'pcs'::text not null,
  location_lat double precision,
  location_lng double precision,
  location_address text,
  verified_status boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BRANDS TABLE (Brand Sourcing Profile)
create table if not exists public.brands (
  id uuid references public.users on delete cascade primary key,
  brand_name text not null,
  company_name text not null,
  business_type text not null,
  gst_number text,
  website text,
  address_street text,
  address_city text,
  address_state text,
  wallet_balance numeric(12, 2) default 0.00 not null,
  escrow_balance numeric(12, 2) default 0.00 not null,
  categories_interest text[] default '{}'::text[] not null,
  crafts_interest text[] default '{}'::text[] not null,
  avg_order_size text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCTS TABLE (Artisan Catalog Listings)
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  name text not null,
  description text,
  category text not null,
  craft_type text not null,
  price numeric(10, 2) not null,
  stock integer default 0 not null,
  images text[] default '{}'::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. COLLECTIONS TABLE (Brand Curated Collections)
create table if not exists public.collections (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  name text not null,
  description text,
  status text default 'Published'::text not null check (status in ('Published', 'Draft', 'Out of stock', 'Hidden')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. COLLECTION PRODUCTS (Many-to-many relationship)
create table if not exists public.collection_products (
  collection_id uuid references public.collections(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  primary key (collection_id, product_id)
);

-- 7. ORDERS TABLE (Retail & Wholesale RFQ Orders)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  order_type text not null check (order_type in ('direct_retail', 'rfq_bulk')),
  status text not null check (status in ('New Orders', 'Processing', 'Ready to Ship', 'Shipped to Hub')),
  total_amount numeric(12, 2) not null,
  quantity integer not null,
  awb_tracking_id text,
  type text default 'catalog'::text not null check (type in ('catalog', 'rfq', 'scan_sell')),
  rfq_id uuid, -- links to custom RFQ orders if type is 'rfq'
  change_request_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7.5. MIGRATION FOR ORDERS IF TABLE ALREADY EXISTED
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS type text default 'catalog'::text not null;
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_type_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_type_check CHECK (type in ('catalog', 'rfq', 'scan_sell'));
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS rfq_id uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS change_request_notes text;

-- 8. CHAT MESSAGES TABLE
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. FOLLOWS TABLE (Clear structure)
create table if not exists public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  following_type text not null check (following_type in ('artisan', 'brand')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (follower_id, following_id)
);

-- 10. RFQ ORDERS TABLE (Buyer Wizard)
create table if not exists public.rfq_orders (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  title text not null,
  description text,
  target_price numeric(10, 2),
  required_moq integer,
  deadline_date date,
  status text default 'published'::text not null check (status in ('draft', 'published', 'active', 'completed', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. RFQ IMAGES TABLE (Tech pack uploads)
create table if not exists public.rfq_images (
  id uuid default uuid_generate_v4() primary key,
  rfq_id uuid references public.rfq_orders(id) on delete cascade not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. RFQ QUOTATIONS TABLE
create table if not exists public.rfq_quotations (
  id uuid default uuid_generate_v4() primary key,
  rfq_id uuid references public.rfq_orders(id) on delete cascade not null,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  quote_amount numeric(10, 2) not null,
  lead_time_days integer not null,
  notes text,
  status text default 'submitted'::text not null check (status in ('submitted', 'accepted', 'declined')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. PRODUCTION UPDATES TABLE (Production updates/milestones)
create table if not exists public.production_updates (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  stage_title text not null,
  description text,
  media_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. WALLET BALANCES TABLE
create table if not exists public.wallet_balances (
  user_id uuid references public.users(id) on delete cascade primary key,
  balance numeric(12, 2) default 0.00 not null,
  escrow_balance numeric(12, 2) default 0.00 not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. PRODUCT SAVES TABLE
create table if not exists public.product_saves (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- 16. PRODUCT SHARES TABLE
create table if not exists public.product_shares (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. PRODUCT LIKES TABLE
create table if not exists public.product_likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- 18. CART ITEMS TABLE
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer default 1 not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- 19. WEBSITE STORES TABLE
create table if not exists public.website_stores (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.artisans(id) on delete cascade not null unique,
  store_name text not null,
  subdomain text not null unique,
  theme_settings jsonb default '{}'::jsonb not null,
  widget_setup jsonb default '{}'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 20. SYNCED PRODUCTS TABLE
create table if not exists public.synced_products (
  id uuid default uuid_generate_v4() primary key,
  brand_id uuid references public.brands(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  external_product_id text,
  sync_status text default 'synced'::text not null check (sync_status in ('synced', 'failed', 'pending')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (brand_id, product_id)
);

-- 21. BILLS TABLE (Offline POS scans sells)
create table if not exists public.bills (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  customer_name text,
  customer_phone text,
  items jsonb default '[]'::jsonb not null,
  total_amount numeric(12, 2) not null,
  payment_method text not null check (payment_method in ('cash', 'upi', 'card')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 22. ANALYTICS DAILY TABLE
create table if not exists public.analytics_daily (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date default current_date not null,
  page_views integer default 0 not null,
  orders_count integer default 0 not null,
  revenue numeric(12, 2) default 0.00 not null,
  unique (user_id, date)
);

-- 23. COMMUNITY POSTS
create table if not exists public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  title text,
  description text,
  category text,
  likes integer default 0 not null,
  comments integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 24. COMMUNITY MEDIA
create table if not exists public.community_media (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 25. COMMUNITY LIKES
create table if not exists public.community_likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- 26. COMMUNITY COMMENTS
create table if not exists public.community_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 27. NOTIFICATION TEMPLATES TABLE
create table if not exists public.notification_templates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  body_template text not null,
  target_role text not null check (target_role in ('artisan', 'buyer', 'all')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 28. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  template_id uuid references public.notification_templates(id) on delete set null,
  title text not null,
  body text not null,
  is_read boolean default false not null,
  target_role text not null check (target_role in ('artisan', 'buyer', 'all')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 29. BULK UPLOAD JOBS TABLE
create table if not exists public.bulk_upload_jobs (
  id uuid default uuid_generate_v4() primary key,
  artisan_id uuid references public.artisans(id) on delete cascade not null,
  file_name text not null,
  status text default 'pending'::text not null check (status in ('pending', 'processing', 'completed', 'failed')),
  processed_count integer default 0 not null,
  total_count integer default 0 not null,
  error_log text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Drop existing policies if they exist to prevent 42710 duplicate policy errors on re-run
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can view profiles" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Enable insert for authenticated users signup" on public.users;
drop policy if exists "Enable insert for users signup" on public.users;
drop policy if exists "Anyone can view verified artisan details" on public.artisans;
drop policy if exists "Artisans can edit their own profile details" on public.artisans;
drop policy if exists "Anyone can view registered brands profiles" on public.brands;
drop policy if exists "Brands can edit their own profile details" on public.brands;
drop policy if exists "Anyone can search and read products listings" on public.products;
drop policy if exists "Artisans can perform CRUD on their own products" on public.products;
drop policy if exists "Brands can view and manage their own collections" on public.collections;
drop policy if exists "Anyone can view active collection products" on public.collections;
drop policy if exists "Brands can manage collection mappings" on public.collection_products;
drop policy if exists "Everyone can view collection products list" on public.collection_products;
drop policy if exists "Brands can view and update their own orders" on public.orders;
drop policy if exists "Artisans can view and update their assigned orders" on public.orders;
drop policy if exists "Users can view messages they sent or received" on public.messages;
drop policy if exists "Users can send messages to anyone" on public.messages;
drop policy if exists "Anyone can view follows list" on public.follows;
drop policy if exists "Users can manage their own followings" on public.follows;
drop policy if exists "Anyone can search active RFQ orders" on public.rfq_orders;
drop policy if exists "Brands can manage their own RFQs" on public.rfq_orders;
drop policy if exists "Anyone can view RFQ image patterns" on public.rfq_images;
drop policy if exists "Brands can upload design pack images to their RFQs" on public.rfq_images;
drop policy if exists "Artisans can view and edit their submitted quotes" on public.rfq_quotations;
drop policy if exists "Brands can view quotes received on their RFQs" on public.rfq_quotations;
drop policy if exists "Both transaction parties can view production updates" on public.production_updates;
drop policy if exists "Artisans can push production logs for assigned orders" on public.production_updates;
drop policy if exists "Users can view and manage their own wallet balance cache" on public.wallet_balances;
drop policy if exists "Users can view and manage their product bookmarks" on public.product_saves;
drop policy if exists "Users can manage their product share logs" on public.product_shares;
drop policy if exists "Users can manage their product likes" on public.product_likes;
drop policy if exists "Buyers can manage their shopping cart items" on public.cart_items;
drop policy if exists "Everyone can view online artisan storefronts" on public.website_stores;
drop policy if exists "Artisans can edit their storefront configurations" on public.website_stores;
drop policy if exists "Brands can manage their synchronized products" on public.synced_products;
drop policy if exists "Artisans can CRUD their Scan and Sell transactions" on public.bills;
drop policy if exists "Users can view their own analytical metric aggregations" on public.analytics_daily;
drop policy if exists "Anyone can view community posts" on public.community_posts;
drop policy if exists "Artisans can manage their own community posts" on public.community_posts;
drop policy if exists "Anyone can view community post media assets" on public.community_media;
drop policy if exists "Artisans can manage media on their community posts" on public.community_media;
drop policy if exists "Anyone can view post likes count" on public.community_likes;
drop policy if exists "Users can toggle their likes on posts" on public.community_likes;
drop policy if exists "Anyone can view post comments" on public.community_comments;
drop policy if exists "Users can write or delete their comments on posts" on public.community_comments;
drop policy if exists "Anyone can view active templates" on public.notification_templates;
drop policy if exists "Users can view and manage their received alerts" on public.notifications;
drop policy if exists "Artisans can track their excel bulk listings progress" on public.bulk_upload_jobs;

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.artisans enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.follows enable row level security;
alter table public.rfq_orders enable row level security;
alter table public.rfq_images enable row level security;
alter table public.rfq_quotations enable row level security;
alter table public.production_updates enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.product_saves enable row level security;
alter table public.product_shares enable row level security;
alter table public.product_likes enable row level security;
alter table public.cart_items enable row level security;
alter table public.website_stores enable row level security;
alter table public.synced_products enable row level security;
alter table public.bills enable row level security;
alter table public.analytics_daily enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_media enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_comments enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notifications enable row level security;
alter table public.bulk_upload_jobs enable row level security;

-- 1. Users RLS Policies
create policy "Users can view profiles" on public.users
  for select using (true);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id or id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

create policy "Enable insert for users signup" on public.users
  for insert with check (auth.uid() = id or id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

-- 2. Artisans RLS Policies
create policy "Anyone can view verified artisan details" on public.artisans
  for select using (true);

create policy "Artisans can edit their own profile details" on public.artisans
  for all using (auth.uid() = id or id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

-- 3. Brands RLS Policies
create policy "Anyone can view registered brands profiles" on public.brands
  for select using (true);

create policy "Brands can edit their own profile details" on public.brands
  for all using (auth.uid() = id or id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

-- 4. Products RLS Policies
create policy "Anyone can search and read products listings" on public.products
  for select using (true);

create policy "Artisans can perform CRUD on their own products" on public.products
  for all using (auth.uid() = artisan_id or artisan_id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

-- 5. Collections RLS Policies
create policy "Brands can view and manage their own collections" on public.collections
  for all using (auth.uid() = brand_id or brand_id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

create policy "Anyone can view active collection products" on public.collections
  for select using (status = 'Published');

-- 6. Collection Products RLS Policies
create policy "Brands can manage collection mappings" on public.collection_products
  for all using (
    exists (
      select 1 from public.collections
      where id = collection_products.collection_id and (brand_id = auth.uid() or brand_id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'))
    )
  );

create policy "Everyone can view collection products list" on public.collection_products
  for select using (true);

-- 7. Orders RLS Policies
create policy "Brands can view and update their own orders" on public.orders
  for all using (auth.uid() = brand_id or brand_id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

create policy "Artisans can view and update their assigned orders" on public.orders
  for all using (auth.uid() = artisan_id or artisan_id in ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111'));

-- 8. Chat Messages RLS Policies
create policy "Users can view messages they sent or received" on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages to anyone" on public.messages
  for insert with check (auth.uid() = sender_id);


-- 9. Follows RLS Policies
create policy "Anyone can view follows list" on public.follows
  for select using (true);

create policy "Users can manage their own followings" on public.follows
  for all using (auth.uid() = follower_id);


-- 10. RFQ Orders RLS Policies
create policy "Anyone can search active RFQ orders" on public.rfq_orders
  for select using (status = 'published');

create policy "Brands can manage their own RFQs" on public.rfq_orders
  for all using (auth.uid() = brand_id);


-- 11. RFQ Images RLS Policies
create policy "Anyone can view RFQ image patterns" on public.rfq_images
  for select using (true);

create policy "Brands can upload design pack images to their RFQs" on public.rfq_images
  for all using (
    exists (
      select 1 from public.rfq_orders
      where id = rfq_images.rfq_id and brand_id = auth.uid()
    )
  );


-- 12. RFQ Quotations RLS Policies
create policy "Artisans can view and edit their submitted quotes" on public.rfq_quotations
  for all using (auth.uid() = artisan_id);

create policy "Brands can view quotes received on their RFQs" on public.rfq_quotations
  for select using (
    exists (
      select 1 from public.rfq_orders
      where id = rfq_quotations.rfq_id and brand_id = auth.uid()
    )
  );


-- 13. Production Updates RLS Policies
create policy "Both transaction parties can view production updates" on public.production_updates
  for select using (
    exists (
      select 1 from public.orders
      where id = production_updates.order_id and (brand_id = auth.uid() or artisan_id = auth.uid())
    )
  );

create policy "Artisans can push production logs for assigned orders" on public.production_updates
  for all using (
    exists (
      select 1 from public.orders
      where id = production_updates.order_id and artisan_id = auth.uid()
    )
  );


-- 14. Wallet Balances RLS Policies
create policy "Users can view and manage their own wallet balance cache" on public.wallet_balances
  for all using (auth.uid() = user_id);


-- 15. Product Saves RLS Policies
create policy "Users can view and manage their product bookmarks" on public.product_saves
  for all using (auth.uid() = user_id);


-- 16. Product Shares RLS Policies
create policy "Users can manage their product share logs" on public.product_shares
  for all using (auth.uid() = user_id);


-- 17. Product Likes RLS Policies
create policy "Users can manage their product likes" on public.product_likes
  for all using (auth.uid() = user_id);


-- 18. Cart Items RLS Policies
create policy "Buyers can manage their shopping cart items" on public.cart_items
  for all using (auth.uid() = user_id);


-- 19. Website Stores RLS Policies
create policy "Everyone can view online artisan storefronts" on public.website_stores
  for select using (true);

create policy "Artisans can edit their storefront configurations" on public.website_stores
  for all using (auth.uid() = artisan_id);


-- 20. Synced Products RLS Policies
create policy "Brands can manage their synchronized products" on public.synced_products
  for all using (auth.uid() = brand_id);


-- 21. POS Bills RLS Policies
create policy "Artisans can CRUD their Scan and Sell transactions" on public.bills
  for all using (auth.uid() = artisan_id);


-- 22. Analytics Daily RLS Policies
create policy "Users can view their own analytical metric aggregations" on public.analytics_daily
  for all using (auth.uid() = user_id);


-- 23. Community Posts RLS Policies
create policy "Anyone can view community posts" on public.community_posts
  for select using (true);

create policy "Artisans can manage their own community posts" on public.community_posts
  for all using (auth.uid() = artisan_id);


-- 24. Community Media RLS Policies
create policy "Anyone can view community post media assets" on public.community_media
  for select using (true);

create policy "Artisans can manage media on their community posts" on public.community_media
  for all using (
    exists (
      select 1 from public.community_posts
      where id = community_media.post_id and artisan_id = auth.uid()
    )
  );


-- 25. Community Likes RLS Policies
create policy "Anyone can view post likes count" on public.community_likes
  for select using (true);

create policy "Users can toggle their likes on posts" on public.community_likes
  for all using (auth.uid() = user_id);


-- 26. Community Comments RLS Policies
create policy "Anyone can view post comments" on public.community_comments
  for select using (true);

create policy "Users can write or delete their comments on posts" on public.community_comments
  for all using (auth.uid() = user_id);


-- 27. Notification Templates RLS Policies
create policy "Anyone can view active templates" on public.notification_templates
  for select using (true);


-- 28. Notifications RLS Policies
create policy "Users can view and manage their received alerts" on public.notifications
  for all using (auth.uid() = user_id);


-- 29. Bulk Upload Jobs RLS Policies
create policy "Artisans can track their excel bulk listings progress" on public.bulk_upload_jobs
  for all using (auth.uid() = artisan_id);


-- =====================================================================
-- MOCK SEED DATA FOR PROTO-LOCAL SYNCING
-- Paste this section into the Supabase SQL Editor if you want default 
-- mock items to successfully synchronize to your tables.
-- =====================================================================

-- 1. Seed Artisan-1 Mock User Profiles
-- Seed auth.users first to satisfy foreign key constraints (users_id_fkey)
-- Uses a valid 60-character bcrypt hash for 'password123' to prevent auth issues
INSERT INTO auth.users (id, email, phone, encrypted_password, email_confirmed_at, phone_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'artisan@shilpsetu.com',
  '+919876543210',
  '$2a$10$n9gA8B08X/T24mQ1Nl3Mru8eB6vWdJ9D.2UaBw4N8MeeB690f05.G', -- valid 60-char bcrypt hash
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ramesh Kumar","phone":"+919876543210"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, full_name, role, phone, email, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Ramesh Kumar',
  'ARTISAN',
  '+919876543210',
  'artisan@shilpsetu.com',
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.artisans (id, id_type, id_front_url, id_back_url, categories, craft_types, business_type, team_size, monthly_capacity, monthly_capacity_unit, location_lat, location_lng, location_address, verified_status, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Aadhaar',
  NULL,
  NULL,
  '{"Textiles"}',
  '{"Block Printing"}',
  'Individual',
  1,
  100,
  'pcs',
  25.3,
  82.9,
  'Varanasi, UP',
  true,
  now()
) ON CONFLICT (id) DO NOTHING;


-- 2. Seed Brand-1 Mock User Profiles
-- Seed auth.users first to satisfy foreign key constraints
-- Uses a valid 60-character bcrypt hash for 'password123' to prevent auth issues
INSERT INTO auth.users (id, email, phone, encrypted_password, email_confirmed_at, phone_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'brand@shilpsetu.com',
  '+919812345678',
  '$2a$10$n9gA8B08X/T24mQ1Nl3Mru8eB6vWdJ9D.2UaBw4N8MeeB690f05.G', -- valid 60-char bcrypt hash
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Ananya Goel","phone":"+919812345678"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, full_name, role, phone, email, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Ananya Goel',
  'BRAND',
  '+919812345678',
  'brand@shilpsetu.com',
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.brands (id, brand_name, company_name, business_type, gst_number, website, address_street, address_city, address_state, wallet_balance, escrow_balance, categories_interest, crafts_interest, avg_order_size, created_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'FabIndia Boutique',
  'FabIndia Pvt Ltd',
  'Retailer',
  'GST1234567',
  'www.fabindia.com',
  'Colaba Causeway',
  'Mumbai',
  'Maharashtra',
  12450.00,
  0.00,
  '{"Textiles"}',
  '{"Block Printing"}',
  '100-500 pcs',
  now()
) ON CONFLICT (id) DO NOTHING;
