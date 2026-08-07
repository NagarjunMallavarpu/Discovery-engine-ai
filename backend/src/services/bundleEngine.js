const prisma = require('../config/db');

/**
 * Phase 2: Smart Shopping Experience – Bundle Engine
 *
 * Generates:
 * 1. Frequently Bought Together (Amazon-style, 2-3 complementary products)
 * 2. Complete The Look / Smart Bundles (4-piece curated ecosystem bundle)
 *
 * Uses cross-category affinity rules + purchase order history patterns.
 */

/**
 * Cross-category complementary affinity map.
 * Keys: source category slug → array of complementary category slugs (priority-ordered).
 */
const CROSS_CATEGORY_AFFINITY = {
  'laptops': ['audio', 'gaming', 'smart-home'],
  'gaming': ['audio', 'laptops', 'wearables'],
  'smartphones': ['audio', 'wearables', 'smart-home'],
  'audio': ['smartphones', 'laptops', 'gaming'],
  'wearables': ['smartphones', 'smart-home', 'audio'],
  'smart-home': ['wearables', 'audio', 'smartphones']
};

/**
 * Specific keyword-based product type affinities.
 * Used to add hyper-targeted product matching hints within a category.
 */
const KEYWORD_AFFINITY_HINTS = {
  // Laptop buyers → peripherals
  'laptop': ['mouse', 'keyboard', 'hub', 'bag', 'headset', 'monitor', 'cooling'],
  'macbook': ['airpods', 'hub', 'magic mouse', 'sleeve', 'charger'],
  // Smartphone buyers → accessories
  'iphone': ['airpods', 'magsafe', 'case', 'power bank', 'charger'],
  'galaxy': ['watch', 'earbuds', 'charger', 'case'],
  'pixel': ['earbuds', 'case', 'charger', 'power bank'],
  // Gaming buyers → peripherals + audio
  'gaming': ['headset', 'mouse', 'keyboard', 'mousepad', 'controller'],
  'rog': ['headset', 'mouse', 'keyboard', 'cooling'],
  'ps5': ['headset', 'controller', 'charging dock'],
  // Smartwatch buyers → accessories
  'watch': ['strap', 'charger', 'earbuds'],
  // Audio
  'headphones': ['phone', 'laptop', 'speaker', 'dac'],
  'earbuds': ['phone', 'case', 'power bank']
};

/**
 * Scoring helper: returns how relevant a candidate product is to the source product.
 */
function computeComplementaryScore(sourceProduct, candidateProduct) {
  let score = 0;

  const sourceTitle = sourceProduct.title.toLowerCase();
  const sourceCategory = sourceProduct.category?.slug || '';
  const candTitle = candidateProduct.title.toLowerCase();
  const candCategory = candidateProduct.category?.slug || '';

  // Cross-category affinity base score
  const affinities = CROSS_CATEGORY_AFFINITY[sourceCategory] || [];
  const affinityIdx = affinities.indexOf(candCategory);
  if (affinityIdx === 0) score += 40;
  else if (affinityIdx === 1) score += 28;
  else if (affinityIdx === 2) score += 18;

  // Keyword hint boost
  for (const [kw, hints] of Object.entries(KEYWORD_AFFINITY_HINTS)) {
    if (sourceTitle.includes(kw)) {
      for (const hint of hints) {
        if (candTitle.includes(hint)) score += 20;
      }
    }
  }

  // Quality signals
  score += (candidateProduct.rating / 5.0) * 15; // up to 15 for rating
  if (candidateProduct.isTrending) score += 8;
  if (candidateProduct.isFeatured) score += 5;
  score += Math.min(candidateProduct.reviewCount, 200) * 0.05; // max 10 from review count

  return score;
}

/**
 * 1. FREQUENTLY BOUGHT TOGETHER
 * Returns 2–3 complementary products from related categories.
 * Uses order history cross-patterns first, falls back to category affinity scoring.
 * @param {string} productId
 * @param {number} limit
 */
async function getFrequentlyBoughtTogether(productId, limit = 3) {
  const sourceProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, images: true }
  });

  if (!sourceProduct) return [];

  // 1. Try to use co-order history patterns (real purchase pairs)
  const coOrderedProductIds = await getCoOrderedProducts(productId, limit);

  if (coOrderedProductIds.length >= limit) {
    const coOrdered = await prisma.product.findMany({
      where: { id: { in: coOrderedProductIds }, isActive: true },
      include: { category: true, images: true }
    });

    return coOrdered.map(p => ({
      ...p,
      bundleReason: getBundleReason(sourceProduct, p, 'frequently-bought'),
      bundleType: 'frequently-bought',
      pairScore: 92
    }));
  }

  // 2. Fallback: Category affinity scoring
  const sourceCategory = sourceProduct.category?.slug || '';
  const relatedSlugs = CROSS_CATEGORY_AFFINITY[sourceCategory] || [];

  if (relatedSlugs.length === 0) return [];

  const catalog = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category: { slug: { in: relatedSlugs } }
    },
    include: { category: true, images: true }
  });

  const scored = catalog
    .map(p => ({ ...p, _score: computeComplementaryScore(sourceProduct, p) }))
    .filter(p => p._score > 10)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  return scored.map(p => ({
    ...p,
    bundleReason: getBundleReason(sourceProduct, p, 'frequently-bought'),
    bundleType: 'frequently-bought',
    pairScore: Math.min(Math.round(60 + p._score / 2), 96)
  }));
}

/**
 * 2. COMPLETE THE LOOK / SMART BUNDLE
 * Returns a 4-piece curated ecosystem bundle with a 10% discount.
 * @param {string} productId
 * @param {number} limit
 */
async function getSmartBundle(productId, limit = 4) {
  const sourceProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true, images: true }
  });

  if (!sourceProduct) return [];

  const sourceCategory = sourceProduct.category?.slug || '';

  // Try to get diverse items from multiple complementary categories
  const relatedSlugs = CROSS_CATEGORY_AFFINITY[sourceCategory] || [];
  const allRelated = relatedSlugs.length === 0
    ? Object.keys(CROSS_CATEGORY_AFFINITY).filter(s => s !== sourceCategory)
    : relatedSlugs;

  // Fetch a pool of products from related categories
  const candidatePool = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category: { slug: { in: allRelated } }
    },
    include: { category: true, images: true },
    take: 40
  });

  if (candidatePool.length === 0) return [];

  // Score all candidates
  const scored = candidatePool
    .map(p => ({ ...p, _score: computeComplementaryScore(sourceProduct, p) }))
    .sort((a, b) => b._score - a._score);

  // Pick 1 item per complementary category (category diversity for "ecosystem" feel)
  const selectedCategories = new Set();
  const bundleItems = [];

  for (const item of scored) {
    if (bundleItems.length >= limit) break;
    const catSlug = item.category?.slug;
    if (!selectedCategories.has(catSlug)) {
      selectedCategories.add(catSlug);
      bundleItems.push({
        ...item,
        bundleReason: getBundleReason(sourceProduct, item, 'smart-bundle'),
        bundleType: 'smart-bundle',
        pairScore: Math.min(Math.round(65 + item._score / 2), 98)
      });
    }
  }

  // If we couldn't fill 4 with unique categories, pad from top scored
  if (bundleItems.length < limit) {
    for (const item of scored) {
      if (bundleItems.length >= limit) break;
      if (!bundleItems.find(b => b.id === item.id)) {
        bundleItems.push({
          ...item,
          bundleReason: getBundleReason(sourceProduct, item, 'smart-bundle'),
          bundleType: 'smart-bundle',
          pairScore: Math.min(Math.round(60 + item._score / 2), 95)
        });
      }
    }
  }

  return bundleItems;
}

/**
 * Query co-purchase order history: find products frequently bought in the same order
 */
async function getCoOrderedProducts(productId, limit) {
  try {
    // Find orders that contain this product
    const ordersWithProduct = await prisma.orderItem.findMany({
      where: { productId },
      select: { orderId: true },
      take: 50
    });

    if (ordersWithProduct.length === 0) return [];

    const orderIds = ordersWithProduct.map(o => o.orderId);

    // Find other products in those same orders
    const coItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: orderIds },
        productId: { not: productId }
      },
      select: { productId: true }
    });

    // Count co-occurrence frequency
    const freq = {};
    coItems.forEach(ci => {
      freq[ci.productId] = (freq[ci.productId] || 0) + 1;
    });

    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([pid]) => pid);
  } catch (err) {
    return [];
  }
}

/**
 * Generate a human-readable bundle pairing reason
 */
function getBundleReason(source, candidate, bundleType) {
  const sourceName = source.title.split(' ').slice(0, 3).join(' ');
  const sourceCategory = source.category?.name || 'this product';
  const candCategory = candidate.category?.name || 'category';

  if (bundleType === 'frequently-bought') {
    const reasons = [
      `Pairs perfectly with ${sourceName}`,
      `Frequently purchased alongside ${sourceCategory} items`,
      `Popular add-on for ${sourceCategory} buyers`,
      `Customers who bought ${sourceName} also bought this`,
      `Essential companion for ${sourceName}`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  } else {
    const reasons = [
      `Completes your ${sourceCategory} setup`,
      `Part of the ultimate ${sourceCategory} ecosystem`,
      `Essential ${candCategory} for ${sourceCategory} users`,
      `Highly rated complement to ${sourceName}`,
      `Bundle upgrade for the complete experience`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }
}

/**
 * Calculate bundle total and savings
 */
function computeBundlePricing(sourceProduct, bundleItems, discountRate = 0.10) {
  const allItems = [sourceProduct, ...bundleItems];
  const totalOriginal = allItems.reduce((sum, p) => sum + p.price, 0);
  const savings = Math.round(totalOriginal * discountRate);
  const bundlePrice = totalOriginal - savings;
  return { totalOriginal, bundlePrice, savings, discountPercent: Math.round(discountRate * 100) };
}

module.exports = {
  getFrequentlyBoughtTogether,
  getSmartBundle,
  computeBundlePricing
};
