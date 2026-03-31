import Layout from '@/components/Layout';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams, Link } from 'react-router-dom';

const stages = ['Qəbul olundu', 'Anbarda', 'Kuryerə verildi', 'Rayondadır', 'Çatdırılır'];
const currentStage = 3; // 0-indexed, "Rayondadır"

const timeline = [
  { time: '17:25', title: 'Rayondadır', desc: 'Kuryer ünvanına doğru hərəkət edir.' },
  { time: '15:10', title: 'Kuryerə verildi', desc: 'Sifariş maşına yükləndi.' },
  { time: '13:48', title: 'Anbar çıxışı', desc: 'Paket çeşidlənmə mərkəzindən çıxdı.' },
  { time: '11:02', title: 'Qəbul edildi', desc: 'Sifariş təsdiqləndi.' },
];

const TrackingPage = () => {
  const { orderId } = useParams();

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="orders" onTabChange={() => {}} />

          <div className="flex-1">
            <h1 className="text-2xl font-bold">Hardadır? • {orderId}</h1>
            <p className="text-muted-foreground mt-1">Canlı izləmə, ETA və çatdırılma tarixçəsi.</p>

            {/* Active tracking */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 mt-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg">Aktiv sifariş izləmə</h2>
                  <p className="text-sm text-muted-foreground">22 Mar 2026 tarixli sifariş • 34.99₼ • 2 məhsul</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-primary/10 text-primary border-0">Yoldadır</Badge>
                  <p className="text-xs text-muted-foreground mt-1">ETA</p>
                  <p className="font-bold">Bu gün 18:00–21:00</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="mt-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-muted" />
                  <div className="absolute top-3 left-0 h-0.5 bg-primary" style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }} />
                  {stages.map((stage, i) => (
                    <div key={stage} className="relative flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        i <= currentStage
                          ? 'bg-primary border-primary'
                          : 'bg-card border-muted'
                      }`}>
                        {i <= currentStage && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={`text-xs mt-2 text-center max-w-16 ${i <= currentStage ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Map */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="font-bold mb-2">Xəritədə görünüş</h3>
                <p className="text-sm text-muted-foreground mb-4">Kuryer hazırda Xətai rayonunda görünür.</p>
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl h-64 relative overflow-hidden">
                  {/* Stylized map */}
                  <svg viewBox="0 0 400 250" className="w-full h-full">
                    <rect width="400" height="250" fill="#e8eef4" />
                    {/* Roads */}
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="0" y1="160" x2="400" y2="160" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="100" y1="0" x2="100" y2="250" stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="250" y1="0" x2="250" y2="250" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Route */}
                    <path d="M80,200 Q120,180 160,150 Q200,120 250,100 Q300,80 320,60" fill="none" stroke="hsl(207, 90%, 54%)" strokeWidth="4" strokeLinecap="round" />
                    {/* Warehouse */}
                    <circle cx="80" cy="200" r="8" fill="hsl(33, 100%, 65%)" />
                    <text x="80" y="225" textAnchor="middle" fontSize="10" fill="#64748b">Anbar</text>
                    {/* Courier */}
                    <circle cx="250" cy="100" r="8" fill="hsl(207, 90%, 54%)" />
                    <text x="250" y="92" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">Kuryer</text>
                    {/* Destination */}
                    <circle cx="320" cy="60" r="8" fill="#22c55e" />
                    <text x="320" y="50" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">Ünvan</text>
                  </svg>
                </div>
              </div>

              {/* Courier + delivery info */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                  <h3 className="font-bold">Kuryer məlumatı</h3>
                  <p className="font-semibold mt-2">Elvin • 99-AA-321</p>
                  <p className="text-sm text-muted-foreground">Mobil: +994 55 7•• •• ••</p>
                  <div className="flex gap-3 mt-4">
                    <a href="tel:+994557000000"><Button size="sm">Kuryerə zəng et</Button></a>
                    <a href="https://wa.me/994557000000" target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline">Mesaj göndər</Button></a>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                  <h3 className="font-bold">Çatdırılma detalları</h3>
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-primary font-medium">Ünvan</p>
                      <p>Bakı şəh., Nizami küç. 42, mənzil 15</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary font-medium">Qeyd</p>
                      <p>Qapı kodu 45B, lift sağ tərəfdə</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary font-medium">Ödəniş</p>
                      <p>Kartla ödənib</p>
                    </div>
                    <div>
                      <p className="text-xs text-primary font-medium">Təxmini vaxt</p>
                      <p className="font-semibold">18:00 – 21:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 mt-6">
              <h3 className="font-bold mb-4">Tarixçə</h3>
              <div className="space-y-4">
                {timeline.map((event, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                      <span className="text-sm font-medium text-muted-foreground w-12">{event.time}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link to="/hesab">
                <Button variant="outline">← Sifarişlərə qayıt</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackingPage;
