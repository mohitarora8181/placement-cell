import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false); 
  const [redirected, setRedirected] = useState(false); 
  const userId = localStorage.getItem('userId')?.trim();

  const handleApplyClick = () => {
    window.open(job.applyURL, '_blank');
    setRedirected(true);
  };

  const handleConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await axios.post('https://placement-cell-iczn.onrender.com/api/users/apply', { userId, jobId: job._id });

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

  const handleClose = () => {
    setRedirected(false); 
  };

  return (
    <div className='p-4 bg-white shadow-md rounded-lg w-80 h-auto m-4'>
      {job.imageURL && (
        <img src={job.imageURL} alt={job.jobTitle} className='rounded-lg h-44 w-full' />
      )}
      <h3 className='text-xl font-semibold mb-2'>{job.jobTitle}</h3>
      <p className='text-gray-600 mb-2'>{job.companyName}</p>
      <p className='mb-4'>{job.jobDescription}</p>
      <p className='text-gray-500'>CTC: {job.ctc} lacs</p>
      <button
        className='bg-blue-500 hover:bg-blue-700 font-bold rounded-sm mt-2 px-4 py-2 text-white'
        onClick={handleApplyClick}
      >
        Apply Now
      </button>

      {/* Show the dialog only after redirection */}
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
    </div>
  );
};

export default JobCard;
