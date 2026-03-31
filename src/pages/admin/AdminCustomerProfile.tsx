import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const orders = [
  { id: 'PT-248571', amount: 54.90, status: 'Çatdırılıb', statusColor: 'bg-green-100 text-green-700', date: '28 Mar' },
  { id: 'PT-239847', amount: 34.90, status: 'Yoldadır', statusColor: 'bg-primary/10 text-primary', date: '22 Mar', tracking: true },
  { id: 'PT-228115', amount: 89.00, status: 'Çatdırılıb', statusColor: 'bg-green-100 text-green-700', date: '04 Mar' },
  { id: 'PT-220871', amount: 19.90, status: 'Qaytarılıb', statusColor: 'bg-red-100 text-red-600', date: '15 Feb' },
];

const benefits = [
  { label: '15% şəxsi kupon ver', desc: 'Profilində görsün və checkoutda tətbiq olunsun', color: 'bg-primary' },
  { label: 'Pulsuz çatdırılma əlavə et', desc: 'Növbəti sifariş üçün 1 dəfə', color: 'bg-green-500' },
  { label: 'Hədiyyə məhsul göndər', desc: 'Orderə əlavə et və xəbərdarlıq göndər', color: 'bg-amber-500' },
  { label: 'Bonus balans yüklə', desc: '50 bonus və ya manual məbləğ', color: 'bg-purple-500' },
  { label: 'VIP etiketi əlavə et', desc: 'Segment qaydaından asılı olmadan', color: 'bg-teal-500' },
  { label: 'Hesabı blokla', desc: 'Risk olduqda sifarişə məhdudiyyət', color: 'bg-red-500' },
];

const timeline = [
  { date: '29 Mar', text: 'Sifariş çatdırıldı, məmnuniyyət 5/5' },
  { date: '22 Mar', text: 'Yoldadır statusunda SMS göndərildi' },
  { date: '12 Mar', text: 'VIP-APRIL kuponundan istifadə etdi' },
  { date: '04 Mar', text: 'Dəstək: sürətli çatdırılma sorğusu' },
  { date: '18 Feb', text: 'Bonus balans +50 əlavə edildi' },
];

const profileInfo = [
  { label: 'Əsas ünvan', value: 'Nəsimi r., Nizami küç. 42, m.15' },
  { label: 'Ödəniş üsulu', value: 'Visa **** 4582' },
  { label: 'Sevdiyi kateqoriyalar', value: 'Mətbəx, Saxlama, Maşın' },
  { label: 'Seçilənlərdə', value: '8 məhsul' },
  { label: 'Son kupon istifadəsi', value: 'VIP-APRIL • 12 Mar' },
  { label: 'Qeyd', value: 'Sürətli çatdırılmanı üstün tutur' },
];

const AdminCustomerProfile = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Müştəri profil 360</h1>
      <p className="text-sm text-muted-foreground">Fərdi kupon, endirim, hədiyyə, bonus balans və məxfi qeydlər</p>
    </div>

    {/* Customer header */}
    <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4 mb-6">
      <Avatar className="h-14 w-14">
        <AvatarFallback className="bg-purple-500 text-white text-lg font-bold">AM</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Aysu Məmmədova</h2>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">VIP</Badge>
          <Badge className="bg-green-100 text-green-700 border-0 text-xs">Aktiv</Badge>
        </div>
        <p className="text-sm text-muted-foreground">050 312 45 67 • aysu@mail.az • Bakı</p>
      </div>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div><p className="text-xs text-muted-foreground">Ümumi xərc</p><p className="font-bold">AZN 486</p></div>
        <div><p className="text-xs text-muted-foreground">Sifariş sayı</p><p className="font-bold">12</p></div>
        <div><p className="text-xs text-muted-foreground">Bonus balans</p><p className="font-bold">250</p></div>
      </div>
      <Button size="sm" variant="outline" className="text-xs">Qeyd əlavə et</Button>
      <Button size="sm" variant="outline" className="text-xs text-primary border-primary/30">SMS göndər</Button>
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Orders + Profile */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Son sifarişlər</h3>
          <p className="text-xs text-muted-foreground mb-3">Müştərinin son alış və çatdırılma tarixi</p>
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 text-sm">
                <span className="font-semibold w-24">{o.id}</span>
                <span className="w-20">AZN {o.amount.toFixed(2)}</span>
                <Badge className={`${o.statusColor} border-0 text-xs`}>{o.status}</Badge>
                <span className="text-muted-foreground ml-auto">{o.date}</span>
                {o.tracking && <Button size="sm" variant="ghost" className="text-xs text-primary h-6">Hardadır?</Button>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Profil məlumatları</h3>
          <p className="text-xs text-muted-foreground mb-3">Ünvanlar, ödəniş üsulu, seçilən kateqoriyalar</p>
          <div className="space-y-2">
            {profileInfo.map((info) => (
              <div key={info.label} className="flex justify-between text-sm border-b border-border last:border-0 pb-2">
                <span className="text-muted-foreground">{info.label}</span>
                <span className="font-medium text-right">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h3 className="font-bold mb-1">Fərdi faydalar</h3>
        <p className="text-xs text-muted-foreground mb-3">Bu müştəriyə özəl təklif və bonuslar</p>
        <div className="space-y-3">
          {benefits.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
              <Switch />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline + Notes */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Qeydlər & timeline</h3>
          <p className="text-xs text-muted-foreground mb-3">Dəstək, satış və logistika komandası üçün</p>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div>
                  <p className="text-xs font-bold">{t.date}</p>
                  <p className="text-xs text-muted-foreground">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Yeni qeyd</h3>
          <Textarea placeholder="Müştəri qeydi əlavə et..." className="text-xs" rows={3} />
          <Button size="sm" className="bg-primary text-xs mt-2 w-full">Qeydi saxla</Button>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminCustomerProfile;
