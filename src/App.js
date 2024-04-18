import Navbar from "./components/Navbar";
import { FirebaseContext } from "./context/Firebase";
import { useContext } from "react";


function App() {
  const firebase = useContext(FirebaseContext);
  console.log(firebase);
  return (
   <>
   <Navbar/>
   <h1>Hello</h1>

   </>
  );
}

export default App;
