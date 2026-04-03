import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, LogOut, GiftIcon, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';

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
        <div className="flex items-center gap-4 justify-between w-full">
          {/* Left Section: Mobile Menu + Logo */}
          <div className="flex items-center gap-4 md:flex-1 shrink-0">
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
                <Link 
                  to="/blog" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted font-medium transition-colors border border-transparent"
                >
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <span>Faydalı Məqalələr / Bloq</span>
                </Link>

                <div className="h-px bg-border my-2" />
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

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center relative group">
            <img src="/logo-circle.png" alt="1Al Store" className="h-10 md:h-14 w-auto relative z-10" />
            
            {/* The Header Bot (Between Logo and Search) */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="hidden md:block absolute -right-12 bottom-0 w-20 h-20 pointer-events-none z-0"
            >
              <motion.img 
                src="/biralbot-sales.png" 
                alt="Biral Bot"
                className="w-full h-full object-contain"
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  y: [0, -2, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium ml-12">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">Ana səhifə</Link>
            <Link to="/kateqoriyalar" className="text-foreground/80 hover:text-primary transition-colors">Kateqoriyalar</Link>
            <Link to="/kampaniyalar" className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-1">
              Kampaniyalar <GiftIcon className="w-4 h-4 text-primary animate-pulse" />
            </Link>
            <Link to="/blog" className="text-foreground/80 hover:text-primary transition-colors">Faydalı / Bloq</Link>
          </nav>
        </div>

          {/* Center Section: Search */}
          <div className="flex-[2] max-w-2xl px-4 hidden md:flex justify-center relative">
            {/* Visual connector: Leaning Bot peeking from left */}
            <motion.div 
              className="absolute -left-10 bottom-0 w-24 h-24 hidden xl:block z-20 pointer-events-none"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <img 
                src="/biralbot-sales.png" 
                alt="Biral Bot Leaning" 
                className="w-full h-full object-contain transform -scale-x-100 opacity-90" 
              />
            </motion.div>
            
            <form onSubmit={handleSearch} className="w-full relative z-10">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Məhsul axtar..."
                  className="pl-10 bg-muted/60 hover:bg-muted focus:bg-background text-foreground border-transparent focus-visible:border-primary rounded-lg h-10 transition-colors w-full"
                />
              </div>
            </form>
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:flex-1 shrink-0">
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
