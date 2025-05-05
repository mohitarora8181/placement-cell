import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    CssBaseline,
    Avatar
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo-pc.png';
import image1 from '../images/image1.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Passwords do not match'
            });
            toast.error('Passwords do not match');
            return;
        }

        // Validate password strength (at least 6 characters)
        if (password.length < 6) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Password must be at least 6 characters long'
            });
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsSubmitting(true);
        setAlert({ show: false, type: '', message: '' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}api/users/reset-password/${resetToken}`,
                { password }
            );

            setAlert({
                show: true,
                type: 'success',
                message: 'Password reset successful! You can now log in with your new password.'
            });

            toast.success('Password reset successful! Redirecting to sign in...');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/sign-in');
            }, 3000);

        } catch (error) {
            console.error('Reset password error:', error);

            const errorMessage = error.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';

            setAlert({
                show: true,
                type: 'error',
                message: errorMessage
            });

            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${image1})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    opacity: 0.3,
                    zIndex: -2,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: -1,
                }}
            />
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(34, 34, 34)',
                        padding: '40px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
                        color: '#f5f5f5',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Avatar style={{ margin: '8px', backgroundColor: '#BB86FC' }}>
                        <LockResetIcon />
                    </Avatar>
                    <img
                        src={logo}
                        className='h-20'
                        alt='Pc logo'
                        style={{ marginBottom: '20px' }}
                    />
                    <Typography
                        component='h1'
                        variant='h5'
                        style={{
                            color: '#BB86FC',
                            fontWeight: 'bold',
                            transition: 'color 0.3s',
                        }}
                    >
                        Reset Password
                    </Typography>

                    <Typography
                        variant="body2"
                        style={{
                            color: '#f5f5f5',
                            textAlign: 'center',
                            marginTop: '16px',
                            marginBottom: '24px'
                        }}
                    >
                        Please enter your new password below.
                    </Typography>

                    {alert.show && (
                        <Alert
                            severity={alert.type}
                            sx={{
                                mb: 3,
                                width: '100%',
                                backgroundColor: alert.type === 'success' ? 'rgba(46, 125, 50, 0.9)' : 'rgba(211, 47, 47, 0.9)',
                                color: '#fff'
                            }}
                            onClose={() => setAlert({ ...alert, show: false })}
                        >
                            {alert.message}
                        </Alert>
                    )}

                    <form
                        style={{ width: '100%', marginTop: '8px' }}
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='password'
                            label='New Password'
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            autoComplete='new-password'
                            value={password}
                            sx={{
                                backgroundColor: '#444',
                                '& input': {
                                    color: '#fff',
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #444 inset',
                                    WebkitTextFillColor: '#fff',
                                    transition: 'background-color 5000s ease-in-out 0s',
                                }
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                marginBottom: '16px',
                                backgroundColor: '#444',
                                color: '#f5f5f5',
                            }}
                            InputLabelProps={{ style: { color: '#f5f5f5' } }}
                            InputProps={{
                                style: { color: '#f5f5f5' },
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge='end'
                                            style={{ color: '#f5f5f5' }}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onFocus={(e) => (e.target.style.backgroundColor = '#555')}
                            onBlur={(e) => (e.target.style.backgroundColor = '#444')}
                        />

                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='confirmPassword'
                            label='Confirm Password'
                            type={showPassword ? 'text' : 'password'}
                            id='confirmPassword'
                            autoComplete='new-password'
                            value={confirmPassword}
                            sx={{
                                backgroundColor: '#444',
                                '& input': {
                                    color: '#fff',
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #444 inset',
                                    WebkitTextFillColor: '#fff',
                                    transition: 'background-color 5000s ease-in-out 0s',
                                }
                            }}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{
                                marginBottom: '16px',
                                backgroundColor: '#444',
                                color: '#f5f5f5',
                            }}
                            InputLabelProps={{ style: { color: '#f5f5f5' } }}
                            InputProps={{
                                style: { color: '#f5f5f5' },
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge='end'
                                            style={{ color: '#f5f5f5' }}
                                        >
                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            onFocus={(e) => (e.target.style.backgroundColor = '#555')}
                            onBlur={(e) => (e.target.style.backgroundColor = '#444')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting || !password || !confirmPassword}
                            sx={{
                                background: '#BB86FC',
                                '&:hover': { background: '#9F62D8' },
                                '&:disabled': { opacity: 0.8, color: '#f5f5f5' },
                                mt: 2,
                                mb: 2,
                                py: 1.5
                            }}
                            style={{
                                margin: '16px 0',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Reset Password'
                            )}
                        </Button>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Link to="/sign-in" style={{ textDecoration: 'none' }}>
                                <Typography
                                    variant="body2"
                                    style={{
                                        color: '#BB86FC',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <ArrowBackIcon fontSize="small" />
                                    Back to Sign In
                                </Typography>
                            </Link>
                        </Box>
                    </form>
                </div>
            </Container>

            <ToastContainer
                position='bottom-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default ResetPassword;