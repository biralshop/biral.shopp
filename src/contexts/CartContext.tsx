import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, getProductId } from '@/data/products';
import { useAuth } from './AuthContext';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = 'biralstore_cart';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    
    // Hidden sync mechanism for Abandoned Carts
    if (items.length > 0) {
      const syncCart = async () => {
        try {
          // Send to backend quietly
          const outItems = items.map(i => ({ 
             productId: getProductId(i.product), 
             quantity: i.quantity, 
             price: i.product.price, 
             productTitle: i.product.title 
          }));
          const token = localStorage.getItem('biralstore_token');
          const phone = localStorage.getItem('guest_checkout_phone');
          const name = localStorage.getItem('guest_checkout_name');

          if (token || phone) {
            await fetch(`${API_URL}/cart/sync`, {
              method: 'POST',
              headers: { 
                 'Content-Type': 'application/json',
                 ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify({ items: outItems, guestPhone: phone, guestName: name })
            }).catch(() => {});
          }
        } catch (e) {}
      };
      
      const timer = setTimeout(syncCart, 2000); // Debounce to prevent flooding
      return () => clearTimeout(timer);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    const pid = getProductId(product);
    setItems((prev) => {
      const existing = prev.find((i) => getProductId(i.product) === pid);
      if (existing) {
        return prev.map((i) =>
          getProductId(i.product) === pid ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => getProductId(i.product) !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems((prev) =>
      prev.map((i) => getProductId(i.product) === productId ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
