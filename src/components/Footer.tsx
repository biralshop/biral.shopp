import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src="/logo-circle.png" alt="1Al Store" className="h-10 w-auto mb-4" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Gündəlik həyatınızı asanlaşdıran praktik məhsullar. Mətbəxdən baxçaya, həyətdən maşına — hər şey bir yerdə.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-3">Kateqoriyalar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/kateqoriyalar?cat=${cat.slug}`} className="hover:text-primary-foreground transition-colors">
                    {cat.icon} {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="font-semibold mb-3">Alış-veriş</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/kampaniyalar" className="hover:text-primary-foreground transition-colors">Kampaniyalar</Link></li>
              <li><Link to="/sebet" className="hover:text-primary-foreground transition-colors">Səbət</Link></li>
              <li><Link to="/hesab" className="hover:text-primary-foreground transition-colors">Hesabım</Link></li>
              <li><Link to="/giris" className="hover:text-primary-foreground transition-colors">Daxil ol</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Əlaqə</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="tel:+994501234567" className="hover:text-primary-foreground transition-colors">
                  📞 +994 50 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@biralstore.az" className="hover:text-primary-foreground transition-colors">
                  ✉️ info@biralstore.az
                </a>
              </li>
              <li>📍 Bakı, Azərbaycan</li>
              <li>
                <a href="https://wa.me/994501234567" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  💬 WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
          © 2026 BiralStore. Bütün hüquqlar qorunur.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
