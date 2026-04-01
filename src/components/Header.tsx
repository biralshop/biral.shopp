import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Header = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/axtaris?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { to: '/kampaniyalar', label: 'Kampaniyalar' },
    { to: '/kateqoriyalar', label: 'Kateqoriyalar' },
    { to: '/hesab', label: 'Sifarişlər' },
  ];

  return (
    <header className="bg-background text-foreground border-b border-border sticky top-0 z-50 w-full overflow-hidden shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-full">
        <div className="flex items-center gap-2 md:gap-4 lg:gap-8 justify-between">
          {/* Mobile menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-6 mb-6 flex items-center">
                <img src="/logo-circle.png" alt="1Al Store" className="h-12 w-auto" />
              </div>
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Məhsul axtar..."
                    className="pl-10 h-10"
                  />
                </div>
              </form>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-foreground text-lg font-medium hover:text-primary">
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                {isAuthenticated ? (
                  <>
                    <Link to="/hesab" className="text-foreground hover:text-primary">Hesabım</Link>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-left text-destructive hover:underline">
                      Çıxış
                    </button>
                  </>
                ) : (
                  <Link to="/giris" className="text-primary font-medium">Daxil ol / Qeydiyyat</Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          </div>

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img src="/logo-circle.png" alt="1Al Store" className="h-10 md:h-14 w-auto" />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl px-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Məhsul axtar..."
                className="pl-10 bg-muted/60 hover:bg-muted focus:bg-background text-foreground border-transparent focus-visible:border-primary rounded-lg h-10 transition-colors"
              />
            </div>
          </form>

          {/* Right Section: Nav & Icons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto lg:ml-0">
            {/* Nav links desktop */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground/80 hover:text-primary text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Search Icon */}
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted md:hidden" onClick={() => navigate('/axtaris')}>
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {user?.firstName?.[0]}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <p className="text-sm font-semibold px-2 py-1">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground px-2 mb-2">{user?.email}</p>
                  <Link to="/hesab" className="block px-2 py-1.5 text-sm rounded hover:bg-muted">Hesabım</Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Çıxış
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link to="/giris">
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/hesab" className="relative hidden md:inline-flex">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Heart className="h-5 w-5" />
              </Button>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/sebet" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
