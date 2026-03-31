import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

const MobileBottomNav = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const items = [
    { to: '/', icon: Home, label: 'Ana' },
    { to: '/kateqoriyalar', icon: Grid3X3, label: 'Kateqoriya' },
    { to: '/sebet', icon: ShoppingCart, label: 'Səbət', badge: totalItems },
    { to: '/hesab', icon: Heart, label: 'Seçilənlər', badge: wishlistCount },
    { to: isAuthenticated ? '/hesab' : '/giris', icon: User, label: 'Hesab' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 safe-area-bottom w-full max-w-[100vw] overflow-hidden">
      <div className="flex items-center justify-around py-2 w-full">
        {items.map((item) => {
          const isActive = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.badge ? (
                <span className="absolute -top-1 right-0 bg-accent text-accent-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
