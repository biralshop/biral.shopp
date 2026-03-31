import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, categories } from '@/data/products';
import { productsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

const Homepage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    productsAPI.getAll({ limit: '8' })
      .then(({ products }) => setFeatured(products))
      .catch(() => {
        // fallback to static
        import('@/data/products').then(m => setFeatured(m.getFeaturedProducts()));
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Gündəlik həyatınız üçün ən yaxşı məhsullar
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-base md:text-lg leading-relaxed">
              Mətbəxdən baxçaya, həyətdən maşına — viral tapıntılar və sübut olunmuş keyfiyyət bir yerdə. BiralStore ilə həyatınızı asanlaşdırın.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/kateqoriyalar">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">
                  Məhsullara bax
                </Button>
              </Link>
              <Link to="/kampaniyalar">
                <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  Kampaniyalar
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-8 text-xs md:text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /> 4.8 reytinq</span>
              <span>12,000+ müştəri</span>
              <span>500+ məhsul</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.filter(c => c.slug !== 'viral').map((cat) => (
            <Link key={cat.slug} to={`/kateqoriyalar?cat=${cat.slug}`}
              className="bg-card rounded-xl border p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <h3 className="font-bold mt-2">{cat.title}</h3>
              <p className="text-xs text-muted-foreground">{cat.productCount} məhsul</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Seçilmiş Məhsullar</h2>
          <Link to="/kateqoriyalar" className="text-primary text-sm hover:underline">Hamısına bax →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: '1-2 gün çatdırılma', desc: 'Bakı daxili sürətli çatdırılma' },
              { icon: ShieldCheck, title: 'Təhlükəsiz ödəniş', desc: 'SSL şifrələnmiş tranzaksiyalar' },
              { icon: RotateCcw, title: 'Asan qaytarma', desc: '14 gün ərzində pulsuz qaytarma' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 p-3">
                <item.icon className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="container mx-auto px-4 py-10">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 md:p-8 text-center overflow-hidden">
          <h2 className="text-xl md:text-3xl font-bold">İlk sifarişinizə 10% endirim!</h2>
          <p className="mt-2 text-primary-foreground/80 text-sm md:text-base">PRAKTIK10 kodunu istifadə edin</p>
          <Link to="/kampaniyalar">
            <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Kampaniyaya bax</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
