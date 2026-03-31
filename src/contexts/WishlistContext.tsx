import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '@/lib/api';

interface Product {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  badge?: string;
}

interface WishlistContextType {
  items: Product[];
  totalItems: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      userAPI.getWishlist()
        .then(({ wishlist }) => setItems(wishlist || []))
        .catch(() => {});
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const isInWishlist = (productId: string) => items.some((p) => p._id === productId);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) return;
    try {
      const { wishlist } = await userAPI.toggleWishlist(productId);
      setItems(wishlist || []);
    } catch (err) {
      console.error('Wishlist xətası:', err);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, totalItems: items.length, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
