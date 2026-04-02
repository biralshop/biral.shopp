import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { adminAPI } from '@/lib/api';

const statusFilters = ['Hamısı', 'Gözləyir', 'Hazırlanır', 'Yoldadır', 'Çatdırılıb', 'Qaytarma', 'Ləğv'];

const statusColor: Record<string, string> = {
  'Gözləyir': 'bg-blue-100 text-blue-700',
  'Hazırlanır': 'bg-amber-100 text-amber-700',
  'Yoldadır': 'bg-primary/10 text-primary',
  'Çatdırılıb': 'bg-green-100 text-green-700',
  'Qaytarma': 'bg-red-100 text-red-600',
  'Ləğv': 'bg-gray-100 text-gray-500',
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

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllOrders()
      .then(res => setOrders(res.orders || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length,
  };

  const statusPipeline = [
    { label: 'Yeni', count: stats.pending, color: 'bg-blue-500' },
    { label: 'Hazırlanır', count: stats.processing, color: 'bg-amber-500' },
    { label: 'Yoldadır', count: stats.shipped, color: 'bg-primary' },
    { label: 'Çatdırılıb', count: stats.delivered, color: 'bg-green-500' },
    { label: 'Qaytarma', count: stats.cancelled, color: 'bg-red-500' },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
  };

  return (
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
          <p className="text-xs text-muted-foreground">
            Bütün sifarişlər, status və əməliyyatlar {loading && '(Yüklənir...)'}
          </p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left p-4 font-medium">Sifariş ID</th>
              <th className="text-left p-4 font-medium">Müştəri</th>
              <th className="text-left p-4 font-medium">Məbləğ</th>
              <th className="text-left p-4 font-medium">Ödəniş növü</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Tarix</th>
              <th className="text-left p-4 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4 font-semibold">{o.orderNumber || o._id.substring(0,8)}</td>
                <td className="p-4">
                  <p className="font-medium">{o.address?.name || o.user?.firstName || 'Bilinmir'}</p>
                  <p className="text-xs text-muted-foreground">{o.address?.phone}</p>
                </td>
                <td className="p-4 font-semibold">AZN {o.total?.toFixed(2)}</td>
                <td className="p-4 text-muted-foreground capitalize">{o.paymentMethod || 'Nağd'}</td>
                <td className="p-4">
                  <Badge className={`${statusColor[o.status] || 'bg-gray-100'} border-0 text-xs`}>
                    {getStatusLabel(o.status)}
                  </Badge>
                </td>
                <td className="p-4 text-muted-foreground">{formatDate(o.createdAt)}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Link to={`/admin/sifarisler/${o._id}`}>
                      <Button size="sm" variant="outline" className="text-xs h-7">Detallar</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center p-8 text-muted-foreground">Sifariş tapılmadı</td>
              </tr>
            )}
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
              <Button key={a} variant="outline" size="sm" className="w-full text-xs h-8 disabled:opacity-50">{a}</Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminOrders;
