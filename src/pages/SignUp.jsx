import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Avatar, CssBaseline, Container, Link, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { FirebaseContext } from '../context/Firebase';

const SignUp = () => {
  const firebase = React.useContext(FirebaseContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [course, setCourse] = useState('');
  const [dob, setDob] = useState('');
  const [resume, setResume] = useState(''); // File state

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await firebase.signUpUser(email, password, name, dob, course, degree, resume);
      navigate('/sign-in');
    } catch (error) {
      setError('Error signing up: ' + error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar style={{ margin: '8px', backgroundColor: '#ea580c' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form style={{ width: '100%', marginTop: '8px' }} onSubmit={handleSignUp}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Date of Birth"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Resume"
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ margin: '24px 0 16px', background: '#ea580c', color: 'white' }}
          >
            Sign Up
          </Button>
          {error && (
            <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
              {error}
            </Typography>
          )}
        </form>
      </div>
      <Box mt={8}>
        <Typography variant="body2" color="textSecondary" align="center">
          <Link href="/sign-in" color="inherit">
            Sign In
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
