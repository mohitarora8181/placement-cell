import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Paper,
    Divider,
    Button,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Grid
} from '@mui/material';
import {
    Business,
    LocationOn,
    CalendarToday,
    Description,
    Link as LinkIcon,
    AccessTime,
    Check,
    Person,
    School,
    Money,
    WorkOutline,
    ArrowBack,
    Link,
    Email,
    Phone,
    OpenInNew,
    LinkedIn,
    GitHub,
    Code
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import Navbar from '../components/Navbar';

const formTypeConfig = {
    interview: {
        label: 'Interview',
        color: '#3f51b5',
        bgColor: 'rgba(63, 81, 181, 0.1)'
    },
    hackathon: {
        label: 'Hackathon',
        color: '#f50057',
        bgColor: 'rgba(245, 0, 87, 0.1)'
    },
    test: {
        label: 'Test',
        color: '#ff9800',
        bgColor: 'rgba(255, 152, 0, 0.1)'
    },
    general: {
        label: 'General',
        color: '#4caf50',
        bgColor: 'rgba(76, 175, 80, 0.1)'
    }
};

const UserForm = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    const fetchFormAndProfile = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token')?.trim();

            if (!token) {
                navigate('/login', { replace: true });
                return;
            }

            const userId = localStorage.getItem('userId')?.trim();
            // Fetch form details
            const formResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}api/users/forms/${formId}/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setForm(formResponse.data);

            // Fetch user profile
            const profileResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}api/users/profile/${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setUserProfile(profileResponse.data);

        } catch (err) {
            console.error("Error fetching form:", err);
            setError(err.response?.data?.message || "Failed to load opportunity details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFormAndProfile();
    }, [formId, navigate]);

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSubmitProfile = async () => {
        try {
            setSubmitting(true);
            const token = localStorage.getItem('token')?.trim();
            const userId = localStorage.getItem('userId')?.trim();

            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}api/users/forms/${formId}/submit`,
                { userId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSubmitSuccess(true);
            setTimeout(() => {
                setDialogOpen(false);
                fetchFormAndProfile();
            }, 500);

        } catch (err) {
            console.error("Error submitting profile:", err);
            setSubmitError(err.response?.data?.message || "Failed to submit your profile. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
                <Navbar />
                <Container maxWidth="md" sx={{ pt: 8, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Container>
            </Box>
        );
    }

    if (error || !form) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
                <Navbar />
                <Container maxWidth="md" sx={{ pt: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>{error || "Form not found"}</Alert>
                    <Button
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            <Navbar />
            <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
                <Button
                    startIcon={<ArrowBack />}
                    sx={{ mb: 3 }}
                    onClick={() => navigate(-1)}
                >
                    Back to Opportunities
                </Button>

                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {/* Form Header */}
                    <Box
                        sx={{
                            p: 3,
                            bgcolor: formTypeConfig[form.formType]?.bgColor || 'white',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {form.title}
                            </Typography>
                            <Chip
                                label={formTypeConfig[form.formType]?.label || form.formType}
                                sx={{
                                    bgcolor: formTypeConfig[form.formType]?.color || 'primary.main',
                                    color: 'white',
                                    fontWeight: 500
                                }}
                            />
                        </Box>

                        <Grid container spacing={2}>
                            {form.companyName && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Business color="action" />
                                        <Typography variant="body1">
                                            {form.formType === 'hackathon' ? 'Organizer: ' : 'Company: '}
                                            <strong className='text-gray-600'>{form.companyName}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {form.formType === 'interview' && form.location && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOn color="action" />
                                        <Typography variant="body1">
                                            Location: <strong className='text-gray-600'>{form.location}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {form.formType === 'hackathon' && form.hackathonPlace && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocationOn color="action" />
                                        <Typography variant="body1">
                                            Venue: <strong className='text-gray-600'>{form.hackathonPlace}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {form.formType === 'test' && form.testTimeLocation && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarToday color="action" />
                                        <Typography variant="body1">
                                            Time & Location: <strong className='text-gray-600'>{form.testTimeLocation}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            {form.formType === 'interview' && form.salaryPackage && (
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Money color="action" />
                                        <Typography variant="body1">
                                            Salary/Stipend: <strong className='text-gray-600'>{form.salaryPackage}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTime color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        Posted on {formatDate(form.createdAt)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Form Details */}
                    <Box sx={{ p: 3 }}>
                        {form.description && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    Description
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    {form.description}
                                </Typography>
                            </Box>
                        )}

                        {form.formType === 'interview' && form.jobDescription && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    Job Description
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    {form.jobDescription}
                                </Typography>
                            </Box>
                        )}

                        {form.formType === 'test' && form.testLink && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                    Test Link
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LinkIcon color="primary" />
                                    <Typography
                                        component="a"
                                        href={form.testLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {form.testLink}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Divider sx={{ my: 3 }} />

                        {/* Target Audience */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                Eligibility
                            </Typography>
                            <Typography variant="body1">
                                {form.targetAudience === 'all'
                                    ? 'This opportunity is open to all students.'
                                    : 'This opportunity is available for specific departments:'}
                            </Typography>

                            {form.targetAudience === 'specific' && form.departments && form.departments.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                    {form.departments.map((dept) => (
                                        <Chip
                                            key={dept}
                                            label={dept}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(0, 0, 0, 0.08)' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            {form.isAlreadySubmitted ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: 220,
                                        py: 1.5,
                                        px: 3,
                                        borderRadius: 2,
                                        bgcolor: 'success.light',
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '1rem'
                                    }}
                                >
                                    <Check sx={{ mr: 1 }} />
                                    Already Submitted
                                </Box>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleOpenDialog}
                                    disabled={form.status === 'closed'}
                                    startIcon={<Check />}
                                    sx={{
                                        minWidth: 220,
                                        borderRadius: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        '&:hover': {
                                            boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
                                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                        },
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'translateX(-100%)',
                                            transition: 'transform 0.5s ease',
                                        },
                                        '&:hover::after': {
                                            transform: 'translateX(100%)',
                                        },
                                    }}
                                >
                                    Submit Your Application
                                </Button>
                            )}
                        </Box>

                        {form.status === 'closed' && (
                            <Typography
                                variant="body2"
                                color="error"
                                align="center"
                                sx={{ mt: 2 }}
                            >
                                This opportunity is no longer accepting submissions
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* Profile Submission Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="profile-submission-dialog"
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        width: '100%',
                        maxWidth: '800px',
                        borderRadius: 2
                    }
                }}
            >
                <DialogTitle id="profile-submission-dialog">
                    {submitSuccess ? "Profile Submitted Successfully!" : "Confirm Profile Submission"}
                </DialogTitle>

                <DialogContent sx={{ height: "100%", width: "100%", overflow: "hidden" }}>
                    {submitting ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : submitSuccess ? (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Your profile has been successfully submitted for this opportunity.
                        </Alert>
                    ) : submitError ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {submitError}
                        </Alert>
                    ) : (
                        <>
                            <DialogContentText>
                                You're about to submit your profile for "<strong>{form.title}</strong>". The following information from your profile will be shared:
                            </DialogContentText>

                            <Paper elevation={2} sx={{ mt: 2, mb: 2, p: 2, maxHeight: '60vh', overflow: 'auto' }}>
                                {/* Personal Information */}
                                <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ mr: 1 }} fontSize="small" /> Personal Information
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Person fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Name:</strong> {userProfile?.fullname}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Email:</strong> {userProfile?.email}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Contact:</strong> {userProfile?.contactNumber}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Nationality:</strong> {userProfile?.nationality}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Academic Information */}
                                <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <School sx={{ mr: 1 }} fontSize="small" /> Academic Information
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <School fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Degree:</strong> {userProfile?.degree} in {userProfile?.course}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <School fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Class:</strong> {userProfile?.classes}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <School fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>CGPA:</strong> {userProfile?.cgpa}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Graduation Year:</strong> {userProfile?.yearOfPassing}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Active Backlogs:</strong> {userProfile?.activeBacklogs}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                                            <Typography variant="body2">
                                                <strong className='text-gray-600'>Enrollment Number:</strong> {userProfile?.enrollmentNumber}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Academic Records */}
                                <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <WorkOutline sx={{ mr: 1 }} fontSize="small" /> Previous Education
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{
                                            p: 1,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">10th Percentage</Typography>
                                            <Typography variant="body1" fontWeight="medium" color="primary">
                                                {userProfile?.tenthPercentage}%
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{
                                            p: 1,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">12th Percentage</Typography>
                                            <Typography variant="body1" fontWeight="medium" color="primary">
                                                {userProfile?.twelfthPercentage}%
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{
                                            p: 1,
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 1,
                                            textAlign: 'center'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">Diploma Percentage</Typography>
                                            <Typography variant="body1" fontWeight="medium" color="primary">
                                                {userProfile?.diplomaPercentage > 0 ? `${userProfile?.diplomaPercentage}%` : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Links and Resume */}
                                <Typography variant="h6" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <Link sx={{ mr: 1 }} fontSize="small" /> Professional Profiles
                                </Typography>

                                <Grid container spacing={2}>
                                    {userProfile?.resumeURL && (
                                        <Grid item xs={12}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 1,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                mb: 1
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Description fontSize="small" color="action" sx={{ mr: 1 }} />
                                                    <Typography variant="body2">
                                                        <strong className='text-gray-600'>Resume</strong>
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    component="a"
                                                    href={userProfile.resumeURL}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    startIcon={<OpenInNew />}
                                                >
                                                    View
                                                </Button>
                                            </Box>
                                        </Grid>
                                    )}

                                    {userProfile?.linkedin && (
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1
                                            }}>
                                                <LinkedIn fontSize="small" color="primary" sx={{ mr: 1 }} />
                                                <Typography
                                                    variant="body2"
                                                    component="a"
                                                    href={userProfile.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    LinkedIn Profile
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}

                                    {userProfile?.github && (
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1
                                            }}>
                                                <GitHub fontSize="small" color="primary" sx={{ mr: 1 }} />
                                                <Typography
                                                    variant="body2"
                                                    component="a"
                                                    href={userProfile.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    GitHub Profile
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}

                                    {userProfile?.leetCode && (
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1
                                            }}>
                                                <Code fontSize="small" color="primary" sx={{ mr: 1 }} />
                                                <Typography
                                                    variant="body2"
                                                    component="a"
                                                    href={userProfile.leetCode}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        color: 'primary.main',
                                                        textDecoration: 'none',
                                                        '&:hover': { textDecoration: 'underline' }
                                                    }}
                                                >
                                                    LeetCode Profile
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                                <div className='w-full flex justify-end max-sm:pb-4'>
                                    <Button
                                        size="small"
                                        color="primary"
                                        sx={{ mx: 1, textTransform: 'none', fontWeight: 500 }}
                                        onClick={() => {
                                            handleCloseDialog();
                                            navigate(`/edit-profile`);
                                        }}
                                    >
                                        Edit my profile
                                        <OpenInNew className='ml-1' fontSize="10" />
                                    </Button>
                                </div>
                            </Paper>

                            <DialogContentText sx={{ mt: 2, fontWeight: 'bold' }}>
                                Do you want to proceed with the submission?
                            </DialogContentText>
                        </>
                    )}
                </DialogContent>

                {!submitSuccess && (
                    <DialogActions>
                        <Button sx={{ textTransform: "none" }} onClick={handleCloseDialog} color="inherit" disabled={submitting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitProfile}
                            color="primary"
                            variant="contained"
                            disabled={submitting || submitSuccess}
                            autoFocus
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 3
                            }}
                        >
                            {submitting ? "Submitting..." : "Yes, Submit My Profile"}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </Box>
    );
};

export default UserForm;