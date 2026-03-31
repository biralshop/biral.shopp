import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, categories } from '@/data/products';
import { productsAPI } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Star, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Categories = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = searchParams.get('cat') || '';
  const [priceRange, setPriceRange] = useState([0, 60]);
  const [sortTab, setSortTab] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (activeCat) params.category = activeCat;
    if (priceRange[0] > 0) params.minPrice = String(priceRange[0]);
    if (priceRange[1] < 60) params.maxPrice = String(priceRange[1]);
    if (minRating > 0) params.minRating = String(minRating);
    if (sortTab === 'sale') params.badge = 'trend';

    productsAPI.getAll(params)
      .then(({ products }) => setAllProducts(products))
      .catch(() => {
        import('@/data/products').then(m => {
          let p = activeCat ? m.getProductsByCategory(activeCat) : m.products;
          setAllProducts(p);
        });
      });
  }, [activeCat, priceRange, minRating]);

  let filteredProducts = allProducts;
  if (sortTab === 'new') filteredProducts = filteredProducts.filter((p) => p.badge === 'new');
  if (sortTab === 'bestseller') filteredProducts = filteredProducts.filter((p) => p.reviewCount > 200);
  if (sortTab === 'sale') filteredProducts = filteredProducts.filter((p) => p.discount);

  const activeCategory = categories.find((c) => c.slug === activeCat);

  const tabs = [
    { key: 'all', label: 'Hamısı' },
    { key: 'new', label: 'Ən yeni' },
    { key: 'bestseller', label: 'Ən çox satılan' },
    { key: 'sale', label: 'Endirimda' },
  ];

  const handleCategoryClick = (slug: string) => {
    navigate(slug === activeCat ? '/kateqoriyalar' : `/kateqoriyalar?cat=${slug}`);
  };

  const clearFilters = () => {
    setPriceRange([0, 60]);
    setMinRating(0);
    setSortTab('all');
    navigate('/kateqoriyalar');
  };

  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 60 || minRating > 0 || activeCat;

  const FilterSidebar = () => (
    <div className="bg-card rounded-lg border p-5 space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3">Qiymət aralığı</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={60} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{priceRange[0]}₼</span><span>{priceRange[1]}₼</span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Kateqoriya</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button key={cat.slug} onClick={() => handleCategoryClick(cat.slug)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm transition-colors ${activeCat === cat.slug ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
            >
              <span className="flex items-center gap-2"><span>{cat.icon}</span><span>{cat.title}</span></span>
              <span className={`text-xs ${activeCat === cat.slug ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Reytinq</h3>
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${minRating === r ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
            >
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`h-3.5 w-3.5 ${i < r ? 'fill-accent text-accent' : 'text-muted'}`} />))}</div>
              <span className="text-xs text-muted-foreground ml-1">və yuxarı</span>
            </button>
          ))}
        </div>
      </div>
      {hasActiveFilters && (<Button variant="outline" size="sm" className="w-full" onClick={clearFilters}><X className="h-3.5 w-3.5 mr-1" /> Filtrləri təmizlə</Button>)}
    </div>
  );

  return (
    <Layout>
      <section className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">{activeCategory ? `${activeCategory.icon} ${activeCategory.title}` : 'Bütün Məhsullar'}</h1>
          {activeCategory && <p className="text-muted-foreground mt-1">{activeCategory.description}</p>}
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            <Link to="/kateqoriyalar" className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${!activeCat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>Hamısı</Link>
            {categories.map((cat) => (
              <Link key={cat.slug} to={`/kateqoriyalar?cat=${cat.slug}`} className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${activeCat === cat.slug ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>{cat.icon} {cat.title}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:hidden mb-4">
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" /> Filtrlər
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0 hidden lg:block"><div className="sticky top-32"><FilterSidebar /></div></aside>
          {showMobileFilters && <div className="lg:hidden"><FilterSidebar /></div>}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setSortTab(tab.key)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${sortTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                  >{tab.label}</button>
                ))}
              </div>
              <span className="text-sm text-muted-foreground hidden md:block">{filteredProducts.length} məhsul</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg font-semibold">Nəticə tapılmadı</p>
                <p className="text-muted-foreground text-sm mt-1">Bu filtrlərə uyğun məhsul yoxdur</p>
                <Button className="mt-4" onClick={clearFilters}>Filtrləri təmizlə</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
