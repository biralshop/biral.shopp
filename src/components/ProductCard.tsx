import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product, getProductId } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const badgeLabels: Record<string, string> = {
  new: 'Yeni',
  viral: 'Viral 🔥',
  trend: 'Trend',
  campaign: 'Kampaniya',
};

const ProductCard = ({ product, compact }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const pid = getProductId(product);
  const wishlisted = isInWishlist(pid);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.title} səbətə əlavə edildi`, {
      action: { label: 'Səbətə keç', onClick: () => window.location.href = '/sebet' },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(pid);
    toast(wishlisted ? 'Seçilənlərdən silindi' : 'Seçilənlərə əlavə edildi', {
      icon: wishlisted ? '💔' : '❤️',
    });
  };

  return (
    <div className="group bg-card rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Image */}
      <Link to={`/mehsul/${pid}`} className="relative block overflow-hidden">
        <div className={`bg-muted ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <Badge className={`text-[10px] ${product.badge === 'campaign' || product.badge === 'viral' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
              {badgeLabels[product.badge]}
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-destructive text-destructive-foreground text-[10px]">
              -{product.discount}%
            </Badge>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-sm"
        >
          <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <Link to={`/mehsul/${pid}`}>
          <h3 className="text-sm font-semibold text-card-foreground mt-1 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        {!compact && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-card-foreground">{product.price}₼</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{product.oldPrice}₼</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Səbətə</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
