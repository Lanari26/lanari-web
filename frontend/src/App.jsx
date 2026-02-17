import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Siri from './pages/Siri';
import Rise from './pages/Rise';
import Academy from './pages/Academy';
import AiProducts from './pages/AiProducts';
import Partner from './pages/Partner';
import Invest from './pages/Invest';
import Analytics from './pages/Analytics';
import Cloud from './pages/Cloud';
import Docs from './pages/Docs';
import Mail from './pages/Mail';
import Calendar from './pages/Calendar';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Login from './pages/Login';
import Register from './pages/Register';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import UserDashboard from './pages/UserDashboard';
import AiChat from './pages/AiChat';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminMessages from './pages/admin/Messages';
import AdminPartners from './pages/admin/Partners';
import AdminJobs from './pages/admin/Jobs';
import AdminUsers from './pages/admin/Users';
import ComingSoon from './components/ComingSoon';

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/partners" element={<AdminPartners />} />
        <Route path="/jobs" element={<AdminJobs />} />
        <Route path="/users" element={<AdminUsers />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/ai" element={<AiChat />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/siri" element={<Siri />} />
            <Route path="/rise" element={<Rise />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/ai-products" element={<AiProducts />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/cloud" element={<Cloud />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/mail" element={<Mail />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<Search />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;
