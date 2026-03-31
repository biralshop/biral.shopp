import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const deliveryZones = [
  { zone: 'Bakı şəhəri', cost: 'AZN 4.90', eta: '1-2 gün', status: 'Aktiv' },
  { zone: 'Sumqayıt', cost: 'AZN 6.90', eta: '2-3 gün', status: 'Aktiv' },
  { zone: 'Abşeron', cost: 'AZN 7.90', eta: '2-3 gün', status: 'Aktiv' },
  { zone: 'Regionlar', cost: 'AZN 9.90', eta: '3-5 gün', status: 'Aktiv' },
  { zone: 'Ekspres (Bakı)', cost: 'AZN 9.90', eta: 'Eyni gün', status: 'Aktiv' },
];

const paymentMethods = [
  { name: 'Kartla ödəniş', desc: 'Visa, Mastercard, online', enabled: true },
  { name: 'Qapıda ödəniş', desc: 'Nağd və ya POS terminal', enabled: true },
  { name: 'Bank köçürməsi', desc: 'Invoice əsasında', enabled: true },
  { name: 'Taksit', desc: '3-6 ay taksit seçimi', enabled: false },
];

const checkoutFields = [
  { name: 'Ad, Soyad', required: true, visible: true },
  { name: 'Telefon', required: true, visible: true },
  { name: 'Şəhər', required: true, visible: true },
  { name: 'Poçt kodu', required: false, visible: true },
  { name: 'Ünvan', required: true, visible: true },
  { name: 'Qeyd', required: false, visible: true },
  { name: 'Şirkət adı', required: false, visible: false },
  { name: 'VÖEN', required: false, visible: false },
];

const returnPolicies = [
  { label: 'Qaytarma müddəti', value: '14 gün' },
  { label: 'Refund metodu', value: 'Orijinal ödəniş üsulu' },
  { label: 'Qaytarma çatdırılma', value: 'Pulsuz' },
  { label: 'Dəyişdirmə', value: 'Aktiv' },
];

const notifications = [
  { event: 'Sifariş qəbul edildi', email: true, sms: true, push: true },
  { event: 'Hazırlanır', email: true, sms: false, push: true },
  { event: 'Yoldadır', email: true, sms: true, push: true },
  { event: 'Çatdırılıb', email: true, sms: true, push: false },
  { event: 'Qaytarma qəbul edildi', email: true, sms: false, push: false },
];

const AdminDelivery = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Çatdırılma, ödəniş və qaytarma</h1>
      <p className="text-sm text-muted-foreground">Zonalar, tariflər, ETA, checkout sahələri, ödəniş üsulları, refund və qaytarma qaydaları</p>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Delivery zones */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Çatdırılma zonaları</h2>
        <p className="text-xs text-muted-foreground mb-4">Bölgə, tarif və ETA qaydaları</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left pb-2 font-medium">Zona</th>
              <th className="text-left pb-2 font-medium">Tarif</th>
              <th className="text-left pb-2 font-medium">ETA</th>
              <th className="text-left pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {deliveryZones.map((z) => (
              <tr key={z.zone} className="border-b border-border last:border-0">
                <td className="py-2.5 font-medium">{z.zone}</td>
                <td className="py-2.5">{z.cost}</td>
                <td className="py-2.5 text-muted-foreground">{z.eta}</td>
                <td className="py-2.5"><Badge className="bg-green-100 text-green-700 border-0 text-xs">{z.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button size="sm" className="bg-primary text-xs mt-3">Yeni zona əlavə et</Button>
      </div>

      {/* Payment methods */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Ödəniş üsulları</h2>
        <p className="text-xs text-muted-foreground mb-4">Checkout zamanı görünən ödəniş seçimləri</p>
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div key={pm.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="text-sm font-semibold">{pm.name}</p>
                <p className="text-xs text-muted-foreground">{pm.desc}</p>
              </div>
              <Switch defaultChecked={pm.enabled} />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Checkout fields */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Checkout sahə qurucusu</h2>
        <p className="text-xs text-muted-foreground mb-4">Formdakı sahələri müəyyənləşdir</p>
        <div className="space-y-2">
          {checkoutFields.map((f) => (
            <div key={f.name} className="flex items-center justify-between p-2.5 border border-border rounded-lg">
              <span className="text-sm">{f.name}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Vacib</span>
                  <Switch defaultChecked={f.required} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Görünür</span>
                  <Switch defaultChecked={f.visible} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button size="sm" variant="ghost" className="text-primary text-xs mt-2">+ Yeni sahə</Button>
      </div>

      {/* Return / Refund */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Qaytarma & refund qaydaları</h2>
          <p className="text-xs text-muted-foreground mb-3">Müştəri qaytarma siyasəti</p>
          <div className="space-y-2">
            {returnPolicies.map((p) => (
              <div key={p.label} className="flex justify-between text-sm border-b border-border last:border-0 pb-2">
                <span className="text-muted-foreground">{p.label}</span>
                <span className="font-medium">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Pulsuz çatdırılma qaydası</h3>
          <p className="text-xs text-muted-foreground mb-3">Minimum səbət məbləği</p>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Min. məbləğ</Label><Input defaultValue="AZN 80" className="text-xs" /></div>
            <div><Label className="text-xs">Tətbiq zonası</Label><Input defaultValue="Bakı daxili" className="text-xs" /></div>
          </div>
          <Button size="sm" className="bg-primary text-xs mt-3 w-full">Qaydanı yenilə</Button>
        </div>
      </div>

      {/* Notification rules */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Sifariş bildiriş qaydaları</h2>
        <p className="text-xs text-muted-foreground mb-3">Hər status üçün kanal seçimi</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left pb-2 font-medium">Hadisə</th>
              <th className="text-center pb-2 font-medium">Email</th>
              <th className="text-center pb-2 font-medium">SMS</th>
              <th className="text-center pb-2 font-medium">Push</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.event} className="border-b border-border last:border-0">
                <td className="py-2">{n.event}</td>
                <td className="py-2 text-center"><Switch defaultChecked={n.email} /></td>
                <td className="py-2 text-center"><Switch defaultChecked={n.sms} /></td>
                <td className="py-2 text-center"><Switch defaultChecked={n.push} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDelivery;
