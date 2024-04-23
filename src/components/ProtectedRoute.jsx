import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "../context/Firebase";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = (props)=>{
  const {Component} = props;
  const firebase = useContext(FirebaseContext);
  const [loggedIn, setLoggedIn] = useState('');
  const navigate  = useNavigate();

  // useEffect(()=>{
  //   setLoggedIn(firebase.loggedIn);
  //   if(!loggedIn){
  //     navigate('/sign-in');
  //   }
  // },[loggedIn, firebase.loggedIn]);
  return(
    <>
    <Component/>
    </>
  )
}
export default ProtectedRoute;
