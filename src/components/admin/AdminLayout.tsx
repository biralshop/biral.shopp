import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard, Package, FolderTree, FileText, Megaphone,
  Users, ShoppingCart, Truck, HeadphonesIcon, Palette, Shield,
  Search, Bell, ExternalLink, ChevronLeft, ChevronRight, Store, BookOpen
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { key: 'products', label: 'Məhsullar', icon: Package, path: '/admin/mehsullar' },
  { key: 'categories', label: 'Kateqoriya & Menü', icon: FolderTree, path: '/admin/kateqoriyalar' },
  { key: 'pages', label: 'Səhifə Qurucusu', icon: FileText, path: '/admin/sehifeler' },
  { key: 'articles', label: 'Bloq / Məqalələr', icon: BookOpen, path: '/admin/articles' },
  { key: 'promotions', label: 'Kampaniyalar', icon: Megaphone, path: '/admin/kampaniyalar' },
  { key: 'customers', label: 'Müştərilər', icon: Users, path: '/admin/musteriler' },
  { key: 'orders', label: 'Sifarişlər', icon: ShoppingCart, path: '/admin/sifarisler' },
  { key: 'delivery', label: 'Çatdırılma & Ödəniş', icon: Truck, path: '/admin/catdirilma' },
  { key: 'support', label: 'Dəstək', icon: HeadphonesIcon, path: '/admin/destek' },
  { key: 'brand', label: 'Brend & Ayarlar', icon: Palette, path: '/admin/brend' },
  { key: 'roles', label: 'Komanda & Rollar', icon: Shield, path: '/admin/rollar' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-[#F0F4F8]">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-[72px]' : 'w-[220px]'} bg-[#0F1D2F] text-white flex flex-col transition-all duration-200 fixed h-screen z-30`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0">PT</div>
            {!collapsed && (
              <div>
                <p className="font-bold text-sm leading-tight">PraktikTap</p>
                <p className="text-[10px] text-white/50">Admin Studio • no-code</p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <div className="mt-3 bg-primary/20 rounded-lg px-3 py-1.5 text-xs">
              <Store className="inline h-3 w-3 mr-1" />
              <span className="font-medium">Mağaza: PraktikTap</span>
              <p className="text-[10px] text-white/50 mt-0.5">Canlı görünüş aktivdir</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-primary text-white font-semibold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        {!collapsed && (
          <div className="p-3 border-t border-white/10">
            <p className="text-[10px] text-white/40 mb-2">Sürətli əməliyyatlar</p>
            <Link to="/" target="_blank">
              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs mb-1.5">
                Canlı mağazanı aç
              </Button>
            </Link>
            <Button size="sm" variant="ghost" className="w-full text-white/60 hover:text-white text-xs">
              Yedəkləmə et
            </Button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#0F1D2F] border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main content */}
      <div className={`flex-1 ${collapsed ? 'ml-[72px]' : 'ml-[220px]'} transition-all duration-200`}>
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Məhsul, sifariş, kupon, istifadəçi axtar..." className="pl-9 w-80 h-9 text-sm" />
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-sm h-9" asChild>
              <Link to="/admin/mehsullar/yeni">Yeni əlavə et</Link>
            </Button>
            <Link to="/" target="_blank">
              <Button size="sm" variant="outline" className="text-primary border-primary/30 h-9 text-sm">
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Canlı preview
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary">3</Badge>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#0F1D2F] text-white text-xs font-bold">PT</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
