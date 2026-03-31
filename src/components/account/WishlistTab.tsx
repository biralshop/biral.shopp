import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { getProductId } from '@/data/products';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const WishlistTab = () => {
  const { items, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product.title} səbətə əlavə edildi`);
  };

  const handleRemove = (product: any) => {
    toggleWishlist(getProductId(product));
    toast('Seçilənlərdən silindi', { icon: '💔' });
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Seçilənlər</h1>
        <p className="text-muted-foreground mt-1">Bəyəndiyin məhsulları itirmə, istədiyin vaxt səbətə əlavə et.</p>
        <div className="text-center py-16">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mt-4">Seçilənlər siyahısı boşdur</h3>
          <p className="text-muted-foreground text-sm mt-1">Məhsullardakı ❤ ikonuna klikləyərək seçilənlərə əlavə edin</p>
          <Link to="/kateqoriyalar">
            <Button className="mt-4">Məhsullara bax</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Seçilənlər</h1>
      <p className="text-muted-foreground mt-1">{items.length} məhsul seçilənlərdə</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map((product) => {
          const pid = getProductId(product);
          return (
            <div key={pid} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden group">
              <Link to={`/mehsul/${pid}`}>
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px]">-{product.discount}%</Badge>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <p className="text-[11px] text-muted-foreground uppercase">{product.category}</p>
                <Link to={`/mehsul/${pid}`}>
                  <h3 className="text-sm font-semibold mt-1 hover:text-primary">{product.title}</h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-bold">{product.price}₼</span>
                  {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{product.oldPrice}₼</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1" onClick={() => handleAddToCart(product)}>
                    <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Səbətə at
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRemove(product)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistTab;
