import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

// Page Components
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Profile from './pages/Profile';
import MeetTheTeam from './components/MeetTheTeam';
import EditProfile from './pages/EditProfile';
import AdminPage from './pages/admin/AdminPage';
import UserProfile from './pages/admin/UserProfile';
import NotificationForm from './pages/admin/Notification';
import StudnetCoordinators from './pages/admin/StudentCoordinators';

// UI Components
import Footer from './components/Footer';
import Loader from './components/Loader';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminNav from './components/AdminNav';
import UserForm from './pages/UserForm';

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
        <Route path='/form/:formId' element={role === 'user' ? <UserForm /> : <Navigate to='/' />} />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLayout role={role} />}>
          <Route index element={<AdminPage />} />
          <Route path='sc' element={<StudnetCoordinators />} />
          <Route path='notify' element={<NotificationForm />} />
          <Route path='user-profile/:userId' element={<UserProfile />} />
        </Route>

        {/* Fallback Route */}
        <Route path='*' element={role === 'admin' ? <AdminPage /> : <Home />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}


const AdminLayout = ({ role }) => {
  if (role !== 'admin') {
    return <Navigate to='/' />;
  }

  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
};

export default App;