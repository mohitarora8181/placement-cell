import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid } from '@mui/material';
import AppliedUserCard from '../components/AppliedUserCard.js';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`https://placement-cell-iczn.onrender.com/api/jobs/${jobId}`)
      .then(response => {
        setJob(response.data.job);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
  }, [jobId]);

  return job ? (
    <div className="p-8 mx-auto ">

      <div className='flex justify-between w-[80%] shadow-md mx-auto p-4 rounded-md'>
      <div>
      {job.imageURL && (
          <img
            src={job.imageURL}
            alt={job.jobTitle}
            className="rounded-lg h-64 w-full object-cover mb-4"
          />
        )}
        </div>
        <div >
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
        color="textSecondary"
        style={{ fontWeight: 'bold', color: '#00796b', marginTop: '10px' }}
      >
        <strong>Total Applicants:</strong> {job.applicants ? job.applicants.length : 0}
      </Typography>



      </div>
      </div>
      <div className='mx-auto w-[80%]'>
      <Typography variant="h5" gutterBottom style={{ marginTop: '20px', fontWeight:'bold' }}>
        Students who applied:
      </Typography>
      <Grid container spacing={1}>
        {job.applicants && job.applicants.length > 0 ? (
          job.applicants.map(user => (
            <Grid item xs={12} md={6} lg={4} key={user._id}>
              <AppliedUserCard user={user} />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No users have applied yet.
          </Typography>
        )}
      </Grid>
      </div>
    </div>

  ) : (
    <div>Loading...</div>
  );
};

export default JobDetails;
