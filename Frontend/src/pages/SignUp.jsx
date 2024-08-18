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
import { FirebaseContext } from '../context/Firebase';

const SignUp = () => {
  const firebase = React.useContext(FirebaseContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [degree, setDegree] = useState('');
  const [course, setCourse] = useState('');
  const [sgpa1, setSgpa1] = useState('');
  const [sgpa2, setSgpa2] = useState('');
  const [sgpa3, setSgpa3] = useState('');
  const [sgpa4, setSgpa4] = useState('');
  const [sgpa5, setSgpa5] = useState('');
  const [sgpa6, setSgpa6] = useState('');
  const [twelfthPercentage, setTwelfthPercentage] = useState('');
  const [diplomaPercentage, setDiplomaPercentage] = useState('');
  const [nationality, setNationality] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [address, setAddress] = useState('');
  const [school12th, setSchool12th] = useState('');
  const [tenthPercentage, setTenthPercentage] = useState('');
  const [gapYear, setGapYear] = useState('');
  const [specialisation, setSpecialisation] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('');
  const [backlogs1, setBacklogs1] = useState('');
  const [backlogs2, setBacklogs2] = useState('');
  const [backlogs3, setBacklogs3] = useState('');
  const [backlogs4, setBacklogs4] = useState('');
  const [backlogs5, setBacklogs5] = useState('');
  const [backlogs6, setBacklogs6] = useState('');

  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await firebase.signUpUser({
        name,
        email,
        password,
        dob,
        degree,
        course,
        sgpa1,
        sgpa2,
        sgpa3,
        sgpa4,
        sgpa5,
        sgpa6,
        twelfthPercentage,
        diplomaPercentage,
        nationality,
        cgpa,
        address,
        school12th,
        tenthPercentage,
        gapYear,
        specialisation,
        yearOfPassing,
        backlogs1,
        backlogs2,
        backlogs3,
        backlogs4,
        backlogs5,
        backlogs6,
      });
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            label="SGPA 1st Semester"
            value={sgpa1}
            onChange={(e) => setSgpa1(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="SGPA 2nd Semester"
            value={sgpa2}
            onChange={(e) => setSgpa2(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="SGPA 3rd Semester"
            value={sgpa3}
            onChange={(e) => setSgpa3(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="SGPA 4th Semester"
            value={sgpa4}
            onChange={(e) => setSgpa4(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="SGPA 5th Semester"
            value={sgpa5}
            onChange={(e) => setSgpa5(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="SGPA 6th Semester"
            value={sgpa6}
            onChange={(e) => setSgpa6(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Twelfth/Diploma Percentage"
            value={twelfthPercentage}
            onChange={(e) => setTwelfthPercentage(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Diploma Percentage"
            value={diplomaPercentage}
            onChange={(e) => setDiplomaPercentage(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Nationality"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="CGPA"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="School for 12th/Diploma"
            value={school12th}
            onChange={(e) => setSchool12th(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Tenth Percentage"
            value={tenthPercentage}
            onChange={(e) => setTenthPercentage(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Gap Year"
            value={gapYear}
            onChange={(e) => setGapYear(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Specialisation"
            value={specialisation}
            onChange={(e) => setSpecialisation(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Year of Passing"
            value={yearOfPassing}
            onChange={(e) => setYearOfPassing(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 1st Semester"
            value={backlogs1}
            onChange={(e) => setBacklogs1(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 2nd Semester"
            value={backlogs2}
            onChange={(e) => setBacklogs2(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 3rd Semester"
            value={backlogs3}
            onChange={(e) => setBacklogs3(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 4th Semester"
            value={backlogs4}
            onChange={(e) => setBacklogs4(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 5th Semester"
            value={backlogs5}
            onChange={(e) => setBacklogs5(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Backlogs 6th Semester"
            value={backlogs6}
            onChange={(e) => setBacklogs6(e.target.value)}
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
