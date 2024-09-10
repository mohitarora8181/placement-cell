import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Dialog,DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

import Navbar from '../components/Navbar.jsx';


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
}));

const JobDetailsPageUser = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [redirected, setRedirected] = useState(false);


  useEffect(() => {
    axios.get(`https://placement-cell-iczn.onrender.com/api/jobs/${jobId}`)
      .then(response => {
        setJob(response.data.job);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
  }, [jobId]);

  const handleApplyClick = () => {
    window.open(job.applyURL, '_blank');
    setRedirected(true);

  };


  const handleClose = () => {
    setRedirected(false);
  };


  const handleConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await axios.post('/api/users/apply', { userId, jobId: job._id });

        if (response.status === 200) {
          console.log(response.data.message);
        } else {
          console.error('Failed to apply for the job.');
        }
      } catch (error) {
        console.error('Error applying for job:', error);
      }
    }
    handleClose();
  };



  return job ? (
    <>
      <Navbar/>
      <div className="p-8 mx-auto">
        <div className='flex w-[80%] shadow-md mx-auto p-4 rounded-md'>
          <div className='mr-8'>
            {job.imageURL ? (
              <img
                src={job.imageURL}
                alt={job.jobTitle}
                className="rounded-lg h-64 w-full object-cover mb-4"
              />
            ) : (
              <div>No Image Available</div>
            )}
          </div>
          <div>
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
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>Description:</strong> {job.jobDescription}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              <strong>CTC:</strong> {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
            </Typography>
            <Typography
              variant="body2"
              style={{ fontWeight: 'bold', color: '#00796b', marginTop: '10px' }}
            >
              <strong>Total Applicants:</strong> {job.applicants ? job.applicants.length : 0}
            </Typography>

            <ApplyButton
              
              startIcon={<ArrowForward />}
              onClick={handleApplyClick}>
              Apply
            </ApplyButton>
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
    <div>Loading...</div>
  );
};

export default JobDetailsPageUser;
