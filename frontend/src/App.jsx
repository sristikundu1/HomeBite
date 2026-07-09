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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
