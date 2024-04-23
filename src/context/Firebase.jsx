

import { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser) => {
      if (authUser) {
        try {
          const userDocRef = doc(fireStore, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          console.log(user);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser(userData);
            setLoggedIn(true); // Update loggedIn state to true
          } else {
            console.error('User document does not exist');
            setUser(null); // Reset user state
            setLoggedIn(false); // Update loggedIn state to false
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null); // Reset user state on error
          setLoggedIn(false); // Update loggedIn state to false
        }
      } else {
        setUser(null); // Set user state to null if not authenticated
        setLoggedIn(false); // Update loggedIn state to false
        console.log(user);

      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []); // No dependencies needed here, since it runs only once on component mount


  const signUpUser = async (email, password, name, dob, course, degree, resume) => {
    try {
      const resumeRef = ref(storage, `uploads/resumes/${Date.now()}${resume?.name}`);
      const uploadResult = await uploadBytes(resumeRef, resume);
      const newUserCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const userId = newUserCredential.user.uid;

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

  const getURL = async (path) => {
    try {
      const downloadURL = await getDownloadURL(ref(storage, path));
      return downloadURL;
    } catch (error) {
      console.error('Error retrieving resume URL:', error);
      return null; // Return null or handle error accordingly
    }
  };

  const signInUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error; // Propagate the error for higher-level error handling
    }
  };

  const signOutUser = ()=>{
    firebaseAuth.signOut();
  }

  const postJob = async(jobTitle, companyName, ctc, jobDescription, jobImage, applyLink)=>{
    const jobImageRef = ref(storage, `uploads/jobs/${Date.now()}-${jobImage.name}`);
    const uploadResult = await uploadBytes(jobImageRef, jobImage);
    await addDoc(collection(fireStore, 'jobs' ), {
      jobTitle,
      companyName,
      jobDescription,
      ctc,
      applyLink,
      imageURL: uploadResult.ref.fullPath
    })
  }

  const listAllJobs = ()=>{
    return getDocs(collection(fireStore, 'jobs'));
  }


  return (
    <FirebaseContext.Provider
      value={{
        signUpUser,
        signInUser,
        loggedIn, // Convert user object to boolean for logged-in state
        currentUser: user,
        getURL,
        signOutUser,
        postJob,
        listAllJobs
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
