import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GripVertical, MoreVertical, ExternalLink, Trash2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const filters = [
  { name: 'Qiymət aralığı', type: 'slider', enabled: true },
  { name: 'Material', type: 'multi-select', enabled: true },
  { name: 'Rəng', type: 'swatch', enabled: true },
  { name: 'Stock status', type: 'checkbox', enabled: false },
  { name: 'Brend', type: 'dropdown', enabled: true },
  { name: 'Çatdırılma tipi', type: 'checkbox', enabled: true },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New category form
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    adminAPI.getAllCategories()
      .then(res => setCategories(res.categories || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleNameChange = (val: string) => {
    setNewName(val);
    setNewSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleAddCategory = async () => {
    if (!newName || !newSlug) return;
    try {
      setSaving(true);
      await adminAPI.createCategory({ name: newName, slug: newSlug });
      setNewName('');
      setNewSlug('');
      fetchCategories();
    } catch (err) {
      alert('Xəta baş verdi. Slug unikal olmalıdır.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kateqoriyanı silmək istəyirsiniz?')) return;
    try {
      await adminAPI.deleteCategory(id);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      alert('Silinmə zamanı xəta oldu.');
    }
  };

  return (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Kateqoriya və Məlumatlar</h1>
      <p className="text-sm text-muted-foreground">Saytın kateqoriyalar strukturunu və filialları burdan idarə edin</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category tree */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Cari Kateqoriya Ağacı</h2>
        <p className="text-xs text-muted-foreground mb-4">Sistemdə olan aktiv kateqoriyalar</p>
        
        <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
          {loading ? (
            <p className="text-sm text-center py-4 text-muted-foreground">Yüklənir...</p>
          ) : categories.map((cat) => (
            <div key={cat._id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-muted/30">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              <div className="flex-1">
                 <span className="text-sm font-semibold block">{cat.name}</span>
                 <span className="text-xs text-muted-foreground">/{cat.slug} • {cat.productCount} məhsul</span>
              </div>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cat._id)}>
                 <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 mt-2">
          <h3 className="font-semibold text-sm mb-3">Yeni Kateqoriya Yarat</h3>
          <div className="space-y-3">
             <div>
                <label className="text-xs font-medium mb-1 block">Kateqoriya Adı (Məs: Elektronika)</label>
                <Input value={newName} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ad daxil edin" className="h-9" />
             </div>
             <div>
                <label className="text-xs font-medium mb-1 block">URL Slug (Avtomatik yaranır)</label>
                <Input value={newSlug} onChange={(e) => setNewSlug(e.target.value)} placeholder="url-slug" className="h-9" />
             </div>
             <Button onClick={handleAddCategory} disabled={saving || !newName} size="sm" className="bg-primary w-full h-9">
               {saving ? 'Yaradılır...' : 'Əlavə et'}
             </Button>
          </div>
        </div>
      </div>

      {/* Filters + Menu */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm opacity-60">
          <h2 className="font-bold mb-1">Filtr & atribut qurucusu (Tezliklə)</h2>
          <p className="text-xs text-muted-foreground mb-4">Axtarış və listing səhifəsində görünən filtrelər</p>
          <div className="space-y-3">
            {filters.map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{f.type}</p>
                </div>
                <Switch checked={f.enabled} disabled />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">İlkin struktur preview</h2>
          <p className="text-xs text-muted-foreground mb-3">Kateqoriyalar naviqasiya menu-larında dərhal görünəcək.</p>
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center p-4">
            <div className="text-center">
              <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium">Bütün Məhsullar</p>
              <div className="flex gap-2 justify-center flex-wrap mt-3">
                 {categories.slice(0, 5).map(c => <Badge key={c._id} variant="secondary">{c.name}</Badge>)}
                 {categories.length > 5 && <Badge variant="outline">+{categories.length - 5} daha</Badge>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminCategories;
