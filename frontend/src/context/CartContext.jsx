import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../providers/AuthProvider';
import {
  addCartItem,
  clearUserCart,
  getUserCart,
  removeCartItem,
  updateCartItemQuantity
} from '../services/cartApi';

export const CartContext = createContext(null);

function documentId(value) {
  return value?.$oid || value || '';
}

function getCartItemId(item) {
  return documentId(item?._id);
}

function getFoodId(food) {
  return documentId(food?.foodId || food?._id);
}

function errorMessage(error, fallback) {
  return error.response?.data?.errors?.[0] || error.response?.data?.message || fallback;
}

export function CartProvider({ children }) {
  const { user, dbUser, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = dbUser?.email || user?.email || '';

  useEffect(() => {
    let active = true;

    async function fetchCart() {
      if (authLoading) return;

      if (!userEmail) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await getUserCart(userEmail);
        if (active) setCartItems(response.data.data || []);
      } catch (error) {
        if (active) {
          setCartItems([]);
          toast.error(errorMessage(error, 'Failed to load your cart.'));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCart();
    return () => { active = false; };
  }, [authLoading, userEmail]);

  const addToCart = useCallback(async (food, quantity = 1) => {
    if (!userEmail) {
      toast.error('Please log in to add items to your cart.');
      return null;
    }

    const payload = {
      userEmail,
      foodId: getFoodId(food),
      chefId: documentId(food?.chefId),
      foodName: food?.foodName || food?.title || '',
      foodImage: food?.foodImage || food?.thumbnail || '',
      price: food?.discountPrice ?? food?.price,
      quantity
    };

    try {
      const response = await addCartItem(payload);
      const updatedItem = response.data.data;

      setCartItems((current) => {
        const index = current.findIndex(
          (item) => getCartItemId(item) === getCartItemId(updatedItem) || getFoodId(item) === getFoodId(updatedItem)
        );

        if (index === -1) return [updatedItem, ...current];
        return current.map((item, itemIndex) => (itemIndex === index ? updatedItem : item));
      });

      toast.success(response.data.message || 'Item added to cart successfully.');
      return updatedItem;
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to add item to cart.'));
      return null;
    }
  }, [userEmail]);

  const removeItem = useCallback(async (id) => {
    const itemId = documentId(id);

    try {
      await removeCartItem(itemId);
      setCartItems((current) => current.filter((item) => getCartItemId(item) !== itemId));
      toast.success('Item removed from cart.');
      return true;
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to remove item from cart.'));
      return false;
    }
  }, []);

  const updateQuantity = useCallback(async (id, quantity) => {
    const itemId = documentId(id);

    try {
      const response = await updateCartItemQuantity(itemId, quantity);
      const updatedItem = response.data.data;
      setCartItems((current) => current.map((item) => (getCartItemId(item) === itemId ? updatedItem : item)));
      toast.success('Cart quantity updated.');
      return updatedItem;
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to update cart quantity.'));
      return null;
    }
  }, []);

  const clearCart = useCallback(async () => {
    if (!userEmail) {
      setCartItems([]);
      return false;
    }

    try {
      await clearUserCart(userEmail);
      setCartItems([]);
      toast.success('Cart cleared successfully.');
      return true;
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to clear cart.'));
      return false;
    }
  }, [userEmail]);

  const cartCount = useMemo(
    () => cartItems.reduce((count, item) => count + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.subtotal || 0), 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      totalPrice,
      loading,
      addToCart,
      removeItem,
      updateQuantity,
      clearCart
    }),
    [cartItems, cartCount, totalPrice, loading, addToCart, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

