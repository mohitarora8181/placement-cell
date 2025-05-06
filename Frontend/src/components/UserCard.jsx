import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Email, School, CalendarToday, Badge, Apartment } from '@mui/icons-material';
import { Chip, Avatar, Box, Typography, Divider } from '@mui/material';

// Styled components
const CardContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
  },
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  margin: '12px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  borderTop: '5px solid #1976d2'
}));

const ProfileImage = styled('div')({
  height: '110px',
  width: '110px',
  borderRadius: '50%',
  overflow: 'hidden',
  margin: '0 auto 16px auto',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  border: '4px solid #f0f0f0',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const UserInfo = styled('div')({
  marginBottom: '16px',
  textAlign: 'center'
});

const UserDetailRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
  gap: '8px',
  '& svg': {
    color: '#666',
    fontSize: '1.2rem'
  }
});

const InfoContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '12px',
  borderTop: '1px solid #f0f0f0',
});

const CGPAButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '16px',
  backgroundColor: '#4caf50',
  color: '#ffffff',
  fontWeight: 'bold',
  borderRadius: '20px',
  padding: '4px 10px',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
}));

const CourseChip = styled(Chip)({
  backgroundColor: 'rgba(25, 118, 210, 0.08)',
  color: '#1976d2',
  fontWeight: 'bold',
  margin: '4px auto 12px auto',
  padding: '0 8px',
});

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/admin/user-profile/${user._id}`);
  };

  // Format enrollment number to be more readable
  const formatEnrollment = (enrollmentNumber) => {
    if (!enrollmentNumber) return 'N/A';
    return enrollmentNumber.length > 12
      ? `${enrollmentNumber.substring(0, 12)}...`
      : enrollmentNumber;
  };

  return (
    <CardContainer onClick={handleClick}>
      <CGPAButton>
        CGPA: {user.cgpa || 'N/A'}
      </CGPAButton>

      <ProfileImage>
        <img
          src={user.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
          alt={user.fullname}
        />
      </ProfileImage>

      <UserInfo>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>
          {user.fullname}
        </Typography>

        <CourseChip
          label={user.course || 'No Course'}
          size="small"
        />

        <UserDetailRow>
          <Email fontSize="small" />
          <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
            {user.email}
          </Typography>
        </UserDetailRow>

        <UserDetailRow>
          <School fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {user.degree || 'No Degree'}
          </Typography>
        </UserDetailRow>

        <UserDetailRow>
          <CalendarToday fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Batch: {user.yearOfPassing || 'N/A'}
          </Typography>
        </UserDetailRow>

        <UserDetailRow>
          <Badge fontSize="small" />
          <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
            Enrollment: {formatEnrollment(user.enrollmentNumber)}
          </Typography>
        </UserDetailRow>
      </UserInfo>

      <InfoContainer>
        <Box display="flex" alignItems="center">
          <Apartment fontSize="small" sx={{ mr: 1, color: '#666' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {user.classes || 'N/A'}
          </Typography>
        </Box>

        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
          View Details →
        </Typography>
      </InfoContainer>
    </CardContainer>
  );
};

export default UserCard;