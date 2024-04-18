import { FirebaseContext } from './context/Firebase'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {
  const firebase = useContext(FirebaseContext)
  console.log(firebase)
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element = {<h1>Profile</h1>}/>
        <Route path='/sign-in' element = {<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>

      </Routes>
    </>
  )
}

export default App
