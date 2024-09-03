import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Styled components
const CardContainer = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column',
  margin: '12px',
  overflow: 'hidden',
}));

const ProfileImage = styled('div')({
  height: '100px',
  width: '100px',
  borderRadius: '50%',
  overflow: 'hidden',
  marginBottom: '20px',
  backgroundColor: '#e0f7fa',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const UserInfo = styled('div')({
  marginBottom: '20px',
});

const UserDetail = styled(Typography)({
  margin: '5px 0',
  color: '#333',
});

const ViewProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00796b',
  color: '#ffffff',
  fontWeight: 'bold',
  borderRadius: '20px',
  padding: '5px 10px',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: '#004d40',
  },
}));

const AppliedUserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user-profile/${user._id}`);
  };

  return (
    <CardContainer>
      {/* Uncomment the following if you have the profileImage field */}
      {/* <ProfileImage>
        <img
          src={user.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
          alt={user.fullname}
        />
      </ProfileImage> */}
      <CardContent>
        <UserInfo>
          <Typography variant="h6" gutterBottom className="text-2xl font-semibold text-gray-800 mb-1">
            {user.fullname}
          </Typography>
          <UserDetail variant="body2"><strong>Email:</strong> {user.email}</UserDetail>
          <UserDetail variant="body2"><strong>Branch:</strong> {user.course}</UserDetail>
          <UserDetail variant="body2"><strong>Year Of Passing:</strong> {user.yearOfPassing}</UserDetail>
          <UserDetail variant="body2"><strong>Degree:</strong> {user.degree}</UserDetail>
          <UserDetail variant="body2"><strong>CGPA:</strong> {user.cgpa || 'N/A'}</UserDetail>
        </UserInfo>
        <ViewProfileButton onClick={handleClick}>View Profile</ViewProfileButton>
      </CardContent>
    </CardContainer>
  );
};

export default AppliedUserCard;
