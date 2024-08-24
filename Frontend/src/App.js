import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AdminPage from './pages/AdminPage'
import AddJob from './pages/AddJob'
// import PostJob from './pages/PostJob'
//import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <>
      <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/profile' element={<Profile />} />
      <Route path="/home/user-profile" element={<Profile />} />
      <Route path="/admin/post-job" element={<AddJob/>} />
      <Route path="/admin" element={<AdminPage/>} />

      <Route path='/home' element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />

      </Routes>
    </>
  )
}

export default App
