import { ReactNode } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

interface LayoutProps {
  children: ReactNode;
  showCategoryNav?: boolean;
}

const Layout = ({ children, showCategoryNav = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
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
