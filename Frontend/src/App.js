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
import EditProfile from './pages/EditProfile';

const backendURL = 'https://placement-cell-iczn.onrender.com/'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          const response = await axios.get(`${backendURL}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
            setRole(response.data.isAdmin ? 'admin' : 'user');

            // Redirect based on role
            if (response.data.isAdmin) {
              if (['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
                navigate('/admin');
              }
            } else {
              if (['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
                navigate('/home');
              }
            }
          } else {
            setIsAuthenticated(false);
            setRole(null);
            if (!['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
              navigate('/sign-in');
            }
          }
        } else {
          setIsAuthenticated(false);
          setRole(null);
          if (!['/', '/sign-in', '/sign-up'].includes(location.pathname)) {
            navigate('/sign-in');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setRole(null);
        navigate('/sign-in');
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-[#F5F5DC] h-full'>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {role === 'user' && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/home/user-profile" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}

        {role === 'admin' && (
          <>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/job/:jobId" element={<JobDetails />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/post-job" element={<AddJob />} />
            <Route path="/admin/user-search" element={<SearchUsers />} />
          </>
        )}

        <Route path="/search" element={<SearchJobs />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="*" element={role === 'admin' ? <AdminPage /> : <Home />} />
      </Routes>
    </div>
  );
}

export default App;
