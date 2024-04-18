import {useContext, createContext, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { Password } from '@mui/icons-material';

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
const firebaseAuth = getAuth(firebaseApp);




export const FirebaseProvider = (props)=> {

  const signUpUser = async( email, password)=>{
    try{
    await createUserWithEmailAndPassword(firebaseAuth, email, password);

    }
    catch(error){
      alert(error);
    }
  }


  const signInUser = async( email, password)=>{
    try{
     await signInWithEmailAndPassword(firebaseAuth, email, password);
    }
    catch(error){
      alert("Error", error);
    }
  }
  return(
    <>
    <FirebaseContext.Provider value={{
      signInUser,
      signUpUser,

    }

    }>{props.children}</FirebaseContext.Provider>
    </>
  )
}


