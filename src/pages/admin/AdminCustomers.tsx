import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const segments = ['Hamısı', 'Aktiv', 'Bloklanmış'];

const AdminCustomers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Hamısı');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    adminAPI.getAllUsers()
      .then(res => setUsers(res.users || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    const action = isBlocked ? 'Aktivləşdirmək' : 'Bloklamaq';
    if (!window.confirm(`Bu istifadəçini ${action} istədiyinizə əminsiniz?`)) return;
    try {
      const newStatus = isBlocked ? 'active' : 'blocked';
      await adminAPI.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
    } catch (err) {
      alert('Xəta baş verdi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu istifadəçini həmişəlik silmək istədiyinizə əminsiniz? (Qaytarmaq mümkün deyil)')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Silinmə zamanı xəta baş verdi');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'Aktiv') return !u.isBlocked;
    if (filter === 'Bloklanmış') return u.isBlocked;
    return true; // Hamısı
  });

  return (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Müştərilər və İdarəetmə</h1>
      <p className="text-sm text-muted-foreground">İstifadəçilərin profilləri, hüquqları və bloklanması</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer list */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
        <h2 className="font-bold mb-1">Müştəri bazası</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Sistemdə olan bütün istifadəçilər {loading && '(Yüklənir...)'}
        </p>
        <div className="flex gap-2 mb-4">
          {segments.map((s, i) => (
            <Button 
               key={s} 
               onClick={() => setFilter(s)}
               size="sm" 
               variant={filter === s ? 'default' : 'outline'} 
               className="text-xs h-7"
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          {filteredUsers.map((u) => {
            const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Bilinməyən İstifadəçi';
            const initials = name.substring(0, 2).toUpperCase();
            const color = u.isBlocked ? 'bg-red-500' : 'bg-primary';

            return (
            <div key={u._id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-lg hover:bg-muted/30 border border-border">
              <Avatar className="h-9 w-9">
                <AvatarFallback className={`${color} text-white text-xs`}>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{u.email} {u.phone ? `• ${u.phone}` : ''}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border-0 text-xs`}>
                  {u.isBlocked ? 'Bloklanmış' : 'Aktiv'}
                </Badge>
                <Button 
                   onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                   size="sm" 
                   variant={u.isBlocked ? 'default' : 'outline'} 
                   className={`text-xs h-7 ${!u.isBlocked ? 'text-amber-500 border-amber-200 hover:bg-amber-50' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {u.isBlocked ? 'Aç' : 'Blokla'}
                </Button>
                <Button 
                   onClick={() => handleDelete(u._id)}
                   size="icon" 
                   variant="outline" 
                   className="h-7 w-7 text-red-500 border-red-200 hover:bg-red-50"
                  title="Tamamilə Sil"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )})}
          
          {filteredUsers.length === 0 && !loading && (
             <div className="text-center p-8 text-muted-foreground text-sm border border-dashed rounded-lg">İstifadəçi tapılmadı</div>
          )}
        </div>
      </div>

      {/* Side panels */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-border p-5 shadow-sm border-l-4 border-l-primary">
          <h3 className="font-bold mb-1">Sistem İdarəetməsi</h3>
          <p className="text-xs text-muted-foreground mb-3">Təhlükəsizlik və tənzimləmələr</p>
          <div className="space-y-3">
             <p className="text-sm">• Bloklanmış istifadəçilər sistemə daxil ola və sifariş verə bilməzlər.</p>
             <p className="text-sm">• Yeni qeydiyyatlar avtomatik Aktiv olaraq təyin edilir.</p>
             <p className="text-sm">• Bloklanma anında istifadəçinin bütün açıq seansları (gələcək versiyada) ləğv ediləcək.</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminCustomers;
