import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Admin from './pages/admin';
import Management from './pages/management';
import Return from './pages/return';
import Auth from './pages/auth';
import { useAuthStore } from './storage/useAuthStore';
import './styles/Text.css';
import './styles/Components.css';
import './styles/Dashboard.css';
import './styles/Navbar.css';
import './styles/App.css';

function App() {
  const location = useLocation();
  const currentUser = useAuthStore(state => state.currentUser);

  useEffect(() => {
    switch (location.pathname) {
      case '/admin': document.title = 'UB | Admin'; break;
      case '/management': document.title = 'UB | Product Management'; break;
      case '/return': document.title = 'UB | Returns & Logistics'; break;
      case '/auth': document.title = 'UB | Authentication'; break;
      default: document.title = 'UB';
    }
  }, [location]);

  if (!currentUser) {
      return (
          <div className="root-container">
              <main className='root_page-container'>
                  <Routes>
                      <Route path="*" element={<Navigate to="/auth" replace />} />
                      <Route path="/auth" element={<Auth />} />
                  </Routes>
              </main>
          </div>
      );
  }

  return (
    <div className="root-container">
      <NavigationBar />
      <main className='root_page-container'>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/auth" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/management" element={currentUser.role === 'admin' ? <Management /> : <Navigate to="/admin" replace />} />
          <Route path="/return" element={currentUser.role === 'admin' ? <Return /> : <Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;