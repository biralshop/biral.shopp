import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ImagePlus, Package } from 'lucide-react';

const variants = [
  { name: 'Qara', sku: 'PT-2402-BK', price: 44.90, stock: 18, barcode: '842019-02', status: 'Aktiv' },
  { name: 'Boz', sku: 'PT-2402-GR', price: 44.90, stock: 9, barcode: '842019-03', status: 'Aktiv' },
  { name: '2-li paket', sku: 'PT-2402-2X', price: 79.90, stock: 4, barcode: '842019-07', status: 'Tükənir' },
];

const AdminProductEditor = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Məhsul redaktəsi</h1>
      <p className="text-sm text-muted-foreground">Başlıqdan SEO-ya qədər bütün məhsul sahələri form əsaslı</p>
    </div>

    <div className="flex items-center gap-3 mb-6">
      <h2 className="font-bold text-lg">SKU PT-2402 • Portativ avto tozsoran</h2>
      <Badge className="bg-green-100 text-green-700 border-0">Aktiv</Badge>
      <div className="flex-1" />
      <Button variant="outline" size="sm" className="text-xs">Qaralama</Button>
      <Button size="sm" className="bg-primary text-xs">Preview</Button>
      <Button size="sm" variant="outline" className="text-xs text-red-500 border-red-200">Ləğv et</Button>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Left column - Main form */}
      <div className="col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-4">Əsas məlumatlar</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Məhsul adı</Label>
              <Input defaultValue="Portativ avto tozsoran" />
            </div>
            <div>
              <Label className="text-xs">Qısa təsvir</Label>
              <Textarea defaultValue="Avtomobil üçün portativ, yüngül və güclü tozsoran. Həm quru, həm də xırda hissəciklərin təmizlənməsi üçün ideal." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Kateqoriya</Label><Input defaultValue="Maşın / Təmizlik" /></div>
              <div><Label className="text-xs">Brend</Label><Input defaultValue="PraktikTap Select" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Qiymət</Label><Input defaultValue="AZN 44.90" /></div>
              <div><Label className="text-xs">Endirimli qiymət</Label><Input defaultValue="AZN 39.90" /></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Variantlar & stok</h3>
          <p className="text-xs text-muted-foreground mb-4">Rəng, paket və anbar üzrə limitlər</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left pb-2 font-medium">Variant</th>
                <th className="text-left pb-2 font-medium">SKU</th>
                <th className="text-left pb-2 font-medium">Qiymət</th>
                <th className="text-left pb-2 font-medium">Stok</th>
                <th className="text-left pb-2 font-medium">Barcode</th>
                <th className="text-left pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.sku} className="border-b border-border last:border-0">
                  <td className="py-3">{v.name}</td>
                  <td className="py-3 text-muted-foreground">{v.sku}</td>
                  <td className="py-3">AZN {v.price.toFixed(2)}</td>
                  <td className="py-3">{v.stock}</td>
                  <td className="py-3 text-muted-foreground">{v.barcode}</td>
                  <td className="py-3">
                    <Badge className={`${v.status === 'Aktiv' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} border-0 text-xs`}>{v.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="ghost" size="sm" className="text-primary text-xs mt-2">+ Variant əlavə et</Button>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-4">SEO & əlaqəli məhsullar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Slug</Label><Input defaultValue="portativ-avto-tozsoran" /></div>
            <div><Label className="text-xs">Əlaqəli məhsullar</Label><Input defaultValue="Avto organizer, maşın üçün mini mop" /></div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Media & vitrin görünüşü</h3>
          <p className="text-xs text-muted-foreground mb-3">Məhsul kartı şəkilləri və preview</p>
          <div className="bg-muted rounded-lg h-40 flex items-center justify-center border-2 border-dashed border-border">
            <Button className="bg-primary"><ImagePlus className="h-4 w-4 mr-1" /> Şəkil əlavə et</Button>
          </div>
          <p className="text-xs text-primary text-center mt-2">Əsas şəkil</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-muted rounded h-14 flex items-center justify-center">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Kart preview & görünürlük</h3>
          <p className="text-xs text-muted-foreground mb-3">Məhsul sayt üzərində necə görünür</p>
          <div className="bg-muted rounded-lg h-28 flex items-center justify-center">
            <div className="text-center">
              <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">Top</Badge>
              <Package className="h-6 w-6 text-muted-foreground mx-auto mt-1" />
            </div>
          </div>
          <p className="text-sm font-semibold mt-2">Portativ avto tozsoran</p>
          <p className="text-sm font-bold">AZN 44.90</p>
          <p className="text-xs text-primary mt-1">Redaktə et</p>

          <div className="space-y-3 mt-4">
            {[
              { label: 'Saytda göstər', checked: true },
              { label: 'Axtarışda göstər', checked: true },
              { label: 'Yalnız kampaniyada', checked: false },
              { label: 'Wishlist aktiv', checked: true },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <span className="text-sm">{toggle.label}</span>
                <Switch defaultChecked={toggle.checked} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Çatdırılma & checkout parametrləri</h3>
          <p className="text-xs text-muted-foreground mb-3">Çəkisi, ölçüsü, hədiyyə paketi, COD</p>
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Çəki</Label><Input defaultValue="0.9 kq" className="text-xs" /></div>
            <div><Label className="text-xs">Ölçü</Label><Input defaultValue="42×16×12 sm" className="text-xs" /></div>
            <div><Label className="text-xs">Çatdırılma növü</Label><Input defaultValue="Kuryer + pickup" className="text-xs" /></div>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">Qapıda ödəniş</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Hədiyyə paketi</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminProductEditor;
