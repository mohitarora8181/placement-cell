import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../images/logo-pc.png'


const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://placement-cell-iczn.onrender.com/api/users/sign-in', { email, password });
      console.log('Sign-In Response:', data); // Log the response to check `isAdmin`
      const { _id, token, isAdmin } = data;

      if (_id) {
        localStorage.setItem('userId', _id);
        localStorage.setItem('token', token);
        localStorage.setItem('role', isAdmin ? 'admin' : 'user');
      } else {
        console.error('User ID is missing in the response');
      }

      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Sign In Error:', error.response?.data?.message);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className='p-10'>
      <div className='bg-white w-[50%] p-4 shadow-lg mx-auto rounded-md '>


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
      <img src={logo} className='h-24' alt="Pc logo"/>

        <Typography component='h1' variant='h5'>

          Sign In

        </Typography>

        <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleSignIn}>
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
            disabled={!email || !password}
          >
            Sign In
          </Button>
          {error && (
            <Typography variant='body2' color='error' style={{ marginTop: '16px' }}>
              {error}
            </Typography>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Typography variant='body2' color='textSecondary' align='center'>
          <Link color='inherit' href='/sign-up'>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
    </div>
    </div>
  );
};

export default SignIn;
