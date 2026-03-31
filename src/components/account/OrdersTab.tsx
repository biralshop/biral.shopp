import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ShoppingBag, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from 'sonner';

const filterTabs = ['Hamısı', 'Yoldadır', 'Çatdırılıb', 'Qaytarma'];

const statusColorMap: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
};

const OrdersTab = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [activeFilter, setActiveFilter] = useState('Hamısı');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'Hamısı') return true;
    if (activeFilter === 'Yoldadır') return o.status === 'shipped' || o.status === 'processing';
    if (activeFilter === 'Çatdırılıb') return o.status === 'delivered';
    if (activeFilter === 'Qaytarma') return o.status === 'returned';
    return true;
  });

  const activeDelivery = orders.find((o) => o.status === 'shipped' || o.status === 'processing');

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Sifarişlərim</h1>
        <p className="text-muted-foreground mt-1">Bütün sifarişlərini, statusları və təkrar alışları idarə et.</p>
        <div className="text-center py-16">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mt-4">Hələ sifariş yoxdur</h3>
          <p className="text-muted-foreground text-sm mt-1">İlk sifarişinizi verin!</p>
          <Link to="/kateqoriyalar">
            <Button className="mt-4">Məhsullara bax</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Sifarişlərim</h1>
      <p className="text-muted-foreground mt-1">Bütün sifarişlərini, statusları və təkrar alışları idarə et.</p>

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <div className="flex gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <Input
            placeholder="Sifariş nömrəsi ilə axtar"
            className="w-56"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Orders table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold">Bütün sifarişlər ({filteredOrders.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-4 font-medium">Sifariş</th>
                  <th className="text-left p-4 font-medium">Tarix</th>
                  <th className="text-left p-4 font-medium">Məbləğ</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} məhsul</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                    </td>
                    <td className="p-4 font-medium">{order.total.toFixed(2)}₼</td>
                    <td className="p-4">
                      <Badge className={`${statusColorMap[order.status] || ''} border-0`}>
                        {order.statusLabel}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {(order.status === 'shipped' || order.status === 'processing') ? (
                        <Link to={`/hesab/hardadir/${order.id}`}>
                          <Button size="sm" variant="outline" className="text-accent border-accent hover:bg-accent/10">
                            <MapPin className="h-3 w-3 mr-1" />
                            Hardadır?
                          </Button>
                        </Link>
                      ) : order.status === 'delivered' ? (
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`${order.id} təkrar sifariş tezliklə`)}>
                          Yenidən
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => toast.info('Detal səhifəsi tezliklə')}>
                          Detallar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active delivery sidebar */}
        <div className="space-y-6">
          {activeDelivery && (
            <div className="bg-card rounded-xl border border-border shadow-sm p-5">
              <h3 className="font-bold">Aktiv çatdırılma</h3>
              <p className="text-sm text-muted-foreground mt-1">{activeDelivery.id} • Bu gün 18:00–21:00</p>
              <Badge className="bg-primary/10 text-primary border-0 mt-2">{activeDelivery.statusLabel}</Badge>
              <div className="mt-4 space-y-2">
                {['Qəbul olundu', 'Hazırlanır', 'Kuryerə verildi', 'Rayondadır'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${i < 3 ? 'bg-primary' : 'bg-muted'}`} />
                    <span className={`text-sm ${i < 3 ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                  </div>
                ))}
              </div>
              <Link to={`/hesab/hardadir/${activeDelivery.id}`}>
                <Button className="w-full mt-4">Xəritədə izlə</Button>
              </Link>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold mb-3">Tez əməliyyatlar</h3>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => toast.info('Qaytarma formu tezliklə')}>Qaytarma başlat</Button>
              <Button variant="outline" className="w-full" onClick={() => toast.info('Faktura PDF tezliklə')}>Fakturanı yüklə</Button>
              <Button variant="outline" className="w-full" onClick={() => toast.info('Dəstək formu açılacaq')}>Dəstəyə yaz</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
