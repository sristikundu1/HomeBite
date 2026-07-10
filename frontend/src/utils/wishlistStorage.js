export const WISHLIST_STORAGE_KEY = 'wishlist';

function sanitizeWishlist(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.filter((id) => typeof id === 'string').map((id) => id.trim()).filter(Boolean))];
}

export function parseWishlist(value) {
  if (!value) return [];

  try {
    return sanitizeWishlist(JSON.parse(value));
  } catch {
    return [];
  }
}

export function getStoredWishlist() {
  if (typeof window === 'undefined') return [];

  try {
    return parseWishlist(window.localStorage.getItem(WISHLIST_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveStoredWishlist(foodIds) {
  const wishlist = sanitizeWishlist(foodIds);

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Keep the in-memory wishlist usable when storage is unavailable.
    }
  }

  return wishlist;
}

export function clearStoredWishlist() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, '[]');
  } catch {
    // Keep clearing in-memory state possible when storage is unavailable.
  }
}
