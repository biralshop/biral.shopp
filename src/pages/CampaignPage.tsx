import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { getViralProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Percent, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const CampaignPage = () => {
  const viralProducts = getViralProducts();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 23, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1 mb-4">
            <Percent className="h-4 w-4 mr-1" /> Məhdud müddətli
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mt-2">Böyük Yaz Kampaniyası</h1>
          <p className="text-primary-foreground/80 mt-3 text-lg">Seçilmiş məhsullarda 30%-ə qədər endirim</p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <Timer className="h-5 w-5" />
            <span className="text-sm">Bitmə vaxtı:</span>
            {[
              { val: pad(timeLeft.hours), label: 'saat' },
              { val: pad(timeLeft.minutes), label: 'dəq' },
              { val: pad(timeLeft.seconds), label: 'san' },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <div className="bg-primary-foreground/20 rounded-lg px-3 py-2 text-2xl font-bold tabular-nums">
                  {t.val}
                </div>
                <span className="text-[10px] text-primary-foreground/60 mt-1">{t.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => document.getElementById('campaign-products')?.scrollIntoView({ behavior: 'smooth' })}>
              Kampaniyaya bax
            </Button>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold" onClick={() => { navigator.clipboard.writeText('PRAKTIK10'); toast.success('PRAKTIK10 kupon kodu kopyalandı! Checkout-da istifadə edin.'); }}>
              Kuponu götür
            </Button>
          </div>
        </div>
      </section>

      {/* Coupon */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-card rounded-xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
          <div>
            <p className="text-sm text-muted-foreground">Endirim kuponu</p>
            <p className="text-2xl font-bold tracking-wider mt-1">PRAKTIK10</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText('PRAKTIK10');
              toast.success('Kupon kodu kopyalandı!');
            }}
          >
            <Copy className="h-4 w-4 mr-1" /> Kopyala
          </Button>
        </div>
      </div>

      {/* Products */}
      <section className="container mx-auto px-4 mt-12">
        <h2 id="campaign-products" className="text-xl font-bold mb-6">Kampaniya Məhsulları</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {viralProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Bundle section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-primary/5 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold">Paket Endirimi 🎁</h2>
          <p className="text-muted-foreground mt-2">3 məhsul al, ən ucuzunu pulsuz qazan!</p>
          <Button className="mt-4 font-semibold">Paketləri gör</Button>
        </div>
      </section>
    </Layout>
  );
};

export default CampaignPage;
