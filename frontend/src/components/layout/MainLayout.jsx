import { Outlet } from 'react-router-dom';
import CustomCursor from '../common/CustomCursor';
import Footer from './Footer';
import Navbar from './Navbar';
import PageTransition from './PageTransition';
import ScrollToTopButton from '../common/ScrollToTopButton';

export default function MainLayout() {
  return (
    <div className="app-shell min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
