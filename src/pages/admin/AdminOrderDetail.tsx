import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, User, ArrowLeft, Loader2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const statusColor: Record<string, string> = {
  'pending': 'bg-blue-100 text-blue-700',
  'processing': 'bg-amber-100 text-amber-700',
  'shipped': 'bg-primary/10 text-primary',
  'delivered': 'bg-green-100 text-green-700',
  'returned': 'bg-red-100 text-red-600',
  'cancelled': 'bg-gray-100 text-gray-500',
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Gözləyir',
    processing: 'Hazırlanır',
    shipped: 'Yoldadır',
    delivered: 'Çatdırılıb',
    returned: 'Geri qaytarılıb',
    cancelled: 'Ləğv Edilib'
  };
  return map[status] || status;
};

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminAPI.getAllOrders()
      .then(res => {
        const found = res.orders?.find((o: any) => o._id === id || o.orderNumber === id);
        setOrder(found);
        if (found) setStatus(found.status);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || status === order.status) return;
    try {
      setSaving(true);
      await adminAPI.updateOrderStatus(order._id, status);
      setOrder({ ...order, status, statusLabel: getStatusLabel(status) });
      alert('Status yeniləndi!');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bu sifarişi ləğv etmək istədiyinizə əminsiniz?')) return;
    try {
      setSaving(true);
      await adminAPI.updateOrderStatus(order._id, 'cancelled');
      setOrder({ ...order, status: 'cancelled', statusLabel: getStatusLabel('cancelled') });
      setStatus('cancelled');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="p-8 text-center">Yüklənir...</div></AdminLayout>;
  if (!order) return <AdminLayout><div className="p-8 text-center text-red-500">Sifariş tapılmadı</div></AdminLayout>;

  return (
  <AdminLayout>
    <div className="mb-6 flex items-center gap-3">
      <Link to="/admin/sifarisler"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Sifariş detalı: {order.orderNumber || order._id}</h1>
          <Badge className={`${statusColor[order.status] || 'bg-gray-100'} border-0`}>{getStatusLabel(order.status)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString('az-AZ')} • {order.address?.name}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeline & details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-3">Sifariş tərkibi & Məbləğ</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left pb-2 font-medium">Məhsul</th>
                <th className="text-left pb-2 font-medium">Say</th>
                <th className="text-left pb-2 font-medium">Qiymət</th>
                <th className="text-left pb-2 font-medium">Cəm</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                       {(item.product?.images && item.product.images[0]) && (
                         <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                       )}
                    </div>
                    <span>{item.name || item.product?.title || 'Bilinməyən məhsul'}</span>
                  </td>
                  <td className="py-3">{item.quantity} rulo/əd</td>
                  <td className="py-3">AZN {item.price?.toFixed(2)}</td>
                  <td className="py-3 font-semibold">AZN {(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end mt-3 pt-3 border-t border-border">
            <div className="text-right">
              <p className="text-sm text-muted-foreground flex justify-between w-48"><span className="text-left w-20">Məhsullar:</span> <span className="font-bold text-foreground">AZN {order.subtotal?.toFixed(2)}</span></p>
              <p className="text-sm text-muted-foreground flex justify-between w-48"><span className="text-left w-20">Çatdırılma:</span> <span className="font-bold text-foreground">AZN {order.shipping?.toFixed(2) || '0.00'}</span></p>
              {order.discount > 0 && <p className="text-sm text-green-600 flex justify-between w-48"><span className="text-left w-20">Endirim:</span> <span className="font-bold">- AZN {order.discount?.toFixed(2)}</span></p>}
              <p className="text-lg font-bold text-primary mt-2 pt-2 border-t flex justify-between w-48"><span className="text-left w-20">Ümumi:</span> <span>AZN {order.total?.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Müştəri məlumatı</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{order.address?.name || order.user?.firstName}</p>
              <p className="text-xs text-muted-foreground">{order.address?.phone || '-'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-3">Çatdırılma detalları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col"><span className="text-xs text-muted-foreground">Ünvan</span><span className="font-medium">{order.address?.address || '-'}</span></div>
            <div className="flex flex-col"><span className="text-xs text-muted-foreground">Çatdırılma</span><span className="capitalize font-medium">{order.deliveryMethod || 'standart'}</span></div>
            <div className="flex flex-col"><span className="text-xs text-muted-foreground">Ödəniş forması</span><span className="capitalize font-medium">{order.paymentMethod || 'cash'}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm border-l-4 border-l-primary">
          <h3 className="font-bold mb-3">Admin əməliyyatları</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold mb-1 block">Statusu dəyiş:</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="text-sm">
                   <SelectValue placeholder="Status seçin" />
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="pending">Gözləyir</SelectItem>
                   <SelectItem value="processing">Hazırlanır</SelectItem>
                   <SelectItem value="shipped">Yoldadır</SelectItem>
                   <SelectItem value="delivered">Çatdırılıb</SelectItem>
                   <SelectItem value="cancelled">Ləğv Edilib</SelectItem>
                   <SelectItem value="returned">Qaytarılıb</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button size="sm" className="w-full bg-primary text-sm font-semibold" onClick={handleStatusUpdate} disabled={saving || status === order.status}>
               {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Statusu Yadda Saxla'}
            </Button>
            
            {order.status !== 'cancelled' && (
              <Button size="sm" variant="outline" className="w-full text-xs text-red-500 border-red-200 mt-2" onClick={handleCancelOrder} disabled={saving}>
                Sifarişi ləğv et
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminOrderDetail;
