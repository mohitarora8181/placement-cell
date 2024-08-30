import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import AddJob from './pages/AddJob';
import SearchJobs from './pages/SearchJobs';
import UserProfile from './pages/UserProfile';
import JobDetails from './pages/JobDetails';
import SearchUsers from './components/SearchUsers';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Retrieve user ID and token from localStorage
        const token = localStorage.getItem('token'); // or cookies
        const userId = localStorage.getItem('userId'); // or cookies
  
        if (token && userId) {
          // Verify token validity and check user profile
          const response = await axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          // Log the response to see what you get from the API
          console.log('API response:', response);
  
          if (response.status === 200) {
            setIsAuthenticated(true);
            // Redirect to home if authenticated and already on a login page
            if (['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
              navigate('/home');
            }
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
          // Redirect to login if not authenticated and trying to access a protected route
          if (!['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
            navigate('/sign-in');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        // Redirect to login if token verification fails
        navigate('/sign-in');
      }
    };
  
    checkAuth();
  }, [navigate, location.pathname]);
  

  if (isAuthenticated === null) {
    // Optionally show a loading spinner or splash screen while checking auth status
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home/user-profile" element={<Profile />} />
      <Route path="/admin/post-job" element={<AddJob />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/search" element={<SearchJobs />} />
      <Route path="/admin/user-search" element={<SearchUsers />} />
      <Route path="/home" element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/user-profile/:userId" element={<UserProfile />} />
      <Route path="/job/:jobId" element={<JobDetails />} />
    </Routes>
  );
}

export default App;
