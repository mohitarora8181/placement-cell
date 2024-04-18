import {useContext, createContext, useState} from 'react';

export const FirebaseContext = createContext(null);
// export const useFirebase =  useContext(firebaseContext);

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


