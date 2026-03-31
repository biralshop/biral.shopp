import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import CampaignPage from "./pages/CampaignPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import AccountPage from "./pages/AccountPage";
import TrackingPage from "./pages/TrackingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductEditor from "./pages/admin/AdminProductEditor";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminHomeBuilder from "./pages/admin/AdminHomeBuilder";
import AdminPageLibrary from "./pages/admin/AdminPageLibrary";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerProfile from "./pages/admin/AdminCustomerProfile";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminDelivery from "./pages/admin/AdminDelivery";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminBrand from "./pages/admin/AdminBrand";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminGuard from "./components/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/kateqoriyalar" element={<Categories />} />
                  <Route path="/mehsul/:id" element={<ProductDetail />} />
                  <Route path="/axtaris" element={<SearchResults />} />
                  <Route path="/kampaniyalar" element={<CampaignPage />} />
                  <Route path="/sebet" element={<CartPage />} />
                  <Route path="/odenis" element={<CheckoutPage />} />
                  <Route path="/sifaris-ugurlu" element={<OrderSuccess />} />
                  <Route path="/hesab" element={<AccountPage />} />
                  <Route path="/hesab/hardadir/:orderId" element={<TrackingPage />} />
                  <Route path="/giris" element={<LoginPage />} />
                  {/* Admin panel — yalnız admin rollu istifadəçilər */}
                  <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                  <Route path="/admin/mehsullar" element={<AdminGuard><AdminProducts /></AdminGuard>} />
                  <Route path="/admin/mehsullar/:id" element={<AdminGuard><AdminProductEditor /></AdminGuard>} />
                  <Route path="/admin/kateqoriyalar" element={<AdminGuard><AdminCategories /></AdminGuard>} />
                  <Route path="/admin/sehifeler" element={<AdminGuard><AdminHomeBuilder /></AdminGuard>} />
                  <Route path="/admin/sehife-kitabxanasi" element={<AdminGuard><AdminPageLibrary /></AdminGuard>} />
                  <Route path="/admin/kampaniyalar" element={<AdminGuard><AdminPromotions /></AdminGuard>} />
                  <Route path="/admin/musteriler" element={<AdminGuard><AdminCustomers /></AdminGuard>} />
                  <Route path="/admin/musteriler/:id" element={<AdminGuard><AdminCustomerProfile /></AdminGuard>} />
                  <Route path="/admin/sifarisler" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                  <Route path="/admin/sifarisler/:id" element={<AdminGuard><AdminOrderDetail /></AdminGuard>} />
                  <Route path="/admin/catdirilma" element={<AdminGuard><AdminDelivery /></AdminGuard>} />
                  <Route path="/admin/destek" element={<AdminGuard><AdminSupport /></AdminGuard>} />
                  <Route path="/admin/brend" element={<AdminGuard><AdminBrand /></AdminGuard>} />
                  <Route path="/admin/rollar" element={<AdminGuard><AdminRoles /></AdminGuard>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
