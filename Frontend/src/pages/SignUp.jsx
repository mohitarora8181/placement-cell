import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Avatar,
  CssBaseline,
  Container,
  Link,
  Box,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    dob: '',
    degree: '',
    course: '',
    twelfthPercentage: '',
    diplomaPercentage: '',
    nationality: '',
    cgpa: '',
    address: '',
    school12th: '',
    tenthPercentage: '',
    gapYear: '',
    yearOfPassing: '',
    activeBacklogs: '',
    contactNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/users/sign-up', formData, config);
      const { _id, token, ...rest } = data;

      // Check if _id is defined
      if (_id) {
        console.log('User ID:', _id);
        localStorage.setItem('userId', _id); // Store the user ID
      } else {
        console.error('User ID is missing in the response');
      }

      alert('Registration Successful');
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/sign-in');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
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
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={key.replace(/([A-Z])/g, ' $1').trim()}
              name={key}
              type={key === 'password' ? 'password' : key === 'dob' ? 'date' : 'text'}
              value={formData[key]}
              onChange={handleChange}
              InputLabelProps={key === 'dob' ? { shrink: true } : {}}
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ margin: '24px 0 16px', background: '#ea580c', color: 'white' }}
            disabled={loading}
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
      <Box mt={3}>
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
