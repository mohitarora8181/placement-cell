import React from 'react';
import { Box, Typography, Button, Container, Paper, Grid } from '@mui/material';
import { Notifications, Work, School, Announcement } from '@mui/icons-material';
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box
          sx={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              width: '100%',
              maxWidth: 900,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative circles */}
            <Box
              sx={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.1)',
                top: -100,
                left: -50
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.15)',
                bottom: -50,
                right: -50
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                zIndex: 2,
                animation: 'pulse 2s infinite'
              }}
            >
              Coming Soon
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                position: 'relative',
                zIndex: 2
              }}
            >
              We're working on something amazing to help you find the perfect job opportunities.
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* Add keyframes for the pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
}

export default Home;