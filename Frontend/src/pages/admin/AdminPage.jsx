import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Box, Button, Slider, Select, MenuItem, InputLabel, FormControl, Checkbox, Typography, TextField } from '@mui/material';
import axios from 'axios';
import UserCard from '../../components/UserCard';
import TableListUi from '../../components/TableListUi';
import FormCreator from '../../components/FormCreator';
import FormList from '../../components/FormList';
import * as XLSX from 'xlsx';

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(localStorage.getItem('adminTab') || 'student');
  const [users, setUsers] = useState([]);
  const [studentLoading, setStudentLoading] = useState(true);
  const [forms, setForms] = useState([]);
  const [toggleView, setToggleView] = useState(false);
  const [userFilters, setUserFilters] = useState({
    degree: 'Bachelor of Technology',
    course: '',
    twelfthPercentage: [0, 100],
    classes: '',
    cgpa: [0, 10],
    yearOfPassing: '',
    gapYear: '',
    activeBacklogs: ''
  });
  const [filterFields, setFilterFields] = useState();
  const headerRef = useRef(null);
  const headerHeight = useRef(0);

  const [searchForms, setsearchForms] = useState('');

  // Update header height after render
  useEffect(() => {
    if (headerRef.current) {
      headerHeight.current = headerRef.current.offsetHeight;
    }
  }, []);

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

  const resetFilters = () => {
    if (tabValue === 'student') {
      setUserFilters({
        degree: 'Bachelor of Technology',
        course: '',
        twelfthPercentage: [0, 100],
        classes: '',
        cgpa: [0, 10],
        yearOfPassing: '',
        gapYear: '',
        activeBacklogs: ''
      });
    }
    fetchData();
  };

  const fetchData = async () => {
    try {
      if (tabValue === 'student') {
        setStudentLoading(true);
        const query = new URLSearchParams({
          ...userFilters,
          twelfthPercentage: userFilters.twelfthPercentage.join(','),
          cgpa: userFilters.cgpa.join(',')
        }).toString();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/find?${query}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`
          }
        });
        setUsers(response.data);
        setStudentLoading(false);
      } else if (tabValue === 'forms') {
        refreshForms();
      }
    } catch (error) {
      console.error(`Error fetching ${tabValue}:`, error.response ? error.response.data : error.message);
      setStudentLoading(false);
    }
  };

  const getFilteredForms = () => {
    if (!searchForms || searchForms.trim() === '') {
      return forms;
    }

    const searchTerm = searchForms.toLowerCase().trim();
    return forms.filter(form => {
      return (
        (form.title && form.title.toLowerCase().includes(searchTerm)) ||
        (form.companyName && form.companyName.toLowerCase().includes(searchTerm)) ||
        (form.testName && form.testName.toLowerCase().includes(searchTerm)) ||
        (form.formType && form.formType.toLowerCase().includes(searchTerm)) ||
        (form.createdAt && form.createdAt.toLowerCase().includes(searchTerm)) ||
        (form.departments && form.departments.toString().toLowerCase().includes(searchTerm)) ||
        (form.targetAudience && form.targetAudience.toString().toLowerCase().includes(searchTerm)) ||
        (form.status && form.status.toString().toLowerCase().includes(searchTerm))
      );
    });
  };

  const refreshForms = async () => {
    if (tabValue === 'forms') {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/forms`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
            "x-admin-id": localStorage.getItem("userId")?.trim()
          }
        });
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [tabValue, userFilters]);

  useEffect(() => {
    setToggleView(localStorage.getItem('setView') == 'list');
    const fetchFilterFields = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/filterFields`, {
        headers: {
          "x-admin-id": localStorage.getItem("userId")?.trim()
        }
      }).then(({ data }) => {
        setFilterFields(data);
      })
    }
    fetchFilterFields();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00.000Z") return "---";
    return new Date(dateString).toLocaleDateString();
  };

  const downloadExcel = () => {
    if (tabValue == 'student') {
      if (users.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(
          users.filter(student => !student.isAdmin).map(student => {
            const isValid = v => v && v !== "0" && v !== 0;

            return {
              'Enrollment Number': student.enrollmentNumber || '---',
              'Name': student.fullname || '---',
              'D.O.B.': formatDate(student.dob) || '---',
              'Email': student.email || '---',
              'Contact': isValid(student.contactNumber) ? student.contactNumber : '---',
              'Degree': student.degree || '---',
              'Course': student.course || '---',
              'Class': isValid(student.classes) ? student.classes : '---',
              'CGPA': isValid(student.cgpa) ? student.cgpa : '---',
              '10th %': isValid(student.tenthPercentage) ? student.tenthPercentage : '---',
              '12th %': isValid(student.twelfthPercentage) ? student.twelfthPercentage : '---',
              'Diploma %': isValid(student.diplomaPercentage) ? student.diplomaPercentage : '---',
              'Year of Passing': isValid(student.yearOfPassing) ? student.yearOfPassing : '---',
              'Active Backlogs': isValid(student.activeBacklogs) ? student.activeBacklogs : '0',
              'Resume': isValid(student.resumeURL) ? student.resumeURL : '---',
              'LinkedIn': isValid(student.linkedin) ? student.linkedin : '---',
              'GitHub': isValid(student.github) ? student.github : '---',
              'LeetCode': isValid(student.leetCode) ? student.leetCode : '---'
            };
          })
        );

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_col(C) + '1';
          if (!worksheet[address]) continue;
          worksheet[address].s = { font: { bold: true } };
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
        XLSX.writeFile(workbook, "PC-MSIT_StudentList.xlsx");
      }
    }
  };

  return (
    <>
      {/* Fixed Position Header with Show/Hide behavior */}
      <Box
        ref={headerRef}
        sx={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          sx={{ borderBottom: 1, borderColor: 'divider', padding: 1 }}
        >
          <Tab label="Students" value="student" />
          <Tab label="Forms" value="forms" />
        </Tabs>

        {/* Filters Section */}
        <Box sx={{ gap: '4px', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          {tabValue === 'student' && (
            <div className='w-[99%] flex gap-3'>
              <Button sx={{ height: '55px', minWidth: "auto" }} variant="outlined" onClick={() => {
                setToggleView(!toggleView);
                localStorage.setItem('setView', toggleView ? 'grid' : 'list');
              }}>
                {
                  toggleView ? <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm6 0H5v4h4V5zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V5zm6 0h-4v4h4V5zM3 15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4zm6 0H5v4h4v-4zm4 0a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4zm6 0h-4v4h4v-4z" fill="#0D0D0D" />
                  </svg> :
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                      <path d="M4 7a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1zm-5 5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1zm-5 5a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2h-9a1 1 0 0 1-1-1z" fill="#0D0D0D" />
                    </svg>
                }
              </Button>

              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="degree">Degree</InputLabel>
                <Select labelId='degree' name='degree' label='Degree' value={userFilters?.degree} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.degree.map((e, i) => {
                      return <MenuItem key={i} value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="course">Course</InputLabel>
                <Select labelId='course' name='course' label='Course' value={userFilters?.course} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.course.map((e, i) => {
                      return <MenuItem key={i} value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="class">Class</InputLabel>
                <Select labelId='class' name='classes' label='Class' value={userFilters?.classes} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.classes.map((e, i) => {
                      return <MenuItem key={i} value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="yearOfPassing">Year of Passing</InputLabel>
                <Select labelId='yearOfPassing' name='yearOfPassing' label='Year of Passing' value={userFilters?.yearOfPassing} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.yearOfPassing.map((e, i) => {
                      return <MenuItem key={i} value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="activeBacklogs">Active Backlogs</InputLabel>
                <Select labelId='activeBacklogs' name='activeBacklogs' label='Active Backlogs' value={userFilters?.activeBacklogs} onChange={handleUserFilterChange}>
                  {
                    filterFields && filterFields?.activeBacklogs.map((e, i) => {
                      return <MenuItem key={i} value={e}>{e}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="percentage-range">Twelfth Percentage Range</InputLabel>
                <Select
                  labelId="percentage-range"
                  value={`${userFilters?.twelfthPercentage[0]}-${userFilters?.twelfthPercentage[1]}`}
                  label="Twelfth Percentage Range"
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setUserFilters({
                      ...userFilters,
                      twelfthPercentage: [min, max]
                    });
                  }}
                >
                  <MenuItem value="0-100">All (0% - 100%)</MenuItem>
                  <MenuItem value="60-100">Above 60%</MenuItem>
                  <MenuItem value="70-100">Above 70%</MenuItem>
                  <MenuItem value="80-100">Above 80%</MenuItem>
                  <MenuItem value="90-100">Above 90%</MenuItem>
                  <MenuItem value="95-100">Above 95%</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ fontSize: 16 }} fullWidth>
                <InputLabel id="cgpa-range">CGPA Range</InputLabel>
                <Select
                  labelId="cgpa-range"
                  value={`${userFilters?.cgpa[0]}-${userFilters?.cgpa[1]}`}
                  label="CGPA Range"
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setUserFilters({
                      ...userFilters,
                      cgpa: [min, max]
                    });
                  }}
                >
                  <MenuItem value="0-10">All (0 - 10)</MenuItem>
                  <MenuItem value="6-10">Above 6</MenuItem>
                  <MenuItem value="7-10">Above 7</MenuItem>
                  <MenuItem value="8-10">Above 8</MenuItem>
                  <MenuItem value="9-10">Above 9</MenuItem>
                </Select>
              </FormControl>
              <Button sx={{ height: '55px', minWidth: "auto" }} variant="outlined" onClick={resetFilters}>
                <svg width="25px" height="25px" viewBox="-1.5 -2.5 24 24" preserveAspectRatio="xMinYMin" className="jam jam-refresh"><path d='M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z' /></svg>
              </Button>
            </div>
          )}

          {tabValue === 'forms' && (
            <div className='w-[99%] flex gap-3'>
              <TextField
                fullWidth
                label="Search forms..."
                variant="outlined"
                value={searchForms}
                onChange={(e) => setsearchForms(e.target.value)}
                placeholder="Search by type, title, company name, or createdAt"
                InputProps={{
                  startAdornment: (
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                      <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  endAdornment: searchForms && (
                    <Button
                      size="small"
                      style={{ minWidth: '30px' }}
                      onClick={() => setsearchForms('')}
                    >
                      ✕
                    </Button>
                  ),
                }}
              />
              <Button
                sx={{ height: '55px', minWidth: "auto" }}
                variant="outlined"
                onClick={() => {
                  setsearchForms('');
                  refreshForms();
                }}
              >
                <svg width="25px" height="25px" viewBox="-1.5 -2.5 24 24" preserveAspectRatio="xMinYMin" className="jam jam-refresh">
                  <path d='M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z' />
                </svg>
              </Button>
            </div>
          )}
        </Box>
      </Box>

      {/* Content Section */}
      <Box sx={{ padding: 2 }}>
        {tabValue === 'student' && (
          <>
            <div className="flex flex-wrap justify-center h-100">
              {toggleView ?
                <TableListUi loading={studentLoading} items={users?.filter(user => !user?.isAdmin)} />
                : users
                  ?.filter(user => !user?.isAdmin).map(user => (
                    <UserCard key={user?._id} user={user} />
                  ))}
            </div>
            {toggleView && users.length > 0 && <p className='text-sm p-5 cursor-pointer hover:underline-offset-2 underline' onClick={downloadExcel}>Download Excel file for this data [ {users?.filter(user => !user?.isAdmin).length} rows ] </p>}
          </>
        )}

        {tabValue === 'forms' && (
          <Box>
            <FormCreator filterFields={filterFields} />

            {forms.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No forms created yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the "Create Form" button to get started
                </Typography>
              </Box>
            ) : (
              <Box>
                <FormList
                  forms={getFilteredForms()}
                  refreshForms={refreshForms}
                  filterFields={filterFields}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default AdminPage;