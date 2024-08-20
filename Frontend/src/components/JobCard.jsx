import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const JobCard = ({ job }) => {
  const [open, setOpen] = useState(false); // State to control the modal
  const [redirected, setRedirected] = useState(false); // State to check if the user is redirected

  const handleApplyClick = () => {
    // Open job URL in a new tab
    window.open(job.applyURL, '_blank');
    
    // Set redirected state to true to show the confirmation dialog
    setRedirected(true);
  };

  const handleConfirm = async (applied) => {
    if (applied) {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          // Assuming you have a backend API endpoint to handle job application
          await fetch(`/api/users/${userId}/apply-job/${job._id}`, {
            method: 'POST',
          });
          alert("Job application recorded successfully!");
        } else {
          alert("User not logged in.");
        }
      } catch (error) {
        console.error('Error recording job application:', error);
        alert("Failed to record job application.");
      }
    }
    setRedirected(false); // Close the modal
  };

  const handleClose = () => {
    setRedirected(false); // Close the modal without applying
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
