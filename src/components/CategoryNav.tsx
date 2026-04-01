import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '@/data/products';

const CategoryNav = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || '';

  return (
    <div className="bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 md:gap-4 py-3 overflow-x-auto no-scrollbar md:justify-center">
          <Link
            to="/kateqoriyalar"
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            Hamısı
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/kateqoriyalar?cat=${cat.slug}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {cat.icon} {cat.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
