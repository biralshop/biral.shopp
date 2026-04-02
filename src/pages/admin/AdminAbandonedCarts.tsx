import { useState, useEffect } from 'react';
import { articlesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageCircle, Clock, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AbandonedCart {
  type: 'user' | 'guest';
  _id: string;
  name: string;
  phone: string;
  email: string;
  items: any[];
  lastUpdate: string;
}

const AdminAbandonedCarts = () => {
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarts = async () => {
    try {
      const token = localStorage.getItem('biralstore_token');
      const res = await fetch(`${API_URL}/cart/abandoned`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.abandoned) setCarts(data.abandoned);
    } catch (err) {
      toast.error('Məlumatları yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const handleWhatsApp = (cart: AbandonedCart) => {
    const phone = cart.phone.replace(/\D/g, '');
    const itemsList = cart.items.map(i => `- ${i.productTitle} (${i.quantity} ədəd)`).join('%0A');
    const total = cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2);
    
    const message = `Salam ${cart.name},%0A%0ABiral.store-da yarımçıq qalmış bir səbətiniz var.%0A%0AMəhsullar:%0A${itemsList}%0A%0ACəmi məbləğ: ${total} AZN%0A%0AAlış-verişi tamamlamaq istərdinizmi? Sizə kömək edə bilərik?`;
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} dəqiqə əvvəl`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} saat əvvəl`;
    return date.toLocaleDateString('az-AZ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Tərk Edilmiş Səbətlər
          </h1>
          <p className="text-muted-foreground">Müştərilərin tamamlamadığı səbətləri izləyin və geri qazanın.</p>
        </div>
        <Button onClick={fetchCarts} variant="outline" size="sm">Yenilə</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : carts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="h-40 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
            Hazırda tərk edilmiş səbət tapılmadı.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carts.map((cart) => (
            <Card key={cart._id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10">
              <CardHeader className="bg-muted/30 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">{cart.name}</CardTitle>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatDate(cart.lastUpdate)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={cart.type === 'user' ? 'default' : 'outline'} className="text-[10px] h-5">
                    {cart.type === 'user' ? 'Qeydiyyatlı' : 'Qonaq'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Səbət Tərkibi</p>
                  <div className="max-h-24 overflow-y-auto space-y-1 pr-2 thin-scrollbar">
                    {cart.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs items-center py-1 border-b border-border/50 last:border-0">
                        <span className="truncate flex-1 mr-2">{item.productTitle}</span>
                        <span className="font-bold shrink-0">{item.quantity} x {item.price} ₼</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-dashed">
                  <span className="text-xs text-muted-foreground">Potensial qazanc:</span>
                  <span className="text-sm font-bold text-primary">
                    {cart.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)} ₼
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    onClick={() => handleWhatsApp(cart)}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex gap-2 h-9 text-xs"
                    disabled={!cart.phone}
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp ilə xatırlat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAbandonedCarts;
