import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ExternalLink, Upload } from 'lucide-react';

const colors = [
  { name: 'Primary', value: '#2196F3' },
  { name: 'Accent', value: '#FFB74D' },
  { name: 'Background', value: '#F5F9FF' },
  { name: 'Cards / surface', value: '#FFFFFF' },
  { name: 'Text', value: '#10233A' },
  { name: 'Footer', value: '#14253C' },
];

const AdminBrand = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Brend, tema və identitet ayarları</h1>
      <p className="text-sm text-muted-foreground">Logo, rəng, tipografiya, SEO və sosial məlumatlar</p>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Brand identity */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Brand identitəsi</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">Mağaza adı</Label>
              <Input defaultValue="PraktikTap" />
            </div>
            <div>
              <Label className="text-xs">Slogan</Label>
              <Input defaultValue="Praktik alış, sürətli çatdırılma" />
            </div>
            <div>
              <Label className="text-xs mb-2 block">Logo</Label>
              <div className="bg-primary rounded-lg h-20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">PraktikTap</span>
              </div>
              <Button size="sm" variant="outline" className="text-xs mt-2 w-full"><Upload className="h-3 w-3 mr-1" />Logo yüklə</Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Rəng sistemi</h2>
          <div className="space-y-3">
            {colors.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-border" style={{ backgroundColor: c.value }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </div>
                <Input defaultValue={c.value} className="w-24 text-xs h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO + Social */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">SEO & default meta</h2>
          <div className="space-y-3">
            <div><Label className="text-xs">Default title</Label><Input defaultValue="PraktikTap — Praktik məhsullar, sürətli çatdırılma" /></div>
            <div><Label className="text-xs">Meta description</Label><Textarea defaultValue="Mətbəx, bağça, maşın və ev üçün praktik məhsullar. Güvənli ödəniş, sürətli çatdırılma." rows={3} /></div>
            <div><Label className="text-xs">OG Image</Label><Button size="sm" variant="outline" className="w-full text-xs"><Upload className="h-3 w-3 mr-1" />Şəkil yüklə</Button></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Əlaqə və sosial</h2>
          <div className="space-y-3">
            <div><Label className="text-xs">Email</Label><Input defaultValue="info@praktiktap.az" /></div>
            <div><Label className="text-xs">Telefon</Label><Input defaultValue="+994 50 123 45 67" /></div>
            <div><Label className="text-xs">Instagram</Label><Input defaultValue="@praktiktap" /></div>
            <div><Label className="text-xs">Facebook</Label><Input defaultValue="fb.com/praktiktap" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Header & footer</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Announcement bar', checked: true },
              { label: 'Axtarış çubuğu', checked: true },
              { label: 'Kateqoriya nav', checked: true },
              { label: 'Footer 4-sütun', checked: true },
              { label: 'Newsletter formu', checked: false },
            ].map((t) => (
              <div key={t.label} className="flex items-center justify-between">
                <span>{t.label}</span>
                <Switch defaultChecked={t.checked} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storefront preview */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Canlı vitrin preview</h2>
        <p className="text-xs text-muted-foreground mb-3">Brend dəyişiklikləri dərhal görünür</p>
        <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
          <div className="text-center">
            <ExternalLink className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Storefront preview</p>
            <p className="text-xs text-muted-foreground mt-1">Rəng, logo və layout dəyişiklikləri</p>
          </div>
        </div>
        <Button size="sm" className="bg-primary text-xs mt-3 w-full">Dəyişiklikləri dərc et</Button>
      </div>
    </div>
  </AdminLayout>
);

export default AdminBrand;
