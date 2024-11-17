import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Styled components
const CardContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  width: '320px',
  display: 'flex',
  flexDirection: 'column',
  margin: '12px',
  overflow: 'hidden', // Ensure no horizontal scrollbar
  position: 'relative',
  cursor:'pointer'
}));

const ProfileImage = styled('div')({
  height: '150px',
  width: '150px',
  borderRadius: '50%',
  overflow: 'hidden',
  margin:'auto',
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

const UserDetail = styled('p')({
  margin: '5px 0',
  color: '#333',
});

const InfoContainer = styled('div')({
  display:'flex',
  flex:'col',
  justifyContent:'center',
  alignItems:'center',
  marginTop: 'auto',
  paddingTop: '10px',
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CGPAButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: '18px',
  right: '10px',
  backgroundColor: '#4caf50',
  color: '#ffffff',
  fontWeight: 'bold',
  borderRadius: '20px',
  padding: '5px 10px',
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  '&:hover': {
    backgroundColor: '#388e3c',
  },
}));

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user-profile/${user._id}`);
  };

  return (
    <CardContainer onClick={handleClick}>
      <ProfileImage>
        <img
          src={user.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
          alt={user.fullname}
        />
      </ProfileImage>
      <UserInfo>
        <h3 className="text-2xl font-semibold text-gray-800 mb-1">{user.fullname}</h3>
        <UserDetail><strong>Email:</strong> {user.email}</UserDetail>
        <UserDetail><strong>Branch:</strong> {user.course}</UserDetail>
        <UserDetail><strong>Batch:</strong> {user.yearOfPassing}</UserDetail>

      </UserInfo>
      <InfoContainer >
        <UserDetail><strong>Degree:</strong> {user.degree}</UserDetail>
        <CGPAButton>
          CGPA: {user.cgpa || 'N/A'}
        </CGPAButton>
      </InfoContainer>
    </CardContainer>
  );
};

export default UserCard;
