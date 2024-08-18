import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { FirebaseContext } from '../context/Firebase';

function ProtectedRoute({ children }) {
  const { loggedIn } = useContext(FirebaseContext);

  if (!loggedIn) {
    console.log(loggedIn);
    // Redirect them to the /sign-in page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that location after they sign in.
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedRoute
