import { getDB } from '../config/db.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1500;

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY_MESSAGES).flatMap((item) => {
    const role = item?.role === 'assistant' ? 'model' : item?.role === 'user' ? 'user' : null;
    const text = typeof item?.content === 'string' ? item.content.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
    return role && text ? [{ role, parts: [{ text }] }] : [];
  });
}

function foodSummary(food) {
  return {
    id: food._id.toString(),
    title: food.title,
    chef: food.chefName,
    category: food.category,
    cuisine: food.cuisine,
    price: food.discountPrice || food.price,
    regularPrice: food.price,
    ingredients: food.ingredients,
    calories: food.calories,
    spiceLevel: food.spiceLevel,
    preparationTime: food.preparationTime,
    available: food.isAvailable && food.availableQuantity > 0,
    rating: food.rating || 0,
    path: `/foods/${food._id}`
  };
}

function systemInstruction(foods, currentPath) {
  return `You are HomeBite's friendly AI Food Assistant. Help users discover meals, compare options by budget or cuisine, find healthier choices, understand HomeBite, and navigate the website.

STRICT LIMITS:
- You are read-only. Never claim to place an order, add/remove cart or wishlist items, make payments, submit forms, edit profiles, or modify any platform data.
- If asked to perform an action, explain that you cannot do it and give concise navigation steps instead.
- Recommend only meals present in ACTIVE FOOD LISTINGS below. Never invent availability, prices, ingredients, ratings, or chefs.
- Do not present nutritional guidance as medical advice. Mention that users with allergies or medical needs should confirm ingredients with the chef.
- Keep responses concise and useful. Use Markdown headings, bullets, bold text, and internal links when helpful.
- Internal routes: Explore meals [/foods](/foods), Cart [/dashboard/cart](/dashboard/cart), Wishlist [/dashboard/wishlist](/dashboard/wishlist), Messages [/dashboard/messages](/dashboard/messages), Become a Chef [/cook](/cook), Help Center [/help](/help), Login [/login](/login), Dashboard [/dashboard](/dashboard).
- Current page: ${currentPath || 'unknown'}.

ACTIVE FOOD LISTINGS:
${JSON.stringify(foods)}`;
}

export async function chatWithAssistant(req, res) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return sendError(res, 503, 'AI assistant is not configured');

  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
  if (!message) return sendError(res, 400, 'Message is required');
  if (message.length > MAX_MESSAGE_LENGTH) return sendError(res, 400, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);

  try {
    const foods = await getDB().collection('foods').find(
      { status: 'active' },
      { projection: { title: 1, chefName: 1, category: 1, cuisine: 1, price: 1, discountPrice: 1, ingredients: 1, calories: 1, spiceLevel: 1, preparationTime: 1, isAvailable: 1, availableQuantity: 1, rating: 1 } }
    ).sort({ rating: -1, orderCount: -1 }).limit(80).toArray();

    const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      signal: AbortSignal.timeout(30000),
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction(foods.map(foodSummary), req.body.currentPath) }] },
        contents: [...cleanHistory(req.body.history), { role: 'user', parts: [{ text: message }] }],
        generationConfig: { temperature: 0.45, maxOutputTokens: 700 }
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      console.error('Gemini request failed:', payload?.error?.message || response.statusText);
      return sendError(res, 502, 'The AI assistant is temporarily unavailable');
    }

    const answer = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
    if (!answer) return sendError(res, 502, 'The AI assistant returned an empty response');
    return sendSuccess(res, 200, 'AI response generated successfully', { answer });
  } catch (error) {
    console.error('AI assistant failed:', error.message);
    return sendError(res, 500, 'Failed to contact the AI assistant');
  }
}
