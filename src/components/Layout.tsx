import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import AIAssistant from './AIAssistant';

interface LayoutProps {
  children: ReactNode;
  showCategoryNav?: boolean;
  title?: string;
  description?: string;
}

const Layout = ({ 
  children, 
  showCategoryNav = true,
  title = "BiralStore | Innovativ Ev Həlləri və Premium Aksesuarlar",
  description = "Həyat keyfiyyətinizi artıran innovativ texnologiyalar və premium ev aksesuarları. Azərbaycanın ən etibarlı onlayn mağazası."
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
      <AIAssistant />
    </div>
  );
};

export default Layout;
