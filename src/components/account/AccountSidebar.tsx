import { User, ShoppingBag, Heart, MapPin, CreditCard, Headphones, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const sidebarItems = [
  { key: 'profile', icon: User, label: 'Profil' },
  { key: 'orders', icon: ShoppingBag, label: 'Sifarişlər' },
  { key: 'wishlist', icon: Heart, label: 'Seçilənlər' },
  { key: 'addresses', icon: MapPin, label: 'Ünvanlar' },
  { key: 'payment', icon: CreditCard, label: 'Ödəniş üsulları' },
  { key: 'support', icon: Headphones, label: 'Dəstək' },
] as const;

export type AccountTab = typeof sidebarItems[number]['key'];

interface AccountSidebarProps {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
}

const AccountSidebar = ({ activeTab, onTabChange }: AccountSidebarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Hesabdan çıxış edildi');
    navigate('/');
  };

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="bg-card rounded-xl border border-border shadow-sm p-5">
        <div className="text-center mb-4 pb-4 border-b border-border">
          {isAuthenticated && user ? (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-xl font-bold text-primary">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <p className="font-semibold mt-3 text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <Badge className="bg-green-100 text-green-700 border-0 text-[10px] mt-1.5">Aktiv</Badge>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold mt-3 text-sm">Qonaq</p>
              <button
                onClick={() => navigate('/giris')}
                className="text-xs text-primary hover:underline mt-1"
              >
                Daxil ol / Qeydiyyat
              </button>
            </>
          )}
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2"
            >
              <LogOut className="h-4 w-4" />
              Çıxış
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
