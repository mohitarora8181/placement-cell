import { FirebaseContext } from './context/Firebase'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { useNavigate } from 'react-router-dom'

function App() {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  if(!firebase.loggedIn){
    navigate('sign-in');
  }
  else{
    navigate('/');
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element = {<h1>Profile</h1>}/>
        <Route path='/sign-in' element = {<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/user-profile" element={<Profile/>}/>

      </Routes>
    </>
  )
}

export default App
