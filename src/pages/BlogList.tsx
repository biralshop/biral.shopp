import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { articlesAPI } from '@/lib/api';
import { Eye, Calendar, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articlesAPI.getAll({ status: 'active' });
        setArticles(res.articles || []);
      } catch (err) {
        console.error('Failed to fetch articles', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Faydalı Məqalələr - BiralStore</title>
        <meta name="description" content="Eviniz, avtomobiliniz və gündəlik həyatınız üçün ən faydalı məsləhətlər və praktik həllər." />
        <meta property="og:title" content="Faydalı Məqalələr - BiralStore" />
        <meta property="og:description" content="Eviniz, avtomobiliniz və gündəlik həyatınız üçün ən faydalı məsləhətlər və praktik həllər." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-extrabold mb-4">Faydalı Məsləhətlər</h1>
          <p className="text-muted-foreground text-lg">Gündəlik həyatınızı asanlaşdıracaq praktik bloq yazıları</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card rounded-xl aspect-[4/3]" />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <Link key={art._id} to={`/blog/${art.slug}`} className="group relative bg-card rounded-2xl overflow-hidden border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-video w-full overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(art.createdAt).toLocaleDateString('az-AZ')}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.views} oxunma</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{art.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 mb-4">{art.excerpt}</p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    Ətraflı oxu <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            Hələ ki heç bir məqalə yoxdur.
          </div>
        )}
      </div>
    </Layout>
  );
}
