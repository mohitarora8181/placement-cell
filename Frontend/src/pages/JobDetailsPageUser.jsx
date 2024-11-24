import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { styled } from '@mui/material/styles'

import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'

import Navbar from '../components/Navbar.jsx'
import Loader from '../components/Loader.jsx'

const ApplyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00796b',
  color: '#ffffff',
  fontWeight: 'bold',
  borderRadius: '20px',
  padding: '10px 20px',
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: '#004d40',
  },
}))

const JobDetailsPageUser = () => {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [redirected, setRedirected] = useState(false)
  const userId = localStorage.getItem('userId')?.trim()

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/jobs/${jobId}`)
      .then((response) => {
        setJob(response.data.job)
      })
      .catch((error) => {
        console.error('Error fetching job details:', error)
      })
  }, [jobId])

  const handleApplyClick = () => {
    window.open(job.applyURL, '_blank')
    setRedirected(true)
  }

  const handleClose = () => {
    setRedirected(false)
  }

  const handleConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/users/apply`, {
          userId,
          jobId: job._id,
        })

        if (response.status === 200) {
          console.log(response.data.message)
        } else {
          console.error('Failed to apply for the job.')
        }
      } catch (error) {
        console.error('Error applying for job:', error)
      }
    }
    handleClose()
  }

  return job ? (
    <>
      <Navbar />
      <div className="p-8 mx-auto">
        <div className="flex md:flex-row flex-col md:w-[80%] w-[95%] shadow-md mx-auto p-4 rounded-md justify-between items-center">

          {/* Image Section */}
          <div className="md:w-[30%] self-start pt-20 max-sm:pt-0"> {/* Reduced width for the image section */}
            {job.imageURL ? (
              <img
                src={job.imageURL}
                alt={job.jobTitle}
                className="rounded-lg w-full h-[300px] object-contain mb-4" // Adjusted image size
              />
            ) : (
              <div>No Image Available</div>
            )}
          </div>

          {/* Job Details Section */}
          <div className="md:w-[65%]"> {/* Increased width for job details */}
            <Typography variant="h4" gutterBottom>
              {job.jobTitle}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Company:</strong> {job.companyName}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Location:</strong> {job.location}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Type:</strong> {job.type}
            </Typography>
            <Typography variant="body1" style={{whiteSpace:'pre-line'}} color="textSecondary" paragraph>
              <strong>Description:</strong> {job.jobDescription}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>CTC:</strong>{' '}
              {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
            </Typography>
            <Typography
              variant="body2"
              style={{
                fontWeight: 'bold',
                color: '#00796b',
                marginTop: '10px',
              }}
            >
              <strong>Total Applicants:</strong>{' '}
              {job.applicants ? job.applicants.length : 0}
            </Typography>

            <ApplyButton
              startIcon={<ArrowForward />}
              onClick={handleApplyClick}
              style={{marginTop:10}}
            >
              Apply
            </ApplyButton>

            <div className="mt-6">
              <Typography variant="h6" gutterBottom>
                Shortlisted Students:
              </Typography>

              {/* Check if shortlistedStudents is a string (URL link) */}
              {typeof job.shortlistedStudents === 'string' ? (
                <Typography variant="body1" color="primary">
                  <a
                    href={job.shortlistedStudents}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Shortlisted Students
                  </a>
                </Typography>
              ) : // Check if shortlistedStudents is an array
              Array.isArray(job.shortlistedStudents) &&
                job.shortlistedStudents.length > 0 ? (
                <ol style={{listStyle:'inside',listStyleType:'decimal'}}>
                  {job.shortlistedStudents.map((student, index) => (
                    <li key={index}>
                      {student.name} ({student.email})
                    </li>
                  ))}
                </ol>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  Yet to announce
                </Typography>
              )}
            </div>
          </div>

        </div>
      </div>

      <Dialog open={redirected} onClose={handleClose}>
        <DialogTitle>Confirm Application</DialogTitle>
        <DialogContent>
          <p>Have you applied for this job?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirm(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleConfirm(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : (
    <Loader/>
  )
}

export default JobDetailsPageUser
