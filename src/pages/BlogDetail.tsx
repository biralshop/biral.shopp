import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { articlesAPI, productsAPI } from '@/lib/api';
import { Eye, Calendar, ArrowLeft, Tag } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articlesAPI.getBySlug(slug!);
        if (res.article) {
          setArticle(res.article);
          
          if (res.article.relatedProducts?.length > 0) {
            const allProdsRes = await productsAPI.getAll({ limit: '100' });
            const allP = allProdsRes.products || [];
            const rProducts = allP.filter((p: any) => res.article.relatedProducts.includes(p._id));
            setRelatedProducts(rProducts);
          }
        }
      } catch (err) {
        console.error('Failed to fetch article detail', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-muted rounded w-full mb-8"></div>
          <div className="h-4 bg-muted rounded w-full mb-2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </Layout>
    );
  }

  if (!article) return <Layout><div className="text-center py-20">Məqalə tapılmadı</div></Layout>;

  const seoSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": [ article.image ],
    "datePublished": new Date(article.createdAt).toISOString(),
    "dateModified": new Date(article.updatedAt).toISOString(),
    "author": [{
        "@type": "Person",
        "name": article.author || "BiralStore Redaksiya",
        "url": "https://biral.store"
      }]
  };

  return (
    <Layout>
      <Helmet>
        <title>{article.title} - BiralStore</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <script type="application/ld+json">{JSON.stringify(seoSchema)}</script>
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Bloqa qayıt
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString('az-AZ')}</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {article.views} baxış</span>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{article.author}</span>
          </div>
        </header>

        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Body */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n(.*)/g, "<p>$1</p>") }} 
        />

        {/* Embedded Related Products Module */}
        {relatedProducts.length > 0 && (
          <div className="bg-primary/5 rounded-2xl p-6 md:p-8 mt-12 border border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Bu Yazıda Bəhs Edilən Məhsullar</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {relatedProducts.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
