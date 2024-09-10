import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import AddJob from '../pages/AddJob';
import { Tabs, Tab, Box, Button, TextField, Slider } from '@mui/material';
import axios from 'axios';
import UserCard from '../components/UserCard';
import JobData from '../components/JobData';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(localStorage.getItem('adminTab') || 'student');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [userFilters, setUserFilters] = useState({
    degree: '',
    course: '',
    twelfthPercentage: [0, 100],
    nationality: '',
    cgpa: [0, 10],
    yearOfPassing: '',
    gapYear: '',
    activeBacklogs: ''
  });
  const [jobFilters, setJobFilters] = useState({
    jobTitle: '',
    location: '',
    type: '',
    ctc: [0, 100] // Updated range
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    localStorage.setItem('adminTab', newValue);
  };

  const handleUserFilterChange = (e) => {
    setUserFilters({
      ...userFilters,
      [e.target.name]: e.target.value
    });
  };

  const handleJobFilterChange = (e) => {
    setJobFilters({
      ...jobFilters,
      [e.target.name]: e.target.value
    });
  };

  const handleUserSliderChange = (name) => (event, newValue) => {
    setUserFilters({
      ...userFilters,
      [name]: newValue
    });
  };

  const handleJobSliderChange = (name) => (event, newValue) => {
    setJobFilters({
      ...jobFilters,
      [name]: newValue
    });
  };

  const applyFilters = () => {
    fetchData(); // Fetch filtered data
  };

  const resetFilters = () => {
    if (tabValue === 'student') {
      setUserFilters({
        degree: '',
        course: '',
        twelfthPercentage: [0, 100],
        nationality: '',
        cgpa: [0, 10],
        yearOfPassing: '',
        gapYear: '',
        activeBacklogs: ''
      });
    } else if (tabValue === 'company') {
      setJobFilters({
        jobTitle: '',
        location: '',
        type: '',
        ctc: [0, 100] // Updated range
      });
    }
    fetchData(); 
  };

  const fetchData = async () => {
    try {
        if (tabValue === 'student') {
            const query = new URLSearchParams({
                ...userFilters,
                twelfthPercentage: userFilters.twelfthPercentage.join(','),
                cgpa: userFilters.cgpa.join(',')
            }).toString();
            const response = await axios.get(`/api/users/find?${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setUsers(response.data);
        } else if (tabValue === 'company') {
            const query = new URLSearchParams({
                ...jobFilters,
                ctc: jobFilters.ctc.join(',')
            }).toString();
            const response = await axios.get(`/api/companies?${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setJobs(response.data);
        }
    } catch (error) {
        console.error(`Error fetching ${tabValue}:`, error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data whenever the tab or filters change
  }, [tabValue, userFilters, jobFilters]);

  return (
    <>
      <AdminNav />
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Students" value="student" />
          <Tab label="Companies" value="company" />
          <Tab label="Add Job" value="add-job" />
        </Tabs>
        <Box sx={{ display: 'flex', padding: 4 }}>
          {tabValue === 'student' && (
            <Box sx={{ width: '25%', paddingRight: 2 }}>
              <TextField
                name="degree"
                label="Degree"
                value={userFilters.degree}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="course"
                label="Course"
                value={userFilters.course}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ marginTop: 2 }}>
                <div>Twelfth Percentage: {userFilters.twelfthPercentage[0]}% - {userFilters.twelfthPercentage[1]}%</div>
                <Slider
                  value={userFilters.twelfthPercentage}
                  onChange={handleUserSliderChange('twelfthPercentage')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <div>CGPA: {userFilters.cgpa[0]} - {userFilters.cgpa[1]}</div>
                <Slider
                  value={userFilters.cgpa}
                  onChange={handleUserSliderChange('cgpa')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.1}
                />
              </Box>
              <TextField
                name="nationality"
                label="Nationality"
                value={userFilters.nationality}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="yearOfPassing"
                label="Year of Passing"
                value={userFilters.yearOfPassing}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="gapYear"
                label="Gap Year"
                value={userFilters.gapYear}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="activeBacklogs"
                label="Active Backlogs"
                value={userFilters.activeBacklogs}
                onChange={handleUserFilterChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outlined" onClick={resetFilters}>Reset Filters</Button>
              </Box>
            </Box>
          )}
          {tabValue === 'company' && (
            <Box sx={{ width: '25%', paddingRight: 2 }}>
              <TextField
                name="jobTitle"
                label="Job Title"
                value={jobFilters.jobTitle}
                onChange={handleJobFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="location"
                label="Location"
                value={jobFilters.location}
                onChange={handleJobFilterChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="type"
                label="Type"
                value={jobFilters.type}
                onChange={handleJobFilterChange}
                fullWidth
                margin="normal"
              />
              <Box sx={{ marginTop: 2 }}>
                <div>CTC: {jobFilters.ctc[0]} - {jobFilters.ctc[1]}</div>
                <Slider
                  value={jobFilters.ctc}
                  onChange={handleJobSliderChange('ctc')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100} // Updated range
                  step={1}
                />
              </Box>
              <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
                <Button variant="outlined" onClick={resetFilters}>Reset Filters</Button>
              </Box>
            </Box>
          )}
          <Box sx={{ width: tabValue === 'student' ? '75%' : '100%' }}>
            {tabValue === 'student' && (
              <div className='flex flex-wrap justify-start'>
                {users.map(user => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            )}
            {tabValue === 'company' && (
              <div className='flex flex-wrap justify-start'>
                {jobs.map(job => (
                  <JobData key={job._id} job={job} />
                ))}
              </div>
            )}
            {tabValue === 'add-job' && (
              <div className="w-full max-w-2xl">
                <AddJob />
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
