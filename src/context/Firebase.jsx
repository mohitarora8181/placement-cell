

import { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export const FirebaseContext = createContext(null);

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
const fireStore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(fireStore, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser(userData);
            console.log("User data:", userData);
          } else {
            console.error('User document does not exist');
            setUser(null); // Reset user state
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null); // Reset user state on error
        }
      } else {
        setUser(null); // Set user state to null if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [firebaseAuth, fireStore]);



  const signUpUser = async (email, password, name, dob, course, degree, resume) => {
    try {
      // Create a reference to the resume file in Firebase Storage
      const resumeRef = ref(storage, `uploads/resumes/${Date.now()}${resume?.name}`);

      // Upload the resume file to Firebase Storage
      const uploadResult = await uploadBytes(resumeRef, resume);

      // Create a new user using email and password authentication
      const newUserCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const userId = newUserCredential.user.uid;

      // Update the user document in Firestore with user details and resume path
      await setDoc(doc(fireStore, 'users', userId), {
        name: name,
        dob: dob,
        resume: uploadResult.ref.fullPath, // Set resume field to the full path of the uploaded file
        course: course,
        degree: degree,
        email: email
      });

      console.log('User signed up successfully!');
    } catch (error) {
      console.error('Error signing up:', error);
      throw error; // Propagate the error for higher-level error handling
    }
  };


  const signInUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      alert('Error signing in:', error);
      // throw error; // Propagate the error for higher-level error handling
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        signUpUser,
        signInUser,
        loggedIn: !!user, // Convert user object to boolean for logged-in state
        currentUser: user
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

