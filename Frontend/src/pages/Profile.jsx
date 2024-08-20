import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import axios from 'axios';
import JobCard from '../components/JobCard'; // Import JobCard

const Profile = () => {
  const [user, setUser] = useState(null);
  const [resumeURL, setResumeURL] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const userId = localStorage.getItem('userId')?.trim();

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`/api/users/profile/${userId}`);
          setUser(userResponse.data);

          
          const jobsResponse = await axios.get(`/api/users/applied-jobs/${userId}`);
          setAppliedJobs(jobsResponse.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
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

  if (!user) {
    return <Typography variant="h6" align="center" mt={5}>Loading...</Typography>;
  }

  return (
    <>
      <Navbar />
      <div style={{ margin: '20px 40px', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
            <Avatar
              sx={{ width: 150, height: 150, margin: '0 auto' }}
              alt={user.fullname || 'Profile Picture'}
              src={user.photoURL || 'https://source.unsplash.com/200x200/?profile pic'}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {user.fullname || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Email:</strong> {user.email || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Date of Birth:</strong> {formatDate(user.dob) || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Course:</strong> {user.course || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Degree:</strong> {user.degree || 'Loading...'}
            </Typography>
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
            <div style={{ marginTop: '20px' }}>
              <Typography variant="h6">Applied Jobs</Typography>
              <Grid container spacing={3}>
                {appliedJobs.length === 0 ? (
                  <Typography>No applied jobs</Typography>
                ) : (
                  appliedJobs.map((job) => (
                    <Grid item xs={12} md={4} key={job._id}>
                      <JobCard job={job} />
                    </Grid>
                  ))
                )}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Profile;
