import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, MoreVertical, ExternalLink } from 'lucide-react';

const categories = [
  { name: 'Mətbəx', color: 'bg-primary' },
  { name: 'Saxlama', color: 'bg-amber-500' },
  { name: 'Təmizlik', color: 'bg-green-500' },
  { name: 'Bağça', color: 'bg-green-600' },
  { name: 'Suvarma', color: 'bg-green-500' },
  { name: 'Həyət', color: 'bg-purple-500' },
  { name: 'Maşın', color: 'bg-amber-500' },
  { name: 'Organizerlər', color: 'bg-primary' },
  { name: 'Elektronika', color: 'bg-blue-400' },
  { name: 'Viral tapıntılar', color: 'bg-red-500' },
];

const filters = [
  { name: 'Qiymət aralığı', type: 'slider', enabled: true },
  { name: 'Material', type: 'multi-select', enabled: true },
  { name: 'Rəng', type: 'swatch', enabled: true },
  { name: 'Stock status', type: 'checkbox', enabled: false },
  { name: 'Brend', type: 'dropdown', enabled: true },
  { name: 'Çatdırılma tipi', type: 'checkbox', enabled: true },
];

const menuSections = [
  { title: 'Əsas menu', desc: 'Ana səhifə, Kateqoriyalar, Kampaniyalar, Sifarişlər' },
  { title: 'Mega-menu', desc: 'Mətbəx, Bağça, Həyət, Maşın, Viral' },
  { title: 'Footer sütunları', desc: 'Əlaqə, qaytarma siyasəti, çatdırılma, FAQ' },
  { title: 'Hesab bölməsi', desc: 'Profil, sifarişlər, seçilənlər, ünvanlar, dəstək' },
  { title: 'Kampaniya banner linkləri', desc: 'Kupon landing, viral kolleksiya, hədiyyə seçimi' },
];

const AdminCategories = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Kateqoriya, filtr və menyu</h1>
      <p className="text-sm text-muted-foreground">Məhsul tapılmasını yaxşılaşdıran bütün struktur admin paneldən idarə olunur</p>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Category tree */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Kateqoriya ağacı</h2>
        <p className="text-xs text-muted-foreground mb-4">Drag & drop ilə sıralama və yuva strukturu</p>
        <div className="space-y-1">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-grab">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div className={`w-4 h-4 rounded ${cat.color}`} />
              <span className="text-sm font-medium flex-1">{cat.name}</span>
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <Button size="sm" className="bg-primary mt-4 text-xs w-full">Yeni kateqoriya</Button>
      </div>

      {/* Filters + Menu */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Filtr & atribut qurucusu</h2>
          <p className="text-xs text-muted-foreground mb-4">Axtarış və listing səhifəsində görünən filtrelər</p>
          <div className="space-y-3">
            {filters.map((f) => (
              <div key={f.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{f.name}</p>
                  <p className="text-[11px] text-muted-foreground">{f.type}</p>
                </div>
                <Switch defaultChecked={f.enabled} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Header, footer və mega-menu</h2>
          <p className="text-xs text-muted-foreground mb-4">Mağaza naviqasiyası və hesab keçidləri</p>
          <div className="space-y-3">
            {menuSections.map((m) => (
              <div key={m.title} className="p-3 border border-border rounded-lg">
                <p className="text-sm font-semibold">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Canlı struktur preview</h2>
          <p className="text-xs text-muted-foreground mb-3">Kateqoriya və menyu sayt üzərində belə görünəcək</p>
          <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Storefront preview</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Bağlı səhifələr</h2>
          {['Hesab / sifarişlər', 'Checkout', 'Dəstək'].map((p) => (
            <div key={p} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted rounded" />
                <span className="text-sm font-medium">{p}</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7">Bağla</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminCategories;
