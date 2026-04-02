import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TrendingUp, Gift, Tag, Percent, Search, Trash2, Plus } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const kpis = [
  { label: 'Aktiv kampaniya', value: '12', change: '+3', icon: Tag, color: 'bg-primary' },
  { label: 'Fərdi kupon', value: '186', change: '+42', icon: Percent, color: 'bg-pink-500' },
  { label: 'Hədiyyə qaydası', value: '7', change: '+1', icon: Gift, color: 'bg-green-500' },
  { label: 'Konversiya uplift', value: '14.8%', change: '+2.1%', icon: TrendingUp, color: 'bg-amber-500' },
];

const initialCampaigns = [
  { id: 1, name: 'WELCOME10', type: 'Kupon', scope: 'Yeni istifadəçilər', value: '10%', status: 'Aktiv' },
  { id: 2, name: 'VIP-APRIL', type: 'Fərdi kupon', scope: 'VIP segment', value: 'AZN 15', status: 'Aktiv' },
  { id: 3, name: 'GIFT-100', type: 'Hədiyyə', scope: 'Səbət > AZN 100', value: '1 məhsul', status: 'Aktiv' },
  { id: 4, name: '3AL2ÖDƏ', type: 'Bundle', scope: 'Seçilmiş məhsullar', value: '3 al 2 ödə', status: 'Draft' },
  { id: 5, name: 'FREESHIP', type: 'Avtomatik endirim', scope: 'Bakı daxili', value: 'Pulsuz çatdırılma', status: 'Aktiv' },
  { id: 6, name: 'RETURN-WIN', type: 'Kupon', scope: 'Təkrar alış yox 30 gün', value: '12%', status: 'Planlı' },
];

const AdminPromotions = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [discountValue, setDiscountValue] = useState('25%');
  const [maxDiscount, setMaxDiscount] = useState('15');

  // Campaigns state
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [campaignFilter, setCampaignFilter] = useState('Hamısı');
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  
  const [newCampName, setNewCampName] = useState('');
  const [newCampType, setNewCampType] = useState('Kupon');
  const [newCampScope, setNewCampScope] = useState('');
  const [newCampValue, setNewCampValue] = useState('');

  // Gift Rules state
  const [giftRules, setGiftRules] = useState([
    { id: 1, name: 'Səbət > AZN 100', gift: 'Pulsuz Çatdırılma', status: 'Aktiv' },
    { id: 2, name: 'İlk Alış', gift: 'Güzgü hədiyyə', status: 'Aktiv' },
    { id: 3, name: 'Ad günü ayı', gift: 'AZN 10 kupon endirim', status: 'Draft' },
  ]);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleGift, setNewRuleGift] = useState('');

  useEffect(() => {
    adminAPI.getAllUsers().then(res => setUsers(res.users || [])).catch(console.error);
  }, []);

  // Benefits handler
  const handleApplyBenefit = () => {
    if (!selectedUser) {
      alert('Zəhmət olmasa bir istifadəçi seçin');
      return;
    }
    const maxDesc = discountValue.includes('%') && maxDiscount ? ` (Maksimal: ${maxDiscount} ₼)` : '';
    alert(`${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.phone || selectedUser.email}) üçün ${discountValue}${maxDesc} dəyərində fərdi kampaniya təyin edildi!`);
    setSearchPhone('');
    setSelectedUser(null);
  };

  // Gift handlers
  const handleAddGiftRule = () => {
    if (!newRuleName || !newRuleGift) return;
    const newId = giftRules.length > 0 ? Math.max(...giftRules.map(r => r.id)) + 1 : 1;
    setGiftRules([...giftRules, { id: newId, name: newRuleName, gift: newRuleGift, status: 'Aktiv' }]);
    setNewRuleName('');
    setNewRuleGift('');
  };

  const handleDeleteGiftRule = (id: number) => {
    setGiftRules(giftRules.filter(r => r.id !== id));
  };

  const handleToggleGiftRule = (id: number) => {
    setGiftRules(giftRules.map(r => r.id === id ? { ...r, status: r.status === 'Aktiv' ? 'Draft' : 'Aktiv' } : r));
  };

  // Campaign handlers
  const handleAddCampaign = () => {
    if (!newCampName || !newCampScope || !newCampValue) {
      alert("Zəhmət olmasa bütün sahələri doldurun!");
      return;
    }
    const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1;
    setCampaigns([{ 
      id: newId, 
      name: newCampName, 
      type: newCampType, 
      scope: newCampScope, 
      value: newCampValue, 
      status: 'Aktiv' 
    }, ...campaigns]);
    setNewCampName('');
    setNewCampType('Kupon');
    setNewCampScope('');
    setNewCampValue('');
    setShowNewCampaignForm(false);
  };

  const handleDeleteCampaign = (id: number) => {
    if(window.confirm('Bu kampaniyanı silmək istədiyinizə əminsiniz?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };

  const filteredCampaigns = campaigns.filter(c => campaignFilter === 'Hamısı' || c.type === campaignFilter);

  const statusColor = (status: string) => {
    if (status === 'Aktiv') return 'bg-green-100 text-green-700';
    if (status === 'Draft') return 'bg-gray-100 text-gray-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Kampaniyalar, kuponlar, hədiyyə qaydaları</h1>
      <p className="text-sm text-muted-foreground">Qlobal endirim, fərdi kupon, hədiyyə və səbət qaydaları burada idarə olunur</p>
    </div>

    {/* KPIs */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className={`${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
            <kpi.icon className="h-5 w-5 text-white" />
          </div>
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          <span className="text-xs text-green-600 font-semibold">{kpi.change}</span>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-3 gap-6">
      {/* Campaign table */}
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold">Kampaniya mərkəzi</h2>
            <p className="text-xs text-muted-foreground">Kupon, hədiyyə və avtomatik endirim qaydaları</p>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {['Hamısı', 'Kupon', 'Fərdi kupon', 'Avtomatik endirim', 'Hədiyyə', 'Bundle'].map((t) => (
                <Button 
                   key={t} 
                   size="sm" 
                   variant={campaignFilter === t ? 'default' : 'outline'} 
                   className="text-xs h-7 whitespace-nowrap"
                   onClick={() => setCampaignFilter(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          
          {showNewCampaignForm && (
            <div className="p-4 bg-gray-50 border-b border-border">
              <h3 className="text-sm font-semibold mb-3">Yeni Kampaniya Yarat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1 shadow-none">Ad/Kod</p>
                  <Input placeholder="Məs: ENDİRİM20" value={newCampName} onChange={e => setNewCampName(e.target.value)} className="h-8 text-xs"/>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1 shadow-none">Növ</p>
                  <Select value={newCampType} onValueChange={setNewCampType}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kupon">Kupon</SelectItem>
                      <SelectItem value="Fərdi kupon">Fərdi kupon</SelectItem>
                      <SelectItem value="Avtomatik endirim">Avtomatik endirim</SelectItem>
                      <SelectItem value="Hədiyyə">Hədiyyə</SelectItem>
                      <SelectItem value="Bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1 shadow-none">Tətbiq Sahəsi</p>
                  <Input placeholder="Məs: Bütün sayt" value={newCampScope} onChange={e => setNewCampScope(e.target.value)} className="h-8 text-xs"/>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1 shadow-none">Dəyər</p>
                  <Input placeholder="Məs: 20%" value={newCampValue} onChange={e => setNewCampValue(e.target.value)} className="h-8 text-xs"/>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowNewCampaignForm(false)}>Ləğv et</Button>
                <Button size="sm" className="h-7 text-xs" onClick={handleAddCampaign}>Yadda Saxla</Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left p-4 font-medium">Ad</th>
                  <th className="text-left p-4 font-medium">Növ</th>
                  <th className="text-left p-4 font-medium">Tətbiq sahəsi</th>
                  <th className="text-left p-4 font-medium">Dəyər</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-semibold">{c.name}</td>
                    <td className="p-4 text-muted-foreground">{c.type}</td>
                    <td className="p-4 text-muted-foreground">{c.scope}</td>
                    <td className="p-4">{c.value}</td>
                    <td className="p-4"><Badge className={`${statusColor(c.status)} border-0 text-xs`}>{c.status}</Badge></td>
                    <td className="p-4 flex gap-1 justify-end">
                      <Button size="sm" variant="outline" className="text-xs h-7 text-primary border-primary/30">Redaktə</Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => handleDeleteCampaign(c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">Axtarışa uyğun kampaniya tapılmadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex gap-2">
            <Button size="sm" className="bg-primary text-xs" onClick={() => setShowNewCampaignForm(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Yeni kampaniya
            </Button>
            <Button size="sm" variant="outline" className="text-xs">Kupon bulk import</Button>
          </div>
        </div>
      </div>

      {/* Side panels */}
      <div className="space-y-4">
        {/* Personal Benefit Builder */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-bold mb-1">Fərdi fayda qurucusu</h3>
          <p className="text-xs text-muted-foreground mb-3">Müəyyən istifadəçiyə və ya seqmentə endirim/hədiyyə ver</p>
          
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Müştəri axtar (Nömrə və ya Adla)..." 
                className="text-xs pl-8" 
                value={searchPhone}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  setShowDropdown(true);
                  if (selectedUser) setSelectedUser(null);
                }}
              />
              {showDropdown && searchPhone.trim().length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {users.filter(u => 
                    (u.phone?.replace(/[^0-9]/g, '').includes(searchPhone.replace(/[^0-9]/g, '')) || false) || 
                    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(searchPhone.toLowerCase()))
                  ).slice(0, 5).map(u => (
                    <div 
                      key={u._id} 
                      className="px-3 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                      onClick={() => {
                        setSearchPhone(u.phone || u.email);
                        setSelectedUser(u);
                        setShowDropdown(false);
                      }}
                    >
                      <p className="text-sm font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-muted-foreground">{u.phone || 'Nömrə yoxdur'} • {u.email}</p>
                    </div>
                  ))}
                  {users.filter(u => 
                    (u.phone?.replace(/[^0-9]/g, '').includes(searchPhone.replace(/[^0-9]/g, '')) || false) || 
                    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(searchPhone.toLowerCase()))
                  ).length === 0 && (
                    <div className="px-3 py-2 text-xs text-muted-foreground">Müştəri tapılmadı</div>
                  )}
                </div>
              )}
            </div>
            
            {selectedUser && (
              <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-2 rounded-md text-xs font-medium">
                Seçilmiş: {selectedUser.firstName} {selectedUser.lastName}
              </div>
            )}
            
            {!selectedUser && (
              <Select defaultValue="vip">
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="vip">Ümumi VIP segmentə tətbiq et</SelectItem></SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><p className="text-xs text-muted-foreground mb-1">Dəyər (Məs: 25%)</p>
            <Input value={discountValue} onChange={e => setDiscountValue(e.target.value)} className="text-xs" /></div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
                <span>Max Endirim</span>
                <span className="text-[10px] text-gray-400">(Azn ilə)</span>
              </p>
              <Input 
                placeholder="Məs: 15" 
                value={maxDiscount} 
                onChange={e => setMaxDiscount(e.target.value)} 
                className="text-xs" 
                disabled={!discountValue.includes('%')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><p className="text-xs text-muted-foreground mb-1">Fayda növü</p><Input defaultValue="Kupon" className="text-xs" /></div>
            <div><p className="text-xs text-muted-foreground mb-1">Müddət</p><Input defaultValue="7 gün" className="text-xs" /></div>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between"><span className="text-xs">Yalnız 1 istifadə</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span className="text-xs">Hesabda göstər</span><Switch defaultChecked /></div>
          </div>
          <Button size="sm" className="bg-primary text-xs w-full" onClick={handleApplyBenefit}>
            Müştəriyə tətbiq et
          </Button>
        </div>

        {/* Gift Rules Manager */}
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Hədiyyə & Bonus Qaydaları</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Səbət və ya xüsusi günlər(məs: Ad günü, İlk alış) üçün dinamik qaydalar</p>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Input 
               placeholder="Qayda növü (Məs: Ad günü)" 
               className="text-xs" 
               value={newRuleName} 
               onChange={e => setNewRuleName(e.target.value)} 
            />
            <Input 
               placeholder="Veriləcək hədiyyə" 
               className="text-xs" 
               value={newRuleGift} 
               onChange={e => setNewRuleGift(e.target.value)} 
            />
          </div>
          <Button size="sm" variant="outline" className="w-full text-xs h-8 mb-4 border-dashed border-primary text-primary" onClick={handleAddGiftRule}>
            <Plus className="h-4 w-4 mr-1" />
            Yeni Qayda Əlavə Et
          </Button>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {giftRules.map((r) => (
              <div key={r.id} className="flex gap-2 items-center p-3 border border-border rounded-lg bg-gray-50 hover:bg-white transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.gift}</p>
                </div>
                <button
                  onClick={() => handleToggleGiftRule(r.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    r.status === 'Aktiv' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {r.status === 'Aktiv' ? 'Aktiv' : 'Deaktiv'}
                </button>
                <Button 
                   size="icon" 
                   variant="ghost" 
                   className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 ml-1 shrink-0"
                   onClick={() => handleDeleteGiftRule(r.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            {giftRules.length === 0 && (
               <p className="text-xs text-center text-muted-foreground py-4">Heç bir hədiyyə qaydası tapılmadı.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
)};

export default AdminPromotions;
