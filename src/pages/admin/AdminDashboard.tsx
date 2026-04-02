import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Users, Ticket, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const kpis = [
  { label: 'Bu ay satış', value: 'AZN 124.580', change: '+18%', up: true, icon: DollarSign, color: 'bg-primary' },
  { label: 'Aktiv sifariş', value: '286', change: '+12%', up: true, icon: ShoppingCart, color: 'bg-green-500' },
  { label: 'Orta səbət', value: 'AZN 48.20', change: '+4%', up: true, icon: Users, color: 'bg-amber-500' },
  { label: 'Açıq tiket', value: '14', change: '-3%', up: false, icon: Ticket, color: 'bg-purple-500' },
];

const chartData = [
  { name: '1 həftə', sales: 12000 }, { name: '2 həftə', sales: 18000 },
  { name: '3 həftə', sales: 16000 }, { name: '4 həftə', sales: 22000 },
  { name: '5 həftə', sales: 20000 }, { name: '6 həftə', sales: 28000 },
];

const quickActions = [
  { label: 'Yeni məhsul', color: 'text-green-600 border-green-200 bg-green-50', link: '/admin/mehsullar/yeni' },
  { label: 'Mağazaya bax', color: 'text-primary border-primary/20 bg-primary/5', link: '/' },
  { label: 'Sifarişlər', color: 'text-amber-600 border-amber-200 bg-amber-50', link: '/admin/sifarisler' },
  { label: 'Kateqoriyalar', color: 'text-purple-600 border-purple-200 bg-purple-50', link: '/admin/kateqoriyalar' },
  { label: 'Müştərilər', color: 'text-green-600 border-green-200 bg-green-50', link: '/admin/musteriler' }
];

const lowStock = [
  { name: 'Silikon spatula organizer', alert: '7 ədəd qalıb', color: 'text-amber-600 bg-amber-50' },
  { name: 'Qapaqlı saxlama qabı dəsti', alert: 'Tədarük gecikir', color: 'text-red-600 bg-red-50' },
  { name: 'Portativ avto tozsoran', alert: '29 nəfər gözləyir', color: 'text-primary bg-primary/10' },
];

const activity = [
  { time: '11:42', action: 'Banner yeniləndi', user: 'Aysel' },
  { time: '11:05', action: 'VIP kupon verildi', user: 'Emin' },
  { time: '10:48', action: 'Status yoldadır oldu', user: 'Ləman' },
];

const AdminDashboard = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">Admin panel overview</h1>
      <p className="text-sm text-muted-foreground">Satış, məhsul, kupon, sifariş və məzmunu bir yerdən idarə et</p>
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
          <span className={`text-xs font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
            {kpi.up ? <TrendingUp className="inline h-3 w-3 mr-0.5" /> : <TrendingDown className="inline h-3 w-3 mr-0.5" />}
            {kpi.change}
          </span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Sales chart */}
      <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold">Satış performansı</h2>
            <p className="text-xs text-muted-foreground">Son 6 həftə • satış, sifariş və konversiya</p>
          </div>
          <div className="flex gap-1">
            {['Günlük', 'Həftəlik', 'Aylıq'].map((p, i) => (
              <Button key={p} size="sm" variant={i === 1 ? 'default' : 'outline'} className="text-xs h-7">{p}</Button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2196F3" strokeWidth={2.5} dot={{ fill: '#2196F3', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions + low stock */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Sürətli idarəetmə</h2>
          <p className="text-xs text-muted-foreground mb-3">Kod yazmadan ən çox işlənən əməliyyatlar</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((a) => (
              <Button key={a.label} variant="outline" size="sm" className={`text-xs h-8 ${a.color}`} asChild>
                <a href={a.link}>{a.label}</a>
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Aşağı stok & diqqət tələb edənlər</h2>
          <div className="space-y-2.5">
            {lowStock.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <p className="text-sm truncate flex-1">{item.name}</p>
                <Badge className={`${item.color} border-0 text-xs ml-2`}>{item.alert}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Managed modules */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-3">İdarə olunan modullar</h2>
        <div className="space-y-3 text-sm">
          {[
            { title: 'Storefront CMS', desc: 'Ana səhifə, kampaniya, footer, hesab səhifələri' },
            { title: 'Kataloq', desc: 'Məhsullar, variantlar, SKU, stok, filtr və atributlar' },
            { title: 'Sifariş & logistika', desc: 'Status, kuryer, hardadır?, refund, qaytarma' },
            { title: 'CRM & promo', desc: 'Kupon, fərdi endirim, hədiyyə, bonus balans' },
          ].map((m) => (
            <div key={m.title}>
              <p className="font-semibold">{m.title}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Canlı mağaza preview</h2>
        <p className="text-xs text-muted-foreground mb-3">Məzmun blokları admin paneldən dəyişdirilir</p>
        <div className="bg-muted rounded-lg h-44 flex items-center justify-center">
          <div className="text-center">
            <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Storefront preview</p>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Son fəaliyyət jurnalı</h2>
        <p className="text-xs text-muted-foreground mb-3">Bütün dəyişikliklər izlənir</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground text-xs">
              <th className="text-left pb-2 font-medium">Vaxt</th>
              <th className="text-left pb-2 font-medium">Əməliyyat</th>
              <th className="text-left pb-2 font-medium">İcra edən</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((a, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2 text-muted-foreground">{a.time}</td>
                <td className="py-2">{a.action}</td>
                <td className="py-2">{a.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
