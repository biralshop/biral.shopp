import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Headphones, Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'replied' | 'closed';
  createdAt: string;
  reply?: string;
}

const STORAGE_KEY = 'biralstore_tickets';

const SupportTab = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [form, setForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Mövzu və mesaj sahələrini doldurun');
      return;
    }
    const ticket: SupportTicket = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: form.subject,
      message: form.message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => [ticket, ...prev]);
    setForm({ subject: '', message: '' });
    toast.success(`Dəstək bileti yaradıldı: ${ticket.id}`);
  };

  const statusMap = {
    open: { label: 'Açıq', color: 'bg-yellow-100 text-yellow-700' },
    replied: { label: 'Cavablandı', color: 'bg-green-100 text-green-700' },
    closed: { label: 'Bağlandı', color: 'bg-muted text-muted-foreground' },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Dəstək</h1>
      <p className="text-muted-foreground mt-1">Suallarınız və problemləriniz üçün bizimlə əlaqə saxlayın</p>

      {/* Quick contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <a href="tel:+994501234567" className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-3 hover:border-primary transition-colors">
          <div className="bg-primary/10 rounded-full p-2.5"><Phone className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-sm font-semibold">Telefon</p>
            <p className="text-xs text-muted-foreground">+994 50 123 45 67</p>
          </div>
        </a>
        <a href="https://wa.me/994501234567" target="_blank" rel="noopener noreferrer" className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-3 hover:border-green-500 transition-colors">
          <div className="bg-green-100 rounded-full p-2.5"><MessageCircle className="h-5 w-5 text-green-600" /></div>
          <div>
            <p className="text-sm font-semibold">WhatsApp</p>
            <p className="text-xs text-muted-foreground">Canlı mesaj</p>
          </div>
        </a>
        <a href="mailto:destek@biralstore.az" className="bg-card rounded-xl border border-border shadow-sm p-4 flex items-center gap-3 hover:border-primary transition-colors">
          <div className="bg-primary/10 rounded-full p-2.5"><Mail className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="text-sm font-semibold">Email</p>
            <p className="text-xs text-muted-foreground">destek@biralstore.az</p>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* New ticket form */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Yeni müraciət</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Mövzu</Label>
              <Input
                placeholder="Probleminizi qısa təsvir edin"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Mesaj</Label>
              <Textarea
                placeholder="Ətraflı izah edin..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1 min-h-[120px]"
              />
            </div>
            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" /> Göndər
            </Button>
          </form>
        </div>

        {/* Tickets list */}
        <div>
          <h2 className="font-bold text-lg mb-4">Müraciətlərim</h2>
          {tickets.length === 0 ? (
            <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
              <Headphones className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground text-sm mt-3">Hələ müraciət yoxdur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-card rounded-xl border border-border shadow-sm p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{ticket.id}</span>
                    <Badge className={`${statusMap[ticket.status].color} border-0`}>
                      {statusMap[ticket.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mt-2">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(ticket.createdAt).toLocaleDateString('az-AZ')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportTab;
