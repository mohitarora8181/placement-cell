
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Typography, Grid, Button } from '@mui/material'
import AppliedUserCard from '../components/AppliedUserCard.jsx'
import AdminNav from '../components/AdminNav.jsx'
import TableListCompany from '../components/TableList-CompanyPage.jsx'
import Loader from '../components/Loader.jsx'

const JobDetails = () => {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [view, setView] = useState('applied') // Switch between 'applied' and 'shortlisted'
  const [shortlistedStudents, setShortlistedStudents] = useState([])
  const [toggleView, setToggleView] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    setToggleView(localStorage.getItem('setView') == 'list');
  }, [])

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/jobs/${jobId}`)
      .then((response) => {
        setJob(response.data.job)
        if (
          response.data.job.shortlistedStudents &&
          typeof response.data.job.shortlistedStudents === 'string'
        ) {
          // If it's a URL, store the URL directly
          setShortlistedStudents(response.data.job.shortlistedStudents)
        } else if (Array.isArray(response.data.job.shortlistedStudents)) {
          // If it's a list, store the students directly
          setShortlistedStudents(response.data.job.shortlistedStudents)
        }
      })
      .catch((error) => {
        console.error('Error fetching job details:', error)
      })
  }, [jobId])

  const renderStudentCards = (students) => (
    students.length > 0 && toggleView ? <TableListCompany items={students} />
      : <Grid container spacing={3}>
        {students.length > 0 ? (
          students.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user._id}>
              <AppliedUserCard user={user} />
            </Grid>
          ))
        ) : (
          <Typography className='w-full pt-14' variant='body1' color='textSecondary' align='center'>
            No users have applied yet.
          </Typography>
        )}
      </Grid>
  )

  // New function to render shortlisted students
  const renderShortlistedStudents = () => {
    // Check if shortlistedStudents is a URL (string)
    if (typeof shortlistedStudents === 'string') {
      return (
        <Typography variant='body1' color='primary'>
          <a
            href={shortlistedStudents}
            target='_blank'
            rel='noopener noreferrer'
          >
            View Shortlisted Students
          </a>
        </Typography>
      )
    }

    // If it's an array, render each student as Name (Email)
    if (Array.isArray(shortlistedStudents) && shortlistedStudents.length > 0) {
      return toggleView ? <TableListCompany items={shortlistedStudents} /> : <ul>
        {shortlistedStudents.map((student, index) => (
          <li key={index}>
            {student.name} ({student.email})
          </li>
        ))}
      </ul>
    }

    // If no students or no URL, show a placeholder
    return (
      <Typography variant='body1' color='textSecondary'>
        Yet to announce
      </Typography>
    )
  }

  return job ? (
    <>
      <AdminNav />
      <div className='p-8 mx-auto'>
        <div className='flex w-[80%] shadow-md mx-auto p-4 rounded-md'>
          <div className='mr-8 w-[20%]'>
            {job.imageURL && (
              <img
                src={job.imageURL}
                alt={job.jobTitle}
                className='rounded-lg h-64 w-full object-contain mb-4'
              />
            )}
          </div>
          <div className='w-[80%]'>
            <Typography variant='h4' gutterBottom>
              {job.jobTitle}
            </Typography>
            <Typography variant='body1' color='textSecondary' paragraph>
              <strong>Company:</strong> {job.companyName}
            </Typography>
            <Typography variant='body1' color='textSecondary' paragraph>
              <strong>Location:</strong> {job.location}
            </Typography>
            <Typography variant='body1' color='textSecondary' paragraph>
              <strong>Type:</strong> {job.type}
            </Typography>
            <Typography variant='body1' color='textSecondary' paragraph>
              <strong>Description:</strong> {job.jobDescription}
            </Typography>
            <Typography variant='body1' color='textSecondary' paragraph>
              <strong>CTC:</strong>{' '}
              {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
            </Typography>
            <Typography
              variant='body2'
              color='textSecondary'
              style={{
                fontWeight: 'bold',
                color: '#00796b',
                marginTop: '10px',
              }}
            >
              <strong>Total Applicants:</strong>{' '}
              {job.applicants ? job.applicants.length : 0}
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => navigate(`/jobs/edit/${jobId}`)} // Navigate to edit page
              style={{ marginTop: '20px' }}
            >
              Edit Job
            </Button>
          </div>
        </div>

        <div className='mx-auto w-[80%]'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <Typography
              variant='h5'
              gutterBottom
              style={{ fontWeight: 'bold' }}
            >
              {view === 'applied'
                ? 'Students who applied'
                : 'Shortlisted Students'}
              :
            </Typography>
            <div>
              <Button
                variant={view == 'applied' ? 'contained' : 'outlined'}
                color='primary'
                onClick={() => setView('applied')}
                style={{ marginRight: '10px' }}
              >
                View Applied Students
              </Button>
              <Button
                variant={view == 'shortlisted' ? 'contained' : 'outlined'}
                color='primary'
                style={{ marginRight: '10px' }}
                onClick={() => setView('shortlisted')}
              >
                View Shortlisted Students
              </Button>
              <Button variant="outlined" onClick={() => {
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
            </div>
          </div>

          {/* Conditionally render based on 'view' state */}
          {view === 'applied'
            ? renderStudentCards(job.applicants || [])
            : renderShortlistedStudents()}
        </div>
      </div>
    </>
  ) : (
    <Loader/>
  )
}

export default JobDetails
