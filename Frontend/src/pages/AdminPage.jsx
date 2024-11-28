import React, { useState, useEffect } from 'react';
import AdminNav from '../components/AdminNav';
import AddJob from '../pages/AddJob';
import { Tabs, Tab, Box, Button, Slider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import UserCard from '../components/UserCard';
import JobData from '../components/JobData';
import TableListUi from '../components/TableListUi';
import * as XLSX from 'xlsx'

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(localStorage.getItem('adminTab') || 'student');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [toggleView, setToggleView] = useState(false);
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
    companyName: '',
    location: '',
    type: '',
    ctc: [0, 100]
  });

  const [filterFields, setFilterFields] = useState();

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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/find?${query}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setUsers(response.data);
      } else if (tabValue === 'company') {
        const query = new URLSearchParams({
          ...jobFilters,
          ctc: jobFilters?.ctc.join(',')
        }).toString();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/companies?${query}`, {
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

  useEffect(() => {
    setToggleView(localStorage.getItem('setView') == 'list');
    const fetchFilterFields = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/filterFields`).then(({ data }) => {
        setFilterFields(data);
        console.log(filterFields)
      })
    }
    fetchFilterFields();
  }, [])


  const downloadExcel = () => {
    if (tabValue == 'student') {
      if (users.length > 0) {
        const worksheet = XLSX.utils.table_to_sheet(document.querySelector('table'));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "StudentList.xlsx");
      }
    } else if (tabValue == 'company') {
      if (jobs.length > 0) {
        const output = JSON.parse(JSON.stringify(jobs));
        output.forEach(acc => {
          delete acc._id;
          delete acc.createdAt;
          delete acc.updatedAt;
          delete acc.__v;
          delete acc.shortlistedStudents;
          delete acc.applicants;
        });
        const worksheet = XLSX.utils.json_to_sheet(output);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "CompaniesList.xlsx");
      }
    }
  }

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
        <Box sx={{ display: { sm: 'none', xs: 'none', md: 'flex' }, gap: '4px', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          {tabValue === 'student' && (
            <div className='w-[99%] flex gap-3'>
              <Button sx={{ height: '55px' }} variant="outlined" onClick={() => {
                setToggleView(!toggleView);
                localStorage.setItem('setView', toggleView ? 'grid' : 'list');
              }}>
                {
                  toggleView ? <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm6 0H5v4h4V5zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5zm6 0h-4v4h4V5zM3 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4zm6 0H5v4h4v-4zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4zm6 0h-4v4h4v-4z" fill="#0D0D0D" />
                  </svg> :
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                      <path d="M4 7a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1zm-5 5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1zm-5 5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1z" fill="#0D0D0D" />
                    </svg>
                }
              </Button>

              <FormControl fullWidth>
                <InputLabel id="degree">Degree</InputLabel>
                <Select labelId='degree' name='degree' label='Degree' value={userFilters?.degree} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.students?.degree.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="course">Course</InputLabel>
                <Select labelId='course' name='course' label='Course' value={userFilters?.course} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.students?.course.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="yearOfPassing">Year of Passing</InputLabel>
                <Select labelId='yearOfPassing' name='yearOfPassing' label='Year of Passing' value={userFilters?.yearOfPassing} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.students?.yearOfPassing.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="gapYear">Gap Year</InputLabel>
                <Select labelId='gapYear' name='gapYear' label='Gap Year' value={userFilters?.gapYear} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.students?.gapYear.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="activeBacklogs">Active Backlogs</InputLabel>
                <Select labelId='activeBacklogs' name='activeBacklogs' label='Active Backlogs' value={userFilters?.activeBacklogs} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.students?.activeBacklogs.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <Box sx={{ marginX: 1, textAlign:'center' }} fullWidth>
                <div className='whitespace-nowrap text-sm'>Twelth Percentage: {userFilters?.twelfthPercentage[0]}% - {userFilters?.twelfthPercentage[1]}%</div>
                <Slider
                  value={userFilters?.twelfthPercentage}
                  onChange={handleUserSliderChange('twelfthPercentage')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  sx={{ width: '20ch' }}
                  disableSwap
                />
              </Box>
              <Box  sx={{ marginX: 1, textAlign:'center' }} fullWidth>
                <div className='whitespace-nowrap text-sm'>CGPA: {userFilters?.cgpa[0]} - {userFilters?.cgpa[1]}</div>
                <Slider
                  value={userFilters?.cgpa}
                  onChange={handleUserSliderChange('cgpa')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                  step={0.1}
                  sx={{ width: '14ch' }}
                  disableSwap
                />
              </Box>
              <Button sx={{ height: '55px' }} variant="outlined" onClick={resetFilters}>
                <svg width="30px" height="30px" viewBox="-1.5 -2.5 24 24" preserveAspectRatio="xMinYMin" class="jam jam-refresh"><path d='M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z' /></svg>
              </Button>
            </div>
          )}
          {tabValue === 'company' && (
            <div className='flex w-[90%] gap-5'>
              <FormControl fullWidth>
                <InputLabel id="companyName">Company Name</InputLabel>
                <Select labelId='companyName' name='companyName' label='Company Name' value={jobFilters?.companyName} onChange={handleJobFilterChange}>
                  {
                    filterFields && filterFields?.companies?.companyName.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="jobTitle">Job Title</InputLabel>
                <Select labelId='jobTitle' name='jobTitle' label='Job Title' value={jobFilters?.jobTitle} onChange={handleJobFilterChange}>
                  {
                    filterFields && filterFields?.companies?.jobTitle.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="location">Location</InputLabel>
                <Select labelId='location' name='location' label='Location' value={jobFilters?.location} onChange={handleJobFilterChange}>
                  {
                    filterFields && filterFields?.companies?.location.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="type">Type</InputLabel>
                <Select labelId='type' name='type' label='Type' value={jobFilters?.type} onChange={handleJobFilterChange}>
                  {
                    filterFields && filterFields?.companies?.type.map((e) => {
                      return <MenuItem value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <Box sx={{ marginX: 2 }}>
                <div>CTC: {jobFilters?.ctc[0]} - {jobFilters?.ctc[1]}</div>
                <Slider
                  value={jobFilters?.ctc}
                  onChange={handleJobSliderChange('ctc')}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={1}
                  sx={{ width: '24ch' }}
                />
              </Box>
              <Button sx={{ height: '55px' }} variant="outlined" onClick={resetFilters}>
                <svg width="30px" height="30px" viewBox="-1.5 -2.5 24 24" preserveAspectRatio="xMinYMin" class="jam jam-refresh"><path d='M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z' /></svg>
              </Button>
            </div>
          )}
        </Box>

        {/* Content Section */}
        <Box sx={{ padding: 2 }}>
          {tabValue === 'student' && (
            <>
              <div className="flex flex-wrap justify-center h-100">
                {toggleView ?
                  <TableListUi items={users?.filter(user => !user?.isAdmin)} />
                  : users
                    ?.filter(user => !user?.isAdmin).map(user => (
                      <UserCard key={user?._id} user={user} />
                    ))}
              </div>
              {toggleView && users.length > 0 && <p className='text-sm p-5 cursor-pointer hover:underline-offset-2 underline' onClick={downloadExcel}>Download Excel file for this data</p>}
            </>
          )}
          {tabValue === 'company' && (
            <>
              <div className="flex flex-wrap justify-center">
                {jobs?.map(job => (
                  <JobData key={job?._id} job={job} >
                  </JobData>

                ))}
              </div>
              {jobs.length > 0 && <p className='text-sm p-5 cursor-pointer hover:underline-offset-2 underline' onClick={downloadExcel}>Download Excel file for this data</p>}
            </>
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
