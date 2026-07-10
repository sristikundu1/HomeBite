import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  WISHLIST_STORAGE_KEY,
  clearStoredWishlist,
  getStoredWishlist,
  parseWishlist,
  saveStoredWishlist
} from '../utils/wishlistStorage';

export const WishlistContext = createContext(null);

function normalizeId(id) {
  return typeof id === 'string' ? id.trim() : '';
}

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(getStoredWishlist);

  useEffect(() => {
    function syncWishlist(event) {
      if (event.key === WISHLIST_STORAGE_KEY) {
        setWishlistIds(parseWishlist(event.newValue));
      }
    }

    window.addEventListener('storage', syncWishlist);
    return () => window.removeEventListener('storage', syncWishlist);
  }, []);

  const addToWishlist = useCallback((id) => {
    const foodId = normalizeId(id);
    if (!foodId) return;

    setWishlistIds((current) => {
      if (current.includes(foodId)) return current;
      return saveStoredWishlist([...current, foodId]);
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    const foodId = normalizeId(id);
    if (!foodId) return;

    setWishlistIds((current) => {
      if (!current.includes(foodId)) return current;
      return saveStoredWishlist(current.filter((item) => item !== foodId));
    });
  }, []);

  const toggleWishlist = useCallback((id) => {
    const foodId = normalizeId(id);
    if (!foodId) return;

    setWishlistIds((current) =>
      saveStoredWishlist(
        current.includes(foodId) ? current.filter((item) => item !== foodId) : [...current, foodId]
      )
    );
  }, []);

  const isWishlisted = useCallback((id) => {
    const foodId = normalizeId(id);
    return Boolean(foodId) && wishlistIds.includes(foodId);
  }, [wishlistIds]);

  const clearWishlist = useCallback(() => {
    clearStoredWishlist();
    setWishlistIds([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist
    }),
    [wishlistIds, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

