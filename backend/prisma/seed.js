const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for expanded catalog (Asus, Sony, Samsung, Lenovo, Razer, Philips, Dell, Apple)...');

  // Clean existing data
  await prisma.recommendationEvent.deleteMany();
  await prisma.customerJourneyEvent.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.viewHistory.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@discovery.ai',
      name: 'Elena Vance (Admin)',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'user@discovery.ai',
      name: 'Alex Rivera',
      passwordHash,
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      cart: { create: {} }
    }
  });

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Laptops',
      slug: 'laptops',
      description: 'MacBooks, ROG gaming laptops, ThinkPads, Razer Blade, and ultrabooks',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    },
    {
      name: 'Audio',
      slug: 'audio',
      description: 'AirPods, Sony XM5, Bose QuietComfort, and high-fidelity wireless audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    },
    {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'iPhones, Samsung Galaxy S24 Ultra, Z Fold 5, and Google Pixel 8 Pro',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    },
    {
      name: 'Gaming',
      slug: 'gaming',
      description: 'PS5 Slim, Razer mice, Keychron mechanical keyboards, and ROG handhelds',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500'
    },
    {
      name: 'Wearables',
      slug: 'wearables',
      description: 'Apple Watch Ultra 2, Galaxy Watch 6 Classic, and biometric trackers',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
    },
    {
      name: 'Smart Home',
      slug: 'smart-home',
      description: 'Philips Hue lights, Apple Studio Displays, Roborock vacuums, and Sony OLED TVs',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500'
    }
  ];

  const categories = {};
  for (const catData of categoriesData) {
    const cat = await prisma.category.create({ data: catData });
    categories[cat.slug] = cat;
  }

  // 3. Products Data for Asus, Sony, Samsung, Lenovo, Razer, Philips, Dell, Apple
  const productsData = [
    // --- ASUS ---
    {
      title: 'Asus ROG Strix G16 Gaming Laptop (Intel i9-13980HX, RTX 4070, 16GB, 1TB)',
      slug: 'asus-rog-strix-g16-gaming-laptop-i9-rtx-4070',
      description: 'Dominate esports with ROG Nebula 240Hz QHD display, Tri-Fan cooling technology, liquid metal thermal compound, and RTX 4070 GPU.',
      price: 169990,
      compareAtPrice: 189990,
      brand: 'Asus',
      categorySlug: 'laptops',
      stock: 20,
      rating: 4.8,
      reviewCount: 230,
      isFeatured: true,
      isTrending: true,
      tags: 'asus, rog strix, gaming laptop, rtx 4070, intel i9, 240hz, esports',
      specifications: { "CPU": "Intel Core i9-13980HX", "GPU": "NVIDIA GeForce RTX 4070 8GB", "Display": "16-inch QHD+ 240Hz" },
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
    },
    {
      title: 'Asus Zenbook 14 OLED (Intel Core Ultra 7, 16GB RAM, 1TB SSD - Jasper Gray)',
      slug: 'asus-zenbook-14-oled-intel-ultra-7',
      description: 'Ultra-portable 1.2kg laptop featuring 3K 120Hz Lumina OLED touch display, Intel AI Boost NPU, and 75Wh battery for all-day mobility.',
      price: 109990,
      compareAtPrice: 119990,
      brand: 'Asus',
      categorySlug: 'laptops',
      stock: 25,
      rating: 4.7,
      reviewCount: 170,
      isFeatured: false,
      isTrending: true,
      tags: 'asus, zenbook 14, oled, intel ultra 7, ai boost, thin, ultrabook',
      specifications: { "CPU": "Intel Core Ultra 7 155H", "Display": "14-inch 3K OLED 120Hz", "Weight": "1.2 kg" },
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800'
    },
    {
      title: 'Asus ROG Ally X Handheld Gaming Console (AMD Z1 Extreme, 24GB LPDDR5X, 1TB)',
      slug: 'asus-rog-ally-x-handheld-gaming-console',
      description: 'Windows 11 handheld console with 80Wh battery, dual USB-C Thunderbolt ports, 120Hz FHD display, and ergonomic grips.',
      price: 89990,
      compareAtPrice: 94990,
      brand: 'Asus',
      categorySlug: 'gaming',
      stock: 18,
      rating: 4.8,
      reviewCount: 310,
      isFeatured: true,
      isTrending: true,
      tags: 'asus, rog ally x, handheld gaming, amd z1 extreme, 120hz, portable gaming',
      specifications: { "APU": "AMD Ryzen Z1 Extreme", "RAM": "24GB LPDDR5X-7500", "Battery": "80Wh" },
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'
    },

    // --- SONY ---
    {
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones (Black)',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      description: 'Industry-leading noise cancellation with two processors and 8 microphones, Auto NC Optimizer, Speak-to-Chat, and 30-hour battery life.',
      price: 29990,
      compareAtPrice: 34990,
      brand: 'Sony',
      categorySlug: 'audio',
      stock: 35,
      rating: 4.8,
      reviewCount: 750,
      isFeatured: true,
      isTrending: true,
      tags: 'sony, wh-1000xm5, noise canceling, over-ear, bluetooth, travel audio',
      specifications: { "Noise Cancellation": "Dual Processors (V1 + QN1)", "Battery": "30 Hours", "Codec": "LDAC, AAC, SBC" },
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    },
    {
      title: 'Sony WF-1000XM5 True Wireless Noise Canceling Earbuds',
      slug: 'sony-wf-1000xm5-wireless-earbuds',
      description: 'The best noise canceling earbuds with Dynamic Driver X, High-Resolution Wireless Audio LDAC, and crystal clear call quality.',
      price: 21990,
      compareAtPrice: 24990,
      brand: 'Sony',
      categorySlug: 'audio',
      stock: 40,
      rating: 4.7,
      reviewCount: 420,
      isFeatured: false,
      isTrending: true,
      tags: 'sony, wf-1000xm5, earbuds, anc, ldac, true wireless',
      specifications: { "Driver": "8.4mm Dynamic Driver X", "Battery": "8 hrs + 16 hrs case" },
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'
    },
    {
      title: 'Sony PlayStation 5 Slim Console (1TB Disc Edition)',
      slug: 'sony-playstation-5-slim-console-1tb',
      description: 'Next-gen gaming power in a sleek slim chassis with 1TB SSD storage, DualSense wireless controller with haptic feedback, and 4K 120Hz support.',
      price: 54990,
      compareAtPrice: 59990,
      brand: 'Sony',
      categorySlug: 'gaming',
      stock: 22,
      rating: 4.9,
      reviewCount: 890,
      isFeatured: true,
      isTrending: true,
      tags: 'sony, ps5 slim, playstation 5, console, 4k 120hz, dualsense',
      specifications: { "Storage": "1TB Custom NVMe SSD", "Graphics": "AMD Radeon RDNA 2", "Output": "4K 120Hz / 8K" },
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800'
    },
    {
      title: 'Sony Bravia XR 55" 4K OLED Smart Google TV (XR-55A80L)',
      slug: 'sony-bravia-xr-55-4k-oled-tv',
      description: 'Cognitive Processor XR delivers pure OLED blacks and lifelike contrast, Acoustic Surface Audio+, and perfect for PlayStation 5 4K 120Hz gaming.',
      price: 174990,
      compareAtPrice: 199990,
      brand: 'Sony',
      categorySlug: 'smart-home',
      stock: 10,
      rating: 4.9,
      reviewCount: 120,
      isFeatured: true,
      isTrending: false,
      tags: 'sony, bravia xr, oled tv, 4k 120hz, google tv, smart home, home theater',
      specifications: { "Display": "55-inch 4K OLED (3840x2160)", "Processor": "Cognitive Processor XR", "HDMI Ports": "4 (2x HDMI 2.1 4K 120Hz)" },
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'
    },

    // --- SAMSUNG ---
    {
      title: 'Samsung Galaxy S24 Ultra (512GB - Titanium Gray)',
      slug: 'samsung-galaxy-s24-ultra-512gb-titanium-gray',
      description: 'Galaxy AI powered flagship with built-in S Pen, 200MP Quad Telephoto camera, and Snapdragon 8 Gen 3 for Galaxy.',
      price: 139999,
      compareAtPrice: 149999,
      brand: 'Samsung',
      categorySlug: 'smartphones',
      stock: 30,
      rating: 4.8,
      reviewCount: 310,
      isFeatured: true,
      isTrending: true,
      tags: 'samsung, galaxy s24 ultra, galaxy ai, 200mp, s pen, android, 5g',
      specifications: { "Display": "6.8-inch QHD+ AMOLED 120Hz", "Chip": "Snapdragon 8 Gen 3", "Camera": "200MP + 50MP + 12MP + 10MP" },
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800'
    },
    {
      title: 'Samsung Galaxy Z Fold 5 (256GB - Phantom Black)',
      slug: 'samsung-galaxy-z-fold-5-256gb-phantom-black',
      description: 'Unfold an immersive 7.6-inch Dynamic AMOLED main screen, Flex Hinge design, PC-like multitasking, and S Pen Fold Edition compatibility.',
      price: 154999,
      compareAtPrice: 164999,
      brand: 'Samsung',
      categorySlug: 'smartphones',
      stock: 15,
      rating: 4.7,
      reviewCount: 190,
      isFeatured: true,
      isTrending: false,
      tags: 'samsung, galaxy z fold 5, foldable, amoled, multitasking, flagship',
      specifications: { "Main Screen": "7.6-inch Dynamic AMOLED 2X 120Hz", "Cover Screen": "6.2-inch AMOLED", "Hinge": "Flex Hinge Dual Rail" },
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'
    },
    {
      title: 'Samsung Galaxy Watch 6 Classic (47mm LTE - Black)',
      slug: 'samsung-galaxy-watch-6-classic-47mm-lte',
      description: 'Iconic rotating bezel, 20% larger display, BIA body composition analysis, personalized heart rate zones, and Advanced Sleep Coaching.',
      price: 42999,
      compareAtPrice: 46999,
      brand: 'Samsung',
      categorySlug: 'wearables',
      stock: 25,
      rating: 4.7,
      reviewCount: 290,
      isFeatured: false,
      isTrending: true,
      tags: 'samsung, galaxy watch 6 classic, rotating bezel, lte, wear os, health',
      specifications: { "Display": "1.5-inch Sapphire Crystal AMOLED", "Sensors": "BIA, ECG, Heart Rate, Sleep Tracking" },
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    },
    {
      title: 'Samsung Odyssey OLED G9 49" Curved Dual QHD Gaming Monitor (240Hz)',
      slug: 'samsung-odyssey-oled-g9-49-curved-gaming-monitor',
      description: 'World’s first 49" Dual QHD OLED gaming monitor with 1800R curve, 0.03ms response time, Neo Quantum Processor Pro, and 240Hz refresh rate.',
      price: 149990,
      compareAtPrice: 169990,
      brand: 'Samsung',
      categorySlug: 'gaming',
      stock: 10,
      rating: 4.9,
      reviewCount: 110,
      isFeatured: true,
      isTrending: true,
      tags: 'samsung, odyssey oled g9, 49 inch, ultrawide, 240hz, 0.03ms, gaming monitor',
      specifications: { "Screen Size": "49-inch Dual QHD (5120x1440)", "Panel": "OLED 1800R Curved", "Refresh Rate": "240Hz" },
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
    },

    // --- LENOVO ---
    {
      title: 'Lenovo Legion Pro 7i Gaming Laptop (Intel i9-14900HX, RTX 4080 12GB, 32GB, 1TB)',
      slug: 'lenovo-legion-pro-7i-gaming-laptop-i9-rtx4080',
      description: 'Unleash AI-tuned gaming with Lenovo LA2-Q AI chip, Legion Coldfront 5.0 vapor chamber cooling, TrueStrike RGB keyboard, and 240Hz QHD+ display.',
      price: 249990,
      compareAtPrice: 269990,
      brand: 'Lenovo',
      categorySlug: 'laptops',
      stock: 14,
      rating: 4.9,
      reviewCount: 160,
      isFeatured: true,
      isTrending: true,
      tags: 'lenovo, legion pro 7i, gaming laptop, rtx 4080, intel i9, vapor chamber, 240hz',
      specifications: { "CPU": "Intel Core i9-14900HX", "GPU": "NVIDIA GeForce RTX 4080 12GB", "RAM": "32GB DDR5" },
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
    },
    {
      title: 'Lenovo ThinkPad X1 Carbon Gen 12 (Intel Core Ultra 7, 32GB RAM, 1TB SSD)',
      slug: 'lenovo-thinkpad-x1-carbon-gen-12',
      description: 'The premier business ultrabook with carbon-fiber chassis, Communications Bar 8MP camera, TrackPoint quick menu, and Intel Evo certification.',
      price: 189990,
      compareAtPrice: 199990,
      brand: 'Lenovo',
      categorySlug: 'laptops',
      stock: 18,
      rating: 4.8,
      reviewCount: 220,
      isFeatured: false,
      isTrending: false,
      tags: 'lenovo, thinkpad x1 carbon, business laptop, intel ultra 7, carbon fiber, trackpoint',
      specifications: { "CPU": "Intel Core Ultra 7 155H", "RAM": "32GB LPDDR5X", "Weight": "1.09 kg" },
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
    },

    // --- RAZER ---
    {
      title: 'Razer Blade 16 Gaming Laptop (Intel i9-14900HX, RTX 4080, Dual-Mode Mini-LED)',
      slug: 'razer-blade-16-gaming-laptop-rtx-4080',
      description: 'World’s first Dual-Mode Mini-LED display switching between UHD+ 120Hz & FHD+ 240Hz, patented vapor chamber cooling, and CNC anodized aluminum body.',
      price: 389990,
      compareAtPrice: 409990,
      brand: 'Razer',
      categorySlug: 'laptops',
      stock: 8,
      rating: 4.9,
      reviewCount: 95,
      isFeatured: true,
      isTrending: true,
      tags: 'razer, razer blade 16, rtx 4080, intel i9, mini-led, premium gaming laptop',
      specifications: { "CPU": "Intel Core i9-14900HX", "GPU": "NVIDIA RTX 4080 12GB", "Display": "16-inch Dual Mode Mini-LED" },
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'
    },
    {
      title: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse (White)',
      slug: 'razer-deathadder-v3-pro-wireless-gaming-mouse',
      description: '63g ultra-lightweight ergonomic mouse, Focus Pro 30K optical sensor, Optical Mouse Switches Gen-3, and HyperSpeed wireless connection.',
      price: 14999,
      compareAtPrice: 16999,
      brand: 'Razer',
      categorySlug: 'gaming',
      stock: 40,
      rating: 4.8,
      reviewCount: 480,
      isFeatured: false,
      isTrending: true,
      tags: 'razer, deathadder v3 pro, wireless mouse, 63g, focus pro 30k, esports',
      specifications: { "Weight": "63g", "Sensor": "Focus Pro 30K Optical", "Battery": "Up to 90 hrs" },
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'
    },

    // --- PHILIPS ---
    {
      title: 'Philips Hue Play Gradient Lightbar Starter Kit (Smart Ambient RGB)',
      slug: 'philips-hue-play-gradient-lightbar-starter-kit',
      description: 'Seamlessly blend multi-color ambient smart lighting behind your gaming monitor or TV, syncs with screen colors and Spotify music.',
      price: 18990,
      compareAtPrice: 21990,
      brand: 'Philips',
      categorySlug: 'smart-home',
      stock: 25,
      rating: 4.7,
      reviewCount: 260,
      isFeatured: false,
      isTrending: true,
      tags: 'philips, hue play gradient, smart lighting, ambient rgb, home theater, smart home',
      specifications: { "Protocol": "Zigbee & Bluetooth", "Colors": "16 Million Gradient Colors", "Sync": "Hue Sync App" },
      imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800'
    },

    // --- DELL ---
    {
      title: 'Dell XPS 15 OLED Touch Workstation (Intel i9, RTX 4060, 32GB, 1TB)',
      slug: 'dell-xps-15-oled-touch-workstation-i9-rtx4060',
      description: '3.5K OLED Touch display with 100% DCI-P3 color accuracy, CNC machined aluminum chassis, and NVIDIA Studio drivers.',
      price: 249990,
      compareAtPrice: 269990,
      brand: 'Dell',
      categorySlug: 'laptops',
      stock: 12,
      rating: 4.6,
      reviewCount: 140,
      isFeatured: false,
      isTrending: false,
      tags: 'dell, xps 15, oled touch, creator laptop, workstation, rtx 4060',
      specifications: { "CPU": "Intel Core i9-13900H", "GPU": "NVIDIA RTX 4060", "Display": "15.6-inch 3.5K OLED Touch" },
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'
    },

    // --- APPLE PRODUCTS ---
    {
      title: 'Apple iPhone 15 Pro Max (256GB - Natural Titanium)',
      slug: 'apple-iphone-15-pro-max-256gb-natural-titanium-alt',
      description: 'Forged in titanium with A17 Pro chip, customizable Action Button, 5x Telephoto optical zoom, and USB-C superfast transfer speeds.',
      price: 159900,
      compareAtPrice: 169900,
      brand: 'Apple',
      categorySlug: 'smartphones',
      stock: 35,
      rating: 4.9,
      reviewCount: 420,
      isFeatured: true,
      isTrending: true,
      tags: 'apple, iphone, 15 pro max, titanium, a17 pro, 5G, flagship, camera',
      specifications: { "Display": "6.7-inch Super Retina XDR OLED 120Hz", "Chip": "A17 Pro 3nm", "Camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto" },
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
    },
    {
      title: 'Apple AirPods Max (Wireless Over-Ear Headphones - Space Gray)',
      slug: 'apple-airpods-max-space-gray-alt',
      description: 'Apple-designed dynamic driver providing high-fidelity audio, Active Noise Cancellation with Transparency mode, and Personalized Spatial Audio.',
      price: 59900,
      compareAtPrice: 64900,
      brand: 'Apple',
      categorySlug: 'audio',
      stock: 22,
      rating: 4.8,
      reviewCount: 310,
      isFeatured: true,
      isTrending: true,
      tags: 'apple, airpods max, over-ear, noise canceling, spatial audio, hi-fi',
      specifications: { "Audio Tech": "Apple H1 Chip (each ear cup), ANC, Transparency Mode", "Battery": "Up to 20 hrs with ANC" },
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
    }
  ];

  let createdCount = 0;
  for (const prodData of productsData) {
    const { categorySlug, imageUrl, specifications, ...rest } = prodData;
    const cat = categories[categorySlug];
    if (!cat) continue;

    await prisma.product.create({
      data: {
        ...rest,
        categoryId: cat.id,
        specifications: JSON.stringify(specifications || {}),
        images: {
          create: [{ url: imageUrl, isPrimary: true }]
        }
      }
    });
    createdCount++;
  }
  console.log(`🛍️ Successfully seeded ${createdCount} products for Asus, Sony, Samsung, Lenovo, Razer, Philips, Dell, and Apple!`);

  // 4. Pre-seed Search History
  await prisma.searchHistory.createMany({
    data: [
      { userId: customerUser.id, query: 'asus rog gaming laptop rtx 4070', parsedCategory: 'Laptops', parsedMaxPrice: 180000, parsedBrand: 'Asus', intentTag: 'Gaming Setup', resultsCount: 4 },
      { userId: customerUser.id, query: 'sony wh-1000xm5 noise canceling headphones', parsedCategory: 'Audio', parsedMaxPrice: 35000, parsedBrand: 'Sony', intentTag: 'Audio Enthusiast', resultsCount: 3 },
      { userId: customerUser.id, query: 'samsung galaxy s24 ultra titanium', parsedCategory: 'Smartphones', parsedMaxPrice: 150000, parsedBrand: 'Samsung', intentTag: 'Premium Buyer', resultsCount: 3 },
      { userId: customerUser.id, query: 'lenovo legion pro 7i rtx 4080', parsedCategory: 'Laptops', parsedMaxPrice: 270000, parsedBrand: 'Lenovo', intentTag: 'Gaming Setup', resultsCount: 2 }
    ]
  });

  console.log('🎉 EXPANDED CATALOG SEEDING COMPLETED SUCCESSFULLY!');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
