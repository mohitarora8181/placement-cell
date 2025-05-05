import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// Page Components
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AdminPage from './pages/AdminPage';
import UserProfile from './pages/UserProfile';
import NotificationForm from './pages/Notification';
import StudnetCoordinators from './pages/StudentCoordinators';
import MeetTheTeam from './components/MeetTheTeam';

// UI Components
import Footer from './components/Footer';
import Loader from './components/Loader';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Pages that should display the footer
  const footerPages = ['/home', '/admin', '/meet-the-team', '/post-job'];
  const showFooter = footerPages.includes(location.pathname);

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password'];
  const isResetPasswordWithToken = location.pathname.startsWith('/reset-password/');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');


        if (!token || !userId) {
          handleUnauthenticated();
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const userRole = response.data.isAdmin ? 'admin' : 'user';
          setIsAuthenticated(true);
          setRole(userRole);

          // Redirect based on role if on a public page
          if (publicRoutes.includes(location.pathname) || isResetPasswordWithToken) {
            navigate(userRole === 'admin' ? '/admin' : '/home');
          }
        } else {
          handleUnauthenticated();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        handleUnauthenticated();
      }
    };

    const handleUnauthenticated = () => {
      setIsAuthenticated(false);
      setRole(null);

      // Redirect to sign-in if not on a public route
      if (!(publicRoutes.includes(location.pathname) || isResetPasswordWithToken)) {
        navigate('/sign-in');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Show loader while authentication state is being determined
  if (isAuthenticated === null) {
    return <Loader />;
  }

  return (
    <div className='min-h-screen'>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<SignIn />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:resetToken' element={<ResetPassword />} />
        <Route path='/meet-the-team' element={<MeetTheTeam />} />

        {/* User Routes */}
        <Route path='/home' element={role === 'user' ? <Home /> : <Navigate to='/' />} />
        <Route path='/home/user-profile' element={role === 'user' ? <Profile /> : <Navigate to='/' />} />
        <Route path='/profile' element={role === 'user' ? <Profile /> : <Navigate to='/' />} />
        <Route path='/edit-profile' element={role === 'user' ? <EditProfile /> : <Navigate to='/' />} />

        {/* Admin Routes */}
        <Route path='/admin' element={role === 'admin' ? <AdminPage /> : <Navigate to='/' />} />
        <Route path='/admin/sc' element={role === 'admin' ? <StudnetCoordinators /> : <Navigate to='/' />} />
        <Route path='/notify' element={role === 'admin' ? <NotificationForm /> : <Navigate to='/' />} />
        <Route path='/user-profile/:userId' element={role === 'admin' ? <UserProfile /> : <Navigate to='/' />} />

        {/* Fallback Route */}
        <Route path='*' element={role === 'admin' ? <AdminPage /> : <Home />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}

export default App;