import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Container,
  Chip,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  List,
  ListItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import DoDisturbOffIcon from '@mui/icons-material/DoDisturbOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { format } from 'date-fns';

const NotificationForm = () => {
  const [notifyTo, setNotifyTo] = useState('specific');
  const [department, setDepartment] = useState('all');
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [notifications, setNotifications] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    setIsNotificationsLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/notifications`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")?.trim()}`,
          "x-admin-id": localStorage.getItem("userId")?.trim()
        }
      });
      console.log("Notifications loaded:", data);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setSnackbar({
        open: true,
        message: 'Failed to load notification history',
        severity: 'error'
      });
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      to: notifyTo,
      department: notifyTo === 'all' ? department : null,
      emails: notifyTo === 'specific' ? emails.split(',').map(email => email.trim()) : null,
      message,
      subject
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}api/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")?.trim()}`,
          "x-admin-id": localStorage.getItem("userId")?.trim()
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Notifications sent successfully!',
          severity: 'success'
        });
        // Clear form after successful submission
        if (notifyTo === 'specific') setEmails('');
        setMessage('');
        setSubject('');

        // Refresh the notification list
        fetchNotifications();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to send notifications',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setSnackbar({
        open: true,
        message: 'Error connecting to server',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (notification) => {
    setSelectedNotification(notification);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNotification) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}api/notifications/${selectedNotification._id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")?.trim()}`,
          "x-admin-id": localStorage.getItem("userId")?.trim()
        }
      });

      setNotifications(notifications.filter(n => n._id !== selectedNotification._id));
      setSnackbar({
        open: true,
        message: 'Notification deleted successfully',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
      setSelectedNotification(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete notification',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Convert comma-separated emails into chips for display
  const emailList = emails.split(',').filter(email => email.trim() !== '');

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Notifications History Panel */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'primary.light',
                color: 'white'
              }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                  Notification History
                </Typography>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchNotifications} size="small" color="inherit">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider />

              <Box sx={{ overflow: 'auto', flexGrow: 1, maxHeight: '70vh', padding: 1 }}>
                {isNotificationsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : notifications.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <DoDisturbOffIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No notifications sent yet
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {notifications.map((notification) => (
                      <ListItem
                        key={notification._id}
                        divider
                        sx={{
                          transition: 'background-color 0.2s',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1
                              }}
                            >
                              {notification.subject || 'No Subject'}
                            </Typography>
                            <Tooltip title="Delete">
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => handleDeleteClick(notification)}
                                sx={{ ml: 1 }}
                              >
                                <DeleteIcon fontSize="small" color="error" />
                              </IconButton>
                            </Tooltip>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {notification.message}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(notification.createdAt)}
                            </Typography>

                            <Tooltip title={notification.notificationType === 'all' ? 'Sent to all students' : 'Sent to specific students'}>
                              <Chip
                                icon={notification.notificationType === 'all' ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                                label={notification.notificationType === 'all' ? 'All' :
                                  `${notification.emails?.length || 0} recipient${notification.emails?.length !== 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                                sx={{ height: 24 }}
                              />
                            </Tooltip>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Notification Form Panel */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsActiveIcon sx={{ fontSize: 36, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Send Notifications
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={notifyTo === 'all' ? 6 : 12}>
                    <FormControl fullWidth>
                      <InputLabel id="notify-select-label">Recipients</InputLabel>
                      <Select
                        labelId="notify-select-label"
                        value={notifyTo}
                        label="Recipients"
                        onChange={(e) => {
                          setNotifyTo(e.target.value);
                          // Reset department to 'all' when switching recipient types
                          if (e.target.value === 'all') {
                            setDepartment('all');
                          }
                        }}
                        startAdornment={
                          notifyTo === 'all' ?
                            <GroupIcon sx={{ mr: 1, color: '#1976d2' }} /> :
                            <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                        }
                      >
                        <MenuItem value="all">All Students</MenuItem>
                        <MenuItem value="specific">Specific Students</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {notifyTo === 'all' && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel id="department-select-label">Department</InputLabel>
                        <Select
                          labelId="department-select-label"
                          value={department}
                          label="Department"
                          onChange={(e) => setDepartment(e.target.value)}
                          startAdornment={
                            <SchoolIcon sx={{ mr: 1, color: '#1976d2' }} />
                          }
                        >
                          <MenuItem value="all">All Departments</MenuItem>
                          <MenuItem value="Computer Science and Engineering">Computer Science and Engineering</MenuItem>
                          <MenuItem value="Information Technology">Information Technology</MenuItem>
                          <MenuItem value="Electronics & Communication Engineering">Electronics & Communication Engineering</MenuItem>
                          <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    helperText="Enter Subject for the email."
                  />
                </Box>

                {notifyTo === 'specific' && (
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Email Addresses"
                      variant="outlined"
                      placeholder="Enter comma-separated email addresses"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (emails.trim() && !emails.endsWith(',')) {
                            setEmails(emails + ',');
                          }
                        }
                      }}
                      helperText="Enter comma-separated email addresses (e.g., student1@example.com, student2@example.com)"
                    />

                    {emailList.length > 0 && (
                      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {emailList.map((email, index) => (
                          <Chip
                            key={index}
                            label={email.trim()}
                            color="primary"
                            variant="outlined"
                            onDelete={() => {
                              const updatedEmails = emailList.filter((_, i) => i !== index);
                              setEmails(updatedEmails.join(', '));
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Notification Message"
                  placeholder="Write your notification message here..."
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 3 }}
                  required
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isLoading || message.trim() === '' || (notifyTo === 'specific' && emailList.length === 0)}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <NotificationsActiveIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
                    }}
                  >
                    {isLoading ? 'Sending...' : 'Send Notification'}
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationForm;