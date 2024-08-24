import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';

const ProfileJobCard = ({ job }) => {
  return (
    <Card className="w-full mb-4 shadow-lg rounded-lg">
      {job.imageURL && (
        <CardMedia
          component="img"
          height="140"
          image={job.imageURL}
          alt={job.jobTitle}
        />
      )}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {job.jobTitle}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {job.companyName}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {job.jobDescription}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <strong>CTC:</strong> {job.ctc} lacs
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileJobCard;
