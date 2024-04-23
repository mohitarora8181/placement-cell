import { FirebaseContext } from './context/Firebase'
import { useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { useNavigate } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import { Dashboard } from '@mui/icons-material'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
//  if(!firebase.loggedIn){
//   navigate('/sign-up');
//  }
  return (
    <>
      <Routes>
        <Route path='/' element={<ProtectedRoute Component={Home}/>} />

        <Route path='/sign-in' element = {<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/user-profile" element={<ProtectedRoute Component={Profile}/>}/>
        <Route path="/admin" element={<ProtectedRoute Component={AdminPage}/>}/>
        <Route path="/dashboard1" element={<AdminPage/>}/>

      </Routes>
    </>
  )
}

export default App
