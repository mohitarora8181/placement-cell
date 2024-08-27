import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

const JobData = ({ job }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${job._id}`);
  };

  return (
    <Card className="cursor-pointer m-4" onClick={handleClick}>
      {job.imageURL && (
        <CardMedia
          component="img"
          height="140"
          image={job.imageURL}
          alt={job.jobTitle}
        />
      )}
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {job.jobTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {job.companyName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {job.location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {job.type}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobData;
