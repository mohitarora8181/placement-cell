import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Container, 
    Alert, 
    CircularProgress,
    CssBaseline,
    Avatar,
    IconButton,
    InputAdornment
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo-pc.png';
import image1 from '../images/image1.jpg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAlert({ show: false, type: '', message: '' });

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}api/users/forgot-password`,
                { email }
            );

            setAlert({
                show: true,
                type: 'success',
                message: 'Password reset email sent! Please check your inbox.'
            });
            
            toast.success('Password reset email sent! Please check your inbox.');

            // Clear the form
            setEmail('');
        } catch (error) {
            console.error('Forgot password error:', error);
            
            const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';

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
                        Forgot your Password ?
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
                        Don't worry , enter your email address and we'll send you a link to reset your password.
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
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                            value={email}
                            sx={{
                                backgroundColor: '#444',
                                '& input': {
                                    color: '#fff',
                                },
                                '& input:-webkit-autofill': {
                                    WebkitBoxShadow: '0 0 0 1000px #444 inset',
                                    WebkitTextFillColor: '#fff',
                                    transition: 'background-color 5000s ease-in-out 0s',
                                },
                                mb: 3
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                marginBottom: '24px',
                                backgroundColor: '#444',
                                color: '#f5f5f5',
                            }}
                            InputLabelProps={{ style: { color: '#f5f5f5' } }}
                            InputProps={{ style: { color: '#f5f5f5' } }}
                            onFocus={(e) => (e.target.style.backgroundColor = '#555')}
                            onBlur={(e) => (e.target.style.backgroundColor = '#444')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting || !email}
                            sx={{
                                background: '#BB86FC',
                                '&:hover': { background: '#9F62D8' },
                                '&:disabled': { opacity: 0.8, color: '#f5f5f5' },
                                py: 1.5,
                                mb: 2,
                                fontWeight: 'bold',
                                borderRadius: 1,
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} sx={{ color: '#f5f5f5' }} />
                            ) : (
                                'Send Reset Link'
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

export default ForgotPassword;