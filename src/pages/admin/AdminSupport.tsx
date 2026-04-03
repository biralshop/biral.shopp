import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const tickets = [
  { id: 'TK-3301', customer: 'Aysu Məmmədova', topic: 'Gecikən sifariş', channel: 'WhatsApp', status: 'Açıq', priority: 'Yüksək', date: 'Bu gün' },
  { id: 'TK-3287', customer: 'Murad Əliyev', topic: 'Qaytarma sorğusu', channel: 'Email', status: 'Cavablandı', priority: 'Orta', date: 'Dünən' },
  { id: 'TK-3265', customer: 'Nərmin Həsənli', topic: 'Kartdan iki dəfə çıxıldı', channel: 'Canlı çat', status: 'Gözləyir', priority: 'Yüksək', date: '24 Mar' },
  { id: 'TK-3240', customer: 'Rəşad Quliyev', topic: 'Məhsul defektli gəldi', channel: 'Email', status: 'Bağlandı', priority: 'Aşağı', date: '22 Mar' },
  { id: 'TK-3218', customer: 'Lalə Məlikova', topic: 'Ünvan dəyişikliyi', channel: 'WhatsApp', status: 'Bağlandı', priority: 'Aşağı', date: '19 Mar' },
];

const statusColor: Record<string, string> = {
  'Açıq': 'bg-red-100 text-red-700',
  'Cavablandı': 'bg-green-100 text-green-700',
  'Gözləyir': 'bg-amber-100 text-amber-700',
  'Bağlandı': 'bg-gray-100 text-gray-500',
};

const priorityColor: Record<string, string> = {
  'Yüksək': 'bg-red-100 text-red-700',
  'Orta': 'bg-amber-100 text-amber-700',
  'Aşağı': 'bg-gray-100 text-gray-500',
};

const faqs = [
  { q: 'Çatdırılma neçə gün çəkir?', a: 'Bakı daxili 1-2 iş günü, regionlara 3-5 iş günü.' },
  { q: 'Qaytarma necə işləyir?', a: '14 gün ərzində qaytarma mümkündür.' },
  { q: 'Qapıda POS varmı?', a: 'Bəli, POS terminal ilə qapıda kart ödənişi mümkündür.' },
];

const savedReplies = [
  { title: 'Gecikən sifariş', preview: 'Hörmətli müştəri, sifarişiniz hazırda yoldadır...' },
  { title: 'Qaytarma təlimatı', preview: 'Qaytarma prosesi üçün zəhmət olmasa...' },
  { title: 'Ödəniş problemi', preview: 'Ödəniş ilə bağlı narahatlığınız üçün üzr istəyirik...' },
];

const channels = [
  { name: 'Email', enabled: true, desc: 'support@biral.store' },
  { name: 'WhatsApp', enabled: true, desc: '+994 55 200 10 10' },
  { name: 'SMS', enabled: true, desc: 'Bildiriş kanalı' },
  { name: 'Push notification', enabled: false, desc: 'Mobil tətbiq' },
];

const AdminSupport = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dəstək, FAQ və bildiriş mərkəzi</h1>
        <p className="text-sm text-muted-foreground">Ticket queue, hazır cavablar, FAQ, omnichannel və notification şablonları</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Ticket table */}
        <div className="col-span-2 bg-white rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold">Ticket siyahısı</h2>
            <p className="text-xs text-muted-foreground">Bütün müştəri sorğuları</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Müştəri</th>
                <th className="text-left p-4 font-medium">Mövzu</th>
                <th className="text-left p-4 font-medium">Kanal</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Prioritet</th>
                <th className="text-left p-4 font-medium">Tarix</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-semibold">{t.id}</td>
                  <td className="p-4">{t.customer}</td>
                  <td className="p-4">{t.topic}</td>
                  <td className="p-4 text-muted-foreground">{t.channel}</td>
                  <td className="p-4"><Badge className={`${statusColor[t.status]} border-0 text-xs`}>{t.status}</Badge></td>
                  <td className="p-4"><Badge className={`${priorityColor[t.priority]} border-0 text-xs`}>{t.priority}</Badge></td>
                  <td className="p-4 text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          {/* FAQ */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">FAQ & hazır cavablar</h3>
              <Button size="sm" variant="ghost" className="text-primary text-xs h-7"><Plus className="h-3 w-3 mr-1" />Yeni</Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Ən çox soruşulanları idarə et</p>
            <div className="space-y-2 mb-4">
              {faqs.map((faq, i) => (
                <button
                  key={faq.q}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-2.5 border border-border rounded-lg hover:bg-muted/50"
                >
                  <p className="text-sm font-medium">{faq.q}</p>
                  {openFaq === i && <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>}
                </button>
              ))}
            </div>

            <h4 className="text-xs font-semibold mb-2">Hazır cavab şablonları</h4>
            <div className="space-y-2">
              {savedReplies.map((r) => (
                <div key={r.title} className="p-2.5 border border-border rounded-lg">
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <h3 className="font-bold mb-3">Bildiriş kanalları</h3>
            <div className="space-y-3">
              {channels.map((ch) => (
                <div key={ch.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{ch.name}</p>
                    <p className="text-xs text-muted-foreground">{ch.desc}</p>
                  </div>
                  <Switch defaultChecked={ch.enabled} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
