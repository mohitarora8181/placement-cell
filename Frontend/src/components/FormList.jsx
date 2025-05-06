import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Chip,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    MenuItem,
    Menu,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    FormControl,
    InputLabel,
    Select,
    FormGroup,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Close as CloseIcon,
    Visibility as VisibilityIcon,
    Business as BusinessIcon,
    Code as CodeIcon,
    QuestionAnswer as TestIcon,
    Announcement as AnnouncementIcon,
    Place as PlaceIcon,
    Schedule as ScheduleIcon,
    Link as LinkIcon,
    Description as DescriptionIcon,
    Group as GroupIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    CurrencyRupeeSharp,
    People,
    OpenInNew
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import TableListUi from './TableListUi';
import * as XLSX from 'xlsx';

// Form type icons and colors
const formTypeConfig = {
    interview: {
        icon: <BusinessIcon />,
        color: '#3f51b5',
        label: 'Interview',
        bgColor: 'rgba(63, 81, 181, 0.1)'
    },
    hackathon: {
        icon: <CodeIcon />,
        color: '#f50057',
        label: 'Hackathon',
        bgColor: 'rgba(245, 0, 87, 0.1)'
    },
    test: {
        icon: <TestIcon />,
        color: '#ff9800',
        label: 'Test',
        bgColor: 'rgba(255, 152, 0, 0.1)'
    },
    general: {
        icon: <AnnouncementIcon />,
        color: '#4caf50',
        label: 'General',
        bgColor: 'rgba(76, 175, 80, 0.1)'
    }
};

const FormList = ({ forms, refreshForms, filterFields }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedForm, setSelectedForm] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('view'); // 'view', 'delete'
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [studentsList, setStudentsList] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const handleMenuClick = (event, form) => {
        setAnchorEl(event.currentTarget);
        setSelectedForm(form);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewForm = () => {
        setDialogType('view');
        setOpenDialog(true);
        handleMenuClose();
        fetchStudentDetails();
    };

    const handleDeleteClick = () => {
        setDialogType('delete');
        setOpenDialog(true);
        handleMenuClose();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedForm(null);
        setIsEditing(false);
        setEditFormData(null);
        setErrors({});
    };

    const handleDeleteForm = async () => {
        try {
            setLoading(true);
            await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}api/forms`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()
                    },
                    data: {
                        id: selectedForm._id
                    }
                }
            );
            handleCloseDialog();
            if (refreshForms) refreshForms();
        } catch (error) {
            console.error('Error deleting form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseForm = async () => {
        try {
            setLoading(true);
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}api/forms/${selectedForm._id}/`,
                { status: 'closed' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()
                    }
                }
            );
            handleMenuClose();
            if (refreshForms) refreshForms();
        } catch (error) {
            console.error('Error closing form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = async () => {
        try {
            setLoading(true);
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}api/forms/${selectedForm._id}/`,
                { status: 'active' },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()

                    }
                }
            );
            handleMenuClose();
            if (refreshForms) refreshForms();
        } catch (error) {
            console.error('Error opening form:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // Get audience label
    const getAudienceLabel = (form) => {
        if (form.targetAudience === 'all') {
            return 'All students';
        } else if (form.departments && form.departments.length > 0) {
            return `${form.departments.join(', ')}`;
        }
        return 'Specific departments';
    };

    // Enable edit mode
    const handleEnableEdit = () => {
        setIsEditing(true);
        setEditFormData({
            ...selectedForm,
            audienceType: selectedForm.targetAudience,
            selectedDepartments: selectedForm.departments || []
        });
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData(null);
        setErrors({});
    };

    // Handle edit form data changes
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
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

    // Handle department change for edit mode
    const handleEditDepartmentChange = (event) => {
        const { value } = event.target;
        setEditFormData({
            ...editFormData,
            selectedDepartments: typeof value === 'string' ? value.split(',') : value,
        });
    };

    // Validate edit form
    const validateEditForm = () => {
        const newErrors = {};

        if (!editFormData.title?.trim()) {
            newErrors.title = 'Title is required';
        }

        // Validate form-type specific fields
        if (editFormData.formType === 'interview') {
            if (!editFormData.companyName?.trim()) newErrors.companyName = 'Company name is required';
        }

        if (editFormData.formType === 'hackathon') {
            if (!editFormData.companyName?.trim()) newErrors.companyName = 'Company name is required';
            if (!editFormData.hackathonPlace?.trim()) newErrors.hackathonPlace = 'Venue is required';
        }

        if (editFormData.formType === 'test') {
            if (!editFormData.testName?.trim()) newErrors.testName = 'Test name is required';
            if (!editFormData.testTimeLocation?.trim()) newErrors.testTimeLocation = 'Time and location are required';
        }

        // Target Students validation
        if (editFormData.audienceType === 'specific') {
            if (!editFormData.selectedDepartments?.length) {
                newErrors.selectedDepartments = 'Please select at least one department';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchStudentDetails = async () => {
        try {
            const formId = selectedForm._id;
            setLoadingStudents(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}api/forms/${formId}/students`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()
                    }
                }
            );
            setStudentsList(response.data.students || []);
        } catch (error) {
            console.error('Error fetching student details:', error);
            setStudentsList([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    // Save edited form
    const handleSaveEdit = async () => {
        if (!validateEditForm()) return;

        setLoading(true);
        try {
            // Prepare the data to be sent
            const payload = {
                title: editFormData.title,
                description: editFormData.description,
                targetAudience: editFormData.audienceType,
                departments: editFormData.audienceType === 'specific' ? editFormData.selectedDepartments : []
            };

            // Add type-specific fields
            if (editFormData.formType === 'interview') {
                payload.companyName = editFormData.companyName;
                payload.jobDescription = editFormData.jobDescription;
                payload.salaryPackage = editFormData.salaryPackage;
                payload.location = editFormData.location;
            } else if (editFormData.formType === 'hackathon') {
                payload.companyName = editFormData.companyName;
                payload.hackathonPlace = editFormData.hackathonPlace;
            } else if (editFormData.formType === 'test') {
                payload.testName = editFormData.testName;
                payload.testTimeLocation = editFormData.testTimeLocation;
                payload.testLink = editFormData.testLink;
            }

            // Update the form
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}api/forms/${selectedForm._id}`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')?.trim()}`,
                        "x-admin-id": localStorage.getItem("userId")?.trim()
                    }
                }
            );

            // Update the selected form with the response data
            setSelectedForm(response.data);
            setIsEditing(false);
            setEditFormData(null);

            // Refresh the forms list
            if (refreshForms) refreshForms();

        } catch (error) {
            console.error('Error updating form:', error);
            setErrors({
                ...errors,
                apiError: error.response?.data?.message || 'Failed to update form. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const format_DOB_Date = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00.000Z") return "---";
        return new Date(dateString).toLocaleDateString();
    };

    const downloadExcel = () => {
        if (!studentsList.length) return;
        const worksheet = XLSX.utils.json_to_sheet(
            studentsList.map(student => {
                const isValid = v => v && v !== "0" && v !== 0;

                return {
                    'Enrollment Number': student.enrollmentNumber || '---',
                    'Name': student.fullname || '---',
                    'D.O.B.': format_DOB_Date(student.dob) || '---',
                    'Email': student.email || '---',
                    'Contact': isValid(student.contactNumber) ? student.contactNumber : '---',
                    'Degree': student.degree || '---',
                    'Course': student.course || '---',
                    'Class': isValid(student.classes) ? student.classes : '---',
                    'CGPA': isValid(student.cgpa) ? student.cgpa : '---',
                    '10th %': isValid(student.tenthPercentage) ? student.tenthPercentage : '---',
                    '12th %': isValid(student.twelfthPercentage) ? student.twelfthPercentage : '---',
                    'Diploma %': isValid(student.diplomaPercentage) ? student.diplomaPercentage : '---',
                    'Year of Passing': isValid(student.yearOfPassing) ? student.yearOfPassing : '---',
                    'Active Backlogs': isValid(student.activeBacklogs) ? student.activeBacklogs : '0',
                    'Resume': isValid(student.resumeURL) ? student.resumeURL : '---',
                    'LinkedIn': isValid(student.linkedin) ? student.linkedin : '---',
                    'GitHub': isValid(student.github) ? student.github : '---',
                    'LeetCode': isValid(student.leetCode) ? student.leetCode : '---'
                };
            })
        );

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const address = XLSX.utils.encode_col(C) + '1';
            if (!worksheet[address]) continue;
            worksheet[address].s = { font: { bold: true } };
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
        const filename = `${selectedForm.title.replace(/[^\w]/g, '_')}_applicants.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer component={Paper} elevation={2}>
                <Table aria-label="forms table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Target Students</TableCell>
                            <TableCell>Submissions</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {forms.map((form) => (
                            <TableRow key={form._id} hover>
                                <TableCell>
                                    <Chip
                                        icon={formTypeConfig[form.formType]?.icon}
                                        label={formTypeConfig[form.formType]?.label || form.formType}
                                        sx={{
                                            bgcolor: formTypeConfig[form.formType]?.bgColor,
                                            color: formTypeConfig[form.formType]?.color,
                                            '& .MuiChip-icon': {
                                                color: formTypeConfig[form.formType]?.color
                                            }
                                        }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{form.title}</TableCell>
                                <TableCell>
                                    <Tooltip title={getAudienceLabel(form)}>
                                        <Chip
                                            icon={<GroupIcon />}
                                            label={form.targetAudience === 'all' ? 'All' : 'Specific'}
                                            size="small"
                                            sx={{ bgcolor: form.targetAudience === 'all' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }}
                                        />
                                    </Tooltip>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={form.interestedStudents ? form.interestedStudents.length : 0}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(25, 118, 210, 0.1)'
                                        }}
                                    />
                                </TableCell>

                                <TableCell>{formatDate(form.createdAt)}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={form.status}
                                        size="small"
                                        color={form.status === 'active' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        aria-label="more"
                                        aria-controls="form-menu"
                                        aria-haspopup="true"
                                        onClick={(e) => handleMenuClick(e, form)}
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {forms.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body1" sx={{ py: 2 }}>
                                        No forms found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Form Menu */}
            <Menu
                id="form-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewForm}>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                {selectedForm && selectedForm.status === 'active' && (
                    <MenuItem onClick={handleCloseForm}>
                        <CloseIcon fontSize="small" sx={{ mr: 1 }} />
                        Close Form
                    </MenuItem>
                )}
                {selectedForm && selectedForm.status === 'closed' && (
                    <MenuItem onClick={handleOpenForm}>
                        <AnnouncementIcon fontSize="small" sx={{ mr: 1 }} color="success" />
                        Open Form
                    </MenuItem>
                )}
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* View/Delete Dialog */}
            <Dialog
                id='view_form_dialog'
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth={dialogType === 'view' ? 'md' : 'xs'}
                fullWidth
            >
                {dialogType === 'view' && selectedForm && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box display="flex" alignItems="center">
                                {formTypeConfig[selectedForm.formType]?.icon && (
                                    <Box sx={{ mr: 1, color: formTypeConfig[selectedForm.formType]?.color }}>
                                        {formTypeConfig[selectedForm.formType].icon}
                                    </Box>
                                )}
                                <Typography variant="h6">{selectedForm.title}</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Chip
                                    label={selectedForm.status}
                                    color={selectedForm.status === 'active' ? 'success' : 'default'}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                {selectedForm.status === 'active' && !isEditing && (
                                    <IconButton size="small" onClick={handleEnableEdit} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Box>
                        </DialogTitle>
                        <DialogContent dividers>
                            {errors.apiError && (
                                <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
                                    <Typography color="white">{errors.apiError}</Typography>
                                </Box>
                            )}

                            {isEditing ? (
                                <Grid container spacing={2}>
                                    {/* Edit Mode Content */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Form Title
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            name="title"
                                            value={editFormData.title || ''}
                                            onChange={handleEditInputChange}
                                            required
                                            error={!!errors.title}
                                            helperText={errors.title}
                                        />
                                    </Grid>

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
                                                            checked={editFormData.audienceType === 'all'}
                                                            onChange={() => setEditFormData({ ...editFormData, audienceType: 'all' })}
                                                        />
                                                    }
                                                    label="All Students"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={editFormData.audienceType === 'specific'}
                                                            onChange={() => setEditFormData({ ...editFormData, audienceType: 'specific' })}
                                                        />
                                                    }
                                                    label="Specific Departments"
                                                />
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>

                                    {editFormData.audienceType === 'specific' && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <FormControl fullWidth error={!!errors.selectedDepartments}>
                                                    <InputLabel>Departments</InputLabel>
                                                    <Select
                                                        multiple
                                                        name="selectedDepartments"
                                                        value={editFormData.selectedDepartments}
                                                        onChange={handleEditDepartmentChange}
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
                                                                <Checkbox checked={editFormData.selectedDepartments.indexOf(department) > -1} />
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
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Form Details
                                        </Typography>
                                    </Grid>

                                    {/* Common Description Field */}
                                    {editFormData.formType !== 'interview' && <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={editFormData.description || ''}
                                            onChange={handleEditInputChange}
                                            multiline
                                            rows={3}
                                        />
                                    </Grid>}

                                    {/* Interview specific fields */}
                                    {editFormData.formType === 'interview' && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Company Name"
                                                    name="companyName"
                                                    value={editFormData.companyName || ''}
                                                    onChange={handleEditInputChange}
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
                                                    value={editFormData.salaryPackage || ''}
                                                    onChange={handleEditInputChange}
                                                />
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Location"
                                                    name="location"
                                                    value={editFormData.location || ''}
                                                    onChange={handleEditInputChange}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Job Description"
                                                    name="jobDescription"
                                                    value={editFormData.jobDescription || ''}
                                                    onChange={handleEditInputChange}
                                                    multiline
                                                    rows={3}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    {/* Hackathon specific fields */}
                                    {editFormData.formType === 'hackathon' && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Company/Organizer Name"
                                                    name="companyName"
                                                    value={editFormData.companyName || ''}
                                                    onChange={handleEditInputChange}
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
                                                    value={editFormData.hackathonPlace || ''}
                                                    onChange={handleEditInputChange}
                                                    required
                                                    error={!!errors.hackathonPlace}
                                                    helperText={errors.hackathonPlace}
                                                />
                                            </Grid>
                                        </>
                                    )}

                                    {/* Test specific fields */}
                                    {editFormData.formType === 'test' && (
                                        <>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Test Name"
                                                    name="testName"
                                                    value={editFormData.testName || ''}
                                                    onChange={handleEditInputChange}
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
                                                    value={editFormData.testTimeLocation || ''}
                                                    onChange={handleEditInputChange}
                                                    required
                                                    error={!!errors.testTimeLocation}
                                                    helperText={errors.testTimeLocation}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Test Link (if available)"
                                                    name="testLink"
                                                    value={editFormData.testLink || ''}
                                                    onChange={handleEditInputChange}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    {/* View Mode Content */}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="subtitle1">Target Students:</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                            {getAudienceLabel(selectedForm)}
                                        </Typography>
                                    </Grid>

                                    {selectedForm.description && (
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="subtitle1">Description:</Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, whiteSpace: 'pre-line' }}>
                                                {selectedForm.description}
                                            </Typography>
                                        </Grid>
                                    )}

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    {/* Interview specific fields */}
                                    {selectedForm.formType === 'interview' && (
                                        <>
                                            {selectedForm.companyName && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Company:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.companyName}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.location && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PlaceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Location:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.location}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.salaryPackage && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <CurrencyRupeeSharp sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Salary/Stipend:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.salaryPackage}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.jobDescription && (
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Job Description:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4, whiteSpace: 'pre-line' }}>
                                                        {selectedForm.jobDescription}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </>
                                    )}

                                    {/* Hackathon specific fields */}
                                    {selectedForm.formType === 'hackathon' && (
                                        <>
                                            {selectedForm.companyName && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Organizer:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.companyName}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.hackathonPlace && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <PlaceIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Venue:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.hackathonPlace}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </>
                                    )}

                                    {/* Test specific fields */}
                                    {selectedForm.formType === 'test' && (
                                        <>
                                            {selectedForm.testName && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <TestIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Test Name:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.testName}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.testTimeLocation && (
                                                <Grid item xs={12} sm={6}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Time & Location:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        {selectedForm.testTimeLocation}
                                                    </Typography>
                                                </Grid>
                                            )}

                                            {selectedForm.testLink && (
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                                        <Typography variant="subtitle1">Test Link:</Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                                        <a href={selectedForm.testLink} target="_blank" rel="noopener noreferrer">
                                                            {selectedForm.testLink}
                                                        </a>
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </>
                                    )}

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                    </Grid>

                                    {loadingStudents ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : studentsList.length > 0 ? (
                                        <Box sx={{ width: '100%', mt: 2, pl: 2 }}>
                                            <Typography variant="h6" sx={{ mb: 2 }}>
                                                Applicants ({studentsList.length})
                                            </Typography>
                                            <TableListUi items={studentsList} />
                                            {studentsList.length > 0 &&
                                                <p className='text-sm py-5 cursor-pointer hover:underline-offset-2 underline'
                                                    onClick={downloadExcel}>Download Excel file for this data
                                                </p>}

                                        </Box>
                                    ) : (
                                        <div className='w-full flex justify-center'>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                                                <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary">
                                                    No applicants yet
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    When students apply for this opportunity, they will appear here.
                                                </Typography>
                                            </Box>
                                        </div>
                                    )}

                                    <Grid item xs={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Created: {formatDate(selectedForm.createdAt)}
                                        </Typography>
                                        <br />
                                        <Typography variant="caption" color="text.secondary">
                                            Last updated: {formatDate(selectedForm.updatedAt)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </DialogContent>
                        <DialogActions>
                            {isEditing ? (
                                <>
                                    <Button onClick={handleCancelEdit} color="inherit" disabled={loading}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSaveEdit}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={handleCloseDialog} color="primary">
                                    Close
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}

                {dialogType === 'delete' && (
                    <>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete this form? This action cannot be undone.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary" disabled={loading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteForm}
                                color="error"
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default FormList;