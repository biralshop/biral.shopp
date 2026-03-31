import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TrendingUp, Gift, Tag, Percent } from 'lucide-react';

const kpis = [
  { label: 'Aktiv kampaniya', value: '12', change: '+3', icon: Tag, color: 'bg-primary' },
  { label: 'Fərdi kupon', value: '186', change: '+42', icon: Percent, color: 'bg-pink-500' },
  { label: 'Hədiyyə qaydası', value: '7', change: '+1', icon: Gift, color: 'bg-green-500' },
  { label: 'Konversiya uplift', value: '14.8%', change: '+2.1%', icon: TrendingUp, color: 'bg-amber-500' },
];

const campaigns = [
  { name: 'WELCOME10', type: 'Kupon', scope: 'Yeni istifadəçilər', value: '10%', status: 'Aktiv' },
  { name: 'VIP-APRIL', type: 'Fərdi kupon', scope: 'VIP segment', value: 'AZN 15', status: 'Aktiv' },
  { name: 'GIFT-100', type: 'Hədiyyə', scope: 'Səbət > AZN 100', value: '1 məhsul', status: 'Aktiv' },
  { name: '3AL2ÖDƏ', type: 'Bundle', scope: 'Seçilmiş məhsullar', value: '3 al 2 ödə', status: 'Draft' },
  { name: 'FREESHIP', type: 'Avtomatik endirim', scope: 'Bakı daxili', value: 'Pulsuz çatdırılma', status: 'Aktiv' },
  { name: 'RETURN-WIN', type: 'Kupon', scope: 'Təkrar alış yox 30 gün', value: '12%', status: 'Planlı' },
];

const statusColor: Record<string, string> = {
  'Aktiv': 'bg-green-100 text-green-700',
  'Draft': 'bg-amber-100 text-amber-700',
  'Planlı': 'bg-blue-100 text-blue-700',
};

const giftRules = [
  { name: 'Səbət > AZN 100', gift: 'Mini mop hədiyyə', status: 'Aktiv' },
  { name: 'VIP ilk alış', gift: 'Pulsuz çatdırılma', status: 'Aktiv' },
  { name: '3 maşın aksesuarı al', gift: 'Hədiyyə air freshener', status: 'Draft' },
  { name: 'Ad günü ayı', gift: 'AZN 10 kupon', status: 'Aktiv' },
];

const AdminPromotions = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Kampaniyalar, kuponlar, hədiyyə qaydaları</h1>
      <p className="text-sm text-muted-foreground">Qlobal endirim, fərdi kupon, hədiyyə və səbət qaydaları burada idarə olunur</p>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className={`${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
            <kpi.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          <span className="text-xs text-green-600 font-semibold">{kpi.change}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Campaign table */}
      <div className="col-span-2 bg-white rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold">Kampaniya mərkəzi</h2>
          <p className="text-xs text-muted-foreground">Kupon, hədiyyə və avtomatik endirim qaydaları</p>
          <div className="flex gap-2 mt-3">
            {['Hamısı', 'Kupon', 'Avtomatik endirim', 'Hədiyyə', 'Bundle'].map((t, i) => (
              <Button key={t} size="sm" variant={i === 0 ? 'default' : 'outline'} className="text-xs h-7">{t}</Button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left p-4 font-medium">Ad</th>
              <th className="text-left p-4 font-medium">Növ</th>
              <th className="text-left p-4 font-medium">Tətbiq sahəsi</th>
              <th className="text-left p-4 font-medium">Dəyər</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-b border-border last:border-0">
                <td className="p-4 font-semibold">{c.name}</td>
                <td className="p-4 text-muted-foreground">{c.type}</td>
                <td className="p-4 text-muted-foreground">{c.scope}</td>
                <td className="p-4">{c.value}</td>
                <td className="p-4"><Badge className={`${statusColor[c.status]} border-0 text-xs`}>{c.status}</Badge></td>
                <td className="p-4"><Button size="sm" variant="outline" className="text-xs h-7 text-primary border-primary/30">Redaktə</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex gap-2">
          <Button size="sm" className="bg-primary text-xs">Yeni kampaniya</Button>
          <Button size="sm" variant="outline" className="text-xs">Kupon bulk import</Button>
        </div>
      </div>

      {/* Side panels */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Fərdi fayda qurucusu</h3>
          <p className="text-xs text-muted-foreground mb-3">Müəyyən istifadəçiyə və ya seqmentə endirim/hədiyyə ver</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input placeholder="Müştəri axtar: 050..." className="text-xs" />
            <Select defaultValue="vip"><SelectTrigger className="text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="vip">VIP segment</SelectItem></SelectContent></Select>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><p className="text-xs text-muted-foreground mb-1">Fayda növü</p><Input defaultValue="Kupon" className="text-xs" /></div>
            <div><p className="text-xs text-muted-foreground mb-1">Dəyər</p><Input defaultValue="15%" className="text-xs" /></div>
            <div><p className="text-xs text-muted-foreground mb-1">Müddət</p><Input defaultValue="7 gün" className="text-xs" /></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between"><span className="text-xs">Yalnız 1 istifadə</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span className="text-xs">Hesabda göstər</span><Switch defaultChecked /></div>
          </div>
          <Button size="sm" className="bg-primary text-xs w-full">Müştəriyə tətbiq et</Button>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Hədiyyə qaydaları</h3>
          <p className="text-xs text-muted-foreground mb-3">Səbət, seqment və məhsul qaydaına bağlı hədiyyələr</p>
          <div className="space-y-3">
            {giftRules.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.gift}</p>
                </div>
                <Badge className={`${statusColor[r.status]} border-0 text-xs`}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminPromotions;
