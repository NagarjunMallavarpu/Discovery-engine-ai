const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

let genAI = null;

if (config.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  } catch (err) {
    console.warn('Gemini API initialization warning:', err.message);
  }
}

/**
 * Parses natural language search query using Gemini API or intelligent heuristic parser fallback.
 * Example input: "I need a gaming laptop under ₹60000 with RGB keyboard"
 * Returns: { category, minPrice, maxPrice, brand, purpose, keywords, intentSummary }
 */
async function parseSearchIntent(query) {
  if (!query || typeof query !== 'string') {
    return getFallbackIntent(query);
  }

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an expert e-commerce intent parser. Analyze this user search query: "${query}"

Extract the shopping intent into a JSON object with these keys:
- category: (string or null, e.g., "Laptops", "Audio", "Smartphones", "Wearables", "Gaming", "Apparel", "Smart Home")
- minPrice: (number or null, in INR ₹)
- maxPrice: (number or null, in INR ₹)
- brand: (string or null, e.g., "Asus", "Sony", "Apple", "Logitech", "Samsung", "Nike")
- purpose: (string or null, e.g., "gaming", "work", "fitness", "casual", "study")
- keywords: (array of strings, key product feature terms)
- intentSummary: (short 1-sentence explanation of what the user is looking for)

Return ONLY valid JSON. No markdown codeblock wrapper or extra text.
`;

      const response = await model.generateContent(prompt);
      const result = await response.response;
      const text = result.text() ? result.text().trim() : '';
      const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      return {
        category: parsed.category || null,
        minPrice: typeof parsed.minPrice === 'number' ? parsed.minPrice : null,
        maxPrice: typeof parsed.maxPrice === 'number' ? parsed.maxPrice : null,
        brand: parsed.brand || null,
        purpose: parsed.purpose || null,
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
        intentSummary: parsed.intentSummary || `Looking for ${query}`
      };
    } catch (err) {
      console.warn('Gemini API call failed for intent parsing, using smart heuristic fallback:', err.message);
    }
  }

  return getFallbackIntent(query);
}

/**
 * Intelligent regex & rule-based heuristic fallback for search intent parsing.
 */
function getFallbackIntent(query = '') {
  const qLower = query.toLowerCase();

  let maxPrice = null;
  let minPrice = null;

  const priceUnderMatch = qLower.match(/(?:under|below|less than|max|\<|₹|\b)\s*(\d+000|\d+)/i);
  if (priceUnderMatch && priceUnderMatch[1]) {
    const val = parseInt(priceUnderMatch[1], 10);
    if (val > 100) maxPrice = val;
  }

  const priceAboveMatch = qLower.match(/(?:above|over|more than|min|\>)\s*(\d+000|\d+)/i);
  if (priceAboveMatch && priceAboveMatch[1]) {
    const val = parseInt(priceAboveMatch[1], 10);
    if (val > 100) minPrice = val;
  }

  let category = null;
  if (/laptop|macbook|notebook|pc|computer/i.test(qLower)) category = 'Laptops';
  else if (/headphone|earbud|speaker|audio|soundbar|mic/i.test(qLower)) category = 'Audio';
  else if (/phone|smartphone|mobile|iphone|android/i.test(qLower)) category = 'Smartphones';
  else if (/watch|smartwatch|band|tracker|wearable/i.test(qLower)) category = 'Wearables';
  else if (/gaming|console|mouse|keyboard|monitor|gpu/i.test(qLower)) category = 'Gaming';
  else if (/shirt|shoe|sneaker|jacket|cloth|apparel|wear/i.test(qLower)) category = 'Apparel';
  else if (/light|plug|camera|home|smart/i.test(qLower)) category = 'Smart Home';

  let brand = null;
  const brands = ['Asus', 'Sony', 'Apple', 'Logitech', 'Samsung', 'Nike', 'Dell', 'Lenovo', 'Bose', 'Razer', 'Xiaomi', 'Adidas'];
  for (const b of brands) {
    if (qLower.includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }

  let purpose = null;
  if (/gaming|play|fps/i.test(qLower)) purpose = 'gaming';
  else if (/work|office|coding|dev/i.test(qLower)) purpose = 'work';
  else if (/fitness|sport|gym|run/i.test(qLower)) purpose = 'fitness';
  else if (/travel|music|noise/i.test(qLower)) purpose = 'audiophile';

  const keywords = qLower
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['under', 'with', 'need', 'want', 'looking', 'best', 'good', 'some', 'cheap', 'price'].includes(w));

  return {
    category,
    minPrice,
    maxPrice,
    brand,
    purpose,
    keywords,
    intentSummary: `Parsed search intent for "${query}"${category ? ` in ${category}` : ''}${maxPrice ? ` under ₹${maxPrice}` : ''}`
  };
}

/**
 * Generates an explainable AI justification for why a product was recommended to a user.
 */
async function generateRecommendationExplanation(userSignals, product) {
  if (!product) return 'Recommended based on catalog relevance.';

  const recentSearches = userSignals?.searches || [];
  const recentViews = userSignals?.views || [];
  const wishlist = userSignals?.wishlist || [];
  const cart = userSignals?.cart || [];

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
Generate a concise, compelling 1-sentence customer explanation (max 20 words) for why this product is recommended.

Product: ${product.title} (Category: ${product.category?.name || 'General'}, Brand: ${product.brand}, Rating: ${product.rating})
User Activity Context:
- Recent Searches: ${recentSearches.join(', ') || 'None'}
- Viewed Categories: ${recentViews.join(', ') || 'None'}
- Wishlist Items: ${wishlist.join(', ') || 'None'}
- Cart Categories: ${cart.join(', ') || 'None'}

Example response: "Recommended because you recently viewed gaming accessories and searched for high-performance laptops."

Output ONLY the final 1-sentence text without quotes.
`;

      const response = await model.generateContent(prompt);
      const result = await response.response;
      if (result.text() && result.text().trim()) {
        return result.text().trim();
      }
    } catch (err) {
      console.warn('Gemini explanation generation warning:', err.message);
    }
  }

  // Smart Heuristic Fallback for Explainable AI
  if (recentSearches.length > 0) {
    return `Recommended because your recent searches matched "${recentSearches[0]}" and ${product.category?.name || product.brand} products.`;
  } else if (recentViews.length > 0) {
    return `Recommended because you recently explored ${recentViews[0]} items and similar high-rated products.`;
  } else if (wishlist.length > 0 || cart.length > 0) {
    return `Recommended based on items in your cart and wishlist affinity in ${product.category?.name || 'this category'}.`;
  }

  return `Top-rated choice in ${product.category?.name || 'its category'} with ${product.rating}★ user rating.`;
}

/**
 * Phase 4: Generates a comprehensive AI Insights Summary for a customer profile.
 */
async function generateUserAIInsights(intentData, userActivity = {}) {
  const primaryIntent = intentData?.primaryIntent || 'Gaming Setup';
  const confidence = intentData?.confidence || 88;
  const keywords = intentData?.detectedKeywords || ['gaming', 'rtx', 'laptop'];

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are an AI Shopping Assistant. Generate a 2-sentence user preference and recommendation summary for this user profile:
- Primary Intent: ${primaryIntent} (${confidence}% confidence)
- Top Keywords: ${keywords.join(', ')}
- Viewed Categories: ${intentData?.viewedCategories?.join(', ') || 'Laptops, Gaming'}

Output a JSON object with:
- summary: (2-sentence natural summary of what the user prefers and why recommendations shifted)
- preferenceBreakdown: (array of 3 short bullet string points)

Return ONLY valid JSON.
`;

      const response = await model.generateContent(prompt);
      const text = (await response.response).text().trim();
      const clean = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(clean);
      return {
        summary: parsed.summary || `Your profile indicates strong affinity for ${primaryIntent}. Product recommendations have shifted toward high-performance items in this category.`,
        preferenceBreakdown: parsed.preferenceBreakdown || [
          `Strong interest in ${primaryIntent} products`,
          `Frequent searches matching: ${keywords.slice(0, 3).join(', ')}`,
          `Prefers top-rated products with verified user reviews`
        ]
      };
    } catch (err) {
      console.warn('Gemini AI Insights warning:', err.message);
    }
  }

  // Heuristic Fallback
  return {
    summary: `Your profile indicates strong real-time intent for ${primaryIntent} (${confidence}% match). Your recommendation feed has automatically shifted toward high-affinity products matching "${keywords[0] || 'tech'}" and complementary accessories.`,
    preferenceBreakdown: [
      `Primary intent profile: ${primaryIntent}`,
      `Active keyword signals: ${keywords.slice(0, 3).join(', ') || 'laptop, gaming, audio'}`,
      `Price & category preferences aligned with ${intentData?.viewedCategories?.[0] || 'tech catalog'}`
    ]
  };
}

module.exports = {
  parseSearchIntent,
  generateRecommendationExplanation,
  generateUserAIInsights
};

