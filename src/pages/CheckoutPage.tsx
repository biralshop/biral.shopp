import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProductId } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShieldCheck, CreditCard, Banknote, Building2, Tag, Check, AlertCircle } from 'lucide-react';
import { validatePromoCode } from '@/lib/promoCodes';
import { toast } from 'sonner';
import azpostData from '@/data/azpost.json';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { orders, createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState('baku');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [postSearch, setPostSearch] = useState('');
  const [showPostOptions, setShowPostOptions] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', city: 'Bakı', postal: '', address: '', notes: '',
  });

  const exactWeight = items.reduce((acc, { product, quantity }) => acc + ((product.weight || 0.5) * quantity), 0);
  const totalVolWeight = items.reduce((acc, { product, quantity }) => {
    const w = product.width || 10;
    const l = product.length || 10;
    const h = product.height || 10;
    return acc + (((w * l * h) / 6000) * quantity);
  }, 0);
  const chargeableWeight = Math.max(exactWeight, totalVolWeight);

  const calculatePostalFee = (weightInKg: number) => {
    let base = 0;
    if (weightInKg <= 1) base = 2.00;
    else if (weightInKg <= 3) base = 3.00;
    else if (weightInKg <= 5) base = 4.00;
    else if (weightInKg <= 10) base = 6.00;
    else base = 6.00 + Math.ceil(weightInKg - 10) * 0.80;
    return base + 0.50; // 0.50 AZN yuvarlaqlaşdırma margin
  };

  const bakuFee = totalPrice >= 50 ? 0 : 5.00;
  const postFee = calculatePostalFee(chargeableWeight);

  const shipping = deliveryMethod === 'baku' ? bakuFee : postFee;
  const finalTotal = totalPrice - promoDiscount + shipping;

  const steps = [
    { label: 'Səbət', active: false },
    { label: 'Ödəniş', active: true },
    { label: 'Təsdiq', active: false },
  ];

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const result = validatePromoCode(promoCode, totalPrice);
    if (result.valid) {
      setPromoDiscount(result.discount);
      setPromoApplied(promoCode.toUpperCase().trim());
      toast.success(`Kupon tətbiq edildi! ${result.discount.toFixed(2)}₼ endirim`);
    } else {
      toast.error(result.error || 'Kupon keçərli deyil');
    }
  };

  const removePromo = () => {
    setPromoDiscount(0);
    setPromoApplied('');
    setPromoCode('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Ad, Soyad tələb olunur';
    if (!form.phone.trim()) newErrors.phone = 'Telefon tələb olunur';
    else if (!/^[\+]?[0-9\s\-]{9,}$/.test(form.phone.replace(/\s/g, ''))) newErrors.phone = 'Düzgün telefon nömrəsi daxil edin';
    if (!form.city.trim()) newErrors.city = 'Şəhər tələb olunur';
    if (!form.address.trim()) newErrors.address = 'Ünvan tələb olunur';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Səbətiniz boşdur');
      return;
    }
    if (!validate()) {
      toast.error('Xahiş edirik bütün tələb olunan sahələri doldurun');
      return;
    }

    try {
      const order = await createOrder({
        items: items.map(({ product, quantity }) => ({
          product: getProductId(product),
          title: product.title,
          price: product.price,
          image: product.image,
          quantity,
        })),
        address: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          postal: form.postal,
          address: form.address,
          notes: form.notes,
        },
        deliveryMethod,
        paymentMethod,
        subtotal: totalPrice,
        shipping,
        discount: promoDiscount,
        total: finalTotal,
        promoCode: promoApplied || undefined,
      });

      clearCart();
      navigate('/sifaris-ugurlu', { state: { orderId: order.orderNumber, orderTotal: order.total } });
    } catch (err: any) {
      toast.error(err.message || 'Sifariş yaradılarkən xəta baş verdi');
    }
  };

  if (items.length === 0) {
    return (
      <Layout showCategoryNav={false}>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Səbətiniz boşdur</h1>
          <p className="text-muted-foreground mt-2">Ödəniş etmək üçün əvvəlcə məhsul əlavə edin</p>
          <Link to="/kateqoriyalar">
            <Button className="mt-4">Məhsullara bax</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step.active || i === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {i === 0 ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && <div className="w-12 h-px bg-border" />}
            </div>
          ))}
        </div>

        {(!user?.phoneVerified && orders.length === 0) && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6 flex gap-3 items-start animate-fade-in">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">İlk Sifariş Fürsəti!</p>
              <p className="text-sm mt-1">Giriş edib nömrənizi təsdiqləyərək <strong>pulsuz çatdırılmadan</strong> yararlana bilərsiniz.</p>
              {!user && (
                <Link to="/login" className="text-amber-700 hover:text-amber-900 text-sm font-medium underline mt-1.5 inline-block">Daxil ol / Qeydiyyat</Link>
              )}
              {user && !user.phoneVerified && (
                <Link to="/hesab" className="text-amber-700 hover:text-amber-900 text-sm font-medium underline mt-1.5 inline-block">Hesaba keçib təsdiqlə</Link>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery info */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-lg font-bold mb-4">Çatdırılma məlumatları</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Ad, Soyad *</Label>
                    <Input id="name" placeholder="Ad Soyad" value={form.name} onChange={(e) => updateForm('name', e.target.value)} className={`mt-1 ${errors.name ? 'border-destructive' : ''}`} />
                    {errors.name && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input id="phone" placeholder="+994 50 XXX XX XX" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} className={`mt-1 ${errors.phone ? 'border-destructive' : ''}`} />
                    {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                  </div>
                  
                  {deliveryMethod === 'baku' ? (
                    <>
                      <div>
                        <Label htmlFor="city">Şəhər / Rayon *</Label>
                        <Input id="city" value="Bakı" readOnly className="mt-1 bg-muted font-medium" />
                      </div>
                      <div>
                        <Label htmlFor="postal">Poçt kodu (İstəyə bağlı)</Label>
                        <Input id="postal" placeholder="AZ1000" value={form.postal} onChange={(e) => updateForm('postal', e.target.value)} className="mt-1" />
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2 relative">
                      <Label htmlFor="city">Bölgə / Poçt filialını seçin *</Label>
                      <Input
                        id="city"
                        placeholder="Məs: Lənkəran, Göyçay, Zaqatala..."
                        value={postSearch}
                        onFocus={() => setShowPostOptions(true)}
                        onBlur={() => setTimeout(() => setShowPostOptions(false), 200)}
                        onChange={(e) => {
                          setPostSearch(e.target.value);
                          setShowPostOptions(true);
                          updateForm('city', '');
                          updateForm('postal', '');
                        }}
                        className={`mt-1 ${errors.city ? 'border-destructive' : ''}`}
                      />
                      {errors.city && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.city}</p>}
                      
                      {showPostOptions && postSearch && (() => {
                        const normalizeAz = (str: string) => str.toLowerCase()
                          .replace(/[əə]/g, 'e')
                          .replace(/[ıi]/g, 'i')
                          .replace(/[öo]/g, 'o')
                          .replace(/[ğg]/g, 'g')
                          .replace(/[üu]/g, 'u')
                          .replace(/[şs]/g, 's')
                          .replace(/[çc]/g, 'c');
                          
                        const searchWords = normalizeAz(postSearch).split(' ').filter(w => w.trim().length > 0);
                        const filteredOptions = azpostData.filter(p => {
                          const normalizedLabel = normalizeAz(p.label);
                          return searchWords.every(word => normalizedLabel.includes(word));
                        });

                        return (
                        <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredOptions
                            .slice(0, 20)
                            .map((p, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                                onClick={() => {
                                  setPostSearch(p.label);
                                  updateForm('city', p.region);
                                  updateForm('postal', p.zip);
                                  setShowPostOptions(false);
                                }}
                              >
                                {p.label}
                              </div>
                            ))}
                          {filteredOptions.length === 0 && (
                            <div className="px-4 py-3 text-sm text-muted-foreground">Nəticə tapılmadı...</div>
                          )}
                        </div>
                        );
                      })()}
                    </div>
                  )}

                  <div className="sm:col-span-2 mt-2">
                    <Label htmlFor="address">{deliveryMethod === 'baku' ? 'Ünvan *' : 'Poçta gələcək şəxsin ünvanı (İstəyə bağlı)'}</Label>
                    <Input id="address" placeholder="Küçə, bina, mənzil..." value={form.address} onChange={(e) => updateForm('address', e.target.value)} className={`mt-1 ${errors.address ? 'border-destructive' : ''}`} />
                    {errors.address && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Qeydlər</Label>
                    <Textarea id="notes" placeholder="Əlavə qeydlər (isteğe bağlı)" value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Delivery method */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-lg font-bold mb-4">Çatdırılma üsulu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'baku', label: 'Qapıya çatdırılma (Bakı)', desc: '1-2 iş günü', price: bakuFee === 0 ? 'Pulsuz' : `${bakuFee.toFixed(2)}₼` },
                    { key: 'post', label: 'Bölgəyə çatdırılma (Poçt)', desc: `Çəki bazası: ${chargeableWeight.toFixed(2)} kq`, price: `${postFee.toFixed(2)}₼` },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setDeliveryMethod(m.key)}
                      className={`text-left rounded-lg border-2 p-4 transition-colors ${
                        deliveryMethod === m.key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm">{m.label}</span>
                        <span className="text-sm font-medium text-primary">{m.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-lg font-bold mb-4">Ödəniş üsulu</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'card', icon: CreditCard, label: 'Kartla ödəniş' },
                    { key: 'cash', icon: Banknote, label: 'Qapıda ödəniş' },
                    { key: 'bank', icon: Building2, label: 'Bank köçürməsi' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key)}
                      className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                        paymentMethod === m.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <m.icon className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Summary */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-card rounded-lg border p-6 space-y-4">
                <h3 className="font-bold text-lg">Sifariş xülasəsi</h3>
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <p className="text-xs text-muted-foreground">x{quantity}</p>
                      </div>
                      <span className="text-sm font-medium">{(product.price * quantity).toFixed(2)}₼</span>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="border-t pt-3">
                  {promoApplied ? (
                    <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{promoApplied}</span>
                      </div>
                      <button onClick={removePromo} className="text-xs text-destructive hover:underline">Sil</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Kupon kodu"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pl-9 h-9"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyPromo())}
                        />
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleApplyPromo} className="h-9">
                        Tətbiq et
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Cəmi</span><span>{totalPrice.toFixed(2)}₼</span></div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-primary"><span>Endirim</span><span>-{promoDiscount.toFixed(2)}₼</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-muted-foreground">Çatdırılma</span><span>{shipping === 0 ? 'Pulsuz' : `${shipping}₼`}</span></div>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Yekun</span>
                  <span>{finalTotal.toFixed(2)}₼</span>
                </div>
                <Button type="submit" className="w-full font-semibold" size="lg">
                  Sifarişi tamamla
                </Button>
              </div>

              <div className="flex justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> SSL şifrələmə</span>
                <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Təhlükəsiz</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
