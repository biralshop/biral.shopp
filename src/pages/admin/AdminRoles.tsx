import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const team = [
  { name: 'Emin Həsənov', email: 'emin@biral.store', role: 'Admin', status: 'Aktiv', color: 'bg-primary' },
  { name: 'Aysel Quliyeva', email: 'aysel@biral.store', role: 'Content Manager', status: 'Aktiv', color: 'bg-green-500' },
  { name: 'Ləman Əliyeva', email: 'leman@biral.store', role: 'Logistik', status: 'Aktiv', color: 'bg-amber-500' },
  { name: 'Kamran İsmayılov', email: 'kamran@biral.store', role: 'Dəstək', status: 'Aktiv', color: 'bg-purple-500' },
  { name: 'Nigar Əhmədova', email: 'nigar@biral.store', role: 'Viewer', status: 'Deaktiv', color: 'bg-gray-400' },
];

const modules = ['Dashboard', 'Məhsullar', 'Kateqoriyalar', 'Səhifə Builder', 'Kampaniyalar', 'Müştərilər', 'Sifarişlər', 'Çatdırılma', 'Dəstək', 'Brend', 'Rollar'];
const roles = ['Admin', 'Content Manager', 'Logistik', 'Dəstək', 'Viewer'];

const permissionMatrix: Record<string, Record<string, boolean>> = {
  'Admin': Object.fromEntries(modules.map(m => [m, true])),
  'Content Manager': { 'Dashboard': true, 'Məhsullar': true, 'Kateqoriyalar': true, 'Səhifə Builder': true, 'Kampaniyalar': true, 'Müştərilər': false, 'Sifarişlər': false, 'Çatdırılma': false, 'Dəstək': false, 'Brend': true, 'Rollar': false },
  'Logistik': { 'Dashboard': true, 'Məhsullar': false, 'Kateqoriyalar': false, 'Səhifə Builder': false, 'Kampaniyalar': false, 'Müştərilər': false, 'Sifarişlər': true, 'Çatdırılma': true, 'Dəstək': false, 'Brend': false, 'Rollar': false },
  'Dəstək': { 'Dashboard': true, 'Məhsullar': false, 'Kateqoriyalar': false, 'Səhifə Builder': false, 'Kampaniyalar': false, 'Müştərilər': true, 'Sifarişlər': true, 'Çatdırılma': false, 'Dəstək': true, 'Brend': false, 'Rollar': false },
  'Viewer': { 'Dashboard': true, 'Məhsullar': false, 'Kateqoriyalar': false, 'Səhifə Builder': false, 'Kampaniyalar': false, 'Müştərilər': false, 'Sifarişlər': false, 'Çatdırılma': false, 'Dəstək': false, 'Brend': false, 'Rollar': false },
};

const auditLog = [
  { time: '11:42', user: 'Aysel', action: 'Hero banner mətni dəyişdirildi', module: 'Səhifə Builder' },
  { time: '11:05', user: 'Emin', action: 'VIP kupon yaradıldı: VIP-APRIL', module: 'Kampaniyalar' },
  { time: '10:48', user: 'Ləman', action: 'PT-249012 → Yoldadır statusu', module: 'Sifarişlər' },
  { time: '10:20', user: 'Kamran', action: 'TK-3301 ticket cavablandı', module: 'Dəstək' },
  { time: '09:55', user: 'Emin', action: 'Yeni məhsul əlavə edildi: PT-2412', module: 'Məhsullar' },
  { time: '09:30', user: 'Aysel', action: 'Kampaniya banner planlandı', module: 'Kampaniyalar' },
  { time: '09:10', user: 'Ləman', action: 'Ekspres zona tarifi yeniləndi', module: 'Çatdırılma' },
];

const approvalFlows = [
  { action: 'Qiymət dəyişikliyi > 20%', approver: 'Admin', status: 'Aktiv' },
  { action: 'Məhsul silmə', approver: 'Admin', status: 'Aktiv' },
  { action: 'Refund > AZN 100', approver: 'Admin + Logistik', status: 'Aktiv' },
  { action: 'Bulk kupon import', approver: 'Admin', status: 'Draft' },
];

const AdminRoles = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Komanda, rollar və audit jurnalı</h1>
      <p className="text-sm text-muted-foreground">Staff hesabları, icazə matrisi, approval flow və tam audit log</p>
    </div>

    <div className="grid grid-cols-3 gap-6 mb-6">
      {/* Team list */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-3">Komanda üzvləri</h2>
        <div className="space-y-2">
          {team.map((t) => (
            <div key={t.email} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`${t.color} text-white text-xs`}>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.email}</p>
              </div>
              <Badge className={`${t.status === 'Aktiv' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} border-0 text-xs`}>{t.role}</Badge>
            </div>
          ))}
        </div>
        <Button size="sm" className="bg-primary text-xs mt-3 w-full">Yeni üzv dəvət et</Button>
      </div>

      {/* Permission matrix */}
      <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm overflow-x-auto">
        <h2 className="font-bold mb-3">İcazə matrisi</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 font-medium">Modul</th>
              {roles.map((r) => <th key={r} className="text-center p-2 font-medium">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m} className="border-b border-border last:border-0">
                <td className="p-2 font-medium">{m}</td>
                {roles.map((r) => (
                  <td key={r} className="p-2 text-center">
                    <Switch defaultChecked={permissionMatrix[r]?.[m] ?? false} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      {/* Audit log */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Audit jurnalı</h2>
        <p className="text-xs text-muted-foreground mb-3">Bütün admin dəyişiklikləri izlənir</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="text-left pb-2 font-medium">Vaxt</th>
              <th className="text-left pb-2 font-medium">İstifadəçi</th>
              <th className="text-left pb-2 font-medium">Əməliyyat</th>
              <th className="text-left pb-2 font-medium">Modul</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((a, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-2 text-muted-foreground">{a.time}</td>
                <td className="py-2 font-medium">{a.user}</td>
                <td className="py-2">{a.action}</td>
                <td className="py-2"><Badge className="bg-muted text-muted-foreground border-0 text-xs">{a.module}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval flows */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-1">Təsdiq axınları</h2>
          <p className="text-xs text-muted-foreground mb-3">Həssas dəyişikliklər üçün approval qaydaları</p>
          <div className="space-y-3">
            {approvalFlows.map((f) => (
              <div key={f.action} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm font-semibold">{f.action}</p>
                  <p className="text-xs text-muted-foreground">Təsdiqləyən: {f.approver}</p>
                </div>
                <Badge className={`${f.status === 'Aktiv' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'} border-0 text-xs`}>{f.status}</Badge>
              </div>
            ))}
          </div>
          <Button size="sm" variant="ghost" className="text-primary text-xs mt-2">+ Yeni approval qaydası</Button>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h2 className="font-bold mb-2">Təsdiq jurnalı</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>PT-2403 qiymət +25% → <span className="font-semibold text-green-600">Təsdiqləndi</span></span>
              <span className="text-xs text-muted-foreground">Emin</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Refund AZN 124.70 → <span className="font-semibold text-amber-600">Gözləyir</span></span>
              <span className="text-xs text-muted-foreground">Ləman</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default AdminRoles;
