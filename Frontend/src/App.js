import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import AdminPage from './pages/AdminPage'
//import ProtectedRoute from './components/ProtectedRoute'; 


function App() {
 
  return (
    <>
      <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/profile' element={<Profile />} />
      <Route path="/home/user-profile" element={<Profile />} />
      <Route path="/admin" element={<AdminPage />} />

      <Route path='/home' element={<Home />} />
      <Route path="/sign-in" element={<SignIn />} />

      </Routes>
    </>
  )
}

export default App
