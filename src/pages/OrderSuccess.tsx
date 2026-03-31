import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Home, Copy } from 'lucide-react';
import { toast } from 'sonner';

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state as { orderId?: string; orderTotal?: number } | null;
  const orderNumber = state?.orderId || `PT-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderTotal = state?.orderTotal;

  const timeline = [
    { icon: CheckCircle, label: 'Sifariş qəbul edildi', active: true },
    { icon: Package, label: 'Hazırlanır', active: false },
    { icon: Truck, label: 'Yoldadır', active: false },
    { icon: Home, label: 'Çatdırıldı', active: false },
  ];

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success('Sifariş nömrəsi kopyalandı!');
  };

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        {/* Confirmation Hero */}
        <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-6">Sifarişiniz uğurla qəbul edildi!</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-muted-foreground">
            Sifariş nömrəsi: <span className="font-semibold text-foreground">{orderNumber}</span>
          </p>
          <button onClick={copyOrderNumber} className="text-muted-foreground hover:text-primary transition-colors">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Təsdiq mesajı telefon nömrənizə göndərildi</p>

        {/* Timeline */}
        <div className="flex items-center justify-center gap-0 mt-10">
          {timeline.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`text-[11px] mt-2 font-medium ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {i < timeline.length - 1 && (
                <div className={`w-12 md:w-20 h-0.5 mb-6 ${step.active ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-card rounded-lg border p-6 mt-10 text-left">
          <h3 className="font-bold mb-3">Sifariş detalları</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Sifariş nömrəsi</span><span className="font-medium">{orderNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tarix</span><span className="font-medium">{new Date().toLocaleDateString('az-AZ')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Çatdırılma</span><span className="font-medium">1-2 iş günü</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ödəniş</span><span className="font-medium">Kartla ödəniş</span></div>
            {orderTotal && (
              <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold">Yekun məbləğ</span><span className="font-bold text-primary">{orderTotal.toFixed(2)}₼</span></div>
            )}
          </div>
        </div>

        {/* WhatsApp support */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 text-left">
          <p className="text-sm font-medium text-green-800">📱 WhatsApp ilə əlaqə</p>
          <p className="text-xs text-green-700 mt-1">Sifariş haqqında sualınız varsa, WhatsApp ilə bizimlə əlaqə saxlayın</p>
          <a
            href={`https://wa.me/994501234567?text=Salam! ${orderNumber} nömrəli sifarişim haqqında məlumat almaq istəyirəm.`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
              WhatsApp-a yaz
            </Button>
          </a>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link to="/hesab">
            <Button variant="outline">Sifarişi izlə</Button>
          </Link>
          <Link to="/kateqoriyalar">
            <Button className="font-semibold">Alış-verişə davam et</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
