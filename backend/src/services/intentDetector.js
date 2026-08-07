const prisma = require('../config/db');

/**
 * Real-Time Session Intent Detection Engine
 * Analyzes search queries, viewed product categories, view durations, wishlist, cart, and price points
 * to calculate real-time user intent profiles.
 */
class IntentDetector {
  /**
   * Intent Category & Keyword Mapping rules
   */
  static INTENT_PROFILES = {
    'Gaming Setup': {
      categories: ['laptops', 'gaming'],
      keywords: ['gaming', 'rtx', 'rog', 'legion', 'predator', 'ps5', 'playstation', 'console', '240hz', 'oled', 'mouse', 'keyboard', 'esports', 'gpu', 'superlight'],
      weight: 1.0
    },
    'Office Setup': {
      categories: ['laptops'],
      keywords: ['macbook', 'ultrabook', 'spectre', 'workstation', 'productivity', 'dell', 'lenovo', 'hp', 'monitor', 'keyboard', 'office', 'work'],
      weight: 1.0
    },
    'Photography': {
      categories: ['smartphones'],
      keywords: ['camera', 'pixel', 'leica', 'telephoto', '200mp', '48mp', 'iphone', 'hasselblad', 'zoom', 'optics', 'photo'],
      weight: 1.0
    },
    'Fitness': {
      categories: ['wearables'],
      keywords: ['fitness', 'garmin', 'watch ultra', 'galaxy watch', 'tracker', 'health', 'heart rate', 'ecg', 'solar', 'run', 'marathon', 'gps'],
      weight: 1.0
    },
    'Smart Home': {
      categories: ['smart-home'],
      keywords: ['hue', 'smart light', 'echo show', 'alexa', 'roborock', 'vacuum', 'robot', 'mop', 'zigbee', 'homekit', 'ambient'],
      weight: 1.0
    },
    'Audio Enthusiast': {
      categories: ['audio'],
      keywords: ['sony wh', 'airpods', 'bose', 'quietcomfort', 'marshall', 'jbl', 'headphones', 'earbuds', 'speaker', 'anc', 'spatial audio', 'noise canceling', 'audiophile', 'bass'],
      weight: 1.0
    },
    'Budget Shopping': {
      priceThresholdMax: 50000,
      keywords: ['budget', 'cheap', 'affordable', 'under', 'discount', 'saving', 'value'],
      weight: 1.0
    },
    'Premium Buyer': {
      priceThresholdMin: 100000,
      keywords: ['flagship', 'ultra', 'pro max', 'titanium', 'premium', 'high-end', 'luxury', 'expensive'],
      weight: 1.0
    }
  };

  /**
   * Detects real-time intent for a given userId or session signals.
   * @param {string|null} userId
   * @param {Object} sessionParams - optional transient query/view params
   */
  static async detectUserIntent(userId, sessionParams = {}) {
    const scores = {
      'Gaming Setup': 0,
      'Office Setup': 0,
      'Photography': 0,
      'Fitness': 0,
      'Smart Home': 0,
      'Audio Enthusiast': 0,
      'Budget Shopping': 0,
      'Premium Buyer': 0
    };

    let totalSignalsCount = 0;
    const detectedKeywords = new Set();
    let viewedCategorySlugs = new Set();
    let avgViewedPrice = 0;

    // 1. Transient Session Query if provided
    if (sessionParams.query) {
      const q = sessionParams.query.toLowerCase();
      totalSignalsCount += 3;
      this.evaluateTextAgainstProfiles(q, scores, detectedKeywords, 4.0);
    }

    // 2. Fetch User Historical Signals if logged in
    if (userId) {
      // Recent Searches (last 10)
      const searches = await prisma.searchHistory.findMany({
        where: { userId },
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      searches.forEach(s => {
        totalSignalsCount += 2;
        if (s.query) {
          this.evaluateTextAgainstProfiles(s.query.toLowerCase(), scores, detectedKeywords, 3.0);
        }
        if (s.parsedCategory) {
          const cat = s.parsedCategory.toLowerCase();
          if (cat.includes('laptop')) scores['Office Setup'] += 3;
          if (cat.includes('audio')) scores['Audio Enthusiast'] += 3;
          if (cat.includes('gaming')) scores['Gaming Setup'] += 3;
          if (cat.includes('wearable')) scores['Fitness'] += 3;
          if (cat.includes('smart')) scores['Smart Home'] += 3;
        }
        if (s.parsedMaxPrice && s.parsedMaxPrice <= 50000) {
          scores['Budget Shopping'] += 4;
        }
      });

      // Product View History (last 20 views)
      const views = await prisma.viewHistory.findMany({
        where: { userId },
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { product: { include: { category: true } } }
      });

      let totalPriceSum = 0;
      views.forEach(v => {
        if (v.product) {
          totalSignalsCount += 1;
          const p = v.product;
          totalPriceSum += p.price;
          const durationWeight = Math.min(v.viewDurationSec || 15, 60) / 15.0; // 1x to 4x multiplier for longer read duration

          if (p.category) {
            viewedCategorySlugs.add(p.category.slug);
            this.evaluateCategoryAgainstProfiles(p.category.slug, scores, durationWeight * 2.5);
          }

          const combinedText = `${p.title} ${p.description} ${p.brand} ${p.tags}`.toLowerCase();
          this.evaluateTextAgainstProfiles(combinedText, scores, detectedKeywords, durationWeight * 1.5);
        }
      });

      if (views.length > 0) {
        avgViewedPrice = totalPriceSum / views.length;
        if (avgViewedPrice <= 45000) scores['Budget Shopping'] += 6;
        if (avgViewedPrice >= 95000) scores['Premium Buyer'] += 6;
      }

      // Wishlist Items
      const wishlists = await prisma.wishlist.findMany({
        where: { userId },
        include: { product: { include: { category: true } } }
      });

      wishlists.forEach(w => {
        if (w.product) {
          totalSignalsCount += 3;
          const p = w.product;
          if (p.category) this.evaluateCategoryAgainstProfiles(p.category.slug, scores, 5.0);
          const combinedText = `${p.title} ${p.description} ${p.tags}`.toLowerCase();
          this.evaluateTextAgainstProfiles(combinedText, scores, detectedKeywords, 3.0);
        }
      });

      // Cart Items
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: { include: { category: true } } } } }
      });

      if (cart && cart.items) {
        cart.items.forEach(item => {
          if (item.product) {
            totalSignalsCount += 4;
            const p = item.product;
            if (p.category) this.evaluateCategoryAgainstProfiles(p.category.slug, scores, 6.0);
            const combinedText = `${p.title} ${p.description} ${p.tags}`.toLowerCase();
            this.evaluateTextAgainstProfiles(combinedText, scores, detectedKeywords, 4.0);
          }
        });
      }
    }

    // Rank profiles by score descending
    const rankedProfiles = Object.entries(scores)
      .map(([label, score]) => ({ label, score: Math.round(score * 10) / 10 }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    // Default Fallback if anonymous user without activity
    if (rankedProfiles.length === 0) {
      rankedProfiles.push({ label: 'Budget Shopping', score: 10 });
      rankedProfiles.push({ label: 'Gaming Setup', score: 8 });
    }

    const topProfile = rankedProfiles[0];
    const secondaryProfile = rankedProfiles[1] || null;

    // Calculate confidence percentage (max 98%)
    const confidence = Math.min(Math.max(Math.round(65 + (topProfile.score * 1.8)), 70), 98);

    return {
      primaryIntent: topProfile.label,
      secondaryIntent: secondaryProfile ? secondaryProfile.label : null,
      confidence,
      allProfiles: rankedProfiles,
      totalSignalsCount,
      detectedKeywords: Array.from(detectedKeywords).slice(0, 6),
      viewedCategories: Array.from(viewedCategorySlugs)
    };
  }

  static evaluateCategoryAgainstProfiles(catSlug, scores, weight) {
    if (catSlug === 'gaming') scores['Gaming Setup'] += weight * 2;
    else if (catSlug === 'laptops') {
      scores['Office Setup'] += weight * 1.5;
      scores['Gaming Setup'] += weight * 1.2;
    } else if (catSlug === 'audio') scores['Audio Enthusiast'] += weight * 2;
    else if (catSlug === 'smartphones') {
      scores['Photography'] += weight * 1.5;
      scores['Premium Buyer'] += weight * 1.0;
    } else if (catSlug === 'wearables') scores['Fitness'] += weight * 2;
    else if (catSlug === 'smart-home') scores['Smart Home'] += weight * 2;
  }

  static evaluateTextAgainstProfiles(text, scores, keywordSet, weight) {
    Object.entries(this.INTENT_PROFILES).forEach(([label, profile]) => {
      if (profile.keywords) {
        profile.keywords.forEach(kw => {
          if (text.includes(kw)) {
            scores[label] += weight;
            keywordSet.add(kw);
          }
        });
      }
    });
  }
}

module.exports = IntentDetector;
