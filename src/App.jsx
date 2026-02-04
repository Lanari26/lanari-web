import { Routes, Route } from 'react-router-dom';
import LanariTechBrowser from './components/LanariTechBrowser';
import ComingSoon from './components/ComingSoon';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LanariTechBrowser />} />
      <Route path="/coming-soon" element={<ComingSoon />} />
    </Routes>
  );
}

export default App
