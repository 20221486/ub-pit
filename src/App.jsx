import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Admin from './pages/admin';
import Management from './pages/management';
import Return from './pages/return';
import './styles/Text.css';
import './styles/Components.css';
import './styles/Dashboard.css';
import './styles/Navbar.css';
import './styles/App.css';

function App() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/admin': document.title = 'UB | Admin'; break;
      case '/management': document.title = 'UB | Product Management'; break;
      case '/return': document.title = 'UB | Returns & Logistics'; break;
      default: document.title = 'UB';
    }
  }, [location]);

  return (
    <div className="root-container">
      <NavigationBar />
      <main className='root_page-container'>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/management" element={<Management />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;