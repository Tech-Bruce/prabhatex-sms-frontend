import { useState, useEffect } from 'react';
import ScreenLayout from './components/layout/ScreenLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './components/auth/Login';
import UploadData from './components/dashboard/UploadData';
import ProfessionalData from './components/dashboard/ProfessionalData';
import STCourierData from './components/dashboard/STCourierData';
import SMSHistory from './components/dashboard/SMSHistory';
import CustomSMS from './components/dashboard/CustomSMS';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [activePage, setActivePage] = useState('stcourier');

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  if (isAuthenticated) {
    return (
      <DashboardLayout 
        activePage={activePage} 
        setActivePage={setActivePage}
        onLogout={handleLogout}
      >
        {activePage === 'professional' && <ProfessionalData />}
        {activePage === 'stcourier' && <STCourierData />}
        {activePage === 'upload' && <UploadData />}
        {activePage === 'sms' && <SMSHistory />}
        {activePage === 'customsms' && <CustomSMS />}
      </DashboardLayout>
    );
  }

  return (
    <ScreenLayout 
      title="Prabha Tex" 
      subtitle="Sign in to your account to manage courier data, send SMS notifications, and view logs."
    >
      <Login onLogin={handleLogin} />
    </ScreenLayout>
  )
}

export default App
