import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';

const ProfileJobCard = ({ job }) => {
  return (
    <Card className="w-full mb-4 shadow-lg rounded-lg overflow-hidden">
      {job.imageURL && (
        <CardMedia
          component="img"
          height="140"
          image={job.imageURL}
          alt={job.jobTitle}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
            {job.jobTitle}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ marginLeft: 2 }}>
            {job.companyName}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" paragraph sx={{ mb: 1 }}>
          {job.jobDescription}
        </Typography>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Typography variant="body2" color="textSecondary">
            <strong>CTC:</strong> {job.ctc ? `${job.ctc} lacs` : 'Not Specified'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileJobCard;
