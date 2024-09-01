import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Card, CardContent } from '@mui/material';

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
    <div className="p-8">
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

      <Typography variant="h5" gutterBottom>
        Applied Users
      </Typography>
      <Grid container spacing={2}>
        {job.applicants && job.applicants.length > 0 ? (
          job.applicants.map(user => (
            <Grid item xs={12} md={6} lg={4} key={user._id}>
              <Card className="p-4 bg-white shadow-md rounded-lg">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {user.fullname}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {user.email}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {user.course}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No users have applied yet.
          </Typography>
        )}
      </Grid>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default JobDetails;
