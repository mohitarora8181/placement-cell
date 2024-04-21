import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';
import { useContext } from 'react';
import { FirebaseContext } from '../context/Firebase';


import {
  Avatar,
  Button,
  CssBaseline,
  TextField,

  Link,

  Box,
  Typography,
  Container,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const SignUp = () => {
  const firebase = useContext(FirebaseContext);

  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [course, setCourse] = useState('');
  const [dob, setDob] = useState(null);
  const [cgpa, setCGPA] = useState('');

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const handleSignUp = async(e) => {
    e.preventDefault();
    await firebase.signUpUser(email,password);
    navigate('/sign-in');

  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar style={{ margin: '8px', backgroundColor: '#ea580c' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign Up
        </Typography>
        <form
          style={{ width: '100%', marginTop: '8px' }}
          onSubmit={handleSignUp}
        >
            <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='name'
            label='Name'
            type='text'
            id='name'
            autoComplete='current-password'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

<TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='dob'
            label='Date of Birth'
            type='date'
            id='dob'
            // autoComplete='current-password'
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />

<TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='degree'
            label='degree'
            type='text'
            id='degree'
            // autoComplete='current-password'
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />

<TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='course'
            label='course'
            type='type'
            id='text'
            // autoComplete='current-password'
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />


          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            sx={{ background: '#ea580c' }}
            type='submit'
            fullWidth
            variant='contained'
            style={{ margin: '24px 0 16px' }}
            // color='primary'
          >
            Sign Up
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
      </div>
      <Box mt={8}>
        <Typography variant='body2' color='textSecondary' align='center'>

          <Link color='inherit' href='/sign-in'>
            sign in
          </Link>

        </Typography>
      </Box>
    </Container>
  )
}

export default SignUp;
