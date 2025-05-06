import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import {
  Announcement,
  Business,
  Code,
  QuestionAnswer,
  CalendarToday,
  LocationOn,
  ArrowForward,
  FilterList
} from '@mui/icons-material';
import Navbar from "../components/Navbar";
import axios from 'axios';
import { format } from 'date-fns';

// Form type config for icons and colors
const formTypeConfig = {
  interview: {
    icon: <Business />,
    color: '#3f51b5',
    label: 'Interview',
    bgColor: 'rgba(63, 81, 181, 0.1)'
  },
  hackathon: {
    icon: <Code />,
    color: '#f50057',
    label: 'Hackathon',
    bgColor: 'rgba(245, 0, 87, 0.1)'
  },
  test: {
    icon: <QuestionAnswer />,
    color: '#ff9800',
    label: 'Test',
    bgColor: 'rgba(255, 152, 0, 0.1)'
  },
  general: {
    icon: <Announcement />,
    color: '#4caf50',
    label: 'General',
    bgColor: 'rgba(76, 175, 80, 0.1)'
  }
};

const Home = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formTypeFilter, setFormTypeFilter] = useState('all');

  // Fetch forms on component mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token')?.trim();

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}api/users/forms`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setForms(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to load opportunities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Filter forms based on selected form type
  const filteredForms = formTypeFilter === 'all'
    ? forms
    : forms.filter(form => form.formType === formTypeFilter);

  // Get count of each form type for the dropdown labels
  const getCounts = () => {
    const counts = {
      interview: 0,
      hackathon: 0,
      test: 0,
      general: 0
    };

    forms.forEach(form => {
      if (counts[form.formType] !== undefined) {
        counts[form.formType]++;
      }
    });

    return counts;
  };

  const formCounts = getCounts();

  return (
    <Box sx={{ overflow: 'hidden', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#1976d2'
            }}
          >
            Opportunities
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Discover and apply for interviews, tests, and hackathons
          </Typography>
          <Divider />
        </Box>

        {/* Form Type Filter Dropdown */}
        {!loading && !error && forms.length > 0 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 1,
              display:"flex",
              justifyContent:"end",
              alignItems:"center"
            }}
          >
            <span className='w-fit text-nowrap flex gap-1'>
              <FilterList color="primary" />
              <Typography variant="body1" fontWeight={500}>Filter by:</Typography>
            </span>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <Select
                value={formTypeFilter}
                onChange={(e) => setFormTypeFilter(e.target.value)}
                displayEmpty
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">
                  <Typography variant="body2">All Opportunities ({forms.length})</Typography>
                </MenuItem>
                <MenuItem value="interview">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formTypeConfig.interview.icon}
                    <Typography variant="body2">Interviews ({formCounts.interview})</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="hackathon">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formTypeConfig.hackathon.icon}
                    <Typography variant="body2">Hackathons ({formCounts.hackathon})</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="test">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formTypeConfig.test.icon}
                    <Typography variant="body2">Tests ({formCounts.test})</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="general">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {formTypeConfig.general.icon}
                    <Typography variant="body2">General ({formCounts.general})</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        )}

        {/* Content Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        ) : forms.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 4,
              textAlign: 'center',
              mt: 4,
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Announcement sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              No opportunities available right now
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Check back later for new interview listings, tests, and hackathons
            </Typography>
          </Paper>
        ) : filteredForms.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 4,
              textAlign: 'center',
              mt: 4,
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Announcement sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              No {formTypeConfig[formTypeFilter]?.label || ''} opportunities found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Try selecting a different category or check back later
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setFormTypeFilter('all')}
              sx={{ mt: 2 }}
            >
              Show All Opportunities
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredForms.map((form) => (
              <Grid item xs={12} sm={6} md={4} key={form._id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: form.status === 'active' ? 'translateY(-4px)' : 'none',
                      boxShadow: form.status === 'active' ? 6 : 'none'
                    },
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: form.status === 'active' ? 'white' : 'rgba(0, 0, 0, 0.05)',
                    opacity: form.status === 'active' ? 1 : 0.7,
                    position: 'relative',
                    cursor: form.status === 'closed' && "not-allowed"
                  }}
                >
                  {form.status === 'closed' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        py: 0.5,
                        px: 2,
                        borderRadius: 1,
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        width: '80%',
                        textAlign: 'center'
                      }}
                    >
                      Closed
                    </Box>
                  )}

                  {/* Card Header with form type */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: form.status === 'active'
                        ? (formTypeConfig[form.formType]?.bgColor || 'rgba(0,0,0,0.05)')
                        : 'rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box sx={{
                      color: form.status === 'active'
                        ? (formTypeConfig[form.formType]?.color || 'primary.main')
                        : 'text.disabled'
                    }}>
                      {formTypeConfig[form.formType]?.icon || <Announcement />}
                    </Box>
                    <Chip
                      label={formTypeConfig[form.formType]?.label || form.formType}
                      size="small"
                      sx={{
                        bgcolor: form.status === 'active'
                          ? (formTypeConfig[form.formType]?.color || 'primary.main')
                          : 'grey.500',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    <Box sx={{ ml: 'auto' }}>
                      <Typography variant="caption" sx={{
                        color: form.status === 'active' ? 'text.secondary' : 'text.disabled'
                      }}>
                        Posted on {formatDate(form.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    color: form.status === 'active' ? 'inherit' : 'text.disabled'
                  }}>
                    <Typography variant="h5" component="h2" sx={{
                      fontWeight: 600,
                      color: form.status === 'active' ? 'inherit' : 'text.disabled'
                    }}>
                      {form.title}
                    </Typography>

                    {/* Company/Organization */}
                    {form.companyName && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Business fontSize="small" color={form.status === 'active' ? 'action' : 'disabled'} />
                        <Typography variant="body2" color={form.status === 'active' ? 'inherit' : 'text.disabled'}>
                          {form.companyName}
                        </Typography>
                      </Box>
                    )}

                    {/* Location for interviews */}
                    {form.formType === 'interview' && form.location && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color={form.status === 'active' ? 'action' : 'disabled'} />
                        <Typography variant="body2" color={form.status === 'active' ? 'inherit' : 'text.disabled'}>
                          {form.location}
                        </Typography>
                      </Box>
                    )}

                    {/* Test time/location for tests */}
                    {form.formType === 'test' && form.testTimeLocation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color={form.status === 'active' ? 'action' : 'disabled'} />
                        <Typography variant="body2" color={form.status === 'active' ? 'inherit' : 'text.disabled'}>
                          {form.testTimeLocation}
                        </Typography>
                      </Box>
                    )}

                    {/* Hackathon venue */}
                    {form.formType === 'hackathon' && form.hackathonPlace && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn fontSize="small" color={form.status === 'active' ? 'action' : 'disabled'} />
                        <Typography variant="body2" color={form.status === 'active' ? 'inherit' : 'text.disabled'}>
                          {form.hackathonPlace}
                        </Typography>
                      </Box>
                    )}

                    {/* Description preview */}
                    {form.description && (
                      <Typography
                        variant="body2"
                        color={form.status === 'active' ? 'text.secondary' : 'text.disabled'}
                        sx={{
                          mt: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {form.description}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    {form.status === 'active' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<ArrowForward />}
                        href={`/form/${form._id}`}
                        sx={{
                          borderRadius: 6,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        disabled
                        size="small"
                        sx={{
                          borderRadius: 6,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Opportunity Closed
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Home;