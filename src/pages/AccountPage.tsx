import Layout from '@/components/Layout';
import AccountSidebar, { AccountTab } from '@/components/account/AccountSidebar';
import ProfileTab from '@/components/account/ProfileTab';
import OrdersTab from '@/components/account/OrdersTab';
import WishlistTab from '@/components/account/WishlistTab';
import AddressesTab from '@/components/account/AddressesTab';
import PaymentTab from '@/components/account/PaymentTab';
import SupportTab from '@/components/account/SupportTab';
import { useState } from 'react';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'orders': return <OrdersTab />;
      case 'wishlist': return <WishlistTab />;
      case 'addresses': return <AddressesTab />;
      case 'payment': return <PaymentTab />;
      case 'support': return <SupportTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <Layout showCategoryNav={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
