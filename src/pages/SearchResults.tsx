import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Product, searchProducts } from '@/data/products';
import { productsAPI } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const suggestions = ['mətbəx alətləri', 'baxça işıqları', 'maşın aksesuar', 'silikon', 'solar', 'organizer'];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(!!initialQuery);

  const doSearch = (q: string) => {
    setQuery(q);
    setSearchParams(q ? { q } : {});
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setSearched(true);
    productsAPI.search(q)
      .then(({ products }) => setResults(products))
      .catch(() => setResults(searchProducts(q)));
  };

  // Initial search on mount
  useState(() => { if (initialQuery) doSearch(initialQuery); });

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => doSearch(e.target.value)}
              placeholder="Məhsul axtar..."
              className="pl-12 h-12 text-base rounded-xl"
              autoFocus
            />
          </div>
        </div>

        {!searched && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Populyar axtarışlar</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => doSearch(s)}
                  className="px-4 py-1.5 bg-secondary rounded-full text-sm hover:bg-muted transition-colors"
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {searched && (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold">"{query}" üçün {results.length} nəticə</h2>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">Heç bir nəticə tapılmadı</p>
                <p className="text-sm mt-1">Başqa açar sözlə yenidən cəhd edin</p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
