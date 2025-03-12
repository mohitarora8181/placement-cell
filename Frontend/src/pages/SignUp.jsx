import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import logo from '../images/logo-pc.png'
import image1 from '../images/image1.jpg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SignUp = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    dob: '',
    contactNumber: '',
    degree: 'Bachelor of Technology',
    course: '',
    classes: '',
    enrollmentNumber: '',
    yearOfPassing: '',
    cgpa: '',
    twelfthPercentage: '',
    diplomaPercentage: '',
    tenthPercentage: '',
    school12th: '',
    address: '',
    gapYear: '',
    activeBacklogs: '',
    nationality: 'Indian',
    linkedin: '',
    github: '',
    leetCode: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    if (formData.contactNumber.length < 10) {
      toast.error('Wrong Contact Number')
      setLoading(false)
      return
    }

    if (formData.enrollmentNumber.length < 10) {
      toast.error('Wrong Enrollment Number')
      setLoading(false)
      return
    }

    if (formData.twelfthPercentage > 100) {
      toast.error('Twelfth Percentage should between 0 to 100')
      setLoading(false)
      return
    }

    if (formData.tenthPercentage > 100) {
      toast.error('Tenth Percentage should between 0 to 100')
      setLoading(false)
      return
    }

    if (formData.diplomaPercentage > 100) {
      toast.error('Diploma Percentage should between 0 to 100')
      setLoading(false)
      return
    }

    if (formData.cgpa > 10) {
      toast.error('CGPA should between 0 to 10')
      setLoading(false)
      return
    }

    if (!formData.linkedin.toLowerCase().includes("linkedin.com")) {
      toast.error('Wrong Linkedin Url')
      setLoading(false)
      return
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/users/sign-up`,
        formData,
        config
      )
      const { _id, token, ...rest } = data

      if (_id) {
        localStorage.setItem('userId', _id)
        localStorage.setItem('userInfo', JSON.stringify(data))
        toast.success('Registration Successful')
        navigate('/sign-in')
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred')
      toast.error(error.response?.data?.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  return (
    <>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          width: { sm: '90%', xs: '90%' },
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${image1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 0.3,
            zIndex: -2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            zIndex: -1,
          }}
        />
        <Container
          component='main'
          maxWidth='md'
          style={{ width: '100%', margin: '4px' }}
        >
          <CssBaseline />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(34, 34, 34)',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              color: '#f5f5f5',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            <Avatar style={{ margin: '0px', backgroundColor: '#BB86FC' }}>
              <LockOutlinedIcon />
            </Avatar>
            <img
              src={logo}
              className='h-24'
              alt='Pc logo'
              style={{ marginBottom: '0px' }}
            />
            <Typography
              component='h1'
              variant='h5'
              style={{
                color: '#BB86FC',
                fontWeight: 'bold',
                transition: 'color 0.3s',
              }}
            >
              Sign Up
            </Typography>
            <form
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '0px',
              }}
              onSubmit={handleSignUp}
            >
              {Object.keys(formData).map((key) =>
                key === 'course' ? (
                  <FormControl
                    key={key}
                    variant='outlined'
                    margin='normal'
                    required
                    style={{
                      width: '100%',
                      maxWidth: '585px',
                      marginBottom: '16px',
                      backgroundColor: '#444',
                    }}
                  >
                    <InputLabel style={{ color: '#f5f5f5' }}>Course</InputLabel>
                    <Select
                      name='course'
                      value={formData.course}
                      onChange={handleChange}
                      style={{ color: '#f5f5f5' }}
                      label='Course'
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#444',
                            color: '#f5f5f5',
                          },
                        },
                      }}
                    >
                      <MenuItem value='Computer Engineering'>
                        Computer Science Engineering
                      </MenuItem>
                      <MenuItem value='Information Technology'>
                        Information Technology
                      </MenuItem>
                      <MenuItem value='Electronics & Communication Engineering'>
                        Electronics & Communication Engineering
                      </MenuItem>
                      <MenuItem value='Electrical Engineering'>
                        Electrical Engineering
                      </MenuItem>
                    </Select>
                  </FormControl>
                ) : key === 'classes' ? (
                  <FormControl
                    key={key}
                    variant='outlined'
                    margin='normal'
                    required
                    style={{
                      width: '100%',
                      maxWidth: '585px',
                      marginBottom: '16px',
                      backgroundColor: '#444',
                    }}
                  >
                    <InputLabel style={{ color: '#f5f5f5' }}>Class</InputLabel>
                    <Select
                      name='classes'
                      value={formData.classes}
                      onChange={handleChange}
                      style={{ color: '#f5f5f5' }}
                      label='Class'
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: '#444',
                            color: '#f5f5f5',
                          },
                        },
                      }}
                    >
                      <MenuItem value='CSE-1'>CSE-1</MenuItem>
                      <MenuItem value='CSE-2'>CSE-2</MenuItem>
                      <MenuItem value='CSE-3'>CSE-3</MenuItem>
                      <MenuItem value='CSE-4'>CSE-4</MenuItem>
                      <MenuItem value='IT-1'>IT-1</MenuItem>
                      <MenuItem value='IT-2'>IT-2</MenuItem>
                      <MenuItem value='IT-3'>IT-3</MenuItem>
                      <MenuItem value='ECE-1'>ECE-1</MenuItem>
                      <MenuItem value='ECE-2'>ECE-2</MenuItem>
                      <MenuItem value='ECE-3'>ECE-3</MenuItem>
                      <MenuItem value='EEE-1'>EEE-1</MenuItem>
                      <MenuItem value='EEE-2'>EEE-2</MenuItem>
                      <MenuItem value='EEE-3'>EEE-3</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    key={key}
                    variant='outlined'
                    margin='normal'
                    required={key == 'github' || key == 'leetCode' ? false : true}
                    style={{
                      width: '100%',
                      maxWidth: '585px',
                      marginBottom: '16px',
                      backgroundColor: '#444',
                      color: '#f5f5f5',
                      borderColor: '#666',
                    }}
                    sx={{
                      backgroundColor: '#444',
                      '& input': {
                        color: '#fff',
                      },
                      '& input:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 1000px #444 inset',
                        WebkitTextFillColor: '#fff',
                        transition: 'background-color 5000s ease-in-out 0s',
                      }
                    }}
                    onWheel={(e) => e.target.blur()}
                    label={
                      key === 'linkedin'
                        ? 'LinkedIn'
                        : key === 'github'
                          ? 'GitHub ( Optional )'
                          : key === 'leetCode'
                            ? 'LeetCode ( Optional )'
                            : key === 'twelfthPercentage'
                              ? '12th Percentage ( Type 0 if N.A.)'
                              : key === 'diplomaPercentage'
                                ? 'Diploma Percentage ( Type 0 if N.A.)'
                                : key == 'dob'
                                  ? 'DOB'
                                  : key == 'school12th'
                                    ? 'School'
                                    : capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1').trim())
                    }
                    name={key}
                    type={
                      key === 'email'
                        ? 'email'
                        : key === 'password'
                          ? showPassword
                            ? 'text'
                            : 'password'
                          : key === 'dob'
                            ? 'date'
                            : (key == 'twelfthPercentage' || key == 'enrollmentNumber' || key == 'diplomaPercentage' || key == 'tenthPercentage' || key == 'cgpa' || key == 'gapYear' || key == 'yearOfPassing' || key == "activeBacklogs")
                              ? 'number'
                              : 'text'
                    }
                    value={formData[key]}
                    onChange={handleChange}
                    InputLabelProps={{ style: { color: '#f5f5f5' } }}
                    InputProps={
                      key === 'password'
                        ? {
                          style: { color: '#f5f5f5' },
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge='end'
                                style={{
                                  color: '#f5f5f5',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }
                        : { style: { color: '#f5f5f5' } }
                    }
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#555'
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = '#444'
                    }}
                  />
                )
              )}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                style={{
                  margin: '24px 0 16px',
                  background: '#BB86FC',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
              {error && (
                <Typography
                  variant='body2'
                  color='error'
                  style={{ marginTop: '16px' }}
                >
                  {error}
                </Typography>
              )}
            </form>
            <div style={{ marginTop: '20px' }}>
              <Typography
                variant='body2'
                align='center'
                style={{ color: '#f5f5f5' }}
              >
                Already Have an Account?
              </Typography>
            </div>
            <Box mt={3}>
              <Typography variant='body2' align='center'>
                <Link
                  href='/sign-in'
                  style={{
                    color: '#BB86FC',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow =
                      '0 6px 12px rgba(0, 0, 0, 0.4)'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.background = '#9F62D8'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow =
                      '0 4px 8px rgba(0, 0, 0, 0.3)'
                    e.currentTarget.style.color = '#BB86FC'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </div>
        </Container>
      </div>
      <ToastContainer />
    </>
  )
}

export default SignUp
