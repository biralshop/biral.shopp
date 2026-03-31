import { ShoppingBag, Package, CreditCard, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useState } from 'react';
import { toast } from 'sonner';

const ProfileTab = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { orders } = useOrders();
  const { totalItems: wishlistCount } = useWishlist();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryNote: user?.deliveryNote || '',
  });

  const stats = [
    { label: 'Ümumi sifariş', value: orders.length.toString(), icon: ShoppingBag },
    { label: 'Aktiv', value: orders.filter(o => o.status === 'shipped' || o.status === 'processing').length.toString(), icon: Package },
    { label: 'Xərclənən', value: `${orders.reduce((s, o) => s + o.total, 0).toFixed(0)}₼`, icon: CreditCard },
    { label: 'Seçilənlər', value: wishlistCount.toString(), icon: Heart },
  ];

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Əvvəlcə daxil olun');
      return;
    }
    try {
      await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        deliveryNote: form.deliveryNote,
      });
      toast.success('Profil məlumatları yeniləndi!');
    } catch (err: any) {
      toast.error(err.message || 'Xəta baş verdi');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Profil</h1>
      <p className="text-muted-foreground mt-1">Şəxsi məlumatlar və hesab təhlükəsizliyi</p>

      {!isAuthenticated && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4">
          <p className="text-sm font-medium">ℹ️ Profil məlumatlarınızı saxlamaq üçün <a href="/giris" className="text-primary underline">daxil olun</a></p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border shadow-sm p-4 text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Personal info */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold">Şəxsi məlumatlar</h2>
          <p className="text-sm text-muted-foreground mb-4">Hesab məlumatlarını buradan yenilə.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-primary mb-1 block">Ad</label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-primary mb-1 block">Soyad</label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-primary mb-1 block">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-primary mb-1 block">Telefon</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-medium text-primary mb-1 block">Çatdırılma qeydi</label>
            <Input value={form.deliveryNote} onChange={(e) => setForm({ ...form, deliveryNote: e.target.value })} placeholder="Qapı kodu, lift məlumatı..." />
          </div>
          <div className="flex gap-3 mt-5">
            <Button onClick={handleSave}>Yadda saxla</Button>
            <Button variant="outline" onClick={() => toast.info('Şifrə dəyişmə formu tezliklə')}>Şifrəni dəyiş</Button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Notification preferences */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold mb-4">Bildiriş seçimləri</h3>
            <div className="space-y-3">
              {[
                { label: 'SMS bildirişləri', defaultChecked: true },
                { label: 'Email bildirişləri', defaultChecked: true },
                { label: 'Kampaniya xəbərləri', defaultChecked: false },
                { label: '1 klik checkout', defaultChecked: true },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{pref.label}</span>
                  <Switch defaultChecked={pref.defaultChecked} onCheckedChange={() => toast.success(`${pref.label} yeniləndi`)} />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold mb-3">Təhlükəsizlik</h3>
            <Badge className="bg-primary/10 text-primary border-0">Hesab aktiv</Badge>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">Hesab yaradılma tarixi</p>
              <p className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('az-AZ') : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
