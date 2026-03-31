import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

const segments = ['Hamısı', 'VIP', 'Yeni', '30 gün passiv', 'Risk'];

const customers = [
  { name: 'Aysu Məmmədova', phone: '050 312 45 67', orders: 12, total: 486, segment: 'VIP', color: 'bg-primary' },
  { name: 'Murad Əliyev', phone: '070 441 87 22', orders: 3, total: 129, segment: 'Yeni', color: 'bg-green-500' },
  { name: 'Nərmin Həsənli', phone: '055 238 64 11', orders: 9, total: 372, segment: 'Aktiv', color: 'bg-amber-500' },
  { name: 'Rəşad Quliyev', phone: '077 220 14 55', orders: 1, total: 44, segment: '30 gün passiv', color: 'bg-purple-500' },
  { name: 'Lalə Məlikova', phone: '051 722 80 90', orders: 7, total: 299, segment: 'Risk', color: 'bg-red-500' },
  { name: 'Tural Əliyev', phone: '010 510 11 33', orders: 15, total: 625, segment: 'VIP', color: 'bg-primary' },
];

const segmentColor: Record<string, string> = {
  'VIP': 'bg-primary/10 text-primary',
  'Yeni': 'bg-green-100 text-green-700',
  'Aktiv': 'bg-amber-100 text-amber-700',
  '30 gün passiv': 'bg-purple-100 text-purple-700',
  'Risk': 'bg-red-100 text-red-700',
};

const segmentRules = [
  { name: 'VIP', desc: 'Ümumi xərc > AZN 300 və sifariş sayı > 5', count: 92 },
  { name: 'Yeni müştərilər', desc: 'İlk 14 gündə qeydiyyatdan keçənlər', count: 241 },
  { name: '30 gün passiv', desc: 'Son 30 gündə alış etməyənlər', count: 118 },
  { name: 'Risk qrupu', desc: 'Səbət tərk etdi və ya qaytarma etdi', count: 47 },
];

const automations = [
  { name: 'Yeni qeydiyyat', desc: 'WELCOME10 email + checkout badge' },
  { name: 'VIP alış sonrası', desc: 'Növbəti sifariş üçün pulsuz çatdırılma' },
  { name: '30 gün passiv', desc: 'SMS ilə 12% kupon' },
  { name: 'Ad günü ayı', desc: 'Hədiyyə məhsul və şəxsi təbrik' },
];

const AdminCustomers = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Müştərilər və seqmentlər</h1>
      <p className="text-sm text-muted-foreground">VIP, aktiv, riskli və yeni müştəri qruplarını idarə et, hədəflə</p>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Customer list */}
      <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Müştəri bazası</h2>
        <p className="text-xs text-muted-foreground mb-3">Profil, alış tarixçəsi, bonus balansı və seqment</p>
        <div className="flex gap-2 mb-4">
          {segments.map((s, i) => (
            <Button key={s} size="sm" variant={i === 0 ? 'default' : 'outline'} className="text-xs h-7">{s}</Button>
          ))}
        </div>
        <div className="space-y-2">
          {customers.map((c) => (
            <div key={c.name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 border border-border">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={`${c.color} text-white text-xs`}>{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.phone} • {c.orders} sifariş</p>
              </div>
              <p className="text-sm font-bold">AZN {c.total}</p>
              <Badge className={`${segmentColor[c.segment]} border-0 text-xs`}>{c.segment}</Badge>
              <Link to={`/admin/musteriler/${c.name.split(' ')[0].toLowerCase()}`}>
                <Button size="sm" variant="outline" className="text-xs h-7 text-primary border-primary/30">Aç</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Side panels */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Seqment qurucusu</h3>
          <p className="text-xs text-muted-foreground mb-3">Qaydalarla avtomatik müştəri qrupları yarat</p>
          <div className="space-y-3">
            {segmentRules.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">{r.count} nəfər</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Avtomatik aksiyalar</h3>
          <p className="text-xs text-muted-foreground mb-3">Seqmentə görə kupon və hədiyyə axınları</p>
          <div className="space-y-3">
            {automations.map((a) => (
              <div key={a.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7">Redaktə</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminCustomers;
