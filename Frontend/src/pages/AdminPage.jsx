import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import AddJob from '../pages/AddJob';
import { Tabs, Tab, Box } from '@mui/material';
import axios from 'axios';
import UserCard from '../components/UserCard';
import JobData from '../components/JobData';

const AdminPage = () => {
  // Retrieve the last selected tab from local storage, default to 'student'
  const [tabValue, setTabValue] = useState(localStorage.getItem('adminTab') || 'student');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Save the selected tab to local storage
    localStorage.setItem('adminTab', newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tabValue === 'student') {
          const response = await axios.get('/api/users/find');
          setUsers(response.data);
        } else if (tabValue === 'company') {
          const response = await axios.get('/api/jobs');
          setJobs(response.data);
        }
      } catch (error) {
        console.error(`Error fetching ${tabValue}:`, error);
      }
    };

    fetchData();
  }, [tabValue]);

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
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems:'center',  }}>
          {tabValue === 'student' && (
            <div className="flex flex-wrap items-center justify-center w-[95%]">
              {users.map(user => (
                <UserCard key={user._id} user={user} />
              ))}
            </div>
          )}
          {tabValue === 'company' && (
            <div className="flex flex-wrap items-center justify-center w-[95%]">
              {jobs.map(job => (
                <JobData key={job._id} job={job} />
              ))}
            </div>
          )}
          {tabValue === 'add-job' && (
            <div className="w-full max-w-2xl ">
              <AddJob />
            </div>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
