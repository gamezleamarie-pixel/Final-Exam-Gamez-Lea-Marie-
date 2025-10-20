import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/Dashboard'; 
import CustomerDashboard from './pages/CustomerDashboard'; 
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import LocationPage from './pages/LocationPage';
import { api } from './services/api';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [user, setUser] = useLocalStorage('salon_user', null);
  const initialRoute = user
    ? (user.role === 'admin' ? 'admin' : user.role === 'customer' ? 'customer' : 'landing')
    : 'landing';
  const [route, setRoute] = useState(initialRoute); 
  const [booting, setBooting] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        const res = await api.auth.me();
        if (res.user) {
          setUser(res.user);
          if (res.user.role === 'admin') setRoute('admin');
          else if (res.user.role === 'customer') setRoute('customer');
          else setRoute('landing');
        }
      } catch {

      }
      setBooting(false);
    })();
  }, []);

  const go = useCallback((r) => setRoute(r), []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;
    try {
      await api.auth.logout();
      setUser(null);
      setRoute('landing');
    } catch {
      alert('Logout failed. Please try again.');
    }
  };

  const content = useMemo(() => {
    if (booting) return <div className="text-center py-5">Loading...</div>;
    if (route === 'landing') return <LandingPage onNavigate={go} />;
    if (route === 'about') return <AboutPage />;
    if (route === 'contact') return <ContactPage />;
    if (route === 'reviews') return <ReviewsPage />;
    if (route === 'location') return <LocationPage />;
    if (route === 'register') return <RegisterPage onNavigate={go} />;
    if (route === 'login')
      return <LoginPage setUser={setUser} onNavigate={go} />;
    if (route === 'admin') return <AdminDashboard user={user} onNavigate={go} />;
    if (route === 'customer') return <CustomerDashboard user={user} />;
    return <LandingPage onNavigate={go} />;
  }, [route, user, booting]);

  return (
    <>
      <Navbar
        user={user}
        setUser={setUser}
        onNavigate={(r) => {
          if (r === 'logout') handleLogout();
          else go(r);
        }}
      />
      {route === 'landing' ? (
        content
      ) : (
        <div className="container my-4">{content}</div>
      )}
    </>
  );
}
