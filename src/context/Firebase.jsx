import {useContext, createContext, useState} from 'react';
import {initializeApp} from 'firebase/app';

export const FirebaseContext = createContext(null);
// export const useFirebase =  useContext(firebaseContext);

const firebaseConfig = {
  apiKey: "AIzaSyAn46s0K-VQ0Ko9nCvb9T8R8bvLZvrdOYw",
  authDomain: "placement-cell-400d5.firebaseapp.com",
  projectId: "placement-cell-400d5",
  storageBucket: "placement-cell-400d5.appspot.com",
  messagingSenderId: "204794261592",
  appId: "1:204794261592:web:281b9447cc20fe63a89a2d",
  measurementId: "G-9X9QZ3QBD5"
};
const firebaseApp = initializeApp(firebaseConfig); 

export const FirebaseProvider = (props)=> {
  const [name, setName] = useState("Yuvraj");
  const [count, setCount] = useState(0);
  return(
    <>
    <FirebaseContext.Provider value={{
      name,count

    }

    }>{props.children}</FirebaseContext.Provider>
    </>
  )
}


