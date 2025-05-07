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
  Card,
  CircularProgress
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
  const [submitting, setSubmitting] = useState(false)
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
            timeout: 10000 // 10 second timeout
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
        } catch (error) {
          console.error('Error fetching user data:', error)
          setNotification({
            open: true,
            message: 'Failed to load profile data. Please try again.',
            severity: 'error'
          })
        } finally {
          setLoading(false)
        }
      }

      fetchUserData()
    } else {
      setNotification({
        open: true,
        message: 'Authentication required. Please log in again.',
        severity: 'error'
      })
      navigate('/sign-in')
    }
  }, [userId, token, navigate])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    // Clear error for this field when the user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    setUserData({ ...userData, [name]: value })
  }

  // Validation function
  const validateInputs = () => {
    const newErrors = {}
    if (!userData.fullname?.trim()) {
      newErrors.fullname = 'Full name is required'
    }

    if (!userData.enrollmentNumber) {
      newErrors.enrollmentNumber = 'Enrollment number is required'
    }

    if (userData.cgpa && (isNaN(userData.cgpa) || parseFloat(userData.cgpa) < 0 || parseFloat(userData.cgpa) > 10)) {
      newErrors.cgpa = 'CGPA must be between 0 and 10'
    }

    if (userData.tenthPercentage && (isNaN(userData.tenthPercentage) || parseFloat(userData.tenthPercentage) < 0 || parseFloat(userData.tenthPercentage) > 100)) {
      newErrors.tenthPercentage = 'Percentage must be between 0 and 100'
    }

    if (userData.twelfthPercentage && (isNaN(userData.twelfthPercentage) || parseFloat(userData.twelfthPercentage) < 0 || parseFloat(userData.twelfthPercentage) > 100)) {
      newErrors.twelfthPercentage = 'Percentage must be between 0 and 100'
    }

    if (userData.diplomaPercentage && (isNaN(userData.diplomaPercentage) || parseFloat(userData.diplomaPercentage) < 0 || parseFloat(userData.diplomaPercentage) > 100)) {
      newErrors.diplomaPercentage = 'Percentage must be between 0 and 100'
    }

    const validateSimpleUrl = (url, domain) => {
      if (!url || url.trim() === '') return true
      return url.includes(domain)
    }

    if (!validateSimpleUrl(userData.linkedin, 'linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL (containing linkedin.com)'
    }

    if (!validateSimpleUrl(userData.github, 'github.com')) {
      newErrors.github = 'Please enter a valid GitHub URL (containing github.com)'
    }

    if (!validateSimpleUrl(userData.leetCode, 'leetcode.com')) {
      newErrors.leetCode = 'Please enter a valid LeetCode URL (containing leetcode.com)'
    }

    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validateInputs()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setNotification({
        open: true,
        message: 'Please fix the errors in the form',
        severity: 'error'
      })
      return
    }
    if (submitting) return

    setSubmitting(true)

    try {
      const formattedData = {
        ...userData,
        cgpa: userData.cgpa === '' ? null : parseFloat(userData.cgpa),
        tenthPercentage: userData.tenthPercentage === '' ? null : parseFloat(userData.tenthPercentage),
        twelfthPercentage: userData.twelfthPercentage === '' ? null : parseFloat(userData.twelfthPercentage),
        diplomaPercentage: userData.diplomaPercentage === '' ? null : parseFloat(userData.diplomaPercentage),
        yearOfPassing: userData.yearOfPassing === '' ? null : parseInt(userData.yearOfPassing),
        gapYear: userData.gapYear === '' ? null : parseInt(userData.gapYear),
        activeBacklogs: userData.activeBacklogs === '' ? null : parseInt(userData.activeBacklogs),
        enrollmentNumber: userData.enrollmentNumber === '' ? null : userData.enrollmentNumber,
      }

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/users/update-profile/${userId}`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 second timeout to prevent hanging
        }
      )

      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      })

      setTimeout(() => {
        navigate(-1, { replace: true })
      }, 1000)

    } catch (error) {
      console.error('Error updating profile:', error)

      const errorMessage = error.response?.data?.message ||
        'Failed to update profile. Please try again.'

      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Show loading state when initially fetching data
  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading profile data...
          </Typography>
        </Container>
      </>
    )
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
                    required
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
                    disabled
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
                    error={!!errors.dob}
                    helperText={errors.dob || ''}
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
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber || ''}
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
                    error={!!errors.nationality}
                    helperText={errors.nationality || ''}
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
                    error={!!errors.address}
                    helperText={errors.address || ''}
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
                    error={!!errors.degree}
                    helperText={errors.degree || ''}
                    sx={{ mb: 2 }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Course"
                    fullWidth
                    name="course"
                    value={userData.course || ''}
                    onChange={handleInputChange}
                    error={!!errors.course}
                    helperText={errors.course || ''}
                    sx={{ mb: 2 }}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Classes"
                    fullWidth
                    name="classes"
                    value={userData.classes || ''}
                    onChange={handleInputChange}
                    error={!!errors.classes}
                    helperText={errors.classes || ''}
                    sx={{ mb: 2 }}
                    disabled
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
                    error={!!errors.enrollmentNumber}
                    helperText={errors.enrollmentNumber || ''}
                    sx={{ mb: 2 }}
                    required
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
                    error={!!errors.cgpa}
                    helperText={errors.cgpa || 'Enter a value between 0 and 10'}
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
                    error={!!errors.yearOfPassing}
                    helperText={errors.yearOfPassing || ''}
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
                    error={!!errors.activeBacklogs}
                    helperText={errors.activeBacklogs || ''}
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
                    error={!!errors.gapYear}
                    helperText={errors.gapYear || ''}
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
                    error={!!errors.tenthPercentage}
                    helperText={errors.tenthPercentage || 'Enter a value between 0 and 100'}
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
                    error={!!errors.twelfthPercentage}
                    helperText={errors.twelfthPercentage || 'Enter a value between 0 and 100'}
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
                    error={!!errors.diplomaPercentage}
                    helperText={errors.diplomaPercentage || 'Enter a value between 0 and 100'}
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
                    error={!!errors.school12th}
                    helperText={errors.school12th || ''}
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
                    error={!!errors.resumeURL}
                    helperText={errors.resumeURL || 'Paste a link to your resume (Google Drive, Dropbox, etc.)'}
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
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                size="large"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
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