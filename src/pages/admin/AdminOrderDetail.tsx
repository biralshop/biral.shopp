import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Truck, Clock, User, Package } from 'lucide-react';

const timelineSteps = [
  { label: 'Sifariş qəbul edildi', time: '28 Mar, 14:20', done: true },
  { label: 'Hazırlanır', time: '28 Mar, 15:10', done: true },
  { label: 'Kuryerə verildi', time: '29 Mar, 09:30', done: true },
  { label: 'Yoldadır', time: '29 Mar, 10:15', done: true, active: true },
  { label: 'Çatdırılıb', time: 'Gözlənilir: 29 Mar, 14:00–16:00', done: false },
];

const events = [
  { time: '10:15', text: 'Kuryer Murat bağlamanı götürdü', type: 'info' },
  { time: '10:42', text: 'Nəsimi rayonuna doğru hərəkətdə', type: 'info' },
  { time: '11:05', text: 'Müştəriyə SMS göndərildi', type: 'sms' },
  { time: '11:20', text: 'Tahmini çatdırılma: 14:00–16:00', type: 'eta' },
];

const orderItems = [
  { name: 'Çoxfunksiyalı organizer', sku: 'PT-2401', qty: 1, price: 29.90 },
  { name: 'Silikon spatula set', sku: 'PT-2405', qty: 2, price: 19.90 },
  { name: 'Mini mop təmizləyici', sku: 'PT-2408', qty: 1, price: 15.90 },
];

const AdminOrderDetail = () => (
  <AdminLayout>
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Sifariş detalı & Hardadır?</h1>
        <Badge className="bg-primary/10 text-primary border-0">Yoldadır</Badge>
      </div>
      <p className="text-sm text-muted-foreground">PS 249012 • Aysu Məmmədova</p>
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" className="text-xs">Admin qeydi</Button>
        <Button size="sm" variant="outline" className="text-xs text-primary border-primary/30">Tracking linki</Button>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Timeline & map */}
      <div className="col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-4">Sifariş timeline axını</h2>
          <div className="flex items-start justify-between">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.active ? 'bg-primary text-white' : step.done ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <p className={`text-xs mt-2 text-center font-medium ${step.active ? 'text-primary' : ''}`}>{step.label}</p>
                <p className="text-[10px] text-muted-foreground text-center mt-0.5">{step.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Admin xəritə görünüşü</h2>
          <p className="text-xs text-muted-foreground mb-3">Kuryer mövqeyi və marşrut</p>
          <div className="bg-muted rounded-lg h-52 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Canlı kuryer mövqeyi</p>
              <p className="text-xs text-muted-foreground">Nəsimi r. istiqaməti</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Sifariş tərkibi & ödəniş</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left pb-2 font-medium">Məhsul</th>
                <th className="text-left pb-2 font-medium">SKU</th>
                <th className="text-left pb-2 font-medium">Say</th>
                <th className="text-left pb-2 font-medium">Qiymət</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.sku} className="border-b border-border last:border-0">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-muted-foreground">{item.sku}</td>
                  <td className="py-2">{item.qty}</td>
                  <td className="py-2 font-semibold">AZN {(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-3 pt-3 border-t border-border">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Cəm: <span className="font-bold text-foreground">AZN 85.60</span></p>
              <p className="text-sm text-muted-foreground">Çatdırılma: <span className="font-bold text-foreground">AZN 4.90</span></p>
              <p className="text-lg font-bold text-primary mt-1">Ümumi: AZN 44.90</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Kuryer məlumatı</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Murat Əliyev</p>
              <p className="text-xs text-muted-foreground">070 555 12 34</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Vasitə</span><span>Motokuryer</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bölgə</span><span>Nəsimi / Yasamal</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ETA</span><span className="text-primary font-semibold">14:00 – 16:00</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Çatdırılma detalları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Ünvan</span><span>Nizami küç. 42, m.15</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rayon</span><span>Nəsimi</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Qeyd</span><span>Zəngsiz gətirin</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Çatdırılma</span><span>Standart</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">İzləmə tarixçəsi</h3>
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-muted-foreground w-12 shrink-0">{e.time}</span>
                <p>{e.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-2">Admin əməliyyatları</h3>
          <div className="space-y-2">
            <Select defaultValue="yoldadir"><SelectTrigger className="text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="yoldadir">Status: Yoldadır</SelectItem><SelectItem value="catdirildi">Çatdırılıb</SelectItem></SelectContent></Select>
            <Button size="sm" className="w-full bg-primary text-xs">Statusu yenilə</Button>
            <Button size="sm" variant="outline" className="w-full text-xs">Refund başlat</Button>
            <Button size="sm" variant="outline" className="w-full text-xs text-red-500 border-red-200">Sifarişi ləğv et</Button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminOrderDetail;
