import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, X, Truck, ShieldCheck, RotateCcw, Tag, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, getProductId } from '@/data/products';
import { productsAPI } from '@/lib/api';
import { validatePromoCode } from '@/lib/promoCodes';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');

  const shipping = 0; // Hesablanır in checkout
  const finalTotal = totalPrice - promoDiscount;
  const [upsellProducts, setUpsellProducts] = useState<Product[]>([]);

  useEffect(() => {
    productsAPI.getAll({ limit: '4' })
      .then(({ products: all }) => {
        const cartIds = items.map(i => getProductId(i.product));
        setUpsellProducts(all.filter((p: Product) => !cartIds.includes(getProductId(p))).slice(0, 4));
      })
      .catch(() => {});
  }, [items]);

  const steps = [
    { label: 'Səbət', active: true },
    { label: 'Ödəniş', active: false },
    { label: 'Təsdiq', active: false },
  ];

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const result = validatePromoCode(promoCode, totalPrice);
    if (result.valid) {
      setPromoDiscount(result.discount);
      setPromoApplied(promoCode.toUpperCase().trim());
      toast.success(`Kupon tətbiq edildi! ${result.discount.toFixed(2)}₼ endirim`);
    } else {
      toast.error(result.error || 'Kupon keçərli deyil');
    }
  };

  const removePromo = () => {
    setPromoDiscount(0);
    setPromoApplied('');
    setPromoCode('');
  };

  if (items.length === 0) {
    return (
      <Layout showCategoryNav={false}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
          <p className="text-muted-foreground mt-2">Alış-verişə başlayın!</p>
          <Link to="/kateqoriyalar">
            <Button className="mt-4">Məhsullara bax</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step.active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const pid = getProductId(product);
              return (
              <div key={pid} className="bg-card rounded-lg border p-4 flex gap-4">
                <Link to={`/mehsul/${pid}`} className="shrink-0">
                  <img src={product.image} alt={product.title} className="w-20 h-20 rounded-md object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <Link to={`/mehsul/${pid}`}>
                      <h3 className="font-semibold text-sm hover:text-primary">{product.title}</h3>
                    </Link>
                    <button onClick={() => { removeItem(pid); toast('Məhsul səbətdən silindi'); }} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-md">
                      <button onClick={() => updateQuantity(pid, quantity - 1)} className="p-1.5 hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">{quantity}</span>
                      <button onClick={() => updateQuantity(pid, quantity + 1)} className="p-1.5 hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-bold">{(product.price * quantity).toFixed(2)}₼</span>
                  </div>
                </div>
              </div>
            )})}
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="font-bold text-lg">Sifariş xülasəsi</h3>

              {/* Promo code */}
              {promoApplied ? (
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{promoApplied}</span>
                  </div>
                  <button onClick={removePromo} className="text-xs text-destructive hover:underline">Sil</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Kupon kodu"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-9 h-9"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleApplyPromo} className="h-9">
                    Tətbiq et
                  </Button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Cəmi</span><span>{totalPrice.toFixed(2)}₼</span></div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-primary"><span>Endirim</span><span>-{promoDiscount.toFixed(2)}₼</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Çatdırılma</span><span className="text-muted-foreground text-xs font-medium pt-1">Ödəniş səhifəsində hesablanacaq</span></div>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Yekun</span>
                <span>{finalTotal.toFixed(2)}₼</span>
              </div>
              <Link to="/odenis">
                <Button className="w-full font-semibold" size="lg">Ödənişə keç</Button>
              </Link>
              <Link to="/kateqoriyalar" className="block text-center text-sm text-primary hover:underline">
                Alış-verişə davam et
              </Link>
            </div>

            {/* Trust */}
            <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
              {[
                { icon: ShieldCheck, label: 'SSL' },
                { icon: Truck, label: 'Sürətli' },
                { icon: RotateCcw, label: 'Qaytarma' },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-1">
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Upsell */}
        {upsellProducts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold mb-4">Bunlar da xoşunuza gələ bilər</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upsellProducts.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
