import { FirebaseContext } from './context/Firebase'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  const firebase = useContext(FirebaseContext)
  console.log(firebase)
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element = {<h1>Profile</h1>}/>
      </Routes>
    </>
  )
}

export default App
