import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import AddJob from '../pages/AddJob';
import { Tabs, Tab, Box, Button, TextField, Slider, Select, MenuItem } from '@mui/material';
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
    classes: '',
    cgpa: [0, 10],
    yearOfPassing: '',
    gapYear: '',
    activeBacklogs: ''
  });
  const [jobFilters, setJobFilters] = useState({
    jobTitle: '',
    location: '',
    type: '',
    ctc: [0, 100]
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
        classes: '',
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
        ctc: [0, 100]
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

        {/* Filters Section */}
        <Box sx={{ display: {sm:'none', xs:'none', md:'flex'}, gap:'4px', justifyContent: 'center', alignItems:'center', padding: 2 }}>
          {tabValue === 'student' && (
            <>
              <TextField
                name="degree"
                label="Degree"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}

                value={userFilters?.degree}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <TextField
                name="course"
                label="Course"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}

                value={userFilters?.course}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <TextField
                name="classes"
                label="Class"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}

                value={userFilters?.classes}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <TextField
                name="yearOfPassing"
                label="Year of Passing"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}

                value={userFilters?.yearOfPassing}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <TextField
                name="gapYear"
                label="Gap Year"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}

                value={userFilters?.gapYear}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <TextField
                name="activeBacklogs"
                label="Active Backlogs"
                sx={{width:'130px', height:'60px', marginRight:'2px'}}
                value={userFilters.activeBacklogs}
                onChange={handleUserFilterChange}
                margin="normal"
              />
              <Box sx={{ marginX: 1 }}>
                <div>Twelfth Percentage: {userFilters?.twelfthPercentage[0]}% - {userFilters?.twelfthPercentage[1]}%</div>
                <Slider
                  value={userFilters.twelfthPercentage}
                  onChange={handleUserSliderChange('twelfthPercentage')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  sx={{width:'20ch'}}

                />
              </Box>
              <Box sx={{ marginX: 2 }}>
                <div>CGPA: {userFilters?.cgpa[0]} - {userFilters?.cgpa[1]}</div>
                <Slider
                  value={userFilters?.cgpa}
                  onChange={handleUserSliderChange('cgpa')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.1}
                  sx={{width:'14ch'}}
                />
              </Box>
              <Button sx={{width:'130px', height:'60px', marginX:'2px'}} variant="contained" onClick={applyFilters}>Apply Filters</Button>
              <Button sx={{width:'130px', height:'60px', marginX:'2px'}} variant="outlined" onClick={resetFilters}>Reset Filters</Button>
            </>
          )}
          {tabValue === 'company' && (
            <>
              <TextField
                name="jobTitle"
                label="Job Title"
                value={jobFilters.jobTitle}
                onChange={handleJobFilterChange}
                margin="normal"
                sx={{width:'190px', height:'60px', marginRight:'2px'}}

              />
              <TextField
                name="location"
                label="Location"
                value={jobFilters.location}
                onChange={handleJobFilterChange}
                margin="normal"
                sx={{width:'190px', height:'60px', marginRight:'2px'}}

              />
              <TextField
                name="type"
                label="Type"
                value={jobFilters.type}
                onChange={handleJobFilterChange}
                margin="normal"
                sx={{width:'190px', height:'60px', marginRight:'2px'}}

              />
              <Box sx={{ marginX: 2 }}>
                <div>CTC: {jobFilters.ctc[0]} - {jobFilters.ctc[1]}</div>
                <Slider
                  value={jobFilters.ctc}
                  onChange={handleJobSliderChange('ctc')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  sx={{width:'24ch'}}
                />
              </Box>
              <Button sx={{width:'130px', height:'60px', marginX:'2px'}} variant="contained" onClick={applyFilters}>Apply Filters</Button>
              <Button sx={{width:'130px', height:'60px', marginX:'2px'}} variant="outlined" onClick={resetFilters}>Reset Filters</Button>
            </>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ padding: 2 }}>
          {tabValue === 'student' && (
            <div className="flex flex-wrap justify-center">
              {users
                .filter(user => !user.isAdmin).map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
          {tabValue === 'company' && (
            <div className="flex flex-wrap justify-center">
              {jobs.map(job => (
                <JobData key={job._id} job={job} />
              ))}
            </div>
          )}
          {tabValue === 'add-job' && (
            <div className="flex justify-center items-center">
              <AddJob />
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
