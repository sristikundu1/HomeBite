import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import HelpCenter from "./pages/HelpCenter";
import CookingGuides from './pages/CookingGuides';
import GiftCards from './pages/GiftCards';
import Community from './pages/Community';
import Status from './pages/Status';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import BecomeChef from './pages/BecomeChef';
import CategoriesPage from './pages/Categories';
import HowItWorksPage from './pages/HowItWorksPage';
import ApplicationStatus from './pages/ApplicationStatus';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import CustomerRoute from './routes/CustomerRoute';
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardProfile from './pages/dashboard/Profile';
import DashboardSettings from './pages/dashboard/Settings';
import DashboardNotFound from './pages/dashboard/NotFound';
import AdminChefVerification from './pages/dashboard/AdminChefVerification';
import AdminRoute from './routes/AdminRoute';
import ChefRoute from './routes/ChefRoute';
import ChefAddFood from './pages/dashboard/ChefAddFood';
import ChefManageFoods from './pages/dashboard/ChefManageFoods';
import ChefEditFood from './pages/dashboard/ChefEditFood';
import Foods from './pages/Foods';
import FoodDetails from './pages/FoodDetails';
import Wishlist from './pages/dashboard/Wishlist';
import Cart from './pages/dashboard/Cart';
import Checkout from './pages/Checkout';
import CustomerOrderDetails from './pages/dashboard/CustomerOrderDetails';
import Chat from './pages/dashboard/Chat';
import AIFoodAssistant from './components/ai/AIFoodAssistant';
import ChefOverview from './pages/dashboard/ChefOverview';
import ChefOrders from './pages/dashboard/ChefOrders';
import ChefAvailability from './pages/dashboard/ChefAvailability';
import ChefRevenue from './pages/dashboard/ChefRevenue';
import ChefReviews from './pages/dashboard/ChefReviews';
import ChefMessages from './pages/dashboard/ChefMessages';
import ChefProfile from './pages/dashboard/ChefProfile';
import ChefSettings from './pages/dashboard/ChefSettings';
import CustomerOverview from './pages/dashboard/CustomerOverview';
import CustomerOrders from './pages/dashboard/CustomerOrders';
import Notifications from './pages/dashboard/Notifications';
import CustomerReviews from './pages/dashboard/CustomerReviews';
import AdminOverview from './pages/dashboard/AdminOverview';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminFoods from './pages/dashboard/AdminFoods';
import AdminOrders from './pages/dashboard/AdminOrders';
import AdminMessages from './pages/dashboard/AdminMessages';
import AdminNotifications from './pages/dashboard/AdminNotifications';
import AdminCoupons from './pages/dashboard/AdminCoupons';
import AdminGiftCards from './pages/dashboard/AdminGiftCards';
import AdminPlatformSettings from './pages/dashboard/AdminPlatformSettings';
import AdminProfile from './pages/dashboard/AdminProfile';
import AdminSettings from './pages/dashboard/AdminSettings';
import AdminReports from './pages/dashboard/AdminReports';
import AdminAnalytics from './pages/dashboard/AdminAnalytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/cooking-guides" element={<CookingGuides />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/community" element={<Community />} />
          <Route path="/cook" element={<BecomeChef />} />
          <Route
            path="/application-status"
            element={
              <ProtectedRoute>
                <ApplicationStatus />
              </ProtectedRoute>
            }
          />
          <Route path="/status" element={<Status />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/foods/:id" element={<FoodDetails />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerRoute>
                <DashboardLayout />
              </CustomerRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="customer" element={<CustomerOverview />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders/:id" element={<CustomerOrderDetails />} />
          <Route path="messages" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminOverview />
              </AdminRoute>
            }
          />
          <Route
            path="admin/analytics"
            element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="admin/foods"
            element={
              <AdminRoute>
                <AdminFoods />
              </AdminRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="admin/messages"
            element={
              <AdminRoute>
                <AdminMessages />
              </AdminRoute>
            }
          />
          <Route
            path="admin/notifications"
            element={
              <AdminRoute>
                <AdminNotifications />
              </AdminRoute>
            }
          />
          <Route
            path="admin/coupons"
            element={
              <AdminRoute>
                <AdminCoupons />
              </AdminRoute>
            }
          />
          <Route
            path="admin/gift-cards"
            element={
              <AdminRoute>
                <AdminGiftCards />
              </AdminRoute>
            }
          />
          <Route
            path="admin/platform-settings"
            element={
              <AdminRoute>
                <AdminPlatformSettings />
              </AdminRoute>
            }
          />
          <Route
            path="admin/profile"
            element={
              <AdminRoute>
                <AdminProfile />
              </AdminRoute>
            }
          />
          <Route
            path="admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />
          <Route
            path="admin/reports"
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            }
          />
          <Route
            path="chef"
            element={
              <ChefRoute>
                <ChefOverview />
              </ChefRoute>
            }
          />
          <Route
            path="chef/add-food"
            element={
              <ChefRoute>
                <ChefAddFood />
              </ChefRoute>
            }
          />
          <Route
            path="chef/orders"
            element={
              <ChefRoute>
                <ChefOrders />
              </ChefRoute>
            }
          />
          <Route
            path="chef/availability"
            element={
              <ChefRoute>
                <ChefAvailability />
              </ChefRoute>
            }
          />
          <Route
            path="chef/revenue"
            element={
              <ChefRoute>
                <ChefRevenue />
              </ChefRoute>
            }
          />
          <Route
            path="chef/reviews"
            element={
              <ChefRoute>
                <ChefReviews />
              </ChefRoute>
            }
          />
          <Route
            path="chef/messages"
            element={
              <ChefRoute>
                <ChefMessages />
              </ChefRoute>
            }
          />
          <Route
            path="chef/profile"
            element={
              <ChefRoute>
                <ChefProfile />
              </ChefRoute>
            }
          />
          <Route
            path="chef/settings"
            element={
              <ChefRoute>
                <ChefSettings />
              </ChefRoute>
            }
          />
          <Route
            path="chef/manage-foods"
            element={
              <ChefRoute>
                <ChefManageFoods />
              </ChefRoute>
            }
          />
          <Route
            path="chef/edit-food/:id"
            element={
              <ChefRoute>
                <ChefEditFood />
              </ChefRoute>
            }
          />
          <Route
            path="admin/chef-verification"
            element={
              <AdminRoute>
                <AdminChefVerification />
              </AdminRoute>
            }
          />
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
      </Routes>
      <AIFoodAssistant />
    </BrowserRouter>
  );
}

export default App;
