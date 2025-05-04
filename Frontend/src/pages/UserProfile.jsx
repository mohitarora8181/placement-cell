import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, Avatar, Paper, Divider, Box } from '@mui/material';
import AdminNav from '../components/AdminNav';
import Loader from '../components/Loader'
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SchoolIcon from '@mui/icons-material/School';
import LinkIcon from '@mui/icons-material/Link';

// Reusable detail component for displaying a field and its value
const DetailField = ({ label, value, link, href }) => (
  <Typography variant="body1" style={{ color: '#555555', marginBottom: '8px' }}>
    <strong>{label}:</strong>{' '}
    {link && value ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {link}
      </a>
    ) : (
      value || (label === 'Resume' ? 'Not provided' : 'Loading...')
    )}
  </Typography>
);

// Section header component for consistent styling
const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
    {icon}
    <Typography variant="h6" color="primary" style={{ fontWeight: 'bold', marginLeft: '8px' }}>
      {title}
    </Typography>
    <Divider sx={{ ml: 2, flex: 1 }} />
  </Box>
);

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token')?.trim();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}api/users/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [userId, token]);

  const formatEnrollmentNumber = (enrollmentNumber, expectedLength = 11) => {
    if (!enrollmentNumber) return enrollmentNumber;
    const strNumber = String(enrollmentNumber);
    if (strNumber.length === expectedLength) return strNumber;
    if (strNumber.length < expectedLength) {
      return strNumber.padStart(expectedLength, '0');
    }
    return strNumber;
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Loading...';
  };

  // Extract domain from URL for display purposes
  const formatUrl = (url) => {
    return url ? url.replace(/^https?:\/\/(www\.)?/, '') : 'Not provided';
  };

  return user ? (
    <>
      <AdminNav />
      <div className="container mx-auto p-5 w-[80%] shadow-md mt-5 rounded-md overflow-hidden" style={{ backgroundColor: '#ffffff', color: '#333333', minHeight: '80vh' }}>
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={4} className="text-center">
            <Avatar
              sx={{ width: 150, height: 150, margin: '0 auto', border: '2px solid #333333' }}
              alt={user.fullname || 'Profile Picture'}
              src={user.photoURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
            />
            <Typography variant="h4" gutterBottom mt={2} style={{ color: '#333333', fontWeight: 'bold' }}>
              {user.fullname || 'Loading...'}
            </Typography>
          </Grid>

          {/* User Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#ffffff' }}>
              {/* Personal Information */}
              <SectionHeader icon={<PersonIcon color="primary" />} title="Personal Information" />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailField label="Full Name" value={user.fullname} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Date of Birth" value={formatDate(user.dob)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Nationality" value={user.nationality} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Address" value={user.address} />
                </Grid>
              </Grid>

              {/* Contact Information */}
              <SectionHeader icon={<ContactPhoneIcon color="primary" />} title="Contact Information" />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailField label="Email" value={user.email} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Contact Number" value={user.contactNumber} />
                </Grid>
              </Grid>

              {/* Academic Information */}
              <SectionHeader icon={<SchoolIcon color="primary" />} title="Academic Information" />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DetailField label="Degree" value={user.degree} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Course" value={user.course} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Class" value={user.classes} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField
                    label="Enrollment Number"
                    value={formatEnrollmentNumber(user.enrollmentNumber)}
                    link={` ${formatEnrollmentNumber(user.enrollmentNumber)}`}
                    href={`https://www.ipuranklist.com/student/${formatEnrollmentNumber(user.enrollmentNumber)}`}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="CGPA" value={user.cgpa} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Year of Passing" value={user.yearOfPassing} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="12th Percentage" value={user.twelfthPercentage || 'Not provided'} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="10th Percentage" value={user.tenthPercentage || 'Not provided'} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Active Backlogs" value={user.activeBacklogs || 'None'} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField label="Gap Year" value={user.gapYear || 'No gap'} />
                </Grid>
                <Grid item xs={12}>
                  <DetailField
                    label="Resume"
                    value={user.resumeURL}
                    link="View Resume"
                    href={user.resumeURL}
                  />
                </Grid>
              </Grid>

              {/* Social Profiles */}
              <SectionHeader icon={<LinkIcon color="primary" />} title="Social Profiles" />
              <Grid container spacing={2} columns={1}>
                <Grid item xs={12} md={6}>
                  <DetailField
                    label="LinkedIn"
                    value={user.linkedin}
                    link={formatUrl(user.linkedin)}
                    href={user.linkedin}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField
                    label="GitHub"
                    value={user.github}
                    link={formatUrl(user.github)}
                    href={user.github}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DetailField
                    label="LeetCode"
                    value={user.leetCode}
                    link={formatUrl(user.leetCode)}
                    href={user.leetCode}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default UserProfile;