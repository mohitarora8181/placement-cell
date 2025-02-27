import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Button, TextField, Typography, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [resumeURL, setResumeURL] = useState('');
  const userId = localStorage.getItem('userId')?.trim();
  const token = localStorage.getItem('token')?.trim();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && token && user == null) {
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data);
          setResumeURL(userResponse.data.resumeURL || '');
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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/users/update-resume/${userId}`, { resumeURL }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Resume URL updated successfully!');
    } catch (error) {
      console.error('Error updating resume URL:', error);
      alert('Failed to update resume URL.');
    }
  };

  if (!user) {
    return <Loader />;
  }

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-5" style={{ backgroundColor: '#f9f9f9', color: '#333333' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} className="text-center">
            <Avatar
              sx={{ width: 150, height: 150, margin: '0 auto', border: '2px solid #333333' }}
              alt={user.fullname || 'Profile Picture'}
              src={user.photoURL || 'https://source.unsplash.com/200x200/?profile pic'}
            />
            <Typography variant="h4" gutterBottom mt={2} style={{ color: '#333333', fontWeight: 'bold' }}>
              {user.fullname || 'Loading...'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
              <Typography variant="h5" gutterBottom style={{ color: '#333333', fontWeight: 'bold' }}>
                User Information
              </Typography>
              <Typography variant="body1" style={{ color: '#555555', marginBottom: '8px' }}>
                <strong>Email:</strong> {user.email || 'Loading...'}
              </Typography>
              <Typography variant="body1" style={{ color: '#555555', marginBottom: '8px' }}>
                <strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Loading...'}
              </Typography>
              <Typography variant="body1" style={{ color: '#555555', marginBottom: '8px' }}>
                <strong>Course:</strong> {user.course || 'Loading...'}
              </Typography>
              <Typography variant="body1" style={{ color: '#555555', marginBottom: '8px' }}>
                <strong>Degree:</strong> {user.degree || 'Loading...'}
              </Typography>

              <div className="mt-4">
                <TextField
                  label="Resume URL"
                  fullWidth
                  value={resumeURL}
                  onChange={handleResumeURLChange}
                  variant="outlined"
                  sx={{ marginBottom: 2 }}
                  InputProps={{
                    style: { color: '#333333', backgroundColor: '#f0f0f0' }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitURL}
                  sx={{ marginRight: 2 }}
                  style={{ backgroundColor: '#007bff', color: '#ffffff' }}
                >
                  Update Resume URL
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleEditProfile}
                  style={{ backgroundColor: '#6c757d', color: '#ffffff' }}
                >
                  Edit Profile
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
        {/* <div className="mt-8">
          <Typography variant="h5" gutterBottom style={{ color: '#333333', fontWeight: 'bold' }}>
            Applied Jobs
          </Typography>
          <Grid container spacing={2}>
            {user.appliedJobs && user.appliedJobs.length > 0 ? (
              user.appliedJobs.map((job) => (
                <Grid item xs={12} md={12} key={job._id}>
                  <Paper
                    elevation={2}
                    sx={{
                      padding: 2,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      background: '#e0e0e0', // Lighter background for job cards
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional: subtle shadow
                      color: '#333333' // Text color
                    }}
                  >
                    {job.imageURL ? (
                      <img
                        src={job.imageURL}
                        alt={job.jobTitle}
                        style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 4 }}
                      />
                    ) : (
                      <div style={{ width: 150, height: 100, backgroundColor: '#d0d0d0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" color="textSecondary">No Image Available</Typography>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom style={{ color: '#333333', fontWeight: 'bold' }}>
                        {job.jobTitle}
                      </Typography>
                      <Typography variant="body1" style={{ color: '#555555' }}>
                        <strong>Company:</strong> {job.companyName}
                      </Typography>
                      <Typography variant="body1" style={{ color: '#555555' }}>
                        <strong>Location:</strong> {job.location}
                      </Typography>
                      <Typography variant="body1" style={{ color: '#555555' }}>
                        <strong>Type:</strong> {job.type}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#555555', marginTop: '8px' }}>
                        {job.jobDescription}
                      </Typography>
                      <Typography variant="body2" style={{ color: '#555555' }}>
                        <strong>CTC:</strong> {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
                      </Typography>
                    </div>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography variant="body1" style={{ color: '#555555', textAlign: 'center' }}>
                No jobs applied yet.
              </Typography>
            )}
          </Grid>
        </div> */}
      </div>
    </>
  );
};

export default Profile;
