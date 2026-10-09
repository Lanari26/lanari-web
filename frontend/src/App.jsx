// Lanari web app — deployed to lanari.rw via GitHub Actions on push to main.
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import { PRODUCTS } from './data/products';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AiChat from './pages/AiChat';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminMessages from './pages/admin/Messages';
import AdminPartners from './pages/admin/Partners';
import AdminJobs from './pages/admin/Jobs';
import AdminUsers from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';
import AdminDocs from './pages/admin/DocsManager';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminTeam from './pages/admin/TeamOverview';
import AdminTeamMembers from './pages/admin/TeamMembers';
import AdminTeamTasks from './pages/admin/TeamTasks';
import AdminTeamFinances from './pages/admin/TeamFinances';
import AdminTeamRoles from './pages/admin/TeamRoles';
import AdminTeamRules from './pages/admin/TeamRules';
import AdminTeamReports from './pages/admin/TeamReports';
import AdminInternships from './pages/admin/Internships';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function PageTracker() {
  const location = useLocation();
  useEffect(() => {
    // Only track each unique page once per session
    const tracked = JSON.parse(sessionStorage.getItem('tracked_pages') || '[]');
    if (tracked.includes(location.pathname)) return;

    tracked.push(location.pathname);
    sessionStorage.setItem('tracked_pages', JSON.stringify(tracked));

    const token = localStorage.getItem('token');
    fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ event: 'page_visit', page: location.pathname })
    }).catch(() => {});
  }, [location.pathname]);
  return null;
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/partners" element={<AdminPartners />} />
        <Route path="/jobs" element={<AdminJobs />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/team" element={<AdminTeam />} />
        <Route path="/team/members" element={<AdminTeamMembers />} />
        <Route path="/team/tasks" element={<AdminTeamTasks />} />
        <Route path="/team/finances" element={<AdminTeamFinances />} />
        <Route path="/team/roles" element={<AdminTeamRoles />} />
        <Route path="/team/rules" element={<AdminTeamRules />} />
        <Route path="/team/reports" element={<AdminTeamReports />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/docs" element={<AdminDocs />} />
        <Route path="/campaigns" element={<AdminCampaigns />} />
        <Route path="/internships" element={<AdminInternships />} />
      </Routes>
    </AdminLayout>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
    {loading && <LoadingScreen onDone={() => setLoading(false)} />}
    <PageTracker />
    <Routes>
      <Route path="/ai" element={
        <ProtectedRoute>
          <AiChat />
        </ProtectedRoute>
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute requireAdmin>
          <AdminRoutes />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {PRODUCTS.map((p) => <Route key={p.slug} path={p.path} element={<Product slug={p.slug} />} />)}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
    </>
  );
}

export default App;
