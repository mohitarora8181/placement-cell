import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Card,
  Container,
  IconButton,
  Tooltip
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import {
  School,
  LocationOn,
  Phone,
  Email,
  Cake,
  LinkedIn,
  GitHub,
  Code,
  Description,
  Edit,
  CalendarMonth,
  OpenInNew,
  WorkOutline
} from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId')?.trim();
  const token = localStorage.getItem('token')?.trim();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && token) {
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(userResponse.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId, token]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <Container>
        <Typography variant="h5" color="error" align="center" sx={{ mt: 8 }}>
          Unable to load profile data. Please try again later.
        </Typography>
      </Container>
    );
  }

  const formatEnrollmentNumber = (enrollmentNumber, expectedLength = 11) => {
    if (!enrollmentNumber) return enrollmentNumber;
    const strNumber = String(enrollmentNumber);
    if (strNumber.length === expectedLength) return strNumber;
    if (strNumber.length < expectedLength) {
      return strNumber.padStart(expectedLength, '0');
    }
    return strNumber;
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ position: 'relative', mb: 6 }}>
          {/* Cover Photo */}
          <Box
            sx={{
              height: 200,
              borderRadius: 2,
              backgroundColor: '#1976d2',
              backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
              mb: -10,
              boxShadow: 3
            }}
          />

          {/* Profile Picture and Name Section */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mx: 2,
              borderRadius: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={user.photoURL || 'https://source.unsplash.com/random/?portrait'}
                  alt={user.fullname}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '4px solid white',
                    boxShadow: 2,
                    mb: 2
                  }}
                />
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user.fullname}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Enrollment:
                    <a href={`https://www.ipuranklist.com/student/${formatEnrollmentNumber(user.enrollmentNumber)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {` ${formatEnrollmentNumber(user.enrollmentNumber)}`}
                    </a>
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                    {user.linkedin && (
                      <Tooltip title="LinkedIn">
                        <IconButton
                          color="primary"
                          component="a"
                          href={user.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LinkedIn />
                        </IconButton>
                      </Tooltip>
                    )}
                    {user.github && (
                      <Tooltip title="GitHub">
                        <IconButton
                          color="primary"
                          component="a"
                          href={user.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GitHub />
                        </IconButton>
                      </Tooltip>
                    )}
                    {user.leetCode && (
                      <Tooltip title="LeetCode">
                        <IconButton
                          color="primary"
                          component="a"
                          href={user.leetCode}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Code />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditProfile}
                    startIcon={<Edit />}
                    sx={{ mt: 3 }}
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} sm={8} md={9}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4" fontWeight="bold">
                    Student Profile
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1 }} fontSize="small" /> Personal Information
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Email fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">{user.email}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Phone fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">{user.contactNumber}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Cake fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">
                          {new Date(user.dob).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationOn fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">{user.address}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Public fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">{user.nationality}</Typography>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Academic Information */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ p: 2, height: '100%' }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <School sx={{ mr: 1 }} fontSize="small" /> Academic Information
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <School fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">
                          <strong>{user.degree}</strong> in {user.course}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Class fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">Class: {user.classes}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Grade fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">CGPA: {user.cgpa}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <CalendarMonth fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">Graduation Year: {user.yearOfPassing}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Report fontSize="small" color="action" sx={{ mr: 1.5 }} />
                        <Typography variant="body1">Active Backlogs: {user.activeBacklogs}</Typography>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Academic Records */}
                  <Grid item xs={12}>
                    <Card elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <WorkOutline sx={{ mr: 1 }} fontSize="small" /> Previous Education
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          {/* Using a fixed height box to ensure all columns are same height */}
                          <Box sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="subtitle2" color="text.secondary">10th Percentage</Typography>
                            <Typography variant="h5" fontWeight="medium" color="primary">
                              {user.tenthPercentage}%
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="subtitle2" color="text.secondary">12th Percentage</Typography>
                            <Typography variant="h5" fontWeight="medium" color="primary">
                              {user.twelfthPercentage}%
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                          }}>
                            <Typography variant="subtitle2" color="text.secondary">Diploma Percentage</Typography>
                            <Typography variant="h5" fontWeight="medium" color="primary">
                              {user.diplomaPercentage > 0 ? `${user.diplomaPercentage}%` : 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                              <WatchLater fontSize="small" color="action" sx={{ mr: 1.5 }} />
                              <Typography variant="body1">Gap Year(s): {user.gapYear}</Typography>
                            </Box>
                          </Grid>

                          {user.school12th && (
                            <Grid item xs={12} md={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <School fontSize="small" color="action" sx={{ mr: 1.5 }} />
                                <Typography variant="body1">12th School: {user.school12th}</Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Card>
                  </Grid>

                  {/* Resume */}
                  {user.resumeURL && (
                    <Grid item xs={12}>
                      <Card elevation={2} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Description sx={{ mr: 1 }} fontSize="small" /> Resume
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            component="a"
                            href={user.resumeURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<OpenInNew />}
                          >
                            View Resume
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

// Add the missing icons imports
const Person = Email;
const Class = School;
const Grade = School;
const Report = School;
const GradeOutlined = School;
const WatchLater = CalendarMonth;
const Public = LocationOn;

export default Profile;