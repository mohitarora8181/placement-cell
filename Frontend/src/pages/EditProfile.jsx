import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  Card
} from '@mui/material'
import {
  Save,
  Person,
  School,
  LocationOn,
  Link as LinkIcon,
  Description,
  ArrowBack,
  WorkOutline
} from '@mui/icons-material'
import axios from 'axios'
import Navbar from '../components/Navbar'

const EditProfile = () => {
  const [userData, setUserData] = useState({})
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })

  const userId = localStorage.getItem('userId')?.trim()
  const token = localStorage.getItem('token')?.trim()
  const navigate = useNavigate()

  useEffect(() => {
    if (userId && token) {
      const fetchUserData = async () => {
        try {
          setLoading(true)
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUserData({
            fullname: response.data.fullname || '',
            email: response.data.email || '',
            dob: response.data.dob ? response.data.dob.split('T')[0] : '',
            degree: response.data.degree || '',
            course: response.data.course || '',
            classes: response.data.classes || '',
            enrollmentNumber: response.data.enrollmentNumber || '',
            resumeURL: response.data.resumeURL || '',
            twelfthPercentage: response.data.twelfthPercentage || '',
            diplomaPercentage: response.data.diplomaPercentage,
            nationality: response.data.nationality || '',
            cgpa: response.data.cgpa || '',
            address: response.data.address || '',
            school12th: response.data.school12th || '',
            tenthPercentage: response.data.tenthPercentage || '',
            gapYear: response.data.gapYear,
            yearOfPassing: response.data.yearOfPassing || '',
            activeBacklogs: response.data.activeBacklogs,
            contactNumber: response.data.contactNumber || '',
            linkedin: response.data.linkedin || '',
            github: response.data.github || '',
            leetCode: response.data.leetCode || '',
          })
          setLoading(false)
        } catch (error) {
          console.error('Error fetching user data:', error)
          setLoading(false)
        }
      }

      fetchUserData()
    }
  }, [userId, token])

  // Validation function
  const validateInputs = () => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const newErrors = {}
    if (!userData.fullname?.trim()) newErrors.fullname = 'Full name is required.'
    if (!emailRegex.test(userData.email)) newErrors.email = 'Enter a valid email address.'
    if (userData.github && !urlRegex.test(userData.github)) newErrors.github = 'Enter a valid GitHub URL.'
    if (userData.leetCode && !urlRegex.test(userData.leetCode)) newErrors.leetCode = 'Enter a valid LeetCode URL.'
    if (userData.linkedin && !urlRegex.test(userData.linkedin)) newErrors.linkedin = 'Enter a valid LinkedIn URL.'

    return newErrors
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async () => {
    const validationErrors = validateInputs()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setNotification({
        open: true,
        message: 'Please correct the errors before submitting',
        severity: 'error'
      })
      return // Stop the form submission if there are errors
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/users/update-profile/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })

      // We'll use setTimeout to ensure the user sees the success message before redirecting
      setTimeout(() => {
        navigate(-1, { replace: true });
      }, 500);

    } catch (error) {
      console.error('Error updating profile:', error)
      setNotification({
        open: true,
        message: 'Failed to update profile.',
        severity: 'error'
      })
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4
          }}
        >
          <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
            <IconButton
              sx={{ mr: 2, color: 'white' }}
              onClick={() => navigate(-1, { replace: true })}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Edit Profile
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Personal Information Section */}
            <Card elevation={1} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <Person sx={{ mr: 1 }} /> Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    name="fullname"
                    value={userData.fullname || ''}
                    onChange={handleInputChange}
                    error={!!errors.fullname}
                    helperText={errors.fullname || ''}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    name="email"
                    value={userData.email || ''}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email || ''}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date of Birth"
                    fullWidth
                    name="dob"
                    type="date"
                    value={userData.dob ? userData.dob.split('T')[0] : ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Number"
                    fullWidth
                    name="contactNumber"
                    value={userData.contactNumber || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nationality"
                    fullWidth
                    name="nationality"
                    value={userData.nationality || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Address"
                    fullWidth
                    name="address"
                    value={userData.address || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Academic Information Section */}
            <Card elevation={1} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <School sx={{ mr: 1 }} /> Academic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Degree"
                    fullWidth
                    name="degree"
                    value={userData.degree || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Course"
                    fullWidth
                    name="course"
                    value={userData.course || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Classes"
                    fullWidth
                    name="classes"
                    value={userData.classes || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Enrollment Number"
                    fullWidth
                    name="enrollmentNumber"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.enrollmentNumber || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="CGPA"
                    fullWidth
                    name="cgpa"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.cgpa || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Year of Passing"
                    fullWidth
                    name="yearOfPassing"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.yearOfPassing || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Active Backlogs"
                    fullWidth
                    name="activeBacklogs"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.activeBacklogs !== undefined ? userData.activeBacklogs : ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Gap Year"
                    fullWidth
                    name="gapYear"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.gapYear !== undefined ? userData.gapYear : ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Previous Education Section */}
            <Card elevation={1} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <WorkOutline sx={{ mr: 1 }} /> Previous Education
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="10th Percentage"
                    fullWidth
                    name="tenthPercentage"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.tenthPercentage || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="12th Percentage"
                    fullWidth
                    name="twelfthPercentage"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.twelfthPercentage || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Diploma Percentage"
                    fullWidth
                    name="diplomaPercentage"
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    value={userData.diplomaPercentage !== undefined ? userData.diplomaPercentage : ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="School (12th)"
                    fullWidth
                    name="school12th"
                    value={userData.school12th || ''}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Social Links Section */}
            <Card elevation={1} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <LinkIcon sx={{ mr: 1 }} /> Social Links
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="LinkedIn"
                    fullWidth
                    name="linkedin"
                    value={userData.linkedin || ''}
                    onChange={handleInputChange}
                    error={!!errors.linkedin}
                    helperText={errors.linkedin || 'Example: https://linkedin.com/in/yourprofile'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="GitHub"
                    fullWidth
                    name="github"
                    value={userData.github || ''}
                    onChange={handleInputChange}
                    error={!!errors.github}
                    helperText={errors.github || 'Example: https://github.com/yourusername'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="LeetCode"
                    fullWidth
                    name="leetCode"
                    value={userData.leetCode || ''}
                    onChange={handleInputChange}
                    error={!!errors.leetCode}
                    helperText={errors.leetCode || 'Example: https://leetcode.com/yourusername'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Resume Section */}
            <Card elevation={1} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                <Description sx={{ mr: 1 }} /> Resume
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Resume URL"
                    fullWidth
                    name="resumeURL"
                    value={userData.resumeURL || ''}
                    onChange={handleInputChange}
                    helperText="Paste a link to your resume (Google Drive, Dropbox, etc.)"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {userData.resumeURL && (
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Your resume needs to be currently available at this{' '}
                      <a href={userData.resumeURL} target="_blank" className='underline' rel="noopener noreferrer">
                        link
                      </a>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Card>

            {/* Form Actions */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', pt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1, { replace: true })}
                size="large"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={<Save />}
                size="large"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditProfile