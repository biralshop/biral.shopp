import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: ReactNode;
  showCategoryNav?: boolean;
  title?: string;
  description?: string;
}

const Layout = ({ 
  children, 
  showCategoryNav = true,
  title = "BiralStore - Praktik Məhsullar Mağazası",
  description = "Gündəlik həyatı asanlaşdıran praktik məhsullar. Mətbəx, baxça, həyət və maşın aksesuarları. Sürətli çatdırılma, təhlükəsiz ödəniş."
}: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://biral.store" />
      </Helmet>
      <AnnouncementBar />
      <Header />
      {showCategoryNav && <CategoryNav />}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Layout;
