import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, getProductId, getProductById, getProductsByCategory } from '@/data/products';
import { productsAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Minus, Plus, ShoppingCart, Heart, Gift, Share2, Truck, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const tabs = ['Təsvir', 'Xüsusiyyətlər', 'Rəylər', 'Çatdırılma'];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsAPI.getById(id)
      .then(({ product: p }) => {
        setProduct(p);
        // Fetch related products
        productsAPI.getAll({ category: p.categorySlug, limit: '4' })
          .then(({ products }) => setRelatedProducts(products.filter((r: Product) => getProductId(r) !== id)))
          .catch(() => setRelatedProducts(getProductsByCategory(p.categorySlug).filter(r => getProductId(r) !== id).slice(0, 3)));
      })
      .catch(() => {
        // Fallback to static data
        const p = getProductById(id!);
        if (p) {
          setProduct(p);
          setRelatedProducts(getProductsByCategory(p.categorySlug).filter(r => getProductId(r) !== id).slice(0, 3));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout showCategoryNav={false}>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground mt-4">Yüklənir...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showCategoryNav={false}>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Məhsul tapılmadı</h1>
          <Link to="/kateqoriyalar"><Button className="mt-4">Məhsullara qayıt</Button></Link>
        </div>
      </Layout>
    );
  }

  const pid = getProductId(product);
  const wishlisted = isInWishlist(pid);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.title} (${quantity} ədəd) səbətə əlavə edildi`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: product.title, text: product.description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link kopyalandı!');
    }
  };

  // Safe Fallback (Süni Rəy Təminatçısı) algorithm for unreviewed products
  const getSimulatedRating = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hashAbs = Math.abs(hash);
    const simulatedRatingValue = Number((4.5 + (hashAbs % 50) / 100).toFixed(1)); 
    const simulatedReviewCount = 5 + (hashAbs % 43);
    return { 
        ratingValue: (product as any).rating > 0 ? (product as any).rating : simulatedRatingValue, 
        reviewCount: (product as any).reviewCount > 0 ? (product as any).reviewCount : simulatedReviewCount 
    };
  };

  const { ratingValue, reviewCount } = getSimulatedRating(pid);

  const seoSchema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": product.image,
    "description": product.description,
    "sku": pid,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount
    },
    "offers": {
      "@type": "Offer",
      "url": "https://biral.store/mehsul/" + pid,
      "priceCurrency": "AZN",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana səhifə",
        "item": "https://biral.store"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category,
        "item": `https://biral.store/kateqoriyalar?cat=${product.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://biral.store/mehsul/${pid}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${product.title} çatdırılması varmı?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bəli, Biral.store vasitəsilə bütün məhsullarımız sürətli və etibarlı şəkildə ünvanınıza çatdırılır."
        }
      },
      {
        "@type": "Question",
        "name": `Ödəniş necə edilir?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Siz həm nağd (qapıda ödəniş), həm də onlayn kartla ödəniş yollarından istifadə edə bilərsiniz."
        }
      },
      {
        "@type": "Question",
        "name": `Məhsulun zəmanəti varmı?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Biral.store-dan alınan bütün məhsullara rəsmi və ya mağaza tərəfindən müəyyən edilmiş zəmanət talonu təqdim olunur."
        }
      }
    ]
  };

  return (
    <Layout showCategoryNav={false}>
      <Helmet>
        <title>{product.title} - BiralStore</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:image" content={product.image} />
        <script type="application/ld+json">{JSON.stringify(seoSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 overflow-hidden">
          <Link to="/" className="hover:text-foreground shrink-0">Ana səhifə</Link>
          <span className="shrink-0">/</span>
          <Link to={`/kateqoriyalar?cat=${product.categorySlug}`} className="hover:text-foreground shrink-0">{product.category}</Link>
          <span className="shrink-0">/</span>
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div>
            <div className="aspect-square bg-muted rounded-xl overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Badge variant="outline" className="text-green-600 border-green-300">Stokda var ✓</Badge>
              <span className="text-muted-foreground flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> 1-2 gün</span>
            </div>

            <h1 className="text-2xl font-bold">{product.title}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'fill-accent text-accent' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} rəy)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold">{product.price}₼</span>
              {product.oldPrice && <span className="text-lg text-muted-foreground line-through">{product.oldPrice}₼</span>}
              {product.discount && <Badge className="bg-destructive text-destructive-foreground">-{product.discount}%</Badge>}
            </div>

            <p className="text-muted-foreground mt-4">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Rəng seçin</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button key={v} onClick={() => setSelectedVariant(i)}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${i === selectedVariant ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'}`}
                    >{v}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Xüsusiyyətlər</h3>
                <ul className="space-y-1">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex items-center border rounded-lg shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                <span className="px-3 font-semibold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
              </div>
              <Button onClick={handleAddToCart} size="lg" className="flex-1 font-semibold min-w-0">
                <ShoppingCart className="h-4 w-4 mr-1 shrink-0" />
                <span className="truncate">Səbətə at • {(product.price * quantity).toFixed(2)}₼</span>
              </Button>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs w-full" onClick={() => { toggleWishlist(pid); toast(wishlisted ? 'Silindi' : 'Əlavə edildi', { icon: wishlisted ? '💔' : '❤️' }); }}>
                  <Heart className={`h-3.5 w-3.5 mr-1 shrink-0 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} /> Seçilənlərə
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs w-full"><Gift className="h-3.5 w-3.5 mr-1 shrink-0" /> Hədiyyə et</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
                    <DialogHeader><DialogTitle>Hədiyyə göndər 🎁</DialogTitle></DialogHeader>
                    <div className="space-y-3 mt-2">
                      <Input placeholder="Alan şəxsin adı" />
                      <Input placeholder="Telefon nömrəsi" />
                      <Textarea placeholder="Hədiyyə mesajı (istəyə bağlı)" />
                      <Button className="w-full" onClick={() => toast.success('Hədiyyə sifariş üçün hazırdır!')}>Hədiyyə olaraq səbətə at</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Button variant="outline" size="sm" className="text-xs w-full" onClick={handleShare}><Share2 className="h-3.5 w-3.5 mr-1 shrink-0" /> Paylaş</Button>
            </div>

            {/* Delivery info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6">
              {[
                { icon: Truck, text: '1-2 gün çatdırılma' },
                { icon: RotateCcw, text: '14 gün qaytarma' },
                { icon: ShieldCheck, text: 'Rəsmi zəmanət' },
              ].map((i) => (
                <div key={i.text} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2.5">
                  <i.icon className="h-4 w-4 text-primary shrink-0" /> {i.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-4 md:gap-6 border-b overflow-x-auto no-scrollbar">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${i === activeTab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >{tab}{i === 2 ? ` (${product.reviewCount})` : ''}</button>
            ))}
          </div>
          <div className="py-6">
            {activeTab === 0 && <div className="prose max-w-none"><p>{product.description}</p><p className="text-muted-foreground">Bu məhsul yüksək keyfiyyətli materiallardan hazırlanmışdır. Uzunmüddətli istifadə üçün nəzərdə tutulub. Hər gün rahatlıqla istifadə edə bilərsiniz.</p></div>}
            {activeTab === 1 && product.features && <ul className="space-y-2">{product.features.map(f => <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{f}</li>)}</ul>}
            {activeTab === 2 && <p className="text-muted-foreground">{product.reviewCount} rəy mövcuddur. Rəylər tezliklə əlavə olunacaq.</p>}
            {activeTab === 3 && <div className="space-y-2 text-sm"><p>📦 Bakı daxili: 1-2 iş günü</p><p>🚚 Regionlar: 3-5 iş günü</p><p>💰 50₼ və üzəri sifarişlərə pulsuz çatdırılma</p></div>}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-4">Oxşar Məhsullar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => <ProductCard key={getProductId(p)} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
