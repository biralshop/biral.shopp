import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, ExternalLink, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState } from 'react';

const blocks = [
  { name: 'Announcement bar', status: 'Aktiv' },
  { name: 'Hero banner', status: 'Seçilmiş' },
  { name: 'Category grid', status: 'Aktiv' },
  { name: 'Viral products', status: 'Aktiv' },
  { name: 'Campaign strip', status: 'Draft' },
  { name: 'Trust badges', status: 'Aktiv' },
  { name: 'Testimonials', status: 'Gizli' },
  { name: 'Footer links', status: 'Aktiv' },
];

const statusColor: Record<string, string> = {
  'Aktiv': 'text-green-600',
  'Seçilmiş': 'text-primary',
  'Draft': 'text-amber-500',
  'Gizli': 'text-muted-foreground',
};

const AdminHomeBuilder = () => {
  const [selectedBlock, setSelectedBlock] = useState('Hero banner');

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ana səhifə builder</h1>
        <p className="text-sm text-muted-foreground">Hero, kampaniya, kateqoriya, məhsul shelf və footer blokları idarə olunur</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Block list */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Səhifə blokları</h2>
          <p className="text-xs text-muted-foreground mb-4">Sürüşdür, aç, bağla, sırala</p>
          <div className="space-y-1">
            {blocks.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBlock(b.name)}
                className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-colors ${
                  selectedBlock === b.name ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
                }`}
              >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />
                <span className="text-sm flex-1">{b.name}</span>
                <span className={`text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span>
              </button>
            ))}
          </div>
          <Button size="sm" className="bg-primary mt-4 text-xs w-full">Blok əlavə et</Button>
        </div>

        {/* Live preview */}
        <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Canlı preview</h2>
          <p className="text-xs text-muted-foreground mb-3">Səhifə front-end görünüşü bu pəncərədə yenilənir</p>
          <div className="bg-muted rounded-lg h-[420px] flex items-center justify-center">
            <div className="text-center">
              <ExternalLink className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Storefront homepage preview</p>
              <p className="text-xs text-muted-foreground mt-1">Bloklar admin paneldən dəyişdirilir</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[
              { icon: Monitor, label: 'Desktop' },
              { icon: Tablet, label: 'Tablet' },
              { icon: Smartphone, label: 'Mobil' },
            ].map((device, i) => (
              <Button key={device.label} size="sm" variant={i === 0 ? 'default' : 'outline'} className="text-xs">
                <device.icon className="h-3.5 w-3.5 mr-1" />{device.label}
              </Button>
            ))}
            <div className="flex-1" />
            <Button size="sm" variant="outline" className="text-xs text-primary border-primary/30">Canlı dərc et</Button>
          </div>
        </div>

        {/* Block editor */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Seçilmiş blok: {selectedBlock}</h2>
          <p className="text-xs text-muted-foreground mb-4">Mətn, CTA, şəkil və görünmə qaydaları</p>

          <div className="space-y-3">
            <div><Label className="text-xs">Başlıq</Label><Input defaultValue="Evdə, bağçada və maşında lazım olan viral tapıntılar" className="text-xs" /></div>
            <div><Label className="text-xs">Təsvir</Label><Input defaultValue="Aydın CTA, güclü başlıq və 2 yardımçı fayda" className="text-xs" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Primary CTA</Label><Input defaultValue="İndi bax" className="text-xs" /></div>
              <div><Label className="text-xs">Secondary CTA</Label><Input defaultValue="Kateqoriyalar" className="text-xs" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Fon rəngi</Label><Input defaultValue="#2196F3" className="text-xs" /></div>
              <div><Label className="text-xs">Mətn rəngi</Label><Input defaultValue="#FFFFFF" className="text-xs" /></div>
            </div>

            <div className="space-y-2 pt-2">
              {[
                { label: 'Countdown göstər', checked: true },
                { label: 'Bu həftə kampaniyası göstər', checked: false },
                { label: 'Yalnız mobil görünüş', checked: false },
              ].map((t) => (
                <div key={t.label} className="flex items-center justify-between">
                  <span className="text-xs">{t.label}</span>
                  <Switch defaultChecked={t.checked} />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold mb-1">Planlaşdırma</p>
              <p className="text-xs text-muted-foreground">Başlama: 01.04 • Bitmə: 07.04</p>
              <p className="text-xs text-muted-foreground">Status: Avtomatik yayınlanacaq</p>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold mb-2">Blok içi məhsullar</p>
              {['Çoxfunksiyalı organizer', 'Portativ blender', 'Avto organizer'].map((p) => (
                <div key={p} className="flex items-center justify-between py-1.5">
                  <span className="text-xs">{p}</span>
                  <Button size="sm" variant="outline" className="text-[10px] h-6">Dəyiş</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHomeBuilder;
