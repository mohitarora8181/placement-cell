import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [resumeURL, setResumeURL] = useState('');
  const userId = localStorage.getItem('userId')?.trim();
  const token = localStorage.getItem('token')?.trim();
  const navigate = useNavigate();


  useEffect(() => {
    if (userId && token) {
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`/api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data);
          setResumeURL(userResponse.data.resumeURL || ''); // Pre-fill resume URL if present
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId, token]);

  const handleResumeURLChange = (event) => {
    setResumeURL(event.target.value);
  };

  const handleSubmitURL = async () => {
    if (!resumeURL) {
      alert('Please provide a resume URL.');
      return;
    }

    try {
      await axios.post(`/api/users/update-resume/${userId}`, { resumeURL }, {
        headers: { Authorization: `Bearer ${token}` } // Include token here as well
      });
      alert('Resume URL updated successfully!');
    } catch (error) {
      console.error('Error updating resume URL:', error);
      alert('Failed to update resume URL.');
    }
  };

  if (!user) {
    return <Typography variant="h6" align="center" mt={5}>Loading...</Typography>;
  }

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className="text-center">
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
              <strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Course:</strong> {user.course || 'Loading...'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Degree:</strong> {user.degree || 'Loading...'}
            </Typography>
          
            <div className="flex flex-col items-start mt-3">
              <TextField
                label="Resume URL"
                fullWidth
                value={resumeURL}
                onChange={handleResumeURLChange}
              />
              <Button variant="contained" color="primary" onClick={handleSubmitURL} className="mt-5">
                Update Resume URL
              </Button>
              <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}
              className="mt-5"
            >
              Edit Profile
            </Button>
            </div>
          </Grid>
        </Grid>
        <div className="mt-8">
          <Typography variant="h5" gutterBottom>
            Applied Jobs
          </Typography>
          <Grid container spacing={2}>
            {user.appliedJobs && user.appliedJobs.length > 0 ? (
              user.appliedJobs.map((job) => (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <div className="p-4 bg-white shadow-md rounded-lg w-full h-auto">
                    {job.imageURL ? (
                      <img src={job.imageURL} alt={job.jobTitle} className="rounded-lg h-44 w-full object-cover mb-4" />
                    ) : (
                      <div className="h-44 w-full bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <Typography variant="body2" color="textSecondary">No Image Available</Typography>
                      </div>
                    )}
                    <Typography variant="h6" gutterBottom className="font-semibold mb-2">
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="mb-2">
                      <strong>Company:</strong> {job.companyName}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="mb-2">
                      <strong>Location:</strong> {job.location}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" className="mb-2">
                      <strong>Type:</strong> {job.type}
                    </Typography>
                    <Typography variant="body2" className="mb-4">
                      {job.jobDescription}
                    </Typography>
                    <Typography variant="body2" color="textGray-500">
                      <strong>CTC:</strong> {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
                    </Typography>
                  </div>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No jobs applied yet.
              </Typography>
            )}
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Profile;
