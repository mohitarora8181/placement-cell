import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AdminPage from './pages/AdminPage'
import AddJob from './pages/AddJob'
import SearchJobs from './pages/SearchJobs';
import UserProfile from './pages/UserProfile'
import JobDetails from './pages/JobDetails'
// import PostJob from './pages/PostJob'
//import ProtectedRoute from './components/ProtectedRoute';


function App() {

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
