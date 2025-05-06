import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid,
    Divider,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const formTypes = [
    { value: 'interview', label: 'Interview' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'test', label: 'Test' },
    { value: 'general', label: 'General Form' }
];

const FormCreator = ({ filterFields }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        formType: '',
        title: '',
        description: '',
        // Interview specific fields
        companyName: '',
        jobDescription: '',
        salaryPackage: '',
        location: '',
        // Hackathon specific fields
        hackathonPlace: '',
        // Test specific fields
        testName: '',
        testTimeLocation: '',
        testLink: '',
        // Target audience fields
        audienceType: 'all', // 'all' or 'specific'
        selectedDepartments: [],
    });

    const [errors, setErrors] = useState({});

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        // Reset form data and errors when closing
        setFormData({
            formType: '',
            title: '',
            description: '',
            companyName: '',
            jobDescription: '',
            salaryPackage: '',
            location: '',
            hackathonPlace: '',
            testName: '',
            testTimeLocation: '',
            testLink: '',
            audienceType: 'all',
            selectedDepartments: [],
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleDepartmentChange = (event) => {
        const { value } = event.target;
        setFormData({
            ...formData,
            selectedDepartments: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.formType) newErrors.formType = 'Form type is required';

        // Type specific validations
        if (formData.formType === 'interview') {
            if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        }

        if (formData.formType === 'hackathon') {
            if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
            if (!formData.hackathonPlace.trim()) newErrors.hackathonPlace = 'Venue is required';
        }

        if (formData.formType === 'test') {
            if (!formData.testName.trim()) newErrors.testName = 'Test name is required';
            if (!formData.testTimeLocation.trim()) newErrors.testTimeLocation = 'Time and location are required';
        }

        if (formData.formType === 'general') {
            if (!formData.title?.trim()) newErrors.title = 'Title is required';
        }

        // Target audience validation
        if (formData.audienceType === 'specific') {
            if (formData.selectedDepartments.length === 0) {
                newErrors.selectedDepartments = 'Please select at least one department';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Generate title based on form type
            let title;
            switch (formData.formType) {
                case 'interview':
                    title = `${formData.companyName} Interview`;
                    break;
                case 'hackathon':
                    title = `${formData.companyName} Hackathon`;
                    break;
                case 'test':
                    title = formData.testName;
                    break;
                case 'general':
                    title = formData.title || 'General Announcement';
                    break;
                default:
                    title = 'New Form';
            }

            // Prepare the data to be sent
            const payload = {
                title,
                description: formData.description,
                formType: formData.formType,
                targetAudience: formData.audienceType === 'all' ? 'all' : 'specific',
                departments: formData.audienceType === 'specific' ? formData.selectedDepartments : [],
            };

            // Add type-specific fields
            if (formData.formType === 'interview') {
                payload.companyName = formData.companyName;
                payload.jobDescription = formData.jobDescription;
                payload.salaryPackage = formData.salaryPackage;
                payload.location = formData.location;
            } else if (formData.formType === 'hackathon') {
                payload.companyName = formData.companyName;
                payload.hackathonPlace = formData.hackathonPlace;
            } else if (formData.formType === 'test') {
                payload.testName = formData.testName;
                payload.testTimeLocation = formData.testTimeLocation;
                payload.testLink = formData.testLink;
            }

            // Make API call
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}api/forms/create`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()
                    }
                }
            );

            console.log('Form created:', response.data);

            // Close the dialog and reset form
            handleClose();

            // You might want to trigger a refresh of the forms list here
            window.location.reload();

        } catch (error) {
            console.error('Error creating form:', error);

            // Handle API errors
            if (error.response && error.response.data) {
                setErrors({
                    ...errors,
                    apiError: error.response.data.message || 'Failed to create form. Please try again.'
                });
            } else {
                setErrors({
                    ...errors,
                    apiError: 'Network error. Please check your connection and try again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <div className='w-full flex justify-end'>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    sx={{ mb: 3 }}
                >
                    Create Form
                </Button>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Create New Form</Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    {errors.apiError && (
                        <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                            <Typography color="white">{errors.apiError}</Typography>
                        </Box>
                    )}

                    <Grid container spacing={3}>
                        {/* Basic Information Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Basic Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth required error={!!errors.formType}>
                                <InputLabel>Form Type</InputLabel>
                                <Select
                                    name="formType"
                                    value={formData.formType}
                                    onChange={handleInputChange}
                                    label="Form Type"
                                >
                                    {formTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.formType && (
                                    <Typography variant="caption" color="error">
                                        {errors.formType}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Target Students Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Target Students
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.audienceType === 'all'}
                                                onChange={() => setFormData({ ...formData, audienceType: 'all' })}
                                            />
                                        }
                                        label="All Students"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.audienceType === 'specific'}
                                                onChange={() => setFormData({ ...formData, audienceType: 'specific' })}
                                            />
                                        }
                                        label="Specific Departments"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>

                        {formData.audienceType === 'specific' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth error={!!errors.selectedDepartments}>
                                        <InputLabel>Departments</InputLabel>
                                        <Select
                                            multiple
                                            name="selectedDepartments"
                                            value={formData.selectedDepartments}
                                            onChange={handleDepartmentChange}
                                            label="Departments"
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {filterFields?.course?.map((department) => (
                                                <MenuItem key={department} value={department}>
                                                    <Checkbox checked={formData.selectedDepartments.indexOf(department) > -1} />
                                                    {department}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.selectedDepartments && (
                                            <Typography variant="caption" color="error">
                                                {errors.selectedDepartments}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Form Type Specific Fields */}
                        {formData.formType && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {formData.formType === 'interview' ? 'Interview Details' :
                                        formData.formType === 'hackathon' ? 'Hackathon Details' :
                                            formData.formType === 'test' ? 'Test Details' : 'General Form Details'}
                                </Typography>
                            </Grid>
                        )}

                        {/* Interview Fields */}
                        {formData.formType === 'interview' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.companyName}
                                        helperText={errors.companyName}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Salary/Stipend"
                                        name="salaryPackage"
                                        value={formData.salaryPackage}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Job Description"
                                        name="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Hackathon Fields */}
                        {formData.formType === 'hackathon' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company/Organizer Name"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.companyName}
                                        helperText={errors.companyName}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Venue"
                                        name="hackathonPlace"
                                        value={formData.hackathonPlace}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.hackathonPlace}
                                        helperText={errors.hackathonPlace}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Test Fields */}
                        {formData.formType === 'test' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Test Name"
                                        name="testName"
                                        value={formData.testName}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.testName}
                                        helperText={errors.testName}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Test Time & Location"
                                        name="testTimeLocation"
                                        value={formData.testTimeLocation}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.testTimeLocation}
                                        helperText={errors.testTimeLocation}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Test Link (if available)"
                                        name="testLink"
                                        value={formData.testLink}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                            </>
                        )}

                        {/* General Form Fields */}
                        {formData.formType === 'general' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        name="title"
                                        value={formData.title || ''}
                                        onChange={handleInputChange}
                                        required
                                        error={!!errors.title}
                                        helperText={errors.title}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit" disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    >
                        {loading ? 'Creating...' : 'Create Form'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FormCreator;