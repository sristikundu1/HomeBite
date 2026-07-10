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
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route
            path="chef/add-food"
            element={
              <ChefRoute>
                <ChefAddFood />
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
    </BrowserRouter>
  );
}

export default App;
