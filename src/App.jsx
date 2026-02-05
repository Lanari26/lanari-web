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
import Notifications from './pages/Notifications';
import ComingSoon from './components/ComingSoon';

function App() {
  return (
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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
