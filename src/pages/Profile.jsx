import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import Link from '@mui/material/Link'; // Import Link component from Material-UI
import { FirebaseContext } from '../context/Firebase';

const Profile = () => {
  const firebase = useContext(FirebaseContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (firebase.currentUser) {
      setUser(firebase.currentUser); // Assuming firebase.currentUser holds user data
    }
  }, [firebase]);

  return (
    <>
      <Navbar />
      <div className="mt-4 mx-16">
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              sx={{ width: 150, height: 150 }}
              alt={user ? user.displayName : ''}
              src={user ? user.photoURL : ''}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4">
              Name: {user ? user.name : 'Loading...'}
            </Typography>
            <Typography variant="body1">Email: {user ? user.email : 'Loading...'}</Typography>
            <Typography variant="body1">Date of Birth: {user ? user.dob : 'Loading...'}</Typography>
            <Typography variant="body1">Course: {user ? user.course : 'Loading...'}</Typography>
            <Typography variant="body1">Degree: {user ? user.degree : 'Loading...'}</Typography>
            {/* Make Resume a clickable link */}
            <Typography variant="body1">
              Resume: {user ? <Link href={user.resume}>View Resume</Link> : 'Loading...'}
            </Typography>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
