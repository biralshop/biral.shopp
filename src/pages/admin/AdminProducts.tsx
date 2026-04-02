import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Download, Upload, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsAPI } from '@/lib/api';

const statusFilters = ['Hamısı', 'Aktiv', 'Qaralama', 'Tükənir', 'Gizli'];

const statusColor: Record<string, string> = {
  'Aktiv': 'bg-green-100 text-green-700',
  'Yenilənib': 'bg-blue-100 text-blue-700',
  'Tükənir': 'bg-amber-100 text-amber-700',
  'Gizli': 'bg-gray-100 text-gray-500',
};

const stockColor = (s: number) => s === 0 ? 'text-red-600 bg-red-50' : s < 20 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50';

const bulkActions = ['Qiymətə +10% əlavə et', 'Kateqoriyanı dəyiş', 'Statusu aktiv/gizli et', 'Stok xəbərdarlığı qur', 'SEO title yenilə'];

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll()
      .then(res => setProducts(res.products))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const lowStockItems = products.filter(p => p.stock < 20).slice(0, 3);

  return (
  <AdminLayout>
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Məhsul kataloqu</h1>
        <p className="text-sm text-muted-foreground">SKU, stok, qiymət, variant və görünürlüyü kodsuz idarə et</p>
      </div>
      <Link to="/admin/mehsullar/yeni">
        <Button className="font-semibold px-6 shadow-sm"><Plus className="w-5 h-5 mr-2" />Yeni Məhsul Əlavə Et</Button>
      </Link>
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
          <p className="text-xs text-muted-foreground">Bütün vitrin məhsulları, variant və stok məlumatı {loading && '(Yüklənir...)'}</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="text-left p-4 font-medium">Məhsul</th>
              <th className="text-left p-4 font-medium">Kateqoriya</th>
              <th className="text-left p-4 font-medium">Qiymət</th>
              <th className="text-left p-4 font-medium">Stok</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3 w-64">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{p.images?.length || 0} şəkil</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4 font-semibold">AZN {p.price?.toFixed(2)}</td>
                <td className="p-4"><Badge className={`${stockColor(p.stock)} border-0 text-xs`}>{p.stock} ədəd</Badge></td>
                <td className="p-4">
                  <Badge className={`${p.stock > 0 ? statusColor['Aktiv'] : statusColor['Tükənir']} border-0 text-xs`}>
                    {p.stock > 0 ? 'Aktiv' : 'Tükənir'}
                  </Badge>
                </td>
                <td className="p-4">
                  <Link to={`/admin/mehsullar/${p._id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-7 text-primary border-primary/30">Redaktə</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-muted-foreground">Heç bir məhsul tapılmadı. Yeni məhsul əlavə edin.</td>
              </tr>
            )}
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
              <div key={item._id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.sku || 'N/A'}</span>
                <Badge className={`${stockColor(item.stock)} bg-opacity-20 border-0 text-xs`}>{item.stock} ədəd</Badge>
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
};

export default AdminProducts;
