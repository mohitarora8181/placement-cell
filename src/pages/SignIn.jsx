import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignIn = () => {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('cb');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await firebase.signInUser(email, password);
      if (firebase.loggedIn) {
        if (callbackUrl) {
          navigate(callbackUrl);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

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
          Sign in
        </Typography>
        <form
          style={{ width: '100%', marginTop: '8px' }}
          onSubmit={handleSignIn}
        >
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
          >
            Sign In
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
          <Link color='inherit' href='/sign-up'>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignIn;
