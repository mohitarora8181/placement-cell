import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, TextField, Grid, Paper, Typography } from '@mui/material'
import axios from 'axios'
import Navbar from '../components/Navbar'

const EditProfile = () => {
  const [userData, setUserData] = useState({})
  const [errors, setErrors] = useState({})
  const userId = localStorage.getItem('userId')?.trim()
  const token = localStorage.getItem('token')?.trim()
  const navigate = useNavigate()

  useEffect(() => {
    if (userId && token) {
      const fetchUserData = async () => {
        try {
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
    if (!userData.fullname.trim()) newErrors.fullname = 'Full name is required.'
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
      return // Stop the form submission if there are errors
    }

    try {
      // Object.entries(userData).forEach(([key, val]) => {
      //   if (val == "") {
      //     userData[key] = 0;
      //   }
      // });
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/users/update-profile/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      alert('Profile updated successfully!')
      navigate('/profile') // Redirect to profile page
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile.')
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex justify-center items-center min-h-screen bg-gray-100 py-6'>
        <Paper
          elevation={3}
          style={{
            padding: '20px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <Typography
            variant='h4'
            gutterBottom
            align='center'
            style={{ fontWeight: 'bold', marginBottom: '20px' }}
          >
            Edit Profile
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label='Full Name'
                fullWidth
                name='fullname'
                value={userData.fullname || ''}
                onChange={handleInputChange}
                error={!!errors.fullname}
                helperText={errors.fullname || ''}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Email'
                fullWidth
                name='email'
                value={userData.email || ''}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email || ''}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Date of Birth'
                fullWidth
                name='dob'
                type='date'
                value={userData.dob ? userData.dob.split('T')[0] : ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label='Degree'
                fullWidth
                name='degree'
                value={userData.degree || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Course'
                fullWidth
                name='course'
                value={userData.course || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Classes'
                fullWidth
                name='classes'
                value={userData.classes || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Enrollment Number'
                fullWidth
                name='enrollmentNumber'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.enrollmentNumber || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='12th Percentage'
                fullWidth
                name='twelfthPercentage'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.twelfthPercentage || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Diploma Percentage'
                fullWidth
                name='diplomaPercentage'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.diplomaPercentage}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Nationality'
                fullWidth
                name='nationality'
                value={userData.nationality || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='CGPA'
                fullWidth
                name='cgpa'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.cgpa || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Address'
                fullWidth
                name='address'
                value={userData.address || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='School (12th)'
                fullWidth
                name='school12th'
                value={userData.school12th || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='10th Percentage'
                fullWidth
                name='tenthPercentage'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.tenthPercentage || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Gap Year'
                fullWidth
                name='gapYear'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.gapYear}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Year of Passing'
                fullWidth
                name='yearOfPassing'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.yearOfPassing || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Active Backlogs'
                fullWidth
                name='activeBacklogs'
                type='number'
                onWheel={(e) => e.target.blur()}
                value={userData.activeBacklogs}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='Contact Number'
                fullWidth
                name='contactNumber'
                value={userData.contactNumber || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='LinkedIn'
                fullWidth
                name='linkedin'
                value={userData.linkedin || ''}
                onChange={handleInputChange}
                error={!!errors.linkedin}
                helperText={errors.linkedin || ''}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='GitHub'
                fullWidth
                name='github'
                value={userData.github || ''}
                onChange={handleInputChange}
                error={!!errors.github}
                helperText={errors.github || ''}
                style={{ marginBottom: '16px' }}
              />
              <TextField
                label='LeetCode'
                fullWidth
                name='leetCode'
                value={userData.leetCode || ''}
                onChange={handleInputChange}
                error={!!errors.leetCode}
                helperText={errors.leetCode || ''}
                style={{ marginBottom: '16px' }}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button
                variant='contained'
                color='primary'
                onClick={handleSubmit}
                style={{ marginTop: '16px' }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  )
}

export default EditProfile
