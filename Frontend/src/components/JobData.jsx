import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';

const JobData = ({ job }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/job/${job._id}`);
  };

  return (
    <Card
      className="cursor-pointer p-4 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl"
      onClick={handleClick}
      style={{ width: '300px', margin: '10px', marginLeft: '0' }} // Adjust card width and margins
    >
      <CardContent>
        {job.imageURL && (
          <img
            src={job.imageURL}
            alt={job.jobTitle}
            className="rounded-lg h-36 w-full object-cover mb-4"
          />
        )}
        <Typography variant="h6" className="font-semibold text-gray-800 mb-2">
          {job.jobTitle}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="text-gray-600 mb-2">
          {job.companyName}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mb-2">
          {job.jobDescription}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>CTC:</strong> {job.ctc} lacs
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobData;
