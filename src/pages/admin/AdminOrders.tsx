import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const statusFilters = ['Hamısı', 'Yeni', 'Hazırlanır', 'Yoldadır', 'Çatdırılıb', 'Qaytarma', 'Ləğv'];

const orders = [
  { id: 'PT-249012', customer: 'Aysu Məmmədova', items: 3, total: 124.70, payment: 'Kart', delivery: 'Standart', status: 'Yoldadır', date: '29 Mar' },
  { id: 'PT-248998', customer: 'Murad Əliyev', items: 1, total: 44.90, payment: 'Qapıda', delivery: 'Ekspres', status: 'Hazırlanır', date: '29 Mar' },
  { id: 'PT-248871', customer: 'Nərmin Həsənli', items: 2, total: 69.80, payment: 'Kart', delivery: 'Standart', status: 'Çatdırılıb', date: '28 Mar' },
  { id: 'PT-248650', customer: 'Rəşad Quliyev', items: 1, total: 29.90, payment: 'Bank', delivery: 'Standart', status: 'Yoldadır', date: '27 Mar' },
  { id: 'PT-248412', customer: 'Lalə Məlikova', items: 4, total: 159.60, payment: 'Kart', delivery: 'Ekspres', status: 'Çatdırılıb', date: '26 Mar' },
  { id: 'PT-248290', customer: 'Tural Əliyev', items: 2, total: 89.80, payment: 'Qapıda', delivery: 'Standart', status: 'Qaytarma', date: '25 Mar' },
  { id: 'PT-248100', customer: 'Əli Hüseynov', items: 1, total: 34.90, payment: 'Kart', delivery: 'Standart', status: 'Ləğv', date: '24 Mar' },
];

const statusColor: Record<string, string> = {
  'Yoldadır': 'bg-primary/10 text-primary',
  'Hazırlanır': 'bg-amber-100 text-amber-700',
  'Çatdırılıb': 'bg-green-100 text-green-700',
  'Qaytarma': 'bg-red-100 text-red-600',
  'Ləğv': 'bg-gray-100 text-gray-500',
  'Yeni': 'bg-blue-100 text-blue-700',
};

const statusPipeline = [
  { label: 'Yeni', count: 8, color: 'bg-blue-500' },
  { label: 'Hazırlanır', count: 12, color: 'bg-amber-500' },
  { label: 'Yoldadır', count: 23, color: 'bg-primary' },
  { label: 'Çatdırılıb', count: 186, color: 'bg-green-500' },
  { label: 'Qaytarma', count: 4, color: 'bg-red-500' },
];

const AdminOrders = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Sifarişlərin idarə olunması</h1>
      <p className="text-sm text-muted-foreground">Status, ödəniş, çatdırılma, tracking və bulk əməliyyatlar</p>
    </div>

    {/* Status pipeline */}
    <div className="flex gap-3 mb-6">
      {statusPipeline.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-border p-4 shadow-sm flex-1 text-center">
          <div className={`${s.color} w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2`}>
            <span className="text-white text-xs font-bold">{s.count}</span>
          </div>
          <p className="text-xs font-medium">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Filters */}
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      {statusFilters.map((f, i) => (
        <Button key={f} size="sm" variant={i === 0 ? 'default' : 'outline'} className="text-xs h-8">{f}</Button>
      ))}
      <div className="flex-1" />
      <Select defaultValue="new"><SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">Sırala: Yeni</SelectItem></SelectContent></Select>
      <Button size="sm" variant="outline" className="text-xs h-8">Eksport</Button>
    </div>

    <div className="grid grid-cols-4 gap-6">
      {/* Orders table */}
      <div className="col-span-3 bg-white rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="font-bold">Sifariş cədvəli</h2>
          <p className="text-xs text-muted-foreground">Bütün sifarişlər, status və əməliyyatlar</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left p-4 font-medium">Sifariş</th>
              <th className="text-left p-4 font-medium">Müştəri</th>
              <th className="text-left p-4 font-medium">Məhsul</th>
              <th className="text-left p-4 font-medium">Məbləğ</th>
              <th className="text-left p-4 font-medium">Ödəniş</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Tarix</th>
              <th className="text-left p-4 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4 font-semibold">{o.id}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 text-muted-foreground">{o.items} məhsul</td>
                <td className="p-4 font-semibold">AZN {o.total.toFixed(2)}</td>
                <td className="p-4 text-muted-foreground">{o.payment}</td>
                <td className="p-4"><Badge className={`${statusColor[o.status]} border-0 text-xs`}>{o.status}</Badge></td>
                <td className="p-4 text-muted-foreground">{o.date}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Link to={`/admin/sifarisler/${o.id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7">Aç</Button>
                    </Link>
                    {o.status === 'Yoldadır' && (
                      <Link to={`/admin/sifarisler/${o.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-primary">Hardadır?</Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side: status pipeline */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Status pipeline</h3>
          <p className="text-xs text-muted-foreground mb-3">Cari axın</p>
          {statusPipeline.map((s) => (
            <div key={s.label} className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-sm flex-1">{s.label}</span>
              <span className="text-sm font-bold">{s.count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Sürətli status pozisiyası</h3>
          <p className="text-xs text-muted-foreground mb-3">Bulk status dəyişdirmə</p>
          <div className="space-y-2">
            {['Seçilənləri Yoldadır et', 'Seçilənləri Çatdırılıb et', 'Ləğv et və xəbərdar et'].map((a) => (
              <Button key={a} variant="outline" size="sm" className="w-full text-xs h-8">{a}</Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminOrders;
