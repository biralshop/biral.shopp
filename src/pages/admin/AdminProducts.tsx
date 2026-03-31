import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Download, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusFilters = ['Hamısı', 'Aktiv', 'Qaralama', 'Tükənir', 'Gizli'];

const products = [
  { id: 1, name: 'Çoxfunksiyalı çəkməcə organizer', sku: 'PT-2401', cat: 'Mətbəx', price: 29.90, stock: 128, status: 'Aktiv' },
  { id: 2, name: 'Portativ avto tozsoran', sku: 'PT-2402', cat: 'Maşın', price: 44.90, stock: 18, status: 'Yenilənib' },
  { id: 3, name: 'Qapaqlı saxlama qabı dəsti', sku: 'PT-2403', cat: 'Saxlama', price: 34.90, stock: 6, status: 'Tükənir' },
  { id: 4, name: 'Bağça su püskürdücü set', sku: 'PT-2404', cat: 'Bağça', price: 24.90, stock: 67, status: 'Aktiv' },
  { id: 5, name: 'Silikon spatula organizer', sku: 'PT-2405', cat: 'Mətbəx', price: 19.90, stock: 0, status: 'Gizli' },
  { id: 6, name: 'Avto oturacaq organizer', sku: 'PT-2406', cat: 'Maşın', price: 44.90, stock: 51, status: 'Aktiv' },
  { id: 7, name: 'Diver mətbəx rafı', sku: 'PT-2407', cat: 'Mətbəx', price: 39.90, stock: 21, status: 'Aktiv' },
  { id: 8, name: 'Mini mop təmizləyici', sku: 'PT-2408', cat: 'Ev', price: 15.90, stock: 89, status: 'Aktiv' },
];

const statusColor: Record<string, string> = {
  'Aktiv': 'bg-green-100 text-green-700',
  'Yenilənib': 'bg-blue-100 text-blue-700',
  'Tükənir': 'bg-amber-100 text-amber-700',
  'Gizli': 'bg-gray-100 text-gray-500',
};

const stockColor = (s: number) => s === 0 ? 'text-red-600 bg-red-50' : s < 20 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

const bulkActions = ['Qiymətə +10% əlavə et', 'Kateqoriyanı dəyiş', 'Statusu aktiv/gizli et', 'Stok xəbərdarlığı qur', 'SEO title yenilə'];

const lowStockItems = [
  { sku: 'PT-2403', count: '6 ədəd', color: 'text-amber-600' },
  { sku: 'PT-2405', count: '0 ədəd', color: 'text-red-600' },
  { sku: 'PT-2411', count: '4 ədəd', color: 'text-amber-600' },
];

const AdminProducts = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Məhsul kataloqu</h1>
      <p className="text-sm text-muted-foreground">SKU, stok, qiymət, variant və görünürlüyü kodsuz idarə et</p>
    </div>

    {/* Filters */}
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {statusFilters.map((f, i) => (
        <Button key={f} size="sm" variant={i === 1 ? 'default' : 'outline'} className="text-xs h-8">{f}</Button>
      ))}
      <Select defaultValue="all"><SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Kateqoriya" /></SelectTrigger><SelectContent><SelectItem value="all">Kateqoriya: Hamısı</SelectItem></SelectContent></Select>
      <Select defaultValue="gt0"><SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gt0">Stok: &gt; 0</SelectItem></SelectContent></Select>
      <Select defaultValue="new"><SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">Sırala: Yeni</SelectItem></SelectContent></Select>
      <div className="flex-1" />
      <Button size="sm" variant="outline" className="text-xs h-8 text-primary border-primary/30"><Upload className="h-3 w-3 mr-1" />İdxal et</Button>
      <Button size="sm" variant="outline" className="text-xs h-8"><Download className="h-3 w-3 mr-1" />Eksport</Button>
    </div>

    <div className="grid grid-cols-4 gap-6">
      {/* Product table */}
      <div className="col-span-3 bg-white rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold">Məhsul siyahısı</h2>
          <p className="text-xs text-muted-foreground">Bütün vitrin məhsulları, variant və stok məlumatı</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="text-left p-4 font-medium">Məhsul</th>
              <th className="text-left p-4 font-medium">SKU</th>
              <th className="text-left p-4 font-medium">Kateqoriya</th>
              <th className="text-left p-4 font-medium">Qiymət</th>
              <th className="text-left p-4 font-medium">Stok</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">4 şəkil • 2 variant • SEO hazır</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.sku}</td>
                <td className="p-4">{p.cat}</td>
                <td className="p-4 font-semibold">AZN {p.price.toFixed(2)}</td>
                <td className="p-4"><Badge className={`${stockColor(p.stock)} border-0 text-xs`}>{p.stock} ədəd</Badge></td>
                <td className="p-4"><Badge className={`${statusColor[p.status] || ''} border-0 text-xs`}>{p.status}</Badge></td>
                <td className="p-4">
                  <Link to={`/admin/mehsullar/${p.id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-7 text-primary border-primary/30">Redaktə</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Kütləvi əməliyyatlar</h3>
          <p className="text-xs text-muted-foreground mb-3">Birdən çox məhsulu eyni anda dəyiş</p>
          <div className="space-y-2">
            {bulkActions.map((a) => (
              <Button key={a} variant="outline" size="sm" className="w-full text-xs justify-center h-8">{a}</Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Aşağı stok monitoru</h3>
          <p className="text-xs text-muted-foreground mb-3">Minimum limitdən aşağı düşən SKU-lar</p>
          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.sku}</span>
                <Badge className={`${item.color} bg-opacity-10 border-0 text-xs`}>{item.count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Məhsul kartı preview</h3>
          <div className="bg-muted rounded-lg h-32 flex items-center justify-center mt-2">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xs text-center mt-2 text-primary font-medium">Redaktə et</p>
          <p className="text-sm font-semibold text-center mt-1">Avto oturacaq organizer</p>
          <p className="text-sm font-bold text-center">AZN 44.90</p>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminProducts;
