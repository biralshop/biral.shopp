import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PaymentCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  isDefault: boolean;
  brand: string;
}

const STORAGE_KEY = 'biralstore_cards';

const detectBrand = (num: string): string => {
  if (num.startsWith('4')) return 'Visa';
  if (num.startsWith('5')) return 'Mastercard';
  return 'Kart';
};

const PaymentTab = () => {
  const [cards, setCards] = useState<PaymentCard[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  const handleAdd = () => {
    if (!form.cardNumber || !form.cardHolder || !form.expiry) {
      toast.error('Bütün sahələri doldurun');
      return;
    }
    if (form.cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Kart nömrəsi 16 rəqəm olmalıdır');
      return;
    }
    const newCard: PaymentCard = {
      id: `card_${Date.now()}`,
      cardNumber: form.cardNumber.replace(/\s/g, ''),
      cardHolder: form.cardHolder,
      expiry: form.expiry,
      isDefault: cards.length === 0,
      brand: detectBrand(form.cardNumber),
    };
    setCards(prev => [...prev, newCard]);
    toast.success('Kart əlavə edildi');
    setForm({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    toast('Kart silindi');
  };

  const setDefault = (id: string) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    toast.success('Əsas kart dəyişdirildi');
  };

  const maskCard = (num: string) => `•••• •••• •••• ${num.slice(-4)}`;

  const formatCardInput = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryInput = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
    return v;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ödəniş üsulları</h1>
          <p className="text-muted-foreground mt-1">Kartlarını idarə et, yeni kart əlavə et</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Yeni kart
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mt-4">Hələ kart əlavə olunmayıb</h3>
          <p className="text-muted-foreground text-sm mt-1">Sürətli ödəniş üçün kartınızı əlavə edin</p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Kart əlavə et</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {cards.map((card) => (
            <div key={card.id} className={`rounded-xl border-2 p-5 ${card.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm">{card.brand}</span>
                  {card.isDefault && <Badge className="bg-primary/10 text-primary border-0 text-xs">Əsas</Badge>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(card.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
              <p className="text-lg font-mono font-medium tracking-wider">{maskCard(card.cardNumber)}</p>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{card.cardHolder}</span>
                <span>{card.expiry}</span>
              </div>
              {!card.isDefault && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setDefault(card.id)}>
                  Əsas et
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mt-6 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        <span>Kart məlumatlarınız təhlükəsiz şəkildə şifrələnir</span>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni kart əlavə et</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Kart nömrəsi</Label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={form.cardNumber}
                onChange={(e) => setForm({ ...form, cardNumber: formatCardInput(e.target.value) })}
                className="mt-1 font-mono"
                maxLength={19}
              />
            </div>
            <div>
              <Label>Kart sahibinin adı</Label>
              <Input
                placeholder="AD SOYAD"
                value={form.cardHolder}
                onChange={(e) => setForm({ ...form, cardHolder: e.target.value.toUpperCase() })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Son istifadə tarixi</Label>
                <Input
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: formatExpiryInput(e.target.value) })}
                  className="mt-1"
                  maxLength={5}
                />
              </div>
              <div>
                <Label>CVV</Label>
                <Input
                  type="password"
                  placeholder="•••"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  className="mt-1"
                  maxLength={3}
                />
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full">Kartı əlavə et</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentTab;
