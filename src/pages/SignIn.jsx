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

const SignIn = () => {
  const firebase = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  console.log(firebase);

  const handleSignIn = async (e) => {

    e.preventDefault();
    if(firebase.loggedIn){
      navigate('/');
    }
    
    await firebase.signInUser(email, password);

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
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            sx={{ background: '#ea580c' }}
            type='submit'
            fullWidth
            variant='contained'
            style={{ margin: '24px 0 16px' }}
            // color='primary'
          >
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
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
  )
}

export default SignIn;
