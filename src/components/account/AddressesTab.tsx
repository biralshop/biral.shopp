import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  isDefault: boolean;
}

const STORAGE_KEY = 'biralstore_addresses';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [
        { id: '1', label: 'Ev', name: 'Kamran Məmmədov', phone: '+994 50 123 45 67', city: 'Bakı', address: 'Nizami küç. 42, mənzil 15', isDefault: true },
        { id: '2', label: 'İş', name: 'Kamran Məmmədov', phone: '+994 50 123 45 67', city: 'Bakı', address: 'Atatürk pr. 108, ofis 302', isDefault: false },
      ];
    } catch { return []; }
  });

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ label: '', name: '', phone: '', city: 'Bakı', address: '' });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const openNew = () => {
    setEditingAddress(null);
    setForm({ label: '', name: '', phone: '', city: 'Bakı', address: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setForm({ label: addr.label, name: addr.name, phone: addr.phone, city: addr.city, address: addr.address });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.label || !form.name || !form.phone || !form.address) {
      toast.error('Bütün sahələri doldurun');
      return;
    }
    if (editingAddress) {
      setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, ...form } : a));
      toast.success('Ünvan yeniləndi');
    } else {
      const newAddr: Address = { ...form, id: `addr_${Date.now()}`, isDefault: addresses.length === 0 };
      setAddresses(prev => [...prev, newAddr]);
      toast.success('Yeni ünvan əlavə edildi');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast('Ünvan silindi');
  };

  const setDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    toast.success('Əsas ünvan dəyişdirildi');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ünvanlarım</h1>
          <p className="text-muted-foreground mt-1">Çatdırılma ünvanlarını idarə et</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> Yeni ünvan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-card rounded-xl border-2 shadow-sm p-5 ${addr.isDefault ? 'border-primary' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{addr.label}</span>
                {addr.isDefault && <Badge className="bg-primary/10 text-primary border-0 text-xs">Əsas</Badge>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(addr)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(addr.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
              </div>
            </div>
            <p className="text-sm font-medium">{addr.name}</p>
            <p className="text-sm text-muted-foreground">{addr.phone}</p>
            <p className="text-sm text-muted-foreground mt-1">{addr.city}, {addr.address}</p>
            {!addr.isDefault && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setDefault(addr.id)}>
                Əsas et
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Ünvanı redaktə et' : 'Yeni ünvan əlavə et'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Ünvan adı (Ev, İş, ...)</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1" placeholder="Ev" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ad, Soyad</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Şəhər</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Ünvan</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" placeholder="Küçə, bina, mənzil" />
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingAddress ? 'Yenilə' : 'Əlavə et'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressesTab;
