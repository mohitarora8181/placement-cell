import { FirebaseContext } from './context/Firebase'
import { useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { useNavigate } from 'react-router-dom'
import AdminPage from './pages/AdminPage'

function App() {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  useEffect(()=>{
    // if(!firebase.loggedIn){
    //   navigate('sign-in');
    // }


  },[firebase.loggedIn, navigate]);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element = {<h1>Profile</h1>}/>
        <Route path='/sign-in' element = {<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/user-profile" element={<Profile/>}/>
        <Route path="/admin" element={<AdminPage/>}/>

      </Routes>
    </>
  )
}

export default App
