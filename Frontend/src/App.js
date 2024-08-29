import { Routes, Route,useNavigate } from 'react-router-dom'
import React, { useEffect , useState} from 'react';
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AdminPage from './pages/AdminPage'
import AddJob from './pages/AddJob'
import SearchJobs from './pages/SearchJobs';
import UserProfile from './pages/UserProfile'
import JobDetails from './pages/JobDetails'
import axios from 'axios';
// import PostJob from './pages/PostJob'
//import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Retrieve user ID and token from localStorage or cookies
        const token = localStorage.getItem('token'); // or cookies
        const userId = localStorage.getItem('userId'); // or cookies

        if (token && userId) {
          // Verify token validity and check user profile
          const response = await axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
            navigate('/home'); // Redirect to home if authenticated
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [navigate]);
  if (isAuthenticated === null) {
    // Optionally show a loading spinner or splash screen while checking auth status
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/profile' element={<Profile />} />
      <Route path="/home/user-profile" element={<Profile />} />
      <Route path="/admin/post-job" element={<AddJob/>} />
      <Route path="/admin" element={<AdminPage/>} />
      <Route path="/search" element={<SearchJobs />} />
      <Route path='/home' element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/user-profile/:userId" element={<UserProfile />} />
      <Route path="/job/:jobId" element={<JobDetails />} /> 

      </Routes>
    </>
  )
}

export default App
