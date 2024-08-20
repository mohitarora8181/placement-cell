import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import Link from '@mui/material/Link';
import axios from 'axios';
import { Button, TextField } from '@mui/material';


const Profile = () => {
  
  const [user, setUser] = useState(null);
  const [resumeURL, setResumeURL] = useState('');

  
  const userId = localStorage.getItem('userId');
  console.log('UserId from localStorage:', userId);


  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`/api/users/profile/${userId}`);
          setUser(response.data);
         
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }
  const handleResumeURLChange = (event) => {
    setResumeURL(event.target.value);
  };

  const handleSubmitURL = async () => {
    if (!resumeURL) {
      alert('Please provide a resume URL.');
      return;
    }

    try {
      await axios.post(`/api/users/update-resume/${userId}`, { resumeURL });
      alert('Resume URL updated successfully!');
    } catch (error) {
      console.error('Error updating resume URL:', error);
      alert('Failed to update resume URL.');
    }
  };


  return (
    <>
      <Navbar />
      <div className="mt-4 mx-16">
        <Grid container spacing={2}>
          <Grid item>
            <Avatar
              sx={{ width: 150, height: 150 }}
              alt={user ? user.username : ''}
              src={user ? user.photoURL : 'https://source.unsplash.com/200x200/?profile pic'}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4">
              Name: {user ? user.username : 'Loading...'}
            </Typography>
            <Typography variant="body1">Email: {user ? user.email : 'Loading...'}</Typography>
            <Typography variant="body1">Date of Birth: {user ? user.dob : 'Loading...'}</Typography>
            <Typography variant="body1">Course: {user ? user.course : 'Loading...'}</Typography>
            <Typography variant="body1">Degree: {user ? user.degree : 'Loading...'}</Typography>

            <div>
              <TextField
                label="Resume URL"
                variant="outlined"
                fullWidth
                value={resumeURL}
                onChange={handleResumeURLChange}
                margin="normal"
              />
              <Button variant="contained" onClick={handleSubmitURL}>
                Update Resume URL
              </Button>
            </div>
           
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
