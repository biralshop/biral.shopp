import { useState, useEffect } from 'react';
import { articlesAPI, productsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, Link as LinkIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', image: '', status: 'active', relatedProducts: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [artRes, prodRes] = await Promise.all([
        articlesAPI.getAll(),
        productsAPI.getAll({ limit: '100' })
      ]);
      setArticles(artRes.articles || []);
      setProducts(prodRes.products || []);
    } catch (err) {
      toast.error('Məlumatlar yüklənmədi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await articlesAPI.update(currentId, form);
        toast.success('Məqalə yeniləndi');
      } else {
        await articlesAPI.create(form);
        toast.success('Məqalə yaradıldı');
      }
      setIsEditing(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Xəta baş verdi');
    }
  };

  const editArticle = (art: any) => {
    setForm({
      title: art.title, slug: art.slug, excerpt: art.excerpt,
      content: art.content, image: art.image, status: art.status,
      relatedProducts: art.relatedProducts || []
    });
    setCurrentId(art._id);
    setIsEditing(true);
  };

  const confirmDelete = async (id: string) => {
    if (confirm('Bu məqaləni silmək istədiyinizə əminsiniz?')) {
      try {
        await articlesAPI.delete(id);
        toast.success('Silindi');
        fetchData();
      } catch (err) {
        toast.error('Silinmədi');
      }
    }
  };

  const handleProductToggle = (prodId: string) => {
    setForm(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.includes(prodId)
        ? prev.relatedProducts.filter(p => p !== prodId)
        : [...prev.relatedProducts, prodId]
    }));
  };

  if (loading) return <div>Yüklənir...</div>;

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{currentId ? 'Məqaləni Yenilə' : 'Yeni Məqalə'}</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Geri Qayıt</Button>
        </div>
        <form onSubmit={handleSave} className="space-y-4 bg-card p-6 rounded-lg border">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Başlıq</label>
              <Input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link (Slug)</label>
              <Input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Qısa Təsvir (Excerpt)</label>
            <Input required value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Şəkil URL</label>
            <Input required value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Məzmun (Mətn və ya HTML)</label>
            <Textarea className="h-64" required value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select className="w-full border p-2 rounded" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="active">Aktiv</option>
              <option value="hidden">Gizli</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Əlaqəli Məhsullar (Satış üçün məqaləyə birləşdirin)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border p-4 rounded max-h-48 overflow-y-auto">
              {products.map(p => (
                <label key={p._id} className="flex items-center gap-2 text-sm p-2 bg-muted rounded cursor-pointer hover:bg-secondary">
                  <input type="checkbox" checked={form.relatedProducts.includes(p._id)} onChange={() => handleProductToggle(p._id)} />
                  <span className="truncate">{p.title}</span>
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">{currentId ? 'Yadda Saxla' : 'Yarat'}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Məqalələr (Bloq)</h1>
        <Button onClick={() => { setCurrentId(''); setForm({ title: '', slug: '', excerpt: '', content: '', image: '', status: 'active', relatedProducts: [] }); setIsEditing(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Yeni Məqalə
        </Button>
      </div>

      <div className="grid gap-4">
        {articles.map(art => (
          <div key={art._id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={art.image} alt="" className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{art.title}</h3>
                <p className="text-sm text-muted-foreground">Baxış: {art.views} • Status: {art.status}</p>
                <p className="text-xs text-primary mt-1">{art.relatedProducts?.length || 0} məhsul bağlanıb</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => window.open(`/blog/${art.slug}`, '_blank')}><Eye className="w-4 h-4 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" onClick={() => editArticle(art)}><Edit2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => confirmDelete(art._id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
        {articles.length === 0 && <p className="text-center text-muted-foreground py-8">Heç bir məqalə yoxdur.</p>}
      </div>
    </div>
  );
}
